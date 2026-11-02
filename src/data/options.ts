export const MEALS = [
  { id: 'breakfast', icon: '🌅', label: 'Kahvaltı' },
  { id: 'lunch', icon: '☀️', label: 'Öğle' },
  { id: 'dinner', icon: '🌙', label: 'Akşam' },
  { id: 'night', icon: '🌃', label: 'Gece' },
  { id: 'snack', icon: '🍪', label: 'Atıştırmalık' },
  { id: 'any', icon: '🤷', label: 'Fark etmez' },
] as const;

export const HUNGER = [
  { id: 1, icon: '🙂', label: 'Hafif açım' },
  { id: 2, icon: '🍽️', label: 'Açım' },
  { id: 3, icon: '🐺', label: 'Çok açım' },
  { id: 4, icon: '💀', label: 'Ölüyorum amk' },
] as const;

export const CRAVINGS = [
  { id: 'burger', icon: '🍔', label: 'Burger' },
  { id: 'pizza', icon: '🍕', label: 'Pizza' },
  { id: 'doner', icon: '🌯', label: 'Döner' },
  { id: 'meat', icon: '🥩', label: 'Et' },
  { id: 'chicken', icon: '🍗', label: 'Tavuk' },
  { id: 'kebab', icon: '🥙', label: 'Kebap' },
  { id: 'asian', icon: '🍜', label: 'Uzak Doğu' },
  { id: 'italian', icon: '🍝', label: 'İtalyan' },
  { id: 'light', icon: '🥗', label: 'Hafif' },
  { id: 'breakfast', icon: '🍳', label: 'Kahvaltı' },
  { id: 'dessert', icon: '🍰', label: 'Tatlı' },
  { id: 'coffee', icon: '☕', label: 'Kahve' },
] as const;

export const BUDGETS = [
  { id: 'b1', icon: '💸', label: '0–250 TL' },
  { id: 'b2', icon: '💰', label: '250–500 TL' },
  { id: 'b3', icon: '💰💰', label: '500–750 TL' },
  { id: 'b4', icon: '💰💰💰', label: '750 TL+' },
  { id: 'any', icon: '🤷', label: 'Fark etmez' },
] as const;

export const DISTANCES = [
  { id: 500, icon: '🚶', label: '500 m' },
  { id: 1000, icon: '🚶', label: '1 km' },
  { id: 3000, icon: '🛵', label: '3 km' },
  { id: 5000, icon: '🚗', label: '5 km' },
  { id: 0, icon: '🤷', label: 'Fark etmez' },
] as const;

export const CITIES = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya', 'Ardahan', 'Artvin', 'Aydın',
  'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale',
  'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir',
  'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul', 'İzmir', 'Kahramanmaraş',
  'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kırıkkale', 'Kırklareli', 'Kırşehir', 'Kilis', 'Kocaeli',
  'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye',
  'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Şanlıurfa', 'Şırnak', 'Tekirdağ', 'Tokat', 'Trabzon',
  'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak',
];

// Sık kullanılan şehirler için ilçe önerileri. Diğer şehirlerde ilçe serbest yazılır.
export const DISTRICTS: Record<string, string[]> = {
  Konya: ['Selçuklu', 'Meram', 'Karatay', 'Ereğli', 'Akşehir', 'Beyşehir', 'Çumra'],
  İstanbul: ['Kadıköy', 'Beşiktaş', 'Şişli', 'Fatih', 'Üsküdar', 'Beyoğlu', 'Bakırköy', 'Ataşehir', 'Maltepe', 'Kartal', 'Pendik', 'Esenyurt', 'Sarıyer', 'Başakşehir'],
  Ankara: ['Çankaya', 'Keçiören', 'Yenimahalle', 'Mamak', 'Etimesgut', 'Sincan', 'Altındağ', 'Gölbaşı'],
  İzmir: ['Konak', 'Karşıyaka', 'Bornova', 'Buca', 'Bayraklı', 'Çiğli', 'Alsancak', 'Urla'],
  Bursa: ['Nilüfer', 'Osmangazi', 'Yıldırım', 'Mudanya', 'İnegöl'],
  Antalya: ['Muratpaşa', 'Konyaaltı', 'Kepez', 'Alanya', 'Manavgat'],
  Adana: ['Seyhan', 'Çukurova', 'Yüreğir', 'Sarıçam'],
  Gaziantep: ['Şahinbey', 'Şehitkamil', 'Nizip'],
  Kayseri: ['Melikgazi', 'Kocasinan', 'Talas'],
  Eskişehir: ['Odunpazarı', 'Tepebaşı'],
  Trabzon: ['Ortahisar', 'Akçaabat', 'Yomra'],
};
