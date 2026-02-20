import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Eye, Tag, Clock, Share2, Check, ChevronUp } from 'lucide-react';
import { getBlogById } from '../services/api';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import 'react-quill/dist/quill.snow.css';

/**
 * Blog Detay Sayfası
 */
function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll animations
  const heroAnimation = useScrollAnimation({ threshold: 0.1 });
  const contentAnimation = useScrollAnimation({ threshold: 0.1 });
  const sidebarAnimation = useScrollAnimation({ threshold: 0.1 });

  useEffect(() => {
    fetchBlogDetail();
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);
      setShowScrollTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getReadingTime = (content) => {
    if (!content) return 1;
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="container mx-auto px-4 py-8"><ErrorMessage message={error} /></div>;
  if (!blog) return <div className="container mx-auto px-4 py-8"><ErrorMessage message="Blog bulunamadı" /></div>;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#d8f3dc] via-white to-[#b7e4c7]">
      {/* Okuma ilerleme çubuğu */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200/50">
        <div
          className="h-full bg-gradient-to-r from-[#40916c] to-[#2d6a4f] transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Dekoratif gradient şekiller */}
      <div className="absolute top-20 right-10 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-gradient-to-r from-[#95d5b2] to-[#74c69d] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute bottom-20 left-10 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-gradient-to-r from-[#74c69d] to-[#40916c] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      {/* Full-width Hero Header */}
      <div
        ref={heroAnimation.ref}
        className={`relative bg-gradient-to-r from-[#40916c] via-[#2d6a4f] to-[#1b4332] text-white overflow-hidden ${
          heroAnimation.isVisible ? 'animate-fadeInDown' : 'opacity-0'
        }`}
      >
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 sm:pt-12 sm:pb-14 md:pt-16 md:pb-20">
          {/* Geri dön */}
          <button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center text-sm text-[#d8f3dc] hover:text-white mb-6 sm:mb-8 font-medium transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5 transform group-hover:-translate-x-1 transition-transform" />
            Tüm Yazılar
          </button>

          {/* Başlık */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight break-words max-w-4xl">
            {blog.title}
          </h1>

          {/* Kısa açıklama */}
          <p className="mt-4 sm:mt-5 text-[#d8f3dc] text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl break-words">
            {blog.metaDescription || blog.shortDescription}
          </p>

          {/* Meta bilgiler satırı */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-5">
            <span className="flex items-center gap-1.5 text-sm text-[#d8f3dc] font-medium">
              <Calendar className="w-4 h-4" />
              {formatDate(blog.publishDate)}
            </span>
            <span className="w-1 h-1 rounded-full bg-[#b7e4c7]/50 hidden sm:block"></span>
            <span className="flex items-center gap-1.5 text-sm text-[#d8f3dc] font-medium">
              <Clock className="w-4 h-4" />
              {getReadingTime(blog.content)} dk okuma
            </span>
            <span className="w-1 h-1 rounded-full bg-[#b7e4c7]/50 hidden sm:block"></span>
            <span className="flex items-center gap-1.5 text-sm text-[#d8f3dc] font-medium">
              <Eye className="w-4 h-4" />
              {blog.viewCount} görüntülenme
            </span>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {blog.coverImage && (
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12">
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={blog.coverImage}
              alt={blog.coverImageAlt || blog.title}
              className="w-full h-auto object-cover select-none pointer-events-none"
              loading="eager"
            />
          </div>
        </div>
      )}

      {/* İçerik Alanı - Sidebar ile */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-8 xl:gap-12">

          {/* Ana İçerik */}
          <article className="min-w-0">
            <div
              ref={contentAnimation.ref}
              className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8 md:p-10 ${
                contentAnimation.isVisible ? 'animate-fadeInUp' : 'opacity-0'
              }`}
            >
              {/* Ana İçerik - HTML Content */}
              <div
                className="ql-editor prose prose-sm sm:prose-base md:prose-lg max-w-none
                  prose-headings:text-gray-900 prose-headings:font-bold prose-headings:break-words
                  prose-h1:text-xl sm:prose-h1:text-2xl md:prose-h1:text-3xl prose-h1:mt-10 prose-h1:mb-4
                  prose-h2:text-lg sm:prose-h2:text-xl md:prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-3
                  prose-h3:text-base sm:prose-h3:text-lg md:prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-2
                  prose-p:text-gray-700 prose-p:leading-[1.8] prose-p:mb-5 prose-p:break-words
                  prose-a:text-[#40916c] prose-a:no-underline prose-a:font-medium hover:prose-a:underline hover:prose-a:text-[#2d6a4f] prose-a:break-words
                  prose-strong:text-gray-900 prose-strong:font-semibold
                  prose-ul:list-disc prose-ol:list-decimal prose-ul:pl-4 sm:prose-ul:pl-6 prose-ol:pl-4 sm:prose-ol:pl-6
                  prose-li:text-gray-700 prose-li:mb-2 prose-li:leading-relaxed prose-li:break-words
                  prose-blockquote:border-l-4 prose-blockquote:border-[#40916c] prose-blockquote:bg-[#d8f3dc]/50 prose-blockquote:text-gray-700 prose-blockquote:pl-4 sm:prose-blockquote:pl-5 prose-blockquote:py-3 prose-blockquote:rounded-r-xl prose-blockquote:break-words prose-blockquote:italic prose-blockquote:not-italic
                  prose-img:rounded-2xl prose-img:shadow-xl prose-img:my-8 sm:prose-img:my-10 prose-img:w-full prose-img:h-auto prose-img:select-none prose-img:pointer-events-none
                  prose-code:text-sm prose-code:bg-[#d8f3dc] prose-code:text-[#1b4332] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:break-words prose-code:font-medium
                  prose-pre:overflow-x-auto prose-pre:text-sm prose-pre:bg-gray-900 prose-pre:rounded-xl prose-pre:shadow-lg prose-pre:border prose-pre:border-gray-800
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

            {/* Alt Navigasyon */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => navigate('/blog')}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#40916c] to-[#2d6a4f] text-white text-sm sm:text-base rounded-xl font-semibold
                         hover:from-[#2d6a4f] hover:to-[#1b4332] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                Diğer Yazıları Keşfet
              </button>
            </div>
          </article>

          {/* Sticky Sidebar */}
          <aside className="hidden lg:block">
            <div
              ref={sidebarAnimation.ref}
              className={`sticky top-8 space-y-5 ${
                sidebarAnimation.isVisible ? 'animate-fadeInRight' : 'opacity-0'
              }`}
            >
              {/* Paylaş kartı */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <button
                  onClick={handleShare}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    copied
                      ? 'bg-green-50 border border-green-200 text-green-600'
                      : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-[#d8f3dc] hover:border-[#95d5b2] hover:text-[#2d6a4f]'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                  {copied ? 'Link Kopyalandı!' : 'Yazıyı Paylaş'}
                </button>
              </div>

              {/* Bilgi kartı */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Yazı Bilgileri</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-[#d8f3dc] flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 text-[#40916c]" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Yayın Tarihi</p>
                      <p className="text-gray-700 font-medium">{formatDate(blog.publishDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-[#b7e4c7] flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-[#2d6a4f]" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Okuma Süresi</p>
                      <p className="text-gray-700 font-medium">{getReadingTime(blog.content)} dakika</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-[#95d5b2] flex items-center justify-center flex-shrink-0">
                      <Eye className="w-4 h-4 text-[#1b4332]" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Görüntülenme</p>
                      <p className="text-gray-700 font-medium">{blog.viewCount}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Etiketler kartı */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Etiketler</h3>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-[#d8f3dc] to-[#b7e4c7] text-[#1b4332] text-xs font-semibold rounded-lg border border-[#95d5b2] break-words"
                      >
                        <Tag className="w-3 h-3 flex-shrink-0" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Mobilde etiketler (sidebar gizli olduğunda) */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="lg:hidden mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Etiketler</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-[#d8f3dc] to-[#b7e4c7] text-[#1b4332] text-xs font-semibold rounded-lg border border-[#95d5b2] break-words"
                >
                  <Tag className="w-3 h-3 flex-shrink-0" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Scroll to top butonu */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 w-11 h-11 bg-white shadow-lg border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-[#40916c] hover:border-[#95d5b2] transition-all duration-200 hover:shadow-xl"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

export default BlogDetail;
