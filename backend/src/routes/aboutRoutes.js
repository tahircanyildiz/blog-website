const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect, admin } = require('../middleware/auth');
const { getAbout, updateAbout } = require('../controllers/aboutController');

/**
 * @route   GET /api/about
 * @desc    Hakkımda bilgisini getir
 */
router.get('/', getAbout);

/**
 * @route   PUT /api/about
 * @desc    Hakkımda bilgisini güncelle (Admin)
 * @access  Private/Admin
 * @validation Gerekli alanları kontrol et
 */
router.put('/', protect, admin, [
  body('name').optional().trim().notEmpty().withMessage('İsim boş olamaz'),
  body('title').optional().trim().notEmpty().withMessage('Unvan boş olamaz'),
  body('description').optional().trim().notEmpty().withMessage('Açıklama boş olamaz'),
  body('experiences').optional().isArray().withMessage('Deneyimler dizi formatında olmalıdır'),
  body('technologies').optional().isArray().withMessage('Teknolojiler dizi formatında olmalıdır')
], updateAbout);

module.exports = router;
