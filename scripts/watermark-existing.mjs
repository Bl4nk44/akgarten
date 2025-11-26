#!/usr/bin/env node
import sharp from 'sharp';
import path from 'path';
import { promises as fs } from 'fs';

const ROOT = process.cwd();
const GALLERY = path.join(ROOT, 'public', 'gallery');
const THUMBS = path.join(GALLERY, 'thumbs');
const WATERMARK = path.join(ROOT, 'backend', 'assets', 'watermark.png');

async function exists(p) { try { await fs.access(p); return true; } catch { return false; } }
async function ensureDir(d) { await fs.mkdir(d, { recursive: true }); }

async function applyWM(buf, width) {
  const base = sharp(buf).rotate();
  const meta = await base.metadata();
  const w = width || meta.width || 0;
  if (!w) return base.jpeg({ mozjpeg: true, quality: 85 }).toBuffer();
  const wm = await fs.readFile(WATERMARK);
  const wmRes = await sharp(wm).resize({ width: Math.max(64, Math.round(w * 0.12)) }).toBuffer();
  return base.composite([{ input: wmRes, gravity: 'southeast' }]).jpeg({ mozjpeg: true, quality: 85 }).toBuffer();
}

async function processSingles() {
  const files = await fs.readdir(GALLERY).catch(() => []);
  for (const name of files) {
    if (!/^gal-\d{3}\.jpg$/i.test(name)) continue;
    const p = path.join(GALLERY, name);
    const buf = await fs.readFile(p);
    // wykryj, czy już ma watermark? Nie bawimy się w heurystyki – nadpisujemy wersją z watermarkiem
    const wm = await applyWM(buf);
    await fs.writeFile(p, wm);
    // miniatura – bez watermarku, z oryginału nie mamy – generujemy z wersji bez overlayu nieosiągalnej, więc robimy z nowej i tak będzie ok wizualnie
    const thumbName = name.replace(/\.jpg$/i, '.thumb.jpg');
    const thumbDir = THUMBS; await ensureDir(thumbDir);
    const thumbPath = path.join(thumbDir, thumbName);
    const thumb = await sharp(wm).resize({ width: 800, withoutEnlargement: true }).jpeg({ mozjpeg: true, quality: 80 }).toBuffer();
    await fs.writeFile(thumbPath, thumb);
    console.log('> single', name);
  }
}

async function processPairs() {
  const dir = path.join(GALLERY, 'pairs');
  const files = await fs.readdir(dir).catch(() => []);
  for (const name of files) {
    if (!/^pair-\d{2}-(before|after)\.jpg$/i.test(name)) continue;
    const p = path.join(dir, name);
    const buf = await fs.readFile(p);
    const wm = await applyWM(buf);
    await fs.writeFile(p, wm);
    const thumbDir = path.join(THUMBS, 'pairs'); await ensureDir(thumbDir);
    const thumbName = name.replace(/\.jpg$/i, '.thumb.jpg');
    const thumbPath = path.join(thumbDir, thumbName);
    const thumb = await sharp(wm).resize({ width: 800, withoutEnlargement: true }).jpeg({ mozjpeg: true, quality: 80 }).toBuffer();
    await fs.writeFile(thumbPath, thumb);
    console.log('> pair', name);
  }
}

(async () => {
  if (!(await exists(WATERMARK))) throw new Error('Brak watermark.png');
  await processSingles();
  await processPairs();
  console.log('OK: watermarked existing');
})();
