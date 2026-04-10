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
    type: 'upload', // 'upload' type = public access
    allowed_formats: ['pdf'],
    public_id: (req, file) => {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      return `cv-${timestamp}-${randomString}.pdf`; // .pdf uzantısı ekledik
    }
  }
});

// Profil resmi için Cloudinary storage
const profileImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile-images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
    public_id: (req, file) => {
      const timestamp = Date.now();
      return `profile-${timestamp}`;
    }
  }
});

// Multer middleware for CV
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

// Multer middleware for profile image
const uploadProfileImage = multer({
  storage: profileImageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Sadece resim dosyalarına izin ver
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Sadece resim dosyaları yüklenebilir'), false);
    }
  }
});

// Blog görseli için Cloudinary storage
const blogImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'blog-images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    transformation: [{ width: 1200, crop: 'limit' }],
    public_id: (req, file) => {
      const timestamp = Date.now();
      return `blog-${timestamp}`;
    }
  }
});

const uploadBlogImage = multer({
  storage: blogImageStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Sadece resim dosyaları yüklenebilir'), false);
    }
  }
});

module.exports = {
  cloudinary,
  uploadCV,
  uploadProfileImage,
  uploadBlogImage
};
