const dotenv = require('dotenv');
const app = require('./app');
const connectDB = require('./config/db');

// Ortam değişkenlerini yükle
dotenv.config();

// Cloudinary config kontrolü (debug için)
console.log('=== Cloudinary Configuration Check ===');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME ? '✓ Loaded' : '✗ MISSING');
console.log('API Key:', process.env.CLOUDINARY_API_KEY ? '✓ Loaded' : '✗ MISSING');
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? '✓ Loaded' : '✗ MISSING');
console.log('======================================\n');

// MongoDB bağlantısını kur
connectDB();

// Port ayarı
const PORT = process.env.PORT || 5000;

// Sunucuyu başlat
const server = app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
console.log("MongoDB URI:", process.env.MONGODB_URI);


// İşlenmeyen Promise reddetmelerini yakala
process.on('unhandledRejection', (err, promise) => {
  console.log(`Hata: ${err.message}`);
  // Sunucuyu kapat ve çık
  server.close(() => process.exit(1));
});
