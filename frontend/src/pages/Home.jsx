import { Link } from 'react-router-dom';

/**
 * Anasayfa - Karşılama sayfası
 * Kısa tanıtım ve sayfalara yönlendirme butonları
 */
function Home() {
  return (
    <div className="min-h-[calc(100vh-180px)] flex items-center justify-center bg-gradient-to-br from-primary-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        {/* Ana Başlık */}
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Merhaba, Ben{' '}
          <span className="text-primary-600">Adınız</span>
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

        {/* Dekoratif Öğeler */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {/* Özellik 1 */}
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-primary-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Deneyimlerim</h3>
            <p className="text-gray-600">
              Profesyonel deneyimlerim ve projeler hakkında bilgi edinin.
            </p>
          </div>

          {/* Özellik 2 */}
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-primary-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Blog Yazıları</h3>
            <p className="text-gray-600">
              Teknoloji ve yazılım dünyası hakkında paylaşımlarım.
            </p>
          </div>

          {/* Özellik 3 */}
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-primary-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">İletişim</h3>
            <p className="text-gray-600">
              Benimle iletişime geçmek için mesaj gönderebilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
