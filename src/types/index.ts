export type Meal = 'breakfast' | 'lunch' | 'dinner' | 'night' | 'snack' | 'any';
export type Budget = 'b1' | 'b2' | 'b3' | 'b4' | 'any';

export interface Prefs {
  location: { lat: number; lng: number } | { city: string; district: string } | null;
  locationLabel: string;
  meal: Meal;
  hunger: 1 | 2 | 3 | 4 | null;
  cravings: string[];
  budget: Budget | null;
  maxDistance: number | null; // metre, 0 = fark etmez
}

export interface Restaurant {
  id: string;
  name: string | null;
  type: string | null;
  emoji: string | null;
  rating: number | null;
  reviewCount: number | null;
  distanceM: number | null;
  address: string | null;
  phone: string | null;
  openNow: boolean | null;
  price: { text: string; source: string } | null;
  lat: number | null;
  lng: number | null;
  mapsUri: string | null;
  photo: string | null;
  isDemo: boolean;
}

export interface Dish {
  name: string;
  drink: string | null;
  price: number | null;
  verified: boolean;
}

export interface Recommendation {
  empty?: false;
  mode: 'live' | 'demo';
  aiUsed: boolean;
  reason: string;
  dish: Dish;
  restaurant: Restaurant;
}

export interface EmptyResult {
  empty: true;
  mode: 'live' | 'demo';
  message: string;
}
