import { Link, NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { useSmoothScroll } from '../hooks/useSmoothScroll';

/**
 * Navbar bileşeni - Tüm sayfalarda görünür
 * Landing page'de scroll navigation, diğer sayfalarda router navigation
 */
function Navbar() {
  const location = useLocation();
  const scrollToSection = useSmoothScroll();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Landing page'de miyiz kontrol et
  const isLandingPage = location.pathname === '/';

  // Scroll spy - sadece landing page'de aktif
  const activeSection = useScrollSpy(isLandingPage ? ['home', 'about', 'blog', 'contact'] : []);

  // Section navigation items
  const sections = [
    { id: 'home', label: 'Ana Sayfa' },
    { id: 'about', label: 'Hakkımda' }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Scroll navigation handler
  const handleSectionClick = (e, sectionId) => {
    e.preventDefault();
    if (!isLandingPage) {
      // Eğer landing page'de değilsek, önce ana sayfaya git
      window.location.href = `/#${sectionId}`;
    } else {
      scrollToSection(sectionId);
      closeMenu();
    }
  };

  return (
    <nav className="bg-gradient-to-r from-[#40916c] to-[#2d6a4f] backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-[#1b4332]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img
              src="/logonew.png"
              alt="Logo"
              className="h-12 w-18 object-contain group-hover:scale-125 transition-transform duration-300"
            />
          </Link>

          {/* Desktop Menü */}
          <div className="hidden md:flex space-x-8">
            {/* Section Navigation (Ana Sayfa, Hakkımda) */}
            {sections.map(section => {
              const isActive = isLandingPage && activeSection === section.id;
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={(e) => handleSectionClick(e, section.id)}
                  className={`text-white/90 hover:text-white transition-colors font-semibold ${
                    isActive ? 'text-white border-b-2 border-white' : ''
                  }`}
                >
                  {section.label}
                </a>
              );
            })}

            {/* Blog - Router Navigation */}
            <NavLink
              to="/blog"
              className={({ isActive }) =>
                `text-white/90 hover:text-white transition-colors font-semibold ${
                  isActive ? 'text-white border-b-2 border-white' : ''
                }`
              }
            >
              Blog
            </NavLink>

            {/* İletişim - Scroll Navigation */}
            <a
              href="#contact"
              onClick={(e) => handleSectionClick(e, 'contact')}
              className={`text-white/90 hover:text-white transition-colors font-semibold ${
                isLandingPage && activeSection === 'contact' ? 'text-white border-b-2 border-white' : ''
              }`}
            >
              İletişim
            </a>
          </div>

          {/* Mobil Menü Butonu */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-xl text-white hover:text-white hover:bg-white/20 transition-all"
            aria-label="Menü"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
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
              {/* Section Navigation */}
              {sections.map(section => {
                const isActive = isLandingPage && activeSection === section.id;
                return (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={(e) => handleSectionClick(e, section.id)}
                    className={`px-4 py-2.5 rounded-xl text-white hover:bg-white/20 transition-all font-semibold ${
                      isActive ? 'bg-white/30 shadow-sm' : ''
                    }`}
                  >
                    {section.label}
                  </a>
                );
              })}

              {/* Blog - Router Navigation */}
              <NavLink
                to="/blog"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-xl text-white hover:bg-white/20 transition-all font-semibold ${
                    isActive ? 'bg-white/30 shadow-sm' : ''
                  }`
                }
              >
                Blog
              </NavLink>

              {/* İletişim - Scroll Navigation */}
              <a
                href="#contact"
                onClick={(e) => handleSectionClick(e, 'contact')}
                className={`px-4 py-2.5 rounded-xl text-white hover:bg-white/20 transition-all font-semibold ${
                  isLandingPage && activeSection === 'contact' ? 'bg-white/30 shadow-sm' : ''
                }`}
              >
                İletişim
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
