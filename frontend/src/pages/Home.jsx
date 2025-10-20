import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAbout } from '../services/api';

/**
 * Anasayfa - Karşılama sayfası
 * Kısa tanıtım ve sayfalara yönlendirme butonları
 */
function Home() {
  const [name, setName] = useState('Adınız');

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await getAbout();
        setName(response.data.name);
      } catch (error) {
        console.error('Failed to fetch about data:', error);
      }
    };

    fetchAboutData();
  }, []);

  return (
    <div className="min-h-[calc(100vh-180px)] flex items-center justify-center bg-gradient-to-br from-primary-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        {/* Ana Başlık */}
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Merhaba, Ben{' '}
          <br />
          <span className="text-primary-600">{name}</span>
        </h1>

        {/* Alt Başlık */}
        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Kişisel web siteme hoş geldiniz. Burada yazılım geliştirme, teknoloji ve
          deneyimlerim hakkında yazılar paylaşıyorum.
        </p>

        {/* Navigasyon Butonları */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/about"
            className="w-full sm:w-auto px-8 py-4 bg-primary-600 text-white rounded-lg font-semibold
                     hover:bg-primary-700 transition-all duration-300 transform hover:scale-105
                     shadow-lg hover:shadow-xl"
          >
            Hakkımda
          </Link>

          <Link
            to="/blog"
            className="w-full sm:w-auto px-8 py-4 bg-white text-primary-600 border-2 border-primary-600
                     rounded-lg font-semibold hover:bg-primary-50 transition-all duration-300
                     transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Blog Yazıları
          </Link>

          <Link
            to="/contact"
            className="w-full sm:w-auto px-8 py-4 bg-gray-800 text-white rounded-lg font-semibold
                     hover:bg-gray-900 transition-all duration-300 transform hover:scale-105
                     shadow-lg hover:shadow-xl"
          >
            İletişim
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
