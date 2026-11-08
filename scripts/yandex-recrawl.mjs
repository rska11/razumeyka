import { pathToFileURL } from 'node:url';
import fs from 'node:fs';

const API = 'https://api.webmaster.yandex.net/v4';
const SITE = 'https://znayton.ru';

export function validateUrl(value) {
  const url = new URL(value);
  if (url.origin !== SITE || url.username || url.password || url.search || url.hash ||
      !/^\/blog(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)?\/?$/.test(url.pathname)) {
    throw new Error('Разрешены только URL блога https://znayton.ru без параметров и фрагментов.');
  }
  return url.href;
}

export function loadEnvironment() {
  for (const file of ['.env', '.env.blog']) {
    if (fs.existsSync(file)) process.loadEnvFile(file);
  }
}

export async function recrawl({ token, urls = [], fetcher = fetch }) {
  if (!token) throw new Error('Добавьте YANDEX_WEBMASTER_TOKEN в локальный файл .env.blog. Токен не нужно отправлять в чат.');
  const validated = [...new Set(urls.map(validateUrl))];
  const request = async (resource, body) => {
    let response;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        response = await fetcher(`${API}${resource}`, {
          method: body ? 'POST' : 'GET',
          headers: { Authorization: `OAuth ${token}`, Accept: 'application/json', ...(body ? { 'Content-Type': 'application/json' } : {}) },
          ...(body ? { body: JSON.stringify(body) } : {}),
          signal: AbortSignal.timeout(20000),
        });
      } catch {
        if (attempt === 2) throw new Error('Яндекс Вебмастер: сетевая ошибка после трёх попыток.');
      }
      if (response && response.status !== 429 && response.status < 500) break;
      if (attempt < 2) {
        await response?.body?.cancel();
        response = undefined;
        await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
    const data = await response.json().catch(() => ({}));
    if (response.status === 409 && data.error_code === 'URL_ALREADY_ADDED') return { alreadyQueued: true };
    // Не печатать тело ошибки: API может вернуть лишнюю информацию об аккаунте.
    if (!response.ok) throw new Error(response.status >= 500
      ? `Яндекс Вебмастер: временная ошибка сервиса HTTP ${response.status}. Повторите запрос позднее.`
      : `Яндекс Вебмастер: HTTP ${response.status}. Проверьте права токена, срок действия и квоту.`);
    return data;
  };
  const user = await request('/user');
  if (!Number.isSafeInteger(user.user_id) || user.user_id <= 0) throw new Error('Вебмастер не вернул user_id.');
  const prefix = `/user/${user.user_id}`;
  const { hosts } = await request(`${prefix}/hosts`);
  const host = hosts?.find((item) => item.unicode_host_url?.replace(/\/$/, '') === SITE || item.host_url?.replace(/\/$/, '') === SITE);
  if (!host?.host_id || host.verified !== true) throw new Error('У токена нет подтверждённого сайта https://znayton.ru в Вебмастере.');
  const base = `${prefix}/hosts/${encodeURIComponent(host.host_id)}/recrawl`;
  if (!validated.length) {
    const quota = await request(`${base}/quota`);
    return { site: SITE, connected: true, quota };
  }
  const results = [];
  for (const url of validated) {
    const data = await request(`${base}/queue`, { url });
    if (!data.task_id && !data.alreadyQueued) throw new Error('Яндекс не подтвердил постановку URL на переобход.');
    results.push({ url, ...data });
  }
  return { site: SITE, results };
}

const pendingFile = '.daily-blog/pending-recrawl.json';
export function readPending(file = pendingFile) {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '')).urls.map(validateUrl);
}
export function savePending(urls, file = pendingFile) {
  fs.mkdirSync('.daily-blog', { recursive: true });
  const pending = [...new Set([...readPending(file), ...urls.map(validateUrl)])];
  fs.writeFileSync(file, JSON.stringify({ urls: pending }, null, 2) + '\n', { mode: 0o600 });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  let submittedUrls = [];
  try {
    loadEnvironment();
    const args = process.argv.slice(2);
    if (!args.length || args[0] === '--help') {
      console.log('Проверка доступа: node scripts/yandex-recrawl.mjs --check\nПереобход: node scripts/yandex-recrawl.mjs --submit https://znayton.ru/blog/slug\nПовторить очередь: node scripts/yandex-recrawl.mjs --retry-pending');
    } else if (args[0] === '--validate-url' && args.length === 2) {
      console.log(validateUrl(args[1]));
    } else if (args[0] === '--enqueue' && args.length > 1) {
      savePending(args.slice(1));
      console.log('URL сохранены в локальную очередь переобхода.');
    } else if (args[0] === '--retry-pending' && args.length === 1) {
      submittedUrls = readPending();
      if (submittedUrls.length) {
        console.log(JSON.stringify(await recrawl({ token: process.env.YANDEX_WEBMASTER_TOKEN, urls: submittedUrls }), null, 2));
        const remaining = readPending().filter((url) => !submittedUrls.includes(url));
        fs.writeFileSync(pendingFile, JSON.stringify({ urls: remaining }) + '\n');
      } else console.log('Очередь переобхода пуста.');
    } else {
      if (!['--check', '--submit'].includes(args[0]) || (args[0] === '--check' && args.length !== 1) || (args[0] === '--submit' && args.length < 2)) throw new Error('Неверные аргументы. Используйте --help.');
      submittedUrls = args[0] === '--submit' ? args.slice(1).map(validateUrl) : [];
      console.log(JSON.stringify(await recrawl({ token: process.env.YANDEX_WEBMASTER_TOKEN, urls: submittedUrls }), null, 2));
      if (submittedUrls.length && fs.existsSync(pendingFile)) {
        const left = readPending().filter((url) => !submittedUrls.includes(url));
        fs.writeFileSync(pendingFile, JSON.stringify({ urls: left }, null, 2) + '\n');
      }
    }
  } catch (error) {
    if (submittedUrls.length) savePending(submittedUrls);
    console.error(error.message);
    process.exitCode = 1;
  }
}
