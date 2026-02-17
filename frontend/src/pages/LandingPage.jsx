import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getAbout, getSettings } from '../services/api';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import ContactSection from './sections/ContactSection';

/**
 * Landing Page - Ana sayfa, Hakkımda ve İletişim bölümlerini birleştirir
 * Single-page scroll navigation ile tüm bölümleri gösterir
 */
function LandingPage() {
  const location = useLocation();
  const scrollToSection = useSmoothScroll();

  const [aboutData, setAboutData] = useState(null);
  const [contactInfo, setContactInfo] = useState(null);
  const [socialMedia, setSocialMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tüm veriyi paralel olarak çek
  useEffect(() => {
    fetchAllData();
  }, []);

  // Hash-based deep linking desteği
  useEffect(() => {
    if (location.hash && !loading) {
      const sectionId = location.hash.replace('#', '');
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    }
  }, [location.hash, loading, scrollToSection]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Paralel data fetching
      const [aboutResponse, settingsResponse] = await Promise.all([
        getAbout(),
        getSettings()
      ]);

      setAboutData(aboutResponse.data);
      setContactInfo(settingsResponse.data.contactInfo);

      // Sadece aktif sosyal medya platformlarını filtrele
      const activePlatforms = settingsResponse.data.socialMedia?.filter(
        item => item.isActive && item.url
      ) || [];
      setSocialMedia(activePlatforms);

    } catch (err) {
      console.error('Veri yükleme hatası:', err);
      setError(err.response?.data?.message || 'Veriler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return (
    <div className="container mx-auto px-4 py-8">
      <ErrorMessage message={error} />
    </div>
  );

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#d8f3dc] via-white to-[#b7e4c7]">
      {/* Decorative gradient shapes - Global */}
      <div className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-gradient-to-r from-[#74c69d] to-[#40916c] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute top-60 right-20 w-48 h-48 sm:w-72 sm:h-72 bg-gradient-to-r from-[#95d5b2] to-[#74c69d] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-40 left-20 w-48 h-48 sm:w-72 sm:h-72 bg-gradient-to-r from-[#b7e4c7] to-[#95d5b2] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

      {/* Background Logo - Fixed */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <img
          src="/logotcy.png"
          alt="Background Logo"
          className="w-[400px] h-[400px] sm:w-[800px] sm:h-[800px] object-contain opacity-5 select-none"
        />
      </div>

      {/* Sections Container */}
      <div className="relative z-10">
        {/* Hero Section - Full screen */}
        <HeroSection
          aboutData={aboutData}
          loading={false}
        />

        {/* About Section */}
        <AboutSection
          aboutData={aboutData}
          contactInfo={contactInfo}
        />

        {/* Contact Section */}
        <ContactSection
          contactInfo={contactInfo}
          socialMedia={socialMedia}
        />
      </div>
    </div>
  );
}

export default LandingPage;
