import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import dns from 'node:dns';

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
  } catch {}
})();

const clips = {
  'diagnostic-intro': 'Сначала короткая проверка. Здесь нет оценок и секундомера. Просто отвечай так, как умеешь.',
  'daily-intro': 'Начинаем тренировку на сегодня. Повторим только те примеры, которым сейчас нужна практика.',
  'stage-intro': 'Начинаем маршрут. Сначала подумай, затем выбери или введи ответ.',
  groups: 'Посчитай одинаковые группы и найди, сколько предметов всего.',
  array: 'Посмотри на ряды точек. Посчитай, сколько точек во всех рядах.',
  repeated: 'Замени одинаковые слагаемые одним примером на умножение.',
  sequence: 'Продолжи числовой ряд. Обрати внимание, с каким шагом растут числа.',
  direct: 'Реши пример на умножение. Можно использовать удобный способ.',
  missing: 'Найди пропущенное число, чтобы равенство стало верным.',
  strategy: 'Используй подсказку и разложи трудный пример на знакомые части.',
  story: 'Прочитай условие и определи, какое действие поможет найти ответ.',
  division: 'Вспомни связанный пример на умножение и выполни деление.',
  family: 'Найди число, которое связывает умножение и деление.',
  correct: 'Верно! Отличная работа.',
  retry: 'Пока не получилось. Посмотри на подсказку и попробуй ещё раз.',
  guided: 'Давай разберём вместе. Посмотри на решение, а затем повтори ответ самостоятельно.',
  'diagnostic-finish': 'Проверка закончена. Теперь тренажёр знает, с чего лучше начать.',
  'daily-finish': 'Тренировка на сегодня готова. Слабые примеры вернутся в подходящий день.',
  'stage-finish': 'Маршрут завершён. Навык стал крепче.',
};

const outRoot = path.join(process.cwd(), 'public', 'audio', 'multiplication');
const force = process.argv.includes('--force');
const dryRun = process.argv.includes('--dry-run');

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function synthesize(text) {
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
  const response = await fetch('https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize', {
    method: 'POST',
    headers: { Authorization: `Api-Key ${apiKey}` },
    body,
  });
  if (!response.ok) throw new Error(`Yandex TTS ${response.status}: ${await response.text()}`);
  return Buffer.from(await response.arrayBuffer());
}

await fs.mkdir(outRoot, { recursive: true });
let made = 0;
let skipped = 0;
for (const [name, text] of Object.entries(clips)) {
  const file = path.join(outRoot, `${name}.mp3`);
  if (!force && await exists(file)) {
    skipped += 1;
    continue;
  }
  console.log(`${dryRun ? 'dry' : 'make'} ${name}.mp3: ${text}`);
  if (!dryRun) await fs.writeFile(file, await synthesize(text));
  made += 1;
}

console.log(`Готово. Создано: ${made}, пропущено: ${skipped}. Голос: ${process.env.YANDEX_TTS_VOICE || 'marina'}, emotion: ${process.env.YANDEX_TTS_EMOTION || 'good'}, speed: ${process.env.YANDEX_TTS_SPEED || '0.95'}.`);
