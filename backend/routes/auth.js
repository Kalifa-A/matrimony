const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const upload = require('../config/cloudinary');
const jwt = require('jsonwebtoken');
const { authenticateUser } = require('../utils/auth-middleware');
const { setAuthCookie, removeAuthCookie } = require('../utils/auth-cookies');
const Joi = require('joi');

// Validation schemas
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
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


router.post('/register', upload.single('profilePhoto'), async (req, res) => {
    console.log("REQUEST HIT:", req.body);
    console.log("FILE HIT:", req.file);
  try {
    // Validate input
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { name, email, password, age, maritalStatus, gender, job, location, education, salary, assets, description, phone } = req.body;

    // 1. Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // 2. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create New User
    user = new User({
      name, email, password: hashedPassword, age, maritalStatus, gender, job, location, 
      education, salary, assets, description, phone,
      profilePhoto: req.file ? req.file.path : "",
    });

    await user.save();

    // Create JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Set httpOnly cookie
    setAuthCookie(res, 'user_token', token);

    res.status(201).json({ 
      message: "Registration Successful!", 
      user: { _id: user._id, name: user.name, email: user.email }, 
      profilePhoto: user.profilePhoto,
      token // Still returning token for backward compatibility/legacy support
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});
router.post('/login', async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Compare hashed password (using bcrypt)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Create JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Set httpOnly cookie
    setAuthCookie(res, 'user_token', token);

    res.json({ 
      message: "Login successful", 
      user: { _id: user._id, name: user.name, email: user.email },
      token // Still returning token for backward compatibility/legacy support
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// backend/routes/auth.js

// @route   GET api/auth/profiles
// @desc    Get all user profiles with optional filters
router.get('/profiles', async (req, res) => {
  try {
    let query = {};

    // 1. Filter by Age (if provided)
    if (req.query.minAge || req.query.maxAge) {
      query.age = {};
      if (req.query.minAge) query.age.$gte = Number(req.query.minAge);
      if (req.query.maxAge) query.age.$lte = Number(req.query.maxAge);
    }

    // 2. Filter by Location (if provided)
    if (req.query.location) {
      // 'i' makes it case-insensitive so "chennai" matches "Chennai"
      query.location = { $regex: req.query.location, $options: 'i' };
    }

    if (req.query.gender && req.query.gender !== 'All Genders') {
      query.gender = req.query.gender;
    }

    if (req.query.maritalStatus && req.query.maritalStatus !== 'Any Status') {
      query.maritalStatus = req.query.maritalStatus;
    }

    if (req.query.education && req.query.education !== 'All Education') {
      query.education = { $regex: req.query.education, $options: 'i' };
    }

    if (req.query.salary && req.query.salary !== 'Any Salary') {
      query.salary = req.query.salary;
    }

    if (req.query.job && req.query.job !== 'Any Job') {
      query.job = { $regex: req.query.job, $options: 'i' };
    }

    // Only show approved and unmarried users in discovery
    query.isAdminApproved = true;
    query.isMarried = { $ne: true };

    // 3. Fetch from Database (excluding passwords)
    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    
    res.json(users);
  } catch (err) {
    console.error("Search Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
});


router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Profile Fetch Error:", err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: "Invalid Profile ID format" });
    }
    
    res.status(500).json({ message: "Server Error" });
  }
});



router.get('/me/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});


router.put('/update/:id', authenticateUser, async (req, res) => {
  try {
    // Ensure user can only update their own profile
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Access denied. You can only update your own profile.' });
    }
    // SECURITY: Destructure and ignore fields that should not be updated via this route
    // We explicitly exclude email, phone, password, and admin-only fields
    const { 
      email, 
      phone, 
      password, 
      isAdminApproved, 
      hasPaid, 
      _id, 
      ...safeUpdates 
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: safeUpdates },
      { new: true }
    ).select('-password');
    
    res.json(updatedUser);
  } catch (err) {
    console.error("Security Hardening Update Error:", err);
    res.status(500).json({ message: "Update failed" });
  }
});

// New route for updating profile photo
router.put('/update-photo/:id', authenticateUser, upload.single('profilePhoto'), async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Access denied. You can only update your own photo.' });
    }
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { profilePhoto: req.file.path } },
      { new: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Photo update failed" });
  }
});



// GET /api/auth/me - Verify session via cookie or Authorization header
router.get('/me', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(401).json({ message: "Invalid session" });
  }
});

// POST /api/auth/logout - Clear cookie and Inform client
router.post('/logout', (req, res) => {
  removeAuthCookie(res, 'user_token');
  res.json({ message: "Logged out successfully" });
});

module.exports = router;