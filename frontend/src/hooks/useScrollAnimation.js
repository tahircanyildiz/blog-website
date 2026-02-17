import { useEffect, useRef, useState } from 'react';

/**
 * Scroll ile element görünür olduğunda animasyon tetikleyen hook.
 * Intersection Observer kullanır, performans dostu.
 *
 * @param {Object} options
 * @param {number} options.threshold - Görünürlük eşiği (0-1), default 0.1
 * @param {string} options.rootMargin - Observer margin, default '0px 0px -50px 0px'
 * @param {boolean} options.triggerOnce - Sadece bir kez tetiklensin mi, default true
 * @returns {Object} { ref, isVisible } - Element ref'i ve görünürlük durumu
 */
export const useScrollAnimation = ({
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
  triggerOnce = true
} = {}) => {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Reduced motion tercihini kontrol et
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setIsVisible(true);
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // triggerOnce true ise observer'ı disconnect et
          if (triggerOnce) {
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          // triggerOnce false ise geri görünmez yap
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    // Cleanup
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref: elementRef, isVisible };
};

export default useScrollAnimation;
