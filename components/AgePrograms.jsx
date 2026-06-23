'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ageGroups } from '../data/content.js';
import { directionsData } from '../data/directions.js';
import { Icon } from './Icon.jsx';

const directionByTitle = new Map(directionsData.map((direction) => [direction.title, direction]));
const fallbackDirectionByAge = {
  '7-9': 'languages',
  '10-12': 'languages',
};

function AgePattern() {
  const blob = (duration, delay = '0s', rotate = '0deg') => ({
    animation: `ageBlobDrift ${duration} ease-in-out infinite`,
    animationDelay: delay,
    '--pattern-rotate': rotate,
  });

  const icon = (duration, delay = '0s', rotate = '0deg') => ({
    animation: `ageIconDrift ${duration} ease-in-out infinite`,
    animationDelay: delay,
    '--pattern-rotate': rotate,
    filter: 'blur(0.2px)',
  });

  const float = (duration, delay = '0s', rotate = '0deg') => ({
    animation: `agePatternFloat ${duration} ease-in-out infinite`,
    animationDelay: delay,
    '--pattern-rotate': rotate,
  });

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -left-[12%] top-[-8%] h-[62%] w-[56%] rounded-[44%_56%_48%_52%/55%_44%_56%_45%] bg-gradient-to-br from-brand-blue/26 via-brand-cyan/16 to-transparent blur-2xl" style={blob('18s', '-4s', '-7deg')} />
      <div className="absolute -right-[15%] top-[5%] h-[58%] w-[54%] rounded-[54%_46%_52%_48%/44%_58%_42%_56%] bg-gradient-to-br from-brand-pink/24 via-brand-purple/18 to-transparent blur-2xl" style={blob('21s', '-9s', '9deg')} />
      <div className="absolute bottom-[-20%] left-[6%] h-[56%] w-[48%] rounded-[42%_58%_52%_48%/60%_42%_58%_40%] bg-gradient-to-tr from-brand-orange/22 via-brand-yellow/14 to-transparent blur-2xl" style={blob('20s', '-2s', '5deg')} />
      <div className="absolute bottom-[-16%] right-[10%] h-[52%] w-[46%] rounded-[58%_42%_46%_54%/42%_52%_48%_58%] bg-gradient-to-tr from-brand-purple/22 via-brand-blue/12 to-transparent blur-2xl" style={blob('24s', '-12s', '-10deg')} />
      <div className="absolute left-[30%] top-[18%] h-[38%] w-[42%] rounded-[999px] bg-gradient-to-r from-white/40 via-brand-pink/10 to-brand-blue/12 blur-3xl" style={blob('26s', '-16s', '0deg')} />

      <div className="absolute left-[4%] top-[18%] h-5 w-5 rounded-full bg-brand-blue opacity-[0.22]" style={float('12s')} />
      <div className="absolute left-[9%] top-[72%] h-7 w-7 rounded-full bg-brand-pink opacity-[0.2]" style={float('17s', '-4s')} />
      <div className="absolute right-[8%] top-[16%] h-6 w-6 rounded-full bg-brand-orange opacity-[0.22]" style={float('14s', '-2s')} />
      <div className="absolute bottom-[12%] right-[14%] h-10 w-10 rounded-full bg-brand-purple opacity-[0.2]" style={float('20s', '-7s')} />
      <div className="absolute left-[2%] bottom-[35%] h-4 w-4 rounded-full bg-brand-orange opacity-[0.22]" style={float('15s', '-6s')} />
      <div className="absolute right-[18%] top-[7%] h-4 w-4 rounded-full bg-brand-blue opacity-[0.21]" style={float('11s', '-1s')} />
      <div className="absolute bottom-[7%] left-[34%] h-8 w-8 rounded-full bg-brand-pink opacity-[0.18]" style={float('19s', '-9s')} />
      <div className="absolute right-[3%] bottom-[38%] h-5 w-5 rounded-full bg-brand-cyan opacity-[0.21]" style={float('13s', '-5s')} />

      <div className="absolute left-[3%] top-[42%] h-[4px] w-40 rounded-full bg-brand-cyan opacity-[0.22]" style={float('16s', '-3s', '-18deg')} />
      <div className="absolute right-[5%] top-[48%] h-[4px] w-44 rounded-full bg-brand-pink opacity-[0.2]" style={float('19s', '-8s', '14deg')} />
      <div className="absolute bottom-[24%] left-[18%] h-[4px] w-36 rounded-full bg-brand-orange opacity-[0.21]" style={float('13s', '-5s', '22deg')} />
      <div className="absolute left-[14%] top-[23%] h-[4px] w-28 rounded-full bg-brand-purple opacity-[0.2]" style={float('18s', '-10s', '32deg')} />
      <div className="absolute right-[16%] bottom-[21%] h-[4px] w-40 rounded-full bg-brand-blue opacity-[0.18]" style={float('14s', '-4s', '-28deg')} />

      <div className="absolute left-[10%] top-[4%] h-44 w-64 rounded-[999px] border-2 border-brand-blue/80 bg-brand-blue/6 opacity-[0.28]" style={blob('18s', '-6s', '-8deg')} />
      <div className="absolute right-[10%] bottom-[7%] h-56 w-36 rounded-[999px] border-2 border-brand-purple/80 bg-brand-purple/6 opacity-[0.28]" style={blob('15s', '-2s', '12deg')} />
      <div className="absolute right-[20%] top-[6%] h-36 w-36 rounded-full border-2 border-brand-orange/80 bg-brand-orange/8 opacity-[0.3]" style={blob('16s', '-1s')} />
      <div className="absolute left-[-2%] bottom-[5%] h-44 w-44 rounded-full border-2 border-brand-pink/80 bg-brand-pink/7 opacity-[0.26]" style={blob('20s', '-12s')} />
      <div className="absolute right-[-3%] top-[61%] h-32 w-56 rounded-[999px] border-2 border-brand-cyan/80 bg-brand-cyan/7 opacity-[0.28]" style={blob('17s', '-7s', '-16deg')} />

      <svg className="absolute left-[4%] top-[27%] h-40 w-40 text-brand-blue opacity-[0.3]" style={icon('16s', '-3s', '-6deg')} viewBox="0 0 64 64" fill="none">
        <path d="M14 16h18c5 0 8 3 8 8v26H22c-5 0-8-3-8-8V16Z" stroke="currentColor" strokeWidth="2" />
        <path d="M40 24c0-5 3-8 8-8h2v34h-2c-5 0-8-3-8-8V24Z" stroke="currentColor" strokeWidth="2" />
        <path d="M22 26h10M22 34h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>

      <svg className="absolute right-[2%] top-[24%] h-48 w-48 text-brand-pink opacity-[0.27]" style={icon('18s', '-9s', '7deg')} viewBox="0 0 64 64" fill="none">
        <path d="M24 19c-6 0-10 5-10 11 0 5 3 8 7 10-1 7 4 12 11 12s12-5 11-12c4-2 7-5 7-10 0-6-4-11-10-11-2-5-7-8-12-7-3 1-5 3-6 7Z" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" />
        <path d="M27 23v25M37 23v25M23 32h18M23 40h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>

      <svg className="absolute bottom-[8%] left-[5%] h-40 w-40 text-brand-orange opacity-[0.32]" style={icon('14s', '-5s', '-10deg')} viewBox="0 0 64 64" fill="none">
        <path d="m32 10 6 14 15 1-12 9 4 15-13-8-13 8 4-15-12-9 15-1 6-14Z" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>

      <svg className="absolute bottom-[28%] right-[5%] h-40 w-40 text-brand-purple opacity-[0.28]" style={icon('20s', '-11s', '12deg')} viewBox="0 0 64 64" fill="none">
        <path d="m20 46 5 5 25-25-5-5-25 25Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="m41 18 5-5 5 5-5 5-5-5ZM18 49l-5 2 2-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <svg className="absolute left-[22%] bottom-[4%] h-44 w-44 text-brand-cyan opacity-[0.24]" style={icon('17s', '-7s', '4deg')} viewBox="0 0 64 64" fill="none">
        <path d="M17 22c0-5 4-9 10-9 5 0 9 3 9 8 0 4-2 7-7 10l-4 3c-4 3-7 6-7 12h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M47 14v36M41 42h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>

      <svg className="absolute right-[28%] top-[14%] h-32 w-32 text-brand-orange opacity-[0.22]" style={icon('12s', '-6s', '-5deg')} viewBox="0 0 64 64" fill="none">
        <path d="M18 46h22c5 0 8-3 8-8V18H26c-5 0-8 3-8 8v20Z" stroke="currentColor" strokeWidth="2" />
        <path d="M25 28h15M25 36h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>

      <svg className="absolute left-[30%] top-[2%] h-32 w-32 text-brand-purple opacity-[0.21]" style={icon('19s', '-8s', '9deg')} viewBox="0 0 64 64" fill="none">
        <path d="m32 12 4 11 12 1-10 7 3 12-9-6-9 6 3-12-10-7 12-1 4-11Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>

      <svg className="absolute right-[31%] bottom-[2%] h-36 w-36 text-brand-pink opacity-[0.22]" style={icon('16s', '-3s', '-8deg')} viewBox="0 0 64 64" fill="none">
        <path d="m18 47 5 5 27-27-5-5-27 27Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="m41 18 4-4 5 5-4 4M18 47l-4 5 6-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function AgePrograms() {
  const [activeId, setActiveId] = useState(ageGroups[0].id);
  const pathname = usePathname();
  const active = ageGroups.find((group) => group.id === activeId);

  return (
    <section id="age" className="age-light-stage section-pad relative isolate overflow-hidden text-ink">
      <div className="pointer-events-none absolute -left-[18%] top-[-18%] z-0 h-[38rem] w-[46rem] rounded-[45%_55%_62%_38%/58%_42%_56%_44%] bg-brand-blue/18 blur-3xl" style={{ animation: 'ageBlobDrift 24s ease-in-out infinite' }} />
      <div className="pointer-events-none absolute -right-[20%] top-[-14%] z-0 h-[40rem] w-[44rem] rounded-[62%_38%_52%_48%/42%_58%_44%_56%] bg-brand-pink/18 blur-3xl" style={{ animation: 'ageBlobDrift 28s ease-in-out -8s infinite', '--pattern-rotate': '10deg' }} />
      <div className="pointer-events-none absolute -bottom-[20%] left-[2%] z-0 h-[34rem] w-[42rem] rounded-[52%_48%_40%_60%/48%_58%_42%_52%] bg-brand-orange/16 blur-3xl" style={{ animation: 'ageBlobDrift 26s ease-in-out -4s infinite', '--pattern-rotate': '-8deg' }} />
      <div className="pointer-events-none absolute -bottom-[20%] right-[4%] z-0 h-[32rem] w-[36rem] rounded-[58%_42%_52%_48%/38%_52%_48%_62%] bg-brand-purple/16 blur-3xl" style={{ animation: 'ageBlobDrift 30s ease-in-out -12s infinite', '--pattern-rotate': '14deg' }} />
      <AgePattern />

      <div className="container-pad relative z-10">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <div>
            <span className="inline-flex rounded-full border border-ink/8 bg-white/72 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-forest-700 shadow-sm backdrop-blur-xl">
              Выбор по возрасту
            </span>
            <h2 className="mt-5 font-display text-[2.35rem] font-bold leading-[1.05] tracking-[-0.02em] sm:text-5xl">
              Занятия растут вместе с ребенком
            </h2>
          </div>
          <p className="max-w-2xl text-lg font-medium leading-8 text-ink/64">
            Вместо общей программы для всех подбираем уровень нагрузки, формат заданий и направления под возраст,
            внимание и текущую школьную нагрузку.
          </p>
        </div>

        <div className="mt-10 rounded-[8px] border border-white/80 bg-white/72 p-2 shadow-insetline backdrop-blur-xl">
          <div className="grid gap-2 md:grid-cols-3">
            {ageGroups.map((group) => (
              <button
                key={group.id}
                type="button"
                onClick={() => setActiveId(group.id)}
                className={`rounded-[8px] p-5 text-left transition duration-300 focus:outline-none focus:ring-4 focus:ring-gold-300/35 ${
                  activeId === group.id
                    ? 'bg-porcelain text-ink shadow-luxe'
                    : 'bg-transparent text-ink/62 hover:bg-white/84 hover:text-ink'
                }`}
              >
                <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-gold-500">{group.eyebrow}</span>
                <span className="mt-2 block font-display text-3xl font-bold">{group.label}</span>
                <span className="mt-3 block text-sm font-bold leading-5 opacity-70">{group.headline}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[8px] border border-white/78 bg-white/72 p-6 text-ink shadow-luxe backdrop-blur-xl sm:p-8">
            <div className="flex flex-col justify-between gap-8 sm:flex-row">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-forest-700">Рекомендуемый фокус</p>
                <h3 className="mt-4 max-w-2xl font-display text-3xl font-bold leading-tight sm:text-4xl">
                  {active.headline}
                </h3>
                <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-ink/64">{active.description}</p>
              </div>
              <div className="h-fit rounded-[8px] bg-brand-yellow p-5 text-night shadow-luxe">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em]">длительность</p>
                <p className="mt-2 font-display text-4xl font-bold">{active.stat}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            <div className="direction-chip-panel rounded-[8px] bg-white p-6 text-ink shadow-luxe">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-forest-700">Подходящие направления</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {active.programs.map((program) => {
                  const direction = resolveDirection(program, active.id);

                  if (!direction) {
                    return (
                      <span key={program} className="rounded-full bg-brand-blue/10 px-4 py-2 text-sm font-extrabold text-brand-blue">
                        {program}
                      </span>
                    );
                  }

                  return <DirectionChip key={`${active.id}-${program}`} direction={direction} pathname={pathname} />;
                })}
              </div>
            </div>
            <div className="rounded-[8px] border border-brand-pink/22 bg-white/68 p-6 text-ink shadow-insetline backdrop-blur-xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-pink">Что усиливаем</p>
              <div className="mt-5 space-y-3">
                {active.outcomes.map((outcome) => (
                  <p key={outcome} className="flex items-center gap-3 text-sm font-extrabold text-ink/72">
                    <Icon name="check" className="h-5 w-5 text-brand-yellow" />
                    {outcome}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function resolveDirection(program, ageId) {
  const exactMatch = directionByTitle.get(program);

  if (exactMatch) {
    return exactMatch;
  }

  const fallbackSlug = fallbackDirectionByAge[ageId];
  return directionsData.find((direction) => direction.slug === fallbackSlug);
}

function DirectionChip({ direction, pathname }) {
  const isActive = pathname === `/${direction.slug}`;

  return (
    <Link
      href={`/${direction.slug}`}
      className={`direction-chip ${isActive ? 'direction-chip-active' : ''}`}
      aria-current={isActive ? 'page' : undefined}
      aria-label={`${direction.title}. Подробнее о направлении`}
      title="Подробнее о направлении"
    >
      <span className="direction-chip__label">{direction.title}</span>
      <span className="direction-chip__arrow" aria-hidden="true">
        <Icon name="arrow" className="h-4 w-4" strokeWidth={2.2} />
      </span>
      <span className="direction-chip__tooltip" role="tooltip">
        Подробнее о направлении
      </span>
    </Link>
  );
}