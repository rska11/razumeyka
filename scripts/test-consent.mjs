// Прогон логики согласия без браузера: минимальные shim'ы document/window/location.
const jar = new Map();
globalThis.location = { hostname: 'znayton.ru', protocol: 'https:' };
globalThis.document = {
  get cookie() { return [...jar].map(([k, v]) => `${k}=${v}`).join('; '); },
  set cookie(str) {
    const [pair, ...attrs] = str.split(';').map((s) => s.trim());
    const i = pair.indexOf('=');
    const name = pair.slice(0, i), value = pair.slice(i + 1);
    const expired = attrs.some((a) => /^expires=Thu, 01 Jan 1970/i.test(a));
    if (expired) jar.delete(name); else jar.set(name, value);
  },
};
const listeners = [];
globalThis.window = {
  addEventListener: (t, h) => listeners.push([t, h]),
  removeEventListener: () => {},
  dispatchEvent: (e) => listeners.filter(([t]) => t === e.type).forEach(([, h]) => h(e)),
};
globalThis.CustomEvent = class { constructor(type, init) { this.type = type; this.detail = init?.detail; } };

const c = await import(new URL('../lib/consent.ts', import.meta.url).href);

let failed = 0;
const check = (name, cond) => { if (!cond) failed++; console.log(`${cond ? 'ok  ' : 'FAIL'} ${name}`); };

check('без решения — согласия нет', c.readConsent() === null && c.hasAnalyticsConsent() === false);

// Метрика уже наставила своих cookie (эмулируем прошлый визит с согласием)
jar.set('_ym_uid', '123'); jar.set('_ym_d', '456'); jar.set('__Secure-next-auth.session-token', 'keep');

let fired = 0;
c.subscribeConsent(() => { fired++; });

c.saveConsent(true);
check('согласие сохранено', c.hasAnalyticsConsent() === true);
check('в cookie записана версия и дата', /"v":1/.test(decodeURIComponent(jar.get(c.CONSENT_COOKIE))) && /"ts":"20/.test(decodeURIComponent(jar.get(c.CONSENT_COOKIE))));
check('событие разослано', fired === 1);

c.saveConsent(false);
check('отказ сохранён', c.hasAnalyticsConsent() === false && c.readConsent().analytics === false);
check('cookie метрики удалены', !jar.has('_ym_uid') && !jar.has('_ym_d'));
check('сессия входа не тронута', jar.get('__Secure-next-auth.session-token') === 'keep');

// «протухшая» версия согласия → спрашиваем заново
jar.set(c.CONSENT_COOKIE, encodeURIComponent(JSON.stringify({ v: 0, analytics: true, ts: 'x' })));
check('старая версия согласия не засчитывается', c.readConsent() === null && c.hasAnalyticsConsent() === false);

jar.set(c.CONSENT_COOKIE, 'мусор');
check('битая cookie не ломает чтение', c.readConsent() === null);

process.exit(failed ? 1 : 0);
