import { useState, useEffect, useRef } from 'react';
import { Briefcase, Code2, Download, FileDown } from 'lucide-react';
import { getAbout, getSettings } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Hakkımda Sayfası
 * API'den hakkımda bilgilerini çeker ve gösterir
 */
function About() {
  const [aboutData, setAboutData] = useState(null);
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);
  const cvRef = useRef(null);

  // Sayfa yüklendiğinde hakkımda ve iletişim bilgilerini çek
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [aboutResponse, settingsResponse] = await Promise.all([
        getAbout(),
        getSettings()
      ]);
      setAboutData(aboutResponse.data);
      setContactInfo(settingsResponse.data.contactInfo);
    } catch (err) {
      setError(err.response?.data?.message || 'Veriler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  // PDF olarak kaydet - Özel CV Template
  const handleGeneratePDF = async () => {
    try {
      setGenerating(true);

      // Debug: Verileri kontrol et
      console.log('=== PDF Data Debug ===');
      console.log('Skills:', aboutData.skills);
      console.log('Languages:', aboutData.languages);
      console.log('References:', aboutData.references);
      console.log('Contact Info:', contactInfo);

      // Özel CV HTML oluştur - Compact, tek sayfa, 2 kolon layout
      const cvHTML = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: white; width: 210mm; font-size: 11px;">
          <!-- Header - Compact -->
          <div style="border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-bottom: 15px;">
            <h1 style="margin: 0; font-size: 24px; color: #1e40af;">${aboutData.name || ''}</h1>
            <h2 style="margin: 5px 0 0 0; font-size: 14px; color: #6b7280;">${aboutData.title || ''}</h2>
            <div style="margin-top: 8px; font-size: 10px; color: #4b5563; display: flex; gap: 15px;">
              ${contactInfo?.email ? `<span>📧 ${contactInfo.email}</span>` : ''}
              ${contactInfo?.phone ? `<span>📱 ${contactInfo.phone}</span>` : ''}
            </div>
          </div>

          <!-- 2 Kolon Layout -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <!-- Sol Kolon -->
            <div>
              <!-- Hakkımda -->
              ${aboutData.description ? `
              <div style="margin-bottom: 15px;">
                <h3 style="color: #1e40af; font-size: 13px; margin: 0 0 5px 0; border-bottom: 1px solid #ddd; padding-bottom: 3px; font-weight: bold;">HAKKIMDA</h3>
                <p style="font-size: 10px; line-height: 1.4; color: #374151; margin: 0;">${aboutData.description}</p>
              </div>
              ` : ''}

              <!-- Deneyimler -->
              ${aboutData.experiences && aboutData.experiences.length > 0 ? `
              <div style="margin-bottom: 15px;">
                <h3 style="color: #1e40af; font-size: 13px; margin: 0 0 8px 0; border-bottom: 1px solid #ddd; padding-bottom: 3px; font-weight: bold;">DENEYİMLER</h3>
                ${aboutData.experiences.map(exp => `
                  <div style="margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between;">
                      <h4 style="margin: 0; font-size: 11px; color: #1f2937; font-weight: bold;">${exp.title}</h4>
                      <span style="font-size: 9px; color: #6b7280;">${exp.period}</span>
                    </div>
                    <p style="margin: 2px 0; font-size: 10px; color: #2563eb; font-weight: 600;">${exp.company}</p>
                    <p style="margin: 3px 0 0 0; font-size: 9px; line-height: 1.3; color: #4b5563;">${exp.description}</p>
                  </div>
                `).join('')}
              </div>
              ` : ''}

              <!-- Teknolojiler -->
              ${aboutData.technologies && aboutData.technologies.length > 0 ? `
              <div style="margin-bottom: 15px;">
                <h3 style="color: #1e40af; font-size: 13px; margin: 0 0 5px 0; border-bottom: 1px solid #ddd; padding-bottom: 3px; font-weight: bold;">TEKNOLOJİLER</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                  ${aboutData.technologies.map(tech => `
                    <span style="background: #dbeafe; color: #1e40af; padding: 2px 8px; border-radius: 8px; font-size: 9px; font-weight: 600;">${tech}</span>
                  `).join('')}
                </div>
              </div>
              ` : ''}
            </div>

            <!-- Sağ Kolon -->
            <div>
              <!-- Yetkinlikler -->
              ${aboutData.skills && aboutData.skills.length > 0 ? `
              <div style="margin-bottom: 15px;">
                <h3 style="color: #1e40af; font-size: 13px; margin: 0 0 8px 0; border-bottom: 1px solid #ddd; padding-bottom: 3px; font-weight: bold;">YETKİNLİKLER</h3>
                ${aboutData.skills.map(skill => `
                  <div style="margin-bottom: 8px;">
                    <h4 style="margin: 0 0 3px 0; font-size: 10px; color: #1f2937; font-weight: bold;">${skill.category}</h4>
                    <p style="margin: 0; font-size: 9px; color: #4b5563; line-height: 1.3;">${Array.isArray(skill.items) ? skill.items.join(', ') : skill.items}</p>
                  </div>
                `).join('')}
              </div>
              ` : ''}

              <!-- Diller -->
              ${aboutData.languages && aboutData.languages.length > 0 ? `
              <div style="margin-bottom: 15px;">
                <h3 style="color: #1e40af; font-size: 13px; margin: 0 0 5px 0; border-bottom: 1px solid #ddd; padding-bottom: 3px; font-weight: bold;">YABANCI DİL</h3>
                ${aboutData.languages.map(lang => `
                  <div style="margin-bottom: 3px; font-size: 10px;">
                    <span style="color: #1f2937; font-weight: 600;">${lang.language}:</span>
                    <span style="color: #6b7280; margin-left: 5px;">${lang.level}</span>
                  </div>
                `).join('')}
              </div>
              ` : ''}

              <!-- Referanslar -->
              ${aboutData.references && aboutData.references.length > 0 ? `
              <div style="margin-bottom: 15px;">
                <h3 style="color: #1e40af; font-size: 13px; margin: 0 0 8px 0; border-bottom: 1px solid #ddd; padding-bottom: 3px; font-weight: bold;">REFERANSLAR</h3>
                ${aboutData.references.map(ref => `
                  <div style="margin-bottom: 8px;">
                    <h4 style="margin: 0; font-size: 10px; color: #1f2937; font-weight: bold;">${ref.name}</h4>
                    <p style="margin: 2px 0; font-size: 9px; color: #6b7280;">${ref.title}${ref.company ? ` - ${ref.company}` : ''}</p>
                    ${ref.email || ref.phone ? `
                    <p style="margin: 2px 0; font-size: 8px; color: #9ca3af;">
                      ${ref.email ? `${ref.email}` : ''} ${ref.email && ref.phone ? '|' : ''} ${ref.phone ? `${ref.phone}` : ''}
                    </p>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;

      // Geçici div oluştur
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = cvHTML;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      tempDiv.style.width = '210mm';
      document.body.appendChild(tempDiv);

      // Kısa bir bekleme süresi - DOM'un tamamen render olması için
      await new Promise(resolve => setTimeout(resolve, 100));

      // HTML'i canvas'a çevir
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 794, // 210mm in pixels at 96 DPI
        windowHeight: 1123 // 297mm in pixels at 96 DPI
      });

      // Geçici div'i temizle
      document.body.removeChild(tempDiv);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`${aboutData.name?.replace(/\s+/g, '_')}_CV.pdf`);

    } catch (error) {
      console.error('PDF oluşturma hatası:', error);
      alert('PDF oluşturulurken bir hata oluştu: ' + error.message);
    } finally {
      setGenerating(false);
    }
  };


  if (loading) return <Loading />;
  if (error) return <div className="container mx-auto px-4 py-8"><ErrorMessage message={error} /></div>;
  if (!aboutData) return <div className="container mx-auto px-4 py-8"><ErrorMessage message="Veri bulunamadı" /></div>;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-violet-50 py-6 sm:py-12">
      {/* Decorative gradient shapes */}
      <div className="absolute top-20 right-10 w-48 h-48 sm:w-72 sm:h-72 bg-gradient-to-r from-violet-400 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute bottom-20 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

     {/* Background Logo - Fixed Position */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <img
          src="/logotcy.png"
          alt="Background Logo"
          className="w-[400px] h-[400px] sm:w-[800px] sm:h-[800px] object-contain opacity-5 select-none"
        />
      </div>

      <div ref={cvRef} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Başlık Bölümü */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 mb-8 border border-blue-100">
          {/* Mobilde dikey, Desktop'ta yatay düzen */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-6 mb-6">
            {/* Profil ve İsim Bölümü - Mobilde ortalanmış */}
            <div className="flex flex-col items-center sm:flex-row sm:items-center sm:flex-1 gap-4">
              <div className="w-20 h-20 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0">
                {aboutData.profileImage ? (
                  <img
                    src={aboutData.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src="/mecvlogo.png"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-violet-900 bg-clip-text text-transparent break-words">
                  {aboutData.name}
                </h1>
                <p className="text-lg sm:text-xl text-blue-600 font-medium mt-1 break-words">
                  {aboutData.title}
                </p>
              </div>
            </div>

            {/* CV Butonları - Mobilde tam genişlik */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {aboutData.cvFile && (
                <a
                  href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/about/cv/download`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl group"
                >
                  <Download className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  CV İndir
                </a>
              )}
              <button
                onClick={handleGeneratePDF}
                disabled={generating}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-all duration-300 shadow-lg hover:shadow-xl group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileDown className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                {generating ? 'Oluşturuluyor...' : 'PDF Olarak Kaydet'}
              </button>
            </div>
          </div>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed whitespace-pre-line">
            {aboutData.description}
          </p>
        </div>

        {/* Deneyimler Bölümü */}
        {aboutData.experiences && aboutData.experiences.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-violet-900 bg-clip-text text-transparent mb-6 flex items-center">
              <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-blue-600 flex-shrink-0" strokeWidth={2.5} />
              <span className="break-words">Deneyimler</span>
            </h2>
            <div className="space-y-4 sm:space-y-6">
              {aboutData.experiences.map((exp, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 border-l-4 border-blue-600 hover:shadow-2xl hover:border-violet-600 transition-all duration-300 group"
                >
                  <div className="mb-3">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors break-words">
                      {exp.title}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <span className="text-base sm:text-lg font-semibold text-blue-600 break-words">
                        {exp.company}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-600 font-medium px-3 py-1 bg-gray-100 rounded-full w-fit">
                        {exp.period}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line break-words">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Teknolojiler Bölümü */}
        {aboutData.technologies && aboutData.technologies.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-violet-100">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-violet-900 bg-clip-text text-transparent mb-6 flex items-center">
              <Code2 className="w-6 h-6 sm:w-7 sm:h-7 mr-2 sm:mr-3 text-violet-600 flex-shrink-0" strokeWidth={2.5} />
              <span className="break-words">Teknolojiler ve Yetenekler</span>
            </h2>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {aboutData.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-blue-100 to-violet-100 text-blue-800 rounded-full
                           font-semibold text-xs sm:text-sm hover:from-blue-200 hover:to-violet-200 hover:scale-105
                           transition-all duration-300 shadow-md hover:shadow-lg cursor-default break-words"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default About;
