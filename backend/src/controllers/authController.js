const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

/**
 * JWT token oluştur
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

/**
 * @route   POST /api/auth/register
 * @desc    Yeni kullanıcı kaydı
 */
exports.register = async (req, res, next) => {
  // Validation hatalarını kontrol et
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const { username, email, password, role } = req.body;

    // Kullanıcı zaten var mı kontrol et
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Bu kullanıcı adı veya e-posta zaten kullanılıyor'
      });
    }

    // Yeni kullanıcı oluştur
    const user = await User.create({
      username,
      email,
      password,
      role: role || 'user' // Varsayılan olarak 'user'
    });

    // Token oluştur
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Kullanıcı başarıyla oluşturuldu',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Kullanıcı girişi
 */
exports.login = async (req, res, next) => {
  // Validation hatalarını kontrol et
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const { email, password } = req.body;

    // Kullanıcıyı bul (şifre ile birlikte)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'E-posta veya şifre hatalı'
      });
    }

    // Şifre kontrolü
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'E-posta veya şifre hatalı'
      });
    }

    // Token oluştur
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Giriş başarılı',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Giriş yapan kullanıcının bilgilerini getir
 * @access  Private (protect middleware ile korunmalı)
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
