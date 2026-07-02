import Link from 'next/link';
import { Header } from '@/components/Header.jsx';
import { Footer } from '@/components/Footer.jsx';
import { Icon } from '@/components/Icon.jsx';
import { getDirectionBySlug } from '@/data/directions.js';
import { getLandingBySlug } from '@/data/landings.js';
import { DirectionGame } from '@/components/games/DirectionGame.jsx';

const accents = {
  blue: { soft: 'bg-brand-blue/10', text: 'text-brand-blue' },
  pink: { soft: 'bg-brand-pink/12', text: 'text-brand-pink' },
  green: { soft: 'bg-brand-green/14', text: 'text-forest-700' },
  orange: { soft: 'bg-brand-orange/14', text: 'text-brand-orange' },
};

const CARD = 'rounded-[8px] border-2 border-ink bg-white shadow-[7px_7px_0_rgba(19,35,27,0.12)]';

export function LandingPage({ landing }) {
  const related = (landing.relatedSlugs ?? [])
    .map((s) => {
      const d = getDirectionBySlug(s);
      if (d) return { slug: d.slug, title: d.title };
      const l = getLandingBySlug(s);
      if (l) return { slug: l.slug, title: l.h1 };
      return null;
    })
    .filter(Boolean);

  const a = accents[landing.theme] ?? accents.blue;
  const stats = landing.stats ?? [
    { v: 'до 6', l: 'детей в группе' },
    { v: 'онлайн', l: 'из любого города' },
    { v: '400 ₽', l: 'пробный урок' },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: landing.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: landing.h1,
    description: landing.description,
    url: `https://razumeyka-school.ru/${landing.slug}`,
    inLanguage: 'ru',
    provider: { '@type': 'Organization', name: 'Разумейка', url: 'https://razumeyka-school.ru' },
    hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: 'PT55M' },
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://razumeyka-school.ru' },
      { '@type': 'ListItem', position: 2, name: landing.h1 },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header />
      <main className="mesh-bg min-h-screen">
        {/* Hero */}
        <section className="px-5 pb-10 pt-28 sm:px-8 sm:pt-32 lg:px-14">
          <div className="container-pad px-0">
            <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <span className="comic-label">Онлайн-школа «Разумейка»</span>
                <h1 className="display-title mt-6 text-[2.3rem] sm:text-5xl lg:text-[3.6rem]">{landing.h1}</h1>
                <div className="mt-6 space-y-4 text-lg font-medium leading-8 text-ink/66">
                  {landing.intro.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href="/#form" className="primary-btn">Записаться на пробный · 400 ₽</a>
                  <Link href="/" className="secondary-btn">Все направления</Link>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
                <div className={`flex aspect-square items-center justify-center rounded-[8px] border-2 border-ink ${a.soft} shadow-[12px_12px_0_rgba(19,35,27,0.14)]`}>
                  <span className="text-[8rem] sm:text-[9.5rem]">{landing.emoji ?? '✨'}</span>
                </div>
                <div className="comic-label absolute -left-3 top-8 rotate-[-3deg] normal-case tracking-normal">Мини-группы до 6</div>
                <div className="comic-label absolute -right-3 bottom-10 rotate-[2deg] normal-case tracking-normal">Пробный · 400 ₽</div>
              </div>
            </div>

            {/* Статистика */}
            <div className={`mt-14 grid gap-4 ${stats.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'}`}>
              {stats.map((s) => (
                <div key={s.l} className={`${CARD} p-4 text-center`}>
                  <p className={`font-display text-2xl font-black sm:text-3xl ${a.text}`}>{s.v}</p>
                  <p className="mt-1 text-xs font-bold leading-5 text-ink/56 sm:text-sm">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Что развиваем */}
        <section className="px-5 py-12 sm:px-8 lg:px-14">
          <div className="container-pad px-0">
            <span className="comic-label">что развиваем</span>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {landing.bullets.map((b, i) => (
                <div key={i} className={`flex items-start gap-3 ${CARD} p-5`}>
                  <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-ink ${a.soft} ${a.text}`}>
                    <Icon name="check" className="h-4 w-4" />
                  </span>
                  <span className="text-base font-semibold text-ink/78">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Как проходит занятие */}
        {landing.steps?.length > 0 && (
          <section className="px-5 py-12 sm:px-8 lg:px-14">
            <div className="container-pad px-0">
              <span className="comic-label">как проходит занятие</span>
              <div className="mt-7 grid gap-4 lg:grid-cols-2">
                {landing.steps.map((s, i) => (
                  <div key={i} className={`flex gap-4 ${CARD} p-6`}>
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-ink ${a.soft} font-display text-lg font-black ${a.text}`}>
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-display text-lg font-extrabold text-ink">{s.title}</p>
                      <p className="mt-1 text-base font-medium leading-7 text-ink/66">{s.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Результат через месяц */}
        {landing.results?.length > 0 && (
          <section className="px-5 py-12 sm:px-8 lg:px-14">
            <div className="container-pad px-0">
              <div className="rounded-[8px] border-2 border-ink bg-night p-8 text-porcelain shadow-[12px_12px_0_rgba(19,35,27,0.2)] sm:p-12">
                <h2 className="font-display text-2xl font-black text-white sm:text-4xl">Что родители замечают уже через месяц</h2>
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {landing.results.map((r, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-[8px] border border-white/12 bg-white/[0.06] p-4">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-300 text-night">
                        <Icon name="check" className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-base font-semibold leading-6 text-porcelain/90">{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Мини-игра */}
        <DirectionGame slug={landing.slug} />

        {/* FAQ */}
        <section className="px-5 py-12 sm:px-8 lg:px-14">
          <div className="container-pad mx-auto max-w-3xl px-0">
            <span className="comic-label">частые вопросы</span>
            <div className="mt-7 grid gap-3">
              {landing.faq.map((f, i) => (
                <details key={i} className={`group ${CARD} p-5`}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-extrabold text-ink">
                    {f.q}
                    <span className={`${a.text} transition group-open:rotate-45`}>
                      <Icon name="spark" className="h-5 w-5" />
                    </span>
                  </summary>
                  <p className="mt-3 text-base font-medium leading-7 text-ink/68">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Другие направления */}
        {related.length > 0 && (
          <section className="px-5 py-8 sm:px-8 lg:px-14">
            <div className="container-pad px-0">
              <span className="comic-label">другие направления</span>
              <div className="mt-7 flex flex-wrap gap-3">
                {related.map((d) => (
                  <Link key={d.slug} href={`/${d.slug}`} className="rounded-full border-2 border-ink bg-white px-5 py-3 text-base font-extrabold text-ink shadow-[4px_4px_0_rgba(19,35,27,0.12)] transition hover:-translate-y-0.5">
                    {d.title}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="px-5 py-14 sm:px-8 lg:px-14">
          <div className="container-pad px-0">
            <div className="rounded-[8px] border-2 border-ink bg-night p-8 text-center text-porcelain shadow-[12px_12px_0_rgba(19,35,27,0.2)] sm:p-12">
              <h2 className="font-display text-3xl font-black text-white sm:text-4xl">Попробуйте — пробный урок 400 ₽</h2>
              <p className="mx-auto mt-3 max-w-xl text-lg font-medium text-porcelain/80">Педагог оценит уровень ребёнка, ответит на вопросы и покажет формат. Без обязательств.</p>
              <a href="/#form" className="mt-7 inline-flex rounded-full bg-gold-300 px-7 py-3.5 text-base font-extrabold text-night transition hover:-translate-y-0.5 hover:bg-white">Записаться</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
