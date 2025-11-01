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
const pingRoutes = require('./routes/pingRoutes');

const app = express();

// Middleware'ler
app.use(cors()); // CORS aktif
app.use(express.json({ limit: '50mb' })); // JSON body parser with 50MB limit
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // URL-encoded body parser with 50MB limit

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
      settings: '/api/settings',
      ping: '/api/ping'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/ping', pingRoutes);

// 404 handler - Tanımlanmamış route'lar için
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route bulunamadı'
  });
});

// Global error handler middleware (en sonda olmalı)
app.use(errorHandler);

module.exports = app;
