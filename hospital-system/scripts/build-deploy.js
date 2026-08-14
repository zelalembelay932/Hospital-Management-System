const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const PUBLIC_DIST = path.join(DIST, 'public');

const run = (command, cwd) => {
  console.log(`\n> ${command}`);
  execSync(command, { cwd, stdio: 'inherit', shell: true });
};

const copyRecursive = (src, dest) => {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
};

const removeDir = (dir) => {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
};

console.log('Building Hospital Management System for deployment...\n');

run('npm run build', path.join(ROOT, 'public-website'));
run('npm run build', path.join(ROOT, 'admin-dashboard'));
run('npm run build', path.join(ROOT, 'doctor-dashboard'));

console.log('\nConsolidating build output...');

const tempDir = path.join(DIST, '_temp_public');
removeDir(tempDir);
fs.renameSync(PUBLIC_DIST, tempDir);

for (const entry of fs.readdirSync(tempDir)) {
  const src = path.join(tempDir, entry);
  const dest = path.join(DIST, entry);
  if (fs.existsSync(dest)) {
    removeDir(dest);
  }
  fs.renameSync(src, dest);
}
removeDir(tempDir);

const htaccess = `# Hospital Management System - SPA routing for Hostinger/Apache
RewriteEngine On

# API requests should not be rewritten (handled by backend when using Node.js hosting)
RewriteRule ^api/ - [L]

# Serve existing files/directories directly
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# Admin dashboard SPA fallback
RewriteRule ^admin(/.*)?$ admin/index.html [L]

# Doctor dashboard SPA fallback
RewriteRule ^doctor(/.*)?$ doctor/index.html [L]

# Public website SPA fallback
RewriteRule ^ index.html [L]
`;

fs.writeFileSync(path.join(DIST, '.htaccess'), htaccess);

console.log('\nDeployment build complete!');
console.log('Upload the contents of hospital-system/dist/ to your Hostinger public_html folder.');
console.log('\nFolder structure:');
console.log('  dist/');
console.log('    index.html          <- public website (root)');
console.log('    assets/');
console.log('    admin/');
console.log('      index.html        <- admin dashboard');
console.log('    doctor/');
console.log('      index.html        <- doctor dashboard');
console.log('    .htaccess           <- Apache SPA routing');
