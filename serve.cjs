const http = require('http');
const fs = require('fs');
const path = require('path');

const DIST = path.join('/Users/user/Downloads/LAGVOICE/lagvoice-web', 'dist');
const PORT = 5173;
const LOG = '/Users/user/Downloads/LAGVOICE/.freebuff/preview.log';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

fs.appendFileSync(LOG, `[${new Date().toISOString()}] Server starting on port ${PORT}\n`);

const server = http.createServer((req, res) => {
  let url = req.url.split('?')[0];
  let filePath = path.join(DIST, url === '/' ? 'index.html' : url);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST, 'index.html');
  }

  const ext = path.extname(filePath);
  const contentType = MIME[ext] || 'application/octet-stream';

  try {
    const content = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch (err) {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, '127.0.0.1', () => {
  const msg = `LagVoice server running at http://127.0.0.1:${PORT}`;
  console.log(msg);
  fs.appendFileSync(LOG, `[${new Date().toISOString()}] ${msg}\n`);
});

process.on('uncaughtException', (err) => {
  fs.appendFileSync(LOG, `[${new Date().toISOString()}] ERROR: ${err.message}\n`);
});
