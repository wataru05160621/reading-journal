import { searchGoogle } from './providers/google.mjs';
import { searchOpenLibrary } from './providers/openlibrary.mjs';
import * as cache from './cache.mjs';

function dedupe(books) {
  const map = new Map();
  for (const b of books) {
    const key = b.isbn13 || b.isbn10 || `${b.source}:${b.id}`;
    if (!map.has(key)) map.set(key, b);
  }
  return Array.from(map.values());
}

export async function searchBooks({ q, isbn } = {}) {
  const key = `search:${isbn ? 'isbn=' + isbn : 'q=' + (q ?? '')}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const [g, o] = await Promise.all([
    searchGoogle({ q, isbn }).catch(() => []),
    searchOpenLibrary({ q, isbn }).catch(() => []),
  ]);

  // フォールバック: どちらも空なら、そのまま空配列
  const merged = dedupe([...g, ...o]);
  cache.set(key, merged);
  return merged;
}

export function resetSearchCache() {
  cache.clear();
}
