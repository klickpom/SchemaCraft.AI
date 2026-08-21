const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Packaging Hostinger deployment files...');
const outDir = path.join(__dirname, 'out');
const zipFile = path.join(__dirname, 'hostinger_public_html.zip');

if (fs.existsSync(zipFile)) {
  fs.unlinkSync(zipFile);
}

// Use PowerShell Compress-Archive with exact absolute paths
const cmd = `powershell -Command "Compress-Archive -Path '${outDir}\\*' -DestinationPath '${zipFile}' -Force"`;
execSync(cmd, { stdio: 'inherit' });

if (fs.existsSync(zipFile)) {
  const stats = fs.statSync(zipFile);
  console.log(`SUCCESS: Created ${zipFile} (${(stats.size / 1024).toFixed(1)} KB)`);
} else {
  console.error('Failed to create zip file.');
}
