import { useState } from 'react';
import { Mail, MapPin, Send, Link as LinkIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { sendContactMessage } from '../../services/api';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import SocialMediaIcon from '../../components/SocialMediaIcon';

/**
 * Contact Section - İletişim bölümü
 * @param {Object} props
 * @param {Object} props.contactInfo - İletişim bilgileri { email, location, phone }
 * @param {Array} props.socialMedia - Sosyal medya linkleri
 */
function ContactSection({ contactInfo, socialMedia }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Scroll animations
  const headerAnimation = useScrollAnimation({ threshold: 0.2 });
  const contactInfoAnimation = useScrollAnimation({ threshold: 0.2 });
  const formAnimation = useScrollAnimation({ threshold: 0.2 });

  const getPlatformLabel = (platform) => {
    const labels = {
      github: 'GitHub',
      linkedin: 'LinkedIn',
      twitter: 'Twitter/X',
      instagram: 'Instagram',
      facebook: 'Facebook',
      youtube: 'YouTube',
      medium: 'Medium',
      tiktok: 'TikTok',
      discord: 'Discord',
      telegram: 'Telegram',
      whatsapp: 'WhatsApp',
      email: 'Email'
    };
    return labels[platform] || platform;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'İsim alanı zorunludur';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-posta alanı zorunludur';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Mesaj alanı zorunludur';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Mesaj en az 10 karakter olmalıdır';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setSubmitStatus(null);

      await sendContactMessage(formData);

      setFormData({
        name: '',
        email: '',
        message: '',
      });
      setSubmitStatus('success');

      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    } catch (err) {
      setSubmitStatus('error');
      console.error('Form gönderme hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative min-h-screen py-12 md:py-20">
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Başlık */}
        <div
          ref={headerAnimation.ref}
          className={`text-center mb-8 sm:mb-12 ${
            headerAnimation.isVisible ? 'animate-fadeInDown' : 'opacity-0'
          }`}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-[#1b4332] to-[#081c15] bg-clip-text text-transparent mb-4 break-words px-2">
            İletişim
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Benimle iletişime geçmek için aşağıdaki formu kullanabilirsiniz
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {/* İletişim Bilgileri */}
          <div
            ref={contactInfoAnimation.ref}
            className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-[#b7e4c7] ${
              contactInfoAnimation.isVisible ? 'animate-fadeInLeft' : 'opacity-0'
            }`}
          >
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 via-[#1b4332] to-[#081c15] bg-clip-text text-transparent mb-6 break-words">
              İletişim Bilgileri
            </h2>

            <div className="space-y-6">
              {contactInfo?.email && contactInfo.email.trim() !== '' && (
                <div className="flex items-start group">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#d8f3dc] to-[#b7e4c7] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-[#40916c]" strokeWidth={2} />
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">E-posta</h3>
                    <a href={`mailto:${contactInfo.email}`} className="text-sm sm:text-base text-[#40916c] hover:text-[#2d6a4f] transition-colors font-medium break-all">
                      {contactInfo.email}
                    </a>
                  </div>
                </div>
              )}

              {contactInfo?.location && contactInfo.location.trim() !== '' && (
                <div className="flex items-start group">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#d8f3dc] to-[#b7e4c7] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-[#40916c]" strokeWidth={2} />
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Konum</h3>
                    <p className="text-sm sm:text-base text-gray-600 whitespace-pre-line break-words">{contactInfo.location}</p>
                  </div>
                </div>
              )}

              {socialMedia && socialMedia.length > 0 && (
                <div className="flex items-start group">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#d8f3dc] to-[#b7e4c7] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <LinkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#40916c]" strokeWidth={2} />
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Sosyal Medya</h3>
                    <div className="flex flex-wrap gap-2 sm:gap-3 mt-2">
                      {socialMedia.map((item) => (
                        <a
                          key={item.platform}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#40916c] hover:text-[#2d6a4f] transition-all transform hover:scale-110 duration-300"
                          aria-label={getPlatformLabel(item.platform)}
                          title={getPlatformLabel(item.platform)}
                        >
                          <SocialMediaIcon platform={item.platform} className="w-5 h-5 sm:w-6 sm:h-6" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {!contactInfo?.email && !contactInfo?.location && (!socialMedia || socialMedia.length === 0) && (
                <div className="text-center py-8 text-sm sm:text-base text-gray-500">
                  <p>İletişim bilgileri henüz eklenmemiş.</p>
                </div>
              )}
            </div>
          </div>

          {/* İletişim Formu */}
          <div
            ref={formAnimation.ref}
            className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-[#b7e4c7] ${
              formAnimation.isVisible ? 'animate-fadeInRight' : 'opacity-0'
            }`}
          >
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 via-[#1b4332] to-[#081c15] bg-clip-text text-transparent mb-6 break-words">
              Mesaj Gönder
            </h2>

            {submitStatus === 'success' && (
              <div className="mb-4 sm:mb-6 bg-green-50 border-2 border-green-200 text-green-700 px-3 py-2 sm:px-4 sm:py-3 rounded-xl shadow-md">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" strokeWidth={2.5} />
                  <p className="text-sm sm:text-base font-semibold">Mesajınız başarıyla gönderildi!</p>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-4 sm:mb-6 bg-red-50 border-2 border-red-200 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded-xl shadow-md">
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" strokeWidth={2.5} />
                  <p className="text-sm sm:text-base font-semibold">Mesaj gönderilemedi. Lütfen tekrar deneyin.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  İsim <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-[#40916c] focus:border-[#40916c] outline-none transition-colors ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Adınız Soyadınız"
                />
                {errors.name && <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  E-posta <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-[#40916c] focus:border-[#40916c] outline-none transition-colors ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="email@example.com"
                />
                {errors.email && <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="message" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Mesaj <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-[#40916c] focus:border-[#40916c] outline-none transition-colors resize-none ${
                    errors.message ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Mesajınızı buraya yazın..."
                ></textarea>
                {errors.message && <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-base bg-gradient-to-r from-[#40916c] to-[#2d6a4f] text-white rounded-xl font-semibold
                         hover:from-[#2d6a4f] hover:to-[#1b4332] transition-all duration-300 shadow-lg hover:shadow-xl
                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-105"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" strokeWidth={2.5} />
                    Gönder
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
