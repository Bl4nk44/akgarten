#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';

const ROOT = process.cwd();
const GALLERY = path.join(ROOT, 'public', 'gallery');
const THUMBS = path.join(GALLERY, 'thumbs');
const DATA_DIR = path.join(ROOT, 'data');
const MANIFEST = path.join(DATA_DIR, 'gallery.json');

async function exists(p) { try { await fs.access(p); return true; } catch { return false; } }
async function ensureDir(d) { await fs.mkdir(d, { recursive: true }); }

function inferThumb(src) {
  if (!src.startsWith('/gallery/')) return undefined;
  const lastDot = src.lastIndexOf('.');
  if (lastDot === -1) return undefined;
  const withThumbDir = src.replace('/gallery/', '/gallery/thumbs/');
  return withThumbDir.slice(0, withThumbDir.lastIndexOf('.')) + '.thumb' + withThumbDir.slice(withThumbDir.lastIndexOf('.'));
}

async function buildSingles() {
  const entries = await fs.readdir(GALLERY).catch(()=>[]);
  const out = [];
  for (const name of entries) {
    if (!/^gal-\d{3}\.jpg$/i.test(name)) continue;
    const id = name.replace(/\.jpg$/i, '');
    const src = `/gallery/${name}`;
    const t = inferThumb(src);
    const tPath = t ? path.join(ROOT, 'public', t) : '';
    const thumb = t && await exists(tPath) ? t : undefined;
    out.push({ id, src, thumb });
  }
  // Sort by id numeric
  out.sort((a,b)=> a.id.localeCompare(b.id, undefined, { numeric: true }));
  return out;
}

async function buildPairs() {
  const dir = path.join(GALLERY, 'pairs');
  const entries = await fs.readdir(dir).catch(()=>[]);
  const map = new Map();
  for (const name of entries) {
    const m = name.match(/^pair-(\d{2})-(before|after)\.jpg$/i);
    if (!m) continue;
    const id = `pair-${m[1]}`;
    const side = m[2];
    const obj = map.get(id) || { id, before: null, after: null };
    obj[side] = `/gallery/pairs/${name}`;
    map.set(id, obj);
  }
  const out = [];
  for (const [id, v] of map.entries()) {
    if (!v.before || !v.after) continue;
    const beforeThumb = inferThumb(v.before);
    const afterThumb = inferThumb(v.after);
    const beforeTExists = beforeThumb && await exists(path.join(ROOT, 'public', beforeThumb));
    const afterTExists = afterThumb && await exists(path.join(ROOT, 'public', afterThumb));
    out.push({ id, before: { src: v.before, thumb: beforeTExists ? beforeThumb : undefined }, after: { src: v.after, thumb: afterTExists ? afterThumb : undefined } });
  }
  out.sort((a,b)=> a.id.localeCompare(b.id, undefined, { numeric: true }));
  return out;
}

(async () => {
  await ensureDir(DATA_DIR);
  const singleImages = await buildSingles();
  const beforeAfterPairs = await buildPairs();
  const payload = { singleImages, beforeAfterPairs };
  await fs.writeFile(MANIFEST, JSON.stringify(payload, null, 2));
  console.log('OK: gallery.json built with', singleImages.length, 'singles and', beforeAfterPairs.length, 'pairs');
})();
