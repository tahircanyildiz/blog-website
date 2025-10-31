const express = require('express');
const router = express.Router();

/**
 * @route   GET /api/ping
 * @desc    Health check endpoint - Keep server awake
 * @access  Public
 */
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is awake!',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router;
