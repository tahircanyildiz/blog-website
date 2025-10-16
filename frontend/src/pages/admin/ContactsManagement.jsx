import { useEffect, useState } from 'react';
import { getAllContacts, deleteContact } from '../../services/api';

function ContactsManagement() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

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

  const handleDelete = async (id) => {
    if (!window.confirm('Bu mesajı silmek istediğinize emin misiniz?')) return;

    try {
      await deleteContact(id);
      setContacts(contacts.filter((c) => c._id !== id));
      alert('Mesaj başarıyla silindi');
    } catch (err) {
      alert('Mesaj silinirken bir hata oluştu');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">İletişim Mesajları</h1>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {contacts.length === 0 ? (
          <div className="text-center py-12"><p className="text-gray-500">Henüz mesaj yok</p></div>
        ) : (
          <div className="divide-y divide-gray-200">
            {contacts.map((contact) => (
              <div key={contact._id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{contact.name}</h3>
                      <span className="ml-3 text-sm text-gray-500">{contact.email}</span>
                    </div>
                    <p className="text-gray-700 mb-2">{contact.message}</p>
                    <p className="text-sm text-gray-500">{new Date(contact.createdAt).toLocaleString('tr-TR')}</p>
                  </div>
                  <button onClick={() => handleDelete(contact._id)} className="ml-4 text-red-600 hover:text-red-800">Sil</button>
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
