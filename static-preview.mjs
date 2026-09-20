/**
 * static-preview.mjs — serves the built app in `dist/` with SPA fallback.
 *
 * Used for local preview only: every unknown path (for example /student/polls)
 * returns index.html so client-side routing keeps working on a refresh.
 * Run with: node static-preview.mjs [port]
 */
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.join(ROOT, 'dist')
const PORT = Number(process.argv[2] || process.env.PORT || 5173)
const HOST = process.env.HOST || '127.0.0.1'

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0])
  const requested = path.join(DIST, urlPath === '/' ? 'index.html' : urlPath)
  const insideDist = requested.startsWith(DIST)
  const filePath = insideDist && fs.existsSync(requested) && !fs.statSync(requested).isDirectory()
    ? requested
    : path.join(DIST, 'index.html')

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('Not found')
      return
    }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    })
    res.end(content)
  })
})

server.listen(PORT, HOST, () => {
  console.log(`LagVoice preview served from ${DIST} at http://${HOST}:${PORT}`)
})

process.on('SIGTERM', () => server.close(() => process.exit(0)))
