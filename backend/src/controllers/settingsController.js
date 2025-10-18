const Settings = require('../models/Settings');

// @desc    Site ayarlarını getir
// @route   GET /api/settings
// @access  Public
exports.getSettings = async (req, res, next) => {
  try {
    const settings = await Settings.getSingleton();

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Sosyal medya ayarlarını güncelle
// @route   PUT /api/settings/social-media
// @access  Private/Admin
exports.updateSocialMedia = async (req, res, next) => {
  try {
    const { socialMedia } = req.body;

    // Validasyon
    if (!Array.isArray(socialMedia)) {
      return res.status(400).json({
        success: false,
        message: 'Sosyal medya bilgileri dizi formatında olmalıdır'
      });
    }

    // Platform ve URL kontrolü
    const validPlatforms = [
      'github', 'linkedin', 'twitter', 'instagram', 'facebook',
      'youtube', 'medium', 'tiktok', 'discord', 'telegram',
      'whatsapp', 'email'
    ];

    for (const item of socialMedia) {
      if (!validPlatforms.includes(item.platform)) {
        return res.status(400).json({
          success: false,
          message: `Geçersiz platform: ${item.platform}`
        });
      }

      if (!item.url || item.url.trim() === '') {
        return res.status(400).json({
          success: false,
          message: `${item.platform} için URL gereklidir`
        });
      }
    }

    const settings = await Settings.getSingleton();
    settings.socialMedia = socialMedia;
    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Sosyal medya ayarları güncellendi',
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    İletişim bilgilerini güncelle
// @route   PUT /api/settings/contact-info
// @access  Private/Admin
exports.updateContactInfo = async (req, res, next) => {
  try {
    const { email, location } = req.body;

    const settings = await Settings.getSingleton();

    // Email validasyonu
    if (email !== undefined) {
      if (email && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Geçerli bir e-posta adresi giriniz'
        });
      }
      settings.contactInfo.email = email;
    }

    if (location !== undefined) {
      settings.contactInfo.location = location;
    }

    await settings.save();

    res.status(200).json({
      success: true,
      message: 'İletişim bilgileri güncellendi',
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Tüm ayarları güncelle
// @route   PUT /api/settings
// @access  Private/Admin
exports.updateSettings = async (req, res, next) => {
  try {
    const { socialMedia, contactInfo } = req.body;

    const settings = await Settings.getSingleton();

    if (socialMedia) {
      settings.socialMedia = socialMedia;
    }

    if (contactInfo) {
      if (contactInfo.email !== undefined) {
        settings.contactInfo.email = contactInfo.email;
      }
      if (contactInfo.location !== undefined) {
        settings.contactInfo.location = contactInfo.location;
      }
    }

    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Ayarlar güncellendi',
      data: settings
    });
  } catch (error) {
    next(error);
  }
};
