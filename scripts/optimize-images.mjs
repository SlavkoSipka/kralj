import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve('public/images');
const QUALITY = 78;
const MAX_WIDTH = 1920;

const exts = new Set(['.png', '.jpg', '.jpeg']);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (exts.has(path.extname(entry.name).toLowerCase())) files.push(full);
  }
  return files;
}

async function convert(file) {
  const rel = path.relative(ROOT, file);
  const out = file.replace(/\.(png|jpe?g)$/i, '.webp');
  const before = fs.statSync(file).size;

  await sharp(file)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 6 })
    .toFile(out);

  const after = fs.statSync(out).size;
  const saved = ((1 - after / before) * 100).toFixed(0);
  console.log(`${rel}  ${(before / 1024 / 1024).toFixed(2)}MB → ${(after / 1024 / 1024).toFixed(2)}MB  (-${saved}%)`);
  return { before, after };
}

const files = walk(ROOT);
console.log(`Converting ${files.length} images...\n`);

let totalBefore = 0;
let totalAfter = 0;

for (const file of files) {
  try {
    const { before, after } = await convert(file);
    totalBefore += before;
    totalAfter += after;
  } catch (err) {
    console.error(`FAIL ${file}:`, err.message);
  }
}

console.log(`\nTOTAL: ${(totalBefore / 1024 / 1024).toFixed(1)}MB → ${(totalAfter / 1024 / 1024).toFixed(1)}MB`);
console.log(`Saved ${((1 - totalAfter / totalBefore) * 100).toFixed(0)}%`);
