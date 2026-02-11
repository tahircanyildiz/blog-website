import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllBlogs, getAllContacts } from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';
import { FileText, Mail, User, Plus, Globe, TrendingUp } from 'lucide-react';

function Dashboard() {
  const { theme } = useTheme();
  const isGlass = theme === 'glass';

  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalMessages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [blogsResponse, contactsResponse] = await Promise.all([
        getAllBlogs(),
        getAllContacts(),
      ]);

      setStats({
        totalBlogs: blogsResponse.data?.length || 0,
        totalMessages: contactsResponse.data?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: 'Blog Yazıları',
      value: stats.totalBlogs,
      icon: FileText,
      link: '/mrpurposeless/blogs',
      gradient: 'from-blue-500 to-blue-600',
      iconBg: isGlass ? 'bg-blue-500/20' : 'bg-blue-50 dark:bg-blue-500/10',
      iconColor: isGlass ? 'text-blue-300' : 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'İletişim Mesajları',
      value: stats.totalMessages,
      icon: Mail,
      link: '/mrpurposeless/contacts',
      gradient: 'from-emerald-500 to-emerald-600',
      iconBg: isGlass ? 'bg-emerald-500/20' : 'bg-emerald-50 dark:bg-emerald-500/10',
      iconColor: isGlass ? 'text-emerald-300' : 'text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'Hakkımda',
      value: '1',
      icon: User,
      link: '/mrpurposeless/about',
      gradient: 'from-violet-500 to-violet-600',
      iconBg: isGlass ? 'bg-violet-500/20' : 'bg-violet-50 dark:bg-violet-500/10',
      iconColor: isGlass ? 'text-violet-300' : 'text-violet-600 dark:text-violet-400',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-2 rounded-xl ${
            isGlass ? 'bg-indigo-500/20' : 'bg-indigo-50 dark:bg-indigo-500/10'
          }`}>
            <TrendingUp className={`w-6 h-6 ${
              isGlass ? 'text-indigo-300' : 'text-indigo-600 dark:text-indigo-400'
            }`} />
          </div>
          <h1 className={`text-3xl font-bold ${
            isGlass ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>Dashboard</h1>
        </div>
        <p className={`${
          isGlass ? 'text-indigo-300' : 'text-gray-600 dark:text-gray-400'
        }`}>Yönetim paneline hoş geldiniz</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Link
              key={index}
              to={card.link}
              className={`group overflow-hidden rounded-2xl transition-all duration-200 hover:scale-[1.02] ${
                isGlass
                  ? 'bg-white/10 backdrop-blur-xl border border-white/10 hover:bg-white/15'
                  : 'bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg'
              }`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${card.iconBg}`}>
                    <Icon className={`w-6 h-6 ${card.iconColor}`} />
                  </div>
                </div>
                <p className={`text-sm font-medium mb-1 ${
                  isGlass ? 'text-indigo-300' : 'text-gray-500 dark:text-gray-400'
                }`}>{card.title}</p>
                <p className={`text-3xl font-bold ${
                  isGlass ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>{card.value}</p>
              </div>
              <div className={`px-6 py-3 ${
                isGlass
                  ? 'bg-white/5 border-t border-white/10'
                  : 'bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700'
              }`}>
                <span className={`text-sm font-medium ${
                  isGlass
                    ? 'text-indigo-300 group-hover:text-white'
                    : 'text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-500'
                }`}>
                  Görüntüle →
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className={`text-xl font-bold mb-4 ${
          isGlass ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>Hızlı İşlemler</h2>
        <div className={`rounded-2xl p-6 ${
          isGlass
            ? 'bg-white/10 backdrop-blur-xl border border-white/10'
            : 'bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/mrpurposeless/blogs/new"
              className={`flex items-center justify-center px-6 py-4 border-2 border-dashed rounded-xl transition-all ${
                isGlass
                  ? 'border-white/20 hover:border-indigo-400/50 hover:bg-white/5'
                  : 'border-gray-300 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/5'
              }`}
            >
              <Plus className={`w-5 h-5 mr-2 ${
                isGlass ? 'text-indigo-300' : 'text-indigo-600 dark:text-indigo-400'
              }`} />
              <span className={`font-medium ${
                isGlass ? 'text-indigo-200' : 'text-gray-700 dark:text-gray-300'
              }`}>Yeni Blog Yazısı</span>
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center px-6 py-4 border-2 border-dashed rounded-xl transition-all ${
                isGlass
                  ? 'border-white/20 hover:border-indigo-400/50 hover:bg-white/5'
                  : 'border-gray-300 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/5'
              }`}
            >
              <Globe className={`w-5 h-5 mr-2 ${
                isGlass ? 'text-indigo-300' : 'text-indigo-600 dark:text-indigo-400'
              }`} />
              <span className={`font-medium ${
                isGlass ? 'text-indigo-200' : 'text-gray-700 dark:text-gray-300'
              }`}>Siteyi Görüntüle</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
