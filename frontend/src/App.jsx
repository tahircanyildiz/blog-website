import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import GoogleAnalytics from './components/GoogleAnalytics';
import LandingPage from './pages/LandingPage';
import Chatbot from './pages/Chatbot';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';
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

// Layout component - App dışında tanımlanmalı, aksi halde her render'da yeniden oluşturulur
function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}

/**
 * Ana Uygulama Bileşeni
 */
function App() {
  useEffect(() => {
    const prefetchData = async () => {
      try {
        console.log('🚀 Prefetching data to wake up backend...');
        const [blogs] = await Promise.all([
          getAllBlogs(),
          getAbout(),
          getSettings()
        ]);
        console.log('✅ Backend awake and all data cached!');
        if (blogs && blogs.length > 0) {
          const topBlogs = blogs.slice(0, 3);
          await Promise.all(topBlogs.map(blog => getBlogById(blog.slug)));
        }
      } catch (error) {
        console.log('⚠️ Prefetch failed (backend might be sleeping):', error.message);
      }
    };
    prefetchData();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <GoogleAnalytics />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout><LandingPage /></Layout>} />
          <Route path="/blog" element={<Layout><BlogList /></Layout>} />
          <Route path="/blog/:slug" element={<Layout><BlogDetail /></Layout>} />
          <Route path="/chatbot" element={<Chatbot />} />

          {/* Login Route */}
          <Route path="/mrpurposeless/login" element={<Login />} />

          {/* Admin Routes */}
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

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-xl text-gray-600 mb-8">Sayfa bulunamadı</p>
                  <a href="/" className="px-6 py-3 bg-[#40916c] text-white rounded-lg font-semibold hover:bg-[#2d6a4f] transition-colors inline-block">
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
