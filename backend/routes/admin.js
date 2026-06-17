const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Interest = require('../models/Interest');
const SuccessStory = require('../models/SuccessStory');
const Message = require('../models/Message');
const { setAuthCookie, removeAuthCookie } = require('../utils/auth-cookies');
// ── Simple admin-secret guard for setup only ──────────────────────────────────────────────
// One-time setup token logic
const crypto = require('crypto');
const setupTokens = new Map();
function generateSetupToken() {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 30 * 60 * 1000; // 30 min
  setupTokens.set(token, expiresAt);
  return token;
}
function validateSetupToken(token) {
  if (!setupTokens.has(token)) return false;
  const expiresAt = setupTokens.get(token);
  if (Date.now() > expiresAt) {
    setupTokens.delete(token);
    return false;
  }
  setupTokens.delete(token);
  return true;
}

// Endpoint to generate setup token (protect with deployment secret)
router.post('/generate-setup-token', (req, res) => {
  const deploymentSecret = req.headers['x-deployment-secret'];
  if (!deploymentSecret || deploymentSecret !== process.env.DEPLOYMENT_SECRET) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const token = generateSetupToken();
  res.json({ setupToken: token, expiresIn: '30 minutes' });
});
// Accepts JWT ONLY from Bearer header for cross-domain stability
function authenticateAdmin(req, res, next) {
  // 1. Try to get token from cookies first
  let token = req.cookies?.admin_token;

  // 2. Fallback to Authorization header
  if (!token) {
    const authHeader = req.headers['authorization'];
    token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  }

  if (!token) return res.status(401).json({ message: 'Admin access denied. Please log in.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Note: The role check should match your JWT payload (superadmin or admin)
    if (decoded.role !== 'superadmin' && decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Insufficient permissions.' });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid admin token.' });
  }
}

// ── POST /api/admin/setup-root ─────────────────────────────────────────────
// Secure root admin setup with one-time token
router.post('/setup-root', async (req, res) => {
  try {
    const { username, email, password, setupToken } = req.body;
    if (!setupToken || !validateSetupToken(setupToken)) {
      return res.status(403).json({ message: 'Invalid or expired setup token' });
    }
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    if (password.length < 12) {
      return res.status(400).json({ message: 'Password must be at least 12 characters.' });
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: 'Password must contain uppercase, lowercase, number, and special char' });
    }
    const existing = await Admin.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(400).json({ message: 'Admin already exists.' });
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    const admin = new Admin({
      username,
      email,
      password: hashedPassword,
      role: 'superadmin'
    });
    await admin.save();
    res.status(201).json({ message: 'Root admin created successfully.', admin: { username, email } });
  } catch (err) {
    console.error('Admin setup error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── POST /api/admin/login ──────────────────────────────────────────────────
// Secure admin login with JWT authentication
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials.' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

    // Ensure JWT_SECRET is present
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not configured');
      return res.status(500).json({ message: 'Server configuration error.' });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role || 'admin', username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Set httpOnly cookie
    setAuthCookie(res, 'admin_token', token);

    res.json({ 
      message: 'Admin login successful.', 
      admin: { username: admin.username, role: admin.role || 'admin' },
      token // Still returning for legacy support
    });
  } catch (err) {
    console.error('Admin login error:', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── GET /api/admin/users  (with optional ?phone= search) ──────────────────
// Helper to escape regex
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
router.get('/users', authenticateAdmin, async (req, res) => {
  try {
    let query = {};
    if (req.query.phone) {
      query.phone = { $regex: escapeRegex(req.query.phone), $options: 'i' };
    }
    const users = await User.find(query)
      .select('-password')
      .sort({ registrationDate: -1 });
    res.json(users);
  } catch (err) {
    console.error('Admin /users error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ── PATCH /api/admin/approve/:id ──────────────────────────────────────────
router.patch('/approve/:id', authenticateAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { isAdminApproved: true } },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User approved', user });
  } catch (err) {
    console.error('Admin /approve error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ── PATCH /api/admin/revoke/:id  (undo approval) ──────────────────────────
router.patch('/revoke/:id', authenticateAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { isAdminApproved: false } },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Approval revoked', user });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// ── PATCH /api/admin/payment/:id  (toggle hasPaid) ────────────────────────
router.patch('/payment/:id', authenticateAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.hasPaid = !user.hasPaid;
    await user.save();
    res.json({ message: `Payment status set to ${user.hasPaid}`, user });
  } catch (err) {
    console.error('Admin /payment error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ── DELETE /api/admin/user/:id ────────────────────────────────────────────
router.delete('/user/:id', authenticateAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    
    // 1. Delete the User
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 2. Cascade delete: Remove all interests sent or received by this user
    await Interest.deleteMany({
      $or: [{ sender: userId }, { receiver: userId }]
    });

    // 3. Cascade delete: Remove any success stories involving this user
    await SuccessStory.deleteMany({
      $or: [{ husband: userId }, { wife: userId }]
    });

    res.json({ message: 'User and all associated data deleted successfully' });
  } catch (err) {
    console.error('Admin /delete error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ── GET /api/admin/interests ───────────────────────────────────────────
// Fetches all interests and identifies mutual interests (matches).
router.get('/interests', authenticateAdmin, async (req, res) => {
  try {
    const interests = await Interest.find()
      .populate('sender', 'name phone email gender profilePhoto isMarried')
      .populate('receiver', 'name phone email gender profilePhoto isMarried')
      .sort({ createdAt: -1 });

    // Enhance interests with mutual match status and deduplicate
    const interestMap = new Set();
    interests.forEach(i => {
      interestMap.add(`${i.sender._id}-${i.receiver._id}`);
    });

    const seenMutuals = new Set();
    const processedInterests = [];

    interests.forEach(i => {
      const isMutual = interestMap.has(`${i.receiver._id}-${i.sender._id}`);
      
      if (isMutual) {
        // Create a unique key for the pair [UserA, UserB] regardless of who sent it
        const pairKey = [i.sender._id.toString(), i.receiver._id.toString()].sort().join('_');
        
        if (!seenMutuals.has(pairKey)) {
          seenMutuals.add(pairKey);
          processedInterests.push({
            ...i.toObject(),
            isMutual: true
          });
        }
      } else {
        // Not mutual, just add it
        processedInterests.push({
          ...i.toObject(),
          isMutual: false
        });
      }
    });

    res.json(processedInterests);
  } catch (err) {
    console.error('Admin /interests error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ── GET /api/admin/stats ──────────────────────────────────────────────────
router.get('/stats', authenticateAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const pendingVerifications = await User.countDocuments({
      $or: [{ isAdminApproved: false }, { hasPaid: false }]
    });
    const totalInterests = await Interest.countDocuments();
    
    // Count mutual matches (each direction counted separately in the model)
    // We want the number of unique pairs who both sent interest.
    const interests = await Interest.find();
    const interestMap = new Set();
    interests.forEach(i => interestMap.add(`${i.sender}-${i.receiver}`));
    
    let mutualMatches = 0;
    interests.forEach(i => {
      if (interestMap.has(`${i.receiver}-${i.sender}`)) {
        mutualMatches++;
      }
    });
    // Divide by 2 because A->B and B->A are both in the list
    mutualMatches = Math.floor(mutualMatches / 2);

    const successStories = await SuccessStory.countDocuments();
    const unreadMessages = await Message.countDocuments({ isRead: false });

    res.json({
      totalUsers,
      pendingVerifications,
      totalInterests,
      mutualMatches,
      successStories,
      unreadMessages
    });
  } catch (err) {
    console.error('Admin /stats error details:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// ── GET /api/admin/profile ────────────────────────────────────────────────
router.get('/profile', authenticateAdmin, async (req, res) => {
  try {
    const admin = await Admin.findOne().select('-password');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// ── PATCH /api/admin/profile ──────────────────────────────────────────────
router.patch('/profile', authenticateAdmin, async (req, res) => {
  try {
    const { username, email, password, currentPassword } = req.body;
    const admin = await Admin.findOne();
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    if (!currentPassword) {
      return res.status(400).json({ message: 'Current password is required to verify changes.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid current password.' });
    }

    if (username) admin.username = username;
    if (email) admin.email = email;
    if (password) {
      if (password.length < 12) {
        return res.status(400).json({ message: 'New password must be at least 12 characters.' });
      }
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: 'New password must contain uppercase, lowercase, number, and special character.' });
      }
      const salt = await bcrypt.genSalt(12);
      admin.password = await bcrypt.hash(password, salt);
    }

    await admin.save();
    res.json({ message: 'Profile updated successfully', admin: { username: admin.username, email: admin.email } });
  } catch (err) {
    console.error('Admin profile update error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});



// ── PATCH /api/admin/marry ───────────────────────────────────────────────
router.patch('/marry', authenticateAdmin, async (req, res) => {
  try {
    const { husbandId, wifeId } = req.body;

    const husband = await User.findById(husbandId);
    const wife = await User.findById(wifeId);

    if (!husband || !wife) {
      return res.status(404).json({ message: 'One or both users not found' });
    }

    // Update users
    husband.isMarried = true;
    husband.partner = wifeId;
    wife.isMarried = true;
    wife.partner = husbandId;

    await husband.save();
    await wife.save();

    // Create success story
    const story = new SuccessStory({
      husband: husbandId,
      wife: wifeId
    });
    await story.save();

    res.json({ message: 'Congratulations! Couple marked as married.', story });
  } catch (err) {
    console.error('Admin /marry error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ── DELETE /api/admin/unmarry ──────────────────────────────────────────
router.delete('/unmarry', authenticateAdmin, async (req, res) => {
  try {
    const { husbandId, wifeId } = req.body;

    // 1. Reset users
    await User.updateMany(
      { _id: { $in: [husbandId, wifeId] } },
      { $set: { isMarried: false, partner: null } }
    );

    // 2. Delete SuccessStory
    await SuccessStory.findOneAndDelete({
      $or: [
        { husband: husbandId, wife: wifeId },
        { husband: wifeId, wife: husbandId }
      ]
    });

    res.json({ message: 'Marriage status undone successfully.' });
  } catch (err) {
    console.error('Admin /unmarry error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});



// ── POST /api/admin/logout ────────────────────────────────────────────────
router.post('/logout', (req, res) => {
  removeAuthCookie(res, 'admin_token');
  res.json({ message: 'Admin logged out successfully.' });
});

// ── GET /api/admin/messages ──────────────────────────────────────────────
router.get('/messages', authenticateAdmin, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error('Admin /messages error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ── PATCH /api/admin/messages/:id ─────────────────────────────────────────
router.patch('/messages/:id', authenticateAdmin, async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { $set: { isRead: true } },
      { new: true }
    );
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.json(message);
  } catch (err) {
    console.error('Admin mark-read error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ── DELETE /api/admin/messages/:id ────────────────────────────────────────
router.delete('/messages/:id', authenticateAdmin, async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    console.error('Admin delete-message error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ── POST /api/admin/subscribe ─────────────────────────────────────────────
router.post('/subscribe', authenticateAdmin, async (req, res) => {
  try {
    const subscription = req.body;
    const adminId = req.admin.id;

    // Add subscription if it doesn't exist for this admin
    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    // Check if subscription already exists (prevent duplicates)
    const exists = admin.subscriptions.some(s => s.endpoint === subscription.endpoint);
    if (!exists) {
      admin.subscriptions.push(subscription);
      await admin.save();
    }

    res.status(201).json({ message: 'Subscribed to push notifications' });
  } catch (err) {
    console.error('Subscription error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
