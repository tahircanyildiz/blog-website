const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * JWT token doğrulama middleware'i
 * Authorization header'dan token'ı alır ve doğrular
 */
const protect = async (req, res, next) => {
  let token;

  // Header'dan token'ı al
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Token'ı ayıkla (Bearer kısmını çıkar)
      token = req.headers.authorization.split(' ')[1];

      // Token'ı doğrula
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Kullanıcıyı veritabanından al (şifre hariç)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Kullanıcı bulunamadı'
        });
      }

      next();
    } catch (error) {
      console.error('Token doğrulama hatası:', error);
      return res.status(401).json({
        success: false,
        message: 'Token geçersiz veya süresi dolmuş'
      });
    }
  }

  // Token yoksa hata döndür
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Yetkilendirme token\'ı bulunamadı'
    });
  }
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
