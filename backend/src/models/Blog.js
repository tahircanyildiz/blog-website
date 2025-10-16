const mongoose = require('mongoose');

/**
 * Blog yazılarını tutan model
 */
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Başlık alanı zorunludur'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'İçerik alanı zorunludur']
  },
  shortDescription: {
    type: String,
    required: [true, 'Kısa açıklama alanı zorunludur'],
    maxlength: [200, 'Kısa açıklama en fazla 200 karakter olabilir']
  },
  publishDate: {
    type: Date,
    default: Date.now
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true // createdAt ve updatedAt alanlarını otomatik ekler
});

// Slug oluşturma middleware (kaydetmeden önce)
blogSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    // Türkçe karakterleri düzelt ve slug oluştur
    this.slug = this.title
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
