import Link from 'next/link';
import { Icon } from './Icon.jsx';

const langs = [
  {
    title: 'Английский для детей',
    slug: 'english-for-kids',
    emoji: '🇬🇧',
    blurb: 'Живая разговорная речь без зубрёжки: ребёнок понимает и говорит через игры и ситуации.',
  },
  {
    title: 'Русский язык для детей',
    slug: 'russkiy-yazyk-dlya-detey',
    emoji: '✏️',
    blurb: 'Грамотность через понимание: меньше ошибок, увереннее письмо и связная речь.',
  },
];

export function LanguagesHub() {
  return (
    <section className="px-5 py-10 sm:px-8 lg:px-14">
      <div className="container-pad px-0">
        <h2 className="section-title text-center">Выберите язык</h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-base font-medium text-ink/64">
          В «Разумейке» два языковых направления — переходите к нужному.
        </p>
        <div className="mx-auto mt-8 grid max-w-3xl gap-5 sm:grid-cols-2">
          {langs.map((l) => (
            <Link
              key={l.slug}
              href={`/${l.slug}`}
              className="group rounded-[24px] border border-white/80 bg-white/85 p-7 shadow-card backdrop-blur-xl transition hover:-translate-y-1"
            >
              <span className="text-5xl">{l.emoji}</span>
              <h3 className="mt-4 font-display text-2xl font-extrabold text-ink transition group-hover:text-brand-blue">{l.title}</h3>
              <p className="mt-2 text-base font-medium leading-7 text-ink/64">{l.blurb}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-base font-extrabold text-brand-blue">
                Подробнее <Icon name="arrow" className="h-5 w-5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
