import { useEffect } from 'react';

const GoogleAnalytics = () => {
  useEffect(() => {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    
    if (!measurementId) {
      console.warn('Google Analytics Measurement ID not found in environment variables');
      return;
    }

    // Google Analytics script'ini dinamik olarak ekle
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script1);

    // gtag fonksiyonunu tanımla
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', measurementId);

    // Cleanup fonksiyonu
    return () => {
      // Script'i kaldırmaya gerek yok, çünkü sayfa değiştiğinde zaten kalıcı olmalı
    };
  }, []);

  return null; // Bu component hiçbir şey render etmez
};

export default GoogleAnalytics;
