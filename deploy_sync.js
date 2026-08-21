const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = __dirname;
const outDir = path.join(rootDir, 'out');

console.log('--- Starting Sync from out/ to root ---');

if (!fs.existsSync(outDir)) {
  console.error('ERROR: out/ directory does not exist! Please run npm run build first.');
  process.exit(1);
}

// 1. Remove old _next from root if exists
const rootNext = path.join(rootDir, '_next');
if (fs.existsSync(rootNext)) {
  try {
    fs.rmSync(rootNext, { recursive: true, force: true });
  } catch (e) {}
}

// 2. Copy all files from out/ to root using robust cpSync
fs.cpSync(outDir, rootDir, { recursive: true, force: true });
console.log('✓ Successfully copied all out/ static files to root directory.');

// 3. Create hostinger_public_html.zip
try {
  const zipPath = path.join(rootDir, 'hostinger_public_html.zip');
  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
  }
  
  const psCmd = `powershell -NoProfile -Command "Compress-Archive -LiteralPath '${outDir}\\*' -DestinationPath '${zipPath}' -Force"`;
  execSync(psCmd, { stdio: 'inherit' });
  console.log('✓ Successfully generated hostinger_public_html.zip');
} catch (e) {
  console.warn('Zip package warning:', e.message);
}

console.log('--- Sync Completed Successfully ---');
