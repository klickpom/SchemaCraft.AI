import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const out = join(process.cwd(), 'out');

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

let rewritten = 0;
for (const file of walk(join(out, 'ar')).filter((f) => f.endsWith('.html'))) {
  const html = readFileSync(file, 'utf8');
  const next = html.replace(/<html lang="en"/, '<html lang="ar" dir="rtl"');
  if (next === html) throw new Error(`postbuild: <html lang="en"> not found in ${file}`);
  writeFileSync(file, next);
  rewritten += 1;
}
console.log(`postbuild: set lang="ar" dir="rtl" on ${rewritten} page(s)`);

// Hashed build assets never change, so they can be cached for a year.
writeFileSync(
  join(out, '_next', '.htaccess'),
  '<IfModule mod_headers.c>\n  Header set Cache-Control "public, max-age=31536000, immutable"\n</IfModule>\n',
);
console.log('postbuild: wrote _next/.htaccess (immutable caching)');
