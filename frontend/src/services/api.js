import axios from 'axios';
import { cacheService } from './cache';

/**
 * API base URL - Backend sunucusunun adresi
 * Geliştirme ortamında Vite proxy kullanıldığı için /api yeterli
 * Production'da API_URL environment variable kullanılabilir
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Axios instance oluştur
 */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 saniye
});

/**
 * Request interceptor - Token ekle
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Hataları yakala
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Hata mesajını daha anlaşılır hale getir
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'Bir hata oluştu. Lütfen tekrar deneyin.';

    console.error('API Hatası:', errorMessage);
    return Promise.reject(error);
  }
);

// ==================== ABOUT API ====================

/**
 * Hakkımda bilgisini getir (cache ile)
 */
export const getAbout = async () => {
  const cacheKey = 'about-data';

  // Cache'de varsa direkt dön
  const cached = cacheService.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Yoksa API'den çek ve cache'le
  const response = await api.get('/about');
  cacheService.set(cacheKey, response.data);
  return response.data;
};

/**
 * Hakkımda bilgisini güncelle (Admin)
 */
export const updateAbout = async (data) => {
  const response = await api.put('/about', data);
  cacheService.clear('about-data'); // Cache'i temizle
  return response.data;
};

/**
 * CV dosyasını yükle (Admin)
 * @param {File} file - CV dosyası (PDF)
 */
export const uploadCV = async (file) => {
  const formData = new FormData();
  formData.append('cv', file);

  const response = await api.post('/about/cv', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * CV dosyasını sil (Admin)
 */
export const deleteCV = async () => {
  const response = await api.delete('/about/cv');
  return response.data;
};

/**
 * Profil resmi yükle (Admin)
 */
export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append('profileImage', file);

  const response = await api.post('/about/profile-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Profil resmini sil (Admin)
 */
export const deleteProfileImage = async () => {
  const response = await api.delete('/about/profile-image');
  return response.data;
};

// ==================== BLOG API ====================

/**
 * Tüm blog yazılarını getir (cache ile)
 */
export const getAllBlogs = async () => {
  const cacheKey = 'all-blogs';

  // Cache'de varsa direkt dön
  const cached = cacheService.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Yoksa API'den çek ve cache'le
  const response = await api.get('/blogs');
  cacheService.set(cacheKey, response.data);
  return response.data;
};

/**
 * Tek bir blog yazısını getir (cache ile)
 * @param {string} id - Blog ID
 */
export const getBlogById = async (id) => {
  const cacheKey = `blog-${id}`;

  // Cache'de varsa direkt dön
  const cached = cacheService.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Yoksa API'den çek ve cache'le
  const response = await api.get(`/blogs/${id}`);
  cacheService.set(cacheKey, response.data);
  return response.data;
};

/**
 * Yeni blog yazısı oluştur (Admin)
 */
export const createBlog = async (data) => {
  const response = await api.post('/blogs', data);
  cacheService.clear('all-blogs'); // Cache'i temizle
  return response.data;
};

/**
 * Blog yazısını güncelle (Admin)
 */
export const updateBlog = async (id, data) => {
  const response = await api.put(`/blogs/${id}`, data);
  cacheService.clear('all-blogs'); // Tüm bloglar cache'ini temizle
  cacheService.clear(`blog-${id}`); // Bu blog'un cache'ini temizle
  return response.data;
};

/**
 * Blog yazısını sil (Admin)
 */
export const deleteBlog = async (id) => {
  const response = await api.delete(`/blogs/${id}`);
  cacheService.clear('all-blogs'); // Tüm bloglar cache'ini temizle
  cacheService.clear(`blog-${id}`); // Bu blog'un cache'ini temizle
  return response.data;
};

// ==================== CONTACT API ====================

/**
 * İletişim formu gönder
 * @param {Object} data - {name, email, message}
 */
export const sendContactMessage = async (data) => {
  const response = await api.post('/contact', data);
  return response.data;
};

/**
 * Tüm iletişim mesajlarını getir (Admin)
 */
export const getAllContacts = async () => {
  const response = await api.get('/contact');
  return response.data;
};

/**
 * İletişim mesajını sil (Admin)
 */
export const deleteContact = async (id) => {
  const response = await api.delete(`/contact/${id}`);
  return response.data;
};

// ==================== AUTH API ====================

/**
 * Kullanıcı kaydı
 */
export const register = async (data) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

/**
 * Kullanıcı girişi
 */
export const login = async (data) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

/**
 * Giriş yapan kullanıcının bilgilerini getir
 */
export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// ==================== SETTINGS API ====================

/**
 * Site ayarlarını getir (Public) (cache ile)
 */
export const getSettings = async () => {
  const cacheKey = 'settings-data';

  // Cache'de varsa direkt dön
  const cached = cacheService.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Yoksa API'den çek ve cache'le
  const response = await api.get('/settings');
  cacheService.set(cacheKey, response.data);
  return response.data;
};

/**
 * Sosyal medya ayarlarını güncelle (Admin)
 * @param {Array} socialMedia - [{platform, url, isActive}]
 */
export const updateSocialMedia = async (socialMedia) => {
  const response = await api.put('/settings/social-media', { socialMedia });
  cacheService.clear('settings-data'); // Cache'i temizle
  return response.data;
};

/**
 * İletişim bilgilerini güncelle (Admin)
 * @param {Object} contactInfo - {email, location}
 */
export const updateContactInfo = async (contactInfo) => {
  const response = await api.put('/settings/contact-info', contactInfo);
  cacheService.clear('settings-data'); // Cache'i temizle
  return response.data;
};

/**
 * Tüm ayarları güncelle (Admin)
 */
export const updateSettings = async (data) => {
  const response = await api.put('/settings', data);
  cacheService.clear('settings-data'); // Cache'i temizle
  return response.data;
};

export default api;
