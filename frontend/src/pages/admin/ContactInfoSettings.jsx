import { useState, useEffect } from 'react';
import { getSettings, updateContactInfo } from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';
import { Mail, Phone, MapPin, Info, Save } from 'lucide-react';

const ContactInfoSettings = () => {
  const { theme } = useTheme();
  const isGlass = theme === 'glass';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    location: ''
  });

  const [validationErrors, setValidationErrors] = useState({});

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await getSettings();
      if (response.data && response.data.contactInfo) {
        setFormData({
          email: response.data.contactInfo.email || '',
          phone: response.data.contactInfo.phone || '',
          location: response.data.contactInfo.location || ''
        });
      }
    } catch (err) {
      showNotification(err.response?.data?.message || 'Ayarlar yüklenirken bir hata oluştu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (formData.email && formData.email.trim() !== '') {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = 'Geçerli bir e-posta adresi giriniz';
      }
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSaving(true);
      await updateContactInfo({
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        location: formData.location.trim()
      });
      showNotification('İletişim bilgileri başarıyla güncellendi!', 'success');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Kaydetme sırasında bir hata oluştu', 'error');
    } finally {
      setSaving(false);
    }
  };

  const cardClass = isGlass
    ? 'bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl'
    : 'bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-2xl';
  const headingClass = isGlass ? 'text-white' : 'text-gray-900 dark:text-white';
  const subTextClass = isGlass ? 'text-indigo-300' : 'text-gray-600 dark:text-gray-400';
  const labelClass = isGlass ? 'text-indigo-200' : 'text-gray-700 dark:text-gray-300';
  const hintClass = isGlass ? 'text-indigo-400/70' : 'text-gray-500 dark:text-gray-500';
  const inputClass = isGlass
    ? 'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-500'
    : 'w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors';

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Bildirim */}
      {notification.show && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl text-white text-sm font-medium transition-all duration-300 ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {notification.message}
        </div>
      )}

      <div className={`${cardClass} p-8`}>
        {/* Başlık */}
        <div className="mb-6">
          <h1 className={`text-3xl font-bold mb-2 ${headingClass}`}>İletişim Bilgileri Ayarları</h1>
          <p className={subTextClass}>
            İletişim sayfasında görünecek e-posta ve konum bilgilerinizi buradan yönetebilirsiniz.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* E-posta */}
          <div>
            <label htmlFor="email" className={`flex items-center text-sm font-medium mb-2 ${labelClass}`}>
              <Mail className={`w-5 h-5 mr-2 ${isGlass ? 'text-indigo-400' : 'text-indigo-600 dark:text-indigo-400'}`} />
              E-posta Adresi
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your-email@example.com"
              className={`${inputClass} ${validationErrors.email ? '!border-red-500' : ''}`}
            />
            {validationErrors.email && (
              <p className="mt-1 text-sm text-red-400">{validationErrors.email}</p>
            )}
            <p className={`mt-1 text-sm ${hintClass}`}>
              İletişim sayfasında görüntülenecek e-posta adresiniz
            </p>
          </div>

          {/* Telefon Numarası */}
          <div>
            <label htmlFor="phone" className={`flex items-center text-sm font-medium mb-2 ${labelClass}`}>
              <Phone className={`w-5 h-5 mr-2 ${isGlass ? 'text-indigo-400' : 'text-indigo-600 dark:text-indigo-400'}`} />
              Telefon Numarası
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+90 xxx xxx xx xx"
              className={inputClass}
            />
            <p className={`mt-1 text-sm ${hintClass}`}>
              Bu numara sadece PDF CV'de görünecek, iletişim sayfasında görünmeyecek
            </p>
          </div>

          {/* Konum/Adres */}
          <div>
            <label htmlFor="location" className={`flex items-center text-sm font-medium mb-2 ${labelClass}`}>
              <MapPin className={`w-5 h-5 mr-2 ${isGlass ? 'text-indigo-400' : 'text-indigo-600 dark:text-indigo-400'}`} />
              Konum/Adres
            </label>
            <textarea
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Örn: İstanbul, Türkiye veya tam adres"
              rows={3}
              className={`${inputClass} resize-none`}
            />
            <p className={`mt-1 text-sm ${hintClass}`}>
              İletişim sayfasında görüntülenecek konum veya adres bilgisi
            </p>
          </div>

          {/* Bilgilendirme */}
          <div className={`rounded-xl p-4 ${
            isGlass
              ? 'bg-blue-500/10 border border-blue-500/20'
              : 'bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className={`h-5 w-5 ${isGlass ? 'text-blue-400' : 'text-blue-400'}`} />
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${isGlass ? 'text-blue-300' : 'text-blue-800 dark:text-blue-300'}`}>Bilgi</h3>
                <div className={`mt-2 text-sm ${isGlass ? 'text-blue-300/80' : 'text-blue-700 dark:text-blue-300/80'}`}>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Bu bilgiler iletişim sayfasında ziyaretçilere gösterilecektir</li>
                    <li>E-posta adresi otomatik olarak doğrulanacaktır</li>
                    <li>Alanları boş bırakabilirsiniz, boş alanlar görünmeyecektir</li>
                    <li>Değişiklikler anında iletişim sayfasına yansıyacaktır</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Önizleme */}
          <div className={`rounded-xl p-6 ${
            isGlass
              ? 'bg-white/5 border border-white/10'
              : 'bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-700'
          }`}>
            <h3 className={`text-lg font-medium mb-4 ${headingClass}`}>Önizleme</h3>
            <div className="space-y-4">
              {formData.email && formData.email.trim() !== '' && (
                <div className="flex items-start">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                    isGlass ? 'bg-indigo-500/20' : 'bg-indigo-50 dark:bg-indigo-500/10'
                  }`}>
                    <Mail className={`w-6 h-6 ${isGlass ? 'text-indigo-300' : 'text-indigo-600 dark:text-indigo-400'}`} />
                  </div>
                  <div className="ml-4">
                    <h4 className={`text-sm font-medium ${headingClass}`}>E-posta</h4>
                    <p className={subTextClass}>{formData.email}</p>
                  </div>
                </div>
              )}

              {formData.location && formData.location.trim() !== '' && (
                <div className="flex items-start">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                    isGlass ? 'bg-indigo-500/20' : 'bg-indigo-50 dark:bg-indigo-500/10'
                  }`}>
                    <MapPin className={`w-6 h-6 ${isGlass ? 'text-indigo-300' : 'text-indigo-600 dark:text-indigo-400'}`} />
                  </div>
                  <div className="ml-4">
                    <h4 className={`text-sm font-medium ${headingClass}`}>Konum</h4>
                    <p className={`${subTextClass} whitespace-pre-line`}>{formData.location}</p>
                  </div>
                </div>
              )}

              {(!formData.email || formData.email.trim() === '') && (!formData.location || formData.location.trim() === '') && (
                <p className={`text-center py-4 ${subTextClass}`}>Henüz bilgi girmediniz</p>
              )}
            </div>
          </div>

          {/* Kaydet Butonu */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Kaydet
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactInfoSettings;
