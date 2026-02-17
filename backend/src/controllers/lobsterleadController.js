const Blog = require('../models/Blog');

/**
 * @desc    LobsterLead'den gelen blog içeriğini yayınla
 * @route   POST /api/lobsterlead/publish
 * @access  Private (API Key)
 */
exports.publishBlog = async (req, res, next) => {
  try {
    const {
      title,
      content,
      metaDescription,
      status,
      seoKeywords,
      coverImage,
      coverImageAlt
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'title ve content alanları zorunludur'
      });
    }

    // metaDescription'dan shortDescription oluştur
    const shortDescription = metaDescription
      ? metaDescription.substring(0, 500)
      : content.replace(/<[^>]*>/g, '').substring(0, 500);

    // seoKeywords string'ini tags array'ine dönüştür
    const tags = seoKeywords
      ? seoKeywords.split(',').map(k => k.trim()).filter(k => k.length > 0)
      : [];

    const blog = await Blog.create({
      title,
      content,
      shortDescription,
      metaDescription,
      status: status === 'draft' ? 'draft' : 'published',
      seoKeywords,
      coverImage,
      coverImageAlt,
      tags,
      publishDate: Date.now()
    });

    res.status(201).json({
      success: true,
      message: 'Blog başarıyla yayınlandı',
      data: {
        id: blog._id,
        title: blog.title,
        content: blog.content,
        shortDescription: blog.shortDescription,
        metaDescription: blog.metaDescription,
        status: blog.status,
        seoKeywords: blog.seoKeywords,
        coverImage: blog.coverImage,
        coverImageAlt: blog.coverImageAlt,
        slug: blog.slug,
        tags: blog.tags,
        publishDate: blog.publishDate
      }
    });
  } catch (error) {
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
    const {
      title,
      content,
      metaDescription,
      status,
      seoKeywords,
      coverImage,
      coverImageAlt
    } = req.body;

    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog yazısı bulunamadı'
      });
    }

    if (title) blog.title = title;
    if (content) blog.content = content;
    if (metaDescription) {
      blog.metaDescription = metaDescription;
      blog.shortDescription = metaDescription.substring(0, 500);
    }
    if (status) blog.status = status;
    if (seoKeywords) {
      blog.seoKeywords = seoKeywords;
      blog.tags = seoKeywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
    }
    if (coverImage) blog.coverImage = coverImage;
    if (coverImageAlt) blog.coverImageAlt = coverImageAlt;

    await blog.save();

    res.status(200).json({
      success: true,
      message: 'Blog başarıyla güncellendi',
      data: {
        id: blog._id,
        title: blog.title,
        content: blog.content,
        shortDescription: blog.shortDescription,
        metaDescription: blog.metaDescription,
        status: blog.status,
        seoKeywords: blog.seoKeywords,
        coverImage: blog.coverImage,
        coverImageAlt: blog.coverImageAlt,
        slug: blog.slug,
        tags: blog.tags,
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
