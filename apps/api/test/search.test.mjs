import test from 'node:test';
import assert from 'node:assert/strict';

import { searchBooks, resetSearchCache } from '../src/search.mjs';

const realFetch = global.fetch;

function mockFetchFactory(counter) {
  return async function mockFetch(url) {
    counter.count++;
    const u = String(url);
    if (u.startsWith('https://www.googleapis.com/books/v1/volumes')) {
      return new Response(
        JSON.stringify({
          items: [
            {
              id: 'g1',
              volumeInfo: {
                title: 'Sample Title',
                authors: ['Author A'],
                industryIdentifiers: [
                  { type: 'ISBN_13', identifier: '9781234567890' },
                  { type: 'ISBN_10', identifier: '1234567890' }
                ]
              }
            }
          ]
        }),
        { status: 200, headers: { 'content-type': 'application/json' } }
      );
    }
    if (u.startsWith('https://openlibrary.org/search.json')) {
      return new Response(
        JSON.stringify({
          docs: [
            {
              key: 'ol1',
              title: 'Sample Title',
              author_name: ['Author A'],
              isbn: ['9781234567890', '1234567890']
            }
          ]
        }),
        { status: 200, headers: { 'content-type': 'application/json' } }
      );
    }
    return new Response('{}', { status: 404 });
  };
}

test('dedupes results by ISBN across providers', async () => {
  resetSearchCache();
  const counter = { count: 0 };
  global.fetch = mockFetchFactory(counter);

  const items = await searchBooks({ q: 'sample' });
  assert.equal(counter.count, 2, 'should call both providers once');
  assert.equal(items.length, 1, 'should dedupe by ISBN');
  assert.equal(items[0].isbn13, '9781234567890');
});

test('caches aggregated results for same query', async () => {
  resetSearchCache();
  const counter = { count: 0 };
  global.fetch = mockFetchFactory(counter);

  const a = await searchBooks({ q: 'cache-me' });
  const b = await searchBooks({ q: 'cache-me' });
  assert.ok(a.length >= 1);
  assert.equal(counter.count, 2, 'second call should hit cache (no new fetches)');
});

test('gracefully handles provider failure', async () => {
  resetSearchCache();
  const counter = { count: 0 };
  global.fetch = async (url) => {
    counter.count++;
    const u = String(url);
    if (u.includes('googleapis')) return new Response('{}', { status: 500 });
    if (u.includes('openlibrary')) {
      return new Response(JSON.stringify({ docs: [{ key: 'ol2', title: 'Only OL' }] }), {
        status: 200,
        headers: { 'content-type': 'application/json' }
      });
    }
    return new Response('{}', { status: 404 });
  };

  const items = await searchBooks({ q: 'fallback' });
  assert.equal(items.length, 1);
  assert.equal(counter.count, 2);
});

test.after(() => {
  global.fetch = realFetch;
});

