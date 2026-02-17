import { useCallback } from 'react';

/**
 * Smooth scroll utility hook.
 * Section'lara smooth scroll yapmak için kullanılır.
 * Navbar yüksekliğini offset olarak hesaba katar.
 *
 * @returns {Function} scrollToSection - Section'a scroll yapan fonksiyon
 */
export const useSmoothScroll = () => {
  const scrollToSection = useCallback((sectionId) => {
    const element = document.getElementById(sectionId);
    if (!element) {
      console.warn(`Section with id "${sectionId}" not found`);
      return;
    }

    // Navbar yüksekliğini hesapla (sticky navbar için)
    const navbarHeight = 80; // px - navbar yüksekliği
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - navbarHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }, []);

  return scrollToSection;
};

export default useSmoothScroll;
