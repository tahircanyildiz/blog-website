import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Code2, BookOpen, Mail } from 'lucide-react';
import { getAbout } from '../services/api';

/**
 * Anasayfa - Karşılama sayfası
 * Modern tasarım ile kısa tanıtım ve sayfalara yönlendirme butonları
 */
function Home() {
  const [aboutData, setAboutData] = useState({
    name: 'Adınız',
    title: 'Developer'
  });

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await getAbout();
        setAboutData({
          name: response.data.name || 'Adınız',
          title: response.data.title || 'Developer'
        });
      } catch (error) {
        console.error('Failed to fetch about data:', error);
      }
    };

    fetchAboutData();
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-[calc(100vh-80px)] overflow-hidden bg-gradient-to-br from-blue-50 via-white to-violet-50">
      {/* Decorative gradient shapes */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400 to-violet-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-20 w-72 h-72 bg-gradient-to-r from-violet-400 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-gradient-to-r from-blue-300 to-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center">
        {/* Avatar/Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg ring-4 ring-white">
            <Code2 className="w-12 h-12 text-white" strokeWidth={2.5} />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-4 mb-12">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-blue-800 to-violet-900 bg-clip-text text-transparent">
            Merhaba, Ben <br></br>
            {aboutData.name}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-2xl mx-auto">
            {aboutData.title} <br></br><br></br>
            Kişisel web siteme hoş geldiniz. Burada yazılım geliştirme, teknoloji ve deneyimlerim hakkında yazılar paylaşıyorum.
          </p>
        </div>

        {/* Navigation buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/about"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl group"
          >
            <Code2 className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
            Hakkımda
          </Link>

          <Link
            to="/blog"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-violet-300 hover:border-violet-400 hover:bg-violet-50 text-violet-700 hover:text-violet-800 font-semibold shadow-md hover:shadow-lg transition-all duration-300 rounded-xl group"
          >
            <BookOpen className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
            Blog Yazıları
          </Link>

          <Link
            to="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-blue-300 hover:border-blue-400 hover:bg-blue-50 text-blue-700 hover:text-blue-800 font-semibold shadow-md hover:shadow-lg transition-all duration-300 rounded-xl group"
          >
            <Mail className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
            İletişim
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
