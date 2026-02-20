import { useRef, useState, useCallback } from 'react';

/**
 * Scroll animasyonları için Intersection Observer hook'u
 * Element viewport'a girdiğinde animasyonu tetikler.
 * Callback ref pattern kullanır — element sonradan DOM'a eklenirse de çalışır.
 */
export const useScrollAnimation = ({
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
  triggerOnce = true
} = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef(null);

  const ref = useCallback((element) => {
    // Önceki observer'ı temizle
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (!element) return;

    // prefers-reduced-motion kontrolü
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observerRef.current.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observerRef.current.observe(element);
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
};
