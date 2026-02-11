const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * JWT token veya API Key doğrulama middleware'i
 * Bearer token veya X-API-KEY header'ı ile gelen istekleri doğrular
 */
const protect = async (req, res, next) => {
  // Önce API Key kontrolü yap
  const apiKey = req.headers['x-api-key'];
  if (apiKey && apiKey === process.env.LOBSTERLEAD_API_KEY) {
    req.user = { role: 'admin' };
    return next();
  }

  // JWT token kontrolü
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Kullanıcı bulunamadı'
        });
      }

      return next();
    } catch (error) {
      console.error('Token doğrulama hatası:', error);
      return res.status(401).json({
        success: false,
        message: 'Token geçersiz veya süresi dolmuş'
      });
    }
  }

  return res.status(401).json({
    success: false,
    message: 'Yetkilendirme token\'ı bulunamadı'
  });
};

/**
 * Admin yetkisi kontrolü
 * protect middleware'inden sonra kullanılmalı
 */
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Bu işlem için admin yetkisi gereklidir'
    });
  }
};

module.exports = { protect, admin };
