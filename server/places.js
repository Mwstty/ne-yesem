import { createCache } from './cache.js';
import { distanceM } from './geo.js';

const cache = createCache(15 * 60e3);
const FIELDS = [
  'places.id', 'places.displayName', 'places.formattedAddress', 'places.location', 'places.rating',
  'places.userRatingCount', 'places.priceLevel', 'places.priceRange', 'places.nationalPhoneNumber',
  'places.currentOpeningHours.openNow', 'places.googleMapsUri', 'places.primaryTypeDisplayName',
  'places.types', 'places.photos.name',
].join(',');

const LEVEL_BAND = {
  PRICE_LEVEL_FREE: [0, 250], PRICE_LEVEL_INEXPENSIVE: [0, 250], PRICE_LEVEL_MODERATE: [250, 500],
  PRICE_LEVEL_EXPENSIVE: [500, 750], PRICE_LEVEL_VERY_EXPENSIVE: [750, 5000],
};

function mapPlace(p, center, query) {
  const lat = p.location?.latitude, lng = p.location?.longitude;
  let price = null;
  const pr = p.priceRange;
  if (pr?.startPrice?.units !== undefined || pr?.endPrice?.units !== undefined) {
    const lo = Number(pr.startPrice?.units ?? 0), hi = pr.endPrice?.units !== undefined ? Number(pr.endPrice.units) : null;
    price = { min: lo, max: hi ?? lo * 2, text: hi ? `${lo}–${hi} TL` : `${lo} TL+`, source: 'google-range' };
  } else if (LEVEL_BAND[p.priceLevel]) {
    const [lo, hi] = LEVEL_BAND[p.priceLevel];
    price = { min: lo, max: hi, text: hi >= 5000 ? `${lo} TL+` : `${lo}–${hi} TL`, source: 'google-level' };
  }
  return {
    id: p.id,
    name: p.displayName?.text ?? null,
    rating: p.rating ?? null,
    reviewCount: p.userRatingCount ?? null,
    address: p.formattedAddress ?? null,
    phone: p.nationalPhoneNumber ?? null,
    openNow: p.currentOpeningHours?.openNow ?? null,
    lat, lng,
    distanceM: lat !== undefined ? distanceM(center, { lat, lng }) : null,
    price,
    type: p.primaryTypeDisplayName?.text ?? null,
    types: p.types ?? [],
    mapsUri: p.googleMapsUri ?? null,
    photo: p.photos?.[0]?.name ?? null,
    queries: [query],
    isDemo: false,
  };
}

async function searchText(key, query, center, radius) {
  const ck = `${query}|${center.lat.toFixed(3)}|${center.lng.toFixed(3)}|${radius}`;
  const hit = cache.get(ck);
  if (hit) return hit;
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': FIELDS },
    body: JSON.stringify({
      textQuery: query, languageCode: 'tr', regionCode: 'TR', maxResultCount: 20,
      locationBias: { circle: { center: { latitude: center.lat, longitude: center.lng }, radius } },
    }),
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Google Places hatası (${res.status}): ${t.slice(0, 200)}`);
  }
  const data = await res.json();
  const out = (data.places ?? []).map((p) => mapPlace(p, center, query));
  cache.set(ck, out);
  return out;
}

export async function fetchCandidates(key, queries, center, radius) {
  const lists = await Promise.all(queries.map((q) => searchText(key, q, center, radius)));
  const byId = new Map();
  for (const list of lists) {
    for (const r of list) {
      const prev = byId.get(r.id);
      if (prev) prev.queries = [...new Set([...prev.queries, ...r.queries])];
      else byId.set(r.id, { ...r, queries: [...r.queries] });
    }
  }
  return [...byId.values()];
}

export async function fetchPhoto(key, name) {
  const res = await fetch(`https://places.googleapis.com/v1/${name}/media?maxHeightPx=900&key=${key}`, { signal: AbortSignal.timeout(12000) });
  if (!res.ok) throw new Error('photo');
  return { type: res.headers.get('content-type') ?? 'image/jpeg', buf: Buffer.from(await res.arrayBuffer()) };
}
