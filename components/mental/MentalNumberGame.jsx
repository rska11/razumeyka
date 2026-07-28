'use client';

// Мини-игра «Путь Искры» — кампания из 12 уровней по ментальной арифметике.
// Уровни проходятся последовательно, за каждый дают до трёх звёзд, на уровень
// даётся три сердца (закончились — переигрывается только уровень, не вся игра).
// Первые 6 уровней бесплатны, дальше открывается вместе с курсом.
// Переиспользует интерактивный абакус Soroban — тот же, что и в уроках.

import { useEffect, useRef, useState } from 'react';
import { Soroban } from './Soroban.jsx';

const STORAGE_KEY = 'znayton_mental_quest_v1';
const TASKS_PER_LEVEL = 6;
const HEARTS = 3;
const FREE_LEVELS = 3;

// Типы заданий: set — набрать число, read — прочитать абакус (выбор ответа),
// flash — число мелькает и исчезает, calc — пример, friend — друзья десятки.
const LEVELS = [
  // Первые три уровня бесплатны, поэтому дают три РАЗНЫЕ механики:
  // ввод числа, узнавание и память. Память — то, ради чего покупают курс.
  { id: 1, title: 'Первые бусины', note: 'Набери число 1–9', type: 'set', min: 1, max: 9, columns: 1 },
  { id: 2, title: 'Читаем абакус', note: 'Узнай число по бусинам', type: 'read', min: 1, max: 9, columns: 1 },
  { id: 3, title: 'Вспышка', note: 'Число исчезает — набери по памяти', type: 'flash', min: 1, max: 9, columns: 1, flashMs: 1600 },
  { id: 4, title: 'Старшая бусина', note: 'Синяя — это сразу пять', type: 'set', min: 5, max: 9, columns: 1 },
  { id: 5, title: 'Плюс и минус', note: 'Примеры в пределах 9', type: 'calc', min: 1, max: 9, columns: 1, deltas: [1, 2, -1, -2] },
  { id: 6, title: 'Друзья десятки', note: 'Сколько не хватает до 10', type: 'friend', columns: 1 },
  { id: 7, title: 'Десятки', note: 'Двузначные числа', type: 'set', min: 10, max: 99, columns: 2 },
  { id: 8, title: 'Читаем десятки', note: 'Два разряда сразу', type: 'read', min: 10, max: 99, columns: 2 },
  { id: 9, title: 'Быстрая вспышка', note: 'Двузначные по памяти', type: 'flash', min: 10, max: 99, columns: 2, flashMs: 1300 },
  { id: 10, title: 'Считаем дальше', note: 'Примеры до 20', type: 'calc', min: 5, max: 20, columns: 2, deltas: [1, 2, 3, -1, -2, -3] },
  { id: 11, title: 'Всё вместе', note: 'Задания вперемешку', type: 'mix', min: 10, max: 99, columns: 2 },
  { id: 12, title: 'Мастер счёта', note: 'Финал кампании', type: 'mix', min: 10, max: 99, columns: 2, flashMs: 1100 },
];

// Реплики лисёнка Искры — того же проводника, что в «Городе знаний».
const SPARK_HELLO = [
  'Двигай бусины к перекладине. Синяя сверху — это сразу пять!',
  'Не спеши: сначала посмотри на бусины, потом выбирай.',
  'Держи число в голове — подсматривать уже нельзя!',
  'Пятёрка сверху плюс нижние бусины — так собираются числа от 5 до 9.',
  'Сначала посчитай, потом набирай ответ.',
  'До десяти всегда не хватает ровно столько же — запомни пары.',
  'Слева десятки, справа единицы. Набирай по очереди.',
  'Смотри на оба разряда сразу — это уже почти магия.',
  'Успел разглядеть? Набирай смело.',
  'Считай спокойно, абакус подождёт.',
  'Здесь будет всё сразу — ты уже умеешь.',
  'Последний рывок. Ты прошёл весь путь!',
];

function rnd(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeOptions(answer, min, max) {
  const options = new Set([answer]);
  const spread = Math.max(2, Math.round((max - min) / 5));
  let guard = 0;
  while (options.size < 4 && guard < 90) {
    const delta = rnd(1, spread);
    const candidate = Math.random() < 0.5 ? answer - delta : answer + delta;
    if (candidate >= min && candidate <= max) options.add(candidate);
    guard += 1;
  }
  let filler = min;
  while (options.size < 4 && filler <= max) {
    options.add(filler);
    filler += 1;
  }
  return [...options].sort(() => Math.random() - 0.5);
}

function buildTask(level, previousAnswer) {
  const type = level.type === 'mix' ? ['set', 'read', 'flash', 'calc'][rnd(0, 3)] : level.type;
  const columns = level.columns;

  if (type === 'friend') {
    let base;
    let guard = 0;
    do {
      base = rnd(1, 9);
      guard += 1;
    } while (10 - base === previousAnswer && guard < 40);
    return {
      type: 'friend',
      answer: 10 - base,
      prompt: String(base),
      question: 'Сколько не хватает до 10?',
      options: makeOptions(10 - base, 1, 9),
      columns: 1,
    };
  }

  const min = level.min ?? 1;
  const max = level.max ?? (columns === 2 ? 99 : 9);

  if (type === 'calc') {
    const deltas = level.deltas ?? [1, 2, -1, -2];
    let start;
    let delta;
    let answer;
    let guard = 0;
    do {
      start = rnd(min, max);
      delta = deltas[rnd(0, deltas.length - 1)];
      answer = start + delta;
      guard += 1;
    } while ((answer < 1 || answer > max || answer === previousAnswer) && guard < 60);
    return {
      type: 'calc',
      answer,
      prompt: `${start} ${delta > 0 ? '+' : '−'} ${Math.abs(delta)}`,
      question: 'Реши пример и набери ответ',
      columns,
    };
  }

  let answer;
  let guard = 0;
  do {
    answer = rnd(min, max);
    guard += 1;
  } while (answer === previousAnswer && guard < 40);

  if (type === 'read') {
    return {
      type: 'read',
      answer,
      question: 'Какое число набрано на абакусе?',
      options: makeOptions(answer, min, max),
      columns,
    };
  }

  if (type === 'flash') {
    return {
      type: 'flash',
      answer,
      prompt: String(answer),
      question: 'Запомни число и набери его',
      columns,
      flashMs: level.flashMs ?? 1500,
    };
  }

  return {
    type: 'set',
    answer,
    prompt: String(answer),
    question: 'Набери это число на абакусе',
    columns,
  };
}

function starsFor(mistakes) {
  if (mistakes === 0) return 3;
  if (mistakes === 1) return 2;
  return 1;
}

function playTone(kind) {
  if (typeof window === 'undefined') return;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return;

  const context = new Ctx();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const tones = { success: 660, star: 880, wrong: 240 };
  oscillator.type = 'sine';
  oscillator.frequency.value = tones[kind] ?? 440;
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.11, context.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + (kind === 'wrong' ? 0.14 : 0.24));
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.26);
  oscillator.addEventListener('ended', () => context.close());
}

function Stars({ count, size = 'sm' }) {
  return (
    <span className={`mq-stars mq-stars-${size}`} aria-label={`${count} из 3 звёзд`}>
      {[1, 2, 3].map((i) => (
        <i key={i} className={i <= count ? 'mq-star-on' : ''} aria-hidden>
          ★
        </i>
      ))}
    </span>
  );
}

export function MentalNumberGame({ hasSubscription = false, onComplete, className = '' }) {
  const [ready, setReady] = useState(false);
  const [stars, setStars] = useState({});
  const [soundOn, setSoundOn] = useState(true);
  const [view, setView] = useState('map'); // map | play | win | fail
  const [levelId, setLevelId] = useState(1);
  const [taskIndex, setTaskIndex] = useState(0);
  const [hearts, setHearts] = useState(HEARTS);
  const [mistakes, setMistakes] = useState(0);
  const [task, setTask] = useState(null);
  const [value, setValue] = useState(0);
  const [status, setStatus] = useState('input'); // input | correct | wrong
  const [flashVisible, setFlashVisible] = useState(true);
  const [replayUsed, setReplayUsed] = useState(false);
  const advanceTimer = useRef(null);

  const level = LEVELS.find((item) => item.id === levelId) ?? LEVELS[0];
  const maxUnlocked = LEVELS.reduce(
    (acc, item) => (stars[item.id] ? Math.max(acc, item.id + 1) : acc),
    1,
  );

  function isOpen(id) {
    if (id > FREE_LEVELS && !hasSubscription) return false;
    return id <= maxUnlocked;
  }

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      if (saved && typeof saved === 'object') {
        if (saved.stars && typeof saved.stars === 'object') setStars(saved.stars);
        if (typeof saved.sound === 'boolean') setSoundOn(saved.sound);
      }
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => () => {
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
  }, []);

  // Вспышка: показать число и спрятать. Перезапускается на каждом задании.
  useEffect(() => {
    if (view !== 'play' || task?.type !== 'flash') {
      setFlashVisible(true);
      return undefined;
    }
    setFlashVisible(true);
    const timer = window.setTimeout(() => setFlashVisible(false), task.flashMs);
    return () => window.clearTimeout(timer);
  }, [view, task]);

  function persist(nextStars, nextSound = soundOn) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ stars: nextStars, sound: nextSound }));
    } catch {}
  }

  function toggleSound() {
    setSoundOn((prev) => {
      const next = !prev;
      persist(stars, next);
      return next;
    });
  }

  function startLevel(id) {
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    const target = LEVELS.find((item) => item.id === id) ?? LEVELS[0];
    setLevelId(id);
    setTaskIndex(0);
    setHearts(HEARTS);
    setMistakes(0);
    setTask(buildTask(target));
    setValue(0);
    setStatus('input');
    setReplayUsed(false);
    setView('play');
  }

  function finishLevel(finalMistakes) {
    const earned = starsFor(finalMistakes);
    const nextStars = { ...stars, [levelId]: Math.max(stars[levelId] ?? 0, earned) };
    setStars(nextStars);
    persist(nextStars);
    setView('win');
    if (soundOn) playTone('star');
    onComplete?.({ level: levelId, stars: earned, mistakes: finalMistakes });
  }

  function nextTask(currentMistakes) {
    if (taskIndex + 1 >= TASKS_PER_LEVEL) {
      finishLevel(currentMistakes);
      return;
    }
    setTaskIndex((i) => i + 1);
    setTask(buildTask(level, task?.answer));
    setValue(0);
    setStatus('input');
    setReplayUsed(false);
  }

  function registerCorrect() {
    setStatus('correct');
    if (soundOn) playTone('success');
    advanceTimer.current = window.setTimeout(() => {
      advanceTimer.current = null;
      nextTask(mistakes);
    }, 780);
  }

  function registerWrong() {
    const nextHearts = hearts - 1;
    const nextMistakes = mistakes + 1;
    setHearts(nextHearts);
    setMistakes(nextMistakes);
    setStatus('wrong');
    if (soundOn) playTone('wrong');

    advanceTimer.current = window.setTimeout(() => {
      advanceTimer.current = null;
      if (nextHearts <= 0) {
        setView('fail');
        return;
      }
      // Возвращаем управление: бусины снова двигаются, можно ответить заново.
      setStatus('input');
    }, 900);
  }

  function checkAbacus() {
    if (status !== 'input' || !task) return;
    if (value === task.answer) registerCorrect();
    else registerWrong();
  }

  function chooseOption(option) {
    if (status !== 'input' || !task) return;
    setValue(option);
    if (option === task.answer) registerCorrect();
    else registerWrong();
  }

  function replayFlash() {
    if (replayUsed) return;
    setReplayUsed(true);
    setFlashVisible(true);
    window.setTimeout(() => setFlashVisible(false), task.flashMs);
  }

  const totalStars = Object.values(stars).reduce((sum, n) => sum + n, 0);
  const maxStars = LEVELS.length * 3;
  const isChoice = task?.type === 'read' || task?.type === 'friend';
  const showPrompt = task?.type !== 'flash' || flashVisible;

  // ── Карта уровней ─────────────────────────────────────────────────────────
  if (view === 'map') {
    return (
      <div className={`mental-quest ${className}`}>
        <div className="mental-quest-head">
          <div>
            <span className="mental-quest-kicker">Игра · бесплатно · без регистрации</span>
            <h3>Путь Искры</h3>
            <p>
              Двенадцать уровней на абакусе: набирай числа, читай бусины, считай по памяти.
              За каждый уровень — до трёх звёзд.
            </p>
          </div>
          <div className="mental-quest-score">
            <span>Собрано звёзд</span>
            <strong>{ready ? totalStars : 0} <small>/ {maxStars}</small></strong>
            <button type="button" onClick={toggleSound} aria-pressed={soundOn}>
              {soundOn ? '🔊 Звук' : '🔇 Без звука'}
            </button>
          </div>
        </div>

        <div className="mental-quest-map">
          {LEVELS.map((item) => {
            const open = ready && isOpen(item.id);
            const earned = stars[item.id] ?? 0;
            const paywalled = item.id > FREE_LEVELS && !hasSubscription;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => (open ? startLevel(item.id) : null)}
                disabled={!open}
                className={`mental-quest-node ${open ? 'is-open' : 'is-locked'} ${earned ? 'is-done' : ''}`}
              >
                <span className="mental-quest-node-num">{open || !paywalled ? item.id : '🔒'}</span>
                <b>{item.title}</b>
                <small>{item.note}</small>
                {open ? <Stars count={earned} /> : <em>{paywalled ? 'В курсе' : 'Закрыто'}</em>}
              </button>
            );
          })}
        </div>

        {!hasSubscription && (
          <p className="mental-quest-teaser">
            Уровни 1–3 открыты всем. Память, примеры, двузначные числа и финал кампании открываются вместе с курсом —{' '}
            <a href="#podpiska">посмотреть доступ</a>
          </p>
        )}
      </div>
    );
  }

  // ── Уровень пройден ───────────────────────────────────────────────────────
  if (view === 'win') {
    const earned = starsFor(mistakes);
    const nextId = levelId + 1;
    const nextExists = LEVELS.some((item) => item.id === nextId);
    const nextPaywalled = nextId > FREE_LEVELS && !hasSubscription;
    return (
      <div className={`mental-quest ${className}`}>
        <div className="mental-quest-result">
          <span className="mental-quest-fox" aria-hidden>🦊</span>
          <h3>Уровень {levelId} пройден!</h3>
          <Stars count={earned} size="lg" />
          <p>
            {earned === 3
              ? 'Ни одной ошибки. Это уровень мастера!'
              : earned === 2
                ? 'Отличная работа — почти без ошибок.'
                : 'Уровень взят! Пройди ещё раз на три звезды.'}
          </p>
          <div className="mental-quest-result-actions">
            {nextExists && !nextPaywalled && (
              <button type="button" className="mental-quest-primary" onClick={() => startLevel(nextId)}>
                Уровень {nextId} →
              </button>
            )}
            {nextExists && nextPaywalled && (
              <a className="mental-quest-primary" href="#podpiska">
                Открыть остальные уровни →
              </a>
            )}
            {!nextExists && (
              <a className="mental-quest-primary" href="#podpiska">
                Пройти весь курс →
              </a>
            )}
            <button type="button" className="mental-quest-ghost" onClick={() => startLevel(levelId)}>
              Ещё раз
            </button>
            <button type="button" className="mental-quest-ghost" onClick={() => setView('map')}>
              К карте
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Сердечки кончились ────────────────────────────────────────────────────
  if (view === 'fail') {
    return (
      <div className={`mental-quest ${className}`}>
        <div className="mental-quest-result">
          <span className="mental-quest-fox" aria-hidden>🦊</span>
          <h3>Почти получилось!</h3>
          <p>Искра говорит: такие числа берут со второй попытки. Попробуем этот уровень ещё раз?</p>
          <div className="mental-quest-result-actions">
            <button type="button" className="mental-quest-primary" onClick={() => startLevel(levelId)}>
              Пробуем снова →
            </button>
            <button type="button" className="mental-quest-ghost" onClick={() => setView('map')}>
              К карте
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Игровой экран ─────────────────────────────────────────────────────────
  return (
    <div className={`mental-quest ${className}`}>
      <div className="mental-quest-bar">
        <button type="button" className="mental-quest-back" onClick={() => setView('map')} aria-label="К карте уровней">
          ←
        </button>
        <div className="mental-quest-bar-info">
          <b>{level.id}. {level.title}</b>
          <span>Задание {taskIndex + 1} из {TASKS_PER_LEVEL}</span>
        </div>
        <div className="mental-quest-hearts" aria-label={`Осталось попыток: ${hearts}`}>
          {[1, 2, 3].map((i) => (
            <i key={i} className={i <= hearts ? '' : 'is-lost'} aria-hidden>♥</i>
          ))}
        </div>
      </div>

      <div className="mental-quest-progress">
        <div style={{ width: `${(taskIndex / TASKS_PER_LEVEL) * 100}%` }} />
      </div>

      <p className="mental-quest-question" aria-live="polite">{task?.question}</p>

      {task?.type === 'friend' && (
        <div className="mental-quest-prompt mental-quest-prompt-friend">
          <strong>{task.prompt}</strong>
          <span>+ ? = 10</span>
        </div>
      )}

      {(task?.type === 'set' || task?.type === 'flash' || task?.type === 'calc') && (
        <div className="mental-quest-prompt">
          <strong>{showPrompt ? task.prompt : '···'}</strong>
          {task.type === 'flash' && !flashVisible && !replayUsed && status === 'input' && (
            <button type="button" onClick={replayFlash}>Показать ещё раз</button>
          )}
        </div>
      )}

      {task?.type === 'read' ? (
        <Soroban value={task.answer} columns={task.columns} interactive={false} className="mental-quest-abacus" />
      ) : isChoice ? null : (
        <Soroban
          value={value}
          columns={task?.columns ?? 1}
          onChange={status === 'input' ? setValue : undefined}
          interactive={status === 'input'}
          className="mental-quest-abacus"
        />
      )}

      {isChoice ? (
        <div className="mental-quest-options">
          {task.options.map((option) => (
            <button
              type="button"
              key={option}
              onClick={() => chooseOption(option)}
              disabled={status !== 'input'}
              className={status !== 'input' && option === task.answer ? 'is-right' : status === 'wrong' && option === value ? 'is-wrong' : ''}
            >
              {option}
            </button>
          ))}
        </div>
      ) : (
        <button
          type="button"
          className="mental-quest-check"
          onClick={checkAbacus}
          disabled={status !== 'input'}
        >
          Проверить
        </button>
      )}

      <p className={`mental-quest-feedback is-${status}`} aria-live="polite">
        {status === 'correct' && 'Верно! Звезда ближе ⭐'}
        {status === 'wrong' && (hearts > 0 ? 'Не то число. Посмотри ещё раз и попробуй!' : 'Сердечки кончились — переиграем уровень.')}
        {status === 'input' && (
          <span className="mental-quest-spark">
            <i aria-hidden>🦊</i> {SPARK_HELLO[levelId - 1]}
          </span>
        )}
      </p>
    </div>
  );
}
