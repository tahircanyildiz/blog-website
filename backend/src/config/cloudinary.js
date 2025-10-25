require('dotenv').config(); // .env dosyasını yükle
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Debug: Environment variables kontrolü
console.log('🔧 Cloudinary Config - Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('🔧 Cloudinary Config - API Key:', process.env.CLOUDINARY_API_KEY);

// Cloudinary konfigürasyonu
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Konfigürasyonu test et
console.log('✅ Cloudinary configured with cloud:', cloudinary.config().cloud_name);

// CV dosyaları için Cloudinary storage
const cvStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'cv-files',
    resource_type: 'raw',
    allowed_formats: ['pdf'],
    public_id: (req, file) => {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      return `cv-${timestamp}-${randomString}`;
    }
  }
});

// Multer middleware
const uploadCV = multer({
  storage: cvStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Sadece PDF dosyalarına izin ver
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Sadece PDF dosyaları yüklenebilir'), false);
    }
  }
});

module.exports = {
  cloudinary,
  uploadCV
};
