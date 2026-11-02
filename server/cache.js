export function createCache(ttlMs, max = 300) {
  const m = new Map();
  return {
    get(k) {
      const e = m.get(k);
      if (!e) return undefined;
      if (e.exp < Date.now()) { m.delete(k); return undefined; }
      return e.v;
    },
    set(k, v) {
      if (m.size >= max) m.delete(m.keys().next().value);
      m.set(k, { v, exp: Date.now() + ttlMs });
    },
  };
}
