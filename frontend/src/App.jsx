import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import GoogleAnalytics from './components/GoogleAnalytics';
import Home from './pages/Home';
import About from './pages/About';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';
import Contact from './pages/Contact';
import Login from './pages/Login';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import BlogsManagement from './pages/admin/BlogsManagement';
import BlogForm from './pages/admin/BlogForm';
import ContactsManagement from './pages/admin/ContactsManagement';
import AboutManagement from './pages/admin/AboutManagement';
import SocialMediaSettings from './pages/admin/SocialMediaSettings';
import ContactInfoSettings from './pages/admin/ContactInfoSettings';
import { getAllBlogs, getBlogById, getAbout, getSettings } from './services/api';

/**
 * Ana Uygulama Bileşeni
 * Routing yapısı ve layout'u içerir
 */
function App() {
  // Backend'i uyandırmak ve tüm critical data'yı prefetch etmek için
  useEffect(() => {
    const prefetchData = async () => {
      try {
        console.log('🚀 Prefetching data to wake up backend...');

        // Paralel olarak tüm critical data'yı çek
        const [blogs] = await Promise.all([
          getAllBlogs(),      // Blog listesi
          getAbout(),         // Hakkımda bilgileri
          getSettings()       // Site ayarları (sosyal medya, iletişim)
        ]);

        console.log('✅ Backend awake and all data cached!');

        // En son 3 bloğu da prefetch et (kullanıcılar genelde son yazıları okur)
        if (blogs && blogs.length > 0) {
          const topBlogs = blogs.slice(0, 3);
          await Promise.all(
            topBlogs.map(blog => getBlogById(blog._id))
          );
        }
      } catch (error) {
        console.log('⚠️ Prefetch failed (backend might be sleeping):', error.message);
      }
    };

    // Sayfa yüklendiğinde hemen başlat
    prefetchData();
  }, []);
  return (
    <AuthProvider>
      <Router>
        <GoogleAnalytics />
        <Routes>
          {/* Public Routes - Normal kullanıcı sayfaları */}
          <Route
            path="/"
            element={
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                  <Home />
                </main>
                <Footer />
              </div>
            }
          />
          <Route
            path="/about"
            element={
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                  <About />
                </main>
                <Footer />
              </div>
            }
          />
          <Route
            path="/blog"
            element={
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                  <BlogList />
                </main>
                <Footer />
              </div>
            }
          />
          <Route
            path="/blog/:id"
            element={
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                  <BlogDetail />
                </main>
                <Footer />
              </div>
            }
          />
          <Route
            path="/contact"
            element={
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                  <Contact />
                </main>
                <Footer />
              </div>
            }
          />

          {/* Login Route - Custom path */}
          <Route path="/mrpurposeless/login" element={<Login />} />

          {/* Admin Routes - Protected with custom path */}
          <Route
            path="/mrpurposeless"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="blogs" element={<BlogsManagement />} />
            <Route path="blogs/new" element={<BlogForm />} />
            <Route path="blogs/edit/:id" element={<BlogForm />} />
            <Route path="contacts" element={<ContactsManagement />} />
            <Route path="about" element={<AboutManagement />} />
            <Route path="social-media" element={<SocialMediaSettings />} />
            <Route path="contact-info" element={<ContactInfoSettings />} />
          </Route>

          {/* 404 - Sayfa Bulunamadı */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-xl text-gray-600 mb-8">Sayfa bulunamadı</p>
                  <a
                    href="/"
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors inline-block"
                  >
                    Anasayfaya Dön
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
