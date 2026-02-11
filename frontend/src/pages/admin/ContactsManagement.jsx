import { useEffect, useState } from 'react';
import { getAllContacts, deleteContact } from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';
import { Trash2, Mail as MailIcon, Clock } from 'lucide-react';

function ContactsManagement() {
  const { theme } = useTheme();
  const isGlass = theme === 'glass';

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: '' });
  const [deleting, setDeleting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchContacts();
  }, []);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const fetchContacts = async () => {
    try {
      const response = await getAllContacts();
      setContacts(response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteContact(deleteModal.id);
      setContacts(contacts.filter((c) => c._id !== deleteModal.id));
      setDeleteModal({ open: false, id: null, name: '' });
      showNotification('Mesaj başarıyla silindi', 'success');
    } catch (err) {
      setDeleteModal({ open: false, id: null, name: '' });
      showNotification('Mesaj silinirken bir hata oluştu', 'error');
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !deleting && setDeleteModal({ open: false, id: null, name: '' })} />
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
            }`}>Mesajı Sil</h3>
            <p className={`text-center mb-8 ${
              isGlass ? 'text-indigo-300' : 'text-gray-500 dark:text-gray-400'
            }`}>
              <span className={`font-semibold ${
                isGlass ? 'text-white' : 'text-gray-700 dark:text-gray-200'
              }`}>{deleteModal.name}</span> adlı kişinin mesajını silmek istediğinize emin misiniz?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ open: false, id: null, name: '' })}
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

      <h1 className={`text-3xl font-bold mb-6 ${
        isGlass ? 'text-white' : 'text-gray-900 dark:text-white'
      }`}>İletişim Mesajları</h1>

      <div className={`rounded-2xl overflow-hidden ${
        isGlass
          ? 'bg-white/10 backdrop-blur-xl border border-white/10'
          : 'bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700'
      }`}>
        {contacts.length === 0 ? (
          <div className="text-center py-12">
            <p className={isGlass ? 'text-indigo-300' : 'text-gray-500 dark:text-gray-400'}>Henüz mesaj yok</p>
          </div>
        ) : (
          <div className={`divide-y ${
            isGlass ? 'divide-white/10' : 'divide-gray-200 dark:divide-gray-700'
          }`}>
            {contacts.map((contact) => (
              <div key={contact._id} className={`p-6 ${
                isGlass ? 'hover:bg-white/5' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'
              }`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2 gap-3">
                      <h3 className={`text-lg font-medium ${
                        isGlass ? 'text-white' : 'text-gray-900 dark:text-white'
                      }`}>{contact.name}</h3>
                      <span className={`flex items-center gap-1 text-sm ${
                        isGlass ? 'text-indigo-400' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        <MailIcon className="w-3.5 h-3.5" />
                        {contact.email}
                      </span>
                    </div>
                    <p className={`mb-2 ${
                      isGlass ? 'text-indigo-200' : 'text-gray-700 dark:text-gray-300'
                    }`}>{contact.message}</p>
                    <p className={`flex items-center gap-1 text-sm ${
                      isGlass ? 'text-indigo-400/70' : 'text-gray-500 dark:text-gray-500'
                    }`}>
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(contact.createdAt).toLocaleString('tr-TR')}
                    </p>
                  </div>
                  <button
                    onClick={() => setDeleteModal({ open: true, id: contact._id, name: contact.name })}
                    className={`ml-4 flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      isGlass
                        ? 'text-red-300 hover:bg-red-500/20'
                        : 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ContactsManagement;
