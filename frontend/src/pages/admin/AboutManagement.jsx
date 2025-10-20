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
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Hakkımda Yönetimi</h1>

      {/* ... diğer kısımlar aynı */}

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Deneyimler</h2>
          <button
            type="button"
            onClick={addExperience}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm"
          >
            + Deneyim Ekle
          </button>
        </div>

        {formData.experiences.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Henüz deneyim eklenmemiş.</p>
            <button
              type="button"
              onClick={addExperience}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              İlk Deneyimi Ekle
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {formData.experiences.map((exp, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
                {/* Sağ üst köşe butonlar */}
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveExperience(index, 'up')}
                    className={`text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed`}
                    title="Yukarı Taşı"
                  >
                    <ArrowUp className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === formData.experiences.length - 1}
                    onClick={() => moveExperience(index, 'down')}
                    className={`text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed`}
                    title="Aşağı Taşı"
                  >
                    <ArrowDown className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="text-red-600 hover:text-red-800"
                    title="Sil"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Form alanları (aynı kalıyor) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {/* Pozisyon */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pozisyon <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => updateExperience(index, 'title', e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Senior Developer"
                    />
                  </div>

                  {/* Şirket */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Şirket <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(index, 'company', e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="ABC Teknoloji"
                    />
                  </div>

                  {/* Dönem */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dönem <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={exp.period}
                      onChange={(e) => updateExperience(index, 'period', e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="2020 - 2023 veya 2020 - Halen"
                    />
                  </div>

                  {/* Açıklama */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Açıklama <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(index, 'description', e.target.value)}
                      required
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Bu pozisyonda yaptığınız işleri kısaca açıklayın..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ... teknolojiler ve kaydet butonu kısmı aynı */}
    </div>
  );
}

export default AboutManagement;
