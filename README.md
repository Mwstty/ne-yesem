# Ne Yesem?

"Ne yiyeceğimi bilmiyorum" diyen kullanıcıya konumuna ve durumuna göre **tek bir restoran + yemek** öneren web sitesi.

## Çalıştırma
`baslat.bat` dosyasına çift tıklayın. Gerekirse paketleri kurar, siteyi derler, sunucuyu başlatır ve `http://localhost:3000` adresini açar.
Gereksinim: [Node.js LTS](https://nodejs.org).

## API anahtarları (`.env`)
`.env.example` dosyası ilk çalıştırmada `.env` olarak kopyalanır.
- `GOOGLE_MAPS_API_KEY`: Google Cloud'da **Places API (New)** etkin olmalı. Boşsa site **DEMO MODU**'nda çalışır (uydurma, "DEMO VERİSİ" etiketli mekanlar).
- `AI_API_KEY`: Anthropic anahtarı. Boşsa seçim kural tabanlı yapılır. `AI_MODEL` ile model değiştirilebilir.

Anahtarlar yalnızca sunucuda kalır; tarayıcıya gönderilmez. `.env` git'e eklenmez.

## Nasıl çalışır
1. Sunucu Google Places'ten adayları çeker (15 dk cache) ve kodla filtreler: mesafe, açık/kapalı, bütçe, daha önce gösterilenler.
2. Puanlar: Bayesçi puan + yorum sayısı + mesafe + canı çeken türle eşleşme.
3. En iyi 5 aday AI'ye gider; AI birini seçer ve gerekçe yazar. Veri uydurması engellenir: `pickId` doğrulanır, eksik veri "Bu bilgi mevcut değil" olarak gösterilir.
4. Google Places menü vermez. Menü yoksa yemek adı **tür bazlı genel öneri** olarak, "menüde doğrulanmadı" notuyla gösterilir.

## Geliştirme
`npm run dev:server` + `npm run dev` (Vite 5173, /api -> 3000). Üretim: `npm run build` sonra `npm start`.

## Klasörler
`src/` arayüz (components, pages, services, utils, types, data), `server/` Express API (Places, geocode, AI, demo veri).
