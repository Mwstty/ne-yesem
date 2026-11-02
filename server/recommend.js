import { DEMO } from './demo.js';
import { DISHES } from './dishes.js';
import { fetchCandidates } from './places.js';
import { geocode } from './geo.js';
import { aiPick } from './ai.js';

const QUERY = {
  burger: 'burger', pizza: 'pizza', doner: 'döner', meat: 'et lokantası biftek', chicken: 'tavuk',
  kebab: 'kebap', asian: 'uzak doğu sushi noodle restoranı', italian: 'italyan restoranı makarna',
  light: 'salata sağlıklı yemek', breakfast: 'kahvaltı', dessert: 'tatlıcı pastane', coffee: 'kahve',
};
const MEAL_QUERY = { breakfast: 'kahvaltı', lunch: 'lokanta restoran', dinner: 'restoran', night: 'gece açık restoran döner', snack: 'atıştırmalık büfe tost', any: 'restoran' };
const BUDGET = { b1: [0, 250], b2: [250, 500], b3: [500, 750], b4: [750, 100000] };
const HUNGER_TXT = { 1: 'hafif aç', 2: 'aç', 3: 'çok aç', 4: 'ölüyor (aşırı aç)' };
const MEAL_TXT = { breakfast: 'kahvaltı', lunch: 'öğle', dinner: 'akşam', night: 'gece', snack: 'atıştırmalık', any: 'fark etmez' };
const HEAVY = /steak|kebab|burger|barbecue|turkish|meat/i;
const LIGHT = /cafe|salad|vegan|vegetarian|bakery/i;

function passes(c, q) {
  if (q.exclude.includes(c.id)) return false;
  if (q.maxDistance && c.distanceM !== null && c.distanceM > q.maxDistance) return false;
  if (c.openNow === false) return false;
  if (c.rating !== null && c.rating < 3.5) return false;
  const b = BUDGET[q.budget];
  if (b && c.price && (c.price.max < b[0] || c.price.min > b[1])) return false;
  return true;
}

function matchCravings(c, cravings) {
  if (c.isDemo) return cravings.filter((x) => c.cravings.includes(x)).length;
  return cravings.filter((x) => c.queries.includes(QUERY[x])).length;
}

function score(c, q) {
  let s = 0;
  if (c.rating !== null) {
    const n = c.reviewCount ?? 0;
    s += ((n / (n + 50)) * c.rating + (50 / (n + 50)) * 4.0) * 10 + Math.log10(n + 1) * 2;
  }
  s += matchCravings(c, q.cravings) * 4;
  if (c.openNow === true) s += 3;
  if (BUDGET[q.budget] && c.price) s += 2;
  const km = (c.distanceM ?? 3000) / 1000;
  s -= km * (q.maxDistance ? 3 : 2);
  const t = [c.type, ...(c.types ?? [])].join(' ');
  if (q.hunger >= 3 && HEAVY.test(t)) s += 2;
  if (q.hunger === 1 && LIGHT.test(t)) s += 2;
  return s;
}

function pickDish(c, cravings, avoid) {
  if (c.isDemo && c.menu?.length) {
    const foods = c.menu.filter(([n]) => !/ayran|kola|çay/i.test(n));
    const [name, price] = foods.find(([n]) => !avoid.includes(n)) ?? foods[0] ?? c.menu[0];
    const drink = c.menu.find(([n]) => /ayran|kola|çay/i.test(n))?.[0] ?? null;
    return { name, drink, price, verified: true };
  }
  const key = cravings.find((x) => DISHES[x] && matchCravings(c, [x]) > 0) ?? 'default';
  const list = DISHES[key];
  const [name, drink] = list.find(([n]) => !avoid.includes(n)) ?? list[0];
  return { name, drink, price: null, verified: false };
}

function fallbackReason(c, q, count) {
  let t = `${q.hunger >= 3 ? 'Çok aç' : q.hunger === 1 ? 'Hafif aç' : 'Aç'} olduğunu söyledin. Seçtiklerine uyan ${count} adayı puan, yorum sayısı ve mesafeye göre karşılaştırdım.`;
  if (c.rating !== null && c.reviewCount !== null) t += ` ${c.name}, ${c.rating} puan ve ${c.reviewCount} yorumla şu an senin için en mantıklı seçim.`;
  else t += ` ${c.name} puan/yorum bilgisi eksik olsa da kriterlerine en yakın seçenek.`;
  return t;
}

function toPublic(c, dish, reason, aiUsed, mode) {
  return {
    mode, aiUsed, reason, dish,
    restaurant: {
      id: c.id, name: c.name, type: c.type, emoji: c.emoji ?? null, rating: c.rating, reviewCount: c.reviewCount,
      distanceM: c.distanceM, address: c.address, phone: c.phone, openNow: c.openNow, price: c.price,
      lat: c.lat, lng: c.lng, mapsUri: c.mapsUri, photo: c.photo, isDemo: c.isDemo,
    },
  };
}

export async function recommend(body, env) {
  const q = {
    meal: body.meal ?? 'any', hunger: Number(body.hunger) || 2,
    cravings: Array.isArray(body.cravings) ? body.cravings.filter((x) => QUERY[x]) : [],
    budget: body.budget ?? 'any', maxDistance: Number(body.maxDistance) || 0,
    exclude: Array.isArray(body.exclude) ? body.exclude : [],
    avoidDishes: Array.isArray(body.avoidDishes) ? body.avoidDishes : [],
  };
  const live = Boolean(env.GOOGLE_MAPS_API_KEY);
  const mode = live ? 'live' : 'demo';
  let pool;

  if (live) {
    let center = body.location?.lat !== undefined ? { lat: Number(body.location.lat), lng: Number(body.location.lng) } : null;
    if (!center) {
      if (!body.location?.city) throw new Error('Konum bilgisi eksik.');
      center = await geocode(body.location.city, body.location.district);
    }
    const queries = (q.cravings.length ? q.cravings.map((x) => QUERY[x]) : [MEAL_QUERY[q.meal] ?? 'restoran']).slice(0, 4);
    const radius = Math.min(Math.max(q.maxDistance || 8000, 1000), 50000);
    pool = await fetchCandidates(env.GOOGLE_MAPS_API_KEY, queries, center, radius);
  } else {
    pool = DEMO.map((c) => ({ ...c }));
    if (q.cravings.length) pool = pool.filter((c) => matchCravings(c, q.cravings) > 0);
  }

  const ok = pool.filter((c) => passes(c, q));
  if (!ok.length) return { empty: true, mode, message: 'Kriterlerine uyan açık bir yer bulamadım. Mesafeyi veya bütçeyi genişletip tekrar dene.' };

  const ranked = ok.map((c) => ({ c, s: score(c, q) })).sort((a, b) => b.s - a.s).slice(0, 5).map((x) => x.c);

  const ai = await aiPick({
    kullanici: {
      ogun: MEAL_TXT[q.meal], aclik: HUNGER_TXT[q.hunger], canCeken: q.cravings,
      butce: q.budget === 'any' ? 'fark etmez' : BUDGET[q.budget].join('-') + ' TL', maxMesafeM: q.maxDistance || 'fark etmez',
    },
    avoidDishes: q.avoidDishes,
    adaylar: ranked.map((c) => ({
      id: c.id, ad: c.name, tur: c.type, puan: c.rating, yorumSayisi: c.reviewCount, mesafeM: c.distanceM,
      acikMi: c.openNow, fiyat: c.price?.text ?? null,
      menu: c.isDemo ? c.menu.map(([n, p]) => ({ yemek: n, fiyatTL: p })) : null,
    })),
  });

  const chosen = ai && ranked.find((c) => c.id === ai.pickId);
  if (chosen) {
    const dish = pickDish(chosen, q.cravings, q.avoidDishes);
    if (ai.dish) {
      if (chosen.isDemo) {
        const m = chosen.menu.find(([n]) => n === ai.dish);
        if (m) { dish.name = m[0]; dish.price = m[1]; }
      } else {
        dish.name = String(ai.dish).slice(0, 80);
        if (ai.drink) dish.drink = String(ai.drink).slice(0, 40);
      }
    }
    return toPublic(chosen, dish, ai.reason, true, mode);
  }
  const top = ranked[0];
  return toPublic(top, pickDish(top, q.cravings, q.avoidDishes), fallbackReason(top, q, ranked.length), false, mode);
}
