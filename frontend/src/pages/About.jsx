import { useState, useEffect } from 'react';
import { User, Briefcase, Code2, Download } from 'lucide-react';
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-violet-50 py-12">
      {/* Decorative gradient shapes */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-r from-violet-400 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      {/* Background Logo - Fixed Position */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 ">
        <img
          src="/logotcy.png"
          alt="Background Logo"
          className="w-[600px] h-[600px] object-contain opacity-5 select-none"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Başlık Bölümü */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-blue-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg">
              <User className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-violet-900 bg-clip-text text-transparent">
                {aboutData.name}
              </h1>
              <p className="text-xl text-blue-600 font-medium mt-1">
                {aboutData.title}
              </p>
            </div>
            {/* CV İndirme Butonu */}
            {aboutData.cvFile && (
              <a
                href={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/uploads/${aboutData.cvFile}`}
                download
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl group"
              >
                <Download className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                CV İndir
              </a>
            )}
          </div>
          <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
            {aboutData.description}
          </p>
        </div>

        {/* Deneyimler Bölümü */}
        {aboutData.experiences && aboutData.experiences.length > 0 && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-violet-900 bg-clip-text text-transparent mb-6 flex items-center">
              <Briefcase className="w-8 h-8 mr-3 text-blue-600" strokeWidth={2.5} />
              Deneyimler
            </h2>
            <div className="space-y-6">
              {aboutData.experiences.map((exp, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-l-4 border-blue-600 hover:shadow-2xl hover:border-violet-600 transition-all duration-300 group"
                >
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                      {exp.title}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <span className="text-lg font-semibold text-blue-600">
                        {exp.company}
                      </span>
                      <span className="text-sm text-gray-600 font-medium px-3 py-1 bg-gray-100 rounded-full">
                        {exp.period}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Teknolojiler Bölümü */}
        {aboutData.technologies && aboutData.technologies.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-violet-100">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-violet-900 bg-clip-text text-transparent mb-6 flex items-center">
              <Code2 className="w-7 h-7 mr-3 text-violet-600" strokeWidth={2.5} />
              Teknolojiler ve Yetenekler
            </h2>
            <div className="flex flex-wrap gap-3">
              {aboutData.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-100 to-violet-100 text-blue-800 rounded-full
                           font-semibold text-sm hover:from-blue-200 hover:to-violet-200 hover:scale-105
                           transition-all duration-300 shadow-md hover:shadow-lg cursor-default"
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
