import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';

let cachedWatermark = null;
let cachedPath = null;

export async function loadWatermarkBuffer(watermarkPath) {
  if (cachedWatermark && cachedPath === watermarkPath) return cachedWatermark;
  const buf = await fs.readFile(watermarkPath);
  cachedWatermark = buf;
  cachedPath = watermarkPath;
  return buf;
}

export async function applyWatermark({ inputBuffer, watermarkPath, scale = 0.12, margin = 24, output = 'jpeg', quality = 85 }) {
  const base = sharp(inputBuffer).rotate();
  const meta = await base.metadata();
  const width = meta.width || 0;
  if (!width) {
    // fallback: po prostu recompress
    return base.jpeg({ mozjpeg: true, quality }).toBuffer();
  }
  const wmBuf = await loadWatermarkBuffer(watermarkPath);
  const targetW = Math.max(64, Math.round(width * scale));
  const wmResized = await sharp(wmBuf).resize({ width: targetW }).toBuffer();

  let composite = base.composite([{ input: wmResized, gravity: 'southeast' }]);

  if (output === 'jpeg') {
    composite = composite.jpeg({ mozjpeg: true, quality });
  } else if (output === 'webp') {
    composite = composite.webp({ quality });
  } else if (output === 'png') {
    composite = composite.png({ compressionLevel: 9 });
  }
  return composite.toBuffer();
}

export async function makeThumbFromBuffer({ inputBuffer, width = 800, output = 'jpeg', quality = 80 }) {
  let p = sharp(inputBuffer).resize({ width, withoutEnlargement: true });
  if (output === 'jpeg') p = p.jpeg({ mozjpeg: true, quality });
  else if (output === 'webp') p = p.webp({ quality });
  else if (output === 'png') p = p.png({ compressionLevel: 9 });
  return p.toBuffer();
}
