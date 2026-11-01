#!/usr/bin/env node
// Fit an image to a platform size from ../sizes.json and draw a preview of
// the areas the app covers. Needs sharp: run `npm install` in the skill
// folder once.
//
//   node scripts/fit.mjs <input> <size-id> [options]
//
//   --out <file>        output file (default: <input>-<size>.<jpg|png>)
//   --mode cover        crop to fill (default) | contain: fit inside, pad
//   --focus center      cover: what to keep: center, top, bottom, left,
//                       right, attention (busiest area) or entropy
//   --background #fff   contain: padding color
//   --preview [file]    also write a preview with the zones drawn on it
//   --list [word]       list size ids (optionally only matching a word)

import { readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(join(here, '..', 'sizes.json'), 'utf8'));

const argv = process.argv.slice(2);
const flags = {};
const positional = [];
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (!a.startsWith('--')) {
    positional.push(a);
    continue;
  }
  const name = a.slice(2);
  const next = argv[i + 1];
  if (next !== undefined && !next.startsWith('--')) {
    flags[name] = next;
    i++;
  } else flags[name] = true;
}

/** Every size, plus passport photos as passport-photo/<id>. */
function allSizes() {
  const out = [];
  for (const g of data.groups)
    for (const s of g.sizes) out.push({ ...s, platform: g.platform, url: g.url });
  for (const p of data.passportPhotos.photos)
    out.push({
      ...p,
      id: `passport-photo/${p.id}`,
      platform: 'Passport',
      url: data.passportPhotos.url,
      exact: true,
    });
  return out;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (flags.list) {
  const word = typeof flags.list === 'string' ? flags.list.toLowerCase() : '';
  for (const s of allSizes()) {
    const line = `${s.id}  ${s.width}x${s.height}  ${s.platform}: ${s.name.en}`;
    if (!word || line.toLowerCase().includes(word)) console.log(line);
  }
  process.exit(0);
}

const [input, sizeId] = positional;
if (!input || !sizeId)
  fail('Usage: node scripts/fit.mjs <input> <size-id> [--preview] (see --list)');
const size = allSizes().find((s) => s.id === sizeId);
if (!size) fail(`Unknown size "${sizeId}". Run with --list to see the ids.`);

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  fail(
    `sharp is not installed. Run this once, then retry:\n  npm install --prefix "${resolve(here, '..')}"`
  );
}

const mode = flags.mode === 'contain' ? 'contain' : 'cover';
const focus = typeof flags.focus === 'string' ? flags.focus : 'center';
const positions = {
  center: 'centre',
  top: 'top',
  bottom: 'bottom',
  left: 'left',
  right: 'right',
  attention: sharp.strategy.attention,
  entropy: sharp.strategy.entropy,
};
if (!(focus in positions)) fail(`--focus must be one of ${Object.keys(positions).join(', ')}`);

const source = sharp(input).rotate(); // apply EXIF orientation first
const meta = await source.metadata();
const srcW = meta.autoOrient?.width ?? meta.width;
const srcH = meta.autoOrient?.height ?? meta.height;
const alpha = Boolean(meta.hasAlpha);

const ext = typeof flags.out === 'string' ? extname(flags.out).toLowerCase() : '';
const format =
  ext === '.png' ? 'png' : ext === '.webp' ? 'webp' : ext ? 'jpeg' : alpha || size.circle ? 'png' : 'jpeg';
const out =
  typeof flags.out === 'string'
    ? flags.out
    : join(
        dirname(input),
        `${basename(input, extname(input))}-${size.id.replace('/', '-')}.${format === 'jpeg' ? 'jpg' : format}`
      );

const resized = source.resize(size.width, size.height, {
  fit: mode,
  position: positions[focus],
  background: typeof flags.background === 'string' ? flags.background : '#ffffff',
});

// Stay under the platform's upload limit: lower the quality step by step.
let buffer;
let quality = null;
if (format === 'png') {
  buffer = await resized.clone().png({ compressionLevel: 9 }).toBuffer();
  if (size.maxBytes && buffer.length > size.maxBytes)
    buffer = await resized.clone().png({ compressionLevel: 9, palette: true }).toBuffer();
} else {
  for (quality = 92; ; quality -= 6) {
    const enc = resized.clone();
    buffer = await (format === 'webp'
      ? enc.webp({ quality })
      : enc.flatten({ background: '#ffffff' }).jpeg({ quality, mozjpeg: true })
    ).toBuffer();
    if (!size.maxBytes || buffer.length <= size.maxBytes || quality <= 40) break;
  }
}
writeFileSync(out, buffer);

const warnings = [];
if (srcW < size.width || srcH < size.height)
  warnings.push(
    `The source (${srcW}x${srcH}) is smaller than ${size.width}x${size.height}, so it was enlarged and may look soft. An AI upscale would look sharper.`
  );
if (size.minWidth && (srcW < size.minWidth || srcH < size.minHeight))
  warnings.push(`The source is below the platform minimum of ${size.minWidth}x${size.minHeight}.`);
if (size.maxBytes && buffer.length > size.maxBytes)
  warnings.push(`Still ${buffer.length} bytes, over the ${size.maxBytes}-byte limit.`);
const srcRatio = srcW / srcH;
const dstRatio = size.width / size.height;
if (mode === 'cover' && Math.abs(srcRatio - dstRatio) / dstRatio > 0.25)
  warnings.push(
    `The shapes differ a lot (${srcW}x${srcH} vs ${size.width}x${size.height}); cropping cut a large part. Check the preview, or extend the image with AI instead.`
  );

let preview = null;
if (flags.preview) {
  preview =
    typeof flags.preview === 'string'
      ? flags.preview
      : out.replace(/\.[^.]+$/, '') + '-preview.jpg';
  const W = size.width;
  const H = size.height;
  const stroke = Math.max(2, Math.round(Math.min(W, H) / 200));
  const font = Math.max(14, Math.round(Math.min(W, H) / 28));
  const style = {
    'ui-overlay': `fill="rgba(239,68,68,0.35)" stroke="#dc2626" stroke-width="${stroke}"`,
    'safe-area': `fill="none" stroke="#16a34a" stroke-width="${stroke * 1.5}" stroke-dasharray="${stroke * 6} ${stroke * 3}"`,
    'crop-preview': `fill="none" stroke="#2563eb" stroke-width="${stroke}" stroke-dasharray="${stroke * 2} ${stroke * 2}"`,
  };
  const esc = (t) => t.replace(/[<>&"]/g, (c) => `&#${c.charCodeAt(0)};`);
  const label = (x, y, t) =>
    `<text x="${x}" y="${y}" font-family="sans-serif" font-size="${font}" fill="#fff" stroke="#000" stroke-width="${font / 8}" paint-order="stroke">${esc(t)}</text>`;
  const shapes = [];
  const labels = [];
  // Zones that start on the same line get their labels stacked.
  const rows = new Map();
  for (const z of size.zones ?? []) {
    const s = style[z.type] ?? style['crop-preview'];
    shapes.push(
      z.shape === 'circle'
        ? `<ellipse cx="${z.x + z.width / 2}" cy="${z.y + z.height / 2}" rx="${z.width / 2}" ry="${z.height / 2}" ${s}/>`
        : `<rect x="${z.x}" y="${z.y}" width="${z.width}" height="${z.height}" ${s}/>`
    );
    const row = Math.round(z.y / font);
    const n = rows.get(row) ?? 0;
    rows.set(row, n + 1);
    const y = Math.min(
      Math.max(z.y, 0) + font * (1.2 + n * 1.3),
      H - font * 0.4
    );
    labels.push(label(Math.max(z.x, 0) + font * 0.4, y, z.label.en));
  }
  if (size.circle)
    shapes.push(
      `<ellipse cx="${W / 2}" cy="${H / 2}" rx="${W / 2}" ry="${H / 2}" fill="none" stroke="#2563eb" stroke-width="${stroke}"/>`
    );
  // Passport photos: center line, eye band, head size range.
  if (size.headMin) {
    shapes.push(
      `<line x1="${W / 2}" y1="0" x2="${W / 2}" y2="${H}" stroke="#2563eb" stroke-width="${stroke}" stroke-dasharray="${stroke * 3} ${stroke * 3}"/>`
    );
    if (size.eyeMin) {
      const top = H * (1 - size.eyeMax);
      const bottom = H * (1 - size.eyeMin);
      shapes.push(
        `<rect x="0" y="${top}" width="${W}" height="${bottom - top}" fill="rgba(22,163,74,0.25)" stroke="#16a34a" stroke-width="${stroke}"/>`
      );
      labels.push(label(font * 0.4, top + font * 1.2, 'Eyes inside this band'));
    }
    const lo = Math.round(size.headMin * H);
    const hi = Math.round(size.headMax * H);
    labels.push(
      label(font * 0.4, H - font * 0.6, `Chin to crown: ${lo}-${hi} px tall`)
    );
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${shapes.join('')}${labels.join('')}</svg>`;
  const drawn = await sharp(buffer)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .png()
    .toBuffer();
  // Small enough to look at (or hand to a vision model).
  const small = sharp(drawn).resize(1200, 1200, {
    fit: 'inside',
    withoutEnlargement: true,
  });
  await (preview.toLowerCase().endsWith('.png')
    ? small.png()
    : small.jpeg({ quality: 82 })
  ).toFile(preview);
}

console.log(
  JSON.stringify(
    {
      output: out,
      size: `${size.width}x${size.height}`,
      bytes: buffer.length,
      ...(quality ? { quality } : {}),
      source: `${srcW}x${srcH}`,
      mode,
      ...(mode === 'cover' ? { focus } : {}),
      ...(preview ? { preview } : {}),
      zones: (size.zones ?? []).map(
        (z) =>
          `${z.type}: ${z.label.en} at x=${z.x} y=${z.y} ${z.width}x${z.height}${z.measured ? ' (measured)' : ''}`
      ),
      ...(size.note ? { tip: size.note.en } : {}),
      warnings,
      crop_in_browser: size.url,
    },
    null,
    2
  )
);
