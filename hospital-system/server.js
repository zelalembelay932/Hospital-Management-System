const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5174;
const PUBLIC_DIR = __dirname;
const DIST_DIR = path.join(PUBLIC_DIR, 'dist');

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

const selectDistFolder = (urlPath) => {
  if (urlPath.startsWith('/admin/')) {
    return { baseDir: path.join(DIST_DIR, 'admin'), urlPrefix: '/admin/' };
  }
  if (urlPath.startsWith('/doctor/')) {
    return { baseDir: path.join(DIST_DIR, 'doctor'), urlPrefix: '/doctor/' };
  }
  return { baseDir: path.join(DIST_DIR, 'public'), urlPrefix: '/' };
};

const resolveFilePath = (baseDir, urlPath, urlPrefix) => {
  let relativePath = urlPath.substring(urlPrefix.length);
  if (!relativePath || relativePath.endsWith('/')) {
    relativePath = relativePath + 'index.html';
  }

  const filePath = path.join(baseDir, relativePath);
  if (filePath.startsWith(baseDir) && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return filePath;
  }

  const fallbackPath = path.join(baseDir, 'index.html');
  return fs.existsSync(fallbackPath) ? fallbackPath : null;
};

const server = http.createServer((req, res) => {
  try {
    const requestPath = decodeURIComponent(req.url.split('?')[0]);
    const { baseDir, urlPrefix } = selectDistFolder(requestPath);
    const filePath = resolveFilePath(baseDir, requestPath, urlPrefix);

    if (!filePath) {
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
  console.log('Serving dist directories from:', DIST_DIR);
});
