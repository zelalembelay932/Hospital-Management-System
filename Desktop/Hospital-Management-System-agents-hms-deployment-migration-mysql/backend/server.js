require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const { validateEnv } = require('./config/env');
const { connectDB } = require('./config/database');
require('./models');

validateEnv();

const app = express();

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use('/api/auth', require('./routes/auth'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/reports', require('./routes/reports'));

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

const FRONTEND_DIST = path.join(__dirname, '../hospital-system/dist');

const selectDistFolder = (urlPath) => {
  if (urlPath.startsWith('/admin')) {
    return { baseDir: path.join(FRONTEND_DIST, 'admin'), urlPrefix: '/admin' };
  }
  if (urlPath.startsWith('/doctor')) {
    return { baseDir: path.join(FRONTEND_DIST, 'doctor'), urlPrefix: '/doctor' };
  }
  return { baseDir: FRONTEND_DIST, urlPrefix: '' };
};

const resolveSpaFile = (baseDir, urlPath, urlPrefix) => {
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

if (process.env.NODE_ENV === 'production' && fs.existsSync(FRONTEND_DIST)) {
  app.use(express.static(FRONTEND_DIST));

  app.get(/^\/(admin|doctor)?(\/.*)?$/, (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }

    const { baseDir, urlPrefix } = selectDistFolder(req.path);
    const filePath = resolveSpaFile(baseDir, req.path, urlPrefix);

    if (filePath) {
      return res.sendFile(filePath);
    }

    return next();
  });
}

app.use((err, req, res, next) => {
  console.error('ERROR:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  if (fs.existsSync(FRONTEND_DIST)) {
    console.log('Serving frontend from:', FRONTEND_DIST);
  }
});
