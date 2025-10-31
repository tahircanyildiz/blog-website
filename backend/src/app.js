const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

// Route dosyalarını import et
const authRoutes = require('./routes/authRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const blogRoutes = require('./routes/blogRoutes');
const contactRoutes = require('./routes/contactRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

const app = express();

// Middleware'ler
app.use(cors()); // CORS aktif
app.use(express.json()); // JSON body parser
app.use(express.urlencoded({ extended: true })); // URL-encoded body parser

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Ana sayfa için basit bir route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Blog API\'ye hoş geldiniz',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      about: '/api/about',
      blogs: '/api/blogs',
      contact: '/api/contact',
      settings: '/api/settings'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);

// 404 handler - Tanımlanmamış route'lar için
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route bulunamadı'
  });
});
app.get('/ping', (req, res) => {
  // opsiyonel: secret kontrolü
  const secret = process.env.PING_SECRET;
  const token = req.query.token || req.headers['x-ping-token'];
  if (secret && token !== secret) {
    return res.status(401).json({ ok: false, msg: 'unauthorized' });
  }

  // opsiyonel: basit health check - DB bağlantısını kontrol edebilirsin
  // örn: if (mongoose.connection.readyState !== 1) return res.status(503).json({ ok: false });
  return res.status(200).json({ ok: true, ts: Date.now() });
});
// Global error handler middleware (en sonda olmalı)
app.use(errorHandler);

module.exports = app;
