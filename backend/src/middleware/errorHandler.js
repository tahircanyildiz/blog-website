/**
 * Global hata yakalama middleware'i
 * Tüm hataları yakalar ve tutarlı bir format ile client'a döner
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Konsola log
  console.error('Hata:', err);

  // Mongoose bad ObjectId hatası
  if (err.name === 'CastError') {
    const message = 'Geçersiz kayıt ID\'si';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key hatası
  if (err.code === 11000) {
    const message = 'Bu kayıt zaten mevcut';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation hatası
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Sunucu hatası',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
