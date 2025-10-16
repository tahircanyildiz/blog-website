# Blog Backend API

Kişisel blog sitesi için Node.js ve Express.js ile oluşturulmuş RESTful API.

## Özellikler

- Node.js ve Express.js framework
- MongoDB veritabanı (Mongoose ODM)
- CORS desteği
- Express-validator ile validasyon
- Global error handling
- Modüler ve temiz kod yapısı

## Kurulum

### 1. Bağımlılıkları yükleyin

```bash
npm install
```

### 2. Ortam değişkenlerini ayarlayın

`.env.example` dosyasını `.env` olarak kopyalayın ve değerleri düzenleyin:

```bash
cp .env.example .env
```

`.env` dosyası:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/blog-db
```

### 3. Sunucuyu başlatın

Geliştirme modu (nodemon ile):
```bash
npm run dev
```

Production modu:
```bash
npm start
```

## Proje Yapısı

```
backend/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB bağlantı konfigürasyonu
│   ├── controllers/
│   │   ├── aboutController.js    # Hakkımda controller
│   │   ├── blogController.js     # Blog controller
│   │   └── contactController.js  # İletişim controller
│   ├── models/
│   │   ├── About.js              # Hakkımda modeli
│   │   ├── Blog.js               # Blog modeli
│   │   └── Contact.js            # İletişim modeli
│   ├── routes/
│   │   ├── aboutRoutes.js        # Hakkımda route'ları
│   │   ├── blogRoutes.js         # Blog route'ları
│   │   └── contactRoutes.js      # İletişim route'ları
│   ├── middleware/
│   │   └── errorHandler.js       # Global error handler
│   ├── app.js                    # Express uygulaması
│   └── server.js                 # Sunucu başlatma dosyası
├── .env.example                  # Örnek ortam değişkenleri
├── .gitignore
├── package.json
└── README.md
```

## API Endpointleri

### Hakkımda

- `GET /api/about` - Hakkımda bilgisini getir
- `PUT /api/about` - Hakkımda bilgisini güncelle/oluştur

### Blog

- `GET /api/blogs` - Tüm blog yazılarını listele
- `GET /api/blogs/:id` - Tek bir blog yazısının detayını getir
- `POST /api/blogs` - Yeni blog yazısı oluştur
- `PUT /api/blogs/:id` - Blog yazısını güncelle
- `DELETE /api/blogs/:id` - Blog yazısını sil

### İletişim

- `POST /api/contact` - İletişim formu mesajı gönder
- `GET /api/contact` - Tüm mesajları listele (Admin)
- `GET /api/contact/:id` - Tek bir mesajı getir (Admin)
- `DELETE /api/contact/:id` - Mesajı sil (Admin)

## Response Formatı

Başarılı yanıt:
```json
{
  "success": true,
  "data": { ... },
  "message": "İşlem başarılı"
}
```

Hata yanıtı:
```json
{
  "success": false,
  "message": "Hata mesajı"
}
```

## Teknolojiler

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL veritabanı
- **Mongoose** - MongoDB ODM
- **express-validator** - Validasyon
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Ortam değişkenleri yönetimi

## Geliştirme

Proje modüler bir yapıda geliştirilmiştir:
- **Models**: Veritabanı şemaları
- **Controllers**: İş mantığı
- **Routes**: API endpoint tanımlamaları
- **Middleware**: Ortak işlevler (error handling, vb.)

## Notlar

- Admin route'ları için kimlik doğrulama henüz eklenmemiştir
- Production ortamında mutlaka güvenlik önlemleri alınmalıdır
- MongoDB Atlas kullanmak için MONGO_URI'yi güncelleyin
