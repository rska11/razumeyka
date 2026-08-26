// Скачивает Google Fonts локально: css2 -> woff2 в public/fonts + app/fonts.css
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = 'F:/school-landing/school-next';
const CSS_URL = 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Nunito+Sans:wght@800;900&family=Plus+Jakarta+Sans:wght@700;800&family=Unbounded:wght@500;600;700;800&display=swap';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const KEEP = /^(cyrillic|cyrillic-ext|latin|latin-ext)$/;

const css = await (await fetch(CSS_URL, { headers: { 'User-Agent': UA } })).text();
await fs.mkdir(path.join(ROOT, 'public/fonts'), { recursive: true });

const blocks = css.split('/*').slice(1);
const out = [];
let count = 0, bytes = 0;

for (const raw of blocks) {
  const subset = raw.slice(0, raw.indexOf('*/')).trim();
  const block = raw.slice(raw.indexOf('*/') + 2);
  if (!KEEP.test(subset)) continue;
  const family = /font-family:\s*'([^']+)'/.exec(block)?.[1];
  const weight = /font-weight:\s*([\d ]+);/.exec(block)?.[1].trim();
  const style = /font-style:\s*(\w+);/.exec(block)?.[1] || 'normal';
  const url = /src:\s*url\(([^)]+)\)/.exec(block)?.[1];
  const range = /unicode-range:\s*([^;]+);/.exec(block)?.[1];
  if (!family || !url) continue;

  const slug = `${family.toLowerCase().replace(/\s+/g, '-')}-${weight.replace(/\s+/g, '-')}-${subset}.woff2`;
  const buf = Buffer.from(await (await fetch(url, { headers: { 'User-Agent': UA } })).arrayBuffer());
  await fs.writeFile(path.join(ROOT, 'public/fonts', slug), buf);
  count++; bytes += buf.length;

  out.push(`@font-face {
  font-family: '${family}';
  font-style: ${style};
  font-weight: ${weight};
  font-display: swap;
  src: url('/fonts/${slug}') format('woff2');
  unicode-range: ${range};
}`);
}

const header = `/* Шрифты хостятся у нас, а не на fonts.googleapis.com.
   Причина юридическая: запрос к Google уходил с IP пользователя ДО согласия
   и был трансграничной передачей данных в иностранный сервис. Локальные файлы
   лежат в public/fonts, генератор — scripts/fetch-google-fonts.mjs.
   Набор и начертания те же, что были в css2-импорте (подмножества cyrillic/latin). */\n\n`;
await fs.writeFile(path.join(ROOT, 'app/fonts.css'), header + out.join('\n\n') + '\n', 'utf8');
console.log(`files: ${count}, total KB: ${Math.round(bytes / 1024)}`);
