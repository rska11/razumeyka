'use client';

// Оболочка платформера «Дом знаний»: карта дома, игровой цикл, управление.
// Правила и физика — в ./house/engine.js, комнаты — в ./house/rooms.js,
// рисование — в ./house/render.js.
//
// Управление сделано тремя способами сразу: экранные кнопки (телефон),
// стрелки и пробел (компьютер), удержание кнопки мышью. Кнопки крупные —
// играет пятилетка пальцем.

import { useCallback, useEffect, useRef, useState } from 'react';
import { reachGoal } from '@/lib/metrika';
import {
  STEP,
  WORLD_H,
  WORLD_W,
  createGame,
  drainEvents,
  expectedValue,
  pressJump,
  setInput,
  starsFor,
  update,
} from './house/engine.js';
import { ROOMS } from './house/rooms.js';
import { draw } from './house/render.js';
import { playSound, setMuted, unlockAudio } from '@/components/games/audio.js';

const STORAGE_KEY = 'znayton_house_v1';
const FREE_ROOMS = 3;

function Stars({ count, size }) {
  return (
    <span className={'inline-flex gap-0.5 ' + (size === 'lg' ? 'text-3xl' : 'text-base')} aria-label={'Звёзд: ' + count + ' из 3'}>
      {[1, 2, 3].map((n) => (
        <span key={n} className={n <= count ? 'text-brand-yellow' : 'text-white/20'} aria-hidden>
          ★
        </span>
      ))}
    </span>
  );
}

export function HouseGame({ hasAccess = false, onExit }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const gameRef = useRef(null);
  const inputRef = useRef({ left: false, right: false, jump: false });

  const [ready, setReady] = useState(false);
  const [stars, setStars] = useState({});
  const [view, setView] = useState('map');
  const [roomIndex, setRoomIndex] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [result, setResult] = useState(null);
  const [hud, setHud] = useState({ need: null, done: 0, total: 0, mistakes: 0, slips: 0, key: false, open: false });

  const room = ROOMS[roomIndex] || ROOMS[0];

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
    const need = expectedValue(game);
    setHud((prev) => {
      if (
        prev.need === need &&
        prev.done === game.expectedIndex &&
        prev.mistakes === game.mistakes &&
        prev.slips === game.slips &&
        prev.key === game.keyTaken &&
        prev.open === game.doorOpen
      ) {
        return prev;
      }
      return {
        need,
        done: game.expectedIndex,
        total: game.room.order.length,
        mistakes: game.mistakes,
        slips: game.slips,
        key: game.keyTaken,
        open: game.doorOpen,
      };
    });
  }, []);

  const finishRoom = useCallback((game) => {
    const earned = starsFor(game);
    const id = game.room.id;
    setStars((prev) => (prev[id] >= earned ? prev : { ...prev, [id]: earned }));
    setResult({ id, earned, mistakes: game.mistakes, slips: game.slips });
    setView('win');
    reachGoal('prep_house_room', { room: id, stars: earned });
  }, []);

  const startRoom = useCallback((index) => {
    unlockAudio();
    inputRef.current = { left: false, right: false, jump: false };
    setRoomIndex(index);
    setResult(null);
    setView('play');
    reachGoal('prep_house_start', { room: ROOMS[index]?.id ?? index + 1 });
  }, []);

  // ── Игровой цикл ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (view !== 'play') return undefined;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const game = createGame(ROOMS[roomIndex] || ROOMS[0]);
    gameRef.current = game;
    setHud({
      need: expectedValue(game),
      done: 0,
      total: game.room.order.length,
      mistakes: 0,
      slips: 0,
      key: false,
      open: false,
    });

    const camera = { scale: 1, dx: 0, dy: 0, dpr: 1 };
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

      acc += dt;
      let guard = 0;
      while (acc >= STEP && guard < 6) {
        setInput(game, inputRef.current);
        update(game, STEP);
        acc -= STEP;
        guard += 1;
      }
      if (acc > STEP) acc = 0;

      const events = drainEvents(game);
      if (events) {
        for (const name of events) {
          if (name === 'good') playSound('ok');
          else if (name === 'wrong') playSound('miss');
          else if (name === 'key' || name === 'open') playSound('bonus');
          else if (name === 'slip') playSound('lost');
          else if (name === 'jump') playSound('jump');
          else if (name === 'done') {
            playSound('done');
            finishAt = now + 900;
          }
        }
      }
      syncHud(game);
      if (finishAt && now >= finishAt) {
        finishAt = 0;
        finishRoom(game);
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
  }, [view, roomIndex, syncHud, finishRoom]);

  // ── Клавиатура ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (view !== 'play') return undefined;
    const isLeft = (key) => key === 'ArrowLeft' || key === 'a' || key === 'A' || key === 'ф' || key === 'Ф';
    const isRight = (key) => key === 'ArrowRight' || key === 'd' || key === 'D' || key === 'в' || key === 'В';
    const isJump = (key) =>
      key === ' ' || key === 'ArrowUp' || key === 'w' || key === 'W' || key === 'ц' || key === 'Ц';

    const onDown = (event) => {
      if (isLeft(event.key)) {
        event.preventDefault();
        inputRef.current.left = true;
      } else if (isRight(event.key)) {
        event.preventDefault();
        inputRef.current.right = true;
      } else if (isJump(event.key)) {
        event.preventDefault();
        if (!inputRef.current.jump && gameRef.current) pressJump(gameRef.current);
        inputRef.current.jump = true;
      }
    };
    const onUp = (event) => {
      if (isLeft(event.key)) inputRef.current.left = false;
      else if (isRight(event.key)) inputRef.current.right = false;
      else if (isJump(event.key)) inputRef.current.jump = false;
    };

    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, [view]);

  function hold(name, value) {
    return {
      onPointerDown: (event) => {
        event.preventDefault();
        unlockAudio();
        // Захват указателя — удобство (палец может съехать с кнопки), но он
        // умеет бросать исключение на неизвестном pointerId. Уронить из-за
        // этого всё управление нельзя.
        try {
          event.currentTarget.setPointerCapture?.(event.pointerId);
        } catch {
          // не страшно: кнопка продолжит работать без захвата
        }
        if (name === 'jump') {
          if (gameRef.current) pressJump(gameRef.current);
          inputRef.current.jump = true;
        } else {
          inputRef.current[name] = value;
        }
      },
      onPointerUp: () => {
        inputRef.current[name] = false;
      },
      onPointerCancel: () => {
        inputRef.current[name] = false;
      },
      onPointerLeave: () => {
        inputRef.current[name] = false;
      },
    };
  }

  // ── Карта дома ─────────────────────────────────────────────────────────────
  if (view === 'map') {
    const total = Object.values(stars).reduce((sum, n) => sum + n, 0);
    // Этажи снизу вверх: прихожая внизу, чердак наверху — как в настоящем доме.
    const floors = [
      [4, 5],
      [2, 3],
      [0, 1],
    ];
    return (
      <div className={'flex h-full flex-col gap-4 overflow-y-auto'}>
        <div className={'flex flex-wrap items-end justify-between gap-3'}>
          <div>
            <span className={'text-[10px] font-extrabold uppercase tracking-[0.18em] text-brand-cyan'}>
              Игра · платформер · без регистрации
            </span>
            <h3 className={'mt-2 font-display text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl'}>
              Дом знаний
            </h3>
            <p className={'mt-2 max-w-xl text-sm font-semibold leading-6 text-white/62'}>
              Искра бегает по комнатам, прыгает по мебели и собирает цифры по порядку. Соберёшь все —
              найдёшь ключ и откроешь дверь в следующую комнату.
            </p>
          </div>
          <div className={'text-right'}>
            <p className={'text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/45'}>Звёзды</p>
            <p className={'font-display text-2xl font-extrabold text-white'}>
              {ready ? total : 0} <span className={'text-white/45'}>/ {ROOMS.length * 3}</span>
            </p>
          </div>
        </div>

        <div className={'mx-auto w-full max-w-2xl'}>
          <svg viewBox={'0 0 100 16'} className={'w-full'} aria-hidden>
            <polygon points={'50,0 100,16 0,16'} fill={'#8B3E2F'} />
            <rect x={'44'} y={'6'} width={'12'} height={'10'} rx={'1.5'} fill={'#FFD86E'} opacity={'0.85'} />
          </svg>
          <div className={'rounded-b-[28px] border-4 border-t-0 border-[#8B3E2F] bg-[#131C3C] p-3'}>
            {floors.map((floor, floorIndex) => (
              <div key={floorIndex} className={'grid grid-cols-2 gap-2' + (floorIndex < 2 ? ' mb-2' : '')}>
                {floor.map((index) => {
                  const item = ROOMS[index];
                  const paywalled = index + 1 > FREE_ROOMS && !hasAccess;
                  const previousDone = index === 0 || (stars[ROOMS[index - 1].id] || 0) > 0;
                  const locked = paywalled || !previousDone;
                  const earned = stars[item.id] || 0;
                  const current = !locked && earned === 0;
                  return (
                    <button
                      key={item.id}
                      type={'button'}
                      onClick={() => (locked ? null : startRoom(index))}
                      disabled={locked}
                      className={
                        'relative min-h-[104px] rounded-[18px] border p-3 text-left transition ' +
                        (locked
                          ? 'cursor-not-allowed border-white/10 bg-white/[0.04] text-white/45'
                          : 'border-white/16 bg-white/[0.08] text-white hover:-translate-y-0.5 hover:border-brand-cyan/60') +
                        (current ? ' ring-2 ring-brand-cyan/70' : '')
                      }
                    >
                      {current && (
                        <span className={'absolute -top-4 right-3 text-2xl'} aria-hidden>
                          🦊
                        </span>
                      )}
                      <div className={'flex items-center justify-between gap-2'}>
                        <span className={'font-display text-sm font-extrabold'}>
                          {locked ? '🔒 ' : ''}Комната {item.id}
                        </span>
                        {!locked && <Stars count={earned} />}
                      </div>
                      <p className={'mt-1 font-display text-base font-extrabold'}>{item.title}</p>
                      <p className={'mt-0.5 text-[11px] font-semibold leading-4 text-white/60'}>{item.note}</p>
                      {paywalled && <p className={'mt-1 text-[11px] font-bold text-brand-yellow'}>С курсом</p>}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className={'mt-auto flex flex-wrap items-center justify-between gap-3 pt-1'}>
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

  // ── Комната пройдена ───────────────────────────────────────────────────────
  if (view === 'win') {
    const earned = result ? result.earned : 3;
    const nextIndex = roomIndex + 1;
    const hasNext = nextIndex < ROOMS.length;
    const nextLocked = nextIndex + 1 > FREE_ROOMS && !hasAccess;
    return (
      <div className={'flex h-full flex-col items-center justify-center gap-4 text-center'}>
        <p className={'text-5xl'} aria-hidden>
          🚪
        </p>
        <h3 className={'font-display text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl'}>
          {room.title} пройдена!
        </h3>
        <Stars count={earned} size={'lg'} />
        <p className={'max-w-md text-sm font-semibold leading-6 text-white/62'}>
          {earned === 3
            ? 'Ни одной лишней цифры и ни одного падения. Чисто!'
            : 'Собрано всё. Пройди без ошибок и падений — будет три звезды.'}
        </p>
        <div className={'mt-2 flex flex-wrap items-center justify-center gap-2'}>
          {hasNext && !nextLocked && (
            <button
              type={'button'}
              onClick={() => startRoom(nextIndex)}
              className={'min-h-[52px] rounded-full bg-brand-cyan px-6 text-sm font-extrabold text-[#0A1226] transition hover:-translate-y-0.5'}
            >
              {ROOMS[nextIndex].title} →
            </button>
          )}
          {hasNext && nextLocked && (
            <a
              href={'#podpiska'}
              onClick={onExit}
              className={'inline-flex min-h-[52px] items-center rounded-full bg-brand-cyan px-6 text-sm font-extrabold text-[#0A1226]'}
            >
              Открыть остальные комнаты →
            </a>
          )}
          <button
            type={'button'}
            onClick={() => startRoom(roomIndex)}
            className={'min-h-[52px] rounded-full border border-white/16 px-6 text-sm font-extrabold text-white transition hover:border-white/32'}
          >
            Ещё раз
          </button>
          <button
            type={'button'}
            onClick={() => setView('map')}
            className={'min-h-[52px] rounded-full border border-white/16 px-6 text-sm font-extrabold text-white transition hover:border-white/32'}
          >
            К дому
          </button>
        </div>
      </div>
    );
  }

  // ── Комната ────────────────────────────────────────────────────────────────
  return (
    <div className={'flex h-full flex-col gap-2'}>
      <div className={'flex flex-wrap items-center justify-between gap-2'}>
        <div className={'flex items-center gap-3'}>
          <button
            type={'button'}
            onClick={() => setView('map')}
            aria-label={'Вернуться к карте дома'}
            className={'rounded-full border border-white/20 px-4 py-2 text-base font-extrabold text-white transition hover:border-white/40'}
          >
            ←
          </button>
          <div>
            <p className={'font-display text-base font-extrabold text-white'}>{room.title}</p>
            <p className={'text-[11px] font-bold text-white/50'}>{room.hint}</p>
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

      <div className={'flex items-center gap-3 rounded-[18px] bg-white/[0.08] px-4 py-2.5'}>
        <span className={'text-[11px] font-extrabold uppercase tracking-[0.14em] text-white/55'}>Найди</span>
        <span className={'flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-yellow font-display text-2xl font-black text-[#3A2B08]'}>
          {hud.open ? '🚪' : hud.need}
        </span>
        <div className={'flex flex-1 items-center gap-1'} aria-hidden>
          {Array.from({ length: hud.total }).map((_, index) => (
            <span
              key={index}
              className={'h-3 flex-1 rounded-full ' + (index < hud.done ? 'bg-brand-cyan' : 'bg-white/15')}
            />
          ))}
        </div>
        {room.key && (
          <span className={'text-xl'} aria-label={hud.key ? 'Ключ найден' : 'Ключ не найден'}>
            {hud.key ? '🔑' : '🔒'}
          </span>
        )}
      </div>

      <div
        ref={wrapRef}
        className={'relative min-h-0 w-full flex-1 overflow-hidden rounded-[22px]'}
        style={{ touchAction: 'none', background: '#0F1733' }}
      >
        <canvas ref={canvasRef} className={'h-full w-full'} />
      </div>

      {/* Крупные кнопки: играет пятилетка пальцем, попадать должно легко. */}
      <div className={'flex shrink-0 items-center justify-between gap-3'}>
        <div className={'flex gap-2'}>
          <button
            type={'button'}
            aria-label={'Идти влево'}
            {...hold('left', true)}
            className={'flex h-16 w-20 items-center justify-center rounded-[20px] border border-white/16 bg-white/10 text-2xl font-black text-white active:bg-white/25'}
          >
            ◀
          </button>
          <button
            type={'button'}
            aria-label={'Идти вправо'}
            {...hold('right', true)}
            className={'flex h-16 w-20 items-center justify-center rounded-[20px] border border-white/16 bg-white/10 text-2xl font-black text-white active:bg-white/25'}
          >
            ▶
          </button>
        </div>
        <button
          type={'button'}
          aria-label={'Прыжок'}
          {...hold('jump', true)}
          className={'flex h-16 min-w-[120px] items-center justify-center gap-2 rounded-[20px] bg-gradient-to-r from-[#FFB02E] to-[#FF7A45] px-6 text-base font-black text-[#19213A] active:translate-y-0.5'}
        >
          ⬆ Прыжок
        </button>
      </div>

      <p className={'shrink-0 text-center text-[11px] font-bold text-white/45'} aria-live={'polite'}>
        {hud.open
          ? 'Дверь открыта — беги к ней!'
          : 'Собери цифру ' + hud.need + ' · на компьютере: стрелки и пробел'}
      </p>
    </div>
  );
}
