import http from 'node:http';
import { URL } from 'node:url';
import { searchBooks } from './search.mjs';

const port = Number(process.env.PORT || 3000);

const server = http.createServer((req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ ok: true, name: 'reading-journal api', version: 1 }));
    return;
  }
  if (req.method === 'GET' && req.url?.startsWith('/books/search')) {
    try {
      const url = new URL(req.url, `http://localhost:${port}`);
      const q = url.searchParams.get('q') ?? undefined;
      const isbn = url.searchParams.get('isbn') ?? undefined;
      const results = await searchBooks({ q, isbn });
      res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ items: results }));
      return;
    } catch (e) {
      res.writeHead(500, { 'content-type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'Search failed' }));
      return;
    }
  }
  res.writeHead(404, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(port, () => {
  console.log(`[api] listening on http://localhost:${port}`);
});
