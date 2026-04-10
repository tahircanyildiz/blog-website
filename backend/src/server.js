const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const dotenv = require('dotenv');
const app = require('./app');
const connectDB = require('./config/db');

// Ortam değişkenlerini yükle
dotenv.config();

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
