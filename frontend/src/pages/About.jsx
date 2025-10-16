import { useState, useEffect } from 'react';
import { getAbout } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

/**
 * Hakkımda Sayfası
 * API'den hakkımda bilgilerini çeker ve gösterir
 */
function About() {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sayfa yüklendiğinde hakkımda verisini çek
  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAbout();
      setAboutData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Hakkımda bilgisi yüklenemedi');
    } finally {
      setLoading(false);
    }
  };


  if (loading) return <Loading />;
  if (error) return <div className="container mx-auto px-4 py-8"><ErrorMessage message={error} /></div>;
  if (!aboutData) return <div className="container mx-auto px-4 py-8"><ErrorMessage message="Veri bulunamadı" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Başlık Bölümü */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {aboutData.name}
          </h1>
          <p className="text-xl text-primary-600 font-medium mb-4">
            {aboutData.title}
          </p>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {aboutData.description}
          </p>
        </div>

        {/* Deneyimler Bölümü */}
        {aboutData.experiences && aboutData.experiences.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg
                className="w-7 h-7 mr-3 text-primary-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Deneyimler
            </h2>
            <div className="space-y-4">
              {aboutData.experiences.map((exp, index) => (
                <div
                  key={index}
                  className="border-l-4 border-primary-600 pl-6 py-3"
                >
                  <p className="text-lg text-gray-800 leading-relaxed">
                    {exp}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Teknolojiler Bölümü */}
        {aboutData.technologies && aboutData.technologies.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg
                className="w-7 h-7 mr-3 text-primary-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Teknolojiler ve Yetenekler
            </h2>
            <div className="flex flex-wrap gap-3">
              {aboutData.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full
                           font-medium text-sm hover:bg-primary-200 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default About;
