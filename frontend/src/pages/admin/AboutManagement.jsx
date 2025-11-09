import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { getAbout, updateAbout, uploadCV, deleteCV, uploadProfileImage, deleteProfileImage } from '../../services/api';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';

function AboutManagement() {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    experiences: [],
    technologies: '',
    skills: [],
    languages: [],
    references: [],
    cvFile: null,
    profileImage: null
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [cvUploading, setCvUploading] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const [profileImageUploading, setProfileImageUploading] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);

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
        skills: (data.skills || []).map(skill => ({
          category: skill.category,
          items: Array.isArray(skill.items) ? skill.items.join(', ') : skill.items
        })),
        languages: data.languages || [],
        references: data.references || [],
        cvFile: data.cvFile || null,
        profileImage: data.profileImage || null
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

  // Experience sıralama (drag & drop)
  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(formData.experiences);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFormData(prev => ({
      ...prev,
      experiences: items
    }));
  };

  // ========== SKILLS FUNCTIONS ==========
  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, { category: '', items: '' }]
    }));
  };

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const updateSkillCategory = (index, value) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) =>
        i === index ? { ...skill, category: value } : skill
      )
    }));
  };

  const updateSkillItems = (index, value) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) =>
        i === index ? { ...skill, items: value } : skill
      )
    }));
  };

  // ========== LANGUAGES FUNCTIONS ==========
  const addLanguage = () => {
    setFormData(prev => ({
      ...prev,
      languages: [...prev.languages, { language: '', level: '' }]
    }));
  };

  const removeLanguage = (index) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  const updateLanguage = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.map((lang, i) =>
        i === index ? { ...lang, [field]: value } : lang
      )
    }));
  };

  // ========== REFERENCES FUNCTIONS ==========
  const addReference = () => {
    setFormData(prev => ({
      ...prev,
      references: [...prev.references, { name: '', title: '', company: '', phone: '', email: '' }]
    }));
  };

  const removeReference = (index) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references.filter((_, i) => i !== index)
    }));
  };

  const updateReference = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references.map((ref, i) =>
        i === index ? { ...ref, [field]: value } : ref
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
        skills: formData.skills
          .filter(skill => skill.category && skill.category.trim()) // Sadece kategori dolu olanları al
          .map(skill => ({
            category: skill.category,
            items: typeof skill.items === 'string'
              ? skill.items.split(',').map(item => item.trim()).filter(item => item)
              : skill.items
          })),
        languages: formData.languages.filter(lang => lang.language && lang.language.trim()), // Sadece dil adı dolu olanları al
        references: formData.references.filter(ref => ref.name && ref.name.trim()), // Sadece isim dolu olanları al
      };

      console.log('Kaydedilecek data:', data); // DEBUG

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

  // CV dosyası seçimi
  const handleCVFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // PDF kontrolü
      if (file.type !== 'application/pdf') {
        setError('Sadece PDF dosyaları yüklenebilir');
        e.target.value = '';
        return;
      }
      // Boyut kontrolü (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Dosya boyutu 5MB\'dan küçük olmalıdır');
        e.target.value = '';
        return;
      }
      setCvFile(file);
    }
  };

  // CV yükleme
  const handleCVUpload = async () => {
    if (!cvFile) {
      setError('Lütfen bir CV dosyası seçin');
      return;
    }

    setCvUploading(true);
    setError(null);

    try {
      await uploadCV(cvFile);
      setSuccess(true);
      setCvFile(null);

      // CV input'u temizle
      const fileInput = document.getElementById('cv-file');
      if (fileInput) fileInput.value = '';

      // Güncel veriyi tekrar çek
      await fetchAbout();

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'CV yüklenirken bir hata oluştu');
    } finally {
      setCvUploading(false);
    }
  };

  // CV silme
  const handleCVDelete = async () => {
    if (!window.confirm('CV dosyasını silmek istediğinize emin misiniz?')) {
      return;
    }

    setCvUploading(true);
    setError(null);

    try {
      await deleteCV();
      setSuccess(true);

      // Güncel veriyi tekrar çek
      await fetchAbout();

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'CV silinirken bir hata oluştu');
    } finally {
      setCvUploading(false);
    }
  };

  // Profil resmi seçimi
  const handleProfileImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Dosya boyutu kontrolü (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Dosya boyutu 5MB\'dan büyük olamaz');
        return;
      }
      setProfileImageFile(file);
      setError(null);
    }
  };

  // Profil resmi yükleme
  const handleProfileImageUpload = async () => {
    if (!profileImageFile) {
      setError('Lütfen bir resim dosyası seçin');
      return;
    }

    setProfileImageUploading(true);
    setError(null);

    try {
      await uploadProfileImage(profileImageFile);
      setSuccess(true);

      // Input'u temizle
      setProfileImageFile(null);
      const fileInput = document.getElementById('profile-image-file');
      if (fileInput) fileInput.value = '';

      // Güncel veriyi tekrar çek
      await fetchAbout();

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Profil resmi yüklenirken bir hata oluştu');
    } finally {
      setProfileImageUploading(false);
    }
  };

  // Profil resmi silme
  const handleProfileImageDelete = async () => {
    if (!window.confirm('Profil resmini silmek istediğinize emin misiniz?')) {
      return;
    }

    setProfileImageUploading(true);
    setError(null);

    try {
      await deleteProfileImage();
      setSuccess(true);

      // Güncel veriyi tekrar çek
      await fetchAbout();

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Profil resmi silinirken bir hata oluştu');
    } finally {
      setProfileImageUploading(false);
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
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="experiences">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-6"
                  >
                    {formData.experiences.map((exp, index) => (
                      <Draggable key={`exp-${index}`} draggableId={`exp-${index}`} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`border border-gray-200 rounded-lg p-4 relative ${
                              snapshot.isDragging ? 'shadow-lg bg-gray-50' : ''
                            }`}
                          >
                            {/* Sürükleme Handle ve Silme Butonu */}
                            <div className="flex items-center justify-between mb-3">
                              <div
                                {...provided.dragHandleProps}
                                className="cursor-move text-gray-400 hover:text-gray-600 flex items-center"
                                title="Sürükleyerek sırayı değiştir"
                              >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                                </svg>
                                <span className="ml-2 text-sm font-medium text-gray-500">
                                  Deneyim #{index + 1}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeExperience(index)}
                                className="text-red-600 hover:text-red-800"
                                title="Sil"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>

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
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
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

        {/* Yetkinlikler (Skills) - Sadece PDF'de görünür */}
        <div className="bg-white shadow rounded-lg p-6 border-l-4 border-purple-500">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Yetkinlikler</h2>
              <p className="text-sm text-purple-600 mt-1">📄 Bu bilgiler sadece PDF CV'de görünecek</p>
            </div>
            <button
              type="button"
              onClick={addSkill}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
            >
              + Yetkinlik Kategorisi Ekle
            </button>
          </div>

          {formData.skills.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Henüz yetkinlik kategorisi eklenmemiş.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.skills.map((skill, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-500">Kategori #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="text-red-600 hover:text-red-800"
                      title="Sil"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Adı</label>
                      <input
                        type="text"
                        value={skill.category}
                        onChange={(e) => updateSkillCategory(index, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Frontend Geliştirme, Backend Geliştirme, vb."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Yetenekler (virgülle ayırın)</label>
                      <input
                        type="text"
                        value={skill.items}
                        onChange={(e) => updateSkillItems(index, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="React, Vue.js, Angular"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Diller (Languages) - Sadece PDF'de görünür */}
        <div className="bg-white shadow rounded-lg p-6 border-l-4 border-blue-500">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Yabancı Diller</h2>
              <p className="text-sm text-blue-600 mt-1">📄 Bu bilgiler sadece PDF CV'de görünecek</p>
            </div>
            <button
              type="button"
              onClick={addLanguage}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              + Dil Ekle
            </button>
          </div>

          {formData.languages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Henüz dil eklenmemiş.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {formData.languages.map((lang, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={lang.language}
                        onChange={(e) => updateLanguage(index, 'language', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="İngilizce"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={lang.level}
                        onChange={(e) => updateLanguage(index, 'level', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="İleri Seviye, Ana Dil, vb."
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLanguage(index)}
                      className="text-red-600 hover:text-red-800"
                      title="Sil"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Referanslar (References) - Sadece PDF'de görünür */}
        <div className="bg-white shadow rounded-lg p-6 border-l-4 border-green-500">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Referanslar</h2>
              <p className="text-sm text-green-600 mt-1">📄 Bu bilgiler sadece PDF CV'de görünecek</p>
            </div>
            <button
              type="button"
              onClick={addReference}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
            >
              + Referans Ekle
            </button>
          </div>

          {formData.references.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Henüz referans eklenmemiş.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.references.map((ref, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-500">Referans #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeReference(index)}
                      className="text-red-600 hover:text-red-800"
                      title="Sil"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">İsim Soyisim</label>
                      <input
                        type="text"
                        value={ref.name}
                        onChange={(e) => updateReference(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Ahmet Yılmaz"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ünvan</label>
                      <input
                        type="text"
                        value={ref.title}
                        onChange={(e) => updateReference(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Yazılım Müdürü"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Şirket (Opsiyonel)</label>
                      <input
                        type="text"
                        value={ref.company}
                        onChange={(e) => updateReference(index, 'company', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="ABC Teknoloji"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Telefon (Opsiyonel)</label>
                      <input
                        type="tel"
                        value={ref.phone}
                        onChange={(e) => updateReference(index, 'phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="+90 xxx xxx xx xx"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">E-posta (Opsiyonel)</label>
                      <input
                        type="email"
                        value={ref.email}
                        onChange={(e) => updateReference(index, 'email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="referans@example.com"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CV Yönetimi */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">CV Yönetimi</h2>

          {/* Mevcut CV */}
          {formData.cvFile && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-green-900">CV dosyanız yüklü</p>
                    <a
                      href={formData.cvFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-green-700 hover:text-green-800 underline"
                    >
                      CV'yi Görüntüle
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCVDelete}
                  disabled={cvUploading}
                  className="px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {cvUploading ? 'Siliniyor...' : 'Sil'}
                </button>
              </div>
            </div>
          )}

          {/* CV Yükleme */}
          <div className="space-y-3">
            <div>
              <label htmlFor="cv-file" className="block text-sm font-medium text-gray-700 mb-2">
                {formData.cvFile ? 'Yeni CV Yükle' : 'CV Dosyası Yükle'} (PDF)
              </label>
              <input
                type="file"
                id="cv-file"
                accept=".pdf"
                onChange={handleCVFileChange}
                disabled={cvUploading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
              />
              <p className="mt-1 text-sm text-gray-500">
                Sadece PDF formatında, maksimum 5MB boyutunda dosya yüklenebilir.
              </p>
            </div>

            {cvFile && (
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm text-blue-900">{cvFile.name}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCVUpload}
                  disabled={cvUploading}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {cvUploading ? 'Yükleniyor...' : 'Yükle'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profil Resmi Yönetimi */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Profil Resmi Yönetimi</h2>

          {/* Mevcut Profil Resmi */}
          {formData.profileImage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={formData.profileImage}
                    alt="Profil"
                    className="w-20 h-20 rounded-full object-cover border-2 border-green-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-green-900">Profil resminiz yüklü</p>
                    <a
                      href={formData.profileImage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-green-700 hover:text-green-800 underline"
                    >
                      Resmi Cloudinary'de görüntüle
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleProfileImageDelete}
                  disabled={profileImageUploading}
                  className="px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {profileImageUploading ? 'Siliniyor...' : 'Sil'}
                </button>
              </div>
            </div>
          )}

          {/* Profil Resmi Yükleme */}
          <div className="space-y-3">
            <div>
              <label htmlFor="profile-image-file" className="block text-sm font-medium text-gray-700 mb-2">
                {formData.profileImage ? 'Yeni Profil Resmi Yükle' : 'Profil Resmi Yükle'}
              </label>
              <input
                type="file"
                id="profile-image-file"
                accept="image/*"
                onChange={handleProfileImageFileChange}
                disabled={profileImageUploading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
              />
              <p className="mt-1 text-sm text-gray-500">
                JPG, PNG veya WebP formatında, maksimum 5MB boyutunda resim yüklenebilir.
              </p>
            </div>

            {profileImageFile && (
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-blue-900">{profileImageFile.name}</span>
                </div>
                <button
                  type="button"
                  onClick={handleProfileImageUpload}
                  disabled={profileImageUploading}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {profileImageUploading ? 'Yükleniyor...' : 'Yükle'}
                </button>
              </div>
            )}
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
