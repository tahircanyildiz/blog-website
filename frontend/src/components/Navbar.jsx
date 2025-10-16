import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';

/**
 * Navbar bileşeni - Tüm sayfalarda görünür
 * Responsive tasarım: Mobilde hamburger menü
 */
function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Menü öğelerini toggle et
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Menü linkine tıklandığında menüyü kapat (mobil)
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Site Adı */}
          <Link
            to="/"
            className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
          >
            Blog
          </Link>

          {/* Desktop Menü */}
          <div className="hidden md:flex space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-gray-700 hover:text-primary-600 transition-colors font-medium ${
                  isActive ? 'text-primary-600 border-b-2 border-primary-600' : ''
                }`
              }
            >
              Anasayfa
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-gray-700 hover:text-primary-600 transition-colors font-medium ${
                  isActive ? 'text-primary-600 border-b-2 border-primary-600' : ''
                }`
              }
            >
              Hakkımda
            </NavLink>
            <NavLink
              to="/blog"
              className={({ isActive }) =>
                `text-gray-700 hover:text-primary-600 transition-colors font-medium ${
                  isActive ? 'text-primary-600 border-b-2 border-primary-600' : ''
                }`
              }
            >
              Blog
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `text-gray-700 hover:text-primary-600 transition-colors font-medium ${
                  isActive ? 'text-primary-600 border-b-2 border-primary-600' : ''
                }`
              }
            >
              İletişim
            </NavLink>
          </div>

          {/* Mobil Menü Butonu */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 transition-colors"
            aria-label="Menü"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
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
              <NavLink
                to="/"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors ${
                    isActive ? 'bg-primary-50 text-primary-600 font-medium' : ''
                  }`
                }
              >
                Anasayfa
              </NavLink>
              <NavLink
                to="/about"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors ${
                    isActive ? 'bg-primary-50 text-primary-600 font-medium' : ''
                  }`
                }
              >
                Hakkımda
              </NavLink>
              <NavLink
                to="/blog"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors ${
                    isActive ? 'bg-primary-50 text-primary-600 font-medium' : ''
                  }`
                }
              >
                Blog
              </NavLink>
              <NavLink
                to="/contact"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors ${
                    isActive ? 'bg-primary-50 text-primary-600 font-medium' : ''
                  }`
                }
              >
                İletişim
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
