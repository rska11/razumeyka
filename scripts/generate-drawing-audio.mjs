import fs from 'node:fs/promises';
import path from 'node:path';
import { drawingLessons } from '../data/drawing-lessons.js';

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

function lessonItems(lesson) {
  const items = [];
  const intro = lesson.sayIntro ?? lesson.intro ?? lesson.handHint;
  if (intro) items.push({ name: 'intro.mp3', text: voiceText(intro) });
  for (const [i, step] of (lesson.steps ?? []).entries()) {
    items.push({ name: `step-${i + 1}.mp3`, text: voiceText(step.say ?? step.hint) });
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

  const res = await fetch('https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize', {
    method: 'POST',
    headers: { Authorization: `Api-Key ${apiKey}` },
    body,
  });

  if (!res.ok) throw new Error(`Yandex TTS ${res.status}: ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
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

