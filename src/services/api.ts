import type { EmptyResult, Prefs, Recommendation } from '../types';

export interface AppConfig { mode: 'live' | 'demo'; ai: boolean }

export async function getConfig(): Promise<AppConfig> {
  const r = await fetch('/api/config');
  if (!r.ok) throw new Error('Sunucuya ulaşılamadı.');
  return r.json();
}

export async function getRecommendation(
  prefs: Prefs,
  exclude: string[],
  avoidDishes: string[],
): Promise<Recommendation | EmptyResult> {
  const r = await fetch('/api/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location: prefs.location, meal: prefs.meal, hunger: prefs.hunger, cravings: prefs.cravings,
      budget: prefs.budget, maxDistance: prefs.maxDistance, exclude, avoidDishes,
    }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || 'Bir hata oluştu.');
  return data;
}
