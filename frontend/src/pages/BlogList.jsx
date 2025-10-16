import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Başlık */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog Yazıları</h1>
          <p className="text-lg text-gray-600">
            Teknoloji, yazılım ve deneyimlerim hakkında yazılar
          </p>
        </div>

        {/* Blog Listesi */}
        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="w-24 h-24 mx-auto text-gray-400 mb-4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-xl text-gray-600">Henüz blog yazısı bulunmuyor</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <Link
                key={blog._id}
                to={`/blog/${blog._id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300
                         transform hover:-translate-y-2 overflow-hidden group"
              >
                {/* Blog Kartı */}
                <div className="p-6">
                  {/* Başlık */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {blog.title}
                  </h2>

                  {/* Kısa Açıklama */}
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {blog.shortDescription}
                  </p>

                  {/* Etiketler */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary-50 text-primary-700 text-xs rounded-full font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Alt Bilgiler */}
                  <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(blog.publishDate)}
                    </div>

                    {/* Görüntülenme Sayısı */}
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {blog.viewCount || 0}
                    </div>
                  </div>
                </div>

                {/* Okuma Göstergesi */}
                <div className="h-1 bg-gradient-to-r from-primary-500 to-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogList;
