import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

export async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

export async function atomicWriteJSON(filePath, data) {
  const dir = path.dirname(filePath);
  await ensureDir(dir);
  const tmp = path.join(dir, `.${path.basename(filePath)}.${crypto.randomUUID()}.tmp`);
  const payload = JSON.stringify(data, null, 2);
  await fs.writeFile(tmp, payload, 'utf8');
  await fs.rename(tmp, filePath);
}

export async function readJSONOrDefault(filePath, def) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return def;
  }
}
