import { useRef, useState } from 'react';
import { Briefcase, Code2, Download, FileDown } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Deneyim kartı - kendi hook'unu kullanması için ayrı component
function ExperienceCard({ exp, index }) {
  const animation = useScrollAnimation({ threshold: 0.2 });
  return (
    <div
      ref={animation.ref}
      className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 border-l-4 border-[#40916c] hover:shadow-2xl hover:border-[#2d6a4f] transition-all duration-300 group ${
        animation.isVisible ? 'animate-fadeInUp' : 'opacity-0'
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="mb-3">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-[#2d6a4f] transition-colors break-words">
          {exp.title}
        </h3>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="text-base sm:text-lg font-semibold text-[#40916c] break-words">
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
  );
}

/**
 * Hakkımda bölümü
 */
function AboutSection({ aboutData, contactInfo }) {
  const [generating, setGenerating] = useState(false);
  const cvRef = useRef(null);

  const headerAnimation = useScrollAnimation({ threshold: 0.1 });
  const profileAnimation = useScrollAnimation({ threshold: 0.1 });
  const experiencesTitleAnimation = useScrollAnimation({ threshold: 0.2 });
  const techTitleAnimation = useScrollAnimation({ threshold: 0.2 });

  const handleGeneratePDF = async () => {
    try {
      setGenerating(true);

      const cvHTML = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: white; width: 210mm; font-size: 11px;">
          <div style="text-align: center; border-bottom: 2px solid #40916c; padding-bottom: 10px; margin-bottom: 15px;">
            <h1 style="margin: 0; font-size: 24px; color: #2d6a4f;">${aboutData.name || ''}</h1>
            <h2 style="margin: 5px 0; font-size: 14px; color: #6b7280;">${aboutData.title || ''}</h2>
            <div style="margin-top: 8px; font-size: 10px; color: #4b5563;">
              ${contactInfo?.email ? `<span style="margin: 0 10px;">📧 ${contactInfo.email}</span>` : ''}
              ${contactInfo?.phone ? `<span style="margin: 0 10px;">📱 ${contactInfo.phone}</span>` : ''}
              ${contactInfo?.location ? `<span style="margin: 0 10px;">📍 ${contactInfo.location}</span>` : ''}
            </div>
          </div>
          ${aboutData.description ? `
          <div style="margin-bottom: 15px;">
            <h3 style="color: #2d6a4f; font-size: 13px; margin: 0 0 5px 0; border-bottom: 1px solid #ddd; padding-bottom: 3px; font-weight: bold;">HAKKIMDA</h3>
            <p style="font-size: 10px; line-height: 1.4; color: #374151; margin: 0;">${aboutData.description}</p>
          </div>
          ` : ''}
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div>
              ${aboutData.education && aboutData.education.length > 0 ? `
              <div style="margin-bottom: 15px;">
                <h3 style="color: #2d6a4f; font-size: 13px; margin: 0 0 8px 0; border-bottom: 1px solid #ddd; padding-bottom: 3px; font-weight: bold;">EĞİTİM</h3>
                ${aboutData.education.map(edu => `
                  <div style="margin-bottom: 8px;">
                    <h4 style="margin: 0; font-size: 10px; color: #1f2937; font-weight: bold;">${edu.degree}</h4>
                    <p style="margin: 2px 0; font-size: 9px; color: #40916c; font-weight: 600;">${edu.school}</p>
                    ${edu.department ? `<p style="margin: 2px 0; font-size: 9px; color: #6b7280;">${edu.department}</p>` : ''}
                    ${edu.year ? `<p style="margin: 2px 0; font-size: 8px; color: #9ca3af;">${edu.year}</p>` : ''}
                  </div>
                `).join('')}
              </div>
              ` : ''}
              ${aboutData.skills && aboutData.skills.length > 0 ? `
              <div style="margin-bottom: 15px;">
                <h3 style="color: #2d6a4f; font-size: 13px; margin: 0 0 8px 0; border-bottom: 1px solid #ddd; padding-bottom: 3px; font-weight: bold;">YETKİNLİKLER</h3>
                ${aboutData.skills.map(skill => `
                  <div style="margin-bottom: 8px;">
                    <h4 style="margin: 0 0 3px 0; font-size: 10px; color: #1f2937; font-weight: bold;">${skill.category}</h4>
                    <p style="margin: 0; font-size: 9px; color: #4b5563; line-height: 1.3;">${Array.isArray(skill.items) ? skill.items.join(', ') : skill.items}</p>
                  </div>
                `).join('')}
              </div>
              ` : ''}
              ${aboutData.languages && aboutData.languages.length > 0 ? `
              <div style="margin-bottom: 15px;">
                <h3 style="color: #2d6a4f; font-size: 13px; margin: 0 0 5px 0; border-bottom: 1px solid #ddd; padding-bottom: 3px; font-weight: bold;">YABANCI DİL</h3>
                ${aboutData.languages.map(lang => `
                  <div style="margin-bottom: 3px; font-size: 10px;">
                    <span style="color: #1f2937; font-weight: 600;">${lang.language}:</span>
                    <span style="color: #6b7280; margin-left: 5px;">${lang.level}</span>
                  </div>
                `).join('')}
              </div>
              ` : ''}
              ${aboutData.references && aboutData.references.length > 0 ? `
              <div style="margin-bottom: 15px;">
                <h3 style="color: #2d6a4f; font-size: 13px; margin: 0 0 8px 0; border-bottom: 1px solid #ddd; padding-bottom: 3px; font-weight: bold;">REFERANSLAR</h3>
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
            <div>
              ${aboutData.experiences && aboutData.experiences.length > 0 ? `
              <div style="margin-bottom: 15px;">
                <h3 style="color: #2d6a4f; font-size: 13px; margin: 0 0 8px 0; border-bottom: 1px solid #ddd; padding-bottom: 3px; font-weight: bold;">DENEYİMLER</h3>
                ${aboutData.experiences.map(exp => `
                  <div style="margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between;">
                      <h4 style="margin: 0; font-size: 11px; color: #1f2937; font-weight: bold;">${exp.title}</h4>
                      <span style="font-size: 9px; color: #6b7280;">${exp.period}</span>
                    </div>
                    <p style="margin: 2px 0; font-size: 10px; color: #40916c; font-weight: 600;">${exp.company}</p>
                    <p style="margin: 3px 0 0 0; font-size: 9px; line-height: 1.3; color: #4b5563;">${exp.description}</p>
                  </div>
                `).join('')}
              </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = cvHTML;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      tempDiv.style.width = '210mm';
      document.body.appendChild(tempDiv);

      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(tempDiv, {
        scale: 1.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 794,
        windowHeight: 1123
      });

      document.body.removeChild(tempDiv);

      const imgData = canvas.toDataURL('image/jpeg', 0.85);
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;

      pdf.addImage(imgData, 'JPEG', imgX, 0, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`${aboutData.name?.replace(/\s+/g, '_')}_CV.pdf`);

    } catch (error) {
      console.error('PDF oluşturma hatası:', error);
      alert('PDF oluşturulurken bir hata oluştu: ' + error.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <section id="about" className="relative min-h-screen py-12 md:py-20">
      <div ref={cvRef} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Başlık Bölümü */}
        <div
          ref={headerAnimation.ref}
          className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 mb-8 border border-[#b7e4c7] ${
            headerAnimation.isVisible ? 'animate-fadeInDown' : 'opacity-0'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-start gap-6 mb-6">
            <div className="flex flex-col items-center sm:flex-row sm:items-center sm:flex-1 gap-4">
              <div className="w-20 h-20 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#40916c] to-[#2d6a4f] flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0">
                {aboutData?.profileImage ? (
                  <img src={aboutData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <img src="/mecvlogo.png" alt="Profile" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-[#1b4332] to-[#081c15] bg-clip-text text-transparent break-words">
                  {aboutData?.name}
                </h1>
                <p className="text-lg sm:text-xl text-[#40916c] font-medium mt-1 break-words">
                  {aboutData?.title}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {aboutData?.cvFile && (
                <a
                  href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/about/cv/download`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-[#40916c] text-white font-semibold rounded-xl hover:bg-[#2d6a4f] transition-all duration-300 shadow-lg hover:shadow-xl group"
                >
                  <Download className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  CV İndir
                </a>
              )}
              <button
                onClick={handleGeneratePDF}
                disabled={generating}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-[#2d6a4f] text-white font-semibold rounded-xl hover:bg-[#1b4332] transition-all duration-300 shadow-lg hover:shadow-xl group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileDown className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                {generating ? 'Oluşturuluyor...' : 'PDF Olarak Kaydet'}
              </button>
            </div>
          </div>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed whitespace-pre-line">
            {aboutData?.description}
          </p>
        </div>

        {/* Deneyimler Bölümü */}
        {aboutData?.experiences && aboutData.experiences.length > 0 && (
          <div className="mb-8">
            <h2
              ref={experiencesTitleAnimation.ref}
              className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-[#1b4332] to-[#081c15] bg-clip-text text-transparent mb-6 flex items-center ${
                experiencesTitleAnimation.isVisible ? 'animate-fadeInDown' : 'opacity-0'
              }`}
            >
              <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-[#40916c] flex-shrink-0" strokeWidth={2.5} />
              <span className="break-words">Deneyimler</span>
            </h2>
            <div className="space-y-4 sm:space-y-6">
              {aboutData.experiences.map((exp, index) => (
                <ExperienceCard key={index} exp={exp} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Teknolojiler Bölümü */}
        {aboutData?.technologies && aboutData.technologies.length > 0 && (
          <div
            ref={profileAnimation.ref}
            className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-[#b7e4c7] ${
              profileAnimation.isVisible ? 'animate-fadeInUp' : 'opacity-0'
            }`}
          >
            <h2
              ref={techTitleAnimation.ref}
              className={`text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 via-[#1b4332] to-[#081c15] bg-clip-text text-transparent mb-6 flex items-center ${
                techTitleAnimation.isVisible ? 'animate-fadeInDown' : 'opacity-0'
              }`}
            >
              <Code2 className="w-6 h-6 sm:w-7 sm:h-7 mr-2 sm:mr-3 text-[#40916c] flex-shrink-0" strokeWidth={2.5} />
              <span className="break-words">Teknolojiler ve Yetenekler</span>
            </h2>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {aboutData.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-[#d8f3dc] to-[#b7e4c7] text-[#1b4332] rounded-full
                           font-semibold text-xs sm:text-sm hover:from-[#b7e4c7] hover:to-[#95d5b2] hover:scale-105
                           transition-all duration-300 shadow-md hover:shadow-lg cursor-default break-words"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default AboutSection;
