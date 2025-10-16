import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllBlogs, getAllContacts } from '../../services/api';

/**
 * Admin Dashboard Ana Sayfa
 * İstatistikler ve hızlı erişim kartları
 */
function Dashboard() {
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
      icon: '📝',
      link: '/admin/blogs',
      color: 'bg-blue-500',
    },
    {
      title: 'İletişim Mesajları',
      value: stats.totalMessages,
      icon: '✉️',
      link: '/admin/contacts',
      color: 'bg-green-500',
    },
    {
      title: 'Hakkımda',
      value: '1',
      icon: '👤',
      link: '/admin/about',
      color: 'bg-purple-500',
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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Yönetim paneline hoş geldiniz</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${card.color} rounded-md p-3`}>
                  <span className="text-3xl">{card.icon}</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {card.title}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {card.value}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <span className="font-medium text-indigo-600 hover:text-indigo-500">
                  Görüntüle →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Hızlı İşlemler</h2>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/admin/blogs/new"
              className="flex items-center justify-center px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 transition-colors"
            >
              <span className="text-2xl mr-2">➕</span>
              <span className="font-medium text-gray-700">Yeni Blog Yazısı</span>
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 transition-colors"
            >
              <span className="text-2xl mr-2">🌐</span>
              <span className="font-medium text-gray-700">Siteyi Görüntüle</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
