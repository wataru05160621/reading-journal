import { Injectable } from '@nestjs/common';

const SEARCH_ENDPOINT = 'https://openlibrary.org/search.json';
const coverUrl = (cover_i?: number | null) => (cover_i ? `https://covers.openlibrary.org/b/id/${cover_i}-L.jpg` : null);

@Injectable()
export class OpenLibraryProvider {
  async search({ q, isbn }: { q?: string; isbn?: string }) {
    const url = new URL(SEARCH_ENDPOINT);
    if (isbn) url.searchParams.set('q', `isbn:${isbn}`);
    else url.searchParams.set('q', q ?? '');
    url.searchParams.set('limit', '20');
    const res = await fetch(url);
    if (!res.ok) return [] as any[];
    const data = await res.json();
    const docs = Array.isArray(data.docs) ? data.docs : [];
    return docs.map((d: any) => {
      const isbn13 = Array.isArray(d.isbn) ? d.isbn.find((x: string) => x.length === 13) : null;
      const isbn10 = Array.isArray(d.isbn) ? d.isbn.find((x: string) => x.length === 10) : null;
      return {
        source: 'openlibrary',
        id: d.key,
        title: d.title ?? '',
        authors: Array.isArray(d.author_name) ? d.author_name : [],
        publisher: Array.isArray(d.publisher) ? d.publisher[0] : null,
        publishedAt: d.first_publish_year ? String(d.first_publish_year) : null,
        pageCount: d.number_of_pages_median ?? null,
        coverUrl: coverUrl(d.cover_i),
        isbn10: isbn10 ?? null,
        isbn13: isbn13 ?? null,
      };
    });
  }
}

