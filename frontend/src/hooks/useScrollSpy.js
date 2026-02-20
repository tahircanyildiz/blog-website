import { useState, useEffect } from 'react';

/**
 * Aktif bölümü takip eden scroll spy hook'u
 * Scroll pozisyonunu doğrudan ölçer — IntersectionObserver'dan daha güvenilir
 */
export const useScrollSpy = (sectionIds) => {
  const [activeSection, setActiveSection] = useState(sectionIds[0] || '');

  useEffect(() => {
    const NAVBAR_HEIGHT = 80;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      let current = sectionIds[0];

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          // Section'ın üst kenarı navbar'ın altına girdi mi?
          if (scrollY >= element.offsetTop - NAVBAR_HEIGHT - 10) {
            current = id;
          }
        }
      }

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Mount'ta mevcut pozisyonu hesapla
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds]);

  return activeSection;
};
