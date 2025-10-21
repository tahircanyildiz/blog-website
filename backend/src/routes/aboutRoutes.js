const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');
const { protect, admin } = require('../middleware/auth');
const { getAbout, updateAbout, uploadCV, deleteCV } = require('../controllers/aboutController');

// Multer configuration for CV upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/cv/');
  },
  filename: function (req, file, cb) {
    // Unique filename: timestamp + original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'cv-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter - only PDF files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Sadece PDF dosyaları yüklenebilir'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

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
 * @desc    CV dosyası yükle (Admin)
 * @access  Private/Admin
 */
router.post('/cv', protect, admin, upload.single('cv'), uploadCV);

/**
 * @route   DELETE /api/about/cv
 * @desc    CV dosyasını sil (Admin)
 * @access  Private/Admin
 */
router.delete('/cv', protect, admin, deleteCV);

module.exports = router;
