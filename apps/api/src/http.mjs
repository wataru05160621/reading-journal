export function json(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

export function ok(res, body) {
  json(res, 200, body);
}

export function notFound(res, message = 'Not Found') {
  json(res, 404, { error: { code: 'NOT_FOUND', message } });
}

export function serverError(res, message = 'Internal Server Error') {
  json(res, 500, { error: { code: 'INTERNAL', message } });
}

