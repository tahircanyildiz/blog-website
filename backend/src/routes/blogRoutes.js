const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect, admin } = require('../middleware/auth');
const {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog
} = require('../controllers/blogController');

/**
 * @route   GET /api/blogs
 * @desc    Tüm blog yazılarını listele
 */
router.get('/', getAllBlogs);

/**
 * @route   GET /api/blogs/:id
 * @desc    Tek bir blog yazısının detayını getir
 */
router.get('/:id', getBlogById);

/**
 * @route   POST /api/blogs
 * @desc    Yeni blog yazısı oluştur (Admin)
 * @access  Private/Admin
 * @validation Gerekli alanları kontrol et
 */
router.post('/', protect, admin, [
  body('title').trim().notEmpty().withMessage('Başlık zorunludur'),
  body('content').trim().notEmpty().withMessage('İçerik zorunludur'),
  body('shortDescription')
    .trim()
    .notEmpty().withMessage('Kısa açıklama zorunludur')
    .isLength({ max: 200 }).withMessage('Kısa açıklama en fazla 200 karakter olabilir'),
  body('tags').optional().isArray().withMessage('Etiketler dizi formatında olmalıdır')
], createBlog);

/**
 * @route   PUT /api/blogs/:id
 * @desc    Blog yazısını güncelle (Admin)
 * @access  Private/Admin
 * @validation Gerekli alanları kontrol et
 */
router.put('/:id', protect, admin, [
  body('title').optional().trim().notEmpty().withMessage('Başlık boş olamaz'),
  body('content').optional().trim().notEmpty().withMessage('İçerik boş olamaz'),
  body('shortDescription')
    .optional()
    .trim()
    .notEmpty().withMessage('Kısa açıklama boş olamaz')
    .isLength({ max: 200 }).withMessage('Kısa açıklama en fazla 200 karakter olabilir'),
  body('tags').optional().isArray().withMessage('Etiketler dizi formatında olmalıdır')
], updateBlog);

/**
 * @route   DELETE /api/blogs/:id
 * @desc    Blog yazısını sil (Admin)
 * @access  Private/Admin
 */
router.delete('/:id', protect, admin, deleteBlog);

module.exports = router;
