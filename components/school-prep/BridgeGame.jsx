'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { reachGoal } from '@/lib/metrika';
import {
  LEVELS,
  LANE_Y,
  SLABS_PER_LEVEL,
  STEP,
  WORLD_H,
  WORLD_W,
  createGame,
  drainEvents,
  moveLane,
  selectLane,
  starsFor,
  update,
} from './bridge/engine.js';
import { draw } from './bridge/render.js';
import { playSound, setMuted, unlockAudio } from '@/components/games/audio.js';

const STORAGE_KEY = 'znayton_bridge_v1';
const FREE_LEVELS = 4;
const ASSET_SOURCES = {
  day: '/images/games/bridge/bridge-day-v2.webp',
  sunset: '/images/games/bridge/bridge-sunset-v2.webp',
  night: '/images/games/bridge/bridge-night-v2.webp',
  fox: '/images/games/bridge/bridge-fox-run-v3.webp',
};

function StarIcon({ active = true, className = 'h-5 w-5' }) {
  return (
    <svg viewBox={'0 0 24 24'} aria-hidden className={className}>
      <path
        d={'m12 2.8 2.72 5.51 6.08.89-4.4 4.28 1.04 6.05L12 16.67l-5.44 2.86 1.04-6.05L3.2 9.2l6.08-.89L12 2.8Z'}
        fill={active ? '#FFD467' : 'rgba(255,255,255,.18)'}
      />
    </svg>
  );
}

function LockIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox={'0 0 24 24'} fill={'none'} aria-hidden className={className}>
      <rect x={'5'} y={'10'} width={'14'} height={'11'} rx={'3'} stroke={'currentColor'} strokeWidth={'2'} />
      <path d={'M8 10V7a4 4 0 0 1 8 0v3'} stroke={'currentColor'} strokeWidth={'2'} strokeLinecap={'round'} />
    </svg>
  );
}

function CompassIcon({ className = 'h-7 w-7' }) {
  return (
    <svg viewBox={'0 0 32 32'} fill={'none'} aria-hidden className={className}>
      <circle cx={'16'} cy={'16'} r={'13'} fill={'rgba(98,227,255,.13)'} stroke={'#77E5FF'} strokeWidth={'2'} />
      <path d={'m20.7 10.4-3.1 7.2-6.3 4 3.1-7.2 6.3-4Z'} fill={'#FFD467'} stroke={'#fff'} strokeWidth={'1.4'} strokeLinejoin={'round'} />
    </svg>
  );
}

function SoundIcon({ on }) {
  return (
    <svg viewBox={'0 0 24 24'} fill={'none'} aria-hidden className={'h-5 w-5'}>
      <path d={'M4 10v4h4l5 4V6L8 10H4Z'} fill={'currentColor'} />
      {on ? (
        <path d={'M16 9a5 5 0 0 1 0 6M18.5 6.5a8.5 8.5 0 0 1 0 11'} stroke={'currentColor'} strokeWidth={'1.8'} strokeLinecap={'round'} />
      ) : (
        <path d={'m17 9 5 6m0-6-5 6'} stroke={'currentColor'} strokeWidth={'1.8'} strokeLinecap={'round'} />
      )}
    </svg>
  );
}

function Stars({ count, large = false }) {
  return (
    <span className={'inline-flex gap-1'} aria-label={`Звёзд: ${count} из 3`}>
      {[1, 2, 3].map((number) => (
        <StarIcon key={number} active={number <= count} className={large ? 'h-10 w-10' : 'h-5 w-5'} />
      ))}
    </span>
  );
}

function DotsClue({ count }) {
  return (
    <span className={'grid grid-cols-5 gap-2 rounded-[20px] border border-[#77E5FF]/20 bg-[#77E5FF]/10 px-4 py-3'} aria-label={`Точек: ${count}`}>
      {Array.from({ length: count }).map((_, index) => (
        <span key={index} className={'h-3.5 w-3.5 rounded-full bg-[#FFD467] shadow-[0_0_14px_rgba(255,212,103,.7)] sm:h-4 sm:w-4'} />
      ))}
    </span>
  );
}

function preloadAssets(target) {
  const cleanups = [];
  for (const [key, src] of Object.entries(ASSET_SOURCES)) {
    const image = new window.Image();
    image.decoding = 'async';
    image.src = src;
    image.onload = () => {
      target.current[key] = image;
    };
    cleanups.push(() => {
      image.onload = null;
    });
  }
  return () => cleanups.forEach((cleanup) => cleanup());
}

export function BridgeGame({ hasAccess = false, onExit }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const mapRef = useRef(null);
  const gameRef = useRef(null);
  const assetsRef = useRef({});
  const pausedRef = useRef(false);
  const pointerRef = useRef(null);

  const [ready, setReady] = useState(false);
  const [stars, setStars] = useState({});
  const [view, setView] = useState('map');
  const [levelIndex, setLevelIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [result, setResult] = useState(null);
  const [hud, setHud] = useState({ challenge: null, collected: 0, misses: 0, hint: false, feedback: null, lane: 1 });

  const level = LEVELS[levelIndex] || LEVELS[0];

  useEffect(() => preloadAssets(assetsRef), []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && parsed.stars) setStars(parsed.stars);
        if (parsed && typeof parsed.soundOn === 'boolean') setSoundOn(parsed.soundOn);
      }
    } catch {
      // The game remains usable when storage is unavailable.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ stars, soundOn }));
    } catch {
      // Private mode can block storage; progress then lives only in this session.
    }
  }, [ready, stars, soundOn]);

  useEffect(() => setMuted(!soundOn), [soundOn]);
  useEffect(() => {
    if (view !== 'map' || !mapRef.current) return undefined;
    const frame = window.requestAnimationFrame(() => mapRef.current?.scrollTo({ top: 0, behavior: 'instant' }));
    return () => window.cancelAnimationFrame(frame);
  }, [view]);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const syncHud = useCallback((game) => {
    const feedback = game.feedback
      ? { kind: game.feedback.kind, title: game.feedback.title, detail: game.feedback.detail }
      : null;
    setHud((previous) => {
      const same =
        previous.challenge?.id === game.challenge?.id &&
        previous.collected === game.collected &&
        previous.misses === game.misses &&
        previous.hint === game.hint &&
        previous.lane === game.fox.lane &&
        previous.feedback?.kind === feedback?.kind &&
        previous.feedback?.detail === feedback?.detail;
      if (same) return previous;
      return { challenge: game.challenge, collected: game.collected, misses: game.misses, hint: game.hint, feedback, lane: game.fox.lane };
    });
  }, []);

  const finishLevel = useCallback((game) => {
    const earned = starsFor(game.misses);
    const id = game.level.id;
    setStars((previous) => (previous[id] >= earned ? previous : { ...previous, [id]: earned }));
    setResult({ id, earned, misses: game.misses, bestStreak: game.bestStreak });
    setView('win');
    reachGoal('prep_game_level', { level: id, stars: earned });
  }, []);

  const startLevel = useCallback((index) => {
    unlockAudio();
    setLevelIndex(index);
    setPaused(false);
    setResult(null);
    setView('play');
    reachGoal('prep_game_start', { level: LEVELS[index]?.id ?? index + 1 });
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
    setHud({ challenge: game.challenge, collected: 0, misses: 0, hint: false, feedback: null, lane: 1 });

    const camera = { scale: 1, dx: 0, dy: 0 };
    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      const cssScale = Math.min(rect.width / WORLD_W, rect.height / WORLD_H);
      camera.scale = cssScale * dpr;
      camera.dx = ((rect.width - WORLD_W * cssScale) / 2) * dpr;
      camera.dy = ((rect.height - WORLD_H * cssScale) / 2) * dpr;
    };

    const observer = new ResizeObserver(resize);
    observer.observe(wrap);
    resize();

    let raf = 0;
    let last = performance.now();
    let accumulator = 0;
    let finishAt = 0;
    const frame = (now) => {
      raf = window.requestAnimationFrame(frame);
      const dt = Math.min(0.25, (now - last) / 1000);
      last = now;
      if (!pausedRef.current) {
        accumulator += dt;
        let guard = 0;
        while (accumulator >= STEP && guard < 6) {
          update(game, STEP);
          accumulator -= STEP;
          guard += 1;
        }
        if (accumulator > STEP) accumulator = 0;
        const events = drainEvents(game);
        if (events) {
          for (const name of events) {
            if (name === 'done') {
              playSound('done');
              finishAt = now + 1450;
            } else {
              playSound(name);
            }
          }
        }
        syncHud(game);
        if (finishAt && now >= finishAt) {
          finishAt = 0;
          finishLevel(game);
        }
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(camera.scale, 0, 0, camera.scale, camera.dx, camera.dy);
      draw(ctx, game, assetsRef.current);
    };
    raf = window.requestAnimationFrame(frame);

    return () => {
      window.cancelAnimationFrame(raf);
      observer.disconnect();
      gameRef.current = null;
    };
  }, [view, levelIndex, syncHud, finishLevel]);

  const shiftLane = useCallback((direction) => {
    const game = gameRef.current;
    if (!game || pausedRef.current) return;
    moveLane(game, direction);
  }, []);

  const chooseLane = useCallback((lane) => {
    const game = gameRef.current;
    if (!game || pausedRef.current) return;
    selectLane(game, lane);
  }, []);

  useEffect(() => {
    if (view !== 'play') return undefined;
    const onKey = (event) => {
      if (event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W') {
        event.preventDefault();
        shiftLane(-1);
      } else if (event.key === 'ArrowDown' || event.key === 's' || event.key === 'S') {
        event.preventDefault();
        shiftLane(1);
      } else if (event.key === '1' || event.key === '2' || event.key === '3') {
        event.preventDefault();
        chooseLane(Number(event.key) - 1);
      } else if (event.key === ' ') {
        event.preventDefault();
        setPaused((value) => !value);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [view, shiftLane, chooseLane]);

  useEffect(() => {
    if (view !== 'play') return undefined;
    const pauseWhenHidden = () => {
      if (document.hidden) setPaused(true);
    };
    document.addEventListener('visibilitychange', pauseWhenHidden);
    window.addEventListener('blur', pauseWhenHidden);
    return () => {
      document.removeEventListener('visibilitychange', pauseWhenHidden);
      window.removeEventListener('blur', pauseWhenHidden);
    };
  }, [view]);

  function handlePointerDown(event) {
    pointerRef.current = { y: event.clientY };
    unlockAudio();
  }

  function handlePointerUp(event) {
    const start = pointerRef.current;
    pointerRef.current = null;
    if (!start || paused) return;
    const delta = event.clientY - start.y;
    if (Math.abs(delta) > 34) {
      shiftLane(delta < 0 ? -1 : 1);
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const scale = Math.min(rect.width / WORLD_W, rect.height / WORLD_H);
    const offsetY = (rect.height - WORLD_H * scale) / 2;
    const worldY = (event.clientY - rect.top - offsetY) / scale;
    let nearest = 0;
    for (let index = 1; index < LANE_Y.length; index += 1) {
      if (Math.abs(LANE_Y[index] - worldY) < Math.abs(LANE_Y[nearest] - worldY)) nearest = index;
    }
    chooseLane(nearest);
  }

  if (view === 'map') {
    const total = Object.values(stars).reduce((sum, count) => sum + count, 0);
    const maxStars = LEVELS.length * 3;
    const completed = LEVELS.filter((item) => (stars[item.id] || 0) > 0).length;
    return (
      <div ref={mapRef} className={'flex h-full flex-col overflow-y-auto text-white'}>
        <div className={'relative shrink-0 overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(135deg,#101F48_0%,#172659_54%,#321F57_100%)] p-5 sm:p-7'}>
          <div className={'pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#77E5FF]/14 blur-3xl'} />
          <div className={'relative flex flex-wrap items-end justify-between gap-5'}>
            <div className={'max-w-2xl'}>
              <span className={'inline-flex rounded-full border border-[#77E5FF]/25 bg-[#77E5FF]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.16em] text-[#8BEAFF]'}>
                Экспедиция по математической реке
              </span>
              <h3 className={'mt-3 font-display text-3xl font-black tracking-[-.04em] sm:text-5xl'}>Мост через реку</h3>
              <p className={'mt-3 text-sm font-semibold leading-6 text-white/65 sm:text-base'}>
                Здесь уже нельзя просто узнать нужную цифру. Ребёнок восстанавливает ряды, ищет соседей числа,
                сравнивает, складывает и вычитает — а верный ответ становится новым звеном моста.
              </p>
            </div>
            <div className={'grid min-w-[210px] grid-cols-2 gap-2'}>
              <div className={'rounded-[20px] border border-white/10 bg-white/[.07] p-3'}>
                <p className={'text-[10px] font-black uppercase tracking-[.12em] text-white/42'}>Миссии</p>
                <p className={'mt-1 font-display text-2xl font-black'}>{completed}<span className={'text-white/35'}>/{LEVELS.length}</span></p>
              </div>
              <div className={'rounded-[20px] border border-white/10 bg-white/[.07] p-3'}>
                <p className={'text-[10px] font-black uppercase tracking-[.12em] text-white/42'}>Звёзды</p>
                <p className={'mt-1 font-display text-2xl font-black'}>{ready ? total : 0}<span className={'text-white/35'}>/{maxStars}</span></p>
              </div>
            </div>
          </div>
          <div className={'relative mt-5 h-3 overflow-hidden rounded-full bg-white/10'}>
            <div className={'h-full rounded-full bg-gradient-to-r from-[#77E5FF] via-[#7EF0C4] to-[#FFD467] transition-all duration-500'} style={{ width: `${(completed / LEVELS.length) * 100}%` }} />
          </div>
        </div>

        <div className={'mt-5 grid shrink-0 gap-3 sm:grid-cols-2'}>
          {LEVELS.map((item, index) => {
            const paywalled = index + 1 > FREE_LEVELS && !hasAccess;
            const previousDone = index === 0 || (stars[LEVELS[index - 1].id] || 0) > 0;
            const locked = paywalled || !previousDone;
            const earned = stars[item.id] || 0;
            const tone = item.scene === 'night' ? 'from-[#27214F] to-[#151E46]' : item.scene === 'sunset' ? 'from-[#402652] to-[#1C2B55]' : 'from-[#173A62] to-[#15264E]';
            return (
              <button
                key={item.id}
                type={'button'}
                onClick={() => (locked ? null : startLevel(index))}
                disabled={locked}
                className={`group relative min-h-[170px] overflow-hidden rounded-[26px] border p-5 text-left transition ${locked ? 'cursor-not-allowed border-white/8 bg-white/[.035] text-white/42' : `border-white/12 bg-gradient-to-br ${tone} text-white hover:-translate-y-1 hover:border-[#77E5FF]/45 hover:shadow-[0_18px_45px_rgba(5,16,44,.3)]`}`}
              >
                <div className={'flex items-start justify-between gap-3'}>
                  <span className={'inline-flex items-center gap-2 rounded-full bg-white/[.08] px-3 py-1.5 text-[10px] font-black uppercase tracking-[.12em]'}>
                    {locked && <LockIcon />}
                    {item.act} · {item.id}
                  </span>
                  {!locked && <Stars count={earned} />}
                </div>
                <p className={'mt-4 font-display text-xl font-black leading-tight'}>{item.title}</p>
                <p className={'mt-2 text-xs font-semibold leading-5 text-white/58'}>{item.note}</p>
                <div className={'mt-4 flex items-center justify-between gap-3'}>
                  <span className={'rounded-full bg-[#77E5FF]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.1em] text-[#8BEAFF]'}>{item.skill}</span>
                  {!locked && <span className={'text-sm font-black text-[#FFD467] transition group-hover:translate-x-1'}>Начать →</span>}
                </div>
                {paywalled && <p className={'mt-3 text-xs font-bold text-[#FFD467]'}>Открывается вместе с курсом</p>}
                {!paywalled && !previousDone && <p className={'mt-3 text-xs font-bold text-white/44'}>Сначала завершите миссию {LEVELS[index - 1].id}</p>}
              </button>
            );
          })}
        </div>

        <div className={'mt-5 flex shrink-0 flex-wrap items-center justify-between gap-3'}>
          <button type={'button'} onClick={() => setSoundOn((value) => !value)} className={'inline-flex min-h-[46px] items-center gap-2 rounded-full border border-white/14 px-4 text-xs font-black text-white/70 transition hover:border-white/30'}>
            <SoundIcon on={soundOn} /> {soundOn ? 'Звук включён' : 'Звук выключен'}
          </button>
          {onExit && <button type={'button'} onClick={onExit} className={'min-h-[46px] rounded-full bg-white/10 px-5 text-xs font-black transition hover:bg-white/16'}>Закрыть игру</button>}
        </div>
      </div>
    );
  }

  if (view === 'win') {
    const earned = result?.earned || 3;
    const nextIndex = levelIndex + 1;
    const hasNext = nextIndex < LEVELS.length;
    const nextLocked = nextIndex + 1 > FREE_LEVELS && !hasAccess;
    return (
      <div className={'flex h-full flex-col items-center justify-center gap-4 text-center text-white'}>
        <span className={'flex h-20 w-20 items-center justify-center rounded-[28px] border border-[#77E5FF]/25 bg-[#77E5FF]/10'}><CompassIcon className={'h-12 w-12'} /></span>
        <p className={'text-xs font-black uppercase tracking-[.16em] text-[#8BEAFF]'}>Миссия {level.id} завершена</p>
        <h3 className={'font-display text-3xl font-black tracking-[-.04em] sm:text-5xl'}>Пролёт моста построен</h3>
        <Stars count={earned} large />
        <p className={'max-w-lg text-sm font-semibold leading-6 text-white/62'}>
          {earned === 3 ? 'Все задачи решены точно. Новый навык закреплён без подсказок.' : earned === 2 ? 'Сильное прохождение. Ещё одна попытка поможет взять три звезды.' : 'Миссия выполнена. Повтори её спокойно — объяснения уже показали сложные места.'}
        </p>
        <div className={'mt-2 flex flex-wrap items-center justify-center gap-2'}>
          {hasNext && !nextLocked && <button type={'button'} onClick={() => startLevel(nextIndex)} className={'min-h-[54px] rounded-full bg-[#77E5FF] px-7 text-sm font-black text-[#0A1838] transition hover:-translate-y-0.5'}>Следующая миссия →</button>}
          {hasNext && nextLocked && <a href={'#podpiska'} onClick={onExit} className={'inline-flex min-h-[54px] items-center rounded-full bg-[#77E5FF] px-7 text-sm font-black text-[#0A1838]'}>Открыть полную экспедицию →</a>}
          <button type={'button'} onClick={() => startLevel(levelIndex)} className={'min-h-[54px] rounded-full border border-white/16 px-6 text-sm font-black transition hover:border-white/35'}>Пройти ещё раз</button>
          <button type={'button'} onClick={() => setView('map')} className={'min-h-[54px] rounded-full border border-white/16 px-6 text-sm font-black transition hover:border-white/35'}>К миссиям</button>
        </div>
      </div>
    );
  }

  const predictedStars = starsFor(hud.misses);
  return (
    <div className={'flex h-full flex-col gap-3 text-white'}>
      <div className={'flex flex-wrap items-center justify-between gap-2'}>
        <div className={'flex min-w-0 items-center gap-3'}>
          <button type={'button'} onClick={() => setView('map')} aria-label={'К карте миссий'} className={'flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/18 text-lg font-black transition hover:border-white/40'}>←</button>
          <div className={'min-w-0'}>
            <p className={'truncate font-display text-base font-black sm:text-lg'}>{level.title}</p>
            <p className={'truncate text-[11px] font-bold text-white/48'}>Миссия {level.id} · {level.skill}</p>
          </div>
        </div>
        <div className={'flex items-center gap-2'}>
          <div className={'hidden items-center gap-1 rounded-full bg-white/[.08] px-3 py-2 sm:flex'}><Stars count={predictedStars} /></div>
          <button type={'button'} onClick={() => setPaused((value) => !value)} aria-label={paused ? 'Продолжить' : 'Пауза'} className={'flex h-11 min-w-11 items-center justify-center rounded-full border border-white/18 px-3 text-base font-black transition hover:border-white/40'}>{paused ? '▶' : 'Ⅱ'}</button>
          <button type={'button'} onClick={() => setSoundOn((value) => !value)} aria-label={soundOn ? 'Выключить звук' : 'Включить звук'} className={'flex h-11 w-11 items-center justify-center rounded-full border border-white/18 transition hover:border-white/40'}><SoundIcon on={soundOn} /></button>
        </div>
      </div>

      <div className={'grid gap-3 rounded-[24px] border border-[#77E5FF]/16 bg-[linear-gradient(135deg,rgba(119,229,255,.11),rgba(255,255,255,.055))] p-4 sm:grid-cols-[1fr_auto] sm:items-center sm:p-5'}>
        <div>
          <p className={'text-[10px] font-black uppercase tracking-[.18em] text-[#8BEAFF]'}>{hud.challenge?.label || 'Задание моста'}</p>
          <p className={'mt-1.5 font-display text-2xl font-black leading-tight tracking-[-.025em] sm:text-3xl'}>{hud.challenge?.prompt || 'Готовим маршрут…'}</p>
          <p className={'mt-2 text-xs font-bold text-white/52'}>{hud.hint ? 'Подсказка включена: верный камень светится золотым.' : 'Выбери ответ на одном из трёх камней. Сам ответ заранее не показывается.'}</p>
        </div>
        {hud.challenge?.visual?.type === 'dots' && <DotsClue count={hud.challenge.visual.count} />}
      </div>

      <div className={'flex items-center gap-3 rounded-[18px] bg-white/[.065] px-4 py-2.5'}>
        <CompassIcon className={'h-6 w-6 shrink-0'} />
        <div className={'flex flex-1 items-center gap-1.5'} aria-hidden>
          {Array.from({ length: SLABS_PER_LEVEL }).map((_, index) => <span key={index} className={`h-2.5 flex-1 rounded-full transition ${index < hud.collected ? 'bg-gradient-to-r from-[#77E5FF] to-[#7EF0C4]' : 'bg-white/13'}`} />)}
        </div>
        <span className={'font-display text-lg font-black'}>{hud.collected}<span className={'text-white/40'}>/{SLABS_PER_LEVEL}</span></span>
      </div>

      <div
        ref={wrapRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => { pointerRef.current = null; }}
        className={'relative aspect-video min-h-0 w-full flex-none cursor-pointer overflow-hidden rounded-[26px] border border-white/10 bg-[#0B1635] sm:aspect-auto sm:min-h-[430px] sm:flex-1'}
        style={{ touchAction: 'none' }}
      >
        <canvas ref={canvasRef} className={'h-full w-full'} />
        <div className={'pointer-events-none absolute inset-x-0 top-0 flex justify-center p-3'}>
          <span className={'rounded-full border border-white/15 bg-[#07142E]/76 px-4 py-2 text-[10px] font-black uppercase tracking-[.12em] text-white/78 shadow-lg backdrop-blur-md'}>
            Тапни прямо по дорожке с ответом · клавиши 1, 2, 3
          </span>
        </div>

        {hud.feedback && (
          <div className={`pointer-events-none absolute bottom-4 left-1/2 w-[min(92%,560px)] -translate-x-1/2 rounded-[22px] border px-5 py-4 text-center shadow-2xl backdrop-blur-xl ${hud.feedback.kind === 'bad' ? 'border-[#FF8A90]/55 bg-[#421D33]/92' : hud.feedback.kind === 'bonus' ? 'border-[#FFD467]/55 bg-[#3B321C]/92' : 'border-[#7EF0C4]/55 bg-[#113C3B]/92'}`} aria-live={'polite'}>
            <p className={'font-display text-lg font-black'}>{hud.feedback.title}</p>
            <p className={'mt-1 text-xs font-bold leading-5 text-white/78'}>{hud.feedback.detail}</p>
          </div>
        )}

        {paused && (
          <div className={'absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#07142E]/92 backdrop-blur-sm'}>
            <p className={'font-display text-3xl font-black'}>Пауза</p>
            <button type={'button'} onClick={() => setPaused(false)} className={'min-h-[52px] rounded-full bg-[#77E5FF] px-7 text-sm font-black text-[#0A1838]'}>Продолжить</button>
          </div>
        )}
      </div>

      <div className={'grid shrink-0 grid-cols-3 gap-2 sm:hidden'}>
        {['Верх', 'Середина', 'Низ'].map((label, index) => (
          <button key={label} type={'button'} onClick={() => { unlockAudio(); chooseLane(index); }} aria-pressed={hud.lane === index} className={`min-h-[58px] rounded-[18px] border text-xs font-black transition ${hud.lane === index ? 'border-[#77E5FF] bg-[#77E5FF] text-[#0A1838]' : 'border-white/16 bg-white/[.07] text-white'}`}>{index + 1}<span className={'mt-0.5 block text-[9px] uppercase tracking-[.08em] opacity-70'}>{label}</span></button>
        ))}
      </div>

      <div className={'flex items-center justify-between gap-3 text-[11px] font-bold text-white/45'}>
        <span>Промахи: {hud.misses} · игра не обрывается</span>
        <span>{hud.hint ? 'Золотое свечение показывает ответ' : 'Сложность растёт через задачи, не через спешку'}</span>
      </div>
    </div>
  );
}