import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Eye, FileText } from 'lucide-react';
import { getAllBlogs } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

/**
 * Blog Listesi Sayfası
 * Tüm blog yazılarını listeler
 */
function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sayfa yüklendiğinde blog listesini çek
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllBlogs();
      setBlogs(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Blog yazıları yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  // Tarih formatlama
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) return <Loading />;
  if (error) return <div className="container mx-auto px-4 py-8"><ErrorMessage message={error} /></div>;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-violet-50 py-12">
      {/* Decorative gradient shapes */}
      <div className="absolute top-40 right-20 w-72 h-72 bg-gradient-to-r from-violet-400 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute bottom-40 left-20 w-72 h-72 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

      {/* Background Logo - Fixed Position */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <img
          src="/logo.png"
          alt="Background Logo"
          className="w-[800px] h-[800px] object-contain opacity-5 select-none"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Başlık */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg">
              <BookOpen className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="text-5xl md:text-12xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-violet-900 bg-clip-text text-transparent mb-4">
            Blog Yazıları

<br /><br />
          </h1>
          {/* <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Teknoloji, yazılım ve deneyimlerim hakkında yazılar
          </p> */}
        </div>

        {/* Blog Listesi */}
        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-violet-100 flex items-center justify-center">
              <FileText className="w-12 h-12 text-blue-500" strokeWidth={2} />
            </div>
            <p className="text-xl text-gray-600">Henüz blog yazısı bulunmuyor</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <Link
                key={blog._id}
                to={`/blog/${blog._id}`}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300
                         transform hover:-translate-y-2 overflow-hidden group border border-blue-100"
              >
                {/* Blog Kartı */}
                <div className="p-6">
                  {/* Başlık */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {blog.title}
                  </h2>

                  {/* Kısa Açıklama */}
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {blog.shortDescription}
                  </p>

                  {/* Etiketler */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gradient-to-r from-blue-100 to-violet-100 text-blue-700 text-xs rounded-full font-semibold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Alt Bilgiler */}
                  <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
                    <div className="flex items-center font-medium">
                      <Calendar className="w-4 h-4 mr-1.5" />
                      {formatDate(blog.publishDate)}
                    </div>

                    {/* Görüntülenme Sayısı */}
                    <div className="flex items-center font-medium">
                      <Eye className="w-4 h-4 mr-1.5" />
                      {blog.viewCount || 0}
                    </div>
                  </div>
                </div>

                {/* Okuma Göstergesi */}
                <div className="h-1 bg-gradient-to-r from-blue-500 to-violet-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogList;
