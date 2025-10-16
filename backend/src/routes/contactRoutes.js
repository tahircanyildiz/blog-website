const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect, admin } = require('../middleware/auth');
const {
  createContact,
  getAllContacts,
  getContactById,
  deleteContact
} = require('../controllers/contactController');

/**
 * @route   POST /api/contact
 * @desc    İletişim formu mesajı gönder
 * @validation Gerekli alanları kontrol et
 */
router.post('/', [
  body('name').trim().notEmpty().withMessage('İsim zorunludur'),
  body('email')
    .trim()
    .notEmpty().withMessage('E-posta zorunludur')
    .isEmail().withMessage('Geçerli bir e-posta adresi giriniz'),
  body('message').trim().notEmpty().withMessage('Mesaj zorunludur')
], createContact);

/**
 * @route   GET /api/contact
 * @desc    Tüm iletişim mesajlarını listele (Admin)
 * @access  Private/Admin
 */
router.get('/', protect, admin, getAllContacts);

/**
 * @route   GET /api/contact/:id
 * @desc    Tek bir iletişim mesajını getir (Admin)
 * @access  Private/Admin
 */
router.get('/:id', protect, admin, getContactById);

/**
 * @route   DELETE /api/contact/:id
 * @desc    İletişim mesajını sil (Admin)
 * @access  Private/Admin
 */
router.delete('/:id', protect, admin, deleteContact);

module.exports = router;
