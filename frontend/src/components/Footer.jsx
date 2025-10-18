import { useState, useEffect } from 'react';
import { getSettings } from '../services/api';
import SocialMediaIcon from './SocialMediaIcon';

/**
 * Footer bileşeni - Tüm sayfalarda alt kısımda görünür
 * Sosyal medya linkleri ve telif hakkı bilgisi
 * Sosyal medya linkleri dinamik olarak backend'den alınır
 */
function Footer() {
  const currentYear = new Date().getFullYear();
  const [socialMedia, setSocialMedia] = useState([]);

  useEffect(() => {
    fetchSocialMedia();
  }, []);

  const fetchSocialMedia = async () => {
    try {
      const response = await getSettings();
      if (response.data && response.data.socialMedia) {
        // Sadece aktif olan platformları göster
        const activePlatforms = response.data.socialMedia.filter(item => item.isActive && item.url);
        setSocialMedia(activePlatforms);
      }
    } catch (error) {
      console.error('Sosyal medya bilgileri yüklenirken hata oluştu:', error);
      // Hata durumunda boş array ile devam et
      setSocialMedia([]);
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

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Sol Taraf - Telif Hakkı */}
          <div className="text-center md:text-left">
            <p className="text-gray-400">
              © {currentYear} Tüm hakları saklıdır.
            </p>
          </div>

          {/* Sağ Taraf - Sosyal Medya Linkleri (Dinamik) */}
          {socialMedia.length > 0 && (
            <div className="flex space-x-6">
              {socialMedia.map((item) => (
                <a
                  key={item.platform}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={getPlatformLabel(item.platform)}
                >
                  <SocialMediaIcon platform={item.platform} className="w-6 h-6" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
