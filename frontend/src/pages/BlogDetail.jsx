import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Eye, Tag } from 'lucide-react';
import { getBlogById } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import 'react-quill/dist/quill.snow.css'; // Quill stillerini yükle

/**
 * Blog Detay Sayfası
 * Tek bir blog yazısının tüm içeriğini gösterir
 */
function BlogDetail() {
  const { slug } = useParams(); // URL'den blog slug'ını al
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sayfa yüklendiğinde blog detayını çek
  useEffect(() => {
    fetchBlogDetail();
  }, [slug]);

  const fetchBlogDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getBlogById(slug);
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-violet-50 py-6 sm:py-12">
      {/* Decorative gradient shapes */}
      <div className="absolute top-20 right-10 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-gradient-to-r from-violet-400 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute bottom-20 left-10 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Geri Dön Butonu */}
        <button
          onClick={() => navigate('/blog')}
          className="inline-flex items-center text-sm sm:text-base text-blue-600 hover:text-blue-700 mb-6 sm:mb-8 font-semibold
                   transition-all group bg-white/80 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-2 rounded-xl shadow-md hover:shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 transform group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline">Tüm Yazılara Dön</span>
          <span className="sm:hidden">Geri</span>
        </button>

        {/* Blog İçeriği */}
        <article className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-blue-100">
          {/* Başlık Bölümü */}
          <div className="bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 text-white p-6 sm:p-8 md:p-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight break-words">{blog.title}</h1>

            {/* Meta Bilgiler */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-blue-100">
              <div className="flex items-center font-medium">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 flex-shrink-0" />
                <span className="truncate">{formatDate(blog.publishDate)}</span>
              </div>

              <div className="flex items-center font-medium">
                <Eye className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 flex-shrink-0" />
                {blog.viewCount} görüntülenme
              </div>
            </div>

            {/* Etiketler */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 sm:mt-6">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 backdrop-blur-sm rounded-full text-xs sm:text-sm font-semibold break-words"
                  >
                    <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5 flex-shrink-0" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* İçerik Bölümü */}
          <div className="p-6 sm:p-8 md:p-12">
            {/* Kısa Açıklama */}
            <div className="text-base sm:text-lg md:text-xl text-gray-700 font-medium mb-6 sm:mb-8 pb-6 sm:pb-8 border-b-2 border-gradient-to-r from-blue-200 to-violet-200 leading-relaxed break-words">
              {blog.shortDescription}
            </div>

            {/* Ana İçerik - HTML Content (Quill Editor Output) */}
            <div
              className="ql-editor prose prose-sm sm:prose-base md:prose-lg max-w-none
                prose-headings:text-gray-900 prose-headings:font-bold prose-headings:break-words
                prose-h1:text-xl sm:prose-h1:text-2xl md:prose-h1:text-3xl
                prose-h2:text-lg sm:prose-h2:text-xl md:prose-h2:text-2xl
                prose-h3:text-base sm:prose-h3:text-lg md:prose-h3:text-xl
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 prose-p:break-words
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline hover:prose-a:text-blue-700 prose-a:break-words
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-ul:list-disc prose-ol:list-decimal prose-ul:pl-4 sm:prose-ul:pl-6 prose-ol:pl-4 sm:prose-ol:pl-6
                prose-li:text-gray-700 prose-li:mb-2 prose-li:break-words
                prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:bg-blue-50 prose-blockquote:text-gray-700 prose-blockquote:pl-3 sm:prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:rounded-r-lg prose-blockquote:break-words
                prose-img:rounded-xl prose-img:shadow-lg prose-img:my-6 sm:prose-img:my-8 prose-img:w-full prose-img:h-auto prose-img:select-none prose-img:pointer-events-none
                prose-code:text-sm prose-code:break-words
                prose-pre:overflow-x-auto prose-pre:text-sm
                [&_img]:select-none [&_img]:pointer-events-none [&_img]:draggable-[false]"
              dangerouslySetInnerHTML={{ __html: blog.content }}
              onContextMenu={(e) => {
                if (e.target.tagName === 'IMG') {
                  e.preventDefault();
                  return false;
                }
              }}
            />
          </div>
        </article>

        {/* Alt Navigasyon */}
        <div className="mt-6 sm:mt-8 flex justify-center">
          <button
            onClick={() => navigate('/blog')}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm sm:text-base rounded-xl font-semibold
                     hover:from-blue-700 hover:to-violet-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Diğer Yazıları Gör
          </button>
        </div>
      </div>
    </div>
  );
}

export default BlogDetail;
