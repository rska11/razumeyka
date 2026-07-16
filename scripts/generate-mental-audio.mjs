import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import dns from 'node:dns';
import { mentalLessons } from '../data/mental-lessons.js';

// Запускать через PowerShell на хосте: из песочницы сеть к Yandex часто недоступна.
dns.setDefaultResultOrder('ipv4first');

// Подхватываем school-next/.env, как генератор рисования.
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
    // .env нет — значит переменные передают вручную.
  }
})();

const outRoot = path.join(process.cwd(), 'public', 'audio', 'mental');

function usage() {
  console.log(`Генерация озвучки уроков ментальной арифметики через Yandex SpeechKit.

Пример:
  node scripts/generate-mental-audio.mjs --slug ma-m0-d00-cifry-1-3

По умолчанию голос: marina, emotion: good, speed: 0.95.

Опции:
  --slug <slug>       сгенерировать один урок или список через запятую
  --force             перезаписать существующие mp3
  --dry-run           только показать, что будет сгенерировано

Пути файлов:
  public/audio/mental/{slug}/intro.mp3
  public/audio/mental/{slug}/step-1.mp3
  public/audio/mental/{slug}/parent.mp3`);
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

function lessonItems(lesson) {
  const items = [];
  if (lesson.intro) items.push({ name: 'intro.mp3', text: voiceText(lesson.intro) });
  for (const [i, step] of (lesson.steps ?? []).entries()) {
    const text = step.say ?? step.text;
    if (text) items.push({ name: `step-${i + 1}.mp3`, text: voiceText(text) });
  }
  if (lesson.parentNote) items.push({ name: 'parent.mp3', text: voiceText(lesson.parentNote) });
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
      if (String(err.message).startsWith('Yandex TTS')) throw err;
      lastErr = err;
      if (attempt < maxAttempts) {
        await new Promise((r) => setTimeout(r, 800 * attempt));
      }
    }
  }
  throw lastErr;
}

const lessons = mentalLessons.filter((lesson) => !slugList.length || slugList.includes(lesson.slug));
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
