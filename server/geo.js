import { createCache } from './cache.js';

const cache = createCache(24 * 3600e3);

export function distanceM(a, b) {
  const R = 6371000, rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
}

export async function geocode(city, district) {
  const q = [district, city, 'Türkiye'].filter(Boolean).join(', ');
  const hit = cache.get(q);
  if (hit) return hit;
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'ne-yesem-local/1.0', 'Accept-Language': 'tr' }, signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error('Konum servisine ulaşılamadı.');
  const data = await res.json();
  if (!data.length) throw new Error('Bu şehir/ilçe bulunamadı.');
  const out = { lat: Number(data[0].lat), lng: Number(data[0].lon) };
  cache.set(q, out);
  return out;
}
