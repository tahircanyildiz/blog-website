import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { getBlogById } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

/**
 * Blog Detay Sayfası
 * Tek bir blog yazısının tüm içeriğini gösterir
 */
function BlogDetail() {
  const { id } = useParams(); // URL'den blog ID'sini al
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sayfa yüklendiğinde blog detayını çek
  useEffect(() => {
    fetchBlogDetail();
  }, [id]);

  const fetchBlogDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getBlogById(id);
      setBlog(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Blog yazısı yüklenemedi');
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
  if (!blog) return <div className="container mx-auto px-4 py-8"><ErrorMessage message="Blog bulunamadı" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Geri Dön Butonu */}
        <button
          onClick={() => navigate('/blog')}
          className="flex items-center text-primary-600 hover:text-primary-700 mb-8 font-medium
                   transition-colors group"
        >
          <svg
            className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Tüm Yazılara Dön
        </button>

        {/* Blog İçeriği */}
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Başlık Bölümü */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-8">
            <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>

            {/* Meta Bilgiler */}
            <div className="flex flex-wrap items-center gap-4 text-primary-100">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
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

              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
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
                {blog.viewCount} görüntülenme
              </div>
            </div>

            {/* Etiketler */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* İçerik Bölümü */}
          <div className="p-8">
            {/* Kısa Açıklama */}
            <div className="text-xl text-gray-700 font-medium mb-8 pb-8 border-b border-gray-200">
              {blog.shortDescription}
            </div>

            {/* Ana İçerik - Markdown Desteği */}
            <div className="prose prose-lg max-w-none
                          prose-headings:text-gray-900 prose-headings:font-bold
                          prose-p:text-gray-700 prose-p:leading-relaxed
                          prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
                          prose-strong:text-gray-900 prose-strong:font-semibold
                          prose-code:text-primary-600 prose-code:bg-primary-50 prose-code:px-1 prose-code:rounded
                          prose-pre:bg-gray-900 prose-pre:text-gray-100
                          prose-ul:list-disc prose-ol:list-decimal
                          prose-li:text-gray-700
                          prose-blockquote:border-primary-600 prose-blockquote:bg-primary-50 prose-blockquote:text-gray-700">
              <ReactMarkdown>{blog.content}</ReactMarkdown>
            </div>
          </div>
        </article>

        {/* Alt Navigasyon */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate('/blog')}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold
                     hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
          >
            Diğer Yazıları Gör
          </button>
        </div>
      </div>
    </div>
  );
}

export default BlogDetail;
