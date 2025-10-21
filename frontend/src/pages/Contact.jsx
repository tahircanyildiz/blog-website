import { useState, useEffect } from 'react';
import { Mail, MapPin, Send, Link as LinkIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { sendContactMessage, getSettings } from '../services/api';
import SocialMediaIcon from '../components/SocialMediaIcon';

/**
 * İletişim Sayfası
 * Kullanıcıların mesaj göndermesini sağlar
 */
function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error'

  // İletişim bilgileri ve sosyal medya
  const [contactInfo, setContactInfo] = useState({
    email: '',
    location: ''
  });
  const [socialMedia, setSocialMedia] = useState([]);

  // Sayfa yüklendiğinde ayarları getir
  useEffect(() => {
    fetchContactSettings();
  }, []);

  const fetchContactSettings = async () => {
    try {
      const response = await getSettings();
      if (response.data) {
        // İletişim bilgilerini al
        if (response.data.contactInfo) {
          setContactInfo(response.data.contactInfo);
        }
        // Sosyal medya bilgilerini al
        if (response.data.socialMedia) {
          const activePlatforms = response.data.socialMedia.filter(item => item.isActive && item.url);
          setSocialMedia(activePlatforms);
        }
      }
    } catch (error) {
      console.error('İletişim bilgileri yüklenirken hata oluştu:', error);
    }
  };

  // Platform adlarını düzgün göstermek için
  const getPlatformLabel = (platform) => {
    const labels = {
      github: 'GitHub',
      linkedin: 'LinkedIn',
      twitter: 'Twitter/X',
      instagram: 'Instagram',
      facebook: 'Facebook',
      youtube: 'YouTube',
      medium: 'Medium',
      tiktok: 'TikTok',
      discord: 'Discord',
      telegram: 'Telegram',
      whatsapp: 'WhatsApp',
      email: 'Email'
    };
    return labels[platform] || platform;
  };

  // Input değişikliklerini takip et
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Hata mesajını temizle
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Form validasyonu
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'İsim alanı zorunludur';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-posta alanı zorunludur';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Mesaj alanı zorunludur';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Mesaj en az 10 karakter olmalıdır';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form gönderimi
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasyon kontrolü
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setSubmitStatus(null);

      await sendContactMessage(formData);

      // Başarılı - Formu temizle
      setFormData({
        name: '',
        email: '',
        message: '',
      });
      setSubmitStatus('success');

      // 5 saniye sonra başarı mesajını kaldır
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    } catch (err) {
      setSubmitStatus('error');
      console.error('Form gönderme hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-violet-50 py-12">
      {/* Decorative gradient shapes */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400 to-violet-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-r from-violet-400 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      {/* Background Logo - Fixed Position */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <img
          src="/logotcy.png"
          alt="Background Logo"
          className="w-[600px] h-[600px] object-contain opacity-5 select-none"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Başlık */}
        <div className="text-center mb-12">
          {/* Logo
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <img
                src="/logotcy.png"
                alt="Logo"
                className="h-24 w-24 object-contain rounded-2xl shadow-2xl ring-4 ring-white"
              />
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg">
                <Mail className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div> */}

          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-violet-900 bg-clip-text text-transparent mb-4">
            İletişim
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Benimle iletişime geçmek için aşağıdaki formu kullanabilirsiniz
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* İletişim Bilgileri */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-blue-100">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-violet-900 bg-clip-text text-transparent mb-6">
              İletişim Bilgileri
            </h2>

            <div className="space-y-6">
              {/* Email - Dinamik */}
              {contactInfo.email && contactInfo.email.trim() !== '' && (
                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-violet-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Mail className="w-6 h-6 text-blue-600" strokeWidth={2} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">E-posta</h3>
                    <a href={`mailto:${contactInfo.email}`} className="text-blue-600 hover:text-blue-700 transition-colors font-medium">
                      {contactInfo.email}
                    </a>
                  </div>
                </div>
              )}

              {/* Konum - Dinamik */}
              {contactInfo.location && contactInfo.location.trim() !== '' && (
                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-violet-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-6 h-6 text-blue-600" strokeWidth={2} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Konum</h3>
                    <p className="text-gray-600 whitespace-pre-line">{contactInfo.location}</p>
                  </div>
                </div>
              )}

              {/* Sosyal Medya - Dinamik */}
              {socialMedia.length > 0 && (
                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-violet-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <LinkIcon className="w-6 h-6 text-blue-600" strokeWidth={2} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Sosyal Medya</h3>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {socialMedia.map((item) => (
                        <a
                          key={item.platform}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 transition-all transform hover:scale-110 duration-300"
                          aria-label={getPlatformLabel(item.platform)}
                          title={getPlatformLabel(item.platform)}
                        >
                          <SocialMediaIcon platform={item.platform} className="w-6 h-6" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Hiç bilgi yoksa */}
              {!contactInfo.email && !contactInfo.location && socialMedia.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>İletişim bilgileri henüz eklenmemiş.</p>
                </div>
              )}
            </div>
          </div>

          {/* İletişim Formu */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-violet-100">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-violet-900 bg-clip-text text-transparent mb-6">
              Mesaj Gönder
            </h2>

            {/* Başarı Mesajı */}
            {submitStatus === 'success' && (
              <div className="mb-6 bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl shadow-md">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" strokeWidth={2.5} />
                  <p className="font-semibold">Mesajınız başarıyla gönderildi!</p>
                </div>
              </div>
            )}

            {/* Hata Mesajı */}
            {submitStatus === 'error' && (
              <div className="mb-6 bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-md">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" strokeWidth={2.5} />
                  <p className="font-semibold">Mesaj gönderilemedi. Lütfen tekrar deneyin.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* İsim */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  İsim <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Adınız Soyadınız"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* E-posta */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  E-posta <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="email@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* Mesaj */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Mesaj <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors resize-none ${
                    errors.message ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Mesajınızı buraya yazın..."
                ></textarea>
                {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
              </div>

              {/* Gönder Butonu */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-semibold
                         hover:from-blue-700 hover:to-violet-700 transition-all duration-300 shadow-lg hover:shadow-xl
                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-105"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" strokeWidth={2.5} />
                    Gönder
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
