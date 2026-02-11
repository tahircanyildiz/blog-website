import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ThemeProvider, useTheme } from '../../contexts/ThemeContext';
import {
  LayoutDashboard, FileText, Mail, User, Share2, Phone,
  Globe, LogOut, Sun, Moon, Sparkles, ChevronLeft, Menu
} from 'lucide-react';
import { useState } from 'react';

const menuItems = [
  { path: '/mrpurposeless', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/mrpurposeless/blogs', label: 'Blog Yönetimi', icon: FileText },
  { path: '/mrpurposeless/contacts', label: 'Mesajlar', icon: Mail },
  { path: '/mrpurposeless/about', label: 'Hakkımda', icon: User },
  { path: '/mrpurposeless/social-media', label: 'Sosyal Medya', icon: Share2 },
  { path: '/mrpurposeless/contact-info', label: 'İletişim Bilgileri', icon: Phone },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const options = [
    { value: 'light', icon: Sun, label: 'Aydınlık' },
    { value: 'dark', icon: Moon, label: 'Karanlık' },
    { value: 'glass', icon: Sparkles, label: 'Cam' },
  ];

  return (
    <div className={`flex items-center rounded-xl p-1 gap-0.5 ${
      theme === 'glass'
        ? 'bg-white/10'
        : 'bg-gray-100 dark:bg-gray-700'
    }`}>
      {options.map((opt) => {
        const Icon = opt.icon;
        const isActive = theme === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => setTheme(opt.value)}
            title={opt.label}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isActive
                ? theme === 'glass'
                  ? 'bg-white/20 shadow-sm text-indigo-300'
                  : 'bg-white dark:bg-gray-600 shadow-sm text-indigo-600 dark:text-indigo-400'
                : theme === 'glass'
                  ? 'text-indigo-400/50 hover:text-indigo-300'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            <Icon className="w-4 h-4" />
          </button>
        );
      })}
    </div>
  );
}

function AdminLayoutInner() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isGlass = theme === 'glass';

  const handleLogout = () => {
    logout();
    navigate('/mrpurposeless/login');
  };

  const isActive = (path) => {
    if (path === '/mrpurposeless') return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isGlass
        ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900'
        : 'bg-gray-50 dark:bg-gray-900'
    }`}>
      {/* Glass dekoratif elementler */}
      {isGlass && (
        <>
          <div className="fixed top-1/4 -left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="fixed bottom-1/4 -right-20 w-72 h-72 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        </>
      )}

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } ${
        isGlass
          ? 'bg-white/10 backdrop-blur-xl border-r border-white/10'
          : 'bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700'
      }`}>
        {/* Sidebar Header */}
        <div className={`h-16 flex items-center justify-between px-6 border-b ${
          isGlass ? 'border-white/10' : 'border-gray-200 dark:border-gray-700'
        }`}>
          <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className={`lg:hidden ${
              isGlass ? 'text-indigo-400 hover:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="p-4 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? isGlass
                      ? 'bg-white/15 text-white shadow-sm'
                      : 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : isGlass
                      ? 'text-indigo-300 hover:bg-white/10 hover:text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${
                  active
                    ? isGlass ? 'text-indigo-300' : 'text-indigo-600 dark:text-indigo-400'
                    : ''
                }`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${
          isGlass ? 'border-white/10' : 'border-gray-200 dark:border-gray-700'
        }`}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              isGlass
                ? 'text-indigo-300 hover:bg-white/10 hover:text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Globe className="w-5 h-5" />
            Siteyi Görüntüle
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Bar */}
        <header className={`sticky top-0 z-30 h-16 backdrop-blur-xl border-b ${
          isGlass
            ? 'bg-white/5 border-white/10'
            : 'bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700'
        }`}>
          <div className="flex items-center justify-between h-full px-4 sm:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className={`lg:hidden p-2 rounded-lg ${
                isGlass
                  ? 'text-indigo-400 hover:text-white hover:bg-white/10'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden lg:block" />

            <div className="flex items-center gap-3 sm:gap-4">
              <ThemeToggle />

              <div className={`hidden sm:block h-6 w-px ${
                isGlass ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700'
              }`} />

              <span className={`hidden sm:block text-sm font-medium ${
                isGlass ? 'text-indigo-300' : 'text-gray-600 dark:text-gray-400'
              }`}>
                {user?.username || user?.email}
              </span>

              <button
                onClick={handleLogout}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  isGlass
                    ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                    : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20'
                }`}
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Çıkış</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function AdminLayout() {
  return (
    <ThemeProvider>
      <AdminLayoutInner />
    </ThemeProvider>
  );
}

export default AdminLayout;
