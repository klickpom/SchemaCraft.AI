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

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 1. Remove old _next from root if exists
const rootNext = path.join(rootDir, '_next');
if (fs.existsSync(rootNext)) {
  fs.rmSync(rootNext, { recursive: true, force: true });
}

// 2. Copy all files from out/ to root
copyDirRecursive(outDir, rootDir);
console.log('✓ Successfully copied all out/ static files to root directory.');

// 3. Create hostinger_public_html.zip using node archiver or zip_build
try {
  const zipPath = path.join(rootDir, 'hostinger_public_html.zip');
  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
  }
  
  // Package using PowerShell with safe string escaping
  const psCmd = `powershell -NoProfile -Command "Compress-Archive -LiteralPath '${outDir}\\*' -DestinationPath '${zipPath}' -Force"`;
  execSync(psCmd, { stdio: 'inherit' });
  console.log('✓ Successfully generated hostinger_public_html.zip');
} catch (e) {
  console.warn('Zip package warning (Hostinger Git deploy uses repo files directly):', e.message);
}

console.log('--- Sync Completed Successfully ---');
