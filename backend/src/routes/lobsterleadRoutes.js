const express = require('express');
const router = express.Router();
const lobsterleadAuth = require('../middleware/lobsterleadAuth');
const {
  publishBlog,
  updateBlog,
  deleteBlog
} = require('../controllers/lobsterleadController');

/**
 * @route   GET /api/lobsterlead
 * @desc    LobsterLead entegrasyonu test endpoint'i
 * @access  Public
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'LobsterLead entegrasyonu aktif',
    endpoints: {
      publish: 'POST /api/lobsterlead/publish',
      update: 'PUT /api/lobsterlead/publish/:slug',
      delete: 'DELETE /api/lobsterlead/publish/:slug'
    }
  });
});

/**
 * @route   POST /api/lobsterlead/publish
 * @desc    LobsterLead'den yeni blog içeriği al ve yayınla
 * @access  Private (API Key)
 */
router.post('/publish', lobsterleadAuth, publishBlog);

/**
 * @route   PUT /api/lobsterlead/publish/:slug
 * @desc    LobsterLead'den blog içeriğini güncelle
 * @access  Private (API Key)
 */
router.put('/publish/:slug', lobsterleadAuth, updateBlog);

/**
 * @route   DELETE /api/lobsterlead/publish/:slug
 * @desc    LobsterLead'den blog içeriğini sil
 * @access  Private (API Key)
 */
router.delete('/publish/:slug', lobsterleadAuth, deleteBlog);

module.exports = router;
