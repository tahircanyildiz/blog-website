const mongoose = require('mongoose');

/**
 * Hakkımda bilgilerini tutan model
 */
const aboutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'İsim alanı zorunludur'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Unvan alanı zorunludur'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Açıklama alanı zorunludur']
  },
  experiences: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    company: {
      type: String,
      required: true,
      trim: true
    },
    period: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    }
  }],
  technologies: [{
    type: String
  }]
}, {
  timestamps: true // createdAt ve updatedAt alanlarını otomatik ekler
});

module.exports = mongoose.model('About', aboutSchema);
