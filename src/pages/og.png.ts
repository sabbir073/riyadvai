export const prerender = false;

import type { APIRoute } from 'astro';
import { Resvg } from '@resvg/resvg-js';
import { SITE, PERSON } from '~/data/site';

const escape = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const wrap = (text: string, maxChars = 28) => {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > maxChars) {
      if (line) lines.push(line);
      line = w;
    } else {
      line = (line + ' ' + w).trim();
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 3); // cap at 3 lines
};

export const GET: APIRoute = async ({ url }) => {
  const title = (url.searchParams.get('title') ?? PERSON.fullName).slice(0, 120);
  const path = url.searchParams.get('path') ?? '/';
  const subtitle = path === '/' ? PERSON.headline : `${SITE.name} · ${path.replace(/^\//, '').replace(/-/g, ' ')}`;

  const titleLines = wrap(title, 26);
  const lineHeight = 92;

  // Pure SVG → PNG. No external font dependency. Uses generic font families which Resvg
  // resolves via @resvg/resvg-js's bundled fonts.
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="bg1" cx="50%" cy="0%" r="80%">
      <stop offset="0%" stop-color="#1a2645" stop-opacity="1"/>
      <stop offset="60%" stop-color="#0d1224" stop-opacity="1"/>
    </radialGradient>
    <radialGradient id="bg2" cx="80%" cy="80%" r="60%">
      <stop offset="0%" stop-color="#3a3320" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#0d1224" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="accent" x1="0" x2="1">
      <stop offset="0" stop-color="#6cd4ff"/>
      <stop offset="1" stop-color="#e6c47a"/>
    </linearGradient>
    <linearGradient id="hairline" x1="0" x2="1">
      <stop offset="0" stop-color="#6cd4ff" stop-opacity="0"/>
      <stop offset="0.5" stop-color="#6cd4ff" stop-opacity="0.4"/>
      <stop offset="1" stop-color="#e6c47a" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="#0d1224"/>
  <rect width="1200" height="630" fill="url(#bg1)"/>
  <rect width="1200" height="630" fill="url(#bg2)"/>

  <!-- Top header -->
  <g transform="translate(70 70)">
    <rect width="56" height="56" rx="14" fill="#171b30" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
    <text x="28" y="38" text-anchor="middle" fill="#6cd4ff" font-family="Inter, system-ui, -apple-system, Helvetica, sans-serif" font-weight="700" font-size="22">RH</text>
    <text x="76" y="22" fill="#fafaf7" font-family="Inter, system-ui, -apple-system, Helvetica, sans-serif" font-weight="700" font-size="20" letter-spacing="-0.4">Reyad Hasnain</text>
    <text x="76" y="46" fill="rgba(250,250,247,0.55)" font-family="Inter, system-ui, -apple-system, Helvetica, sans-serif" font-weight="500" font-size="13" letter-spacing="2">ICT · TELECOM · DIGITAL ECONOMY</text>
  </g>

  <!-- Eyebrow chip -->
  <g transform="translate(70 ${320 - titleLines.length * (lineHeight / 2)})">
    <rect x="0" y="0" rx="999" ry="999" width="${path === '/' ? 175 : Math.max(160, path.length * 14)}" height="40" fill="rgba(108,212,255,0.12)" stroke="rgba(108,212,255,0.4)" stroke-width="1"/>
    <text x="22" y="26" fill="#6cd4ff" font-family="Inter, system-ui, -apple-system, Helvetica, sans-serif" font-weight="600" font-size="13" letter-spacing="2.6">${escape(path === '/' ? 'PERSONAL SITE' : path.replace(/^\//, '').replace(/-/g, ' ').toUpperCase())}</text>
  </g>

  <!-- Title -->
  <g transform="translate(70 ${380 - titleLines.length * (lineHeight / 2)})">
    ${titleLines
      .map(
        (line, i) =>
          `<text x="0" y="${i * lineHeight}" fill="#fafaf7" font-family="Inter, system-ui, -apple-system, Helvetica, sans-serif" font-weight="700" font-size="78" letter-spacing="-2">${escape(line)}</text>`,
      )
      .join('\n    ')}
  </g>

  <!-- Subtitle -->
  <g transform="translate(70 ${410 + titleLines.length * (lineHeight / 2)})">
    <text x="0" y="0" fill="rgba(250,250,247,0.65)" font-family="Inter, system-ui, -apple-system, Helvetica, sans-serif" font-weight="400" font-size="22">${escape(subtitle)}</text>
  </g>

  <!-- Hairline -->
  <line x1="70" y1="540" x2="1130" y2="540" stroke="url(#hairline)" stroke-width="1"/>

  <!-- Footer -->
  <g transform="translate(70 575)">
    <circle cx="6" cy="-4" r="4" fill="#6cd4ff"/>
    <text x="20" y="0" fill="rgba(250,250,247,0.55)" font-family="Inter, system-ui, -apple-system, Helvetica, sans-serif" font-weight="500" font-size="14">${escape(SITE.url.replace(/^https?:\/\//, ''))}</text>
  </g>
  <g transform="translate(1130 575)">
    <text x="0" y="0" text-anchor="end" fill="#e6c47a" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="20">"ICT can be the next RMG."</text>
  </g>
</svg>`;

  const png = new Resvg(svg, {
    background: '#0d1224',
    fitTo: { mode: 'width', value: 1200 },
    font: {
      loadSystemFonts: true,
      defaultFontFamily: 'sans-serif',
    },
  })
    .render()
    .asPng();

  return new Response(new Uint8Array(png), {
    status: 200,
    headers: {
      'content-type': 'image/png',
      'cache-control': 'public, max-age=86400, s-maxage=2592000, stale-while-revalidate=604800',
    },
  });
};
