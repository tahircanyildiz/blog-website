import { useState, useEffect } from 'react';
import { getSettings, updateSocialMedia } from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';
import SocialMediaIcon from '../../components/SocialMediaIcon';
import { Info, Save } from 'lucide-react';

const SocialMediaSettings = () => {
  const { theme } = useTheme();
  const isGlass = theme === 'glass';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const platforms = [
    { id: 'github', name: 'GitHub', placeholder: 'https://github.com/username' },
    { id: 'linkedin', name: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
    { id: 'twitter', name: 'Twitter/X', placeholder: 'https://twitter.com/username' },
    { id: 'instagram', name: 'Instagram', placeholder: 'https://instagram.com/username' },
    { id: 'facebook', name: 'Facebook', placeholder: 'https://facebook.com/username' },
    { id: 'youtube', name: 'YouTube', placeholder: 'https://youtube.com/@username' },
    { id: 'medium', name: 'Medium', placeholder: 'https://medium.com/@username' },
    { id: 'tiktok', name: 'TikTok', placeholder: 'https://tiktok.com/@username' },
    { id: 'discord', name: 'Discord', placeholder: 'https://discord.gg/invite' },
    { id: 'telegram', name: 'Telegram', placeholder: 'https://t.me/username' },
    { id: 'whatsapp', name: 'WhatsApp', placeholder: 'https://wa.me/905xxxxxxxxx' },
    { id: 'email', name: 'Email', placeholder: 'mailto:your-email@example.com' },
  ];

  const [socialMediaData, setSocialMediaData] = useState({});

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
      const data = {};
      if (response.data && response.data.socialMedia) {
        response.data.socialMedia.forEach(item => {
          data[item.platform] = item.url;
        });
      }
      setSocialMediaData(data);
    } catch (err) {
      showNotification(err.response?.data?.message || 'Ayarlar yüklenirken bir hata oluştu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (platform, value) => {
    setSocialMediaData(prev => ({
      ...prev,
      [platform]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const socialMedia = Object.entries(socialMediaData)
        .filter(([_, url]) => url && url.trim() !== '')
        .map(([platform, url]) => ({
          platform,
          url: url.trim(),
          isActive: true
        }));

      await updateSocialMedia(socialMedia);
      showNotification('Sosyal medya ayarları başarıyla güncellendi!', 'success');
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
  const inputClass = isGlass
    ? 'w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-500'
    : 'w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors';

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
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
          <h1 className={`text-3xl font-bold mb-2 ${headingClass}`}>Sosyal Medya Ayarları</h1>
          <p className={subTextClass}>
            Sosyal medya hesaplarınızı buradan yönetebilirsiniz. Sadece doldurduğunuz alanlar footer ve iletişim sayfasında görünecektir.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {platforms.map(platform => (
              <div key={platform.id} className="space-y-2">
                <label className={`flex items-center text-sm font-medium ${labelClass}`}>
                  <div className={`mr-2 ${isGlass ? 'text-indigo-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
                    <SocialMediaIcon platform={platform.id} className="w-5 h-5" />
                  </div>
                  {platform.name}
                </label>
                <input
                  type="text"
                  value={socialMediaData[platform.id] || ''}
                  onChange={(e) => handleInputChange(platform.id, e.target.value)}
                  placeholder={platform.placeholder}
                  className={inputClass}
                />
              </div>
            ))}
          </div>

          {/* Bilgilendirme */}
          <div className={`rounded-xl p-4 ${
            isGlass
              ? 'bg-blue-500/10 border border-blue-500/20'
              : 'bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className={`h-5 w-5 ${isGlass ? 'text-blue-400' : 'text-blue-400 dark:text-blue-400'}`} />
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${isGlass ? 'text-blue-300' : 'text-blue-800 dark:text-blue-300'}`}>Bilgi</h3>
                <div className={`mt-2 text-sm ${isGlass ? 'text-blue-300/80' : 'text-blue-700 dark:text-blue-300/80'}`}>
                  <ul className="list-disc list-inside space-y-1">
                    <li>URL'leri tam olarak girin (https:// ile başlayarak)</li>
                    <li>Email için "mailto:email@example.com" formatını kullanın</li>
                    <li>Boş bıraktığınız platformlar görünmeyecektir</li>
                    <li>Değişiklikler anında footer ve iletişim sayfasına yansıyacaktır</li>
                  </ul>
                </div>
              </div>
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

export default SocialMediaSettings;
