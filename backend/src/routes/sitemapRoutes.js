const express = require('express');
const router = express.Router();
const { getSitemap } = require('../controllers/sitemapController');

// GET /sitemap.xml
router.get('/', getSitemap);

module.exports = router;
