'use client';

// Проигрыватель одного урока ментальной арифметики.
// Всё происходит на экране: наставник объясняет, ребёнок двигает бусины
// интерактивного абакуса и отвечает на вопросы кнопками. В конце — «покажи
// родителю» (живая похвала вместо оценок), как в уроках рисования.
//
// Типы шагов (контракт описан в data/mental-lessons.js):
//   teach — объяснение с показом числа на абакусе (или картинки-эмодзи для дня 0);
//   set   — «набери число» на интерактивном абакусе (авто-проверка);
//   read  — «какое число на абакусе?» с кнопками-вариантами;
//   flash — флеш-карты (числа мелькают, ребёнок называет);
//   solve — пример-цепочка, опционально с абакусом-помощником;
//   count — «посчитай предметы» (эмодзи, без абакуса — ступень 0).
//
// paceFactor — возрастной множитель темпа (mentalAgeBands): растягивает показ
// флеш-карт для младших. Контент от возраста не меняется.

import { useEffect, useMemo, useRef, useState } from 'react';
import { Soroban, columnsFor } from './Soroban.jsx';

const VOICED_KEY = 'razumeyka_mental_voiced';

function chainSum(chain) {
  return chain.reduce((a, b) => a + b, 0);
}

function chainLabel(chain) {
  return chain
    .map((n, i) => (i === 0 ? String(n) : n < 0 ? ` − ${Math.abs(n)}` : ` + ${n}`))
    .join('');
}

function answerFor(step) {
  if (step.type === 'read') return step.value;
  if (step.type === 'flash') return chainSum(step.cards);
  if (step.type === 'solve') return chainSum(step.chain);
  if (step.type === 'count') return step.n;
  return null;
}

// Автоварианты ответа: правильный + два «соседних» (можно переопределить step.options).
function makeOptions(step) {
  const answer = answerFor(step);
  if (Array.isArray(step.options) && step.options.length) return step.options;
  const pool = [answer - 2, answer - 1, answer + 1, answer + 2].filter((n) => n >= 0 && n !== answer);
  const picks = [];
  while (picks.length < 2 && pool.length) {
    picks.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  }
  const options = [answer, ...picks];
  for (let i = options.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return options;
}

// Сколько разрядов абакуса нужно уроку (по самому большому числу в шагах).
function lessonColumns(lesson) {
  let max = 9;
  for (const s of lesson.steps ?? []) {
    if (s.type === 'teach') max = Math.max(max, s.show ?? 0);
    if (s.type === 'set') max = Math.max(max, s.target);
    if (s.type === 'read') max = Math.max(max, s.value);
    if (s.type === 'flash') max = Math.max(max, ...s.cards);
    if (s.type === 'solve') {
      let acc = 0;
      for (const n of s.chain) {
        acc += n;
        max = Math.max(max, acc);
      }
    }
  }
  return columnsFor(max);
}

const INTERACTIVE_TYPES = new Set(['set', 'read', 'flash', 'solve', 'count']);

// ——— Кнопки-варианты ответа (read / flash / solve) ———
function AnswerButtons({ options, answer, onCorrect }) {
  const [picked, setPicked] = useState(null); // последний неверный выбор
  const [ok, setOk] = useState(false);
  const missesRef = useRef(0);

  function pick(n) {
    if (ok) return;
    if (n === answer) {
      setOk(true);
      onCorrect(missesRef.current === 0);
    } else {
      missesRef.current += 1;
      setPicked(n);
    }
  }

  return (
    <div className="mt-3">
      <div className="flex items-center justify-center gap-3">
        {options.map((n) => (
          <button
            key={n}
            onClick={() => pick(n)}
            disabled={ok}
            className={`grid h-14 w-14 place-items-center rounded-2xl border-2 font-display text-2xl font-extrabold transition ${
              ok && n === answer
                ? 'border-brand-green bg-brand-green/12 text-brand-green'
                : picked === n
                  ? 'border-brand-red/50 bg-brand-red/8 text-brand-red'
                  : 'border-ink/12 bg-white text-ink hover:-translate-y-0.5 hover:border-brand-blue/45'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <p className="mt-2 min-h-[20px] text-center text-sm font-bold">
        {ok ? (
          <span className="text-brand-green">Верно! 🎉</span>
        ) : picked != null ? (
          <span className="text-brand-red">Почти! Посмотри ещё раз и попробуй снова.</span>
        ) : null}
      </p>
    </div>
  );
}

// ——— Шаги ———
function TeachStep({ step, columns }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      {step.show != null ? (
        <Soroban value={step.show} columns={columns} interactive={false} className="h-[240px] w-auto sm:h-[280px]" />
      ) : step.picture ? (
        <p className="text-center text-6xl leading-tight tracking-wide sm:text-7xl">{step.picture}</p>
      ) : null}
    </div>
  );
}

function CountStep({ step, onSolved }) {
  const options = useMemo(() => makeOptions(step), [step]);
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="flex max-w-[280px] flex-wrap items-center justify-center gap-2 rounded-[20px] bg-cream/60 p-5">
        {Array.from({ length: step.n }).map((_, i) => (
          <span key={i} className="text-5xl">{step.emoji}</span>
        ))}
      </div>
      <AnswerButtons options={options} answer={step.n} onCorrect={onSolved} />
    </div>
  );
}

function SetStep({ step, columns, onSolved }) {
  const [value, setValue] = useState(0);
  const solved = value === step.target;

  useEffect(() => {
    if (solved) onSolved();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solved]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="mb-3 flex items-center gap-2">
        <span className="rounded-full bg-brand-blue/10 px-4 py-1.5 text-sm font-extrabold text-brand-blue">
          Набери число {step.target}
        </span>
        <button
          onClick={() => setValue(0)}
          className="rounded-full border border-ink/12 bg-white px-3 py-1.5 text-xs font-extrabold text-ink/55 transition hover:bg-ink/5"
        >
          Сбросить
        </button>
      </div>
      <Soroban value={value} onChange={setValue} columns={columns} className="h-[220px] w-auto sm:h-[260px]" />
      <p className={`mt-3 min-h-[24px] text-sm font-extrabold ${solved ? 'text-brand-green' : 'text-ink/45'}`}>
        {solved ? `Точно! Это ${step.target} 🎉` : `Сейчас набрано: ${value}`}
      </p>
    </div>
  );
}

function ReadStep({ step, columns, onSolved }) {
  const options = useMemo(() => makeOptions(step), [step]);
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <Soroban value={step.value} columns={columns} interactive={false} className="h-[200px] w-auto sm:h-[240px]" />
      <AnswerButtons options={options} answer={step.value} onCorrect={onSolved} />
    </div>
  );
}

function FlashStep({ step, columns, onSolved, paceFactor = 1 }) {
  const [phase, setPhase] = useState('idle'); // idle | flashing | answer
  const [card, setCard] = useState(null);
  const timers = useRef([]);
  const options = useMemo(() => makeOptions(step), [step]);
  const answer = chainSum(step.cards);
  const speed = Math.round((step.speedMs ?? 1400) * paceFactor);
  const view = step.view ?? 'abacus';

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function play() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPhase('flashing');
    setCard(null);
    step.cards.forEach((n, i) => {
      timers.current.push(setTimeout(() => setCard(n), i * (speed + 250)));
      timers.current.push(setTimeout(() => setCard(null), i * (speed + 250) + speed));
    });
    timers.current.push(setTimeout(() => setPhase('answer'), step.cards.length * (speed + 250)));
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="grid min-h-[190px] w-full max-w-[240px] place-items-center rounded-[20px] bg-gradient-to-br from-brand-blue/8 to-brand-purple/8 p-4">
        {phase === 'idle' && (
          <button onClick={play} className="primary-btn">Показывай! ⚡</button>
        )}
        {phase === 'flashing' &&
          (card == null ? (
            <span className="text-4xl">👀</span>
          ) : view === 'digits' ? (
            <span className="font-display text-7xl font-black text-brand-blue">{card}</span>
          ) : (
            <Soroban value={card} columns={columns} interactive={false} className="h-[170px] w-auto" />
          ))}
        {phase === 'answer' && (
          <p className="text-center text-base font-extrabold text-ink/70">
            {step.cards.length > 1 ? 'Сколько получилось всего?' : 'Какое число мелькнуло?'}
          </p>
        )}
      </div>
      {phase === 'answer' && (
        <>
          <AnswerButtons options={options} answer={answer} onCorrect={onSolved} />
          <button onClick={play} className="mt-1 text-xs font-extrabold text-ink/45 transition hover:text-ink">
            ↻ Показать ещё раз
          </button>
        </>
      )}
    </div>
  );
}

function SolveStep({ step, columns, onSolved }) {
  const [value, setValue] = useState(0);
  const options = useMemo(() => makeOptions(step), [step]);
  const answer = chainSum(step.chain);

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <p className="font-display text-4xl font-extrabold tracking-wide text-ink">
        {chainLabel(step.chain)} = <span className="text-brand-blue">?</span>
      </p>
      {step.useAbacus && (
        <Soroban value={value} onChange={setValue} columns={columns} className="mt-3 h-[190px] w-auto sm:h-[220px]" />
      )}
      <AnswerButtons options={options} answer={answer} onCorrect={onSolved} />
    </div>
  );
}

// ——— Плеер ———
export function MentalLessonPlayer({ lesson, nextLesson, onComplete, onNext, onClose, paceFactor = 1 }) {
  const steps = lesson.steps ?? [];
  const total = steps.length;
  const columns = useMemo(() => lessonColumns(lesson), [lesson]);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  // passed[i]: true = шаг пройден; 'star' = пройден с первой попытки
  const [passed, setPassed] = useState({});
  const [voiceOn, setVoiceOn] = useState(false);
  const audioRef = useRef(null);
  const voiceOnRef = useRef(false);

  const starTotal = steps.filter((s) => INTERACTIVE_TYPES.has(s.type)).length;
  const stars = Object.values(passed).filter((v) => v === 'star').length;

  useEffect(() => {
    voiceOnRef.current = voiceOn;
  }, [voiceOn]);

  function stopVoice() {
    audioRef.current?.pause();
    audioRef.current = null;
  }

  // Озвучка только готовым mp3 (Yandex SpeechKit), как в рисовании:
  // нет файла — тишина, браузерный робо-голос не используем.
  function speak(kind, index = step) {
    const text = kind === 'parent' ? lesson.parentNote : steps[index]?.say ?? steps[index]?.text;
    if (typeof window === 'undefined' || !text) return;
    stopVoice();
    const src =
      kind === 'parent'
        ? `/audio/mental/${lesson.slug}/parent.mp3`
        : `/audio/mental/${lesson.slug}/step-${index + 1}.mp3`;
    const audio = new Audio(src);
    audioRef.current = audio;
    audio.play().catch(() => {});
  }

  // Первое открытие урока — голос автоматом, дальше по кнопке (метка в localStorage).
  useEffect(() => {
    let firstEver = false;
    try {
      const set = new Set(JSON.parse(localStorage.getItem(VOICED_KEY) || '[]'));
      if (!set.has(lesson.slug)) {
        firstEver = true;
        set.add(lesson.slug);
        localStorage.setItem(VOICED_KEY, JSON.stringify([...set]));
      }
    } catch {}
    if (firstEver) {
      setVoiceOn(true);
      voiceOnRef.current = true;
      speak('step', 0);
    }
    return stopVoice;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function goTo(index) {
    stopVoice();
    setStep(index);
    if (voiceOnRef.current) speak('step', index);
  }

  function markPassed(index, firstTry) {
    setPassed((prev) => (prev[index] ? prev : { ...prev, [index]: firstTry ? 'star' : true }));
  }

  function finish() {
    stopVoice();
    setDone(true);
    onComplete?.(lesson.slug);
    if (voiceOnRef.current) speak('parent');
  }

  function toggleVoice() {
    setVoiceOn((v) => {
      const nv = !v;
      if (nv) speak('step', step);
      else stopVoice();
      return nv;
    });
  }

  const current = steps[step];
  const currentDone = !current || !INTERACTIVE_TYPES.has(current.type) || Boolean(passed[step]);
  const lastStep = step >= total - 1;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/45 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Урок: ${lesson.title}`}
    >
      <div
        className={`relative flex ${done ? 'max-h-[92vh]' : 'h-[92vh]'} w-full max-w-md flex-col overflow-hidden rounded-[26px] border border-white/80 bg-white shadow-luxe`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-ink/8 px-5 py-4">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-blue/10 text-2xl">{lesson.cover?.emoji ?? '🧮'}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-lg font-extrabold text-ink">{lesson.title}</p>
            <p className="text-xs font-bold text-ink/48">{lesson.skill}</p>
          </div>
          <button onClick={onClose} aria-label="Закрыть" className="grid h-9 w-9 place-items-center rounded-full border border-ink/10 text-ink/50 transition hover:bg-ink/5">✕</button>
        </div>

        <div className={done ? 'overflow-y-auto px-5 py-5' : 'flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4 sm:px-5'}>
          {!done && (
            <>
              <div className="mb-2 flex items-center justify-center gap-2">
                <button
                  onClick={toggleVoice}
                  aria-pressed={voiceOn}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-extrabold transition ${
                    voiceOn ? 'border-brand-blue/40 bg-brand-blue/10 text-brand-blue' : 'border-ink/12 bg-white text-ink/60 hover:bg-ink/5'
                  }`}
                >
                  {voiceOn ? '🔊 Голос включён' : '🔇 Озвучить'}
                </button>
                <span className="rounded-full bg-cream/80 px-3.5 py-1.5 text-xs font-extrabold text-ink/50">
                  ⭐ {stars}/{starTotal}
                </span>
              </div>

              <div className="mb-2 flex items-center justify-center gap-2">
                {steps.map((_, i) => (
                  <span key={i} className={`h-2.5 w-2.5 rounded-full transition ${i <= step ? 'bg-brand-blue' : 'bg-ink/14'}`} />
                ))}
              </div>

              <p className="min-h-[44px] text-center text-sm font-semibold leading-6 text-ink/74 sm:text-base">{current?.text}</p>

              {current?.type === 'teach' && <TeachStep step={current} columns={columns} />}
              {current?.type === 'set' && (
                <SetStep key={step} step={current} columns={columns} onSolved={() => markPassed(step, true)} />
              )}
              {current?.type === 'read' && (
                <ReadStep key={step} step={current} columns={columns} onSolved={(first) => markPassed(step, first)} />
              )}
              {current?.type === 'flash' && (
                <FlashStep key={step} step={current} columns={columns} paceFactor={paceFactor} onSolved={(first) => markPassed(step, first)} />
              )}
              {current?.type === 'solve' && (
                <SolveStep key={step} step={current} columns={columns} onSolved={(first) => markPassed(step, first)} />
              )}
              {current?.type === 'count' && (
                <CountStep key={step} step={current} onSolved={(first) => markPassed(step, first)} />
              )}

              <div className="mt-3 flex flex-none items-center gap-3">
                <button
                  onClick={() => goTo(Math.max(0, step - 1))}
                  disabled={step === 0}
                  className="grid h-12 w-12 flex-none place-items-center rounded-full border-2 border-ink/12 text-ink/60 transition enabled:hover:bg-ink/5 disabled:opacity-30"
                  aria-label="Назад"
                >
                  ←
                </button>
                {lastStep ? (
                  <button onClick={finish} disabled={!currentDone} className="primary-btn h-12 min-h-0 flex-1 disabled:opacity-40">
                    Я справился ✓
                  </button>
                ) : (
                  <button
                    onClick={() => goTo(step + 1)}
                    disabled={!currentDone}
                    className="primary-btn h-12 min-h-0 flex-1 disabled:opacity-40"
                  >
                    Дальше →
                  </button>
                )}
              </div>
            </>
          )}

          {done && (
            <div className="animate-softPop text-center">
              <div className="text-6xl">🌟</div>
              <p className="mt-3 font-display text-2xl font-extrabold text-ink">Готово! Молодец</p>
              {starTotal > 0 && (
                <p className="mt-2 text-sm font-extrabold text-ink/55">
                  Собрано звёзд: {stars} из {starTotal}
                  {stars === starTotal ? ' — все с первой попытки! 🏆' : ''}
                </p>
              )}

              <div className="mt-4 rounded-2xl bg-brand-green/10 px-5 py-4 text-left">
                <p className="text-sm font-extrabold text-brand-green">Покажи родителю 💚</p>
                <p className="mt-1 text-sm font-semibold leading-6 text-ink/70">{lesson.parentNote}</p>
              </div>

              {nextLesson ? (
                <button onClick={onNext} className="primary-btn mt-5 w-full">
                  Следующий урок: {nextLesson.title} →
                </button>
              ) : (
                <p className="mt-5 text-sm font-semibold text-ink/54">Это последний открытый урок на сегодня.</p>
              )}
              <button onClick={onClose} className="mt-3 w-full text-sm font-extrabold text-ink/50 transition hover:text-ink">
                Вернуться к урокам
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
