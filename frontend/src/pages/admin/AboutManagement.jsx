import { useEffect, useState } from 'react';
import { getAbout, updateAbout } from '../../services/api';

function AboutManagement() {
  const [formData, setFormData] = useState({ name: '', title: '', description: '', experiences: '', technologies: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const response = await getAbout();
      const data = response.data;
      setFormData({
        name: data.name || '',
        title: data.title || '',
        description: data.description || '',
        experiences: data.experiences?.join('\n') || '',
        technologies: data.technologies?.join(', ') || '',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = {
        ...formData,
        experiences: formData.experiences.split('\n').filter(e => e.trim()),
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(t => t),
      };
      await updateAbout(data);
      alert('Hakkımda bilgisi güncellendi');
    } catch (err) {
      alert('Güncelleme sırasında bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Hakkımda Yönetimi</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        <div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-2">İsim</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" /></div>
        <div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-2">Unvan</label><input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" /></div>
        <div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label><textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={5} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" /></div>
        <div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-2">Deneyimler (Her satıra bir tane)</label><textarea value={formData.experiences} onChange={(e) => setFormData({...formData, experiences: e.target.value})} rows={5} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" /></div>
        <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-2">Teknolojiler (virgülle ayırın)</label><input type="text" value={formData.technologies} onChange={(e) => setFormData({...formData, technologies: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" /></div>
        <button type="submit" disabled={saving} className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50">{saving ? 'Kaydediliyor...' : 'Kaydet'}</button>
      </form>
    </div>
  );
}

export default AboutManagement;
