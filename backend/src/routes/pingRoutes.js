const express = require('express');
const router = express.Router();

/**
 * @route   GET /api/ping
 * @desc    Health check endpoint - Keep server awake
 * @access  Public
 */
router.get('/', (req, res) => {
  res.status(200).send('OK');
});

module.exports = router;
