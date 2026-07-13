import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import dns from 'node:dns';
import { drawingLessons } from '../data/drawing-lessons.js';

// Из среды Bash-песочницы сеть недоступна и IPv6 к Yandex часто виснет —
// форсим IPv4, чтобы не ловить ConnectTimeout. Запускать через PowerShell.
dns.setDefaultResultOrder('ipv4first');

// Подхватываем school-next/.env, чтобы не задавать YANDEX_* руками каждый раз.
// Существующие переменные окружения приоритетнее файла.
(() => {
  try {
    const envPath = new URL('../.env', import.meta.url);
    const raw = fsSync.readFileSync(envPath, 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!m || line.trim().startsWith('#')) continue;
      const key = m[1];
      const val = m[2].replace(/^["']|["']$/g, '');
      if (process.env[key] === undefined) process.env[key] = val;
    }
  } catch {
    // .env нет — значит переменные передают вручную
  }
})();

const outRoot = path.join(process.cwd(), 'public', 'audio', 'drawing');

function usage() {
  console.log(`Генерация озвучки уроков рисования через Yandex SpeechKit.

Пример:
  YANDEX_API_KEY=... YANDEX_FOLDER_ID=... npm run audio:drawing -- --slug apple-3-4

По умолчанию голос: marina, emotion: good, speed: 0.95.

Опции:
  --slug <slug>       сгенерировать один урок
  --force             перезаписать существующие mp3
  --dry-run           только показать, что будет сгенерировано

Пути файлов:
  public/audio/drawing/{slug}/intro.mp3
  public/audio/drawing/{slug}/step-1.mp3
  public/audio/drawing/{slug}/parent.mp3`);
}

function arg(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : null;
}

const slugArg = arg('--slug');
const slugList = slugArg ? slugArg.split(',').map((s) => s.trim()).filter(Boolean) : [];
const force = process.argv.includes('--force');
const dryRun = process.argv.includes('--dry-run');

if (process.argv.includes('--help')) {
  usage();
  process.exit(0);
}

function voiceText(text) {
  const normalized = String(text || '')
    .replace(/^Шаг (\d+) — /, 'Шаг $1. ')
    .replace(/\s+/g, ' ')
    .trim();

  return normalized.replace(/^(Шаг \d+\. )([а-яё])/, (_, prefix, letter) => prefix + letter.toUpperCase());
}

// Для озвучки шагов убираем повтор названия картинки в конце («…: „солнышко“.»).
// Название звучит один раз в интро — иначе голос дублирует его в каждом шаге
// и это сразу выдаёт робота. На экране (hint) название остаётся.
function stepVoiceText(text) {
  const withoutName = String(text || '').replace(/\s*:\s*«[^»]*»\s*\.?\s*$/u, '.');
  return voiceText(withoutName);
}

function lessonItems(lesson) {
  const items = [];
  const intro = lesson.sayIntro ?? lesson.intro ?? lesson.handHint;
  if (intro) items.push({ name: 'intro.mp3', text: voiceText(intro) });
  for (const [i, step] of (lesson.steps ?? []).entries()) {
    items.push({ name: `step-${i + 1}.mp3`, text: stepVoiceText(step.say ?? step.hint) });
  }
  const parent = lesson.sayParent ?? lesson.parentNote;
  if (parent) items.push({ name: 'parent.mp3', text: voiceText(parent) });
  return items;
}

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function synthesizeYandex(text) {
  const apiKey = process.env.YANDEX_API_KEY;
  const folderId = process.env.YANDEX_FOLDER_ID;
  if (!apiKey || !folderId) throw new Error('Нужны YANDEX_API_KEY и YANDEX_FOLDER_ID');

  const body = new URLSearchParams({
    text,
    lang: process.env.YANDEX_TTS_LANG || 'ru-RU',
    voice: process.env.YANDEX_TTS_VOICE || 'marina',
    speed: process.env.YANDEX_TTS_SPEED || '0.95',
    emotion: process.env.YANDEX_TTS_EMOTION || 'good',
    folderId,
    format: 'mp3',
  });

  // Первые коннекты к Yandex часто виснут (happy-eyeballs), потом соединение
  // «прогревается» — поэтому ретраим сетевые сбои несколько раз.
  const maxAttempts = 6;
  let lastErr;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch('https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize', {
        method: 'POST',
        headers: { Authorization: `Api-Key ${apiKey}` },
        body,
      });
      if (!res.ok) throw new Error(`Yandex TTS ${res.status}: ${await res.text()}`);
      return Buffer.from(await res.arrayBuffer());
    } catch (err) {
      // 4xx/5xx от API (текст ошибки) не ретраим — это не сетевой сбой
      if (String(err.message).startsWith('Yandex TTS')) throw err;
      lastErr = err;
      if (attempt < maxAttempts) {
        await new Promise((r) => setTimeout(r, 800 * attempt));
      }
    }
  }
  throw lastErr;
}


const lessons = drawingLessons.filter((lesson) => !slugList.length || slugList.includes(lesson.slug));
if (!lessons.length) throw new Error(slugList.length ? `Уроки не найдены: ${slugList.join(', ')}` : 'Нет уроков для генерации');

let made = 0;
let skipped = 0;
for (const lesson of lessons) {
  const dir = path.join(outRoot, lesson.slug);
  await fs.mkdir(dir, { recursive: true });

  for (const item of lessonItems(lesson)) {
    const file = path.join(dir, item.name);
    if (!force && await exists(file)) {
      skipped += 1;
      continue;
    }

    console.log(`${dryRun ? 'dry' : 'make'} ${lesson.slug}/${item.name}: ${item.text}`);
    if (!dryRun) {
      const audio = await synthesizeYandex(item.text);
      await fs.writeFile(file, audio);
    }
    made += 1;
  }
}

console.log(`Готово. Создано: ${made}, пропущено: ${skipped}. Провайдер: Yandex SpeechKit, голос: ${process.env.YANDEX_TTS_VOICE || 'marina'}.`);

