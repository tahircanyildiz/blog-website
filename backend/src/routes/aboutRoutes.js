const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect, admin } = require('../middleware/auth');
const { getAbout, updateAbout, uploadCV, deleteCV, downloadCV, uploadProfileImage, deleteProfileImage } = require('../controllers/aboutController');
const { uploadCV: uploadCVMiddleware, uploadProfileImage: uploadProfileImageMiddleware } = require('../config/cloudinary');

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

/**
 * @route   POST /api/about/cv
 * @desc    CV dosyası yükle - Cloudinary (Admin)
 * @access  Private/Admin
 */
router.post('/cv', protect, admin, uploadCVMiddleware.single('cv'), uploadCV);

/**
 * @route   DELETE /api/about/cv
 * @desc    CV dosyasını sil (Admin)
 * @access  Private/Admin
 */
router.delete('/cv', protect, admin, deleteCV);

/**
 * @route   GET /api/about/cv/download
 * @desc    CV dosyasını indir
 * @access  Public
 */
router.get('/cv/download', downloadCV);

/**
 * @route   POST /api/about/profile-image
 * @desc    Profil resmi yükle - Cloudinary (Admin)
 * @access  Private/Admin
 */
router.post('/profile-image', protect, admin, uploadProfileImageMiddleware.single('profileImage'), uploadProfileImage);

/**
 * @route   DELETE /api/about/profile-image
 * @desc    Profil resmini sil (Admin)
 * @access  Private/Admin
 */
router.delete('/profile-image', protect, admin, deleteProfileImage);

module.exports = router;
