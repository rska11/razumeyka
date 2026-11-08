import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export const site = 'https://znayton.ru';
export function todaysPost(posts, date) {
  const found = posts.filter((post) => post.date === date);
  if (found.length > 1) throw new Error('More than one article has today\'s date; review manually.');
  return found[0] || null;
}

export async function verifyLive(post, fetcher = fetch) {
  const url = `${site}/blog/${post.slug}`;
  const response = await fetcher(url, { signal: AbortSignal.timeout(30000), cache: 'no-store' });
  if (!response.ok) throw new Error(`Article is not live: HTTP ${response.status}`);
  const html = await response.text();
  const articles = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .flatMap((match) => { try { const value = JSON.parse(match[1]); return Array.isArray(value) ? value : [value]; } catch { return []; } });
  if (!articles.some((article) => article['@type'] === 'BlogPosting' && article.headline === post.title && article.datePublished === post.date)) {
    throw new Error('Live article does not match the expected title and publication date.');
  }
  const sitemap = await fetcher(`${site}/sitemap.xml`, { signal: AbortSignal.timeout(30000), cache: 'no-store' });
  if (!sitemap.ok || !(await sitemap.text()).includes(url)) throw new Error('Article is missing from the live sitemap.');
  for (const image of [post.cover?.image, ...post.body.filter((block) => block.type === 'image').map((block) => block.src)]) {
    if (!image || !image.startsWith('/')) throw new Error('Missing or external article image.');
    const asset = await fetcher(site + image, { signal: AbortSignal.timeout(30000) });
    if (!asset.ok || !asset.headers.get('content-type')?.startsWith('image/')) throw new Error('An article image is not available.');
    await asset.body?.cancel();
  }
  return { status: 'published', url, date: post.date, recrawlQueued: false };
}

// Save the exact failed attempt's changes. A later retry may resume them only
// if no one has changed those files or Git HEAD in the meantime.
export function snapshot(workspace = process.cwd(), gitOverride = null) {
  const git = gitOverride || ((args) => execFileSync('git', args, { cwd: workspace, encoding: 'utf8' }).trimEnd());
  const prefix = git(['rev-parse', '--show-prefix']);
  const entries = git(['status', '--porcelain=v1', '-z', '--untracked-files=all', '--', '.']).split('\0').filter(Boolean);
  const allowed = /^(data\/blog\.js|app\/blog\/(?:page\.jsx|\[slug\]\/page\.jsx)|public\/images\/blog\/(?:[^/]+\/)*[^/]+|docs\/blog\/[^/]+)$/;
  const changes = entries.map((entry) => {
    const status = entry.slice(0, 2);
    const file = entry.slice(3);
    if (status.includes('R') || status.includes('C') || !file.startsWith(prefix)) throw new Error('Cannot safely resume renamed or external files.');
    const relative = file.slice(prefix.length).replace(/\\/g, '/');
    if (!allowed.test(relative)) throw new Error(`Unexpected file changed by the article run: ${relative}`);
    const absolute = path.join(workspace, relative);
    const hash = fs.existsSync(absolute) ? crypto.createHash('sha256').update(fs.readFileSync(absolute)).digest('hex') : null;
    return { file: relative, status, hash };
  }).sort((a, b) => a.file.localeCompare(b.file));
  return { head: git(['rev-parse', 'HEAD']), changes };
}

export function sameSnapshot(left, right) {
  return left.head === right.head && JSON.stringify(left.changes) === JSON.stringify(right.changes);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const [command, value] = process.argv.slice(2);
    if (command === '--snapshot') {
      fs.writeFileSync(value, JSON.stringify(snapshot(), null, 2));
    } else if (command === '--check-worktree') {
      const current = snapshot();
      const prefix = execFileSync('git', ['rev-parse', '--show-prefix'], { encoding: 'utf8' }).trim();
      const staged = execFileSync('git', ['diff', '--cached', '--name-only'], { encoding: 'utf8' }).trim().split(/\r?\n/).filter(Boolean);
      if (staged.some((file) => !file.startsWith(prefix))) throw new Error('Unrelated staged files exist.');
      if (current.changes.length && (!fs.existsSync(value) || !sameSnapshot(current, JSON.parse(fs.readFileSync(value, 'utf8'))))) {
        throw new Error('Unfinished work differs from the previous article attempt. It will not be included in an automated commit.');
      }
      console.log(current.changes.length ? 'Resuming the exact previous article changes.' : 'Website checkout is clean.');
    } else {
      const { blogPosts } = await import('../data/blog.js');
      const date = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Moscow' }).format(new Date());
      const post = todaysPost(blogPosts, date);
      if (command === '--find-today') {
        if (!post) console.log(JSON.stringify({ published: false, resumeUrl: '' }));
        else {
          try { console.log(JSON.stringify({ published: true, ...await verifyLive(post) })); }
          catch { console.log(JSON.stringify({ published: false, resumeUrl: `${site}/blog/${post.slug}` })); }
        }
      } else if (command === '--verify-result') {
        const result = JSON.parse(fs.readFileSync(value, 'utf8').replace(/^\uFEFF/, ''));
        if (!post || result.url !== `${site}/blog/${post.slug}`) throw new Error('The reported URL is not a new article for today.');
        console.log(JSON.stringify(await verifyLive(post)));
      } else throw new Error('Unknown daily-blog state command.');
    }
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
