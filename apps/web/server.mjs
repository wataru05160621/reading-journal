import http from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { extname } from 'node:path';

const port = Number(process.env.PORT || 5173);

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

const server = http.createServer((req, res) => {
  const path = req.url === '/' ? '/index.html' : req.url;
  const file = new URL(`./public${path}`, import.meta.url);
  if (!existsSync(file)) {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(`<html><body><h1>reading-journal web</h1><p>Dev server running.</p></body></html>`);
    return;
  }
  const data = readFileSync(file);
  const type = mime[extname(file.pathname)] || 'application/octet-stream';
  res.writeHead(200, { 'content-type': type });
  res.end(data);
});

server.listen(port, () => {
  console.log(`[web] serving on http://localhost:${port}`);
});

