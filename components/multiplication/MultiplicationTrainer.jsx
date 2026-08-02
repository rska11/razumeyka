'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { reachGoal } from '@/lib/metrika';
import { MULTIPLICATION_STORAGE_KEY, multiplicationStages } from '@/data/multiplication-course.js';

const TABLES = [2, 3, 4, 5, 6, 7, 8, 9];
const FACTORS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const REVIEW_INTERVALS = [0, 10 * 60 * 1000, 24 * 60 * 60 * 1000, 3 * 24 * 60 * 60 * 1000, 7 * 24 * 60 * 60 * 1000, 14 * 24 * 60 * 60 * 1000];
const INPUT_MODES = new Set(['direct', 'missing', 'division', 'family']);

const defaultProgress = { facts: {}, stages: {}, sessions: 0 };

function factKey(a, b) {
  return `${a}x${b}`;
}

function readProgress() {
  if (typeof window === 'undefined') return defaultProgress;
  try {
    const saved = JSON.parse(window.localStorage.getItem(MULTIPLICATION_STORAGE_KEY) || 'null');
    return saved && typeof saved === 'object'
      ? { ...defaultProgress, ...saved, facts: saved.facts || {}, stages: saved.stages || {} }
      : defaultProgress;
  } catch {
    return defaultProgress;
  }
}

function saveProgress(progress) {
  try {
    window.localStorage.setItem(MULTIPLICATION_STORAGE_KEY, JSON.stringify(progress));
  } catch {}
}

function shuffle(values) {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function choicesFor(answer, a, b) {
  const candidates = [answer, answer + a, answer - a, answer + b, answer - b, answer + 1, answer - 1, a + b, Math.abs(a - b)];
  const unique = [];
  for (const value of candidates) {
    if (Number.isInteger(value) && value > 0 && value <= 100 && !unique.includes(value)) unique.push(value);
    if (unique.length === 4) break;
  }
  let fallback = 1;
  while (unique.length < 4) {
    if (!unique.includes(fallback)) unique.push(fallback);
    fallback += 1;
  }
  return shuffle(unique);
}

function pickFact(stage, progress) {
  let tables = stage.tables;
  if (stage.id === 'meaning') tables = [2, 3, 4];
  const pool = tables.flatMap((a) => FACTORS.map((b) => ({ a, b })));
  const now = Date.now();
  pool.sort((left, right) => {
    const leftFact = progress.facts[factKey(left.a, left.b)] || {};
    const rightFact = progress.facts[factKey(right.a, right.b)] || {};
    const leftDue = !leftFact.due || leftFact.due <= now ? 0 : 1;
    const rightDue = !rightFact.due || rightFact.due <= now ? 0 : 1;
    if (leftDue !== rightDue) return leftDue - rightDue;
    return (leftFact.strength || 0) - (rightFact.strength || 0);
  });
  return pool[Math.floor(Math.random() * Math.min(7, pool.length))];
}

function makeChallenge(stage, progress, roundIndex) {
  let { a, b } = pickFact(stage, progress);
  const mode = stage.modes[roundIndex % stage.modes.length];
  if ((mode === 'groups' || mode === 'array') && a > 5) [a, b] = [Math.min(b, 5), a];
  if (mode === 'sequence' && b < 4) b += 4;

  const product = a * b;
  let answer = product;
  let title = 'Найди произведение';
  let prompt = `${a} × ${b}`;
  let instruction = 'Выбери правильный ответ';
  let explanation = `${a} групп по ${b} — это ${product}.`;
  let visual = null;

  if (mode === 'groups') {
    title = 'Собери одинаковые группы';
    prompt = `${a} групп по ${b}`;
    instruction = 'Сколько предметов получилось всего?';
    visual = { type: 'groups', groups: a, amount: b };
    explanation = `${b} повторили ${a} раз: ${Array.from({ length: a }, () => b).join(' + ')} = ${product}.`;
  } else if (mode === 'array') {
    title = 'Прочитай прямоугольник';
    prompt = `${a} ряда по ${b}`;
    instruction = 'Сколько точек во всех рядах?';
    visual = { type: 'array', rows: a, columns: b };
    explanation = `${a} рядов по ${b} точки: ${a} × ${b} = ${product}.`;
  } else if (mode === 'repeated') {
    title = 'Замени сложение умножением';
    prompt = Array.from({ length: a }, () => b).join(' + ');
    instruction = 'Чему равна эта сумма?';
    explanation = `Число ${b} взяли ${a} раз, поэтому ${a} × ${b} = ${product}.`;
  } else if (mode === 'sequence') {
    const before = Array.from({ length: b - 1 }, (_, index) => a * (index + 1));
    title = 'Продолжи ряд';
    prompt = `${before.slice(Math.max(0, before.length - 4)).join(', ')}, …`;
    instruction = `Каждый раз прибавляем ${a}. Какое число следующее?`;
    explanation = `${a} прибавили ${b} раз и получили ${product}. Это ${a} × ${b}.`;
  } else if (mode === 'missing') {
    answer = b;
    title = 'Найди пропущенный множитель';
    prompt = `${a} × ? = ${product}`;
    instruction = `Сколько раз нужно взять ${a}?`;
    explanation = `${a} × ${b} = ${product}, поэтому пропущено число ${b}.`;
  } else if (mode === 'division') {
    answer = b;
    title = 'Раздели поровну';
    prompt = `${product} ÷ ${a}`;
    instruction = `Разложи ${product} на ${a} одинаковых групп`;
    explanation = `${a} × ${b} = ${product}, значит ${product} ÷ ${a} = ${b}.`;
  } else if (mode === 'family') {
    answer = a;
    title = 'Собери семейство примеров';
    prompt = `${a} × ${b} = ${product}`;
    instruction = `Если ${product} разделить на ${b}, что получится?`;
    explanation = `Из одного факта получаем обратный: ${product} ÷ ${b} = ${a}.`;
  } else if (mode === 'strategy') {
    title = 'Реши удобным способом';
    if (a === 9) {
      prompt = `10 × ${b} − ${b}`;
      explanation = `Десять групп по ${b} — это ${10 * b}. Убираем одну группу: ${10 * b} − ${b} = ${product}.`;
    } else if (a === 8 || a === 4) {
      prompt = `${a / 2} × ${b}, затем удвоить`;
      explanation = `${a / 2} × ${b} = ${(a / 2) * b}, удваиваем и получаем ${product}.`;
    } else if (a >= 6) {
      prompt = `5 × ${b} + ${a - 5} × ${b}`;
      explanation = `${5 * b} + ${(a - 5) * b} = ${product}. Так сложный пример собирается из знакомых частей.`;
    } else {
      prompt = `2 × ${b} + ${a - 2} × ${b}`;
      explanation = `${2 * b} + ${(a - 2) * b} = ${product}.`;
    }
    instruction = 'Сначала используй знакомый пример, затем выбери результат';
  } else if (mode === 'story') {
    const stories = [
      `В ${a} коробках лежит по ${b} карандашей. Сколько карандашей всего?`,
      `В зале ${a} рядов по ${b} стульев. Сколько всего стульев?`,
      `${a} детям дали по ${b} наклеек. Сколько наклеек раздали?`,
      `По дорожке едут ${a} вагончиков, в каждом по ${b} пассажиров. Сколько пассажиров?`,
    ];
    title = 'Задача из жизни';
    prompt = stories[roundIndex % stories.length];
    instruction = 'Найди одинаковые группы и выбери ответ';
    explanation = `Здесь ${a} одинаковых групп по ${b}: ${a} × ${b} = ${product}.`;
  }

  return {
    id: `${stage.id}-${roundIndex}-${Date.now()}`,
    a,
    b,
    mode,
    answer,
    title,
    prompt,
    instruction,
    explanation,
    visual,
    options: choicesFor(answer, a, b),
  };
}

function GroupsVisual({ groups, amount }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5" aria-label={`${groups} групп по ${amount}`}>
      {Array.from({ length: groups }, (_, group) => (
        <div key={group} className="flex min-h-[54px] min-w-[66px] flex-wrap items-center justify-center gap-1 rounded-[17px] border border-[#3978F6]/12 bg-white px-2.5 py-2 shadow-sm">
          {Array.from({ length: amount }, (_, item) => <i key={item} className="h-3.5 w-3.5 rounded-full bg-gradient-to-br from-[#3978F6] to-[#75C7FF] shadow-[0_3px_7px_rgba(57,120,246,.24)]" />)}
        </div>
      ))}
    </div>
  );
}

function ArrayVisual({ rows, columns }) {
  return (
    <div className="mx-auto grid w-fit gap-1.5 rounded-[22px] border border-[#7A59E8]/12 bg-white p-4 shadow-sm" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }} aria-label={`${rows} рядов по ${columns} точек`}>
      {Array.from({ length: rows * columns }, (_, index) => <i key={index} className="h-4 w-4 rounded-[5px] bg-gradient-to-br from-[#7A59E8] to-[#D264D8] sm:h-5 sm:w-5" />)}
    </div>
  );
}

function ConceptVisual({ challenge }) {
  if (challenge.visual?.type === 'groups') return <GroupsVisual groups={challenge.visual.groups} amount={challenge.visual.amount} />;
  if (challenge.visual?.type === 'array') return <ArrayVisual rows={challenge.visual.rows} columns={challenge.visual.columns} />;

  if (challenge.mode === 'repeated') {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: challenge.a }, (_, index) => (
          <span key={index} className="contents">
            <strong className="grid min-h-12 min-w-12 place-items-center rounded-2xl bg-[#EDF5FF] px-3 font-display text-xl text-brand-blue">{challenge.b}</strong>
            {index < challenge.a - 1 && <span className="font-display text-xl font-black text-ink/24">+</span>}
          </span>
        ))}
      </div>
    );
  }

  if (challenge.mode === 'sequence') {
    const start = Math.max(1, challenge.b - 4);
    const values = Array.from({ length: challenge.b - start }, (_, index) => challenge.a * (start + index));
    return (
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {values.map((value) => <span key={value} className="grid h-12 min-w-12 place-items-center rounded-full border border-[#3978F6]/14 bg-[#EDF5FF] px-3 font-display text-lg font-black text-brand-blue">{value}</span>)}
        <span className="h-1 w-6 rounded-full bg-ink/10" />
        <span className="grid h-14 min-w-14 place-items-center rounded-full bg-gradient-to-br from-[#3978F6] to-[#7A59E8] px-3 font-display text-2xl font-black text-white shadow-color">?</span>
      </div>
    );
  }

  if (challenge.mode === 'strategy') {
    return (
      <div className="mx-auto flex max-w-lg flex-wrap items-center justify-center gap-2 rounded-[22px] bg-gradient-to-r from-[#EDF5FF] via-[#F5F0FF] to-[#FFF5D8] p-4 sm:gap-4">
        <span className="rounded-2xl bg-white px-4 py-3 text-xs font-extrabold text-brand-blue shadow-sm">знакомый пример</span>
        <span className="font-display text-xl font-black text-ink/28">+</span>
        <span className="rounded-2xl bg-white px-4 py-3 text-xs font-extrabold text-brand-purple shadow-sm">ещё одна часть</span>
        <span className="font-display text-xl font-black text-ink/28">=</span>
        <span className="rounded-2xl bg-ink px-4 py-3 text-xs font-extrabold text-white shadow-sm">новый ответ</span>
      </div>
    );
  }

  if (challenge.mode === 'story') {
    return (
      <div className="mx-auto grid max-w-md grid-cols-3 gap-3" aria-hidden="true">
        {['условие', 'одинаковые группы', 'ответ'].map((label, index) => (
          <div key={label} className={`rounded-[20px] border p-3 ${index === 1 ? 'border-[#FFD166]/40 bg-[#FFF7DE]' : 'border-[#3978F6]/10 bg-[#F3F7FF]'}`}>
            <span className={`mx-auto block h-8 w-8 rounded-xl ${index === 0 ? 'bg-[#66B6FF]' : index === 1 ? 'bg-[#FFD166]' : 'bg-[#75E5C1]'}`} />
            <span className="mt-2 block text-[9px] font-extrabold text-ink/42">{label}</span>
          </div>
        ))}
      </div>
    );
  }

  if (challenge.mode === 'division' || challenge.mode === 'family') {
    return (
      <div className="mx-auto flex max-w-md items-center justify-center gap-3 rounded-[22px] bg-[#E9FAF4] p-4">
        <strong className="rounded-2xl bg-white px-4 py-3 font-display text-2xl text-[#087B5A] shadow-sm">{challenge.a * challenge.b}</strong>
        <span className="font-display text-2xl font-black text-[#10A77A]">↔</span>
        <div className="grid grid-cols-2 gap-1.5">
          <span className="rounded-xl bg-white px-3 py-2 text-xs font-extrabold text-ink/54">умножение</span>
          <span className="rounded-xl bg-white px-3 py-2 text-xs font-extrabold text-ink/54">деление</span>
        </div>
      </div>
    );
  }

  return null;
}

function getTaskView(challenge) {
  if (challenge.mode === 'array') {
    return {
      question: 'Сколько точек всего?',
      condition: `${challenge.a} ряда, в каждом по ${challenge.b} точек`,
      expression: `${challenge.a} × ${challenge.b} = ?`,
      tip: 'Умножь количество рядов на количество точек в одном ряду.',
      steps: [`Найди ${challenge.a} ряда`, `В каждом ряду по ${challenge.b} точек`, `Посчитай всё: ${challenge.a} × ${challenge.b}`],
    };
  }

  if (challenge.mode === 'groups') {
    return {
      question: 'Сколько предметов всего?',
      condition: `${challenge.a} одинаковые группы, в каждой по ${challenge.b}`,
      expression: `${challenge.a} × ${challenge.b} = ?`,
      tip: 'Умножь количество групп на количество предметов в одной группе.',
      steps: [`Найди ${challenge.a} группы`, `В каждой группе по ${challenge.b}`, `Посчитай всё: ${challenge.a} × ${challenge.b}`],
    };
  }

  if (challenge.mode === 'repeated') {
    return {
      question: 'Чему равна сумма?',
      condition: `Число ${challenge.b} повторяется ${challenge.a} раза`,
      expression: `${challenge.prompt} = ?`,
      tip: 'Одинаковые слагаемые можно посчитать умножением.',
      steps: [`Число ${challenge.b} взяли ${challenge.a} раза`, 'Сложи одинаковые части', `Это то же самое, что ${challenge.a} × ${challenge.b}`],
    };
  }

  if (challenge.mode === 'story') {
    return {
      question: challenge.prompt,
      condition: `${challenge.a} одинаковых групп, в каждой по ${challenge.b}`,
      expression: `${challenge.a} × ${challenge.b} = ?`,
      tip: 'Найди в условии количество одинаковых групп и сколько предметов в каждой.',
      steps: ['Прочитай условие', `Найди ${challenge.a} группы по ${challenge.b}`, 'Умножь и выбери ответ'],
    };
  }

  if (challenge.mode === 'direct') {
    return {
      question: 'Чему равно произведение?',
      condition: 'Реши пример на умножение',
      expression: `${challenge.prompt} = ?`,
      tip: 'Вспомни таблицу умножения и введи ответ.',
      steps: ['Посмотри на множители', 'Вспомни нужный пример', 'Введи результат'],
    };
  }

  if (challenge.mode === 'missing') {
    return {
      question: 'Какое число пропущено?',
      condition: challenge.instruction,
      expression: challenge.prompt,
      tip: 'Подбери число, при умножении на которое получится ответ справа.',
      steps: ['Посмотри на результат', 'Найди неизвестный множитель', 'Введи пропущенное число'],
    };
  }

  if (challenge.mode === 'division' || challenge.mode === 'family') {
    return {
      question: 'Сколько получится?',
      condition: challenge.instruction,
      expression: challenge.mode === 'family' ? `${challenge.a * challenge.b} ÷ ${challenge.b} = ?` : `${challenge.prompt} = ?`,
      tip: 'Вспомни обратный пример на умножение.',
      steps: ['Прочитай пример', 'Вспомни связанное умножение', 'Введи частное'],
    };
  }

  return {
    question: challenge.instruction,
    condition: challenge.title,
    expression: challenge.prompt,
    tip: INPUT_MODES.has(challenge.mode) ? 'Введи ответ с помощью кнопок ниже.' : 'Выбери один правильный ответ.',
    steps: ['Прочитай вопрос', 'Реши пример', 'Выбери или введи ответ'],
  };
}

function solutionEquation(challenge) {
  const product = challenge.a * challenge.b;
  if (challenge.mode === 'division') return `${product} ÷ ${challenge.a} = ${challenge.b}`;
  if (challenge.mode === 'family') return `${product} ÷ ${challenge.b} = ${challenge.a}`;
  return `${challenge.a} × ${challenge.b} = ${product}`;
}

function NumberPad({ value, onDigit, onDelete, onSubmit, disabled, invalid }) {
  return (
    <div className="mx-auto mt-5 max-w-md rounded-[26px] border border-ink/7 bg-white p-4 shadow-card sm:p-5">
      <div className={`grid min-h-[70px] place-items-center rounded-[18px] border-2 font-display text-4xl font-black transition ${invalid ? 'border-[#F06E3D] bg-[#FFF2EC] text-[#B94D27]' : value ? 'border-brand-blue/28 bg-[#F2F7FF] text-ink' : 'border-dashed border-ink/12 bg-[#FAFBFD] text-ink/24'}`}>
        {value || '?'}
      </div>
      <div className="mt-3 grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => (
          <button key={digit} type="button" disabled={disabled} onClick={() => onDigit(digit)} className="min-h-12 rounded-2xl border border-ink/8 bg-[#F8FAFF] font-display text-xl font-black text-ink transition hover:-translate-y-0.5 hover:border-brand-blue/30 disabled:opacity-45">{digit}</button>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-[.55fr_1.45fr] gap-2">
        <button type="button" disabled={disabled || !value} onClick={onDelete} aria-label="Удалить последнюю цифру" className="min-h-[52px] rounded-full border border-ink/9 bg-white text-sm font-extrabold text-ink/58 disabled:opacity-35">⌫</button>
        <button type="button" disabled={disabled || !value} onClick={onSubmit} className="min-h-[52px] rounded-full bg-ink px-5 text-sm font-extrabold text-white transition hover:-translate-y-0.5 disabled:opacity-35">Проверить ответ</button>
      </div>
    </div>
  );
}
function MasteryMap({ progress }) {
  return (
    <div className="overflow-x-auto pb-1">
      <div className="min-w-[590px]">
        <div className="grid grid-cols-[44px_repeat(10,minmax(0,1fr))] gap-1.5 text-center text-[10px] font-extrabold text-ink/38">
          <span />
          {FACTORS.map((factor) => <span key={factor}>{factor}</span>)}
          {TABLES.flatMap((table) => [
            <strong key={`label-${table}`} className="grid h-9 place-items-center rounded-[10px] bg-ink text-white">×{table}</strong>,
            ...FACTORS.map((factor) => {
              const strength = progress.facts[factKey(table, factor)]?.strength || 0;
              return <span key={`${table}-${factor}`} title={`${table} × ${factor}`} className={`h-9 rounded-[10px] border ${strength >= 4 ? 'border-[#10A77A]/25 bg-[#10A77A] text-white' : strength >= 2 ? 'border-[#FFD166]/40 bg-[#FFF0B8] text-[#9A6810]' : strength > 0 ? 'border-[#75C7FF]/40 bg-[#E5F4FF] text-[#236BFF]' : 'border-ink/7 bg-white text-ink/22'}`}>{strength >= 4 ? '✓' : strength >= 2 ? '●' : strength > 0 ? '·' : ''}</span>;
            }),
          ])}
        </div>
      </div>
    </div>
  );
}

export function MultiplicationTrainer({ hasAccess = false }) {
  const [progress, setProgress] = useState(defaultProgress);
  const [activeStage, setActiveStage] = useState(null);
  const [challenge, setChallenge] = useState(null);
  const [round, setRound] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [lastChoice, setLastChoice] = useState(null);
  const [summary, setSummary] = useState(null);
  const [firstTry, setFirstTry] = useState(true);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [streak, setStreak] = useState(0);
  const startedAt = useRef(0);

  useEffect(() => setProgress(readProgress()), []);

  const mastered = useMemo(() => TABLES.flatMap((a) => FACTORS.map((b) => factKey(a, b))).filter((key) => (progress.facts[key]?.strength || 0) >= 4).length, [progress]);
  const trained = useMemo(() => Object.values(progress.facts).filter((fact) => (fact.attempts || 0) > 0).length, [progress]);

  function persistFact(a, b, wasCorrect, responseMs) {
    setProgress((current) => {
      const key = factKey(a, b);
      const previous = current.facts[key] || { strength: 0, attempts: 0, correct: 0 };
      const strength = wasCorrect
        ? Math.min(5, (previous.strength || 0) + (responseMs < 5000 ? 1.25 : 1))
        : Math.max(0, (previous.strength || 0) - 1);
      const fact = {
        ...previous,
        strength,
        attempts: (previous.attempts || 0) + 1,
        correct: (previous.correct || 0) + (wasCorrect ? 1 : 0),
        bestMs: wasCorrect ? Math.min(previous.bestMs || Infinity, responseMs) : previous.bestMs,
        due: Date.now() + REVIEW_INTERVALS[Math.min(5, Math.floor(strength))],
      };
      const next = { ...current, facts: { ...current.facts, [key]: fact } };
      saveProgress(next);
      return next;
    });
  }

  function startStage(stage) {
    if (!stage.free && !hasAccess) {
      reachGoal('multiplication_locked_stage_click', { stage: stage.id });
      document.getElementById('dostup')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    reachGoal('multiplication_stage_start', { stage: stage.id, free: Boolean(stage.free) });
    setActiveStage(stage);
    setRound(0);
    setCorrect(0);
    setMistakes(0);
    setSummary(null);
    setFeedback(null);
    setLastChoice(null);
    setFirstTry(true);
    setTypedAnswer('');
    setStreak(0);
    const next = makeChallenge(stage, progress, 0);
    setChallenge(next);
    startedAt.current = Date.now();
  }

  function answer(value) {
    if (!challenge || feedback?.correct) return;
    setLastChoice(value);
    const isCorrect = value === challenge.answer;
    const responseMs = Date.now() - startedAt.current;
    persistFact(challenge.a, challenge.b, isCorrect, responseMs);
    if (isCorrect) {
      setCorrect((count) => count + 1);
      setStreak((count) => count + 1);
      setFeedback({ correct: true, text: challenge.explanation });
    } else {
      setMistakes((count) => count + 1);
      setStreak(0);
      setFirstTry(false);
      setFeedback({ correct: false, text: `Пока не получилось. ${challenge.instruction}` });
    }
  }

  function addDigit(digit) {
    if (feedback?.correct) return;
    if (feedback && !feedback.correct) {
      setFeedback(null);
      setTypedAnswer(String(digit));
      return;
    }
    setTypedAnswer((current) => `${current}${digit}`.replace(/^0+(?=\d)/, '').slice(0, 3));
  }

  function deleteDigit() {
    if (feedback?.correct) return;
    if (feedback && !feedback.correct) setFeedback(null);
    setTypedAnswer((current) => current.slice(0, -1));
  }

  function submitTypedAnswer() {
    if (!typedAnswer || feedback?.correct) return;
    answer(Number(typedAnswer));
  }

  function nextQuestion() {
    if (!activeStage) return;
    const nextRound = round + 1;
    if (nextRound >= activeStage.rounds) {
      const accuracy = Math.round((correct / activeStage.rounds) * 100);
      const stars = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : 1;
      const completed = { accuracy, stars, correct, mistakes, stage: activeStage };
      setSummary(completed);
      setChallenge(null);
      setProgress((current) => {
        const previousBest = current.stages[activeStage.id]?.stars || 0;
        const next = {
          ...current,
          sessions: (current.sessions || 0) + 1,
          stages: { ...current.stages, [activeStage.id]: { stars: Math.max(stars, previousBest), accuracy, completedAt: Date.now() } },
        };
        saveProgress(next);
        return next;
      });
      reachGoal('multiplication_stage_complete', { stage: activeStage.id, accuracy, stars });
      return;
    }
    setRound(nextRound);
    setFeedback(null);
    setLastChoice(null);
    setFirstTry(true);
    setTypedAnswer('');
    const next = makeChallenge(activeStage, progress, nextRound);
    setChallenge(next);
    startedAt.current = Date.now();
  }

  function closeSession() {
    setActiveStage(null);
    setChallenge(null);
    setSummary(null);
    setFeedback(null);
  }

  if (activeStage) {
    const taskView = challenge ? getTaskView(challenge) : null;
    return (
      <div className="overflow-hidden rounded-[34px] border border-white/80 bg-[#0B1734] text-white shadow-[0_32px_90px_rgba(14,32,72,.24)]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/9 px-5 py-5 sm:px-8">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#75E5C1]">Маршрут {activeStage.number}</p>
            <h3 className="mt-1 font-display text-xl font-extrabold sm:text-2xl">{activeStage.title}</h3>
          </div>
          <button type="button" onClick={closeSession} className="rounded-full border border-white/14 bg-white/7 px-4 py-2 text-xs font-extrabold text-white/72 transition hover:bg-white/12">К карте маршрутов</button>
        </div>

        {summary ? (
          <div className="grid min-h-[560px] place-items-center px-5 py-12 text-center sm:px-8">
            <div className="max-w-xl">
              <div className="text-5xl">{summary.stars === 3 ? '🏆' : summary.stars === 2 ? '⭐' : '🌱'}</div>
              <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.18em] text-[#75E5C1]">Тренировка завершена</p>
              <h3 className="mt-4 font-display text-4xl font-extrabold sm:text-5xl">Навык стал крепче</h3>
              <p className="mt-4 text-base font-semibold leading-7 text-white/60">Верных ответов: {summary.correct} из {summary.stage.rounds}. Тренажёр запомнил сложные примеры и вернёт их в следующих занятиях.</p>
              <div className="mt-7 flex justify-center gap-2 text-3xl">{[1, 2, 3].map((star) => <span key={star} className={star <= summary.stars ? 'opacity-100' : 'grayscale opacity-20'}>★</span>)}</div>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <button type="button" onClick={() => startStage(activeStage)} className="rounded-full bg-[#75E5C1] px-6 py-3.5 text-sm font-extrabold text-[#09152E]">Повторить маршрут</button>
                <button type="button" onClick={closeSession} className="rounded-full border border-white/16 bg-white/8 px-6 py-3.5 text-sm font-extrabold">Выбрать следующий</button>
              </div>
              {!hasAccess && (
                <a href="#dostup" onClick={closeSession} className="mt-6 inline-flex text-sm font-extrabold text-[#FFD166] underline underline-offset-4">Открыть все таблицы и задачи →</a>
              )}
            </div>
          </div>
        ) : challenge ? (
          <div className="grid min-h-[620px] lg:grid-cols-[.5fr_1.5fr]">
            <aside className="border-b border-white/9 bg-white/[0.035] p-5 lg:border-b-0 lg:border-r lg:p-8">
              <div className="flex items-center justify-between text-xs font-extrabold text-white/58"><span>Задание {round + 1} из {activeStage.rounds}</span><span>{correct} верно</span></div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/9"><i className="block h-full rounded-full bg-gradient-to-r from-[#3978F6] to-[#75E5C1] transition-all" style={{ width: `${((round + 1) / activeStage.rounds) * 100}%` }} /></div>
              <div className="mt-8 rounded-[24px] border border-[#75E5C1]/20 bg-[#75E5C1]/8 p-5">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#75E5C1]">Что делаем сейчас</p>
                <p className="mt-3 font-display text-xl font-extrabold leading-tight text-white">{taskView.question}</p>
              </div>
              <div className="mt-4 rounded-[24px] border border-white/9 bg-white/[0.055] p-5">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/42">Как решить</p>
                <ol className="mt-4 space-y-4">
                  {taskView.steps.map((step, index) => (
                    <li key={step} className="flex gap-3 text-xs font-semibold leading-5 text-white/70">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/10 text-[10px] font-extrabold text-[#75E5C1]">{index + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
              {streak >= 2 && <p className="mt-5 text-center text-xs font-extrabold text-[#FFD166]">Верных подряд: {streak}</p>}
            </aside>

            <div className="bg-[#F8FAFF] p-5 text-ink sm:p-8 lg:p-10">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-brand-blue">Задание · {challenge.title}</p>
              <div className="mt-4 rounded-[28px] border border-ink/7 bg-white p-5 text-center shadow-card sm:p-8">
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-brand-blue">Вопрос</p>
                <h4 className="mx-auto mt-2 max-w-2xl font-display text-2xl font-extrabold leading-tight text-ink sm:text-4xl">{taskView.question}</h4>
                <div className="mt-6"><ConceptVisual challenge={challenge} /></div>
                <p className={`${challenge.visual || ['repeated', 'sequence', 'strategy', 'story', 'division', 'family'].includes(challenge.mode) ? 'mt-6' : 'mt-5'} text-sm font-bold text-ink/58 sm:text-base`}>{taskView.condition}</p>
                <div className="mt-2 font-display text-[34px] font-extrabold leading-[1.08] tracking-[-0.04em] text-ink sm:text-5xl">{taskView.expression}</div>
                <p className="mx-auto mt-4 max-w-xl rounded-2xl bg-[#EDF5FF] px-4 py-3 text-sm font-semibold leading-6 text-brand-blue sm:text-base">Подсказка: {taskView.tip}</p>
              </div>

              {feedback?.correct ? (
                <div className="mt-5 rounded-[24px] border-2 border-[#10A77A]/24 bg-[#E9FAF4] px-5 py-5 text-[#087B5A] sm:px-7 sm:py-6">
                  <div className="flex items-start gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#10A77A] text-xl font-black text-white">✓</span>
                    <div>
                      <p className="text-sm font-extrabold uppercase tracking-[0.12em]">Верно! Вот решение</p>
                      <p className="mt-2 font-display text-3xl font-extrabold text-ink sm:text-4xl">{solutionEquation(challenge)}</p>
                      <p className="mt-3 text-base font-bold leading-7">{feedback.text}</p>
                    </div>
                  </div>
                </div>
              ) : INPUT_MODES.has(challenge.mode) ? (
                <NumberPad value={typedAnswer} onDigit={addDigit} onDelete={deleteDigit} onSubmit={submitTypedAnswer} disabled={Boolean(feedback?.correct)} invalid={Boolean(feedback && !feedback.correct)} />
              ) : (
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {challenge.options.map((option) => {
                    const pickedWrong = lastChoice === option && feedback && !feedback.correct;
                    return (
                      <button key={option} type="button" disabled={Boolean(feedback?.correct)} onClick={() => answer(option)} className={`min-h-[68px] rounded-[20px] border px-4 py-3 font-display text-2xl font-extrabold transition disabled:cursor-default ${pickedWrong ? 'border-[#F06E3D] bg-[#FFF0E9] text-[#D85426]' : lastChoice === option && feedback?.correct ? 'border-[#10A77A] bg-[#E9FAF4] text-[#087B5A] shadow-sm' : 'border-ink/8 bg-white text-ink shadow-sm hover:-translate-y-0.5 hover:border-brand-blue/30 hover:shadow-card'}`}>{option}</button>
                    );
                  })}
                </div>
              )}

              {feedback && !feedback.correct && (
                <div className="mt-5 rounded-[20px] border border-[#F06E3D]/22 bg-[#FFF2EC] px-5 py-4 text-sm font-bold leading-6 text-[#B94D27]">
                  <strong>Почти! Посмотри ещё раз. </strong>{challenge.instruction}
                </div>
              )}
              {feedback?.correct && <button type="button" onClick={nextQuestion} className="mt-5 min-h-[54px] w-full rounded-full bg-ink px-6 py-3 text-sm font-extrabold text-white transition hover:-translate-y-0.5">{round + 1 >= activeStage.rounds ? 'Посмотреть результат' : 'Следующее задание →'}</button>}
              <span className="sr-only">{firstTry ? 'Первая попытка' : 'Повторная попытка'}</span>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="rounded-[34px] border border-ink/7 bg-white p-5 shadow-luxe sm:p-8 lg:p-10">
      <div className="grid gap-7 lg:grid-cols-[.78fr_1.22fr] lg:items-end">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-brand-blue">Персональная карта навыка</p>
          <h3 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.04em] text-ink sm:text-4xl">Не просто проценты — видно каждый пример</h3>
          <p className="mt-4 text-sm font-semibold leading-6 text-ink/54">Синий — начали знакомство, жёлтый — тренируем, зелёный — отвечаем уверенно. Карта хранится на этом устройстве.</p>
          <div className="mt-5 grid grid-cols-3 gap-2">
            <div className="rounded-[18px] bg-[#EDF5FF] p-4"><strong className="font-display text-2xl text-brand-blue">{trained}</strong><span className="mt-1 block text-[9px] font-extrabold text-ink/40">сочетаний встречалось</span></div>
            <div className="rounded-[18px] bg-[#E9FAF4] p-4"><strong className="font-display text-2xl text-[#10A77A]">{mastered}</strong><span className="mt-1 block text-[9px] font-extrabold text-ink/40">закреплено</span></div>
            <div className="rounded-[18px] bg-[#FFF5D8] p-4"><strong className="font-display text-2xl text-[#D99414]">{progress.sessions || 0}</strong><span className="mt-1 block text-[9px] font-extrabold text-ink/40">занятий</span></div>
          </div>
        </div>
        <MasteryMap progress={progress} />
      </div>

      <div className="mt-10 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {multiplicationStages.map((stage) => {
          const locked = !stage.free && !hasAccess;
          const result = progress.stages[stage.id];
          return (
            <button key={stage.id} type="button" onClick={() => startStage(stage)} className={`group relative min-h-[214px] overflow-hidden rounded-[26px] border p-5 text-left transition duration-300 ${locked ? 'border-ink/7 bg-[#F6F7FA]' : 'border-white bg-gradient-to-br ' + stage.color + ' text-white shadow-color hover:-translate-y-1'}`}>
              <i className={`pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full ${locked ? 'bg-ink/5' : 'bg-white/16'} blur-2xl`} />
              <div className="relative flex items-start justify-between gap-3">
                <span className={`text-[10px] font-extrabold uppercase tracking-[0.16em] ${locked ? 'text-ink/35' : 'text-white/66'}`}>Маршрут {stage.number}</span>
                <span className={`rounded-full px-2.5 py-1 text-[9px] font-extrabold ${stage.free ? 'bg-white text-[#0B6B51]' : locked ? 'bg-ink/6 text-ink/36' : 'bg-white/16 text-white'}`}>{stage.free ? 'бесплатно' : locked ? '🔒 с курсом' : result ? `${'★'.repeat(result.stars)}` : 'открыто'}</span>
              </div>
              <h4 className={`relative mt-8 font-display text-2xl font-extrabold ${locked ? 'text-ink/48' : ''}`}>{stage.title}</h4>
              <p className={`relative mt-3 text-xs font-semibold leading-5 ${locked ? 'text-ink/38' : 'text-white/72'}`}>{stage.description}</p>
              <span className={`relative mt-5 inline-flex text-xs font-extrabold ${locked ? 'text-brand-blue' : 'text-white'}`}>{locked ? 'Посмотреть полный доступ →' : result ? 'Повторить маршрут →' : 'Начать тренировку →'}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
