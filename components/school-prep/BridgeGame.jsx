'use client';

// Оболочка мини-игры «Мост через реку»: канвас, игровой цикл, ввод и экраны.
// Вся логика правил живёт в ./bridge/engine.js, вся отрисовка — в ./bridge/render.js.
// Здесь только то, что действительно относится к браузеру:
//  · цикл с ФИКСИРОВАННЫМ шагом (физика не зависит от частоты экрана: на 120 Гц
//    игра идёт с той же скоростью, что на 60 Гц);
//  · размер канваса с учётом devicePixelRatio, чтобы цифры не мылились;
//  · пауза при уходе со вкладки — иначе ребёнок вернётся к проигранному уровню;
//  · управление тремя способами: тап по половине экрана, свайп, клавиши.

import { useCallback, useEffect, useRef, useState } from 'react';
import { reachGoal } from '@/lib/metrika';
import {
  LEVELS,
  SLABS_PER_LEVEL,
  STEP,
  WORLD_H,
  WORLD_W,
  createGame,
  drainEvents,
  moveLane,
  starsFor,
  update,
} from './bridge/engine.js';
import { draw } from './bridge/render.js';
import { playSound, setMuted, unlockAudio } from '@/components/games/audio.js';

const STORAGE_KEY = 'znayton_bridge_v1';
// Первые четыре пролёта открыты всем — это витрина. Остальные идут с курсом,
// как и уровни в игре по ментальной арифметике.
const FREE_LEVELS = 4;

const MODE_LABEL = {
  digits: 'Цифры',
  dots: 'Точки',
  mixed: 'Цифры и точки',
};

function Stars({ count, size }) {
  const box = size === 'lg' ? 'text-3xl' : 'text-lg';
  return (
    <span className={'inline-flex gap-1 ' + box} aria-label={'Звёзд: ' + count + ' из 3'}>
      {[1, 2, 3].map((n) => (
        <span key={n} className={n <= count ? 'text-brand-yellow' : 'text-white/22'} aria-hidden>
          ★
        </span>
      ))}
    </span>
  );
}

export function BridgeGame({ hasAccess = false, onExit }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const gameRef = useRef(null);
  const pausedRef = useRef(false);
  const pointerRef = useRef(null);

  const [ready, setReady] = useState(false);
  const [stars, setStars] = useState({});
  const [view, setView] = useState('map');
  const [levelIndex, setLevelIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [result, setResult] = useState(null);
  const [hud, setHud] = useState({ target: 1, collected: 0, misses: 0, hint: false });

  const level = LEVELS[levelIndex] || LEVELS[0];

  // ── Прогресс ───────────────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && parsed.stars) setStars(parsed.stars);
        if (parsed && typeof parsed.soundOn === 'boolean') setSoundOn(parsed.soundOn);
      }
    } catch {
      // повреждённый или недоступный localStorage не должен ломать игру
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

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  // ── Экраны ─────────────────────────────────────────────────────────────────
  const syncHud = useCallback((game) => {
    setHud((prev) => {
      if (
        prev.target === game.target &&
        prev.collected === game.collected &&
        prev.misses === game.misses &&
        prev.hint === game.hint
      ) {
        return prev;
      }
      return { target: game.target, collected: game.collected, misses: game.misses, hint: game.hint };
    });
  }, []);

  const finishLevel = useCallback((game) => {
    const earned = starsFor(game.misses);
    const id = game.level.id;
    setStars((prev) => (prev[id] >= earned ? prev : { ...prev, [id]: earned }));
    setResult({ id, earned, misses: game.misses });
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

  // ── Игровой цикл ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (view !== 'play') return undefined;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const game = createGame(levelIndex);
    gameRef.current = game;
    setHud({ target: game.target, collected: 0, misses: 0, hint: false });

    const camera = { scale: 1, dx: 0, dy: 0 };
    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      const scale = Math.min(rect.width / WORLD_W, rect.height / WORLD_H);
      camera.scale = scale * dpr;
      camera.dx = ((rect.width - WORLD_W * scale) / 2) * dpr;
      camera.dy = ((rect.height - WORLD_H * scale) / 2) * dpr;
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
        // Вкладка подтормозила и накопился долг — досчитывать его вредно:
        // мост «прыгнет» вперёд. Просто теряем лишнее время.
        if (acc > STEP) acc = 0;

        const events = drainEvents(game);
        if (events) {
          for (const name of events) {
            if (name === 'done') {
              playSound('done');
              finishAt = now + 1400;
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
      draw(ctx, game);
    };

    raf = window.requestAnimationFrame(frame);

    return () => {
      window.cancelAnimationFrame(raf);
      observer.disconnect();
      gameRef.current = null;
    };
  }, [view, levelIndex, syncHud, finishLevel]);

  // ── Ввод ───────────────────────────────────────────────────────────────────
  const jump = useCallback((direction) => {
    const game = gameRef.current;
    if (!game || pausedRef.current) return;
    moveLane(game, direction);
  }, []);

  useEffect(() => {
    if (view !== 'play') return undefined;
    const onKey = (event) => {
      const key = event.key;
      if (key === 'ArrowUp' || key === 'w' || key === 'W' || key === 'ц' || key === 'Ц') {
        event.preventDefault();
        jump(-1);
      } else if (key === 'ArrowDown' || key === 's' || key === 'S' || key === 'ы' || key === 'Ы') {
        event.preventDefault();
        jump(1);
      } else if (key === ' ') {
        event.preventDefault();
        setPaused((value) => !value);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [view, jump]);

  useEffect(() => {
    if (view !== 'play') return undefined;
    const onHidden = () => {
      if (document.hidden) setPaused(true);
    };
    document.addEventListener('visibilitychange', onHidden);
    window.addEventListener('blur', onHidden);
    return () => {
      document.removeEventListener('visibilitychange', onHidden);
      window.removeEventListener('blur', onHidden);
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
    if (Math.abs(delta) > 26) {
      jump(delta < 0 ? -1 : 1);
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    jump(event.clientY < rect.top + rect.height / 2 ? -1 : 1);
  }

  // ── Карта пролётов ─────────────────────────────────────────────────────────
  if (view === 'map') {
    const total = Object.values(stars).reduce((sum, n) => sum + n, 0);
    const maxStars = LEVELS.length * 3;
    const progress = Math.round((total / maxStars) * 100);
    return (
      <div className={'flex h-full flex-col gap-5 overflow-y-auto'}>
        <div className={'flex flex-wrap items-end justify-between gap-4'}>
          <div>
            <span className={'text-[10px] font-extrabold uppercase tracking-[0.18em] text-brand-cyan'}>
              Игра · бесплатно · без регистрации
            </span>
            <h3 className={'mt-2 font-display text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl'}>
              Мост через реку
            </h3>
            <p className={'mt-2 max-w-xl text-sm font-semibold leading-6 text-white/60'}>
              Лисёнок Искра перебирается через реку по камням. Прыгай на камень со следующим
              числом — из камней за спиной вырастает мост.
            </p>
          </div>
          <div className={'text-right'}>
            <p className={'text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/45'}>Звёзды</p>
            <p className={'font-display text-2xl font-extrabold text-white'}>
              {ready ? total : 0} <span className={'text-white/45'}>/ {maxStars}</span>
            </p>
          </div>
        </div>

        {/* Прогресс — не абстрактные проценты, а «сколько моста построено»:
            ребёнку понятнее, а родителю видно движение. */}
        <div>
          <div className={'flex items-center justify-between text-[11px] font-extrabold text-white/60'}>
            <span>Мост построен</span>
            <span>{progress}%</span>
          </div>
          <div className={'mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/12'}>
            <div
              className={'h-full rounded-full bg-brand-cyan transition-all duration-500'}
              style={{ width: progress + '%' }}
            />
          </div>
        </div>

        <div className={'grid gap-3 sm:grid-cols-2 lg:grid-cols-3'}>
          {LEVELS.map((item, index) => {
            const paywalled = index + 1 > FREE_LEVELS && !hasAccess;
            // Пролёты открываются по очереди: следующий доступен, когда пройден
            // предыдущий. Это и есть ощущение продвижения по мосту.
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
                  'rounded-[24px] border p-4 text-left transition ' +
                  (locked
                    ? 'cursor-not-allowed border-white/10 bg-white/[0.04] text-white/45'
                    : 'border-white/16 bg-white/[0.08] text-white hover:-translate-y-0.5 hover:border-brand-cyan/60 hover:bg-white/[0.13]')
                }
              >
                <div className={'flex items-center justify-between gap-2'}>
                  <span className={'font-display text-lg font-extrabold'}>
                    {locked ? '🔒 ' : ''}Уровень {item.id}
                  </span>
                  {!locked && <Stars count={earned} />}
                </div>
                <p className={'mt-2 font-display text-base font-extrabold'}>{item.title}</p>
                <p className={'mt-1 text-xs font-semibold leading-5 text-white/60'}>{item.note}</p>
                <p className={'mt-3 inline-flex rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-white/70'}>
                  {MODE_LABEL[item.mode]}
                </p>
                {paywalled && <p className={'mt-2 text-xs font-bold text-brand-yellow'}>Открывается с курсом</p>}
                {!paywalled && !previousDone && (
                  <p className={'mt-2 text-xs font-bold text-white/50'}>Сначала уровень {LEVELS[index - 1].id}</p>
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
            className={'rounded-full border border-white/14 px-4 py-2 text-xs font-extrabold text-white/70 transition hover:border-white/30'}
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

  // ── Уровень пройден ────────────────────────────────────────────────────────
  if (view === 'win') {
    const earned = result ? result.earned : 3;
    const nextIndex = levelIndex + 1;
    const hasNext = nextIndex < LEVELS.length;
    const nextLocked = nextIndex + 1 > FREE_LEVELS && !hasAccess;
    return (
      <div className={'flex h-full flex-col items-center justify-center gap-4 text-center'}>
        <p className={'text-5xl'} aria-hidden>
          🦊
        </p>
        <h3 className={'font-display text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl'}>
          Ты перебрался на тот берег!
        </h3>
        <Stars count={earned} size={'lg'} />
        <p className={'max-w-md text-sm font-semibold leading-6 text-white/62'}>
          {earned === 3
            ? 'Ни одного промаха. Числовой ряд ты знаешь на отлично.'
            : earned === 2
              ? 'Почти без ошибок. Пройди ещё раз чисто — будет три звезды.'
              : 'Берег твой! Попробуй ещё раз: чем меньше ошибок, тем больше звёзд.'}
        </p>
        <div className={'mt-2 flex flex-wrap items-center justify-center gap-2'}>
          {hasNext && !nextLocked && (
            <button
              type={'button'}
              onClick={() => startLevel(nextIndex)}
              className={'min-h-[52px] rounded-full bg-brand-cyan px-6 text-sm font-extrabold text-[#0A1226] transition hover:-translate-y-0.5'}
            >
              Уровень {LEVELS[nextIndex].id} →
            </button>
          )}
          {hasNext && nextLocked && (
            <a
              href={'#podpiska'}
              onClick={onExit}
              className={'inline-flex min-h-[52px] items-center rounded-full bg-brand-cyan px-6 text-sm font-extrabold text-[#0A1226] transition hover:-translate-y-0.5'}
            >
              Открыть остальные уровни →
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
            К уровням
          </button>
        </div>
      </div>
    );
  }

  // ── Уровень ────────────────────────────────────────────────────────────────
  // Игроку 5–7 лет читать ещё рано, поэтому состояние показано значками:
  // сердца — попытки, дорожка камешков — сколько пройдено. Крупно, потому что
  // играют пальцем на телефоне и смотрят издалека.
  const lives = Math.max(0, 3 - hud.misses);
  return (
    <div className={'flex h-full flex-col gap-3'}>
      <div className={'flex flex-wrap items-center justify-between gap-2'}>
        <div className={'flex items-center gap-3'}>
          <button
            type={'button'}
            onClick={() => setView('map')}
            aria-label={'Вернуться к выбору уровня'}
            className={'rounded-full border border-white/20 px-4 py-2 text-base font-extrabold text-white transition hover:border-white/40'}
          >
            ←
          </button>
          <div>
            <p className={'font-display text-base font-extrabold text-white'}>{level.title}</p>
            <p className={'text-[11px] font-bold text-white/50'}>{level.note}</p>
          </div>
        </div>
        <div className={'flex items-center gap-2'}>
          <div
            className={'flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2'}
            aria-label={'Сердец осталось: ' + lives}
          >
            {[0, 1, 2].map((index) => (
              <span
                key={index}
                aria-hidden
                className={'text-2xl leading-none ' + (index < lives ? 'text-[#FF5A5A]' : 'text-white/20')}
              >
                ♥
              </span>
            ))}
          </div>
          <button
            type={'button'}
            onClick={() => setPaused((value) => !value)}
            aria-label={paused ? 'Продолжить игру' : 'Пауза'}
            className={'rounded-full border border-white/20 px-4 py-2 text-lg leading-none text-white transition hover:border-white/40'}
          >
            {paused ? '▶' : '⏸'}
          </button>
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
      </div>

      <div className={'flex items-center gap-3 rounded-[20px] bg-white/[0.08] px-4 py-3'}>
        <span className={'text-2xl leading-none'} aria-hidden>
          🦊
        </span>
        <div className={'flex flex-1 items-center gap-1.5'} aria-hidden>
          {Array.from({ length: SLABS_PER_LEVEL }).map((_, index) => (
            <span
              key={index}
              className={
                'h-4 flex-1 rounded-full transition-colors duration-300 ' +
                (index < hud.collected ? 'bg-brand-cyan' : 'bg-white/15')
              }
            />
          ))}
        </div>
        <span className={'font-display text-xl font-extrabold text-white'}>
          {hud.collected}
          <span className={'text-white/45'}>/{SLABS_PER_LEVEL}</span>
        </span>
      </div>

      <div
        ref={wrapRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          pointerRef.current = null;
        }}
        className={'relative min-h-0 w-full flex-1 cursor-pointer overflow-hidden rounded-[24px]'}
        style={{ touchAction: 'none', background: '#0B1226' }}
      >
        <canvas ref={canvasRef} className={'h-full w-full'} />

        <div className={'pointer-events-none absolute inset-x-0 top-0 flex flex-col items-center gap-1 p-2'}>
          <span
            className={'rounded-full px-3 py-1 text-[11px] font-extrabold text-white'}
            style={{ backgroundColor: 'rgba(7, 14, 32, 0.72)' }}
          >
            {level.tip}
          </span>
          <span
            className={'rounded-full px-3 py-1 text-[10px] font-bold text-white/75'}
            style={{ backgroundColor: 'rgba(7, 14, 32, 0.55)' }}
          >
            ▲ вверх · ▼ вниз — тап по половине экрана, свайп или стрелки
          </span>
        </div>

        {paused && (
          <div
            className={'absolute inset-0 flex flex-col items-center justify-center gap-3'}
            style={{ backgroundColor: 'rgba(7, 14, 32, 0.88)' }}
          >
            <p className={'font-display text-2xl font-extrabold text-white'}>Пауза</p>
            <button
              type={'button'}
              onClick={() => setPaused(false)}
              className={'min-h-[48px] rounded-full bg-brand-cyan px-6 text-sm font-extrabold text-[#0A1226]'}
            >
              Продолжить
            </button>
          </div>
        )}
      </div>

      {/* На телефоне мир 16:9 не занимает весь экран — свободное место внизу
          отдаём под крупные кнопки, по которым легко попасть детской рукой. */}
      <div className={'grid shrink-0 grid-cols-2 gap-2 sm:hidden'}>
        <button
          type={'button'}
          onClick={() => {
            unlockAudio();
            jump(-1);
          }}
          aria-label={'Прыгнуть на дорожку выше'}
          className={'min-h-[62px] rounded-[20px] border border-white/16 bg-white/8 text-2xl font-extrabold text-white transition active:bg-white/20'}
        >
          ▲
        </button>
        <button
          type={'button'}
          onClick={() => {
            unlockAudio();
            jump(1);
          }}
          aria-label={'Прыгнуть на дорожку ниже'}
          className={'min-h-[62px] rounded-[20px] border border-white/16 bg-white/8 text-2xl font-extrabold text-white transition active:bg-white/20'}
        >
          ▼
        </button>
      </div>

      <p className={'shrink-0 text-center text-xs font-bold text-white/50'} aria-live={'polite'}>
        {hud.hint ? 'Подсказка: нужный камень подсвечен. ' : ''}
        Нужен камень с числом {hud.target}
      </p>
    </div>
  );
}
