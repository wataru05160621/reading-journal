import http from 'node:http';
import { URL } from 'node:url';
import { searchBooks } from './search.mjs';
import { ok, notFound, serverError } from './http.mjs';

const port = Number(process.env.PORT || 3000);

const server = http.createServer((req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    ok(res, { ok: true, name: 'reading-journal api', version: 1 });
    return;
  }
  if (req.method === 'GET' && req.url?.startsWith('/books/search')) {
    try {
      const url = new URL(req.url, `http://localhost:${port}`);
      const q = url.searchParams.get('q') ?? undefined;
      const isbn = url.searchParams.get('isbn') ?? undefined;
      const results = await searchBooks({ q, isbn });
      ok(res, { items: results });
      return;
    } catch (e) {
      serverError(res, 'Search failed');
      return;
    }
  }
  notFound(res);
});

server.listen(port, () => {
  console.log(`[api] listening on http://localhost:${port}`);
});
