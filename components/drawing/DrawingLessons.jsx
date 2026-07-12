'use client';

// Карта уроков рисования: возраст → главы курса → уроки.
// Прогресс хранится локально, замки остаются для платной библиотеки.

import { useEffect, useMemo, useState } from 'react';
import { ageBands, drawingChapterGuides, lessonsByBand } from '@/data/drawing-lessons.js';
import { LessonPlayer } from './LessonPlayer.jsx';

const STORAGE_DONE = 'razumeyka_drawing_done';
const STORAGE_BAND = 'razumeyka_drawing_band';
const LEVEL_NAME = { 1: 'Легко', 2: 'Чуть смелее', 3: 'Вызов' };

const KIND_META = {
  draw: { label: 'Рисуй', tone: 'bg-brand-pink/10 text-brand-pink' },
  repeat: { label: 'Повтор', tone: 'bg-brand-purple/10 text-brand-purple' },
  combo: { label: 'Сцена', tone: 'bg-brand-blue/10 text-brand-blue' },
  fantasy: { label: 'Фантазия', tone: 'bg-brand-orange/12 text-brand-orange' },
  focus: { label: 'Фокус', tone: 'bg-brand-green/12 text-brand-green' },
  game: { label: 'Две руки', tone: 'bg-brand-purple/10 text-brand-purple' },
};

const STAGE_META = [
  { label: '1 объект', title: 'Ступень 1', note: 'простой старт', icon: '●', tone: 'bg-brand-green/12 text-brand-green', line: 'bg-brand-green' },
  { label: 'Детали', title: 'Ступень 2', note: 'добавляем смысл', icon: '✦', tone: 'bg-brand-blue/10 text-brand-blue', line: 'bg-brand-blue' },
  { label: 'Сюжет', title: 'Ступень 3', note: 'собираем картинку', icon: '★', tone: 'bg-brand-orange/12 text-brand-orange', line: 'bg-brand-orange' },
];

const MONTH_DAYS = 20;
const COURSE_MONTHS = [
  { n: 1, title: 'Месяц 1', status: 'Идёт сейчас', note: '20 учебных дней: 5 занятий + 2 выходных' },
  { n: 2, title: 'Месяц 2', status: 'Скоро', note: 'новые сюжеты и упражнения второй рукой' },
  { n: 3, title: 'Месяц 3', status: 'Скоро', note: 'перевёртыши, композиции и наблюдение' },
  { n: 4, title: 'Месяц 4', status: 'Скоро', note: 'большие сцены и творческие задания' },
  { n: 5, title: 'Месяц 5', status: 'Скоро', note: 'закрепление и мини-портфолио ребёнка' },
];
const FUTURE_DAY_TITLES = [
  'День линий и дорожек',
  'День цветов и листиков',
  'День смешных зверят',
  'День транспорта',
  'День узоров',
  'День настроения',
  'День маленькой сказки',
  'День двух рук',
  'День перевёрнутой картинки',
  'День большой сцены',
  'День фантазии',
  'День итоговой работы',
];

function lessonOrder(lesson) {
  return lesson.order ?? lesson.level * 100;
}

function lessonStage(index) {
  if (index < 3) return 0;
  if (index < 7) return 1;
  return 2;
}

function lessonProgressOrder(a, b) {
  return a.level - b.level || lessonOrder(a) - lessonOrder(b);
}

function storyPromptFor(lesson, index, chapter) {
  const title = lesson.title.toLowerCase();
  if (index < 3) {
    return lesson.ageBand === '3-4'
      ? `Оставь «${title}» главным героем. Добавь один простой знак рядом: точку, дорожку, облачко или травинку.`
      : `Сделай «${title}» главным объектом и добавь одну подсказку места: землю, небо, тень или маленький знак рядом.`;
  }

  if (index < 7) {
    return lesson.ageBand === '3-4'
      ? `Собери маленькую картинку: «${title}» и ещё одна деталь из главы «${chapter}». Пусть они дружат на одном листе.`
      : `Расширь рисунок: добавь к «${title}» второй объект, линию земли или фон, чтобы стало понятно, где происходит история.`;
  }

  if (lesson.ageBand === '8-10') {
    return `Финальный сюжет главы: вокруг «${title}» сделай мини-иллюстрацию с передним планом, фоном и 2–3 деталями. Придумай название работе.`;
  }

  if (lesson.ageBand === '5-7') {
    return `Финальный сюжет главы: добавь к «${title}» место действия, второго героя или предмет и одну деталь настроения. Что здесь происходит?`;
  }

  return `Финальная картинка главы: нарисуй вокруг «${title}» простую сцену — где он находится, кто рядом и какое настроение у рисунка.`;
}

function chapterName(lesson) {
  return lesson.chapter ?? LEVEL_NAME[lesson.level] ?? 'Уроки';
}

function ChapterQuestMap({ chapter, doneSet }) {
  const ranges = [
    chapter.lessons.slice(0, 3),
    chapter.lessons.slice(3, 7),
    chapter.lessons.slice(7),
  ];

  return (
    <div className="mb-3 rounded-2xl border border-white/75 bg-white/75 p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-ink/42">Карта уровня</p>
        <p className="text-[11px] font-bold text-ink/46">от круга к готовой картинке</p>
      </div>
      <div className="grid gap-2 md:grid-cols-3">
        {STAGE_META.map((stage, stageIndex) => {
          const items = ranges[stageIndex];
          const done = items.filter((lesson) => doneSet.has(lesson.slug)).length;
          const from = stageIndex === 0 ? 1 : stageIndex === 1 ? 4 : 8;
          const to = stageIndex === 0 ? 3 : stageIndex === 1 ? 7 : chapter.lessons.length;
          const fill = items.length ? Math.round((done / items.length) * 100) : 0;
          return (
            <div key={stage.title} className="relative overflow-hidden rounded-xl bg-cream/70 px-3 py-2.5">
              <div className="flex items-center gap-2">
                <span className={'grid h-8 w-8 place-items-center rounded-full text-sm font-extrabold ' + stage.tone}>{stage.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs font-extrabold text-ink">{stage.title}</p>
                  <p className="text-[10px] font-bold text-ink/48">уроки {from}–{to}: {stage.note}</p>
                </div>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
                <div className={'h-full rounded-full ' + stage.line} style={{ width: fill + '%' }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function groupByChapter(lessons) {
  const map = new Map();
  for (const lesson of lessons) {
    const name = chapterName(lesson);
    if (!map.has(name)) map.set(name, []);
    map.get(name).push(lesson);
  }

  return [...map.entries()]
    .map(([name, items]) => {
      const sorted = items.sort(lessonProgressOrder);
      return {
        name,
        chapterOrder: Math.min(...items.map(lessonOrder)),
        lessons: sorted.map((lesson, index) => ({
          ...lesson,
          chapterIndex: index,
          chapterSize: sorted.length,
          storyStageLabel: STAGE_META[lessonStage(index)].label,
          storyPrompt: lesson.storyPrompt ?? storyPromptFor(lesson, index, name),
        })),
      };
    })
    .sort((a, b) => a.chapterOrder - b.chapterOrder);
}

function MonthRoadmap({ readyDays, doneCount, totalLessons }) {
  return (
    <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
      {COURSE_MONTHS.map((month) => {
        const active = month.n === 1;
        return (
          <div key={month.n} className={(active ? 'border-brand-pink/35 bg-white shadow-card' : 'border-white/60 bg-white/45 opacity-78') + ' rounded-2xl border p-3'}>
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
      <p className="mt-1 text-xs font-semibold text-ink/52">2 дня отдыха: можно раскрасить любимый рисунок, показать родным или повторить лёгкий урок.</p>
    </div>
  );
}

function LockedDay({ dayNumber, title }) {
  return (
    <section className="border-t border-ink/8 pt-5">
      <div className="rounded-2xl border border-white/65 bg-white/45 p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-ink/36">День {dayNumber}</p>
            <h4 className="mt-1 font-display text-xl font-extrabold text-ink/54">{title}</h4>
            <p className="mt-1 text-xs font-bold text-ink/42">Уроки этого дня готовятся для следующего пополнения месяца.</p>
          </div>
          <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-ink/8 text-ink/38">🔒</span>
        </div>
      </div>
    </section>
  );
}

function DaySection({ chapter, dayNumber, doneSet, unlocked, onOpen, onLocked }) {
  const chapterDone = chapter.lessons.filter((l) => doneSet.has(l.slug)).length;
  return (
    <section className="border-t border-ink/8 pt-5 first:border-t-0 first:pt-0">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-brand-purple">День {dayNumber}</p>
          <h4 className="font-display text-2xl font-extrabold text-ink">{chapter.name}</h4>
          <p className="mt-1 text-xs font-bold text-ink/46">1–3 один объект · 4–7 детали · 8–10 сюжет</p>
        </div>
        <p className="text-sm font-extrabold text-ink/50">{chapterDone}/{chapter.lessons.length} готово</p>
      </div>

      <ChapterQuestMap chapter={chapter} doneSet={doneSet} />

      {(() => {
        const guide = drawingChapterGuides[chapter.name] ?? drawingChapterGuides.default;
        return guide ? (
          <div className="mb-3 grid gap-2 rounded-2xl border border-white/75 bg-white/70 p-3 shadow-sm lg:grid-cols-3">
            <p className="text-[11px] font-semibold leading-5 text-ink/66"><span className="font-extrabold text-brand-pink">Зачем:</span> {guide.why}</p>
            <p className="text-[11px] font-semibold leading-5 text-ink/66"><span className="font-extrabold text-brand-purple">Вторая рука:</span> {guide.hand}</p>
            <p className="text-[11px] font-semibold leading-5 text-ink/66"><span className="font-extrabold text-brand-green">Родителю:</span> {guide.parent}</p>
          </div>
        ) : null;
      })()}

      <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
        {chapter.lessons.map((l, index) => {
          const open = unlocked(l);
          const isDone = doneSet.has(l.slug);
          const kind = KIND_META[l.kind] ?? KIND_META.draw;
          const stage = STAGE_META[lessonStage(index)];
          return (
            <button
              key={l.slug}
              onClick={() => (open ? onOpen(l) : onLocked())}
              className={(open ? 'border-white/80 bg-white/85 shadow-card backdrop-blur-xl hover:-translate-y-0.5 hover:shadow-color' : 'border-white/60 bg-white/50 shadow-sm') + ' group relative flex min-h-[118px] flex-col items-start overflow-hidden rounded-2xl border p-3 text-left transition'}
            >
              <div className="flex w-full items-center justify-between gap-2">
                <span className={(open ? '' : 'opacity-50 grayscale') + ' grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-pink/10 text-xl'}>
                  {l.cover?.emoji ?? '🎨'}
                </span>
                {isDone ? (
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-green/15 text-xs text-brand-green">✓</span>
                ) : open ? (
                  <span className="rounded-full bg-brand-pink/10 px-2 py-0.5 text-[9px] font-extrabold text-brand-pink">№{index + 1}</span>
                ) : (
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-ink/8 text-xs text-ink/40">🔒</span>
                )}
              </div>

              <p className={(open ? 'text-ink' : 'text-ink/50') + ' mt-2 min-h-[32px] font-display text-sm font-extrabold leading-4'}>{l.title}</p>
              <div className="mt-1.5 flex flex-wrap gap-1">
                <span className={'rounded-full px-1.5 py-0.5 text-[9px] font-extrabold ' + kind.tone}>{kind.label}</span>
                <span className={'rounded-full px-1.5 py-0.5 text-[9px] font-bold ' + stage.tone}>{stage.label}</span>
              </div>
              <p className="mt-1.5 min-h-[28px] text-[10px] font-semibold leading-4 text-ink/56">{l.skill ?? l.theme}</p>

              <span className={(open ? 'text-brand-pink' : 'text-ink/40') + ' mt-auto pt-2 text-[10px] font-extrabold'}>
                {open ? (isDone ? 'Снова →' : 'Начать →') : 'Подписка →'}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function DrawingLessons({ hasSubscription = false }) {
  const [band, setBand] = useState('5-7');
  const [doneSet, setDoneSet] = useState(() => new Set());
  const [active, setActive] = useState(null);

  useEffect(() => {
    try {
      const savedBand = localStorage.getItem(STORAGE_BAND);
      if (savedBand) setBand(savedBand);
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

  const lessons = useMemo(() => lessonsByBand(band), [band]);
  const unlocked = (l) => l.free || hasSubscription;
  const chapters = useMemo(() => groupByChapter(lessons), [lessons]);
  const orderedLessons = useMemo(() => chapters.flatMap((chapter) => chapter.lessons), [chapters]);
  const playable = useMemo(() => orderedLessons.filter(unlocked), [orderedLessons, hasSubscription]);
  const doneCount = lessons.filter((l) => doneSet.has(l.slug)).length;
  const activeBand = ageBands.find((b) => b.key === band);
  const percent = lessons.length ? Math.round((doneCount / lessons.length) * 100) : 0;

  function nextAfter(lesson) {
    const idx = playable.findIndex((l) => l.slug === lesson.slug);
    return idx >= 0 ? playable[idx + 1] : undefined;
  }

  function goSubscribe() {
    document.getElementById('podpiska')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3">
        {ageBands.map((b) => {
          const on = b.key === band;
          return (
            <button
              key={b.key}
              onClick={() => selectBand(b.key)}
              className={`rounded-[20px] border-2 px-5 py-4 text-left transition ${
                on
                  ? 'border-brand-pink/50 bg-white shadow-color'
                  : 'border-white/70 bg-white/70 shadow-card hover:-translate-y-0.5 hover:bg-white'
              }`}
            >
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-brand-pink">{b.tag}</p>
              <p className="mt-1 font-display text-xl font-extrabold text-ink">{b.label}</p>
              <p className="mt-1 text-sm font-semibold leading-5 text-ink/56">{b.note}</p>
            </button>
          );
        })}
      </div>

      <MonthRoadmap readyDays={chapters.length} doneCount={doneCount} totalLessons={lessons.length} />

      <div className="mt-6 overflow-hidden rounded-[24px] border border-white/80 bg-white/80 p-5 shadow-card backdrop-blur-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="section-kicker">Путь художника · {activeBand?.label}</p>
            <h3 className="mt-2 font-display text-2xl font-extrabold text-ink">{activeBand?.tag}: от формы к своей картинке</h3>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-ink/60">
Месяц состоит из 20 учебных дней: 5 занятий в неделю, затем 2 дня отдыха и повторения. Сейчас открыт первый месяц, следующие месяцы появятся в подписке позже.
            </p>
          </div>
          <div className="min-w-[180px] rounded-2xl bg-cream/80 px-4 py-3">
            <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/42">Прогресс</p>
            <p className="mt-1 font-display text-2xl font-extrabold text-ink">{doneCount}/{lessons.length}</p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full bg-brand-green transition-all" style={{ width: `${percent}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-7 space-y-8">
        {Array.from({ length: MONTH_DAYS }).map((_, dayIndex) => {
          const dayNumber = dayIndex + 1;
          const chapter = chapters[dayIndex];
          return (
            <div key={dayNumber} className="space-y-8">
              {chapter ? (
                <DaySection
                  chapter={chapter}
                  dayNumber={dayNumber}
                  doneSet={doneSet}
                  unlocked={unlocked}
                  onOpen={setActive}
                  onLocked={goSubscribe}
                />
              ) : (
                <LockedDay dayNumber={dayNumber} title={FUTURE_DAY_TITLES[dayIndex - chapters.length] ?? 'Новый день рисования'} />
              )}
              {dayNumber % 5 === 0 && dayNumber < MONTH_DAYS && <WeekendPause week={dayNumber / 5} />}
            </div>
          );
        })}
      </div>

      {active && (
        <LessonPlayer
          key={active.slug}
          lesson={active}
          nextLesson={nextAfter(active)}
          onComplete={markDone}
          onNext={() => setActive(nextAfter(active) ?? null)}
          onClose={() => setActive(null)}
        />
      )}
    </div>
  );
}

