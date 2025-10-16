# Blog Frontend

Kişisel blog sitesi için React.js ile oluşturulmuş modern ve responsive frontend uygulaması.

## Özellikler

- **React 18** - Modern React özellikleri
- **React Router v6** - Sayfa yönlendirme
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP istekleri
- **React Markdown** - Blog içerikleri için markdown desteği
- **Vite** - Hızlı geliştirme sunucusu ve build aracı
- **Responsive Design** - Mobil uyumlu tasarım

## Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Ortam Değişkenlerini Ayarlayın (İsteğe Bağlı)

`.env.example` dosyasını `.env` olarak kopyalayın:

```bash
cp .env.example .env
```

Geliştirme ortamında Vite proxy kullanıldığı için `.env` dosyası oluşturmak isteğe bağlıdır.

### 3. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

### 4. Production Build

```bash
npm run build
```

Build dosyaları `dist` klasöründe oluşturulacaktır.

## Proje Yapısı

```
frontend/
├── public/                  # Statik dosyalar
├── src/
│   ├── components/         # Yeniden kullanılabilir bileşenler
│   │   ├── Navbar.jsx      # Navigasyon çubuğu
│   │   ├── Footer.jsx      # Alt bilgi bölümü
│   │   ├── Loading.jsx     # Yükleme animasyonu
│   │   └── ErrorMessage.jsx # Hata mesajı bileşeni
│   ├── pages/              # Sayfa bileşenleri
│   │   ├── Home.jsx        # Anasayfa
│   │   ├── About.jsx       # Hakkımda sayfası
│   │   ├── BlogList.jsx    # Blog listesi
│   │   ├── BlogDetail.jsx  # Blog detay sayfası
│   │   └── Contact.jsx     # İletişim sayfası
│   ├── services/           # API servisleri
│   │   └── api.js          # Axios API istekleri
│   ├── App.jsx             # Ana uygulama ve routing
│   ├── main.jsx            # Giriş noktası
│   └── index.css           # Global stiller ve Tailwind
├── index.html              # HTML şablonu
├── vite.config.js          # Vite konfigürasyonu
├── tailwind.config.js      # Tailwind konfigürasyonu
├── postcss.config.js       # PostCSS konfigürasyonu
├── package.json
└── README.md
```

## Sayfalar

### 🏠 Anasayfa (`/`)
- Karşılama mesajı
- Diğer sayfalara yönlendirme butonları
- Site özelliklerinin tanıtımı

### 👨‍💻 Hakkımda (`/about`)
- Kişisel bilgiler
- İş deneyimleri
- Teknolojiler ve yetenekler
- API'den dinamik veri çekimi

### ✍️ Blog (`/blog`)
- Blog yazıları listesi
- Kart tabanlı tasarım
- Tarih, görüntülenme sayısı ve etiketler
- Arama ve filtreleme (gelecek özellik)

### 📝 Blog Detay (`/blog/:id`)
- Blog yazısının tam içeriği
- Markdown desteği
- Görüntülenme sayısı takibi
- Geri dönüş navigasyonu

### 💬 İletişim (`/contact`)
- İletişim formu
- Form validasyonu
- Başarı/hata mesajları
- İletişim bilgileri

## API Entegrasyonu

Backend API ile iletişim için `src/services/api.js` dosyası kullanılır.

### Kullanılan Endpointler:

- `GET /api/about` - Hakkımda bilgisini getir
- `GET /api/blogs` - Tüm blog yazılarını listele
- `GET /api/blogs/:id` - Blog detayını getir
- `POST /api/contact` - İletişim formu gönder

## Tasarım Özellikleri

- **Mobil Öncelikli**: Tüm ekran boyutlarında mükemmel görünüm
- **Modern UI**: Temiz ve profesyonel arayüz
- **Animasyonlar**: Smooth geçişler ve hover efektleri
- **Erişilebilirlik**: ARIA etiketleri ve klavye navigasyonu
- **Hata Yönetimi**: Kullanıcı dostu hata mesajları
- **Loading States**: Yükleme durumları için animasyonlar

## Teknolojiler

| Teknoloji | Versiyon | Açıklama |
|-----------|----------|----------|
| React | ^18.2.0 | UI kütüphanesi |
| React Router | ^6.20.1 | Routing |
| Tailwind CSS | ^3.3.6 | CSS framework |
| Axios | ^1.6.2 | HTTP client |
| React Markdown | ^9.0.1 | Markdown renderer |
| Vite | ^5.0.8 | Build tool |

## Geliştirme Notları

### Vite Proxy Ayarı

Geliştirme ortamında CORS sorunlarını önlemek için Vite proxy kullanılır:

```javascript
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true
    }
  }
}
```

### Tailwind Konfigürasyonu

Özel renkler ve temalar `tailwind.config.js` dosyasında tanımlanmıştır.

### Form Validasyonu

Tüm formlar client-side validasyon içerir ve kullanıcı dostu hata mesajları gösterir.

## Öneriler

1. Backend'i çalıştırdıktan sonra frontend'i başlatın
2. MongoDB'nin çalıştığından emin olun
3. Environment variables'ı production için ayarlayın
4. SEO için meta tag'leri özelleştirin
5. Analytics ekleyin (Google Analytics, vb.)

## Lisans

Bu proje kişisel kullanım içindir.
