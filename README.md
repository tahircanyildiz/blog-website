# 🚀 Kişisel Blog ve Portföy Web Sitesi

Modern, responsive ve kullanıcı dostu bir kişisel blog ve portföy web sitesi. MERN stack (MongoDB, Express.js, React, Node.js) kullanılarak geliştirilmiştir.

## 📋 İçindekiler

- [Özellikler](#-özellikler)
- [Teknolojiler](#-teknolojiler)
- [Kurulum](#-kurulum)
- [Kullanım](#-kullanım)
- [Deployment](#-deployment)
- [Proje Yapısı](#-proje-yapısı)
- [API Endpoints](#-api-endpoints)
- [Ekran Görüntüleri](#-ekran-görüntüleri)
- [Canlı Demo](#-canlı-demo)

## ✨ Özellikler

### Frontend
- 📱 **Tamamen Responsive Tasarım** - Mobil, tablet ve desktop uyumlu
- 🎨 **Modern UI/UX** - Tailwind CSS ile şık ve kullanıcı dostu arayüz
- ⚡ **Hızlı Performans** - Vite build tool ile optimize edilmiş
- 🔒 **Güvenli Admin Paneli** - JWT tabanlı kimlik doğrulama
- 📝 **Rich Text Editor** - Quill.js ile blog yazıları oluşturma
- 🖼️ **Resim Koruması** - Blog resimlerinin indirilmesini engelleme
- 💾 **Loading States** - Skeleton loader ile gelişmiş kullanıcı deneyimi

### Backend
- 🔐 **JWT Authentication** - Güvenli giriş sistemi
- 📊 **RESTful API** - Standartlara uygun API yapısı
- 📁 **Cloudinary Integration** - PDF ve dosya yönetimi
- 💾 **MongoDB Database** - NoSQL veritabanı
- 🔄 **CORS Support** - Cross-origin resource sharing
- 📧 **Contact Form** - Mesaj yönetim sistemi
- 🏥 **Health Check** - Cold start önleme mekanizması

### Admin Panel
- 📝 **Blog Yönetimi** - CRUD operasyonları
- 👤 **Hakkımda Sayfası Yönetimi** - Kişisel bilgiler ve CV yükleme
- 📧 **Mesaj Yönetimi** - İletişim formundan gelen mesajları görüntüleme
- 📱 **Sosyal Medya Ayarları** - Sosyal medya linklerini yönetme
- 📞 **İletişim Bilgileri** - Email ve telefon bilgilerini güncelleme
- 🔒 **Güvenli Erişim** - Özel URL ile gizli admin paneli

## 🛠️ Teknolojiler

### Frontend
- **React 18** - UI kütüphanesi
- **Vite** - Build tool ve dev server
- **React Router v6** - Routing
- **Tailwind CSS** - CSS framework
- **Axios** - HTTP client
- **Quill.js** - Rich text editor
- **Lucide React** - Icon library
- **React Quill** - React wrapper for Quill

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM (Object Data Modeling)
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload middleware
- **Cloudinary** - Cloud file storage
- **Express Validator** - Input validation
- **CORS** - Cross-origin support

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **MongoDB Atlas** - Database hosting
- **Cloudinary** - File storage
- **Cron-job.org** - Keep server awake

## 📦 Kurulum

### Gereksinimler
- Node.js (v16 veya üzeri)
- MongoDB
- Git

### 1. Projeyi Klonlayın
```bash
git clone https://github.com/kullaniciadi/website.git
cd website
```

### 2. Backend Kurulumu
```bash
cd backend
npm install
```

Backend için `.env` dosyası oluşturun (`.env.example` dosyasını kopyalayarak):
```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin ve kendi değerlerinizi girin:
```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 3. Frontend Kurulumu
```bash
cd frontend
npm install
```

Frontend için `.env` dosyası oluşturun (`.env.example` dosyasını kopyalayarak):
```bash
cp .env.example .env
```

`.env` dosyası development için hazır, değiştirmenize gerek yok:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Veritabanı Kurulumu

İlk admin kullanıcısını oluşturmak için MongoDB'de:
```javascript
// MongoDB shell veya MongoDB Compass kullanarak
db.users.insertOne({
  username: "admin",
  email: "admin@example.com",
  password: "$2a$10$hashed_password_here", // bcrypt ile hash'lenmiş şifre
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## 🚀 Kullanım

### Development Mode

Backend'i başlatın:
```bash
cd backend
npm start
```

Frontend'i başlatın:
```bash
cd frontend
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Admin Panel: http://localhost:5173/mrpurposeless/login

### Production Build

Frontend build:
```bash
cd frontend
npm run build
```

## 🌐 Deployment

### Frontend (Vercel)
1. GitHub'a push edin
2. Vercel'e bağlanın
3. Environment variables ekleyin:
   - `VITE_API_URL`: Backend production URL'i

### Backend (Render)
1. GitHub'a push edin
2. Render'a bağlanın
3. Environment variables ekleyin:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

### Cold Start Önleme (Cron-job.org)
1. cron-job.org'a kaydolun
2. Yeni cron job oluşturun
3. URL: `https://your-backend-url.com/api/ping`
4. Schedule: Her 10 dakikada bir

## 📁 Proje Yapısı

```
website/
├── backend/
│   ├── src/
│   │   ├── config/         # Konfigürasyon dosyaları
│   │   │   └── cloudinary.js
│   │   ├── controllers/    # Route controller'ları
│   │   │   ├── aboutController.js
│   │   │   ├── authController.js
│   │   │   ├── blogController.js
│   │   │   ├── contactController.js
│   │   │   └── settingsController.js
│   │   ├── middleware/     # Express middleware'ler
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── models/         # MongoDB modelleri
│   │   │   ├── About.js
│   │   │   ├── Blog.js
│   │   │   ├── Contact.js
│   │   │   ├── Settings.js
│   │   │   └── User.js
│   │   ├── routes/         # API routes
│   │   │   ├── aboutRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── blogRoutes.js
│   │   │   ├── contactRoutes.js
│   │   │   ├── pingRoutes.js
│   │   │   └── settingsRoutes.js
│   │   ├── app.js          # Express app
│   │   └── server.js       # Server entry point
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── ErrorMessage.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── SocialMediaIcon.jsx
│   │   ├── contexts/       # React contexts
│   │   │   └── AuthContext.jsx
│   │   ├── pages/          # Sayfa componentleri
│   │   │   ├── admin/      # Admin panel sayfaları
│   │   │   │   ├── AboutManagement.jsx
│   │   │   │   ├── AdminLayout.jsx
│   │   │   │   ├── BlogForm.jsx
│   │   │   │   ├── BlogsManagement.jsx
│   │   │   │   ├── ContactInfoSettings.jsx
│   │   │   │   ├── ContactsManagement.jsx
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   └── SocialMediaSettings.jsx
│   │   │   ├── About.jsx
│   │   │   ├── BlogDetail.jsx
│   │   │   ├── BlogList.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Home.jsx
│   │   │   └── Login.jsx
│   │   ├── services/       # API servisleri
│   │   │   └── api.js
│   │   ├── App.jsx         # Ana component
│   │   ├── index.css       # Global styles
│   │   └── main.jsx        # Entry point
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── vercel.json
│   └── .env
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Yeni kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/auth/me` - Mevcut kullanıcı bilgisi

### Blogs
- `GET /api/blogs` - Tüm blogları listele
- `GET /api/blogs/:id` - Tek blog detayı
- `POST /api/blogs` - Yeni blog oluştur (Admin)
- `PUT /api/blogs/:id` - Blog güncelle (Admin)
- `DELETE /api/blogs/:id` - Blog sil (Admin)

### About
- `GET /api/about` - Hakkımda bilgisi
- `PUT /api/about` - Hakkımda güncelle (Admin)
- `POST /api/about/cv` - CV yükle (Admin)
- `GET /api/about/cv/download` - CV indir
- `DELETE /api/about/cv` - CV sil (Admin)

### Contact
- `GET /api/contact` - Tüm mesajları listele (Admin)
- `POST /api/contact` - Yeni mesaj gönder
- `DELETE /api/contact/:id` - Mesaj sil (Admin)

### Settings
- `GET /api/settings/social-media` - Sosyal medya linkleri
- `PUT /api/settings/social-media` - Sosyal medya güncelle (Admin)
- `GET /api/settings/contact-info` - İletişim bilgileri
- `PUT /api/settings/contact-info` - İletişim bilgileri güncelle (Admin)

### Health Check
- `GET /api/ping` - Server durumu kontrol

## 🎨 Özellikler Detayları

### Güvenlik
- JWT tabanlı authentication
- Bcrypt ile şifre hash'leme
- Protected routes
- CORS yapılandırması
- Input validation
- Özel admin panel URL'i (`/mrpurposeless`)

### Performans Optimizasyonları
- Vite ile hızlı build
- Code splitting
- Lazy loading
- Image optimization
- Caching stratejileri
- Skeleton loaders
- 50MB body size limit

### Responsive Tasarım
- Mobile-first yaklaşım
- Tailwind CSS breakpoints
- Flexible grid system
- Touch-friendly interface
- Optimize edilmiş font boyutları

### Kullanıcı Deneyimi
- Loading states
- Error handling
- Success notifications
- Form validations
- Smooth transitions
- Intuitive navigation

## 🐛 Bilinen Sorunlar ve Çözümler

### Render Cold Start
Render free tier 15 dakika inaktivite sonrası uyku moduna geçer. Çözüm:
- Cron-job.org ile her 10 dakikada bir `/api/ping` endpoint'ine istek atılıyor

### Vercel-Render Senkronizasyonu
UI hızlı yüklendiği için backend'den veri gelmeden önce placeholder text gösterilebilir. Çözüm:
- Skeleton loader implementasyonu
- Loading states

### Cloudinary Raw Files
Cloudinary free tier'da raw dosyalar varsayılan olarak "blocked for delivery" olabilir. Çözüm:
- Dosyaları manuel olarak "public" yapma
- `type: 'upload'` parametresi ile yükleme

## 📝 Geliştirme Notları

### Admin Panel Giriş
- URL: `/mrpurposeless/login`
- Güvenlik için özel URL kullanılmıştır
- `/admin` ve `/login` URL'leri 404 döner

### CV Yükleme
- Cloudinary'de `.pdf` uzantısıyla saklanır
- Backend üzerinden signed URL ile serve edilir
- Tarayıcıda inline olarak açılır

### Blog Resimleri
- Right-click disable
- Drag & drop disable
- CSS ile pointer-events: none

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje kişisel kullanım için geliştirilmiştir.

## 👨‍💻 Geliştirici

**Tahir Can Yıldız**

- Website: [tahircanyildiz.com](https://www.tahircanyildiz.com/)
- Email: contact@tahircanyildiz.com

## 🙏 Teşekkürler

Bu proje geliştirilirken aşağıdaki teknolojiler ve servisler kullanılmıştır:
- React ve Vite ekibi
- MongoDB ve Mongoose ekibi
- Tailwind CSS ekibi
- Cloudinary
- Vercel
- Render
- Cron-job.org

---

## 🌟 Canlı Demo

Projeyi canlıda görmek için siteyi ziyaret edebilirsiniz: **[https://www.tahircanyildiz.com/](https://www.tahircanyildiz.com/)**

**Not:** Admin paneline giriş için `/mrpurposeless/login` URL'ini kullanabilirsiniz.

---

**🤖 Generated with [Claude Code](https://claude.com/claude-code)**

**Co-Authored-By: Claude <noreply@anthropic.com>**
