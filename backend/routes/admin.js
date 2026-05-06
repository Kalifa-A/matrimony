const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Interest = require('../models/Interest');
const SuccessStory = require('../models/SuccessStory');
// ── Simple admin-secret guard for setup only ──────────────────────────────────────────────
function adminOnly(req, res, next) {
  const secret = req.headers['x-admin-secret'];
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
}
// Accepts JWT ONLY from Bearer header for cross-domain stability
function authenticateAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

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
// Run this once manually via Postman or Curl to create the first admin.
// Requires x-admin-secret header.
router.post('/setup-root', adminOnly, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    const existing = await Admin.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(400).json({ message: 'Admin already exists.' });

    const salt = await bcrypt.genSalt(10);
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

    res.json({ 
      message: 'Admin login successful.', 
      admin: { username: admin.username, role: admin.role || 'admin' },
      token 
    });
  } catch (err) {
    console.error('Admin login error:', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── GET /api/admin/users  (with optional ?phone= search) ──────────────────
router.get('/users', authenticateAdmin, async (req, res) => {
  try {
    let query = {};
    if (req.query.phone) {
      query.phone = { $regex: req.query.phone, $options: 'i' };
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

    res.json({
      totalUsers,
      pendingVerifications,
      totalInterests,
      mutualMatches,
      successStories
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
    const { username, email, password } = req.body;
    const admin = await Admin.findOne();
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    if (username) admin.username = username;
    if (email) admin.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
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

module.exports = router;
