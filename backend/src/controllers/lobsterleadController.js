const Blog = require('../models/Blog');

/**
 * @desc    LobsterLead'den gelen blog içeriğini yayınla
 * @route   POST /api/lobsterlead/publish
 * @access  Private (API Key)
 */
exports.publishBlog = async (req, res, next) => {
  try {
    const { title, content, shortDescription, summary, description, tags, slug, publishDate } = req.body;

    // Gerekli alanları kontrol et
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'title ve content alanları zorunludur'
      });
    }

    // shortDescription için fallback: summary, description veya içerikten ilk 200 karakter
    const finalShortDescription = shortDescription || summary || description ||
      content.replace(/<[^>]*>/g, '').substring(0, 200);

    // Blog oluştur
    const blogData = {
      title,
      content,
      shortDescription: finalShortDescription.substring(0, 200),
      publishDate: publishDate || Date.now(),
      tags: tags || []
    };

    // Eğer slug gönderilmişse kullan
    if (slug) {
      blogData.slug = slug;
    }

    const blog = await Blog.create(blogData);

    res.status(201).json({
      success: true,
      message: 'Blog başarıyla yayınlandı',
      data: {
        id: blog._id,
        title: blog.title,
        slug: blog.slug,
        publishDate: blog.publishDate
      }
    });
  } catch (error) {
    // Unique slug hatası
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Bu slug/başlık ile bir blog yazısı zaten mevcut'
      });
    }
    next(error);
  }
};

/**
 * @desc    LobsterLead'den gelen blog içeriğini güncelle
 * @route   PUT /api/lobsterlead/publish/:slug
 * @access  Private (API Key)
 */
exports.updateBlog = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { title, content, shortDescription, summary, description, tags, publishDate } = req.body;

    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog yazısı bulunamadı'
      });
    }

    // Güncellenecek alanlar
    if (title) blog.title = title;
    if (content) blog.content = content;
    if (shortDescription || summary || description) {
      blog.shortDescription = (shortDescription || summary || description).substring(0, 200);
    }
    if (tags) blog.tags = tags;
    if (publishDate) blog.publishDate = publishDate;

    await blog.save();

    res.status(200).json({
      success: true,
      message: 'Blog başarıyla güncellendi',
      data: {
        id: blog._id,
        title: blog.title,
        slug: blog.slug,
        publishDate: blog.publishDate
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    LobsterLead'den gelen blog içeriğini sil
 * @route   DELETE /api/lobsterlead/publish/:slug
 * @access  Private (API Key)
 */
exports.deleteBlog = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOneAndDelete({ slug });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog yazısı bulunamadı'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Blog başarıyla silindi'
    });
  } catch (error) {
    next(error);
  }
};
