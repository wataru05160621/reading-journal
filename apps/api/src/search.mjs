import { searchGoogle } from './providers/google.mjs';
import { searchOpenLibrary } from './providers/openlibrary.mjs';

function dedupe(books) {
  const map = new Map();
  for (const b of books) {
    const key = b.isbn13 || b.isbn10 || `${b.source}:${b.id}`;
    if (!map.has(key)) map.set(key, b);
  }
  return Array.from(map.values());
}

export async function searchBooks({ q, isbn } = {}) {
  const [g, o] = await Promise.all([
    searchGoogle({ q, isbn }).catch(() => []),
    searchOpenLibrary({ q, isbn }).catch(() => []),
  ]);
  const merged = dedupe([...g, ...o]);
  return merged;
}

