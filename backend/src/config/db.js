const mongoose = require('mongoose');

/**
 * MongoDB veritabanına bağlantı kurar
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB Bağlantısı Başarılı: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Bağlantı Hatası: ${error.message}`);
    process.exit(1); // Bağlantı başarısız olursa uygulamayı durdur
  }
};

module.exports = connectDB;
