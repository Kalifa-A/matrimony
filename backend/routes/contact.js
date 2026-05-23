const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Basic Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Length validation to prevent large payload attacks
    if (name.length > 100 || subject.length > 200 || message.length > 5000) {
      return res.status(400).json({ message: 'Input text too long' });
    }

    const newMessage = new Message({
      name,
      email,
      subject,
      message,
      type: 'contact'
    });

    await newMessage.save();

    // Emit real-time notification to admin
    try {
      const { io } = require('../socket');
      const { sendPushNotification } = require('../utils/pushNotifications');
      const payload = { 
        title: 'New Contact Inquiry',
        body: `${name}: ${subject}`,
        type: 'contact',
        user: { name, email } 
      };
      
      io.emit('admin-notification', payload);
      sendPushNotification(payload);
    } catch (err) {
      console.error('Notification error:', err);
    }

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
