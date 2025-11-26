import express from 'express';
import multer from 'multer';
import path from 'path';
import { promises as fs } from 'fs';
import { ensureDir, atomicWriteJSON, readJSONOrDefault } from '../utils/fs-helpers.mjs';
import { applyWatermark, makeThumbFromBuffer } from '../utils/watermark.mjs';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

const DATA_PATH = path.join(process.cwd(), 'data', 'gallery.json');
const PUB_GALLERY = path.join(process.cwd(), 'public', 'gallery');
const PUB_THUMBS = path.join(PUB_GALLERY, 'thumbs');
const WATERMARK_PATH = path.join(process.cwd(), 'backend', 'assets', 'watermark.png');

function inferThumbPathFromPublicSrc(src) {
  // '/gallery/gal-001.jpg' -> '/gallery/thumbs/gal-001.thumb.jpg'
  if (!src.startsWith('/gallery/')) return null;
  const base = src.replace('/gallery/', '/gallery/thumbs/');
  const dot = base.lastIndexOf('.');
  if (dot === -1) return null;
  return base.slice(0, dot) + '.thumb' + base.slice(dot);
}

async function readManifest() {
  return readJSONOrDefault(DATA_PATH, { singleImages: [], beforeAfterPairs: [] });
}

async function writeManifest(next) {
  await atomicWriteJSON(DATA_PATH, next);
}

async function listExistingSingles() {
  const files = await fs.readdir(PUB_GALLERY).catch(() => []);
  return files
    .filter((n) => /^gal-\d{3}\.jpg$/i.test(n))
    .map((n) => n.replace(/\.jpg$/i, ''))
    .sort();
}

async function listExistingPairs() {
  const dir = path.join(PUB_GALLERY, 'pairs');
  const files = await fs.readdir(dir).catch(() => []);
  const map = new Map();
  for (const n of files) {
    const m = n.match(/^pair-(\d{2})-(before|after)\.jpg$/i);
    if (!m) continue;
    const key = `pair-${m[1]}`;
    const side = m[2];
    const val = map.get(key) || { before: false, after: false };
    val[side] = true;
    map.set(key, val);
  }
  return [...map.entries()].filter(([_, v]) => v.before || v.after).map(([k]) => k).sort();
}

async function nextSingleId() {
  const used = await listExistingSingles();
  // znajdź pierwszą wolną lukę od 001 do 999
  for (let i = 1; i < 1000; i++) {
    const id = `gal-${String(i).padStart(3, '0')}`;
    if (!used.includes(id)) return id;
  }
  throw new Error('Brak dostępnych ID dla single');
}

async function nextPairId() {
  const used = await listExistingPairs();
  for (let i = 1; i < 100; i++) {
    const id = `pair-${String(i).padStart(2, '0')}`;
    if (!used.includes(id)) return id;
  }
  throw new Error('Brak dostępnych ID dla pairs');
}

export function createAdminGalleryRouter(authRequired) {
  const r = express.Router();

  // Public manifest for frontend
  r.get('/gallery', async (req, res) => {
    const manifest = await readManifest();
    res.json(manifest);
  });

  // Admin list (requires auth)
  r.get('/admin/list', authRequired, async (req, res) => {
    const manifest = await readManifest();
    res.json(manifest);
  });

  r.post('/admin/upload-single', authRequired, upload.single('file'), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ message: 'Brak pliku' });
      const id = await nextSingleId();
      await ensureDir(PUB_GALLERY);
      await ensureDir(PUB_THUMBS);

      const watermarked = await applyWatermark({ inputBuffer: req.file.buffer, watermarkPath: WATERMARK_PATH, scale: 0.12, margin: 24, output: 'jpeg', quality: 85 });
      const originPath = path.join(PUB_GALLERY, `${id}.jpg`);
      await fs.writeFile(originPath, watermarked);

      const thumbBuf = await makeThumbFromBuffer({ inputBuffer: watermarked, width: 800, output: 'jpeg', quality: 80 });
      const thumbPath = path.join(PUB_THUMBS, `${id}.thumb.jpg`);
      await fs.writeFile(thumbPath, thumbBuf);

      const manifest = await readManifest();
      const src = `/gallery/${id}.jpg`;
      const thumb = inferThumbPathFromPublicSrc(src);
      manifest.singleImages.push({ id, src, thumb, title: req.body?.title || undefined, description: req.body?.description || undefined });
      await writeManifest(manifest);

      res.status(201).json({ id, src, thumb });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Upload single error' });
    }
  });

  r.post('/admin/upload-pair', authRequired, upload.fields([{ name: 'beforeFile', maxCount: 1 }, { name: 'afterFile', maxCount: 1 }]), async (req, res) => {
    try {
      const beforeFile = req.files?.beforeFile?.[0];
      const afterFile = req.files?.afterFile?.[0];
      if (!beforeFile || !afterFile) return res.status(400).json({ message: 'Wymagane pliki before/after' });

      const id = await nextPairId();
      const pairsDir = path.join(PUB_GALLERY, 'pairs');
      const pairsThumbsDir = path.join(PUB_THUMBS, 'pairs');
      await ensureDir(pairsDir);
      await ensureDir(pairsThumbsDir);

      const beforeWM = await applyWatermark({ inputBuffer: beforeFile.buffer, watermarkPath: WATERMARK_PATH, scale: 0.12, margin: 24, output: 'jpeg', quality: 85 });
      const afterWM = await applyWatermark({ inputBuffer: afterFile.buffer, watermarkPath: WATERMARK_PATH, scale: 0.12, margin: 24, output: 'jpeg', quality: 85 });

      const beforeName = `${id}-before.jpg`;
      const afterName = `${id}-after.jpg`;
      await fs.writeFile(path.join(pairsDir, beforeName), beforeWM);
      await fs.writeFile(path.join(pairsDir, afterName), afterWM);

      const beforeThumb = await makeThumbFromBuffer({ inputBuffer: beforeWM, width: 800, output: 'jpeg', quality: 80 });
      const afterThumb = await makeThumbFromBuffer({ inputBuffer: afterWM, width: 800, output: 'jpeg', quality: 80 });
      await fs.writeFile(path.join(pairsThumbsDir, `${id}-before.thumb.jpg`), beforeThumb);
      await fs.writeFile(path.join(pairsThumbsDir, `${id}-after.thumb.jpg`), afterThumb);

      const manifest = await readManifest();
      const beforeSrc = `/gallery/pairs/${beforeName}`;
      const afterSrc = `/gallery/pairs/${afterName}`;
      manifest.beforeAfterPairs.push({ id, before: { src: beforeSrc, thumb: inferThumbPathFromPublicSrc(beforeSrc) }, after: { src: afterSrc, thumb: inferThumbPathFromPublicSrc(afterSrc) }, title: req.body?.title || undefined, description: req.body?.description || undefined });
      await writeManifest(manifest);

      res.status(201).json({ id, before: beforeSrc, after: afterSrc });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Upload pair error' });
    }
  });

  r.patch('/admin/meta/:id', authRequired, express.json(), async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body || {};
    const manifest = await readManifest();
    let updated = false;
    for (const it of manifest.singleImages) {
      if (it.id === id) { it.title = title; it.description = description; updated = true; }
    }
    for (const it of manifest.beforeAfterPairs) {
      if (it.id === id) { it.title = title; it.description = description; updated = true; }
    }
    if (!updated) return res.status(404).json({ message: 'Nie znaleziono elementu' });
    await writeManifest(manifest);
    res.json({ ok: true });
  });

  r.delete('/admin/item/:id', authRequired, async (req, res) => {
    const { id } = req.params;
    const manifest = await readManifest();
    let removed = false;

    // single
    const singleIdx = manifest.singleImages.findIndex((x) => x.id === id);
    if (singleIdx >= 0) {
      const it = manifest.singleImages[singleIdx];
      const origin = path.join(PUB_GALLERY, `${id}.jpg`);
      const thumb = path.join(PUB_THUMBS, `${id}.thumb.jpg`);
      await Promise.allSettled([fs.unlink(origin), fs.unlink(thumb)]);
      manifest.singleImages.splice(singleIdx, 1);
      removed = true;
    }

    // pair
    const pairIdx = manifest.beforeAfterPairs.findIndex((x) => x.id === id);
    if (pairIdx >= 0) {
      const before = path.join(PUB_GALLERY, 'pairs', `${id}-before.jpg`);
      const after = path.join(PUB_GALLERY, 'pairs', `${id}-after.jpg`);
      const beforeT = path.join(PUB_THUMBS, 'pairs', `${id}-before.thumb.jpg`);
      const afterT = path.join(PUB_THUMBS, 'pairs', `${id}-after.thumb.jpg`);
      await Promise.allSettled([fs.unlink(before), fs.unlink(after), fs.unlink(beforeT), fs.unlink(afterT)]);
      manifest.beforeAfterPairs.splice(pairIdx, 1);
      removed = true;
    }

    if (!removed) return res.status(404).json({ message: 'Nie znaleziono' });
    await writeManifest(manifest);
    res.json({ ok: true });
  });

  return r;
}
