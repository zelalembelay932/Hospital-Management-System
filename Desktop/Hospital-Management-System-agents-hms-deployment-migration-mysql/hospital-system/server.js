const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5174;
const DIST_DIR = path.join(__dirname, 'dist');
const API_PROXY_TARGET = process.env.API_PROXY_TARGET || 'http://localhost:5000';

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
  '.txt': 'text/plain',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
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
  if (urlPath.startsWith('/admin')) {
    return { baseDir: path.join(DIST_DIR, 'admin'), urlPrefix: '/admin' };
  }
  if (urlPath.startsWith('/doctor')) {
    return { baseDir: path.join(DIST_DIR, 'doctor'), urlPrefix: '/doctor' };
  }
  return { baseDir: DIST_DIR, urlPrefix: '' };
};

const resolveFilePath = (baseDir, urlPath, urlPrefix) => {
  let relativePath = urlPath.substring(urlPrefix.length);
  if (!relativePath || relativePath === '/') {
    relativePath = '/index.html';
  } else if (relativePath.endsWith('/')) {
    relativePath += 'index.html';
  }

  const filePath = path.join(baseDir, relativePath);
  if (filePath.startsWith(baseDir) && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return filePath;
  }

  const fallbackPath = path.join(baseDir, 'index.html');
  return fs.existsSync(fallbackPath) ? fallbackPath : null;
};

const proxyRequest = (clientReq, clientRes) => {
  const targetUrl = new URL(API_PROXY_TARGET);
  const isHttps = targetUrl.protocol === 'https:';
  const proxyOptions = {
    protocol: targetUrl.protocol,
    hostname: targetUrl.hostname,
    port: targetUrl.port || (isHttps ? 443 : 80),
    path: clientReq.url,
    method: clientReq.method,
    headers: Object.assign({}, clientReq.headers)
  };

  const proxyLib = isHttps ? https : http;
  const proxyReq = proxyLib.request(proxyOptions, (proxyRes) => {
    // copy status and headers
    clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(clientRes, { end: true });
  });

  proxyReq.on('error', (err) => {
    console.error('Proxy error:', err);
    clientRes.writeHead(502, { 'Content-Type': 'text/plain' });
    clientRes.end('Bad Gateway');
  });

  // pipe request body
  clientReq.pipe(proxyReq, { end: true });
};

const server = http.createServer((req, res) => {
  try {
    const requestPath = decodeURIComponent(req.url.split('?')[0]);

    // Proxy API requests to backend
    if (requestPath.startsWith('/api')) {
      return proxyRequest(req, res);
    }

    const { baseDir, urlPrefix } = selectDistFolder(requestPath);
    const filePath = resolveFilePath(baseDir, requestPath, urlPrefix);

    if (!filePath) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not Found');
    }

    sendFile(res, filePath);
  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Server error');
  }
});

server.listen(PORT, () => {
  console.log(`Static host running on http://localhost:${PORT}`);
  console.log('Serving consolidated dist from:', DIST_DIR);
  console.log('  Public website: /');
  console.log('  Admin dashboard: /admin/');
  console.log('  Doctor dashboard: /doctor/');
  console.log('  API proxy target:', API_PROXY_TARGET);
});
