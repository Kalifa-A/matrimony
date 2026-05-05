const express = require('express');
const router = express.Router();
const Interest = require('../models/Interest');
const User = require('../models/User');
const { authenticateUser } = require('../utils/auth-middleware');

// @route   POST api/interests/send
// @desc    Send interest to a user
router.post('/send', authenticateUser, async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    // Ensure sender is the logged-in user
    if (req.user.id !== senderId) {
      return res.status(403).json({ message: 'Access denied.' });
    }
    // 1. Validate if both users exist
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Prevent sending interest to yourself
    if (senderId === receiverId) {
      return res.status(400).json({ message: "You cannot send interest to yourself" });
    }

    // 3. Check if interest already exists
    const existingInterest = await Interest.findOne({ sender: senderId, receiver: receiverId });
    if (existingInterest) {
      return res.status(400).json({ message: "Interest already sent" });
    }

    // 4. Create new interest
    const newInterest = new Interest({
      sender: senderId,
      receiver: receiverId
    });

    await newInterest.save();
    res.status(201).json({ message: "Interest sent successfully!" });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/interests/received/:userId
// @desc    Get all interests received by a user
router.get('/received/:userId', authenticateUser, async (req, res) => {
  try {
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ message: 'Access denied.' });
    }
    const interests = await Interest.find({ receiver: req.params.userId })
      .populate('sender', 'name age location job profilePhoto gender education')
      .sort({ createdAt: -1 });
    
    res.json(interests);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/interests/check/:senderId/:receiverId
// @desc    Check if interest has been sent
router.get('/check/:senderId/:receiverId', authenticateUser, async (req, res) => {
    try {
      if (req.user.id !== req.params.senderId) {
        return res.status(403).json({ message: 'Access denied.' });
      }
      const interest = await Interest.findOne({ 
        sender: req.params.senderId, 
        receiver: req.params.receiverId 
      });
      res.json({ sent: !!interest });
    } catch (err) {
      res.status(500).send("Server Error");
    }
});

// @route   DELETE api/interests/undo/:senderId/:receiverId
// @desc    Undo interest sent to a user
router.delete('/undo/:senderId/:receiverId', authenticateUser, async (req, res) => {
  try {
    if (req.user.id !== req.params.senderId) {
      return res.status(403).json({ message: 'Access denied.' });
    }
    const interest = await Interest.findOneAndDelete({ 
      sender: req.params.senderId, 
      receiver: req.params.receiverId 
    });

    if (!interest) {
      return res.status(404).json({ message: "Interest not found" });
    }

    res.json({ message: "Interest undone successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/interests/sent/:userId
// @desc    Get all interests sent by a user
router.get('/sent/:userId', authenticateUser, async (req, res) => {
  try {
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ message: 'Access denied.' });
    }
    const interests = await Interest.find({ sender: req.params.userId })
      .populate('receiver', 'name age location job profilePhoto gender education');
    
    res.json(interests);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
