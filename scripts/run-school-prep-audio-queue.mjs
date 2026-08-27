import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';

function loadEnv() {
  try {
    const raw = fsSync.readFileSync(new URL('../.env', import.meta.url), 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!match || line.trim().startsWith('#')) continue;
      if (process.env[match[1]] === undefined) {
        process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
      }
    }
  } catch {
    // Environment variables may be supplied by the process.
  }
}

function argument(name, fallback = null) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

function decodeResponse(raw) {
  const chunks = [];
  for (const line of raw.split(/\r?\n/).filter(Boolean)) {
    const data = JSON.parse(line)?.result?.audioChunk?.data;
    if (data) chunks.push(Buffer.from(data, 'base64'));
  }
  if (!chunks.length) throw new Error('SpeechKit returned no audio data');
  return Buffer.concat(chunks);
}

function splitText(text, maxLength = 220) {
  const sentences = text.match(/[^.!?…]+[.!?…]+|[^.!?…]+$/gu) || [text];
  const chunks = [];
  let current = '';
  for (const sentence of sentences.map((value) => value.replace(/\s+/g, ' ').trim())) {
    if (current && `${current} ${sentence}`.length > maxLength) {
      chunks.push(current);
      current = sentence;
    } else {
      current = `${current} ${sentence}`.trim();
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

loadEnv();
const apiKey = process.env.YANDEX_API_KEY;
if (!apiKey) throw new Error('YANDEX_API_KEY is missing');

const queuePath = path.resolve(argument('--queue', 'school-prep-week2-queue.json'));
const outRoot = path.resolve(argument('--out', 'public/audio/school-prep'));
const concurrency = Math.max(1, Number(argument('--concurrency', '2')));
const endpoint = 'https://tts.api.cloud.yandex.net/tts/v3/utteranceSynthesis';
const queue = JSON.parse(await fs.readFile(queuePath, 'utf8'));
let cursor = 0;
let made = 0;
let skipped = 0;

async function synthesizeChunk(text) {
  let lastError;
  for (let attempt = 1; attempt <= 6; attempt += 1) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        signal: AbortSignal.timeout(30_000),
        headers: { Authorization: `Api-Key ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          hints: [{ voice: 'jane' }, { role: 'neutral' }, { speed: '1.0' }],
          outputAudioSpec: { containerAudio: { containerAudioType: 'MP3' } },
        }),
      });
      if (!response.ok) throw new Error(`SpeechKit ${response.status}: ${await response.text()}`);
      return decodeResponse(await response.text());
    } catch (error) {
      lastError = error;
      if (String(error.message).startsWith('SpeechKit ')) throw error;
      if (attempt < 6) await new Promise((resolve) => setTimeout(resolve, attempt * 800));
    }
  }
  throw lastError;
}

async function synthesize(text) {
  const chunks = [];
  for (const part of splitText(text)) chunks.push(await synthesizeChunk(part));
  return Buffer.concat(chunks);
}

async function exists(file) {
  try { await fs.access(file); return true; } catch { return false; }
}

async function worker() {
  while (cursor < queue.length) {
    const item = queue[cursor++];
    const safeRelativePath = item.relativePath.replaceAll('\\', '/');
    const file = path.join(outRoot, safeRelativePath);
    if (await exists(file)) {
      skipped += 1;
      continue;
    }
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, await synthesize(item.text));
    made += 1;
    console.log(`[${made + skipped}/${queue.length}] ${item.relativePath}`);
  }
}

await Promise.all(Array.from({ length: Math.min(concurrency, queue.length) }, worker));
console.log(`DONE made=${made} skipped=${skipped} total=${queue.length}`);
