import Link from 'next/link';
import { Header } from '@/components/Header.jsx';
import { Footer } from '@/components/Footer.jsx';
import { Icon } from '@/components/Icon.jsx';
import { getDirectionBySlug } from '@/data/directions.js';
import { getLandingBySlug } from '@/data/landings.js';
import { DirectionGame } from '@/components/games/DirectionGame.jsx';

const themes = {
  blue: 'from-brand-blue to-brand-purple',
  pink: 'from-brand-pink to-brand-orange',
  green: 'from-brand-green to-brand-blue',
  orange: 'from-brand-orange to-brand-pink',
};

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

  const grad = themes[landing.theme] ?? themes.blue;
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
        <section className="relative overflow-hidden px-5 pb-10 pt-28 sm:px-8 sm:pt-32 lg:px-14">
          <div className="pointer-events-none absolute -right-20 top-20 h-80 w-80 rounded-full bg-brand-pink/16 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 top-64 h-64 w-64 rounded-full bg-brand-blue/16 blur-3xl" />
          <div className="container-pad relative px-0">
            <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <span className="floating-chip inline-flex">Онлайн-школа «Разумейка»</span>
                <h1 className="display-title mt-5 text-[2.3rem] leading-[1.03] sm:text-5xl lg:text-[3.7rem]">{landing.h1}</h1>
                <div className="mt-6 space-y-4 text-lg font-medium leading-8 text-ink/68">
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
                <div className={`flex aspect-square items-center justify-center rounded-[40px] bg-gradient-to-br ${grad} shadow-color`}>
                  <span className="text-[8rem] drop-shadow-xl sm:text-[10rem]">{landing.emoji ?? '✨'}</span>
                </div>
                <div className="absolute -left-3 top-8 rounded-2xl border border-white/80 bg-white/90 px-4 py-2.5 text-sm font-extrabold text-ink shadow-card backdrop-blur-xl">
                  Мини-группы до 6 👦👧
                </div>
                <div className="absolute -right-3 bottom-10 rounded-2xl border border-white/80 bg-white/90 px-4 py-2.5 text-sm font-extrabold text-ink shadow-card backdrop-blur-xl">
                  Пробный · 400 ₽
                </div>
              </div>
            </div>

            {/* Статистика */}
            <div className={`mt-12 grid gap-3 ${stats.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'}`}>
              {stats.map((s) => (
                <div key={s.l} className="rounded-[20px] border border-white/80 bg-white/85 p-4 text-center shadow-card backdrop-blur-xl">
                  <p className="font-display text-2xl font-black text-brand-blue sm:text-3xl">{s.v}</p>
                  <p className="mt-1 text-xs font-bold leading-5 text-ink/56 sm:text-sm">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Что развиваем */}
        <section className="px-5 py-12 sm:px-8 lg:px-14">
          <div className="container-pad px-0">
            <h2 className="section-title">Что развиваем</h2>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {landing.bullets.map((b, i) => (
                <div key={i} className="flex items-start gap-3 rounded-[18px] border border-white/80 bg-white/85 p-4 shadow-card backdrop-blur-xl">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-green/14 text-brand-green">
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
              <h2 className="section-title">Как проходит занятие</h2>
              <div className="mt-7 grid gap-3 lg:grid-cols-2">
                {landing.steps.map((s, i) => (
                  <div key={i} className="flex gap-4 rounded-[20px] border border-white/80 bg-white/85 p-5 shadow-card backdrop-blur-xl">
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${grad} text-lg font-black text-white`}>
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
              <div className={`overflow-hidden rounded-[28px] bg-gradient-to-br ${grad} p-8 text-white shadow-color sm:p-12`}>
                <h2 className="font-display text-2xl font-black sm:text-4xl">Что родители замечают уже через месяц</h2>
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {landing.results.map((r, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-[16px] bg-white/12 p-4 backdrop-blur-sm">
                      <span className="mt-0.5 text-lg">✓</span>
                      <span className="text-base font-semibold leading-6">{r}</span>
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
            <h2 className="section-title">Частые вопросы</h2>
            <div className="mt-7 grid gap-3">
              {landing.faq.map((f, i) => (
                <details key={i} className="group rounded-[18px] border border-white/80 bg-white/85 p-5 shadow-card backdrop-blur-xl">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-extrabold text-ink">
                    {f.q}
                    <span className="text-brand-blue transition group-open:rotate-45">
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
              <h2 className="section-title">Другие направления</h2>
              <div className="mt-7 flex flex-wrap gap-3">
                {related.map((d) => (
                  <Link key={d.slug} href={`/${d.slug}`} className="rounded-full border border-ink/12 bg-white/80 px-5 py-3 text-base font-extrabold text-ink transition hover:-translate-y-0.5 hover:bg-white">
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
            <div className="rounded-[28px] bg-gradient-to-br from-brand-blue to-brand-purple p-8 text-center text-white shadow-color sm:p-12">
              <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Попробуйте — пробный урок 400 ₽</h2>
              <p className="mx-auto mt-3 max-w-xl text-lg font-medium text-white/85">Педагог оценит уровень ребёнка, ответит на вопросы и покажет формат. Без обязательств.</p>
              <a href="/#form" className="mt-7 inline-flex rounded-full bg-white px-7 py-3.5 text-base font-extrabold text-brand-blue transition hover:-translate-y-0.5">Записаться</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
