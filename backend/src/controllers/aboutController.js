const About = require('../models/About');
const { validationResult } = require('express-validator');

/**
 * @desc    Hakkımda bilgisini getir
 * @route   GET /api/about
 * @access  Public
 */
exports.getAbout = async (req, res, next) => {
  try {
    // İlk (ve tek) hakkımda kaydını getir
    const about = await About.findOne();

    if (!about) {
      return res.status(404).json({
        success: false,
        message: 'Hakkımda bilgisi bulunamadı'
      });
    }

    res.status(200).json({
      success: true,
      data: about
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Hakkımda bilgisini güncelle veya oluştur
 * @route   PUT /api/about
 * @access  Private (Admin)
 */
exports.updateAbout = async (req, res, next) => {
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

    const { name, title, description, experiences, technologies } = req.body;

    // Mevcut kaydı bul ve güncelle, yoksa yeni oluştur
    let about = await About.findOne();

    if (about) {
      // Güncelle
      about.name = name || about.name;
      about.title = title || about.title;
      about.description = description || about.description;
      about.experiences = experiences || about.experiences;
      about.technologies = technologies || about.technologies;

      await about.save();

      res.status(200).json({
        success: true,
        message: 'Hakkımda bilgisi güncellendi',
        data: about
      });
    } else {
      // Yeni oluştur
      about = await About.create({
        name,
        title,
        description,
        experiences,
        technologies
      });

      res.status(201).json({
        success: true,
        message: 'Hakkımda bilgisi oluşturuldu',
        data: about
      });
    }
  } catch (error) {
    next(error);
  }
};
