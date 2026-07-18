import dns from 'node:dns';
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { schoolPrepWeekOne } from '../data/school-prep-course.js';

dns.setDefaultResultOrder('ipv4first');

(() => {
  try {
    const raw = fsSync.readFileSync(new URL('../.env', import.meta.url), 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!match || line.trim().startsWith('#')) continue;
      const value = match[2].replace(/^["']|["']$/g, '');
      if (process.env[match[1]] === undefined) process.env[match[1]] = value;
    }
  } catch {
    // Переменные можно передать через окружение.
  }
})();

const outRoot = path.join(process.cwd(), 'public', 'audio', 'school-prep');
const force = process.argv.includes('--force');
const dryRun = process.argv.includes('--dry-run');
const dayArg = valueAfter('--day');
const concurrency = Math.max(1, Number(valueAfter('--concurrency') || 2));

function valueAfter(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : null;
}

function clean(text) {
  return String(text || '').replace(/\s+/g, ' ').trim();
}

function labels(items) {
  return items.map((item) => item.label).filter(Boolean).join(', ');
}

function instructionText(mission) {
  const parts = [mission.title + '.', mission.prompt];
  if (mission.type === 'choice' || mission.type === 'sequence') {
    parts.push(`Варианты: ${labels(mission.options)}.`);
  }
  if (mission.type === 'sort') {
    parts.push(`Предметы: ${labels(mission.items)}. Зоны: ${labels(mission.groups)}.`);
  }
  return clean(parts.join(' '));
}

function itemsForMission(day, mission) {
  const prefix = path.join(day.id, mission.id);
  const items = [{ relativePath: path.join(prefix, 'instruction.mp3'), text: instructionText(mission) }];

  for (const [index, question] of (mission.questions || []).entries()) {
    items.push({
      relativePath: path.join(prefix, `question-${index + 1}.mp3`),
      text: clean(`${question.prompt} Варианты ответа: ${labels(question.options)}.`),
    });
  }

  for (const [index, action] of (mission.actions || []).entries()) {
    items.push({
      relativePath: path.join(prefix, `action-${index + 1}.mp3`),
      text: clean(`${action.title}. ${action.text}`),
    });
  }
  return items;
}

const salesIntro = clean(`
  Добро пожаловать в Город знаний! Здесь подготовка к школе — не бесконечные тетради,
  а настоящее приключение. Вместе с лисёнком Искрой ребёнок учится слышать инструкцию,
  замечать главное, рассуждать, считать и уверенно доводить дело до конца.
  Каждый день — двадцать пять коротких игровых миссий, а за каждым выполненным шагом
  стоит настоящий навык, который становится сильнее. Первый полноценный день открыт бесплатно.
  Нажимайте «Попробовать» — и соберите первый ключ к спокойному и уверенному школьному старту!
`);

const selectedDays = schoolPrepWeekOne.days.filter((day) => !dayArg || day.id === dayArg || String(day.number) === dayArg);
if (!selectedDays.length) throw new Error(`День не найден: ${dayArg}`);

const queue = [
  { relativePath: path.join('method', 'intro-hero-v1.mp3'), text: salesIntro },
  ...selectedDays.flatMap((day) => day.missions.flatMap((mission) => itemsForMission(day, mission))),
];

async function fileExists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

function decodeV3Response(raw) {
  const chunks = [];
  for (const line of raw.split(/\r?\n/).filter(Boolean)) {
    const parsed = JSON.parse(line);
    const data = parsed?.result?.audioChunk?.data;
    if (data) chunks.push(Buffer.from(data, 'base64'));
  }
  if (!chunks.length) throw new Error('Yandex SpeechKit вернул ответ без аудиоданных');
  return Buffer.concat(chunks);
}

async function synthesizeChunk(text) {
  const apiKey = process.env.YANDEX_API_KEY;
  if (!apiKey) throw new Error('Нужен YANDEX_API_KEY в school-next/.env');

  const body = {
    text,
    hints: [
      { voice: 'jane' },
      { role: 'neutral' },
      { speed: '1.0' },
    ],
    outputAudioSpec: { containerAudio: { containerAudioType: 'MP3' } },
  };

  let lastError;
  for (let attempt = 1; attempt <= 6; attempt += 1) {
    try {
      const response = await fetch('https://tts.api.cloud.yandex.net/tts/v3/utteranceSynthesis', {
        method: 'POST',
        headers: {
          Authorization: `Api-Key ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error(`Yandex TTS ${response.status}: ${await response.text()}`);
      return decodeV3Response(await response.text());
    } catch (error) {
      if (String(error.message).startsWith('Yandex TTS')) throw error;
      lastError = error;
      if (attempt < 6) await new Promise((resolve) => setTimeout(resolve, 800 * attempt));
    }
  }
  throw lastError;
}

function splitForSynthesis(text, maxLength = 220) {
  const sentences = text.match(/[^.!?…]+[.!?…]+|[^.!?…]+$/gu) || [text];
  const chunks = [];
  let current = '';
  for (const sentence of sentences.map(clean)) {
    if (!sentence) continue;
    if (current && `${current} ${sentence}`.length > maxLength) {
      chunks.push(current);
      current = sentence;
    } else {
      current = clean(`${current} ${sentence}`);
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

async function synthesize(text) {
  const audioParts = [];
  for (const chunk of splitForSynthesis(text)) {
    audioParts.push(await synthesizeChunk(chunk));
  }
  return Buffer.concat(audioParts);
}

let cursor = 0;
let made = 0;
let skipped = 0;

async function worker() {
  while (cursor < queue.length) {
    const item = queue[cursor];
    cursor += 1;
    const file = path.join(outRoot, item.relativePath);
    if (!force && await fileExists(file)) {
      skipped += 1;
      continue;
    }
    console.log(`${dryRun ? 'dry' : 'make'} ${item.relativePath}: ${item.text}`);
    if (!dryRun) {
      await fs.mkdir(path.dirname(file), { recursive: true });
      await fs.writeFile(file, await synthesize(item.text));
    }
    made += 1;
  }
}

await Promise.all(Array.from({ length: Math.min(concurrency, queue.length) }, () => worker()));
console.log(`Готово. Создано: ${made}, пропущено: ${skipped}, всего: ${queue.length}. Jane neutral, скорость 1.0.`);
