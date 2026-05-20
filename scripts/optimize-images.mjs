/**
 * Image optimization pass.
 *
 * Walks public/images/ and produces a .webp sibling for every .jpg/.jpeg/.png.
 * Resizes down to a sensible MAX width per folder so we stop shipping 1600×1600
 * source files for tiles displayed at 128×160.
 *
 * Run: `npm run images:optimize`
 *
 * Re-runs are idempotent — existing .webp files are overwritten with current
 * settings, so adjusting QUALITY/MAX_WIDTH and re-running is safe.
 */

import { readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC = path.resolve('./public/images');

// Per-folder max widths — the largest dimension any consumer of that folder
// displays at, multiplied by ~2 for HiDPI screens.
const TARGETS = {
  hero: { maxWidth: 1600, quality: 80 },
  about: { maxWidth: 1600, quality: 80 },
  news: { maxWidth: 800, quality: 80 },
  sections: { maxWidth: 600, quality: 78 },
  logos: { maxWidth: 400, quality: 82 },
  root: { maxWidth: 900, quality: 82 }, // riyadvai.jpg portrait
};

const colour = {
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
};

let totalIn = 0;
let totalOut = 0;
let convertedCount = 0;

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else if (/\.(jpe?g|png)$/i.test(e.name)) yield full;
  }
}

function targetFor(absPath) {
  const rel = path.relative(SRC, absPath);
  const folder = rel.split(path.sep)[0];
  // If the file is at the root of public/images (e.g. riyadvai.jpg)
  if (!folder || !TARGETS[folder]) return TARGETS.root;
  return TARGETS[folder];
}

for await (const file of walk(SRC)) {
  const cfg = targetFor(file);
  const webp = file.replace(/\.(jpe?g|png)$/i, '.webp');

  const img = sharp(file, { failOn: 'truncated' });
  const meta = await img.metadata();
  const inSize = (await stat(file)).size;

  let pipeline = img;
  if (meta.width && meta.width > cfg.maxWidth) {
    pipeline = pipeline.resize({
      width: cfg.maxWidth,
      withoutEnlargement: true,
      fit: 'inside',
    });
  }

  await pipeline.webp({ quality: cfg.quality, effort: 5 }).toFile(webp);

  const outSize = (await stat(webp)).size;
  totalIn += inSize;
  totalOut += outSize;
  convertedCount += 1;

  const rel = path.relative(SRC, file);
  const saved = (1 - outSize / inSize) * 100;
  console.log(
    `  ${colour.green('✓')} ${rel.padEnd(48)} ${colour.dim(
      `${(inSize / 1024).toFixed(0).padStart(5)} KB → ${(outSize / 1024).toFixed(0).padStart(5)} KB`,
    )}  ${colour.yellow(`-${saved.toFixed(0)}%`)}`,
  );
}

console.log();
console.log(
  `  ${colour.green('Total')}: converted ${convertedCount} files · ${(totalIn / 1024).toFixed(0)} KB → ${(totalOut / 1024).toFixed(0)} KB · saved ${((1 - totalOut / totalIn) * 100).toFixed(0)}%`,
);
