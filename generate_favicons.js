const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0e0e17" />
      <stop offset="100%" stop-color="#060609" />
    </linearGradient>
    <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#818cf8" />
      <stop offset="50%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>
    <linearGradient id="topLayer" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#6366f1" />
    </linearGradient>
    <linearGradient id="midLayer" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#4338ca" />
    </linearGradient>
    <linearGradient id="botLayer" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4f46e5" />
      <stop offset="100%" stop-color="#1e1b4b" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="24" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background Base with Glow Border -->
  <rect width="512" height="512" rx="128" fill="url(#bgGrad)" />
  <rect width="504" height="504" x="4" y="4" rx="124" fill="none" stroke="url(#primaryGrad)" stroke-width="8" stroke-opacity="0.6" />

  <!-- Ambient Glow in Center -->
  <circle cx="256" cy="256" r="140" fill="#6366f1" opacity="0.18" filter="url(#glow)" />

  <!-- Layer 3 (Bottom Layer) -->
  <path d="M128 340 L256 404 L384 340 L256 276 Z" fill="url(#botLayer)" opacity="0.8" />
  <path d="M128 340 L256 404 L384 340" fill="none" stroke="#818cf8" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" />

  <!-- Layer 2 (Middle Layer) -->
  <path d="M128 268 L256 332 L384 268 L256 204 Z" fill="url(#midLayer)" opacity="0.9" />
  <path d="M128 268 L256 332 L384 268" fill="none" stroke="#38bdf8" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" />

  <!-- Layer 1 (Top Master Layer) -->
  <path d="M128 196 L256 260 L384 196 L256 132 Z" fill="url(#topLayer)" />
  <path d="M128 196 L256 260 L384 196 L256 132 Z" fill="none" stroke="#ffffff" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" />

  <!-- Center Core AI Spark Dot -->
  <circle cx="256" cy="196" r="16" fill="#ffffff" filter="url(#glow)" />
</svg>`;

async function generateAllFavicons() {
  const publicDir = path.join(__dirname, 'public');
  const appDir = path.join(__dirname, 'app');

  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  // 1. Save SVG files
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgIcon);
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgIcon);
  fs.writeFileSync(path.join(appDir, 'icon.svg'), svgIcon);
  fs.writeFileSync(path.join(appDir, 'favicon.ico'), await sharp(Buffer.from(svgIcon)).resize(32, 32).toFormat('png').toBuffer());

  // 2. Generate PNGs
  const svgBuffer = Buffer.from(svgIcon);

  await sharp(svgBuffer).resize(16, 16).png().toFile(path.join(publicDir, 'favicon-16x16.png'));
  await sharp(svgBuffer).resize(32, 32).png().toFile(path.join(publicDir, 'favicon-32x32.png'));
  await sharp(svgBuffer).resize(48, 48).png().toFile(path.join(publicDir, 'favicon.ico'));
  await sharp(svgBuffer).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  await sharp(svgBuffer).resize(192, 192).png().toFile(path.join(publicDir, 'android-chrome-192x192.png'));
  await sharp(svgBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'android-chrome-512x512.png'));
  await sharp(svgBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'icon.png'));
  await sharp(svgBuffer).resize(64, 64).png().toFile(path.join(publicDir, 'favicon.png'));
  await sharp(svgBuffer).resize(1200, 630, { fit: 'contain', background: '#09090b' }).png().toFile(path.join(publicDir, 'og-image.png'));

  // 3. Web Manifest
  const manifest = {
    name: "SchemaCraft AI",
    short_name: "SchemaCraft",
    description: "0ms Real-Time JSON-LD Schema Generator for Search & AI Engines",
    start_url: "/",
    display: "standalone",
    background_color: "#060608",
    theme_color: "#4f46e5",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  };

  fs.writeFileSync(path.join(publicDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2));

  console.log('✓ All Favicons, App Icons, and Manifest successfully generated!');
}

generateAllFavicons().catch(console.error);
