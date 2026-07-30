'use client';

// Оболочка игры «Светлячок»: канвас, цикл кадров, ведение пальцем или мышью.
// Правила — в ./firefly/engine.js, рисование — в ./firefly/render.js.
//
// Отличие от «Моста»: здесь важны координаты указателя, поэтому экранные
// координаты переводятся в координаты игрового мира через ту же камеру,
// которой рисуется сцена. Без этого линия «уезжает» на других экранах.

import { useCallback, useEffect, useRef, useState } from 'react';
import { reachGoal } from '@/lib/metrika';
import {
  LEVELS,
  STEP,
  WORLD_H,
  WORLD_W,
  accuracy,
  createGame,
  drainEvents,
  progress,
  setPointer,
  setPointerType,
  starsFor,
  update,
} from './firefly/engine.js';
import { draw } from './firefly/render.js';
import { playSound, setMuted, unlockAudio } from '@/components/games/audio.js';

const STORAGE_KEY = 'znayton_firefly_v1';
const FREE_LEVELS = 4;

function Stars({ count, size }) {
  return (
    <span className={'inline-flex gap-1 ' + (size === 'lg' ? 'text-3xl' : 'text-lg')} aria-label={'Звёзд: ' + count + ' из 3'}>
      {[1, 2, 3].map((n) => (
        <span key={n} className={n <= count ? 'text-brand-yellow' : 'text-white/22'} aria-hidden>
          ★
        </span>
      ))}
    </span>
  );
}

export function FireflyGame({ hasAccess = false, onExit }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const gameRef = useRef(null);
  const cameraRef = useRef({ scale: 1, dx: 0, dy: 0 });
  const pausedRef = useRef(false);

  const [ready, setReady] = useState(false);
  const [stars, setStars] = useState({});
  const [view, setView] = useState('map');
  const [levelIndex, setLevelIndex] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [result, setResult] = useState(null);
  const [hud, setHud] = useState({ energy: 1, done: 0, lit: false });

  const level = LEVELS[levelIndex] || LEVELS[0];

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.stars) setStars(parsed.stars);
        if (parsed && typeof parsed.soundOn === 'boolean') setSoundOn(parsed.soundOn);
      }
    } catch {
      // недоступный localStorage не должен ломать игру
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ stars, soundOn }));
    } catch {
      // приватный режим — прогресс просто не сохранится
    }
  }, [ready, stars, soundOn]);

  useEffect(() => {
    setMuted(!soundOn);
  }, [soundOn]);

  const syncHud = useCallback((game) => {
    const energy = game.energy / game.maxEnergy;
    const done = progress(game);
    setHud((prev) => {
      if (Math.abs(prev.energy - energy) < 0.01 && Math.abs(prev.done - done) < 0.01 && prev.lit === game.lit) {
        return prev;
      }
      return { energy, done, lit: game.lit };
    });
  }, []);

  const finishLevel = useCallback((game) => {
    const exact = accuracy(game);
    const earned = game.status === 'done' ? starsFor(exact) : 0;
    const id = game.level.id;
    if (earned > 0) {
      setStars((prev) => (prev[id] >= earned ? prev : { ...prev, [id]: earned }));
    }
    setResult({ id, earned, accuracy: Math.round(exact * 100), tired: game.status === 'tired' });
    setView('win');
    reachGoal('prep_firefly_level', { level: id, stars: earned });
  }, []);

  const startLevel = useCallback((index) => {
    unlockAudio();
    setLevelIndex(index);
    setResult(null);
    setView('play');
    reachGoal('prep_firefly_start', { level: LEVELS[index]?.id ?? index + 1 });
  }, []);

  useEffect(() => {
    if (view !== 'play') return undefined;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const game = createGame(levelIndex);
    gameRef.current = game;
    setHud({ energy: 1, done: 0, lit: false });

    const camera = cameraRef.current;
    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      camera.scale = Math.min(rect.width / WORLD_W, rect.height / WORLD_H);
      camera.dx = (rect.width - WORLD_W * camera.scale) / 2;
      camera.dy = (rect.height - WORLD_H * camera.scale) / 2;
      camera.dpr = dpr;
    };

    const observer = new ResizeObserver(resize);
    observer.observe(wrap);
    resize();

    let raf = 0;
    let last = performance.now();
    let acc = 0;
    let finishAt = 0;

    const frame = (now) => {
      raf = window.requestAnimationFrame(frame);
      const dt = Math.min(0.25, (now - last) / 1000);
      last = now;

      if (!pausedRef.current) {
        acc += dt;
        let guard = 0;
        while (acc >= STEP && guard < 6) {
          update(game, STEP);
          acc -= STEP;
          guard += 1;
        }
        if (acc > STEP) acc = 0;

        const events = drainEvents(game);
        if (events) {
          for (const name of events) {
            if (name === 'sparkle') playSound('sparkle');
            else if (name === 'lost') playSound('lost');
            else if (name === 'done') {
              playSound('done');
              finishAt = now + 1100;
            } else if (name === 'tired') {
              playSound('miss');
              finishAt = now + 900;
            }
          }
        }
        syncHud(game);
        if (finishAt && now >= finishAt) {
          finishAt = 0;
          finishLevel(game);
        }
      }

      const dpr = camera.dpr || 1;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(camera.scale * dpr, 0, 0, camera.scale * dpr, camera.dx * dpr, camera.dy * dpr);
      draw(ctx, game);
    };

    raf = window.requestAnimationFrame(frame);

    return () => {
      window.cancelAnimationFrame(raf);
      observer.disconnect();
      gameRef.current = null;
    };
  }, [view, levelIndex, syncHud, finishLevel]);

  useEffect(() => {
    if (view !== 'play') return undefined;
    const onHidden = () => {
      // Уход со вкладки не должен «тушить фонарик»: просто отпускаем указатель.
      const game = gameRef.current;
      if (game && document.hidden) setPointer(game, game.pointer.x, game.pointer.y, false);
    };
    document.addEventListener('visibilitychange', onHidden);
    return () => document.removeEventListener('visibilitychange', onHidden);
  }, [view]);

  function toWorld(event) {
    const wrap = wrapRef.current;
    const camera = cameraRef.current;
    if (!wrap) return { x: 0, y: 0 };
    const rect = wrap.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left - camera.dx) / camera.scale,
      y: (event.clientY - rect.top - camera.dy) / camera.scale,
    };
  }

  function handlePointerDown(event) {
    const game = gameRef.current;
    if (!game) return;
    unlockAudio();
    try {
      event.currentTarget.setPointerCapture?.(event.pointerId);
    } catch {
      // захват необязателен — без него ведение тоже работает
    }
    if (event.pointerType === 'mouse') setPointerType(game, 'mouse');
    const point = toWorld(event);
    setPointer(game, point.x, point.y, true);
  }

  function handlePointerMove(event) {
    const game = gameRef.current;
    if (!game) return;
    const point = toWorld(event);
    setPointer(game, point.x, point.y, game.holding);
  }

  function handlePointerUp(event) {
    const game = gameRef.current;
    if (!game) return;
    const point = toWorld(event);
    setPointer(game, point.x, point.y, false);
  }

  // ── Карта уровней ──────────────────────────────────────────────────────────
  if (view === 'map') {
    const total = Object.values(stars).reduce((sum, n) => sum + n, 0);
    const maxStars = LEVELS.length * 3;
    return (
      <div className={'flex h-full flex-col gap-5 overflow-y-auto'}>
        <div className={'flex flex-wrap items-end justify-between gap-4'}>
          <div>
            <span className={'text-[10px] font-extrabold uppercase tracking-[0.18em] text-brand-cyan'}>
              Игра · бесплатно · без регистрации
            </span>
            <h3 className={'mt-2 font-display text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl'}>
              Светлячок
            </h3>
            <p className={'mt-2 max-w-xl text-sm font-semibold leading-6 text-white/62'}>
              Веди светлячка по светящейся дорожке до домика. Сошёл с дорожки — фонарик гаснет.
              Лучше всего пальцем на планшете или телефоне, мышью тоже можно.
            </p>
          </div>
          <div className={'text-right'}>
            <p className={'text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/45'}>Звёзды</p>
            <p className={'font-display text-2xl font-extrabold text-white'}>
              {ready ? total : 0} <span className={'text-white/45'}>/ {maxStars}</span>
            </p>
          </div>
        </div>

        <div className={'grid gap-3 sm:grid-cols-2 lg:grid-cols-4'}>
          {LEVELS.map((item, index) => {
            const paywalled = index + 1 > FREE_LEVELS && !hasAccess;
            const previousDone = index === 0 || (stars[LEVELS[index - 1].id] || 0) > 0;
            const locked = paywalled || !previousDone;
            const earned = stars[item.id] || 0;
            return (
              <button
                key={item.id}
                type={'button'}
                onClick={() => (locked ? null : startLevel(index))}
                disabled={locked}
                className={
                  'rounded-[22px] border p-4 text-left transition ' +
                  (locked
                    ? 'cursor-not-allowed border-white/10 bg-white/[0.04] text-white/45'
                    : 'border-white/16 bg-white/[0.08] text-white hover:-translate-y-0.5 hover:border-brand-cyan/60')
                }
              >
                <div className={'flex items-center justify-between gap-2'}>
                  <span className={'font-display text-base font-extrabold'}>
                    {locked ? '🔒 ' : ''}Дорожка {item.id}
                  </span>
                  {!locked && <Stars count={earned} />}
                </div>
                <p className={'mt-2 font-display text-sm font-extrabold'}>{item.title}</p>
                <p className={'mt-1 text-xs font-semibold leading-5 text-white/60'}>{item.note}</p>
                {paywalled && <p className={'mt-2 text-xs font-bold text-brand-yellow'}>Открывается с курсом</p>}
                {!paywalled && !previousDone && (
                  <p className={'mt-2 text-xs font-bold text-white/50'}>Сначала дорожка {LEVELS[index - 1].id}</p>
                )}
              </button>
            );
          })}
        </div>

        <div className={'mt-auto flex flex-wrap items-center justify-between gap-3 pt-2'}>
          <button
            type={'button'}
            onClick={() => setSoundOn((value) => !value)}
            aria-pressed={soundOn}
            className={'rounded-full border border-white/16 px-4 py-2 text-xs font-extrabold text-white/70 transition hover:border-white/30'}
          >
            {soundOn ? '🔊 Звук включён' : '🔇 Без звука'}
          </button>
          {onExit && (
            <button
              type={'button'}
              onClick={onExit}
              className={'rounded-full bg-white/10 px-5 py-2 text-xs font-extrabold text-white transition hover:bg-white/16'}
            >
              Закрыть игру
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Итог ───────────────────────────────────────────────────────────────────
  if (view === 'win') {
    const tired = result ? result.tired : false;
    const earned = result ? result.earned : 0;
    const nextIndex = levelIndex + 1;
    const hasNext = nextIndex < LEVELS.length;
    const nextLocked = nextIndex + 1 > FREE_LEVELS && !hasAccess;
    return (
      <div className={'flex h-full flex-col items-center justify-center gap-4 text-center'}>
        <p className={'text-5xl'} aria-hidden>
          {tired ? '🌙' : '🏠'}
        </p>
        <h3 className={'font-display text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl'}>
          {tired ? 'Светлячок устал' : 'Светлячок дома!'}
        </h3>
        {!tired && <Stars count={earned} size={'lg'} />}
        <p className={'max-w-md text-sm font-semibold leading-6 text-white/62'}>
          {tired
            ? 'Фонарик погас по дороге. Попробуй ещё раз — держись середины дорожки, так фонарик тратится медленнее.'
            : 'На дорожке ты был ' + (result ? result.accuracy : 0) + '% пути. ' +
              (earned === 3 ? 'Рука ведёт линию уверенно!' : 'Пройди ровнее — и будет три звезды.')}
        </p>
        <div className={'mt-2 flex flex-wrap items-center justify-center gap-2'}>
          {!tired && hasNext && !nextLocked && (
            <button
              type={'button'}
              onClick={() => startLevel(nextIndex)}
              className={'min-h-[52px] rounded-full bg-brand-cyan px-6 text-sm font-extrabold text-[#0A1226] transition hover:-translate-y-0.5'}
            >
              Дорожка {LEVELS[nextIndex].id} →
            </button>
          )}
          {!tired && hasNext && nextLocked && (
            <a
              href={'#podpiska'}
              onClick={onExit}
              className={'inline-flex min-h-[52px] items-center rounded-full bg-brand-cyan px-6 text-sm font-extrabold text-[#0A1226]'}
            >
              Открыть остальные дорожки →
            </a>
          )}
          <button
            type={'button'}
            onClick={() => startLevel(levelIndex)}
            className={'min-h-[52px] rounded-full border border-white/16 px-6 text-sm font-extrabold text-white transition hover:border-white/32'}
          >
            Ещё раз
          </button>
          <button
            type={'button'}
            onClick={() => setView('map')}
            className={'min-h-[52px] rounded-full border border-white/16 px-6 text-sm font-extrabold text-white transition hover:border-white/32'}
          >
            К дорожкам
          </button>
        </div>
      </div>
    );
  }

  // ── Игра ───────────────────────────────────────────────────────────────────
  return (
    <div className={'flex h-full flex-col gap-3'}>
      <div className={'flex flex-wrap items-center justify-between gap-2'}>
        <div className={'flex items-center gap-3'}>
          <button
            type={'button'}
            onClick={() => setView('map')}
            aria-label={'Вернуться к выбору дорожки'}
            className={'rounded-full border border-white/20 px-4 py-2 text-base font-extrabold text-white transition hover:border-white/40'}
          >
            ←
          </button>
          <div>
            <p className={'font-display text-base font-extrabold text-white'}>{level.title}</p>
            <p className={'text-[11px] font-bold text-white/50'}>{level.note}</p>
          </div>
        </div>
        <button
          type={'button'}
          onClick={() => setSoundOn((value) => !value)}
          aria-pressed={soundOn}
          aria-label={soundOn ? 'Выключить звук' : 'Включить звук'}
          className={'rounded-full border border-white/20 px-4 py-2 text-lg leading-none text-white transition hover:border-white/40'}
        >
          {soundOn ? '🔊' : '🔇'}
        </button>
      </div>

      <div className={'flex items-center gap-3 rounded-[20px] bg-white/[0.08] px-4 py-3'}>
        <span className={'text-2xl leading-none'} aria-hidden>
          {hud.lit ? '💡' : '🌑'}
        </span>
        <div className={'h-4 flex-1 overflow-hidden rounded-full bg-white/15'} aria-label={'Заряд фонарика'}>
          <div
            className={'h-full rounded-full transition-[width] duration-150'}
            style={{
              width: Math.max(0, Math.round(hud.energy * 100)) + '%',
              backgroundColor: hud.energy > 0.3 ? '#FFD873' : '#FF7A45',
            }}
          />
        </div>
        <span className={'text-2xl leading-none'} aria-hidden>
          🏠
        </span>
        <span className={'font-display text-lg font-extrabold text-white'}>{Math.round(hud.done * 100)}%</span>
      </div>

      <div
        ref={wrapRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={'relative min-h-0 w-full flex-1 cursor-crosshair overflow-hidden rounded-[24px]'}
        style={{ touchAction: 'none', background: '#0B1030' }}
      >
        <canvas ref={canvasRef} className={'h-full w-full'} />
      </div>

      <p className={'shrink-0 text-center text-xs font-bold text-white/55'} aria-live={'polite'}>
        Нажми на светлячка и веди его по дорожке до домика, не отрывая палец
      </p>
    </div>
  );
}
