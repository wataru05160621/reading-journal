import { Injectable } from '@nestjs/common';

const GOOGLE_ENDPOINT = 'https://www.googleapis.com/books/v1/volumes';

function pickIsbn(identifiers: Array<{ type: string; identifier: string }> = []) {
  const isbn13 = identifiers.find((x) => x.type === 'ISBN_13')?.identifier;
  const isbn10 = identifiers.find((x) => x.type === 'ISBN_10')?.identifier;
  return { isbn10, isbn13 };
}

@Injectable()
export class GoogleProvider {
  async search({ q, isbn }: { q?: string; isbn?: string }) {
    const query = isbn ? `isbn:${encodeURIComponent(isbn)}` : encodeURIComponent(q ?? '');
    const url = `${GOOGLE_ENDPOINT}?q=${query}`;
    const res = await fetch(url);
    if (!res.ok) return [] as any[];
    const data = await res.json();
    const items = Array.isArray(data.items) ? data.items : [];
    return items.map((it: any) => {
      const v = it.volumeInfo ?? {};
      const { isbn10, isbn13 } = pickIsbn(v.industryIdentifiers);
      return {
        source: 'google',
        id: it.id,
        title: v.title ?? '',
        authors: Array.isArray(v.authors) ? v.authors : [],
        publisher: v.publisher ?? null,
        publishedAt: v.publishedDate ?? null,
        pageCount: typeof v.pageCount === 'number' ? v.pageCount : null,
        coverUrl: v.imageLinks?.thumbnail ?? null,
        isbn10: isbn10 ?? null,
        isbn13: isbn13 ?? null,
      };
    });
  }
}

