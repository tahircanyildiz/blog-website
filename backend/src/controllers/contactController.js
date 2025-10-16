const Contact = require('../models/Contact');
const { validationResult } = require('express-validator');

/**
 * @desc    İletişim formu mesajı oluştur
 * @route   POST /api/contact
 * @access  Public
 */
exports.createContact = async (req, res, next) => {
  try {
    // Validasyon hatalarını kontrol et
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasyon hatası',
        errors: errors.array()
      });
    }

    const { name, email, message } = req.body;

    const contact = await Contact.create({
      name,
      email,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Mesajınız başarıyla gönderildi',
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Tüm iletişim mesajlarını listele
 * @route   GET /api/contact
 * @access  Private (Admin)
 */
exports.getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find()
      .sort({ createdAt: -1 }); // En yeni mesajlar önce

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Tek bir iletişim mesajını getir
 * @route   GET /api/contact/:id
 * @access  Private (Admin)
 */
exports.getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Mesaj bulunamadı'
      });
    }

    // Mesajı okundu olarak işaretle
    if (!contact.isRead) {
      contact.isRead = true;
      await contact.save();
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Mesaj bulunamadı'
      });
    }
    next(error);
  }
};

/**
 * @desc    İletişim mesajını sil
 * @route   DELETE /api/contact/:id
 * @access  Private (Admin)
 */
exports.deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Mesaj bulunamadı'
      });
    }

    await contact.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Mesaj silindi',
      data: {}
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Mesaj bulunamadı'
      });
    }
    next(error);
  }
};
