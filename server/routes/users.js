const express = require('express');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    res.status(200).json({
      id: req.user._id,
      username: req.user.username,
      email: req.user.email
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
