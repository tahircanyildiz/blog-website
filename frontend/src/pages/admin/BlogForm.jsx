import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBlogById, createBlog, updateBlog } from '../../services/api';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

/**
 * Blog Oluştur/Düzenle Formu (Markdown destekli)
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

      navigate('/admin/blogs');
    } catch (err) {
      setError(err.response?.data?.message || 'Bir hata oluştu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditMode ? 'Blog Düzenle' : 'Yeni Blog Oluştur'}
        </h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Başlık *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Blog başlığını girin"
          />
        </div>

        {/* Short Description */}
        <div className="mb-4">
          <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-2">
            Kısa Açıklama * (Max 200 karakter)
          </label>
          <textarea
            id="shortDescription"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            required
            maxLength={200}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Kısa açıklama"
          />
          <p className="mt-1 text-sm text-gray-500">{formData.shortDescription.length}/200</p>
        </div>

        {/* Content - Markdown Editor */}
        <div className="mb-6">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            İçerik * (Markdown destekler)
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Markdown Input */}
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={15}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
              placeholder="Markdown formatında blog içeriğini yazın (örn. ```js ... ```)"
            />

            {/* Live Markdown Preview */}
            <div className="border border-gray-300 rounded-md p-3 bg-gray-50 overflow-y-auto max-h-[400px] prose prose-indigo">
              <ReactMarkdown
                children={formData.content}
                components={{
                  code({ inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-md"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code
                        className="bg-gray-200 text-gray-800 rounded px-1 py-0.5 font-mono text-sm"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
            Etiketler (virgülle ayırın)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="javascript, react, nodejs"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/blogs')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Kaydediliyor...' : isEditMode ? 'Güncelle' : 'Oluştur'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BlogForm;
