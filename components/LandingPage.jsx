import Link from 'next/link';
import { Header } from '@/components/Header.jsx';
import { Footer } from '@/components/Footer.jsx';
import { Icon } from '@/components/Icon.jsx';
import { getDirectionBySlug } from '@/data/directions.js';

export function LandingPage({ landing }) {
  const related = (landing.relatedSlugs ?? [])
    .map((s) => getDirectionBySlug(s))
    .filter(Boolean);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: landing.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Header />
      <main className="mesh-bg min-h-screen">
        {/* Hero */}
        <section className="px-5 pb-12 pt-28 sm:px-8 sm:pt-32 lg:px-14">
          <div className="container-pad px-0">
            <span className="floating-chip inline-flex">Онлайн-школа «Разумейка»</span>
            <h1 className="display-title mt-5 max-w-4xl text-[2.4rem] leading-[1.02] sm:text-5xl lg:text-[4rem]">
              {landing.h1}
            </h1>
            <div className="mt-6 max-w-2xl space-y-4 text-lg font-medium leading-8 text-ink/68">
              {landing.intro.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/#form" className="primary-btn">Записаться на пробный урок · 400 ₽</a>
              <Link href="/" className="secondary-btn">Все направления</Link>
            </div>
          </div>
        </section>

        {/* Что развиваем */}
        <section className="px-5 py-12 sm:px-8 lg:px-14">
          <div className="container-pad px-0">
            <h2 className="section-title">Что развиваем</h2>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {landing.bullets.map((b, i) => (
                <div key={i} className="flex items-start gap-3 rounded-[18px] border border-white/80 bg-white/80 p-4 shadow-card backdrop-blur-xl">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-blue/12 text-brand-blue">
                    <Icon name="check" className="h-4 w-4" />
                  </span>
                  <span className="text-base font-semibold text-ink/78">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-5 py-12 sm:px-8 lg:px-14">
          <div className="container-pad mx-auto max-w-3xl px-0">
            <h2 className="section-title">Частые вопросы</h2>
            <div className="mt-7 grid gap-3">
              {landing.faq.map((f, i) => (
                <details key={i} className="rounded-[18px] border border-white/80 bg-white/80 p-5 shadow-card backdrop-blur-xl">
                  <summary className="cursor-pointer list-none text-lg font-extrabold text-ink">{f.q}</summary>
                  <p className="mt-3 text-base font-medium leading-7 text-ink/68">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Другие направления */}
        {related.length > 0 && (
          <section className="px-5 py-12 sm:px-8 lg:px-14">
            <div className="container-pad px-0">
              <h2 className="section-title">Другие направления</h2>
              <div className="mt-7 flex flex-wrap gap-3">
                {related.map((d) => (
                  <Link key={d.slug} href={`/${d.slug}`} className="rounded-full border border-ink/12 bg-white/80 px-5 py-3 text-base font-extrabold text-ink transition hover:bg-white">
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
              <p className="mx-auto mt-3 max-w-xl text-lg font-medium text-white/85">
                Педагог оценит уровень ребёнка и покажет формат. Без обязательств.
              </p>
              <a href="/#form" className="mt-7 inline-flex rounded-full bg-white px-7 py-3.5 text-base font-extrabold text-brand-blue transition hover:-translate-y-0.5">
                Записаться
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
