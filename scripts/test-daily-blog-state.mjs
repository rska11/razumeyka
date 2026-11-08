import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { todaysPost, verifyLive, snapshot, sameSnapshot } from './daily-blog-state.mjs';

const post = { slug: 'new-article', date: '2026-11-08', title: 'New article', cover: { image: '/images/blog/cover.webp' }, body: [{ type: 'image', src: '/images/blog/example.svg' }] };
test('вчерашняя статья не закрывает сегодняшнее задание', () => {
  assert.equal(todaysPost([{ ...post, date: '2026-11-07' }], '2026-11-08'), null);
  assert.equal(todaysPost([post], '2026-11-08'), post);
  assert.throws(() => todaysPost([post, post], '2026-11-08'), /More than one/);
});
const mock = ({ date = post.date, missingImage = false, sitemap = true } = {}) => async (url) => {
  if (url.endsWith('/sitemap.xml')) return new Response(sitemap ? `https://znayton.ru/blog/${post.slug}` : '');
  if (url.includes('/images/')) return new Response('image', { status: missingImage ? 404 : 200, headers: { 'content-type': 'image/webp' } });
  return new Response(`<script type="application/ld+json">${JSON.stringify({ '@type': 'BlogPosting', headline: post.title, datePublished: date })}</script>`);
};
test('HTTP 200 со старой датой не считается новой публикацией', async () => {
  await assert.rejects(verifyLive(post, mock({ date: '2026-11-07' })), /publication date/);
});
test('проверяется фактическая статья, sitemap и доступность изображений', async () => {
  assert.equal((await verifyLive(post, mock())).status, 'published');
  await assert.rejects(verifyLive(post, mock({ missingImage: true })), /image/);
  await assert.rejects(verifyLive(post, mock({ sitemap: false })), /sitemap/);
});
test('повтор может продолжить только неизменённые файлы своей попытки', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'znayton-state-'));
  fs.mkdirSync(path.join(dir, 'data'));
  const file = path.join(dir, 'data/blog.js');
  const git = (args) => args.includes('--show-prefix') ? 'school-next/' : args.includes('--porcelain=v1') ? ' M school-next/data/blog.js\0' : 'head-1';
  try {
    fs.writeFileSync(file, 'original draft');
    const first = snapshot(dir, git);
    assert(sameSnapshot(first, snapshot(dir, git)));
    fs.writeFileSync(file, 'changed manually after failure');
    assert.equal(sameSnapshot(first, snapshot(dir, git)), false);
    assert.equal(sameSnapshot(first, { ...first, head: 'another-commit' }), false);
    const otherGit = (args) => args.includes('--porcelain=v1') ? ' M school-next/scripts/other.js\0' : git(args);
    assert.throws(() => snapshot(dir, otherGit), /Unexpected file/);
  } finally {
    fs.unlinkSync(file);
    fs.rmdirSync(path.join(dir, 'data'));
    fs.rmdirSync(dir);
  }
});
