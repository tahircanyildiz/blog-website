import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getBlogById, createBlog, updateBlog } from '../../services/api';

/**
 * Blog Oluştur/Düzenle Formu (WYSIWYG Editör)
 * Medium tarzı profesyonel editör
 */
function BlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    shortDescription: '',
    tags: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Quill editör modülleri (toolbar seçenekleri)
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContentChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      content: value,
    }));
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
        alert('Blog başarıyla güncellendi');
      } else {
        await createBlog(data);
        alert('Blog başarıyla oluşturuldu');
      }

      navigate('/mrpurposeless/blogs');
    } catch (err) {
      setError(err.response?.data?.message || 'Bir hata oluştu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditMode ? 'Blog Düzenle' : 'Yeni Blog Oluştur'}
        </h1>
        <p className="text-gray-600 mt-2">
          Medium tarzı editör ile blog yazınızı oluşturun. Görseller, kod blokları ve daha fazlası...
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-blue-100">
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
            Başlık *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold"
            placeholder="Blog başlığınızı girin..."
          />
        </div>

        {/* Short Description */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-blue-100">
          <label htmlFor="shortDescription" className="block text-sm font-semibold text-gray-700 mb-2">
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
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Blog yazınızın kısa açıklaması..."
          />
          <p className="mt-2 text-sm text-gray-500">{formData.shortDescription.length}/200 karakter</p>
        </div>

        {/* Content - Rich Text Editor */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-blue-100">
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            İçerik * (WYSIWYG Editör)
          </label>

          {/* React Quill Editor */}
          <div className="bg-white rounded-xl overflow-hidden border border-gray-300">
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

          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-semibold text-blue-900 mb-2">💡 Editör Özellikleri:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Başlıklar:</strong> H1, H2, H3, H4, H5, H6 seçenekleri</li>
              <li>• <strong>Metin Biçimlendirme:</strong> Kalın, italik, altı çizili, üstü çizili</li>
              <li>• <strong>Renkler:</strong> Metin ve arka plan rengi seçimi</li>
              <li>• <strong>Listeler:</strong> Numaralı ve madde işaretli listeler</li>
              <li>• <strong>Kod:</strong> Kod blokları ve inline kod</li>
              <li>• <strong>Medya:</strong> Görsel, video ve link ekleme</li>
              <li>• <strong>Hizalama:</strong> Sola, ortaya, sağa, justify hizalama</li>
            </ul>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-blue-100">
          <label htmlFor="tags" className="block text-sm font-semibold text-gray-700 mb-2">
            Etiketler (virgülle ayırın)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="javascript, react, nodejs, web development"
          />
          <p className="mt-2 text-sm text-gray-500">
            Etiketleri virgülle ayırarak yazın. Örn: javascript, react, tutorial
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 bg-white shadow-lg rounded-2xl p-6 border border-blue-100">
          <button
            type="button"
            onClick={() => navigate('/mrpurposeless/blogs')}
            className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-all"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-violet-700 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Kaydediliyor...
              </span>
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
