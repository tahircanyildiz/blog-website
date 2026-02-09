const Blog = require('../models/Blog');

/**
 * @desc    Sitemap.xml oluştur
 * @route   GET /sitemap.xml
 * @access  Public
 */
exports.getSitemap = async (req, res, next) => {
  try {
    // Site URL'ini environment variable'dan al, yoksa varsayılan kullan
    const siteUrl = process.env.SITE_URL || 'https://tahircanyildiz.com';
    
    // Tüm blog yazılarını çek
    const blogs = await Blog.find()
      .select('_id publishDate updatedAt')
      .sort({ publishDate: -1 });

    // Statik sayfalar
    const staticPages = [
      { url: '', changefreq: 'weekly', priority: '1.0' },
      { url: '/about', changefreq: 'monthly', priority: '0.8' },
      { url: '/blog', changefreq: 'daily', priority: '0.9' },
      { url: '/contact', changefreq: 'monthly', priority: '0.7' }
    ];

    // XML başlangıç
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Statik sayfaları ekle
    staticPages.forEach(page => {
      xml += '  <url>\n';
      xml += `    <loc>${siteUrl}${page.url}</loc>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += '  </url>\n';
    });

    // Blog yazılarını ekle
    blogs.forEach(blog => {
      const lastmod = blog.updatedAt || blog.publishDate;
      xml += '  <url>\n';
      xml += `    <loc>${siteUrl}/blog/${blog._id}</loc>\n`;
      xml += `    <lastmod>${new Date(lastmod).toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += '  </url>\n';
    });

    // XML bitiş
    xml += '</urlset>';

    // XML olarak döndür
    res.header('Content-Type', 'application/xml');
    res.status(200).send(xml);
  } catch (error) {
    next(error);
  }
};
