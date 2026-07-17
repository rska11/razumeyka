'use client';

// Карта курса ментальной арифметики: месяц = 20 учебных дней (как в рисовании),
// день = несколько коротких уроков. Программа ОДНА для всех возрастов —
// возрастная ступень меняет только темп (скорость флеш-карт) и подсказки.
// Перед днём 1 есть необязательная «Ступень 0» для малышей (уроки с day: 0).
// Прогресс — в localStorage, freemium-замки на платных уроках.

import { useEffect, useMemo, useState } from 'react';
import {
  mentalAgeBands,
  mentalDayGuides,
  mentalDays,
  mentalLessonsByDay,
  mentalMonths,
} from '@/data/mental-lessons.js';
import { MentalLessonPlayer } from './MentalLessonPlayer.jsx';
import { Soroban } from './Soroban.jsx';

const STORAGE_DONE = 'razumeyka_mental_done';
const STORAGE_BAND = 'razumeyka_mental_band';
const MONTH_DAYS = 20;

const KIND_META = {
  learn: { label: 'Учимся', tone: 'bg-brand-blue/10 text-brand-blue' },
  practice: { label: 'Тренируем', tone: 'bg-brand-purple/10 text-brand-purple' },
  flash: { label: 'Флеш-карты', tone: 'bg-brand-orange/12 text-brand-orange' },
  solve: { label: 'Считаем', tone: 'bg-brand-green/12 text-brand-green' },
  game: { label: 'Игра', tone: 'bg-brand-pink/10 text-brand-pink' },
};

function previewValue(lesson) {
  for (const step of lesson.steps ?? []) {
    for (const key of ['show', 'target', 'value']) {
      if (Number.isInteger(step[key]) && step[key] >= 0 && step[key] <= 9) return step[key];
    }
    if (Array.isArray(step.cards) && step.cards.length === 1 && step.cards[0] <= 9) return step.cards[0];
  }
  return 0;
}

function LessonVisual({ lesson }) {
  if (lesson.day === 0) return <span className="mental-lesson-emoji">{lesson.cover?.emoji ?? '🔢'}</span>;
  return <Soroban value={previewValue(lesson)} interactive={false} className="h-full w-auto" />;
}

function MonthRoadmap({ readyDays }) {
  return (
    <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
      {mentalMonths.map((month) => {
        const active = month.n === 1;
        return (
          <div key={month.n} className={(active ? 'border-brand-blue/35 bg-white shadow-card' : 'border-white/60 bg-white/45 opacity-78') + ' rounded-2xl border p-3'}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-ink/40">{month.title}</p>
                <p className="mt-1 text-sm font-extrabold text-ink">{active ? 'Первый месяц курса' : 'Закрытый месяц'}</p>
              </div>
              <span className={(active ? 'bg-brand-green/12 text-brand-green' : 'bg-ink/8 text-ink/40') + ' rounded-full px-2 py-1 text-[10px] font-extrabold'}>
                {active ? month.status : '🔒'}
              </span>
            </div>
            <p className="mt-2 min-h-[34px] text-[11px] font-semibold leading-4 text-ink/58">{month.note}</p>
            {active ? (
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-cream">
                <div className="h-full rounded-full bg-brand-green" style={{ width: Math.round((readyDays / MONTH_DAYS) * 100) + '%' }} />
              </div>
            ) : (
              <p className="mt-2 text-[10px] font-extrabold text-ink/36">Откроется позже</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function WeekendPause({ week }) {
  return (
    <div className="rounded-2xl border border-dashed border-brand-green/25 bg-brand-green/7 px-4 py-3 text-center">
      <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-brand-green">Выходные после недели {week}</p>
      <p className="mt-1 text-xs font-semibold text-ink/52">2 дня отдыха: можно посчитать что-нибудь вокруг — ступеньки, машины, конфеты — или повторить любимые флеш-карты.</p>
    </div>
  );
}

function NextWeeksPreview() {
  const routes = [
    { week: 2, from: 6, to: 10, title: 'Цепочки и друзья пятёрки', note: 'Сложение и вычитание через понятные числовые связи.', tone: 'from-brand-blue/14 to-brand-cyan/7' },
    { week: 3, from: 11, to: 15, title: 'Абакус в воображении', note: 'Учимся удерживать бусины мысленно и считать без экрана.', tone: 'from-brand-purple/14 to-brand-pink/7' },
    { week: 4, from: 16, to: 20, title: 'Скорость, точность и финал', note: 'Игровой марафон и личный результат без сравнения с другими.', tone: 'from-brand-orange/16 to-brand-yellow/8' },
  ];
  return (
    <section className="mental-next-route">
      <div className="mental-next-route-head">
        <div>
          <p>После первой недели</p>
          <h4>Навык растёт следующими маршрутами</h4>
        </div>
        <span>ещё 3 недели · 75 миссий · 375 заданий</span>
      </div>
      <div className="mental-next-route-grid">
        {routes.map((route) => (
          <article key={route.week} className={`bg-gradient-to-br ${route.tone}`}>
            <div><span>Неделя {route.week}</span><b>25 миссий</b></div>
            <h5>{route.title}</h5>
            <p>{route.note}</p>
            <ul>
              {mentalDays.filter((day) => day.n >= route.from && day.n <= route.to).map((day) => (
                <li key={day.n}>
                  <span><b>День {day.n}</b><em>{day.title}</em></span>
                  <i>5 миссий</i>
                  <strong aria-label="Откроется по маршруту">⌁</strong>
                </li>
              ))}
            </ul>
            <small>Открывается последовательно по маршруту →</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function DaySection({ day, doneSet, unlocked, onOpen, onLocked }) {
  const dayDone = day.lessons.filter((l) => doneSet.has(l.slug)).length;
  const guide = mentalDayGuides[day.n] ?? mentalDayGuides.default;
  const isWarmup = day.n === 0;

  return (
    <section className="mental-day-section">
      <div className="mental-day-head">
        <div>
          <p className="mental-day-number">
            {isWarmup ? 'Ступень 0 · для самых маленьких' : `День ${day.n}`}
          </p>
          <h4 className="mental-day-title">{day.title}</h4>
          <p className="mt-1 text-xs font-bold text-ink/46">
            {isWarmup ? 'необязательная разминка перед днём 1 — без абакуса' : 'короткие уроки — проходи по порядку'}
          </p>
        </div>
        <p className="text-sm font-extrabold text-ink/50">{dayDone}/{day.lessons.length} готово</p>
      </div>

      {guide && (
        <div className="mb-3 grid gap-2 rounded-2xl border border-white/75 bg-white/70 p-3 shadow-sm lg:grid-cols-2">
          <p className="text-[11px] font-semibold leading-5 text-ink/66"><span className="font-extrabold text-brand-blue">Зачем:</span> {guide.why}</p>
          <p className="text-[11px] font-semibold leading-5 text-ink/66"><span className="font-extrabold text-brand-green">Родителю:</span> {guide.parent}</p>
        </div>
      )}

      <div className="mental-lesson-grid">
        {day.lessons.map((l, index) => {
          const open = unlocked(l);
          const isDone = doneSet.has(l.slug);
          const kind = KIND_META[l.kind] ?? KIND_META.learn;
          return (
            <button
              key={l.slug}
              onClick={() => (open ? onOpen(l) : onLocked())}
              className={'mental-lesson-card ' + (open ? 'mental-lesson-card-open' : 'mental-lesson-card-locked')}
            >
              <div className="mental-lesson-visual">
                <LessonVisual lesson={l} />
                <span className="mental-lesson-index">{String(index + 1).padStart(2, '0')}</span>
                {isDone && <span className="mental-lesson-done">✓</span>}
                {!open && <span className="mental-lesson-lock">🔒</span>}
              </div>
              <div className="mental-lesson-body">
                <span className={'mental-lesson-pill ' + kind.tone}>{kind.label}</span>
                <h5 className={open ? 'text-ink' : 'text-ink/48'}>{l.title}</h5>
                <p>{l.skill}</p>
                <span className={open ? 'text-brand-blue' : 'text-ink/40'}>{open ? (isDone ? 'Повторить урок ↗' : 'Открыть урок ↗') : 'Доступ по подписке'}</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function MentalLessons({ hasSubscription = false }) {
  const [band, setBand] = useState('7-10');
  const [doneSet, setDoneSet] = useState(() => new Set());
  const [active, setActive] = useState(null);

  useEffect(() => {
    try {
      const savedBand = localStorage.getItem(STORAGE_BAND);
      if (savedBand && mentalAgeBands.some((b) => b.key === savedBand)) setBand(savedBand);
      const saved = JSON.parse(localStorage.getItem(STORAGE_DONE) || '[]');
      setDoneSet(new Set(saved));
    } catch {}
  }, []);

  function selectBand(key) {
    setBand(key);
    try {
      localStorage.setItem(STORAGE_BAND, key);
    } catch {}
  }

  function markDone(slug) {
    setDoneSet((prev) => {
      const next = new Set(prev);
      next.add(slug);
      try {
        localStorage.setItem(STORAGE_DONE, JSON.stringify([...next]));
      } catch {}
      return next;
    });
  }

  const days = useMemo(() => mentalLessonsByDay(), []);
  const daysByN = useMemo(() => new Map(days.map((d) => [d.n, d])), [days]);
  const activeBand = mentalAgeBands.find((b) => b.key === band) ?? mentalAgeBands[1];
  // Бесплатный тизер (без подписки): день 0 — только 1-й урок; день 1 — 1-й и 2-й.
  // Остальное (в т.ч. день 2 и дальше) — по подписке. Позиция важнее флага free в данных.
  const freeSlugs = useMemo(() => {
    const s = new Set();
    const d0 = daysByN.get(0);
    if (d0?.lessons[0]) s.add(d0.lessons[0].slug);
    const d1 = daysByN.get(1);
    if (d1?.lessons[0]) s.add(d1.lessons[0].slug);
    if (d1?.lessons[1]) s.add(d1.lessons[1].slug);
    return s;
  }, [daysByN]);
  const unlocked = (l) => freeSlugs.has(l.slug) || hasSubscription;
  const orderedLessons = useMemo(() => days.flatMap((d) => d.lessons), [days]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const playable = useMemo(() => orderedLessons.filter(unlocked), [orderedLessons, hasSubscription]);
  const doneCount = orderedLessons.filter((l) => doneSet.has(l.slug)).length;
  const percent = orderedLessons.length ? Math.round((doneCount / orderedLessons.length) * 100) : 0;

  function nextAfter(lesson) {
    const idx = playable.findIndex((l) => l.slug === lesson.slug);
    return idx >= 0 ? playable[idx + 1] : undefined;
  }

  function goSubscribe() {
    document.getElementById('podpiska')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div>
      <div className="mental-age-tabs">
        {mentalAgeBands.map((b) => {
          const on = b.key === band;
          return (
            <button
              key={b.key}
              onClick={() => selectBand(b.key)}
              className={'mental-age-tab ' + (on ? 'mental-age-tab-active' : '')}
            >
              <p className="mental-age-tag">{b.tag}</p>
              <p className="mental-age-label">{b.label}</p>
              <p className="mt-1 text-sm font-semibold leading-5 text-ink/56">{b.note}</p>
            </button>
          );
        })}
      </div>

      <MonthRoadmap readyDays={days.filter((d) => d.n >= 1).length} />

      <div className="mental-course-overview">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="section-kicker">Путь счетовода · {activeBand.label}</p>
            <h3 className="mt-2 font-display text-2xl font-extrabold text-ink">От первой бусины к счёту в уме</h3>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-ink/60">
              Месяц — это 20 учебных дней, 100 игровых миссий и более 500 заданий. Каждый день содержит 5 коротких миссий примерно по 5 действий. Перед стартом можно пройти 10 необязательных разминок «Ступени 0».
            </p>
            <p className="mt-2 max-w-2xl rounded-xl bg-brand-blue/8 px-3 py-2 text-xs font-bold leading-5 text-brand-blue">
              💡 {activeBand.hint}
            </p>
          </div>
          <div className="min-w-[180px] rounded-2xl bg-cream/80 px-4 py-3">
            <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/42">Прогресс</p>
            <p className="mt-1 font-display text-2xl font-extrabold text-ink">{doneCount}/{orderedLessons.length}</p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full bg-brand-green transition-all" style={{ width: `${percent}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="mental-days-list">
        {daysByN.has(0) && (
          <DaySection
            day={daysByN.get(0)}
            doneSet={doneSet}
            unlocked={unlocked}
            onOpen={setActive}
            onLocked={goSubscribe}
          />
        )}
        {Array.from({ length: 5 }).map((_, dayIndex) => {
          const dayNumber = dayIndex + 1;
          const day = daysByN.get(dayNumber);
          return (
            <div key={dayNumber} className="space-y-8">
              {day ? (
                <DaySection
                  day={day}
                  doneSet={doneSet}
                  unlocked={unlocked}
                  onOpen={setActive}
                  onLocked={goSubscribe}
                />
              ) : null}
              {dayNumber === 5 && <WeekendPause week={1} />}
            </div>
          );
        })}
        <NextWeeksPreview />
      </div>

      {active && (
        <MentalLessonPlayer
          key={active.slug}
          lesson={active}
          nextLesson={nextAfter(active)}
          paceFactor={activeBand.paceFactor}
          onComplete={markDone}
          onNext={() => setActive(nextAfter(active) ?? null)}
          onClose={() => setActive(null)}
        />
      )}
    </div>
  );
}
