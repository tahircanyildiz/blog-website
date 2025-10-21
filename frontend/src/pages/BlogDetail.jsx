import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Eye, Tag } from 'lucide-react';
import { getBlogById } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"; // Kod blokları siyah arka planlı görünür

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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-violet-50 py-12">
      {/* Decorative gradient shapes */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-r from-violet-400 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Geri Dön Butonu */}
        <button
          onClick={() => navigate('/blog')}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 font-semibold
                   transition-all group bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-md hover:shadow-lg"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
          Tüm Yazılara Dön
        </button>

        {/* Blog İçeriği */}
        <article className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-blue-100">
          {/* Başlık Bölümü */}
          <div className="bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 text-white p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{blog.title}</h1>

            {/* Meta Bilgiler */}
            <div className="flex flex-wrap items-center gap-4 text-blue-100">
              <div className="flex items-center font-medium">
                <Calendar className="w-5 h-5 mr-2" />
                {formatDate(blog.publishDate)}
              </div>

              <div className="flex items-center font-medium">
                <Eye className="w-5 h-5 mr-2" />
                {blog.viewCount} görüntülenme
              </div>
            </div>

            {/* Etiketler */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold"
                  >
                    <Tag className="w-3.5 h-3.5 mr-1.5" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* İçerik Bölümü */}
          <div className="p-8 md:p-12">
            {/* Kısa Açıklama */}
            <div className="text-xl text-gray-700 font-medium mb-8 pb-8 border-b-2 border-gradient-to-r from-blue-200 to-violet-200 leading-relaxed">
              {blog.shortDescription}
            </div>

            {/* Ana İçerik - Markdown Desteği */}
            <div
  className="prose prose-lg max-w-none
    prose-headings:text-gray-900 prose-headings:font-bold
    prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
    prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
    prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline hover:prose-a:text-blue-700
    prose-strong:text-gray-900 prose-strong:font-semibold
    prose-code:text-blue-100 prose-code:bg-gray-900 prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-code:text-sm
    prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:p-4 prose-pre:shadow-xl
    prose-ul:list-disc prose-ol:list-decimal prose-ul:pl-6 prose-ol:pl-6
    prose-li:text-gray-700 prose-li:mb-2
    prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:bg-blue-50 prose-blockquote:text-gray-700 prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:rounded-r-lg
    prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8">

  <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeHighlight]}>
    {blog.content}
  </ReactMarkdown>
</div>
          </div>
        </article>

        {/* Alt Navigasyon */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate('/blog')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-semibold
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
