import fs from 'fs';
import path from 'path';

const ROOT = path.resolve('public/images');
const keep = new Set(['.webp', '.ico', '.svg']);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

let removed = 0;
let bytes = 0;

for (const file of walk(ROOT)) {
  const ext = path.extname(file).toLowerCase();
  if (keep.has(ext) || ext === '.psd') continue;
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue;

  const webp = file.replace(/\.(png|jpe?g)$/i, '.webp');
  if (!fs.existsSync(webp)) {
    console.log('SKIP (no webp):', path.relative(ROOT, file));
    continue;
  }

  bytes += fs.statSync(file).size;
  fs.unlinkSync(file);
  removed++;
}

console.log(`Removed ${removed} originals (${(bytes / 1024 / 1024).toFixed(1)} MB)`);
