import type { Meal, Recommendation } from '../types';

export function defaultMeal(date = new Date()): Meal {
  const h = date.getHours();
  if (h >= 5 && h < 11) return 'breakfast';
  if (h >= 11 && h < 16) return 'lunch';
  if (h >= 16 && h < 22) return 'dinner';
  return 'night';
}

export function formatDistance(m: number | null): string {
  if (m === null) return 'Bu bilgi mevcut değil';
  return m < 1000 ? `${m} m` : `${(m / 1000).toFixed(1).replace('.', ',')} km`;
}

export function directionsUrl(r: Recommendation['restaurant']): string {
  const base = 'https://www.google.com/maps/dir/?api=1&destination=';
  if (r.lat !== null && r.lng !== null) return `${base}${r.lat},${r.lng}&destination_place_id=${encodeURIComponent(r.id)}`;
  return `${base}${encodeURIComponent(`${r.name ?? ''} ${r.address ?? ''}`.trim())}`;
}

export function menuUrl(r: Recommendation['restaurant']): string {
  if (r.mapsUri) return r.mapsUri;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${r.name ?? ''} ${r.address ?? ''}`.trim())}`;
}

const KEY = 'neyesem.saved';
export function loadSaved(): Recommendation[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}
export function storeSaved(list: Recommendation[]) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* yoksay */ }
}
