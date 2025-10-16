import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loading from './Loading';

/**
 * Korumalı Route Component
 * Sadece giriş yapmış ve admin yetkisi olan kullanıcılar erişebilir
 */
function ProtectedRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    // Giriş yapılmamışsa login sayfasına yönlendir
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin()) {
    // Admin değilse anasayfaya yönlendir
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Yetkisiz Erişim
          </h1>
          <p className="text-gray-600 mb-8">
            Bu sayfaya erişim için admin yetkisi gereklidir.
          </p>
          <a
            href="/"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors inline-block"
          >
            Anasayfaya Dön
          </a>
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
