'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { reachGoal } from '@/lib/metrika';
import { playSound, setMuted, unlockAudio } from '@/components/games/audio.js';
import {
  STEP,
  academyScore,
  createAcademyGame,
  drainAcademyEvents,
  pressAcademyJump,
  setAcademyInput,
  updateAcademy,
} from './academy/engine.js';
import { drawAcademy } from './academy/render.js';
import { ACADEMY_LEVELS, getAcademyLevel } from './academy/level.js';

const STORAGE_KEY = 'znayton_academy_v1';
const HEROES = [
  { name: 'Ника', role: 'Исследовательница', color: '#ff6788' },
  { name: 'Тим', role: 'Юный изобретатель', color: '#4d8cff' },
  { name: 'Байт', role: 'Робот-помощник', color: '#62e6cf' },
];

const FUTURE_ACADEMY_MISSIONS = [
  { number: 5, title: 'Лаборатория времени', skill: 'Порядок событий, часы и части суток', tone: '#78d8ff' },
  { number: 6, title: 'Архив живых слов', skill: 'Звуки, слоги и первые слова', tone: '#ff8fbd' },
  { number: 7, title: 'Космическая геометрия', skill: 'Фигуры, пространство и маршруты', tone: '#b49aff' },
  { number: 8, title: 'Главный портал', skill: 'Большой финал: математика, речь и логика', tone: '#ffd75f' },
];

function HeroPortrait({ index, compact = false }) {
  return (
    <div
      className={compact ? "h-24 w-20 shrink-0 bg-contain bg-bottom bg-no-repeat" : "h-28 w-24 shrink-0 bg-contain bg-bottom bg-no-repeat sm:h-32 sm:w-28"}
      style={{
        backgroundImage: "url('/images/games/academy/academy-heroes-v1.webp')",
        backgroundSize: '300% 100%',
        backgroundPosition: `${index * 50}% bottom`,
      }}
      aria-hidden
    />
  );
}

export function AcademyGame({ onExit }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const gameRef = useRef(null);
  const inputRef = useRef({ left: false, right: false, jump: false });
  const [view, setView] = useState('map');
  const [hero, setHero] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [best, setBest] = useState(0);
  const [selectedLevelId, setSelectedLevelId] = useState(ACADEMY_LEVELS[0].id);
  const [progress, setProgress] = useState({});
  const [hud, setHud] = useState({ coins: 0, stars: 0, hearts: 3, skills: 0, skillTotal: ACADEMY_LEVELS[0].challenges?.length || 1, phase: ACADEMY_LEVELS[0].objective, feedback: null });
  const [result, setResult] = useState(null);
  const currentLevel = getAcademyLevel(selectedLevelId);
  const currentLevelIndex = ACADEMY_LEVELS.findIndex((level) => level.id === selectedLevelId);
  const nextLevel = ACADEMY_LEVELS[currentLevelIndex + 1];

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      if (Number.isInteger(saved.hero)) setHero(saved.hero);
      if (Number.isFinite(saved.best)) setBest(saved.best);
      if (typeof saved.soundOn === 'boolean') setSoundOn(saved.soundOn);
      if (saved.progress && typeof saved.progress === 'object') setProgress(saved.progress);
      if (ACADEMY_LEVELS.some((level) => level.id === saved.selectedLevelId)) setSelectedLevelId(saved.selectedLevelId);
    } catch {
      // Игра должна запускаться даже при запрете localStorage.
    }
  }, []);

  useEffect(() => {
    setMuted(!soundOn);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ hero, best, soundOn, progress, selectedLevelId }));
    } catch {
      // Прогресс просто не сохранится в приватном режиме.
    }
  }, [hero, best, soundOn, progress, selectedLevelId]);

  const start = useCallback((levelId = selectedLevelId) => {
    const level = getAcademyLevel(levelId);
    unlockAudio();
    inputRef.current = { left: false, right: false, jump: false };
    setSelectedLevelId(level.id);
    setResult(null);
    setHud({ coins: 0, stars: 0, hearts: 3, skills: 0, skillTotal: level.challenges?.length || 1, phase: level.objective, feedback: null });
    setView('play');
    reachGoal('academy_game_start', { hero: HEROES[hero].name, level: level.id });
  }, [hero, selectedLevelId]);

  useEffect(() => {
    if (view !== 'play') return undefined;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return undefined;
    const ctx = canvas.getContext('2d');
    const game = createAcademyGame(hero, selectedLevelId);
    gameRef.current = game;
    const camera = { x: 0 };
    const assets = {
      background: new Image(),
      heroes: new Image(),
      enemies: new Image(),
    };
    assets.background.src = game.level.background || '/images/games/academy/academy-sky-city-v1.webp';
    assets.heroes.src = '/images/games/academy/academy-hero-motion-v1.webp';
    assets.enemies.src = '/images/games/academy/academy-enemies-v1.webp';

    const viewport = { width: 1280, height: 720, dpr: 1 };
    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(2, devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      viewport.width = canvas.width;
      viewport.height = canvas.height;
      viewport.dpr = dpr;
    };
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);
    resize();

    let raf = 0;
    let last = performance.now();
    let accumulator = 0;
    let hudClock = 0;
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      accumulator += Math.min(0.1, (now - last) / 1000);
      last = now;
      let guard = 0;
      while (accumulator >= STEP && guard < 7) {
        setAcademyInput(game, inputRef.current);
        updateAcademy(game, STEP);
        accumulator -= STEP;
        guard += 1;
      }

      for (const event of drainAcademyEvents(game)) {
        if (event === 'jump') playSound('jump');
        else if (event === 'coin') playSound('ok');
        else if (event === 'star' || event === 'lesson' || event === 'lesson-part' || event === 'checkpoint') playSound('bonus');
        else if (event === 'hurt' || event === 'lesson-wrong') playSound('miss');
        else if (event === 'all-lessons' || event === 'done') playSound('done');
      }

      hudClock += 1;
      if (hudClock % 8 === 0) {
        setHud((old) => {
          const challenges = game.level.challenges || [];
          const skills = challenges.length
            ? Object.values(game.challengeProgress).filter(Boolean).length
            : Object.values(game.solved).filter(Boolean).length;
          const skillTotal = challenges.length || 1;
          const currentChallenge = challenges.find((item) => !game.challengeProgress[item.id]);
          const complete = challenges.length ? skills === skillTotal : Object.values(game.solved).every(Boolean);
          const phase = complete
            ? 'Все механизмы запущены — доберись до светящегося портала'
            : currentChallenge
              ? game.challengeReady[currentChallenge.id]
                ? `Мастерская ${currentChallenge.number} из ${skillTotal}: ${currentChallenge.goal}`
                : `Мастерская ${currentChallenge.number} из ${skillTotal}: остановись и прочитай задание`
              : game.level.objective;
          const feedback = game.feedback ? { id: game.feedback.id, type: game.feedback.type, title: game.feedback.title, detail: game.feedback.detail } : null;
          const next = { coins: game.collected, stars: game.rareStars, hearts: game.hearts, skills, skillTotal, phase, feedback };
          return JSON.stringify(old) === JSON.stringify(next) ? old : next;
        });
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      drawAcademy(ctx, game, assets, camera, viewport);
      if (game.status === 'done') {
        game.status = 'finished';
        const score = academyScore(game);
        setBest((value) => Math.max(value, score));
        setProgress((old) => ({ ...old, [game.level.id]: { complete: true, score: Math.max(old[game.level.id]?.score || 0, score), stars: Math.max(old[game.level.id]?.stars || 0, game.rareStars) } }));
        setResult({ levelId: game.level.id, title: game.level.title, score, coins: game.collected, stars: game.rareStars, hearts: game.hearts, lessonMistakes: game.lessonMistakes });
        setView('win');
        reachGoal('academy_game_finish', { level: game.level.id, score, stars: game.rareStars });
      }
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      gameRef.current = null;
      inputRef.current = { left: false, right: false, jump: false };
    };
  }, [view, hero, selectedLevelId]);

  useEffect(() => {
    if (view !== 'play') return undefined;
    const down = (event) => {
      if (['ArrowLeft', 'a', 'A', 'ф', 'Ф'].includes(event.key)) inputRef.current.left = true;
      if (['ArrowRight', 'd', 'D', 'в', 'В'].includes(event.key)) inputRef.current.right = true;
      if ([' ', 'ArrowUp', 'w', 'W', 'ц', 'Ц'].includes(event.key)) {
        if (!inputRef.current.jump && gameRef.current) pressAcademyJump(gameRef.current);
        inputRef.current.jump = true;
      }
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', ' '].includes(event.key)) event.preventDefault();
    };
    const up = (event) => {
      if (['ArrowLeft', 'a', 'A', 'ф', 'Ф'].includes(event.key)) inputRef.current.left = false;
      if (['ArrowRight', 'd', 'D', 'в', 'В'].includes(event.key)) inputRef.current.right = false;
      if ([' ', 'ArrowUp', 'w', 'W', 'ц', 'Ц'].includes(event.key)) inputRef.current.jump = false;
    };
    const resetInput = () => { inputRef.current = { left: false, right: false, jump: false }; };
    addEventListener('keydown', down);
    addEventListener('keyup', up);
    addEventListener('blur', resetInput);
    return () => {
      removeEventListener('keydown', down);
      removeEventListener('keyup', up);
      removeEventListener('blur', resetInput);
      resetInput();
    };
  }, [view]);

  const hold = (key) => ({
    onPointerDown: (event) => {
      event.preventDefault();
      unlockAudio();
      try { event.currentTarget.setPointerCapture(event.pointerId); } catch {}
      if (key === 'jump' && gameRef.current) pressAcademyJump(gameRef.current);
      inputRef.current[key] = true;
    },
    onPointerUp: () => { inputRef.current[key] = false; },
    onPointerCancel: () => { inputRef.current[key] = false; },
    onPointerLeave: () => { inputRef.current[key] = false; },
  });

  if (view === 'map') {
    return (
      <div className="relative h-full overflow-y-auto rounded-[28px] bg-[#07152e] text-white">
        <div className="absolute inset-0 bg-[url('/images/games/academy/academy-sky-city-v1.webp')] bg-cover bg-center opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07152ef2] via-[#07152ebf] to-[#07152e80]" />
        <div className="relative flex min-h-full flex-col p-5 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-[10px] font-black uppercase tracking-[.2em] text-[#72ead4]">Большое приключение · мир 1</p>
              <h3 className="mt-3 font-display text-4xl font-black leading-none tracking-[-.05em] sm:text-6xl">Порталы Знайтона</h3>
              <p className="mt-4 max-w-xl text-sm font-semibold leading-6 text-white/72 sm:text-base">
                Исследуй Механическую академию: прыгай по парящим мостам, находи секреты, побеждай глитчей и запусти древний портал.
              </p>
              <div className="mt-5 max-w-2xl rounded-[22px] border border-[#83F4D8]/25 bg-[#07152e]/55 p-4 backdrop-blur">
                <p className="text-[9px] font-black uppercase tracking-[.17em] text-[#83F4D8]">Обучение происходит внутри приключения</p>
                <div className="mt-3 grid gap-2 text-xs font-bold text-white/72 sm:grid-cols-2">
                  <span className="rounded-xl bg-white/[.07] px-3 py-2">🔢 Пропущенное число</span>
                  <span className="rounded-xl bg-white/[.07] px-3 py-2">⚖️ Больше и меньше</span>
                  <span className="rounded-xl bg-white/[.07] px-3 py-2">🧩 Закономерности</span>
                  <span className="rounded-xl bg-white/[.07] px-3 py-2">➕ Состав числа 5</span>
                </div>
                <p className="mt-3 text-[11px] font-semibold leading-5 text-white/48">Двенадцать квест-комнат встроены прямо в приключение. Ребёнок запускает механизмы, строит маршрут и применяет математику, память и логику без отрыва от игры.</p>
              </div>
            </div>
            <div className="rounded-2xl border border-white/12 bg-black/25 px-4 py-3 text-right backdrop-blur">
              <p className="text-[9px] font-black uppercase tracking-[.15em] text-white/50">Лучший результат</p>
              <p className="mt-1 text-2xl font-black text-[#ffd75f]">{best.toLocaleString('ru-RU')}</p>
            </div>
          </div>

          <div className="mt-7">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#83F4D8]">Мир 1 · Механическая академия</p>
                <h4 className="mt-1 text-2xl font-black tracking-[-.03em]">Карта миссий</h4>
              </div>
              <p className="text-[11px] font-bold text-white/48">Каждая миссия — 7–10 минут</p>
            </div>
            <div className="relative mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {ACADEMY_LEVELS.map((level, index) => {
                const unlocked = index === 0 || Boolean(progress[ACADEMY_LEVELS[index - 1].id]?.complete);
                const done = progress[level.id];
                const selected = selectedLevelId === level.id;
                const icons = ['🔢', '⚖️', '🧩', '⚡'];
                return (
                  <button
                    key={level.id}
                    type="button"
                    disabled={!unlocked}
                    onClick={() => setSelectedLevelId(level.id)}
                    className={`relative min-h-[154px] overflow-hidden rounded-[22px] border p-4 text-left transition ${
                      selected && unlocked ? 'bg-white/16 ring-2 ring-white/20' : unlocked ? 'bg-black/25 hover:-translate-y-1 hover:bg-white/10' : 'cursor-not-allowed border-white/8 bg-black/25 opacity-45'
                    }`}
                    style={selected && unlocked ? { borderColor: level.accent, boxShadow: `0 14px 35px ${level.glow}45` } : undefined}
                  >
                    <span className="absolute -right-3 -top-4 text-7xl opacity-10" aria-hidden>{icons[index]}</span>
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-[9px] font-black uppercase tracking-[.15em]" style={{ color: unlocked ? level.accent : '#fff' }}>Миссия {level.number}</span>
                      <span className="text-xs">{done ? `★ ${done.stars}/3` : unlocked ? 'Открыта' : '🔒'}</span>
                    </span>
                    <strong className="mt-4 block text-lg font-black leading-tight">{level.title}</strong>
                    <span className="mt-2 block text-[11px] font-bold leading-4 text-white/55">{level.skillLabel}</span>
                    {selected && unlocked && <span className="mt-3 inline-flex rounded-full px-2.5 py-1 text-[9px] font-black uppercase text-[#07152e]" style={{ background: level.accent }}>Выбрана</span>}
                  </button>
                );
              })}
            </div>
            <div className="mt-5 rounded-[24px] border border-white/10 bg-[#07152e]/58 p-4 backdrop-blur sm:p-5">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[.18em] text-[#ffd75f]">Продолжение приключения</p>
                  <h5 className="mt-1 text-lg font-black tracking-[-.02em]">Следующие порталы откроются с курсом</h5>
                </div>
                <span className="rounded-full border border-[#ffd75f]/25 bg-[#ffd75f]/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[.12em] text-[#ffd75f]">Готовим новые миссии</span>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {FUTURE_ACADEMY_MISSIONS.map((item) => (
                  <div key={item.number} className="relative min-h-[132px] overflow-hidden rounded-[20px] border border-white/10 bg-black/25 p-4 text-white/58">
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-[9px] font-black uppercase tracking-[.14em]" style={{ color: item.tone }}>Миссия {item.number}</span>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/12 bg-white/[.06]" aria-label="Миссия закрыта">
                        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                          <rect x="5" y="10" width="14" height="10" rx="3" stroke="currentColor" strokeWidth="2" />
                          <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </span>
                    </span>
                    <strong className="mt-3 block text-sm font-black leading-tight text-white/72">{item.title}</strong>
                    <span className="mt-2 block text-[10px] font-semibold leading-4 text-white/42">{item.skill}</span>
                    <span className="mt-3 inline-flex text-[8px] font-black uppercase tracking-[.1em] text-[#ffd75f]">Откроется с курсом</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">
              <span className="text-2xl" aria-hidden>{['🔢', '⚖️', '🧩', '⚡'][currentLevelIndex]}</span>
              <span>
                <strong className="block text-sm font-black">{currentLevel.title}</strong>
                <span className="block text-[11px] font-semibold text-white/55">{currentLevel.objective}</span>
              </span>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-black uppercase tracking-[.16em] text-white/50">Выбери героя экспедиции</p>
              <p className="text-[10px] font-bold text-white/35">У каждого героя одинаковые возможности</p>
            </div>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {HEROES.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setHero(index)}
                  className={`relative flex min-h-[108px] items-end overflow-hidden rounded-[20px] border px-2 text-left transition ${
                    hero === index ? 'border-[#ffd75f] bg-white/16 ring-2 ring-[#ffd75f]/25' : 'border-white/12 bg-black/20 hover:-translate-y-0.5 hover:bg-white/10'
                  }`}
                >
                  <HeroPortrait index={index} compact />
                  <span className="pb-5 pr-2">
                    <strong className="block text-base font-black text-white">{item.name}</strong>
                    <span className="mt-1 block text-[10px] font-semibold leading-4 text-white/50">{item.role}</span>
                    {hero === index && <span className="mt-2 inline-flex rounded-full px-2 py-1 text-[8px] font-black uppercase text-[#07152e]" style={{ background: item.color }}>Выбран</span>}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
            <button type="button" onClick={() => start()} className="min-h-[58px] rounded-full bg-gradient-to-r from-[#ffd75f] to-[#ff8d5f] px-8 text-sm font-black text-[#07152e] shadow-[0_18px_45px_rgba(255,166,79,.28)] transition hover:-translate-y-1">
              Играть: {currentLevel.title} →
            </button>
            <button type="button" onClick={() => setSoundOn((value) => !value)} className="min-h-[50px] rounded-full border border-white/16 bg-black/20 px-5 text-xs font-black text-white/75">
              {soundOn ? '🔊 Звук включён' : '🔇 Без звука'}
            </button>
            {onExit && <button type="button" onClick={onExit} className="ml-auto min-h-[50px] rounded-full border border-white/12 px-5 text-xs font-black text-white/60">Закрыть</button>}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'win') {
    return (
      <div className="flex h-full flex-col items-center justify-center overflow-y-auto rounded-[28px] bg-[radial-gradient(circle_at_50%_20%,#245c80,#07152e_65%)] p-6 text-center text-white">
        <p className="text-6xl" aria-hidden>🏆</p>
        <p className="mt-4 text-[10px] font-black uppercase tracking-[.2em] text-[#72ead4]">Портал запущен</p>
        <h3 className="mt-3 font-display text-4xl font-black tracking-[-.04em] sm:text-6xl">Миссия выполнена!</h3>
        <p className="mt-3 max-w-lg text-sm font-semibold leading-6 text-white/65">
          Миссия «{result?.title}» пройдена: собрано {result?.coins || 0} шестерёнок и найдено {result?.stars || 0} из 3 секретных звёзд. Ошибок в квест-комнатах: {result?.lessonMistakes || 0}.
        </p>
        <p className="mt-6 text-5xl font-black text-[#ffd75f]">{(result?.score || 0).toLocaleString('ru-RU')}</p>
        <p className="mt-1 text-[10px] font-black uppercase tracking-[.16em] text-white/40">очков</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          {nextLevel && (
            <button type="button" onClick={() => start(nextLevel.id)} className="min-h-[54px] rounded-full bg-gradient-to-r from-[#ffd75f] to-[#ff8d5f] px-7 text-sm font-black text-[#07152e]">
              Следующая миссия: {nextLevel.title} →
            </button>
          )}
          <button type="button" onClick={() => start()} className="min-h-[54px] rounded-full border border-white/16 px-7 text-sm font-black">Пройти ещё раз</button>
          <button type="button" onClick={() => setView('map')} className="min-h-[54px] rounded-full border border-white/16 px-7 text-sm font-black">К карте миссий</button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[430px] select-none overflow-hidden rounded-[24px] bg-[#07152e] touch-none">
      <div ref={wrapRef} className="absolute inset-0">
        <canvas ref={canvasRef} className="h-full w-full" aria-label="Платформер Порталы Знайтона" />
      </div>
      <div className="pointer-events-none absolute left-3 right-3 top-3 flex items-start justify-between gap-2 sm:left-5 sm:right-5 sm:top-5">
        <div className="flex flex-col gap-2">
          <div className="w-[min(76vw,520px)] rounded-[20px] border border-[#83F4D8]/30 bg-[#07152ef2] px-4 py-3 text-white shadow-xl backdrop-blur-md sm:px-5 sm:py-4">
            <p className="text-[9px] font-black uppercase tracking-[.18em] text-[#83F4D8]">Задание миссии</p>
            <p className="mt-1.5 text-sm font-black leading-5 sm:text-base sm:leading-6">{hud.phase}</p>
          </div>
          <div className="flex gap-2">
          <div className="rounded-full border border-white/14 bg-[#07152ed9] px-3 py-2 text-xs font-black text-white shadow-lg backdrop-blur" title="Собранные шестерёнки">⚙ {hud.coins}</div>
          <div className="rounded-full border border-white/14 bg-[#07152ed9] px-3 py-2 text-xs font-black text-[#fff09c] shadow-lg backdrop-blur">✦ {hud.stars}/3</div>
          <div className="rounded-full border border-[#83F4D8]/20 bg-[#07152ed9] px-3 py-2 text-xs font-black text-[#83F4D8] shadow-lg backdrop-blur">🎓 {hud.skills}/{hud.skillTotal}</div>
          </div>
        </div>
        <div className="rounded-full border border-white/14 bg-[#07152ed9] px-3 py-2 text-xs font-black text-white shadow-lg backdrop-blur">
          {'♥'.repeat(hud.hearts)} <span className="text-white/30">{'♥'.repeat(3 - hud.hearts)}</span>
        </div>
      </div>
      {hud.feedback && (
        <div
          key={hud.feedback.id}
          className={`pointer-events-none absolute left-1/2 top-[28%] w-[min(88%,560px)] -translate-x-1/2 rounded-[24px] border-2 px-5 py-4 text-center text-white shadow-[0_24px_70px_rgba(0,0,0,.45)] backdrop-blur-md sm:px-7 sm:py-5 ${
            hud.feedback.type === 'correct'
              ? 'border-[#8effcf] bg-[#075f49]/95'
              : hud.feedback.type === 'part'
                ? 'border-[#8deeff] bg-[#174f73]/95'
                : 'border-[#ffc3c8] bg-[#852f43]/95'
          }`}
          role="status"
          aria-live="polite"
        >
          <p className="text-3xl" aria-hidden>{hud.feedback.type === 'correct' ? '✓' : hud.feedback.type === 'part' ? '★' : '↻'}</p>
          <p className="mt-1 text-xl font-black sm:text-2xl">{hud.feedback.title}</p>
          <p className="mx-auto mt-2 max-w-md text-xs font-bold leading-5 text-white/85 sm:text-sm">{hud.feedback.detail}</p>
        </div>
      )}
      <div className="pointer-events-none absolute bottom-4 left-3 right-3 flex items-end justify-between sm:bottom-5 sm:left-5 sm:right-5">
        <div className="pointer-events-auto flex gap-2">
          <button type="button" aria-label="Идти влево" {...hold('left')} className="grid h-16 w-16 place-items-center rounded-[22px] border border-white/20 bg-[#07152ed9] text-2xl font-black text-white shadow-xl backdrop-blur active:scale-95">←</button>
          <button type="button" aria-label="Идти вправо" {...hold('right')} className="grid h-16 w-16 place-items-center rounded-[22px] border border-white/20 bg-[#07152ed9] text-2xl font-black text-white shadow-xl backdrop-blur active:scale-95">→</button>
        </div>
        <button type="button" aria-label="Прыжок" {...hold('jump')} className="pointer-events-auto grid h-[76px] w-[76px] place-items-center rounded-full border-4 border-[#ffd75f]/45 bg-gradient-to-br from-[#ffd75f] to-[#ff7b5f] text-xs font-black uppercase text-[#07152e] shadow-[0_16px_36px_rgba(255,151,76,.35)] active:scale-95">Прыжок</button>
      </div>
      <button type="button" onClick={() => setView('map')} className="absolute right-3 top-14 rounded-full border border-white/12 bg-[#07152ed9] px-3 py-2 text-[10px] font-black text-white/65 backdrop-blur sm:right-5 sm:top-16">Карта</button>
    </div>
  );
}
