import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { getAbout, updateAbout, uploadCV, deleteCV, uploadProfileImage, deleteProfileImage } from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';
import Loading from '../../components/Loading';
import { Trash2, X, GripHorizontal } from 'lucide-react';

function AboutManagement() {
  const { theme } = useTheme();
  const isGlass = theme === 'glass';

  // Ortak stil değişkenleri
  const cardClass = isGlass
    ? 'bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6'
    : 'bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-6';
  const headingClass = isGlass ? 'text-white' : 'text-gray-900 dark:text-white';
  const labelClass = isGlass ? 'text-indigo-200' : 'text-gray-700 dark:text-gray-300';
  const subTextClass = isGlass ? 'text-indigo-300' : 'text-gray-500 dark:text-gray-400';
  const inputClass = isGlass
    ? 'w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-500'
    : 'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500';
  const innerBorderClass = isGlass ? 'border-white/10' : 'border-gray-200 dark:border-gray-700';

  const [formData, setFormData] = useState({
    name: '', title: '', description: '', experiences: [],
    technologies: '', skills: [], languages: [], references: [],
    education: [], cvFile: null, profileImage: null
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [cvUploading, setCvUploading] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const [profileImageUploading, setProfileImageUploading] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, type: '', title: '' });
  const [modalDeleting, setModalDeleting] = useState(false);

  useEffect(() => { fetchAbout(); }, []);

  const fetchAbout = async () => {
    try {
      setLoading(true); setError(null);
      const response = await getAbout();
      const data = response.data;
      setFormData({
        name: data.name || '', title: data.title || '', description: data.description || '',
        experiences: data.experiences || [],
        technologies: data.technologies?.join(', ') || '',
        skills: (data.skills || []).map(skill => ({
          category: skill.category,
          items: Array.isArray(skill.items) ? skill.items.join(', ') : skill.items
        })),
        languages: data.languages || [], references: data.references || [],
        education: data.education || [], cvFile: data.cvFile || null,
        profileImage: data.profileImage || null
      });
    } catch (err) {
      setError('Hakkımda bilgileri yüklenirken bir hata oluştu');
    } finally { setLoading(false); }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addExperience = () => {
    setFormData(prev => ({ ...prev, experiences: [...prev.experiences, { title: '', company: '', period: '', description: '' }] }));
  };
  const removeExperience = (index) => {
    setFormData(prev => ({ ...prev, experiences: prev.experiences.filter((_, i) => i !== index) }));
  };
  const updateExperience = (index, field, value) => {
    setFormData(prev => ({ ...prev, experiences: prev.experiences.map((exp, i) => i === index ? { ...exp, [field]: value } : exp) }));
  };
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(formData.experiences);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setFormData(prev => ({ ...prev, experiences: items }));
  };

  const addSkill = () => { setFormData(prev => ({ ...prev, skills: [...prev.skills, { category: '', items: '' }] })); };
  const removeSkill = (index) => { setFormData(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) })); };
  const updateSkillCategory = (index, value) => { setFormData(prev => ({ ...prev, skills: prev.skills.map((s, i) => i === index ? { ...s, category: value } : s) })); };
  const updateSkillItems = (index, value) => { setFormData(prev => ({ ...prev, skills: prev.skills.map((s, i) => i === index ? { ...s, items: value } : s) })); };

  const addLanguage = () => { setFormData(prev => ({ ...prev, languages: [...prev.languages, { language: '', level: '' }] })); };
  const removeLanguage = (index) => { setFormData(prev => ({ ...prev, languages: prev.languages.filter((_, i) => i !== index) })); };
  const updateLanguage = (index, field, value) => { setFormData(prev => ({ ...prev, languages: prev.languages.map((l, i) => i === index ? { ...l, [field]: value } : l) })); };

  const addReference = () => { setFormData(prev => ({ ...prev, references: [...prev.references, { name: '', title: '', company: '', phone: '', email: '' }] })); };
  const removeReference = (index) => { setFormData(prev => ({ ...prev, references: prev.references.filter((_, i) => i !== index) })); };
  const updateReference = (index, field, value) => { setFormData(prev => ({ ...prev, references: prev.references.map((r, i) => i === index ? { ...r, [field]: value } : r) })); };

  const addEducation = () => { setFormData(prev => ({ ...prev, education: [...prev.education, { degree: '', school: '', department: '', year: '' }] })); };
  const removeEducation = (index) => { setFormData(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== index) })); };
  const updateEducation = (index, field, value) => { setFormData(prev => ({ ...prev, education: prev.education.map((e, i) => i === index ? { ...e, [field]: value } : e) })); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setError(null); setSuccess(false);
    try {
      const data = {
        name: formData.name, title: formData.title, description: formData.description,
        experiences: formData.experiences,
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(t => t),
        skills: formData.skills.filter(s => s.category?.trim()).map(s => ({
          category: s.category,
          items: typeof s.items === 'string' ? s.items.split(',').map(i => i.trim()).filter(i => i) : s.items
        })),
        languages: formData.languages.filter(l => l.language?.trim()),
        references: formData.references.filter(r => r.name?.trim()),
        education: formData.education.filter(e => e.degree?.trim() && e.school?.trim()),
      };
      await updateAbout(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Güncelleme sırasında bir hata oluştu');
    } finally { setSaving(false); }
  };

  const handleCVFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') { setError('Sadece PDF dosyaları yüklenebilir'); e.target.value = ''; return; }
      if (file.size > 5 * 1024 * 1024) { setError('Dosya boyutu 5MB\'dan küçük olmalıdır'); e.target.value = ''; return; }
      setCvFile(file);
    }
  };

  const handleCVUpload = async () => {
    if (!cvFile) { setError('Lütfen bir CV dosyası seçin'); return; }
    setCvUploading(true); setError(null);
    try {
      await uploadCV(cvFile); setSuccess(true); setCvFile(null);
      const fileInput = document.getElementById('cv-file');
      if (fileInput) fileInput.value = '';
      await fetchAbout();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) { setError(err.response?.data?.message || 'CV yüklenirken bir hata oluştu'); }
    finally { setCvUploading(false); }
  };

  const handleModalConfirm = async () => {
    setModalDeleting(true);
    try {
      if (deleteModal.type === 'cv') {
        setCvUploading(true); setError(null);
        await deleteCV(); setSuccess(true);
        await fetchAbout();
        setTimeout(() => setSuccess(false), 3000);
        setCvUploading(false);
      } else if (deleteModal.type === 'profileImage') {
        setProfileImageUploading(true); setError(null);
        await deleteProfileImage(); setSuccess(true);
        await fetchAbout();
        setTimeout(() => setSuccess(false), 3000);
        setProfileImageUploading(false);
      }
      setDeleteModal({ open: false, type: '', title: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Silme işlemi sırasında bir hata oluştu');
      setCvUploading(false); setProfileImageUploading(false);
      setDeleteModal({ open: false, type: '', title: '' });
    } finally { setModalDeleting(false); }
  };

  const handleProfileImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { setError('Dosya boyutu 5MB\'dan büyük olamaz'); return; }
      setProfileImageFile(file); setError(null);
    }
  };

  const handleProfileImageUpload = async () => {
    if (!profileImageFile) { setError('Lütfen bir resim dosyası seçin'); return; }
    setProfileImageUploading(true); setError(null);
    try {
      await uploadProfileImage(profileImageFile); setSuccess(true);
      setProfileImageFile(null);
      const fileInput = document.getElementById('profile-image-file');
      if (fileInput) fileInput.value = '';
      await fetchAbout();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) { setError(err.response?.data?.message || 'Profil resmi yüklenirken bir hata oluştu'); }
    finally { setProfileImageUploading(false); }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Silme Onay Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !modalDeleting && setDeleteModal({ open: false, type: '', title: '' })} />
          <div className={`relative rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 ${
            isGlass ? 'bg-white/10 backdrop-blur-xl border border-white/10' : 'bg-white dark:bg-gray-800'
          }`}>
            <div className={`mx-auto flex items-center justify-center h-14 w-14 rounded-full mb-5 ${
              isGlass ? 'bg-red-500/20' : 'bg-red-100 dark:bg-red-500/10'
            }`}>
              <Trash2 className={`h-7 w-7 ${isGlass ? 'text-red-300' : 'text-red-600 dark:text-red-400'}`} />
            </div>
            <h3 className={`text-xl font-bold text-center mb-2 ${headingClass}`}>{deleteModal.title}</h3>
            <p className={`text-center mb-8 ${subTextClass}`}>Bu işlem geri alınamaz. Devam etmek istiyor musunuz?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal({ open: false, type: '', title: '' })} disabled={modalDeleting}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 ${
                  isGlass ? 'bg-white/10 text-indigo-200 hover:bg-white/20' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}>Vazgeç</button>
              <button onClick={handleModalConfirm} disabled={modalDeleting}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {modalDeleting ? (<><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>Siliniyor...</>) : 'Evet, Sil'}
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className={`text-3xl font-bold mb-6 ${headingClass}`}>Hakkımda Yönetimi</h1>

      {success && (
        <div className={`mb-6 px-4 py-3 rounded-xl ${
          isGlass ? 'bg-green-500/10 border border-green-500/20 text-green-300' : 'bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400'
        }`}>Hakkımda bilgileri başarıyla güncellendi!</div>
      )}

      {error && (
        <div className={`mb-6 px-4 py-3 rounded-xl ${
          isGlass ? 'bg-red-500/10 border border-red-500/20 text-red-300' : 'bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400'
        }`}>{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Temel Bilgiler */}
        <div className={cardClass}>
          <h2 className={`text-xl font-bold mb-4 ${headingClass}`}>Temel Bilgiler</h2>
          <div className="mb-4">
            <label htmlFor="name" className={`block text-sm font-medium mb-2 ${labelClass}`}>İsim <span className="text-red-500">*</span></label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required className={inputClass} placeholder="Adınız Soyadınız" />
          </div>
          <div className="mb-4">
            <label htmlFor="title" className={`block text-sm font-medium mb-2 ${labelClass}`}>Unvan <span className="text-red-500">*</span></label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} required className={inputClass} placeholder="Full Stack Developer, Software Engineer, vb." />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className={`block text-sm font-medium mb-2 ${labelClass}`}>Açıklama <span className="text-red-500">*</span></label>
            <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} required rows={5} className={inputClass} placeholder="Kendiniz hakkında kısa bir açıklama yazın..." />
          </div>
        </div>

        {/* Deneyimler */}
        <div className={cardClass}>
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-xl font-bold ${headingClass}`}>Deneyimler</h2>
            <button type="button" onClick={addExperience} className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm">+ Deneyim Ekle</button>
          </div>
          {formData.experiences.length === 0 ? (
            <div className={`text-center py-8 ${subTextClass}`}>
              <p>Henüz deneyim eklenmemiş.</p>
              <button type="button" onClick={addExperience} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">İlk Deneyimi Ekle</button>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="experiences">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
                    {formData.experiences.map((exp, index) => (
                      <Draggable key={`exp-${index}`} draggableId={`exp-${index}`} index={index}>
                        {(provided, snapshot) => (
                          <div ref={provided.innerRef} {...provided.draggableProps}
                            className={`border ${innerBorderClass} rounded-xl p-4 relative ${snapshot.isDragging ? (isGlass ? 'bg-white/5' : 'shadow-lg bg-gray-50 dark:bg-gray-700') : ''}`}>
                            <div className="flex items-center justify-between mb-3">
                              <div {...provided.dragHandleProps} className={`cursor-move flex items-center ${subTextClass} hover:opacity-80`} title="Sürükleyerek sırayı değiştir">
                                <GripHorizontal className="w-5 h-5" />
                                <span className="ml-2 text-sm font-medium">Deneyim #{index + 1}</span>
                              </div>
                              <button type="button" onClick={() => removeExperience(index)} className={isGlass ? 'text-red-300 hover:text-red-200' : 'text-red-600 dark:text-red-400 hover:text-red-800'} title="Sil">
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className={`block text-sm font-medium mb-1 ${labelClass}`}>Pozisyon <span className="text-red-500">*</span></label>
                                <input type="text" value={exp.title} onChange={(e) => updateExperience(index, 'title', e.target.value)} required className={inputClass} placeholder="Senior Developer" />
                              </div>
                              <div>
                                <label className={`block text-sm font-medium mb-1 ${labelClass}`}>Şirket <span className="text-red-500">*</span></label>
                                <input type="text" value={exp.company} onChange={(e) => updateExperience(index, 'company', e.target.value)} required className={inputClass} placeholder="ABC Teknoloji" />
                              </div>
                              <div className="md:col-span-2">
                                <label className={`block text-sm font-medium mb-1 ${labelClass}`}>Dönem <span className="text-red-500">*</span></label>
                                <input type="text" value={exp.period} onChange={(e) => updateExperience(index, 'period', e.target.value)} required className={inputClass} placeholder="2020 - 2023 veya 2020 - Halen" />
                              </div>
                              <div className="md:col-span-2">
                                <label className={`block text-sm font-medium mb-1 ${labelClass}`}>Açıklama <span className="text-red-500">*</span></label>
                                <textarea value={exp.description} onChange={(e) => updateExperience(index, 'description', e.target.value)} required rows={3} className={inputClass} placeholder="Bu pozisyonda yaptığınız işleri kısaca açıklayın..." />
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
        <div className={cardClass}>
          <h2 className={`text-xl font-bold mb-4 ${headingClass}`}>Teknolojiler ve Araçlar</h2>
          <div className="mb-4">
            <label htmlFor="technologies" className={`block text-sm font-medium mb-2 ${labelClass}`}>Teknolojiler (virgülle ayırın)</label>
            <input type="text" id="technologies" name="technologies" value={formData.technologies} onChange={handleInputChange} className={inputClass} placeholder="React, Node.js, MongoDB, Docker, AWS" />
            <p className={`mt-1 text-sm ${subTextClass}`}>Teknolojileri virgülle ayırarak yazın.</p>
          </div>
        </div>

        {/* Yetkinlikler */}
        <div className={`${cardClass} ${isGlass ? '' : 'border-l-4 border-l-purple-500'}`}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className={`text-xl font-bold ${headingClass}`}>Yetkinlikler</h2>
              <p className={`text-sm mt-1 ${isGlass ? 'text-purple-300' : 'text-purple-600 dark:text-purple-400'}`}>Bu bilgiler sadece PDF CV'de görünecek</p>
            </div>
            <button type="button" onClick={addSkill} className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors text-sm">+ Kategori Ekle</button>
          </div>
          {formData.skills.length === 0 ? (
            <div className={`text-center py-8 ${subTextClass}`}><p>Henüz yetkinlik kategorisi eklenmemiş.</p></div>
          ) : (
            <div className="space-y-4">
              {formData.skills.map((skill, index) => (
                <div key={index} className={`border ${innerBorderClass} rounded-xl p-4`}>
                  <div className="flex justify-between items-center mb-3">
                    <span className={`text-sm font-medium ${subTextClass}`}>Kategori #{index + 1}</span>
                    <button type="button" onClick={() => removeSkill(index)} className={isGlass ? 'text-red-300 hover:text-red-200' : 'text-red-600 dark:text-red-400 hover:text-red-800'}><X className="w-5 h-5" /></button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${labelClass}`}>Kategori Adı</label>
                      <input type="text" value={skill.category} onChange={(e) => updateSkillCategory(index, e.target.value)} className={inputClass} placeholder="Frontend Geliştirme" />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${labelClass}`}>Yetenekler (virgülle ayırın)</label>
                      <input type="text" value={skill.items} onChange={(e) => updateSkillItems(index, e.target.value)} className={inputClass} placeholder="React, Vue.js, Angular" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Diller */}
        <div className={`${cardClass} ${isGlass ? '' : 'border-l-4 border-l-blue-500'}`}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className={`text-xl font-bold ${headingClass}`}>Yabancı Diller</h2>
              <p className={`text-sm mt-1 ${isGlass ? 'text-blue-300' : 'text-blue-600 dark:text-blue-400'}`}>Bu bilgiler sadece PDF CV'de görünecek</p>
            </div>
            <button type="button" onClick={addLanguage} className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm">+ Dil Ekle</button>
          </div>
          {formData.languages.length === 0 ? (
            <div className={`text-center py-8 ${subTextClass}`}><p>Henüz dil eklenmemiş.</p></div>
          ) : (
            <div className="space-y-3">
              {formData.languages.map((lang, index) => (
                <div key={index} className={`border ${innerBorderClass} rounded-xl p-4`}>
                  <div className="flex items-center gap-3">
                    <div className="flex-1"><input type="text" value={lang.language} onChange={(e) => updateLanguage(index, 'language', e.target.value)} className={inputClass} placeholder="İngilizce" /></div>
                    <div className="flex-1"><input type="text" value={lang.level} onChange={(e) => updateLanguage(index, 'level', e.target.value)} className={inputClass} placeholder="İleri Seviye" /></div>
                    <button type="button" onClick={() => removeLanguage(index)} className={isGlass ? 'text-red-300 hover:text-red-200' : 'text-red-600 dark:text-red-400 hover:text-red-800'}><X className="w-5 h-5" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Referanslar */}
        <div className={`${cardClass} ${isGlass ? '' : 'border-l-4 border-l-green-500'}`}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className={`text-xl font-bold ${headingClass}`}>Referanslar</h2>
              <p className={`text-sm mt-1 ${isGlass ? 'text-green-300' : 'text-green-600 dark:text-green-400'}`}>Bu bilgiler sadece PDF CV'de görünecek</p>
            </div>
            <button type="button" onClick={addReference} className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm">+ Referans Ekle</button>
          </div>
          {formData.references.length === 0 ? (
            <div className={`text-center py-8 ${subTextClass}`}><p>Henüz referans eklenmemiş.</p></div>
          ) : (
            <div className="space-y-4">
              {formData.references.map((ref, index) => (
                <div key={index} className={`border ${innerBorderClass} rounded-xl p-4`}>
                  <div className="flex justify-between items-center mb-3">
                    <span className={`text-sm font-medium ${subTextClass}`}>Referans #{index + 1}</span>
                    <button type="button" onClick={() => removeReference(index)} className={isGlass ? 'text-red-300 hover:text-red-200' : 'text-red-600 dark:text-red-400 hover:text-red-800'}><X className="w-5 h-5" /></button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div><label className={`block text-sm font-medium mb-1 ${labelClass}`}>İsim Soyisim</label><input type="text" value={ref.name} onChange={(e) => updateReference(index, 'name', e.target.value)} className={inputClass} placeholder="Ahmet Yılmaz" /></div>
                    <div><label className={`block text-sm font-medium mb-1 ${labelClass}`}>Ünvan</label><input type="text" value={ref.title} onChange={(e) => updateReference(index, 'title', e.target.value)} className={inputClass} placeholder="Yazılım Müdürü" /></div>
                    <div><label className={`block text-sm font-medium mb-1 ${labelClass}`}>Şirket (Opsiyonel)</label><input type="text" value={ref.company} onChange={(e) => updateReference(index, 'company', e.target.value)} className={inputClass} placeholder="ABC Teknoloji" /></div>
                    <div><label className={`block text-sm font-medium mb-1 ${labelClass}`}>Telefon (Opsiyonel)</label><input type="tel" value={ref.phone} onChange={(e) => updateReference(index, 'phone', e.target.value)} className={inputClass} placeholder="+90 xxx xxx xx xx" /></div>
                    <div className="md:col-span-2"><label className={`block text-sm font-medium mb-1 ${labelClass}`}>E-posta (Opsiyonel)</label><input type="email" value={ref.email} onChange={(e) => updateReference(index, 'email', e.target.value)} className={inputClass} placeholder="referans@example.com" /></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Eğitim */}
        <div className={`${cardClass} ${isGlass ? '' : 'border-l-4 border-l-orange-500'}`}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className={`text-xl font-bold ${headingClass}`}>Eğitim Bilgileri</h2>
              <p className={`text-sm mt-1 ${isGlass ? 'text-orange-300' : 'text-orange-600 dark:text-orange-400'}`}>Bu bilgiler sadece PDF CV'de görünecek</p>
            </div>
            <button type="button" onClick={addEducation} className="px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors text-sm">+ Eğitim Ekle</button>
          </div>
          {formData.education.length === 0 ? (
            <div className={`text-center py-8 ${subTextClass}`}><p>Henüz eğitim bilgisi eklenmemiş.</p></div>
          ) : (
            <div className="space-y-4">
              {formData.education.map((edu, index) => (
                <div key={index} className={`border ${innerBorderClass} rounded-xl p-4`}>
                  <div className="flex justify-between items-center mb-3">
                    <span className={`text-sm font-medium ${subTextClass}`}>Eğitim #{index + 1}</span>
                    <button type="button" onClick={() => removeEducation(index)} className={isGlass ? 'text-red-300 hover:text-red-200' : 'text-red-600 dark:text-red-400 hover:text-red-800'}><X className="w-5 h-5" /></button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${labelClass}`}>Okul Türü *</label>
                      <select value={edu.degree} onChange={(e) => updateEducation(index, 'degree', e.target.value)} className={inputClass}>
                        <option value="">Seçiniz...</option>
                        <option value="İlkokul">İlkokul</option><option value="Ortaokul">Ortaokul</option>
                        <option value="Lise">Lise</option><option value="Önlisans">Önlisans</option>
                        <option value="Üniversite">Üniversite</option><option value="Yüksek Lisans">Yüksek Lisans</option>
                        <option value="Doktora">Doktora</option>
                      </select>
                    </div>
                    <div><label className={`block text-sm font-medium mb-1 ${labelClass}`}>Okul Adı *</label><input type="text" value={edu.school} onChange={(e) => updateEducation(index, 'school', e.target.value)} className={inputClass} placeholder="Ankara Üniversitesi" /></div>
                    <div><label className={`block text-sm font-medium mb-1 ${labelClass}`}>Bölüm (Opsiyonel)</label><input type="text" value={edu.department} onChange={(e) => updateEducation(index, 'department', e.target.value)} className={inputClass} placeholder="Bilgisayar Mühendisliği" /></div>
                    <div><label className={`block text-sm font-medium mb-1 ${labelClass}`}>Yıl (Opsiyonel)</label><input type="text" value={edu.year} onChange={(e) => updateEducation(index, 'year', e.target.value)} className={inputClass} placeholder="2015 - 2019" /></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CV Yönetimi */}
        <div className={cardClass}>
          <h2 className={`text-xl font-bold mb-4 ${headingClass}`}>CV Yönetimi</h2>
          {formData.cvFile && (
            <div className={`mb-4 p-4 rounded-xl ${
              isGlass ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isGlass ? 'text-green-300' : 'text-green-900 dark:text-green-400'}`}>CV dosyanız yüklü</p>
                  <a href={formData.cvFile} target="_blank" rel="noopener noreferrer"
                    className={`text-xs underline ${isGlass ? 'text-green-400 hover:text-green-300' : 'text-green-700 dark:text-green-500 hover:text-green-800'}`}>CV'yi Görüntüle</a>
                </div>
                <button type="button" onClick={() => setDeleteModal({ open: true, type: 'cv', title: 'CV Dosyasını Sil' })} disabled={cvUploading}
                  className="px-3 py-2 bg-red-600 text-white text-sm rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50">
                  {cvUploading ? 'Siliniyor...' : 'Sil'}
                </button>
              </div>
            </div>
          )}
          <div className="space-y-3">
            <div>
              <label htmlFor="cv-file" className={`block text-sm font-medium mb-2 ${labelClass}`}>{formData.cvFile ? 'Yeni CV Yükle' : 'CV Dosyası Yükle'} (PDF)</label>
              <input type="file" id="cv-file" accept=".pdf" onChange={handleCVFileChange} disabled={cvUploading}
                className={`w-full px-3 py-2 rounded-xl disabled:opacity-50 ${isGlass ? 'bg-white/5 border border-white/10 text-indigo-200' : 'border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'}`} />
              <p className={`mt-1 text-sm ${subTextClass}`}>Sadece PDF formatında, maksimum 5MB boyutunda dosya yüklenebilir.</p>
            </div>
            {cvFile && (
              <div className={`flex items-center justify-between p-3 rounded-xl ${
                isGlass ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20'
              }`}>
                <span className={`text-sm ${isGlass ? 'text-blue-300' : 'text-blue-900 dark:text-blue-400'}`}>{cvFile.name}</span>
                <button type="button" onClick={handleCVUpload} disabled={cvUploading}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50">
                  {cvUploading ? 'Yükleniyor...' : 'Yükle'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profil Resmi Yönetimi */}
        <div className={cardClass}>
          <h2 className={`text-xl font-bold mb-4 ${headingClass}`}>Profil Resmi Yönetimi</h2>
          {formData.profileImage && (
            <div className={`mb-4 p-4 rounded-xl ${
              isGlass ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img src={formData.profileImage} alt="Profil" className="w-20 h-20 rounded-full object-cover border-2 border-green-500" />
                  <div>
                    <p className={`text-sm font-medium ${isGlass ? 'text-green-300' : 'text-green-900 dark:text-green-400'}`}>Profil resminiz yüklü</p>
                    <a href={formData.profileImage} target="_blank" rel="noopener noreferrer"
                      className={`text-xs underline ${isGlass ? 'text-green-400 hover:text-green-300' : 'text-green-700 dark:text-green-500 hover:text-green-800'}`}>Resmi görüntüle</a>
                  </div>
                </div>
                <button type="button" onClick={() => setDeleteModal({ open: true, type: 'profileImage', title: 'Profil Resmini Sil' })} disabled={profileImageUploading}
                  className="px-3 py-2 bg-red-600 text-white text-sm rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50">
                  {profileImageUploading ? 'Siliniyor...' : 'Sil'}
                </button>
              </div>
            </div>
          )}
          <div className="space-y-3">
            <div>
              <label htmlFor="profile-image-file" className={`block text-sm font-medium mb-2 ${labelClass}`}>{formData.profileImage ? 'Yeni Profil Resmi Yükle' : 'Profil Resmi Yükle'}</label>
              <input type="file" id="profile-image-file" accept="image/*" onChange={handleProfileImageFileChange} disabled={profileImageUploading}
                className={`w-full px-3 py-2 rounded-xl disabled:opacity-50 ${isGlass ? 'bg-white/5 border border-white/10 text-indigo-200' : 'border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'}`} />
              <p className={`mt-1 text-sm ${subTextClass}`}>JPG, PNG veya WebP formatında, maksimum 5MB boyutunda resim yüklenebilir.</p>
            </div>
            {profileImageFile && (
              <div className={`flex items-center justify-between p-3 rounded-xl ${
                isGlass ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20'
              }`}>
                <span className={`text-sm ${isGlass ? 'text-blue-300' : 'text-blue-900 dark:text-blue-400'}`}>{profileImageFile.name}</span>
                <button type="button" onClick={handleProfileImageUpload} disabled={profileImageUploading}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50">
                  {profileImageUploading ? 'Yükleniyor...' : 'Yükle'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Kaydet */}
        <div className="flex justify-end">
          <button type="submit" disabled={saving}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg">
            {saving ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>Kaydediliyor...
              </span>
            ) : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AboutManagement;
