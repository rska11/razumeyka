import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { recrawl, validateUrl, readPending, savePending } from './yandex-recrawl.mjs';

test('только наш блог: не принимает чужой сайт, другие страницы и параметры', () => {
  assert.equal(validateUrl('https://znayton.ru/blog/test-article'), 'https://znayton.ru/blog/test-article');
  for (const url of ['https://example.com/blog/test', 'https://znayton.ru/admin', 'https://znayton.ru/blog/test?x=1', 'https://znayton.ru/blog/test#x', 'https://user@znayton.ru/blog/test']) assert.throws(() => validateUrl(url));
});

function mock(status = 202, verified = true) {
  const calls = [];
  const fetcher = async (url, init) => {
    calls.push({ url, ...init });
    let data = url.endsWith('/user') ? { user_id: 123 } : url.endsWith('/hosts') ? { hosts: [{ host_id: 'https:znayton.ru:443', unicode_host_url: 'https://znayton.ru/', verified }] } : url.endsWith('/quota') ? { daily_quota: 10 } : status === 409 ? { error_code: 'URL_ALREADY_ADDED' } : { task_id: 'task-1', quota_remainder: 9 };
    return new Response(JSON.stringify(data), { status: url.endsWith('/queue') ? status : 200 });
  };
  return { calls, fetcher };
}

test('проверка доступа ничего не отправляет на переобход', async () => {
  const { calls, fetcher } = mock();
  const result = await recrawl({ token: 'test', fetcher });
  assert.equal(result.connected, true);
  assert(calls.every((c) => c.method === 'GET'));
});

test('отправка одного URL без дублей, правильная авторизация', async () => {
  const { calls, fetcher } = mock();
  const url = 'https://znayton.ru/blog/test';
  const result = await recrawl({ token: 'test', urls: [url, url], fetcher });
  assert.equal(result.results.length, 1);
  assert.equal(calls[2].method, 'POST');
  assert.equal(calls[2].headers.Authorization, 'OAuth test');
  assert.deepEqual(JSON.parse(calls[2].body), { url });
  assert(calls[2].url.includes('https%3Aznayton.ru%3A443'));
});

test('повторная отправка уже поставленного URL считается успехом', async () => {
  const { fetcher } = mock(409);
  const result = await recrawl({ token: 'test', urls: ['https://znayton.ru/blog/test'], fetcher });
  assert.equal(result.results[0].alreadyQueued, true);
});

test('нет токена или прав: запросы не публикуют URL', async () => {
  await assert.rejects(recrawl({ token: '' }), /YANDEX_WEBMASTER_TOKEN/);
  const { calls, fetcher } = mock(202, false);
  await assert.rejects(recrawl({ token: 'test', urls: ['https://znayton.ru/blog/test'], fetcher }), /подтверждённого сайта/);
  assert(calls.every((c) => c.method === 'GET'));
});

test('ошибка API не раскрывает токен в исключении', async () => {
  const fetcher = async () => new Response(JSON.stringify({ error_message: 'SECRET' }), { status: 401 });
  await assert.rejects(recrawl({ token: 'SECRET', fetcher }), (error) => error.message.includes('401') && !error.message.includes('SECRET'));
});

test('временный HTTP 504 повторяется, ответ уже добавленного URL принимается', async () => {
  const { fetcher } = mock(409);
  let attempts = 0;
  const wrapped = async (url, init) => {
    if (url.endsWith('/queue') && ++attempts === 1) return new Response('', { status: 504 });
    return fetcher(url, init);
  };
  const result = await recrawl({ token: 'test', urls: ['https://znayton.ru/blog/test'], fetcher: wrapped });
  assert.equal(attempts, 2);
  assert.equal(result.results[0].alreadyQueued, true);
});

test('очередь сохраняет предыдущие URL и не размножает дубли', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'znayton-recrawl-'));
  const file = path.join(dir, 'pending.json');
  try {
    assert.deepEqual(readPending(file), []);
    savePending(['https://znayton.ru/blog/test'], file);
    savePending(['https://znayton.ru/blog/test', 'https://znayton.ru/blog'], file);
    assert.deepEqual(readPending(file), ['https://znayton.ru/blog/test', 'https://znayton.ru/blog']);
    assert.throws(() => savePending(['https://example.com/blog'], file));
    assert.equal(readPending(file).length, 2);
  } finally {
    if (fs.existsSync(file)) fs.unlinkSync(file);
    fs.rmdirSync(dir);
  }
});
