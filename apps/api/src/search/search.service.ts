import { Injectable } from '@nestjs/common';
import { CacheService } from '../shared/cache.service';
import { GoogleProvider } from '../shared/providers/google.provider';
import { OpenLibraryProvider } from '../shared/providers/openlibrary.provider';

export type BookItem = {
  source: string;
  id: string;
  title: string;
  authors: string[];
  publisher: string | null;
  publishedAt: string | null;
  pageCount: number | null;
  coverUrl: string | null;
  isbn10: string | null;
  isbn13: string | null;
};

function dedupe(books: BookItem[]): BookItem[] {
  const map = new Map<string, BookItem>();
  for (const b of books) {
    const key = b.isbn13 || b.isbn10 || `${b.source}:${b.id}`;
    if (!map.has(key)) map.set(key, b);
  }
  return Array.from(map.values());
}

@Injectable()
export class SearchService {
  constructor(
    private readonly cache: CacheService,
    private readonly google: GoogleProvider,
    private readonly openlib: OpenLibraryProvider,
  ) {}

  async search({ q, isbn }: { q?: string; isbn?: string }) {
    const key = `search:${isbn ? 'isbn=' + isbn : 'q=' + (q ?? '')}`;
    const cached = this.cache.get<BookItem[]>(key);
    if (cached) return cached;

    const [g, o] = await Promise.all([
      this.google.search({ q, isbn }).catch(() => []),
      this.openlib.search({ q, isbn }).catch(() => []),
    ]);
    const merged = dedupe([...g, ...o]);
    this.cache.set(key, merged);
    return merged;
  }
}

