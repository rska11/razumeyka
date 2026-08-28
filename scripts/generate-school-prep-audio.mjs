import dns from 'node:dns';
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { schoolPrepWeekOne } from '../data/school-prep-course.js';
import { schoolPrepWeekTwo } from '../data/school-prep-week-two.js';
import { schoolPrepWeekThree } from '../data/school-prep-week-three.js';
import { schoolPrepWeekFour } from '../data/school-prep-week-four-discovery.js';
import { schoolPrepWeekFive } from '../data/school-prep-week-five.js';

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
const speechKitEndpoint = process.env.SPEECHKIT_ENDPOINT || 'https://tts.api.cloud.yandex.net/tts/v3/utteranceSynthesis';
const force = process.argv.includes('--force');
const dryRun = process.argv.includes('--dry-run');
const dayArg = valueAfter('--day');
const weekArg = valueAfter('--week');
const queueOut = valueAfter('--queue-out');
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
  const title = /[.!?…]$/u.test(mission.title) ? mission.title : mission.title + '.';
  const parts = [title, mission.prompt];
  if (mission.type === 'choice' || mission.type === 'sequence') {
    parts.push(`Варианты: ${labels(mission.options)}.`);
  }
  if (mission.type === 'sort') {
    parts.push(`Предметы: ${labels(mission.items)}. Зоны: ${labels(mission.groups)}.`);
  }
  if (mission.type === 'recall') {
    parts.push(`Запомни: ${labels(mission.study)}. Варианты ответа: ${labels(mission.options)}.`);
  }
  if (mission.type === 'attention-grid') {
    parts.push(`Клетки поля: ${labels(mission.cells)}.`);
  }
  if (mission.type === 'go-no-go') {
    parts.push(`Правило: ${mission.rule}`);
  }
  if (mission.type === 'rule-switch') {
    parts.push('Правило будет меняться перед каждым раундом.');
  }
  return clean(parts.join(' '));
}

function itemsForMission(day, mission) {
  const prefix = path.posix.join(day.id, mission.id);
  const items = [{ relativePath: path.posix.join(prefix, 'instruction.mp3'), text: instructionText(mission) }];

  for (const [index, question] of (mission.questions || []).entries()) {
    items.push({
      relativePath: path.posix.join(prefix, `question-${index + 1}.mp3`),
      text: clean(`${question.prompt} Варианты ответа: ${labels(question.options)}.`),
    });
  }

  for (const [index, action] of (mission.actions || []).entries()) {
    items.push({
      relativePath: path.posix.join(prefix, `action-${index + 1}.mp3`),
      text: clean(`${action.title}. ${action.text}`),
    });
  }
  for (const [index, cue] of (mission.cues || []).entries()) {
    items.push({
      relativePath: path.posix.join(prefix, `cue-${index + 1}.mp3`),
      text: clean(cue.label),
    });
  }
  for (const [index, round] of (mission.rounds || []).entries()) {
    items.push({
      relativePath: path.posix.join(prefix, `round-${index + 1}.mp3`),
      text: clean(`Новое правило: ${round.rule}. Сигнал: ${round.stimulus}. Варианты ответа: ${labels(round.options)}.`),
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

const courseWeeks = [schoolPrepWeekOne, schoolPrepWeekTwo, schoolPrepWeekThree, schoolPrepWeekFour, schoolPrepWeekFive];
const selectedDays = courseWeeks
  .filter((week) => !weekArg || String(week.number) === weekArg || week.id === weekArg)
  .flatMap((week) => week.days)
  .filter((day) => !dayArg || day.id === dayArg || String(day.number) === dayArg);
if (!selectedDays.length) throw new Error(`День не найден: ${dayArg}`);

const queue = [
  ...(!weekArg || weekArg === '1' ? [{ relativePath: path.posix.join('method', 'intro-hero-v1.mp3'), text: salesIntro }] : []),
  ...selectedDays.flatMap((day) => day.missions.flatMap((mission) => itemsForMission(day, mission))),
];

if (queueOut) {
  await fs.mkdir(path.dirname(path.resolve(queueOut)), { recursive: true });
  await fs.writeFile(queueOut, JSON.stringify(queue), 'utf8');
  console.log(`Очередь сохранена: ${queueOut}. Файлов: ${queue.length}.`);
  process.exit(0);
}

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
      const response = await fetch(speechKitEndpoint, {
        method: 'POST',
        signal: AbortSignal.timeout(30_000),
        headers: {
          Authorization: `Api-Key ${apiKey}`,
          'Content-Type': 'application/json',
          ...(process.env.SPEECHKIT_HOST ? { Host: process.env.SPEECHKIT_HOST } : {}),
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
