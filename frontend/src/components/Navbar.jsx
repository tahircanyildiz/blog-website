import { Link, NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { useSmoothScroll } from '../hooks/useSmoothScroll';

/**
 * Navbar - Scroll pozisyonuna göre şeffaf/yeşil tema geçişi
 * Landing page üstündeyken arka plan şeffaf, scroll'da koyu yeşil
 */
function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const activeSection = useScrollSpy(['home', 'about', 'contact']);
  const { scrollToSection } = useSmoothScroll();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Sayfa yüklendiğinde mevcut scroll pozisyonunu kontrol et
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleSectionClick = (sectionId) => {
    closeMenu();
    scrollToSection(sectionId);
  };

  const isActive = (sectionId) => isLandingPage && activeSection === sectionId;

  // Landing page üstündeyken şeffaf, diğer durumlarda koyu yeşil
  const isTransparent = isLandingPage && !scrolled;

  // Dinamik class'lar
  const navBg = isTransparent
    ? 'bg-transparent'
    : 'bg-gradient-to-r from-[#40916c] to-[#2d6a4f] shadow-lg border-b border-[#1b4332]';

  const textBase = isTransparent
    ? 'text-[#1b4332]/80 hover:text-[#1b4332]'
    : 'text-white/90 hover:text-white';

  const activeDesktop = isTransparent
    ? 'text-[#1b4332] border-b-2 border-[#1b4332]'
    : 'text-white border-b-2 border-white';

  const activeMobile = isTransparent
    ? 'bg-[#2d6a4f]/10 text-[#1b4332]'
    : 'bg-white/20 text-white';

  const mobileTextBase = isTransparent
    ? 'text-[#1b4332]/80 hover:bg-[#2d6a4f]/10 hover:text-[#1b4332]'
    : 'text-white/90 hover:bg-white/10 hover:text-white';

  const mobileButtonColor = isTransparent
    ? 'text-[#1b4332] hover:bg-[#2d6a4f]/10'
    : 'text-white hover:bg-white/10';

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${isTransparent ? '' : 'backdrop-blur-md'} ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group" onClick={() => isLandingPage && scrollToSection('home')}>
            <img
              src="/logonew.png"
              alt="Logo"
              className="h-12 w-18 object-contain group-hover:scale-125 transition-transform duration-300"
            />
          </Link>

          {/* Desktop Menü */}
          <div className="hidden md:flex space-x-8">
            {/* Anasayfa */}
            {isLandingPage ? (
              <button
                onClick={() => handleSectionClick('home')}
                className={`transition-all font-semibold ${textBase} ${isActive('home') ? activeDesktop : ''}`}
              >
                Ana Sayfa
              </button>
            ) : (
              <Link to="/" className={`transition-all font-semibold ${textBase}`}>
                Ana Sayfa
              </Link>
            )}

            {/* Hakkımda */}
            {isLandingPage ? (
              <button
                onClick={() => handleSectionClick('about')}
                className={`transition-all font-semibold ${textBase} ${isActive('about') ? activeDesktop : ''}`}
              >
                Hakkımda
              </button>
            ) : (
              <Link to="/#about" className={`transition-all font-semibold ${textBase}`}>
                Hakkımda
              </Link>
            )}

            {/* Blog */}
            <NavLink
              to="/blog"
              className={({ isActive: blogActive }) =>
                `transition-all font-semibold ${textBase} ${
                  blogActive
                    ? isTransparent
                      ? 'text-[#1b4332] border-b-2 border-[#1b4332]'
                      : 'text-white border-b-2 border-white'
                    : ''
                }`
              }
            >
              Blog
            </NavLink>

            {/* İletişim */}
            {isLandingPage ? (
              <button
                onClick={() => handleSectionClick('contact')}
                className={`transition-all font-semibold ${textBase} ${isActive('contact') ? activeDesktop : ''}`}
              >
                İletişim
              </button>
            ) : (
              <Link to="/#contact" className={`transition-all font-semibold ${textBase}`}>
                İletişim
              </Link>
            )}
          </div>

          {/* Mobil Menü Butonu */}
          <button
            onClick={toggleMenu}
            className={`md:hidden p-2 rounded-xl transition-all ${mobileButtonColor}`}
            aria-label="Menü"
          >
            <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobil Menü */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              {isLandingPage ? (
                <button
                  onClick={() => handleSectionClick('home')}
                  className={`px-4 py-2.5 rounded-xl text-left transition-all font-semibold ${mobileTextBase} ${isActive('home') ? activeMobile : ''}`}
                >
                  Ana Sayfa
                </button>
              ) : (
                <Link to="/" onClick={closeMenu} className={`px-4 py-2.5 rounded-xl transition-all font-semibold ${mobileTextBase}`}>
                  Ana Sayfa
                </Link>
              )}

              {isLandingPage ? (
                <button
                  onClick={() => handleSectionClick('about')}
                  className={`px-4 py-2.5 rounded-xl text-left transition-all font-semibold ${mobileTextBase} ${isActive('about') ? activeMobile : ''}`}
                >
                  Hakkımda
                </button>
              ) : (
                <Link to="/#about" onClick={closeMenu} className={`px-4 py-2.5 rounded-xl transition-all font-semibold ${mobileTextBase}`}>
                  Hakkımda
                </Link>
              )}

              <NavLink
                to="/blog"
                onClick={closeMenu}
                className={({ isActive: blogActive }) =>
                  `px-4 py-2.5 rounded-xl transition-all font-semibold ${mobileTextBase} ${blogActive ? activeMobile : ''}`
                }
              >
                Blog
              </NavLink>

              {isLandingPage ? (
                <button
                  onClick={() => handleSectionClick('contact')}
                  className={`px-4 py-2.5 rounded-xl text-left transition-all font-semibold ${mobileTextBase} ${isActive('contact') ? activeMobile : ''}`}
                >
                  İletişim
                </button>
              ) : (
                <Link to="/#contact" onClick={closeMenu} className={`px-4 py-2.5 rounded-xl transition-all font-semibold ${mobileTextBase}`}>
                  İletişim
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
