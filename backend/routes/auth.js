const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Message = require('../models/Message');
const upload = require('../config/cloudinary');
const jwt = require('jsonwebtoken');
const { authenticateUser } = require('../utils/auth-middleware');
const { setAuthCookie, removeAuthCookie } = require('../utils/auth-cookies');
const Joi = require('joi');
const sendEmail = require('../utils/emailService');

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  age: Joi.number().integer().min(18).max(100).optional(),
  maritalStatus: Joi.string().valid('Single', 'Divorced', 'Widowed').optional(),
  gender: Joi.string().valid('Male', 'Female').optional(),
  job: Joi.string().max(100).optional(),
  location: Joi.string().max(100).optional(),
  education: Joi.string().max(100).optional(),
  salary: Joi.string().max(50).optional(),
  assets: Joi.string().max(200).optional(),
  description: Joi.string().max(500).optional(),
  phone: Joi.string().pattern(/^[0-9+\-\s()]+$/).max(20).optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


router.post('/register', upload.single('profilePhoto'), async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    let { name, email, password, age, maritalStatus, gender, job, location, education, salary, assets, description, phone } = req.body;
    email = email.toLowerCase().trim();

    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      age,
      maritalStatus,
      gender,
      job,
      location,
      education,
      salary,
      assets,
      description,
      phone,
      profilePhoto: req.file ? req.file.path : ''
    });

    await user.save();

    // Create notification for admin
    try {
      const adminNotification = new Message({
        name: 'System',
        email: 'system@alfattahnikkah.com',
        subject: 'New User Registration',
        message: `A new user named ${user.name} (${user.email}) has registered.`,
        type: 'notification'
      });
      await adminNotification.save();
    } catch (notificationError) {
      console.error('Failed to create admin notification:', notificationError);
    }

    // Emit real-time notification to admin
    try {
      const { io } = require('../socket');
      const { sendPushNotification } = require('../utils/pushNotifications');
      const payload = { 
        title: 'New User Registration',
        body: `${user.name} just joined Al Fattah Nikkah.`,
        type: 'registration', 
        user: { name: user.name, email: user.email } 
      };
      
      io.emit('admin-notification', payload);
      sendPushNotification(payload);
    } catch (socketError) {
      console.error('Failed to emit socket notification:', socketError);
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    setAuthCookie(res, 'user_token', token);

    res.status(201).json({
      message: 'Registration successful',
      user: { _id: user._id, name: user.name, email: user.email },
      profilePhoto: user.profilePhoto
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  let { email, password } = req.body;
  email = email?.toLowerCase().trim();
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    setAuthCookie(res, 'user_token', token);

    res.json({
      message: 'Login successful',
      user: { _id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/profiles', async (req, res) => {
  try {
    const query = {};

    if (req.query.minAge || req.query.maxAge) {
      query.age = {};
      if (req.query.minAge) query.age.$gte = Number(req.query.minAge);
      if (req.query.maxAge) query.age.$lte = Number(req.query.maxAge);
    }

    if (req.query.location) {
      query.location = { $regex: escapeRegex(req.query.location), $options: 'i' };
    }

    if (req.query.gender && req.query.gender !== 'All Genders') {
      query.gender = req.query.gender;
    }

    if (req.query.maritalStatus && req.query.maritalStatus !== 'Any Status') {
      query.maritalStatus = req.query.maritalStatus;
    }

    if (req.query.education && req.query.education !== 'All Education') {
      query.education = { $regex: escapeRegex(req.query.education), $options: 'i' };
    }

    if (req.query.salary && req.query.salary !== 'Any Salary') {
      query.salary = req.query.salary;
    }

    if (req.query.job && req.query.job !== 'Any Job') {
      query.job = { $regex: escapeRegex(req.query.job), $options: 'i' };
    }

    query.isAdminApproved = true;
    query.isMarried = { $ne: true };

    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .select('-password -phone -email')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Search Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/profile/:id', async (req, res) => {
  try {
    const targetId = req.params.id;
    let canSeeContact = false;

    // 1. Check for Admin Token
    const adminToken = req.cookies?.admin_token;
    if (adminToken) {
      try {
        const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);
        if (decoded.role === 'admin' || decoded.role === 'superadmin') {
          canSeeContact = true;
        }
      } catch (err) {}
    }

    // 2. Check for User Token if not already allowed
    if (!canSeeContact) {
      const userToken = req.cookies?.user_token || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);
      if (userToken) {
        try {
          const decoded = jwt.verify(userToken, process.env.JWT_SECRET);
          if (decoded.id === targetId) {
            canSeeContact = true;
          } else {
            const requester = await User.findById(decoded.id);
            if (requester && requester.hasPaid) {
              canSeeContact = true;
            }
          }
        } catch (err) {}
      }
    }

    const selectFields = canSeeContact ? '-password' : '-password -phone -email';
    const user = await User.findById(targetId).select(selectFields);

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Profile Fetch Error:', err);
    if (err.kind === 'ObjectId') return res.status(404).json({ message: 'Invalid Profile ID format' });
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Me error:', err);
    res.status(401).json({ message: 'Invalid session' });
  }
});

router.put('/update/:id', authenticateUser, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) return res.status(403).json({ message: 'Access denied. You can only update your own profile.' });
    const { email, phone, password, isAdminApproved, hasPaid, _id, profilePhoto, ...safeUpdates } = req.body;

    const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: safeUpdates }, { new: true }).select('-password');
    res.json(updatedUser);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Update failed' });
  }
});

router.put('/update-photo/:id', authenticateUser, upload.single('profilePhoto'), async (req, res) => {
  try {
    if (req.user.id !== req.params.id) return res.status(403).json({ message: 'Access denied. You can only update your own photo.' });
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: { profilePhoto: req.file.path } }, { new: true }).select('-password');
    res.json(updatedUser);
  } catch (err) {
    console.error('Photo update error:', err);
    res.status(500).json({ message: 'Photo update failed' });
  }
});

router.post('/logout', (req, res) => {
  removeAuthCookie(res, 'user_token');
  res.json({ message: 'Logged out successfully' });
});

router.post('/forgot-password', async (req, res) => {
  let { email } = req.body;
  email = email?.toLowerCase().trim();
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User with this email does not exist.' });

    if (user.otpRequestedAt && (Date.now() - user.otpRequestedAt) < 60000) {
      const remainingSeconds = Math.ceil((60000 - (Date.now() - user.otpRequestedAt)) / 1000);
      return res.status(429).json({ message: `Please wait ${remainingSeconds} seconds before requesting a new OTP.` });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpire = Date.now() + 5 * 60 * 1000;
    user.otpRequestedAt = Date.now();
    await user.save();

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #c92c3a; text-align: center;">Al Fattah Matrimony</h2>
        <p>Hello <strong>${user.name}</strong>,</p>
        <p>You requested a password reset. Use the following 6-digit OTP to proceed:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333; background: #f4f4f4; padding: 10px 20px; border-radius: 5px; border: 1px dashed #c92c3a;">${otp}</span>
        </div>
        <p style="color: #555;">This OTP is valid for <strong>5 minutes</strong>. If you did not request this, please ignore this email or contact support.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #888; text-align: center;">Secure Message: Never share your OTP with anyone. Our team will never ask for your password or OTP.</p>
      </div>
    `;

    await sendEmail({
      email: user.email,
      subject: 'Password Reset OTP - Al Fattah Matrimony',
      html: htmlContent
    });

    res.json({ message: 'OTP sent to your email.' });
  } catch (err) {
    console.error('Forgot Password Error:', err);
    res.status(500).json({ message: 'Failed to send OTP. Please try again later.' });
  }
});

router.post('/verify-otp', async (req, res) => {
  let { email, otp } = req.body;
  email = email?.toLowerCase().trim();
  otp = otp?.trim();
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found.' });
    
    if (user.resetOtp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP code.' });
    }
    
    if (new Date(user.resetOtpExpire) < new Date()) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    res.json({ message: 'OTP verified successfully. You can now reset your password.' });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ message: 'Verification failed.' });
  }
});

router.post('/reset-password', async (req, res) => {
  let { email, otp, newPassword } = req.body;
  email = email?.toLowerCase().trim();
  otp = otp?.trim();
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found. Please start again.' });

    if (user.resetOtp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP code. Please start again.' });
    }

    if (new Date(user.resetOtpExpire) < new Date()) {
      return res.status(400).json({ message: 'OTP has expired. Please start again.' });
    }

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.' });
    }

    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetOtp = undefined;
    user.resetOtpExpire = undefined;
    await user.save();

    res.json({ message: 'Password reset successful. You can now login with your new password.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Password reset failed.' });
  }
});

module.exports = router;
