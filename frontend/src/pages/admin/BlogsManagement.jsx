import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllBlogs, deleteBlog } from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';
import { Plus, Pencil, Trash2 } from 'lucide-react';

function BlogsManagement() {
  const { theme } = useTheme();
  const isGlass = theme === 'glass';

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: '' });
  const [deleting, setDeleting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const fetchBlogs = async () => {
    try {
      const response = await getAllBlogs();
      setBlogs(response.data || []);
    } catch (err) {
      setError('Bloglar yüklenirken bir hata oluştu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteBlog(deleteModal.id);
      setBlogs(blogs.filter((blog) => blog._id !== deleteModal.id));
      setDeleteModal({ open: false, id: null, title: '' });
      showNotification('Blog yazısı başarıyla silindi', 'success');
    } catch (err) {
      setDeleteModal({ open: false, id: null, title: '' });
      showNotification('Blog silinirken bir hata oluştu', 'error');
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Bildirim */}
      {notification.show && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl text-white text-sm font-medium transition-all duration-300 ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Silme Onay Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !deleting && setDeleteModal({ open: false, id: null, title: '' })} />
          <div className={`relative rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 ${
            isGlass
              ? 'bg-white/10 backdrop-blur-xl border border-white/10'
              : 'bg-white dark:bg-gray-800'
          }`}>
            <div className={`mx-auto flex items-center justify-center h-14 w-14 rounded-full mb-5 ${
              isGlass ? 'bg-red-500/20' : 'bg-red-100 dark:bg-red-500/10'
            }`}>
              <Trash2 className={`h-7 w-7 ${
                isGlass ? 'text-red-300' : 'text-red-600 dark:text-red-400'
              }`} />
            </div>

            <h3 className={`text-xl font-bold text-center mb-2 ${
              isGlass ? 'text-white' : 'text-gray-900 dark:text-white'
            }`}>
              Blog Yazısını Sil
            </h3>
            <p className={`text-center mb-8 ${
              isGlass ? 'text-indigo-300' : 'text-gray-500 dark:text-gray-400'
            }`}>
              <span className={`font-semibold ${
                isGlass ? 'text-white' : 'text-gray-700 dark:text-gray-200'
              }`}>"{deleteModal.title}"</span> başlıklı blog yazısını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ open: false, id: null, title: '' })}
                disabled={deleting}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 ${
                  isGlass
                    ? 'bg-white/10 text-indigo-200 hover:bg-white/20'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Vazgeç
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Siliniyor...
                  </>
                ) : (
                  'Evet, Sil'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className={`text-3xl font-bold ${
          isGlass ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>Blog Yönetimi</h1>
        <Link
          to="/mrpurposeless/blogs/new"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Yeni Blog Ekle
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className={`px-4 py-3 rounded-xl mb-4 ${
          isGlass
            ? 'bg-red-500/10 border border-red-500/20 text-red-300'
            : 'bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400'
        }`}>
          {error}
        </div>
      )}

      {/* Blogs Table */}
      <div className={`rounded-2xl overflow-hidden ${
        isGlass
          ? 'bg-white/10 backdrop-blur-xl border border-white/10'
          : 'bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700'
      }`}>
        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className={`text-lg ${
              isGlass ? 'text-indigo-300' : 'text-gray-500 dark:text-gray-400'
            }`}>Henüz blog yazısı yok</p>
            <Link
              to="/mrpurposeless/blogs/new"
              className="mt-4 inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
            >
              İlk Blog Yazısını Oluştur
            </Link>
          </div>
        ) : (
          <table className={`min-w-full divide-y ${
            isGlass ? 'divide-white/10' : 'divide-gray-200 dark:divide-gray-700'
          }`}>
            <thead className={
              isGlass ? 'bg-white/5' : 'bg-gray-50 dark:bg-gray-700/50'
            }>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  isGlass ? 'text-indigo-300' : 'text-gray-500 dark:text-gray-400'
                }`}>Başlık</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  isGlass ? 'text-indigo-300' : 'text-gray-500 dark:text-gray-400'
                }`}>Tarih</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  isGlass ? 'text-indigo-300' : 'text-gray-500 dark:text-gray-400'
                }`}>Etiketler</th>
                <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                  isGlass ? 'text-indigo-300' : 'text-gray-500 dark:text-gray-400'
                }`}>İşlemler</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${
              isGlass ? 'divide-white/10' : 'divide-gray-200 dark:divide-gray-700'
            }`}>
              {blogs.map((blog) => (
                <tr key={blog._id} className={
                  isGlass ? 'hover:bg-white/5' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'
                }>
                  <td className="px-6 py-4">
                    <div className={`text-sm font-medium ${
                      isGlass ? 'text-white' : 'text-gray-900 dark:text-white'
                    }`}>
                      {blog.title}
                    </div>
                    <div className={`text-sm ${
                      isGlass ? 'text-indigo-300/70' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {blog.shortDescription?.substring(0, 60)}...
                    </div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                    isGlass ? 'text-indigo-300' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {blog.publishDate ? new Date(blog.publishDate).toLocaleDateString('tr-TR') : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {blog.tags?.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            isGlass
                              ? 'bg-indigo-500/20 text-indigo-300'
                              : 'bg-indigo-100 dark:bg-indigo-500/10 text-indigo-800 dark:text-indigo-400'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/mrpurposeless/blogs/edit/${blog._id}`}
                      className={`inline-flex items-center gap-1 mr-4 ${
                        isGlass
                          ? 'text-indigo-300 hover:text-white'
                          : 'text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300'
                      }`}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Düzenle
                    </Link>
                    <button
                      onClick={() => setDeleteModal({ open: true, id: blog._id, title: blog.title })}
                      className={`inline-flex items-center gap-1 ${
                        isGlass
                          ? 'text-red-300 hover:text-red-200'
                          : 'text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300'
                      }`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default BlogsManagement;
