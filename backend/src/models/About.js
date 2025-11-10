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
  }],
  skills: [{
    category: {
      type: String,
      required: true,
      trim: true
    },
    items: [{
      type: String,
      trim: true
    }]
  }],
  languages: [{
    language: {
      type: String,
      required: true,
      trim: true
    },
    level: {
      type: String,
      required: true,
      trim: true
    }
  }],
  references: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    company: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true
    }
  }],
  education: [{
    degree: {
      type: String,
      required: true,
      enum: ['İlkokul', 'Ortaokul', 'Lise', 'Önlisans', 'Üniversite', 'Yüksek Lisans', 'Doktora'],
      trim: true
    },
    school: {
      type: String,
      required: true,
      trim: true
    },
    department: {
      type: String,
      trim: true
    },
    year: {
      type: String,
      trim: true
    }
  }],
  profileImage: {
    type: String,
    default: null // Cloudinary URL
  },
  cvFile: {
    type: String,
    default: null
  }
}, {
  timestamps: true // createdAt ve updatedAt alanlarını otomatik ekler
});

module.exports = mongoose.model('About', aboutSchema);
