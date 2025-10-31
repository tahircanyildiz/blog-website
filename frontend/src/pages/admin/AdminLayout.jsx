import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Admin Panel Layout
 * Sidebar ve üst menü içeren ana layout
 */
function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/mrpurposeless/login');
  };

  const menuItems = [
    { path: '/mrpurposeless', label: 'Dashboard', icon: '📊' },
    { path: '/mrpurposeless/blogs', label: 'Blog Yönetimi', icon: '📝' },
    { path: '/mrpurposeless/contacts', label: 'Mesajlar', icon: '✉️' },
    { path: '/mrpurposeless/about', label: 'Hakkımda', icon: '👤' },
    { path: '/mrpurposeless/social-media', label: 'Sosyal Medya', icon: '📱' },
    { path: '/mrpurposeless/contact-info', label: 'İletişim Bilgileri', icon: '📞' },
  ];

  const isActive = (path) => {
    if (path === '/mrpurposeless') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-indigo-600">
                  Admin Panel
                </h1>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">
                {user?.username || user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-[calc(100vh-64px)]">
          <nav className="mt-5 px-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  group flex items-center px-3 py-3 text-base font-medium rounded-md mb-1
                  ${
                    isActive(item.path)
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <span className="mr-3 text-xl">{item.icon}</span>
                {item.label}
              </Link>
            ))}

            {/* Public Site Link */}
            <div className="border-t border-gray-200 mt-4 pt-4">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center px-3 py-3 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <span className="mr-3 text-xl">🌐</span>
                Siteyi Görüntüle
              </a>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
