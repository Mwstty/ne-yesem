// DEMO VERİSİ: Aşağıdaki mekanlar UYDURMADIR, gerçek değildir.
const d = (id, name, type, emoji, c, rating, reviewCount, distanceM, min, max, openNow, menu) => ({
  id: `demo-${id}`, name, type, emoji, cravings: c, rating, reviewCount, distanceM,
  price: { min, max, text: `${min}–${max} TL`, source: 'demo' },
  openNow, address: null, phone: null, lat: null, lng: null, mapsUri: null, photo: null, types: [],
  queries: [], menu, isDemo: true,
});

export const DEMO = [
  d(1, 'Demo Etli Ekmek Evi', 'Etli ekmek / Pide', '🥙', ['meat', 'kebab'], 4.7, 2184, 1400, 250, 500, true, [['Etli Ekmek', 180], ['Ayran', 40]]),
  d(2, 'Demo Burger Atölyesi', 'Burger', '🍔', ['burger'], 4.5, 1320, 800, 250, 500, true, [['Klasik Cheeseburger Menü', 320], ['Çıtır Tavuk Burger', 290]]),
  d(3, 'Demo Pizza Fırını', 'Pizzacı', '🍕', ['pizza', 'italian'], 4.4, 980, 2300, 250, 500, true, [['Karışık Pizza', 360], ['Margherita', 290]]),
  d(4, 'Demo Dönerci Ali Usta', 'Dönerci', '🌯', ['doner'], 4.6, 3400, 450, 0, 250, true, [['Et Döner Porsiyon', 210], ['Yarım Ekmek Döner', 140]]),
  d(5, 'Demo Kebapçı Sofrası', 'Kebap', '🥩', ['kebab', 'meat'], 4.8, 4100, 3100, 500, 750, true, [['Karışık Kebap', 520], ['Adana Kebap', 460]]),
  d(6, 'Demo Tavuk Durağı', 'Tavuk', '🍗', ['chicken'], 4.3, 640, 1100, 0, 250, true, [['Tavuk Şiş', 230], ['Tavuk Pilav', 150]]),
  d(7, 'Demo Wok & Sushi', 'Uzak Doğu', '🍜', ['asian'], 4.5, 760, 3800, 500, 750, true, [['Sushi Set', 640], ['Wok Noodle', 380]]),
  d(8, 'Demo Trattoria', 'İtalyan', '🍝', ['italian'], 4.6, 1210, 4200, 500, 750, true, [['Lazanya', 420], ['Penne Arrabbiata', 340]]),
  d(9, 'Demo Yeşil Bowl', 'Salata / Sağlıklı', '🥗', ['light'], 4.4, 530, 900, 250, 500, true, [['Tavuklu Salata', 260], ['Sebzeli Bowl', 240]]),
  d(10, 'Demo Serpme Kahvaltı Salonu', 'Kahvaltı', '🍳', ['breakfast'], 4.7, 2750, 1800, 250, 500, true, [['Serpme Kahvaltı (kişi başı)', 350], ['Menemen', 170]]),
  d(11, 'Demo Künefe Dünyası', 'Tatlıcı', '🍰', ['dessert'], 4.8, 1900, 1300, 0, 250, true, [['Künefe', 190], ['Sütlaç', 110]]),
  d(12, 'Demo Kahve Durağı', 'Kahve', '☕', ['coffee', 'dessert'], 4.5, 870, 600, 0, 250, true, [['Filtre Kahve', 90], ['Cheesecake', 140]]),
  d(13, 'Demo Gece Dürüm', 'Dürümcü', '🌯', ['doner', 'chicken'], 4.2, 450, 1500, 0, 250, true, [['Tavuk Dürüm', 150], ['Et Dürüm', 190]]),
  d(14, 'Demo Fine Steak', 'Biftekçi', '🥩', ['meat'], 4.7, 1550, 4700, 750, 1500, true, [['Dana Antrikot', 890], ['Kuzu Pirzola', 820]]),
  d(15, 'Demo Kapalı Lokanta', 'Lokanta', '🍽️', ['meat'], 4.9, 5000, 700, 250, 500, false, [['Günün Yemeği', 200]]),
];
