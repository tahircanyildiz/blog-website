import axios from 'axios';

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
 * Hakkımda bilgisini getir
 */
export const getAbout = async () => {
  const response = await api.get('/about');
  return response.data;
};

/**
 * Hakkımda bilgisini güncelle (Admin)
 */
export const updateAbout = async (data) => {
  const response = await api.put('/about', data);
  return response.data;
};

// ==================== BLOG API ====================

/**
 * Tüm blog yazılarını getir
 */
export const getAllBlogs = async () => {
  const response = await api.get('/blogs');
  return response.data;
};

/**
 * Tek bir blog yazısını getir
 * @param {string} id - Blog ID
 */
export const getBlogById = async (id) => {
  const response = await api.get(`/blogs/${id}`);
  return response.data;
};

/**
 * Yeni blog yazısı oluştur (Admin)
 */
export const createBlog = async (data) => {
  const response = await api.post('/blogs', data);
  return response.data;
};

/**
 * Blog yazısını güncelle (Admin)
 */
export const updateBlog = async (id, data) => {
  const response = await api.put(`/blogs/${id}`, data);
  return response.data;
};

/**
 * Blog yazısını sil (Admin)
 */
export const deleteBlog = async (id) => {
  const response = await api.delete(`/blogs/${id}`);
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

export default api;
