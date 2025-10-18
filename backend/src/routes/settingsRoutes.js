const express = require('express');
const router = express.Router();
const {
  getSettings,
  updateSocialMedia,
  updateContactInfo,
  updateSettings
} = require('../controllers/settingsController');
const { protect, admin } = require('../middleware/auth');

// Public route - Herkes ayarları görebilir
router.get('/', getSettings);

// Protected routes - Sadece admin güncelleyebilir
router.put('/social-media', protect, admin, updateSocialMedia);
router.put('/contact-info', protect, admin, updateContactInfo);
router.put('/', protect, admin, updateSettings);

module.exports = router;
