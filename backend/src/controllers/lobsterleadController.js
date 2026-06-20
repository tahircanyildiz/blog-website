const Blog = require('../models/Blog');
const { uploadBlogImage } = require('../config/cloudinary');

function resolveCoverImage(coverImage, coverImageAlt) {
  if (coverImage && typeof coverImage === 'object') {
    return { url: coverImage.url || '', alt: coverImage.alt || '' };
  }
  return { url: coverImage || '', alt: coverImageAlt || '' };
}

function resolveTags(tags, seoKeywords) {
  if (Array.isArray(tags)) return tags;
  if (seoKeywords) return seoKeywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
  return [];
}

function resolveStatus(publish, status) {
  if (publish !== undefined) return publish ? 'published' : 'draft';
  return status === 'draft' ? 'draft' : 'published';
}

function buildPostResponse(blog, siteUrl) {
  return {
    id: blog._id,
    title: blog.title,
    slug: blog.slug,
    status: blog.status,
    locale: blog.locale,
    metaDescription: blog.metaDescription,
    coverImage: blog.coverImage,
    coverImageAlt: blog.coverImageAlt,
    tags: blog.tags,
    correlationId: blog.correlationId,
    publishDate: blog.publishDate,
    url: siteUrl ? `${siteUrl}/blog/${blog.slug}` : undefined
  };
}

/**
 * @desc    LobsterLead'den gelen blog içeriğini yayınla (idempotent)
 * @route   POST /api/lobsterlead/publish
 * @access  Private (API Key)
 */
exports.publishBlog = async (req, res, next) => {
  try {
    const {
      title,
      bodyHtml, content,
      metaDescription,
      status, publish,
      seoKeywords, tags,
      coverImage, coverImageAlt,
      correlationId,
      locale
    } = req.body;

    const bodyContent = bodyHtml || content;

    if (!title || !bodyContent) {
      return res.status(400).json({
        success: false,
        message: 'title ve bodyHtml (veya content) alanları zorunludur'
      });
    }

    const resolvedCover = resolveCoverImage(coverImage, coverImageAlt);
    const resolvedTags = resolveTags(tags, seoKeywords);
    const resolvedStatus = resolveStatus(publish, status);
    const resolvedLocale = locale || 'tr';
    const shortDescription = metaDescription
      ? metaDescription.substring(0, 500)
      : bodyContent.replace(/<[^>]*>/g, '').substring(0, 500);
    const siteUrl = process.env.SITE_URL || '';

    // Idempotency: correlationId varsa güncelle
    if (correlationId) {
      const existing = await Blog.findOne({ correlationId });
      if (existing) {
        existing.title = title;
        existing.content = bodyContent;
        existing.shortDescription = shortDescription;
        existing.metaDescription = metaDescription || existing.metaDescription;
        existing.status = resolvedStatus;
        existing.coverImage = resolvedCover.url;
        existing.coverImageAlt = resolvedCover.alt;
        existing.tags = resolvedTags;
        existing.seoKeywords = Array.isArray(tags) ? tags.join(', ') : (seoKeywords || '');
        existing.locale = resolvedLocale;

        await existing.save();

        return res.status(200).json({
          post: buildPostResponse(existing, siteUrl),
          idempotent: true,
          operation: 'updated'
        });
      }
    }

    const blog = await Blog.create({
      title,
      content: bodyContent,
      shortDescription,
      metaDescription,
      status: resolvedStatus,
      coverImage: resolvedCover.url,
      coverImageAlt: resolvedCover.alt,
      tags: resolvedTags,
      seoKeywords: Array.isArray(tags) ? tags.join(', ') : (seoKeywords || ''),
      correlationId: correlationId || undefined,
      locale: resolvedLocale,
      publishDate: Date.now()
    });

    res.status(201).json({
      post: buildPostResponse(blog, siteUrl),
      idempotent: false,
      operation: 'created'
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Bu slug/başlık veya correlationId ile bir blog yazısı zaten mevcut'
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
      bodyHtml, content,
      metaDescription,
      status, publish,
      seoKeywords, tags,
      coverImage, coverImageAlt,
      locale
    } = req.body;

    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog yazısı bulunamadı'
      });
    }

    const bodyContent = bodyHtml || content;

    if (title) blog.title = title;
    if (bodyContent) blog.content = bodyContent;
    if (metaDescription) {
      blog.metaDescription = metaDescription;
      blog.shortDescription = metaDescription.substring(0, 500);
    }
    if (publish !== undefined || status) {
      blog.status = resolveStatus(publish, status);
    }
    if (tags !== undefined || seoKeywords !== undefined) {
      const resolvedTags = resolveTags(tags, seoKeywords);
      blog.tags = resolvedTags;
      blog.seoKeywords = Array.isArray(tags) ? tags.join(', ') : (seoKeywords || '');
    }
    if (coverImage !== undefined || coverImageAlt !== undefined) {
      const resolvedCover = resolveCoverImage(coverImage, coverImageAlt);
      blog.coverImage = resolvedCover.url;
      blog.coverImageAlt = resolvedCover.alt;
    }
    if (locale) blog.locale = locale;

    await blog.save();

    const siteUrl = process.env.SITE_URL || '';
    res.status(200).json({
      post: buildPostResponse(blog, siteUrl),
      idempotent: false,
      operation: 'updated'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Blog görseli yükle (Cloudinary)
 * @route   POST /api/lobsterlead/upload-image
 * @access  Private (API Key)
 */
exports.uploadImage = [
  uploadBlogImage.single('image'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Lütfen bir görsel dosyası seçin'
        });
      }

      res.status(200).json({
        success: true,
        imageUrl: req.file.path,
        url: req.file.path,
        alt: req.file.originalname
      });
    } catch (error) {
      next(error);
    }
  }
];

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
