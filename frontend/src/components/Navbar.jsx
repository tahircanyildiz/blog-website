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
    <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Site Adı */}
          <Link
            to="/"
            className="flex items-center space-x-3 group"
          >
            {/* Kendi logonuz - public/logo.png dosyasını kullanacak */}
            <img
              src="/logo.png"
              alt="Logo"
              className="h-10 w-10 object-contain group-hover:scale-110 transition-transform duration-300"
            />
            {/* <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Portfolio
            </span> */}
          </Link>

          {/* Desktop Menü */}
          <div className="hidden md:flex space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-gray-700 hover:text-blue-600 transition-colors font-semibold ${
                  isActive ? 'text-blue-600 border-b-2 border-blue-600' : ''
                }`
              }
            >
              Anasayfa
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-gray-700 hover:text-blue-600 transition-colors font-semibold ${
                  isActive ? 'text-blue-600 border-b-2 border-blue-600' : ''
                }`
              }
            >
              Hakkımda
            </NavLink>
            <NavLink
              to="/blog"
              className={({ isActive }) =>
                `text-gray-700 hover:text-blue-600 transition-colors font-semibold ${
                  isActive ? 'text-blue-600 border-b-2 border-blue-600' : ''
                }`
              }
            >
              Blog
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `text-gray-700 hover:text-blue-600 transition-colors font-semibold ${
                  isActive ? 'text-blue-600 border-b-2 border-blue-600' : ''
                }`
              }
            >
              İletişim
            </NavLink>
          </div>

          {/* Mobil Menü Butonu */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all"
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
              <NavLink
                to="/"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all font-semibold ${
                    isActive ? 'bg-gradient-to-r from-blue-50 to-violet-50 text-blue-600 shadow-sm' : ''
                  }`
                }
              >
                Anasayfa
              </NavLink>
              <NavLink
                to="/about"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all font-semibold ${
                    isActive ? 'bg-gradient-to-r from-blue-50 to-violet-50 text-blue-600 shadow-sm' : ''
                  }`
                }
              >
                Hakkımda
              </NavLink>
              <NavLink
                to="/blog"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all font-semibold ${
                    isActive ? 'bg-gradient-to-r from-blue-50 to-violet-50 text-blue-600 shadow-sm' : ''
                  }`
                }
              >
                Blog
              </NavLink>
              <NavLink
                to="/contact"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all font-semibold ${
                    isActive ? 'bg-gradient-to-r from-blue-50 to-violet-50 text-blue-600 shadow-sm' : ''
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
