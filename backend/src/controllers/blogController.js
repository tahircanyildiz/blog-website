const Blog = require('../models/Blog');
const { validationResult } = require('express-validator');

/**
 * @desc    Tüm blog yazılarını listele
 * @route   GET /api/blogs
 * @access  Public
 */
exports.getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find()
      .select('title shortDescription publishDate slug tags viewCount')
      .sort({ publishDate: -1 }); // En yeni yazılar önce

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Tek bir blog yazısının detayını getir
 * @route   GET /api/blogs/:id
 * @access  Public
 */
exports.getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog yazısı bulunamadı'
      });
    }

    // Görüntülenme sayısını artır
    blog.viewCount += 1;
    await blog.save();

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    // Geçersiz ObjectId hatası
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Blog yazısı bulunamadı'
      });
    }
    next(error);
  }
};

/**
 * @desc    Yeni blog yazısı oluştur
 * @route   POST /api/blogs
 * @access  Private (Admin)
 */
exports.createBlog = async (req, res, next) => {
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

    const { title, content, shortDescription, publishDate, tags } = req.body;

    const blog = await Blog.create({
      title,
      content,
      shortDescription,
      publishDate: publishDate || Date.now(),
      tags
    });

    res.status(201).json({
      success: true,
      message: 'Blog yazısı oluşturuldu',
      data: blog
    });
  } catch (error) {
    // Unique slug hatası
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Bu başlıkta bir blog yazısı zaten mevcut'
      });
    }
    next(error);
  }
};

/**
 * @desc    Blog yazısını güncelle
 * @route   PUT /api/blogs/:id
 * @access  Private (Admin)
 */
exports.updateBlog = async (req, res, next) => {
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

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog yazısı bulunamadı'
      });
    }

    const { title, content, shortDescription, publishDate, tags } = req.body;

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.shortDescription = shortDescription || blog.shortDescription;
    blog.publishDate = publishDate || blog.publishDate;
    blog.tags = tags || blog.tags;

    // Başlık değiştiyse slug'ı sıfırla (pre-save hook yeni slug oluşturacak)
    if (title && title !== blog.title) {
      blog.slug = undefined;
    }

    await blog.save();

    res.status(200).json({
      success: true,
      message: 'Blog yazısı güncellendi',
      data: blog
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Blog yazısı bulunamadı'
      });
    }
    next(error);
  }
};

/**
 * @desc    Blog yazısını sil
 * @route   DELETE /api/blogs/:id
 * @access  Private (Admin)
 */
exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog yazısı bulunamadı'
      });
    }

    await blog.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Blog yazısı silindi',
      data: {}
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Blog yazısı bulunamadı'
      });
    }
    next(error);
  }
};
