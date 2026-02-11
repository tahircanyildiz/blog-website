import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getBlogById, createBlog, updateBlog } from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';
import { Info } from 'lucide-react';

/**
 * Blog Oluştur/Düzenle Formu (WYSIWYG Editör)
 * Medium tarzı profesyonel editör
 */
function BlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isGlass = theme === 'glass';
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    shortDescription: '',
    tags: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'indent',
    'align',
    'blockquote', 'code-block',
    'link', 'image', 'video'
  ];

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  useEffect(() => {
    if (isEditMode) fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await getBlogById(id);
      const blog = response.data;
      setFormData({
        title: blog.title,
        content: blog.content,
        shortDescription: blog.shortDescription,
        tags: blog.tags?.join(', ') || '',
      });
    } catch (err) {
      setError('Blog yüklenirken bir hata oluştu');
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (value) => {
    setFormData((prev) => ({ ...prev, content: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = {
        ...formData,
        tags: formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      };

      if (isEditMode) {
        await updateBlog(id, data);
        showNotification('Blog başarıyla güncellendi', 'success');
      } else {
        await createBlog(data);
        showNotification('Blog başarıyla oluşturuldu', 'success');
      }

      setTimeout(() => navigate('/mrpurposeless/blogs'), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Bir hata oluştu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cardClass = isGlass
    ? 'bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6'
    : 'bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-6';
  const headingClass = isGlass ? 'text-white' : 'text-gray-900 dark:text-white';
  const subTextClass = isGlass ? 'text-indigo-300' : 'text-gray-600 dark:text-gray-400';
  const labelClass = isGlass ? 'text-indigo-200 text-sm font-semibold' : 'text-gray-700 dark:text-gray-300 text-sm font-semibold';
  const hintClass = isGlass ? 'text-indigo-400/70' : 'text-gray-500 dark:text-gray-500';
  const inputClass = isGlass
    ? 'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-500'
    : 'w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors';

  return (
    <div className="max-w-6xl mx-auto">
      {/* Bildirim */}
      {notification.show && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl text-white text-sm font-medium transition-all duration-300 ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-3xl font-bold ${headingClass}`}>
          {isEditMode ? 'Blog Düzenle' : 'Yeni Blog Oluştur'}
        </h1>
        <p className={`mt-2 ${subTextClass}`}>
          Medium tarzı editör ile blog yazınızı oluşturun. Görseller, kod blokları ve daha fazlası...
        </p>
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

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className={cardClass}>
          <label htmlFor="title" className={`block mb-2 ${labelClass}`}>
            Başlık *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className={`${inputClass} text-lg font-semibold`}
            placeholder="Blog başlığınızı girin..."
          />
        </div>

        {/* Short Description */}
        <div className={cardClass}>
          <label htmlFor="shortDescription" className={`block mb-2 ${labelClass}`}>
            Kısa Açıklama * (Max 200 karakter)
          </label>
          <textarea
            id="shortDescription"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            required
            maxLength={200}
            rows={3}
            className={inputClass}
            placeholder="Blog yazınızın kısa açıklaması..."
          />
          <p className={`mt-2 text-sm ${hintClass}`}>{formData.shortDescription.length}/200 karakter</p>
        </div>

        {/* Content - Rich Text Editor */}
        <div className={cardClass}>
          <label className={`block mb-4 ${labelClass}`}>
            İçerik *
          </label>

          <div className={`rounded-xl overflow-hidden ${
            isGlass
              ? 'border border-white/10 quill-glass'
              : 'border border-gray-300 dark:border-gray-600'
          }`}>
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={handleContentChange}
              modules={modules}
              formats={formats}
              placeholder="Blog içeriğinizi buraya yazın... Görseller ekleyin, kod blokları oluşturun, metni biçimlendirin..."
              className="quill-editor"
              style={{ minHeight: '400px' }}
            />
          </div>

          <div className={`mt-4 rounded-xl p-4 ${
            isGlass
              ? 'bg-blue-500/10 border border-blue-500/20'
              : 'bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20'
          }`}>
            <div className="flex items-start gap-2">
              <Info className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isGlass ? 'text-blue-400' : 'text-blue-400'}`} />
              <div>
                <h4 className={`font-semibold mb-2 ${isGlass ? 'text-blue-300' : 'text-blue-900 dark:text-blue-300'}`}>Editör Özellikleri:</h4>
                <ul className={`text-sm space-y-1 ${isGlass ? 'text-blue-300/80' : 'text-blue-800 dark:text-blue-300/80'}`}>
                  <li>Başlıklar: H1, H2, H3, H4, H5, H6 seçenekleri</li>
                  <li>Metin Biçimlendirme: Kalın, italik, altı çizili, üstü çizili</li>
                  <li>Renkler: Metin ve arka plan rengi seçimi</li>
                  <li>Listeler: Numaralı ve madde işaretli listeler</li>
                  <li>Kod: Kod blokları ve inline kod</li>
                  <li>Medya: Görsel, video ve link ekleme</li>
                  <li>Hizalama: Sola, ortaya, sağa, justify hizalama</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className={cardClass}>
          <label htmlFor="tags" className={`block mb-2 ${labelClass}`}>
            Etiketler (virgülle ayırın)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className={inputClass}
            placeholder="javascript, react, nodejs, web development"
          />
          <p className={`mt-2 text-sm ${hintClass}`}>
            Etiketleri virgülle ayırarak yazın. Örn: javascript, react, tutorial
          </p>
        </div>

        {/* Buttons */}
        <div className={`${cardClass} flex justify-end gap-3`}>
          <button
            type="button"
            onClick={() => navigate('/mrpurposeless/blogs')}
            className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
              isGlass
                ? 'bg-white/10 text-indigo-200 hover:bg-white/20 border border-white/10'
                : 'border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Kaydediliyor...
              </>
            ) : (
              isEditMode ? 'Güncelle' : 'Oluştur'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BlogForm;
