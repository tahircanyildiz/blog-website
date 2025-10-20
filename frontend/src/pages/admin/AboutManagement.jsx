import { useEffect, useState } from 'react';
import { getAbout, updateAbout } from '../../services/api';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';

function AboutManagement() {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    experiences: [],
    technologies: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAbout();
      const data = response.data;

      setFormData({
        name: data.name || '',
        title: data.title || '',
        description: data.description || '',
        experiences: data.experiences || [],
        technologies: data.technologies?.join(', ') || '',
      });
    } catch (err) {
      setError('Hakkımda bilgileri yüklenirken bir hata oluştu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Experience ekleme
  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        { title: '', company: '', period: '', description: '' }
      ]
    }));
  };

  // Experience silme
  const removeExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index)
    }));
  };

  // Experience güncelleme
  const updateExperience = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const data = {
        name: formData.name,
        title: formData.title,
        description: formData.description,
        experiences: formData.experiences,
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(t => t),
      };

      await updateAbout(data);
      setSuccess(true);

      // 3 saniye sonra başarı mesajını kaldır
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Güncelleme sırasında bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Hakkımda Yönetimi</h1>

      {/* Başarı Mesajı */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          Hakkımda bilgileri başarıyla güncellendi!
        </div>
      )}

      {/* Hata Mesajı */}
      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Temel Bilgiler */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Temel Bilgiler</h2>

          {/* İsim */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              İsim <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Adınız Soyadınız"
            />
          </div>

          {/* Unvan */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Unvan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Full Stack Developer, Software Engineer, vb."
            />
          </div>

          {/* Açıklama */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Açıklama <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Kendiniz hakkında kısa bir açıklama yazın..."
            />
          </div>
        </div>

        {/* Deneyimler */}
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
                  {/* Silme Butonu */}
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                    title="Sil"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* Teknolojiler */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Teknolojiler ve Araçlar</h2>

          <div className="mb-4">
            <label htmlFor="technologies" className="block text-sm font-medium text-gray-700 mb-2">
              Teknolojiler (virgülle ayırın)
            </label>
            <input
              type="text"
              id="technologies"
              name="technologies"
              value={formData.technologies}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="React, Node.js, MongoDB, Docker, AWS"
            />
            <p className="mt-1 text-sm text-gray-500">
              Teknolojileri virgülle ayırarak yazın. Örn: React, Node.js, TypeScript
            </p>
          </div>
        </div>

        {/* Kaydet Butonu */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {saving ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Kaydediliyor...
              </span>
            ) : (
              'Kaydet'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AboutManagement;
