const TTL = Number(process.env.API_CACHE_TTL_MS || 60_000);

const store = new Map();

export function get(key) {
  const v = store.get(key);
  if (!v) return undefined;
  if (Date.now() > v.exp) {
    store.delete(key);
    return undefined;
  }
  return v.value;
}

export function set(key, value, ttl = TTL) {
  store.set(key, { value, exp: Date.now() + ttl });
}

export function clear() {
  store.clear();
}

