#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';

// Konfiguracja
const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, 'public', 'gallery');
const THUMBS_DIR = path.join(SRC_DIR, 'thumbs');
const MAX_WIDTH = 800; // px
const QUALITY = 80; // JPG/WebP

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

function targetThumbName(file) {
  const ext = path.extname(file).toLowerCase();
  const base = path.basename(file, ext);
  // Zostawiamy nazwę + .thumb + ten sam ext (lub webp jeśli chcesz wymusić)
  return `${base}.thumb${ext}`;
}

async function processFile(srcPath, outPath) {
  const buf = await fs.readFile(srcPath);
  let pipeline = sharp(buf).resize({ width: MAX_WIDTH, withoutEnlargement: true });
  const ext = path.extname(outPath).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') pipeline = pipeline.jpeg({ quality: QUALITY, mozjpeg: true });
  else if (ext === '.png') pipeline = pipeline.png({ compressionLevel: 9 });
  else if (ext === '.webp') pipeline = pipeline.webp({ quality: QUALITY });
  const outBuf = await pipeline.toBuffer();
  await fs.writeFile(outPath, outBuf);
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'thumbs') continue; // pomiń katalog thumbów
      await walk(p);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) continue;
      // generuj thumb obok w /gallery/thumbs/ z tą samą strukturą
      const rel = path.relative(SRC_DIR, p); // np. pairs/pair-01-before.jpg
      const outDir = path.join(THUMBS_DIR, path.dirname(rel));
      await ensureDir(outDir);
      const outPath = path.join(outDir, targetThumbName(path.basename(p))); // np. thumbs/pairs/pair-01-before.thumb.jpg
      console.log('> thumb', rel, '=>', path.relative(ROOT, outPath));
      await processFile(p, outPath);
    }
  }
}

(async () => {
  await ensureDir(THUMBS_DIR);
  await walk(SRC_DIR);
  console.log('OK: thumbnails generated');
})();
