import Link from 'next/link';
import { Icon } from './Icon.jsx';

const langs = [
  {
    title: 'Английский для детей',
    slug: 'english-for-kids',
    emoji: '🇬🇧',
    soft: 'bg-brand-green/12',
    accent: 'text-forest-700',
    blurb: 'Живая разговорная речь без зубрёжки: ребёнок понимает и говорит через игры и ситуации.',
    points: ['Разговорная речь с первых занятий', 'Снятие языкового барьера', 'Поддержка школьной программы'],
  },
  {
    title: 'Русский язык для детей',
    slug: 'russkiy-yazyk-dlya-detey',
    emoji: '✏️',
    soft: 'bg-brand-orange/12',
    accent: 'text-brand-orange',
    blurb: 'Грамотность через понимание: меньше ошибок, увереннее письмо и связная речь.',
    points: ['Грамотное письмо без зубрёжки', 'Помощь со школьной программой', 'Развитие связной речи'],
  },
];

export function LanguagesHub() {
  return (
    <section className="px-5 py-12 sm:px-8 lg:px-14">
      <div className="container-pad px-0">
        <span className="comic-label">выберите язык</span>
        <h2 className="section-title mt-6 max-w-3xl">Английский или русский — с чего начнём?</h2>
        <p className="mt-4 max-w-2xl text-lg font-medium leading-8 text-ink/64">
          В «Разумейке» два языковых направления. Выберите нужное — на каждой странице подробная программа, формат и пробный урок.
        </p>

        <div className="mt-9 grid gap-6 lg:grid-cols-2">
          {langs.map((l) => (
            <Link
              key={l.slug}
              href={`/${l.slug}`}
              className="group rounded-[8px] border-2 border-ink bg-white p-7 shadow-[10px_10px_0_rgba(19,35,27,0.14)] transition hover:-translate-y-1 sm:p-8"
            >
              <div className="flex items-center gap-4">
                <span className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-[8px] border-2 border-ink ${l.soft} text-4xl`}>
                  {l.emoji}
                </span>
                <h3 className="font-display text-2xl font-black leading-tight text-ink">{l.title}</h3>
              </div>
              <p className="mt-4 text-base font-medium leading-7 text-ink/64">{l.blurb}</p>
              <ul className="mt-4 grid gap-2">
                {l.points.map((p) => (
                  <li key={p} className="flex items-center gap-2.5 text-sm font-semibold text-ink/72">
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-ink ${l.soft} ${l.accent}`}>
                      <Icon name="check" className="h-3 w-3" />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
              <span className={`mt-6 inline-flex items-center gap-2 font-display text-lg font-extrabold ${l.accent}`}>
                Перейти к направлению
                <Icon name="arrow" className="h-5 w-5 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
