import { useEffect, useState } from 'react';

/**
 * Hangi section'ın viewport'ta olduğunu track eden hook.
 * Navbar'da active state göstermek için kullanılır.
 *
 * @param {Array<string>} sectionIds - Section ID'lerinin listesi (ör: ['home', 'about', 'contact'])
 * @returns {string} activeSection - Aktif section'ın ID'si
 */
export const useScrollSpy = (sectionIds) => {
  const [activeSection, setActiveSection] = useState(sectionIds[0] || '');

  useEffect(() => {
    if (!sectionIds || sectionIds.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Section %50'den fazla görünürse aktif yap
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: [0.5],
        rootMargin: '-80px 0px -50% 0px' // Navbar yüksekliği ve viewport'un yarısı
      }
    );

    // Tüm section'ları observe et
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    // Cleanup
    return () => observer.disconnect();
  }, [sectionIds]);

  return activeSection;
};

export default useScrollSpy;
