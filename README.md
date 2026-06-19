# Smart Beauty

Smart Beauty, kullanıcının cilt tipini seçtiği, 3 saniyelik yapay zeka analizi simülasyonunun ardından kişiselleştirilmiş cilt bakım ürünlerini görüntüleyip sepete ekleyebildiği full-stack bir vaka çalışmasıdır.

## Özellikler

- Kuru, yağlı ve karma cilt tipi seçimi
- Cilt tipini belirlemeye yardımcı mini quiz
- Backend üzerinde 3 saniyelik analiz gecikmesi
- Analiz süresince animasyonlu loading deneyimi
- Cilt tipine göre filtrelenen ve önceliklendirilen ürün önerileri
- Yerel premium ürün mockupları
- Dinamik ürün detay sayfaları
- İlişkili ürün önerileri
- Zustand ile sepet ve adet yönetimi
- Anlık toplam fiyat hesaplama
- Hata, tekrar deneme ve boş durum ekranları
- Responsive ve erişilebilir arayüz

## Teknolojiler

### Frontend

- Next.js 16 ve React 19
- TypeScript
- Tailwind CSS 4
- Zustand
- Vitest ve React Testing Library

### Backend

- Node.js
- Express
- TypeScript
- Node.js Test Runner

## Proje Yapısı

```text
SmartBeautyTask/
├── backend/
│   └── src/
│       ├── data/          # Ürün kataloğu
│       ├── app.ts         # Express uygulaması ve endpointler
│       ├── app.test.ts    # Backend endpoint testleri
│       └── server.ts      # HTTP sunucusu başlangıç noktası
├── frontend/
│   ├── public/products/   # Yerel ürün mockupları
│   └── src/
│       ├── app/           # Next.js App Router sayfaları
│       ├── components/    # Tekrar kullanılabilir UI bileşenleri
│       ├── lib/           # API istemcisi ve tipler
│       ├── store/         # Zustand sepet store'u
│       └── test/          # Frontend unit/component testleri
└── README.md
```

## Gereksinimler

- Node.js `20.9.0` veya üzeri
- npm
- Git

## Kurulum

Projeyi klonlayın:

```bash
git clone https://github.com/dnzilkay/SmartBeautyTask.git
cd SmartBeautyTask
```

Bağımlılıkları yükleyin:

```bash
npm --prefix backend ci
npm --prefix frontend ci
```

Ortam değişkeni dosyalarını oluşturun:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

## Ortam Değişkenleri

### Backend - `backend/.env`

| Değişken | Açıklama | Varsayılan |
| --- | --- | --- |
| `PORT` | Backend servis portu | `4000` |
| `CORS_ORIGIN` | İzin verilen frontend origin'i | `*` |
| `SIMULATED_DELAY_MS` | AI analiz gecikmesi | `3000` |

### Frontend - `frontend/.env.local`

| Değişken | Açıklama | Lokal değer |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Backend servisinin temel URL'i | `http://localhost:4000` |

## Lokal Çalıştırma

Uygulama iki ayrı servis olarak çalışır. Önce backend'i başlatın.

Terminal 1:

```bash
npm --prefix backend run dev
```

Ardından yeni bir terminal açarak frontend'i başlatın.

Terminal 2:

```bash
npm --prefix frontend run dev
```

Her iki servis de hazır olduğunda tarayıcıdan `http://localhost:3000` adresini açın.

Servis adresleri:

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:4000](http://localhost:4000)
- Health kontrolü: [http://localhost:4000/health](http://localhost:4000/health)

## API Endpointleri

| Metot | Endpoint | Açıklama |
| --- | --- | --- |
| `GET` | `/health` | Servis durumunu döndürür |
| `GET` | `/api/products?skinType=dry` | Cilt tipine uygun ürünleri 3 saniye sonra döndürür |
| `GET` | `/api/products/:id` | Ürün detayını ve ilişkili ürünleri döndürür |

Desteklenen `skinType` değerleri:

```text
dry | oily | combination
```

## Test ve Doğrulama

Frontend testleri:

```bash
npm --prefix frontend test
```

Backend testleri:

```bash
npm --prefix backend test
```

Lint kontrolü:

```bash
npm --prefix frontend run lint
```

Production build kontrolü:

```bash
npm --prefix backend run build
npm --prefix frontend run build
```

Mevcut test kapsamı; sepet hesaplaması, ürün kartları, cilt tipi seçimi, ana sayfa fazları, API istemcisi, ürün detayı, galeri, sepet çekmecesi ve backend endpointlerini içerir.

## Git Standardı

Commit mesajlarında Conventional Commits formatı kullanılmaktadır:

```text
feat: yeni özellik
fix: hata düzeltmesi
test: test ekleme veya güncelleme
refactor: davranışı değiştirmeyen kod düzenlemesi
docs: dokümantasyon değişikliği
```

## Notlar

- Ürünler ve fiyatlar temsilidir.
- AI analizi gerçek bir model çağrısı yerine backend gecikmesiyle simüle edilmektedir.
- Ürün görselleri proje içinde yerel olarak saklandığı için harici görsel servisine bağımlılık yoktur.
