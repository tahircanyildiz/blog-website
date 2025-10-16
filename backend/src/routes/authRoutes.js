const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

/**
 * @route   POST /api/auth/register
 * @desc    Yeni kullanıcı kaydı
 * @validation Gerekli alanları kontrol et
 */
router.post('/register', [
  body('username')
    .trim()
    .notEmpty().withMessage('Kullanıcı adı zorunludur')
    .isLength({ min: 3 }).withMessage('Kullanıcı adı en az 3 karakter olmalıdır'),
  body('email')
    .trim()
    .notEmpty().withMessage('E-posta zorunludur')
    .isEmail().withMessage('Geçerli bir e-posta adresi giriniz'),
  body('password')
    .notEmpty().withMessage('Şifre zorunludur')
    .isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalıdır'),
  body('role')
    .optional()
    .isIn(['admin', 'user']).withMessage('Rol sadece admin veya user olabilir')
], register);

/**
 * @route   POST /api/auth/login
 * @desc    Kullanıcı girişi
 * @validation Gerekli alanları kontrol et
 */
router.post('/login', [
  body('email')
    .trim()
    .notEmpty().withMessage('E-posta zorunludur')
    .isEmail().withMessage('Geçerli bir e-posta adresi giriniz'),
  body('password')
    .notEmpty().withMessage('Şifre zorunludur')
], login);

/**
 * @route   GET /api/auth/me
 * @desc    Giriş yapan kullanıcının bilgilerini getir
 * @access  Private
 */
router.get('/me', protect, getMe);

module.exports = router;
