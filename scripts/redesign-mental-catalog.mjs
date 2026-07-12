import { readFile, writeFile } from 'node:fs/promises';
const file = new URL('../components/mental/MentalLessons.jsx', import.meta.url);
let source = await readFile(file, 'utf8');
source = source.replace("import { MentalLessonPlayer } from './MentalLessonPlayer.jsx';", "import { MentalLessonPlayer } from './MentalLessonPlayer.jsx';\nimport { Soroban } from './Soroban.jsx';");
source = source.replace(`function MonthRoadmap({ readyDays }) {`, `function previewValue(lesson) {
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

function MonthRoadmap({ readyDays }) {`);
source = source.replace(`    <section className="border-t border-ink/8 pt-5 first:border-t-0 first:pt-0">`, `    <section className="mental-day-section">`);
source = source.replace(`      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">`, `      <div className="mental-day-head">`);
source = source.replace(`          <p className={\`text-xs font-extrabold uppercase tracking-[0.14em] \${isWarmup ? 'text-brand-orange' : 'text-brand-blue'}\`}>`, `          <p className="mental-day-number">`);
source = source.replace(`          <h4 className="font-display text-2xl font-extrabold text-ink">{day.title}</h4>`, `          <h4 className="mental-day-title">{day.title}</h4>`);
source = source.replace(`      <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">`, `      <div className="mental-lesson-grid">`);
const start = source.indexOf(`            <button\n              key={l.slug}`);
const end = source.indexOf(`            </button>`, start);
if (start < 0 || end < 0) throw new Error('Mental lesson card not found');
const card = `            <button
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
            </button>`;
source = source.slice(0, start) + card + source.slice(end + `            </button>`.length);
source = source.replace(`      <div className="grid gap-3 sm:grid-cols-2">`, `      <div className="mental-age-tabs">`);
const oldClass = `              className={\`rounded-[20px] border-2 px-5 py-4 text-left transition \${
                on
                  ? 'border-brand-blue/50 bg-white shadow-color'
                  : 'border-white/70 bg-white/70 shadow-card hover:-translate-y-0.5 hover:bg-white'
              }\`}`;
source = source.replace(oldClass, `              className={'mental-age-tab ' + (on ? 'mental-age-tab-active' : '')}`);
source = source.replace(`<p className="text-xs font-extrabold uppercase tracking-[0.14em] text-brand-blue">{b.tag}</p>`, `<p className="mental-age-tag">{b.tag}</p>`);
source = source.replace(`<p className="mt-1 font-display text-xl font-extrabold text-ink">{b.label}</p>`, `<p className="mental-age-label">{b.label}</p>`);
source = source.replace(`      <div className="mt-6 overflow-hidden rounded-[24px] border border-white/80 bg-white/80 p-5 shadow-card backdrop-blur-xl">`, `      <div className="mental-course-overview">`);
source = source.replace(`      <div className="mt-7 space-y-8">`, `      <div className="mental-days-list">`);
await writeFile(file, source, 'utf8');
