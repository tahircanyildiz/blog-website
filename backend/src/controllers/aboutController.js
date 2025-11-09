const About = require('../models/About');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const { cloudinary } = require('../config/cloudinary');

/**
 * @desc    Hakkımda bilgisini getir
 * @route   GET /api/about
 * @access  Public
 */
exports.getAbout = async (req, res, next) => {
  try {
    // İlk (ve tek) hakkımda kaydını getir
    const about = await About.findOne();

    if (!about) {
      return res.status(404).json({
        success: false,
        message: 'Hakkımda bilgisi bulunamadı'
      });
    }

    res.status(200).json({
      success: true,
      data: about
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Hakkımda bilgisini güncelle veya oluştur
 * @route   PUT /api/about
 * @access  Private (Admin)
 */
exports.updateAbout = async (req, res, next) => {
  try {
    // Validasyon hatalarını kontrol et
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasyon hatası',
        errors: errors.array()
      });
    }

    const { name, title, description, experiences, technologies } = req.body;

    // Mevcut kaydı bul ve güncelle, yoksa yeni oluştur
    let about = await About.findOne();

    if (about) {
      // Güncelle
      about.name = name || about.name;
      about.title = title || about.title;
      about.description = description || about.description;
      about.experiences = experiences || about.experiences;
      about.technologies = technologies || about.technologies;

      await about.save();

      res.status(200).json({
        success: true,
        message: 'Hakkımda bilgisi güncellendi',
        data: about
      });
    } else {
      // Yeni oluştur
      about = await About.create({
        name,
        title,
        description,
        experiences,
        technologies
      });

      res.status(201).json({
        success: true,
        message: 'Hakkımda bilgisi oluşturuldu',
        data: about
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    CV dosyasını yükle (Cloudinary)
 * @route   POST /api/about/cv
 * @access  Private (Admin)
 */
exports.uploadCV = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Lütfen bir CV dosyası seçin'
      });
    }

    // Mevcut about kaydını bul
    let about = await About.findOne();

    if (!about) {
      return res.status(404).json({
        success: false,
        message: 'Hakkımda bilgisi bulunamadı. Önce hakkımda bilgilerinizi oluşturun.'
      });
    }

    // Eski CV dosyasını Cloudinary'den sil
    if (about.cvFile && about.cvFile.includes('cloudinary')) {
      try {
        // Cloudinary public_id'yi çıkar (.pdf uzantısıyla birlikte)
        const urlParts = about.cvFile.split('/');
        const uploadIndex = urlParts.indexOf('upload');
        const pathAfterUpload = urlParts.slice(uploadIndex + 1);
        const startIndex = pathAfterUpload[0].startsWith('v') ? 1 : 0;
        const publicId = pathAfterUpload.slice(startIndex).join('/');
        await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
      } catch (err) {
        console.error('Eski CV silinirken hata:', err);
      }
    }

    // Yeni CV dosya URL'sini kaydet (Cloudinary URL)
    console.log('📁 Uploaded file info:', {
      path: req.file.path,
      filename: req.file.filename,
      originalname: req.file.originalname
    });

    about.cvFile = req.file.path; // Cloudinary URL
    await about.save();

    res.status(200).json({
      success: true,
      message: 'CV başarıyla yüklendi',
      data: {
        cvFile: about.cvFile,
        cvUrl: req.file.path
      }
    });
  } catch (error) {
    // Hata durumunda yüklenen dosyayı Cloudinary'den sil
    if (req.file && req.file.filename) {
      try {
        const publicId = `cv-files/${req.file.filename}`;
        await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
      } catch (err) {
        console.error('CV silme hatası:', err);
      }
    }
    next(error);
  }
};

/**
 * @desc    CV dosyasını sil (Cloudinary)
 * @route   DELETE /api/about/cv
 * @access  Private (Admin)
 */
exports.deleteCV = async (req, res, next) => {
  try {
    const about = await About.findOne();

    if (!about || !about.cvFile) {
      return res.status(404).json({
        success: false,
        message: 'CV dosyası bulunamadı'
      });
    }

    // CV dosyasını Cloudinary'den sil
    if (about.cvFile.includes('cloudinary')) {
      try {
        const urlParts = about.cvFile.split('/');
        const uploadIndex = urlParts.indexOf('upload');
        const pathAfterUpload = urlParts.slice(uploadIndex + 1);
        const startIndex = pathAfterUpload[0].startsWith('v') ? 1 : 0;
        const publicId = pathAfterUpload.slice(startIndex).join('/');
        await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
      } catch (err) {
        console.error('Cloudinary silme hatası:', err);
      }
    } else {
      // Eski lokal dosyaları sil (geriye dönük uyumluluk)
      const filePath = path.join(__dirname, '../../uploads', about.cvFile);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Veritabanından CV referansını sil
    about.cvFile = null;
    await about.save();

    res.status(200).json({
      success: true,
      message: 'CV başarıyla silindi'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    CV dosyasını indir
 * @route   GET /api/about/cv/download
 * @access  Public
 */
exports.downloadCV = async (req, res, next) => {
  try {
    const about = await About.findOne();

    if (!about || !about.cvFile) {
      return res.status(404).json({
        success: false,
        message: 'CV dosyası bulunamadı'
      });
    }

    // Eğer Cloudinary URL ise, direkt URL'i kullan (public erişim)
    if (about.cvFile.includes('cloudinary')) {
      // Cloudinary URL'i zaten database'de var, direkt kullan
      const cloudinaryUrl = about.cvFile;

      console.log('Cloudinary URL:', cloudinaryUrl);

      // Dosyayı fetch et ve doğru header'larla serve et
      const https = require('https');
      https.get(cloudinaryUrl, (fileStream) => {
        // Eğer response 401/404 ise hata ver
        if (fileStream.statusCode !== 200) {
          console.error('Cloudinary HTTP Error:', fileStream.statusCode);
          return res.status(fileStream.statusCode).json({
            success: false,
            message: 'CV dosyasına erişilemiyor'
          });
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="CV.pdf"');
        fileStream.pipe(res);
      }).on('error', (err) => {
        console.error('Dosya indirme hatası:', err);
        return res.status(500).json({
          success: false,
          message: 'CV indirilemedi'
        });
      });
      return;
    }

    // Eski lokal dosyalar için (geriye dönük uyumluluk)
    const filePath = path.join(__dirname, '../../uploads', about.cvFile);
    if (fs.existsSync(filePath)) {
      return res.download(filePath);
    }

    res.status(404).json({
      success: false,
      message: 'CV dosyası bulunamadı'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Profil resmini yükle (Cloudinary)
 * @route   POST /api/about/profile-image
 * @access  Private (Admin)
 */
exports.uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Lütfen bir resim dosyası seçin'
      });
    }

    // Mevcut about kaydını bul
    let about = await About.findOne();

    if (!about) {
      return res.status(404).json({
        success: false,
        message: 'Hakkımda bilgisi bulunamadı. Önce hakkımda bilgilerinizi oluşturun.'
      });
    }

    // Eski profil resmini Cloudinary'den sil
    if (about.profileImage && about.profileImage.includes('cloudinary')) {
      try {
        // Cloudinary public_id'yi çıkar
        const urlParts = about.profileImage.split('/');
        const uploadIndex = urlParts.indexOf('upload');
        const pathAfterUpload = urlParts.slice(uploadIndex + 1);
        const startIndex = pathAfterUpload[0].startsWith('v') ? 1 : 0;
        const publicId = pathAfterUpload.slice(startIndex).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error('Eski profil resmi silinirken hata:', err);
      }
    }

    // Yeni profil resmi URL'sini kaydet (Cloudinary URL)
    about.profileImage = req.file.path;
    await about.save();

    res.status(200).json({
      success: true,
      message: 'Profil resmi başarıyla yüklendi',
      data: {
        profileImage: about.profileImage
      }
    });
  } catch (error) {
    // Hata durumunda yüklenen dosyayı Cloudinary'den sil
    if (req.file && req.file.filename) {
      try {
        await cloudinary.uploader.destroy(`profile-images/${req.file.filename}`);
      } catch (err) {
        console.error('Profil resmi silme hatası:', err);
      }
    }
    next(error);
  }
};

/**
 * @desc    Profil resmini sil (Cloudinary)
 * @route   DELETE /api/about/profile-image
 * @access  Private (Admin)
 */
exports.deleteProfileImage = async (req, res, next) => {
  try {
    const about = await About.findOne();

    if (!about || !about.profileImage) {
      return res.status(404).json({
        success: false,
        message: 'Profil resmi bulunamadı'
      });
    }

    // Profil resmini Cloudinary'den sil
    if (about.profileImage.includes('cloudinary')) {
      try {
        const urlParts = about.profileImage.split('/');
        const uploadIndex = urlParts.indexOf('upload');
        const pathAfterUpload = urlParts.slice(uploadIndex + 1);
        const startIndex = pathAfterUpload[0].startsWith('v') ? 1 : 0;
        const publicId = pathAfterUpload.slice(startIndex).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error('Cloudinary silme hatası:', err);
      }
    }

    // Veritabanından profil resmi referansını sil
    about.profileImage = null;
    await about.save();

    res.status(200).json({
      success: true,
      message: 'Profil resmi başarıyla silindi'
    });
  } catch (error) {
    next(error);
  }
};
