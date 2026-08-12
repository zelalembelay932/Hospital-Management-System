const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5174;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain'
};

const getContentType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
};

const sendFile = (res, filePath) => {
  const stream = fs.createReadStream(filePath);
  res.writeHead(200, { 'Content-Type': getContentType(filePath) });
  stream.pipe(res);
};

const server = http.createServer((req, res) => {
  try {
    let requestPath = decodeURIComponent(req.url.split('?')[0]);
    if (requestPath.endsWith('/')) {
      requestPath += 'index.html';
    }

    let filePath = path.join(PUBLIC_DIR, requestPath);
    if (!filePath.startsWith(PUBLIC_DIR)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      return res.end('Forbidden');
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    if (!fs.existsSync(filePath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not Found');
    }

    sendFile(res, filePath);
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Server error');
  }
});

server.listen(PORT, () => {
  console.log(`Static host running on http://localhost:${PORT}`);
  console.log('Serving:', PUBLIC_DIR);
});
