import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Eye, FileText, ArrowRight } from 'lucide-react';
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) return <Loading />;
  if (error) return <div className="container mx-auto px-4 py-8"><ErrorMessage message={error} /></div>;

  const featuredBlog = blogs.length > 0 ? blogs[0] : null;
  const otherBlogs = blogs.length > 1 ? blogs.slice(1) : [];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-violet-50 py-6 sm:py-12">
      {/* Dekoratif gradient şekiller */}
      <div className="absolute top-40 right-20 w-48 h-48 sm:w-72 sm:h-72 bg-gradient-to-r from-violet-400 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute bottom-40 left-20 w-48 h-48 sm:w-72 sm:h-72 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

      {/* Background Logo */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <img
          src="/logotcy.png"
          alt="Background Logo"
          className="w-[400px] h-[400px] sm:w-[800px] sm:h-[800px] object-contain opacity-5 select-none"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Başlık */}
        <div className="mb-10 sm:mb-14 text-center">
          <div className="inline-flex items-center justify-center mb-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-800 to-violet-900 bg-clip-text text-transparent mb-3 break-words px-2">
            Blog Yazıları
          </h1>
          <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto">
            Yazılım geliştirme, teknoloji ve deneyimlerim hakkında yazılar
          </p>
        </div>

        {/* Blog Listesi */}
        {blogs.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-100 to-violet-100 flex items-center justify-center">
              <FileText className="w-12 h-12 text-blue-400" strokeWidth={1.5} />
            </div>
            <p className="text-lg sm:text-xl text-gray-500 mb-2">Henüz blog yazısı bulunmuyor</p>
            <p className="text-sm text-gray-400">Yakında yeni yazılar eklenecek</p>
          </div>
        ) : (
          <div className="space-y-8 sm:space-y-12">
            {/* Öne Çıkan (ilk) Blog */}
            {featuredBlog && (
              <Link
                to={`/blog/${featuredBlog.slug}`}
                className="block group"
              >
                <div className="bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200">
                  <div className="md:flex">
                    {/* Sol - gradient banner */}
                    <div className="md:w-2/5 bg-gradient-to-br from-blue-600 via-violet-600 to-purple-600 p-6 sm:p-8 md:p-10 flex flex-col justify-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                      <div className="relative z-10">
                        <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full mb-4 tracking-wider uppercase">
                          Son Yazı
                        </span>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight break-words">
                          {featuredBlog.title}
                        </h2>
                        <div className="flex items-center gap-4 mt-4 text-blue-100 text-sm">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(featuredBlog.publishDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {featuredBlog.viewCount || 0} görüntülenme
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Sağ - içerik */}
                    <div className="md:w-3/5 p-6 sm:p-8 md:p-10 flex flex-col justify-between">
                      <div>
                        <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-5 line-clamp-4 break-words">
                          {featuredBlog.shortDescription}
                        </p>

                        {featuredBlog.tags && featuredBlog.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-5">
                            {featuredBlog.tags.slice(0, 4).map((tag, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg break-words"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-end pt-4 border-t border-gray-100">
                        <span className="flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:text-violet-600 transition-colors">
                          Devamını Oku
                          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Diğer Bloglar */}
            {otherBlogs.length > 0 && (
              <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                {otherBlogs.map((blog) => (
                  <Link
                    key={blog._id}
                    to={`/blog/${blog.slug}`}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300
                             transform hover:-translate-y-1 overflow-hidden group border border-gray-100 hover:border-blue-200 flex flex-col"
                  >
                    {/* Üst gradient çizgi */}
                    <div className="h-1 bg-gradient-to-r from-blue-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="p-5 sm:p-6 flex flex-col flex-1">
                    

                      {/* Başlık */}
                      <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 break-words leading-snug">
                        {blog.title}
                      </h2>

                      {/* Kısa Açıklama */}
                      <p className="text-sm text-gray-500 mb-4 line-clamp-3 leading-relaxed break-words flex-1">
                        {blog.shortDescription}
                      </p>

                      {/* Alt Bilgiler */}
                      <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-50 mt-auto">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(blog.publishDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {blog.viewCount || 0}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogList;
