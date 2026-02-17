import { Code2, BookOpen, Mail } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';

/**
 * Hero Section - Anasayfa karşılama bölümü
 * @param {Object} props
 * @param {Object} props.aboutData - { name, title, description }
 * @param {boolean} props.loading - Yüklenme durumu
 */
function HeroSection({ aboutData, loading }) {
  const scrollToSection = useSmoothScroll();

  // Scroll animations
  const iconAnimation = useScrollAnimation({ threshold: 0.2 });
  const headingAnimation = useScrollAnimation({ threshold: 0.2 });
  const descAnimation = useScrollAnimation({ threshold: 0.2 });
  const buttonsAnimation = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      id="home"
      className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-[#d8f3dc] via-white to-[#b7e4c7]"
    >
      {/* Decorative gradient shapes */}
      <div className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-gradient-to-r from-[#74c69d] to-[#40916c] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-20 w-48 h-48 sm:w-72 sm:h-72 bg-gradient-to-r from-[#95d5b2] to-[#74c69d] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/3 w-48 h-48 sm:w-72 sm:h-72 bg-gradient-to-r from-[#b7e4c7] to-[#95d5b2] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-16 text-center">
        {/* Avatar/Icon */}
        <div
          ref={iconAnimation.ref}
          className={`mb-6 sm:mb-8 flex justify-center ${
            iconAnimation.isVisible ? 'animate-scaleIn' : 'opacity-0'
          }`}
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#40916c] to-[#2d6a4f] flex items-center justify-center shadow-lg ring-4 ring-white">
            <Code2 className="w-10 h-10 sm:w-12 sm:h-12 text-white" strokeWidth={2.5} />
          </div>
        </div>

        {/* Heading */}
        <div
          ref={headingAnimation.ref}
          className={`space-y-3 sm:space-y-4 mb-8 sm:mb-12 ${
            headingAnimation.isVisible ? 'animate-fadeInUp stagger-1' : 'opacity-0'
          }`}
        >
          {loading ? (
            <>
              {/* Skeleton loader for name */}
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 sm:h-10 md:h-12 lg:h-14 w-48 sm:w-64 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-12 sm:h-14 md:h-16 lg:h-20 w-64 sm:w-80 md:w-96 bg-gray-300 rounded-lg animate-pulse"></div>
              </div>
              {/* Skeleton loader for title */}
              <div className="flex justify-center">
                <div className="h-6 sm:h-7 md:h-8 w-48 sm:w-64 bg-gray-200 rounded-lg animate-pulse mt-4"></div>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight bg-gradient-to-r from-[#081c15] via-[#1b4332] to-[#2d6a4f] bg-clip-text text-transparent break-words px-2">
                Merhaba, Ben <br />
                {aboutData?.name}
              </h1>
              <p
                ref={descAnimation.ref}
                className={`text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-2xl mx-auto px-4 leading-relaxed ${
                  descAnimation.isVisible ? 'animate-fadeInUp stagger-2' : 'opacity-0'
                }`}
              >
                {aboutData?.title} <br />
                <br />
                Kişisel web siteme hoş geldiniz. Burada yazılım geliştirme, teknoloji ve deneyimlerim hakkında yazılar paylaşıyorum.
              </p>
            </>
          )}
        </div>

        {/* Navigation buttons */}
        <div
          ref={buttonsAnimation.ref}
          className={`flex flex-col sm:flex-row gap-4 justify-center items-center ${
            buttonsAnimation.isVisible ? 'animate-fadeInUp stagger-3' : 'opacity-0'
          }`}
        >
          <button
            onClick={() => scrollToSection('about')}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-[#40916c] hover:bg-[#2d6a4f] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl group"
          >
            <Code2 className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
            Hakkımda
          </button>

          <button
            onClick={() => scrollToSection('contact')}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-[#95d5b2] hover:border-[#74c69d] hover:bg-[#d8f3dc] text-[#2d6a4f] hover:text-[#1b4332] font-semibold shadow-md hover:shadow-lg transition-all duration-300 rounded-xl group"
          >
            <Mail className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
            İletişim
          </button>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
