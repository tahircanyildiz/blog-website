const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // Sosyal Medya Ayarları
  socialMedia: [{
    platform: {
      type: String,
      enum: [
        'github',
        'linkedin',
        'twitter',
        'instagram',
        'facebook',
        'youtube',
        'medium',
        'tiktok',
        'discord',
        'telegram',
        'whatsapp',
        'email'
      ],
      required: true
    },
    url: {
      type: String,
      required: true,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],

  // İletişim Bilgileri
  contactInfo: {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Geçerli bir e-posta adresi giriniz']
    },
    location: {
      type: String,
      trim: true
    }
  }
}, {
  timestamps: true
});

// Sadece bir tane Settings kaydı olmalı
settingsSchema.statics.getSingleton = async function() {
  let settings = await this.findOne();

  if (!settings) {
    // Varsayılan ayarlarla oluştur
    settings = await this.create({
      socialMedia: [],
      contactInfo: {
        email: '',
        location: ''
      }
    });
  }

  return settings;
};

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
