const mongoose = require('mongoose');

/**
 * İletişim formundan gelen mesajları tutan model
 */
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'İsim alanı zorunludur'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'E-posta alanı zorunludur'],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Geçerli bir e-posta adresi giriniz'
    ]
  },
  message: {
    type: String,
    required: [true, 'Mesaj alanı zorunludur']
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // createdAt ve updatedAt alanlarını otomatik ekler
});

module.exports = mongoose.model('Contact', contactSchema);
