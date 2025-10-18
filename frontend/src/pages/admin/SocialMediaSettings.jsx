import React, { useState, useEffect } from 'react';
import { getSettings, updateSocialMedia } from '../../services/api';
import SocialMediaIcon from '../../components/SocialMediaIcon';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';

const SocialMediaSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Tüm desteklenen platformlar
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

  // Form state - her platform için URL
  const [socialMediaData, setSocialMediaData] = useState({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getSettings();

      // Mevcut verileri forma yükle
      const data = {};
      if (response.data && response.data.socialMedia) {
        response.data.socialMedia.forEach(item => {
          data[item.platform] = item.url;
        });
      }
      setSocialMediaData(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Ayarlar yüklenirken bir hata oluştu');
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
      setError(null);
      setSuccess(false);

      // Sadece dolu olan platformları gönder
      const socialMedia = Object.entries(socialMediaData)
        .filter(([_, url]) => url && url.trim() !== '')
        .map(([platform, url]) => ({
          platform,
          url: url.trim(),
          isActive: true
        }));

      await updateSocialMedia(socialMedia);

      setSuccess(true);

      // 3 saniye sonra başarı mesajını kaldır
      setTimeout(() => {
        setSuccess(false);
      }, 3000);

    } catch (err) {
      setError(err.response?.data?.message || 'Kaydetme sırasında bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Başlık */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sosyal Medya Ayarları</h1>
          <p className="text-gray-600">
            Sosyal medya hesaplarınızı buradan yönetebilirsiniz. Sadece doldurduğunuz alanlar footer ve iletişim sayfasında görünecektir.
          </p>
        </div>

        {/* Başarı Mesajı */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            Sosyal medya ayarları başarıyla güncellendi!
          </div>
        )}

        {/* Hata Mesajı */}
        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} />
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {platforms.map(platform => (
              <div key={platform.id} className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <div className="mr-2 text-primary-600">
                    <SocialMediaIcon platform={platform.id} className="w-5 h-5" />
                  </div>
                  {platform.name}
                </label>
                <input
                  type="text"
                  value={socialMediaData[platform.id] || ''}
                  onChange={(e) => handleInputChange(platform.id, e.target.value)}
                  placeholder={platform.placeholder}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                />
              </div>
            ))}
          </div>

          {/* Bilgilendirme */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Bilgi</h3>
                <div className="mt-2 text-sm text-blue-700">
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
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {saving ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Kaydediliyor...
                </span>
              ) : (
                'Kaydet'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SocialMediaSettings;
