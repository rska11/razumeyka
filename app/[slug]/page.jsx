import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/Icon.jsx';
import { Logo } from '@/components/Logo.jsx';
import { directionsData, getDirectionBySlug } from '@/data/directions.js';

const stepIcons = ['spark', 'focus', 'confidence', 'creative', 'logic', 'check'];

export function generateStaticParams() {
  return directionsData.map((direction) => ({ slug: direction.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const direction = getDirectionBySlug(slug);

  if (!direction) {
    return { title: 'Страница не найдена' };
  }

  return {
    title: direction.title,
    description: direction.offer,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      type: 'article',
      locale: 'ru_RU',
      siteName: 'Разумейка',
      url: `https://razumeyka-school.ru/${slug}`,
      title: `${direction.title} — Разумейка`,
      description: direction.offer,
      images: [{ url: direction.image, width: 1200, height: 630, alt: direction.title }],
    },
  };
}

export default async function DirectionPage({ params }) {
  const { slug } = await params;
  const direction = getDirectionBySlug(slug);
  const isMentalArithmetic = direction?.slug === 'mental-arithmetic';

  if (!direction) {
    notFound();
  }

  return (
    <main className="mesh-bg min-h-screen">
      <DirectionHeader title={direction.shortTitle} />

      <section className="relative overflow-hidden px-5 pb-14 pt-28 sm:px-8 sm:pb-20 sm:pt-32 lg:px-14">
        <div className={`pointer-events-none absolute left-0 top-8 h-64 w-64 rounded-full ${direction.heroGlow} blur-3xl`} />
        <div className="container-pad px-0">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <span className={`section-kicker ${direction.accentSoft}`}>{direction.kicker}</span>
              <h1 className="display-title mt-6 text-[2.8rem] leading-[0.96] sm:text-6xl lg:text-[4.9rem]">
                {direction.title}
              </h1>
              <p className="mt-6 max-w-xl text-xl font-medium leading-9 text-ink/66">{direction.offer}</p>

              <div className="mt-7 flex flex-wrap gap-2">
                {direction.chips.map((chip) => (
                  <span key={chip} className="floating-chip">
                    {chip}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <a href="/#form" className="primary-btn">
                  {direction.cta}
                  <Icon name="arrow" className="relative h-5 w-5" />
                </a>
                <a href="/#programs" className="secondary-btn">
                  Все направления
                </a>
              </div>

              {isMentalArithmetic && (
                <>
                  <div className="mt-5 flex flex-wrap gap-2.5">
                    {direction.trustBadges.map((item) => (
                      <span key={item} className="floating-chip animate-softPop">
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-brand-blue/16 bg-white/84 px-4 py-3 text-sm font-extrabold text-ink shadow-[0_14px_28px_rgba(16,42,86,0.07)]">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-blue text-white">
                      <Icon name="users" className="h-4 w-4" />
                    </span>
                    {direction.socialProof}
                  </div>
                </>
              )}
            </div>

            <div className="relative">
              <div className={`absolute -inset-4 rounded-[32px] bg-gradient-to-br ${direction.gradient} opacity-22 blur-2xl`} />
              <div className="relative overflow-hidden rounded-[30px] border border-white/80 bg-white/60 p-4 shadow-color backdrop-blur-xl sm:p-5">
                <div className={`rounded-[24px] bg-gradient-to-br ${direction.bg} p-4 sm:p-5`}>
                  <div className="grid gap-4 sm:grid-cols-[1.15fr_0.85fr] sm:items-end">
                    <div className="overflow-hidden rounded-[24px] bg-night shadow-luxe">
                      <img src={direction.image} alt={direction.title} className="h-[360px] w-full object-cover sm:h-[420px]" />
                    </div>
                    <div className="grid gap-3">
                      <InfoTile title="Формат" text="Онлайн, мини-группа до 6 детей" icon="screen" accent={direction.accentSoft} />
                      <InfoTile title="Старт" text="Пробный урок 400 ₽" icon="calendar" accent={direction.accentSoft} />
                      <InfoTile title="Фокус" text={direction.metric} icon={direction.icon} accent={direction.accentSoft} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-8 sm:px-8 lg:px-14">
        <div className="container-pad grid gap-6 px-0 lg:grid-cols-2">
          <ContentCard title="Что даст ребенку" accent={direction.accentText}>
            {direction.results.map((item) => (
              <FeatureRow key={item} text={item} icon="check" accent={direction.accentSoft} />
            ))}
          </ContentCard>

          {isMentalArithmetic ? (
            <ContentCard title="Было → Стало" accent={direction.accentText}>
              <div className="grid gap-4">
                {direction.beforeAfter.map((item, index) => (
                  <div
                    key={item.before}
                    className={`group rounded-[24px] border border-white/90 bg-gradient-to-br ${index % 2 === 0 ? 'from-brand-blue/10 via-white to-brand-cyan/8' : 'from-brand-orange/10 via-white to-brand-blue/8'} p-5 shadow-[0_16px_34px_rgba(16,42,86,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_42px_rgba(16,42,86,0.12)]`}
                  >
                    <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                      <div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-ink/44">Было</p>
                        <p className="mt-2 text-lg font-extrabold leading-7 text-ink/72">{item.before}</p>
                      </div>
                      <div className="flex justify-center">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-white shadow-[0_14px_28px_rgba(16,42,86,0.14)]">
                          <Icon name="arrow" className="h-5 w-5" />
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-brand-blue">Стало</p>
                        <p className="mt-2 text-lg font-extrabold leading-7 text-ink">{item.after}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ContentCard>
          ) : (
            <ContentCard title="Кому подходит" accent={direction.accentText}>
              {direction.audience.map((item, index) => (
                <FeatureRow key={item} text={item} icon={index === 0 ? 'users' : 'mentor'} accent={direction.accentSoft} />
              ))}
            </ContentCard>
          )}
        </div>
      </section>

      <section className="px-5 py-8 sm:px-8 lg:px-14">
        <div className="container-pad px-0">
          <ContentCard title="Кому подходит" accent={direction.accentText}>
            {isMentalArithmetic && (
              <p className="mb-4 text-lg font-bold leading-8 text-ink/64">
                {direction.audienceIntro}
              </p>
            )}
            <div className="grid gap-3 lg:grid-cols-2">
              {direction.audience.map((item, index) => (
                <FeatureRow key={item} text={item} icon={index === 0 ? 'users' : 'mentor'} accent={direction.accentSoft} />
              ))}
            </div>
          </ContentCard>
        </div>
      </section>

      <section className="px-5 py-8 sm:px-8 lg:px-14">
        <div className="container-pad grid gap-6 px-0 lg:grid-cols-[0.92fr_1.08fr]">
          <ContentCard title="Как проходят занятия" accent={direction.accentText}>
            {direction.format.map((item) => (
              <FeatureRow key={item} text={item} icon="clock" accent={direction.accentSoft} />
            ))}
          </ContentCard>

          <ContentCard title="Программа" accent={direction.accentText}>
            {isMentalArithmetic ? (
              <TimelineProgram direction={direction} />
            ) : (
              <div className="grid gap-3">
                {direction.program.map((item, index) => (
                  <ProgramStep
                    key={item}
                    step={index + 1}
                    text={item}
                    icon={stepIcons[index % stepIcons.length]}
                    accent={direction.accentSoft}
                  />
                ))}
              </div>
            )}
          </ContentCard>
        </div>
      </section>

      <section className="px-5 py-8 sm:px-8 lg:px-14">
        <div className="container-pad px-0">
          <div className={`overflow-hidden rounded-[30px] border border-white/80 bg-gradient-to-br ${direction.bg} p-6 shadow-color sm:p-8`}>
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <span className={`section-kicker ${direction.accentSoft}`}>Результат через 1 месяц</span>
                <h2 className="section-title mt-5">{direction.monthTitle ?? 'Что станет заметно дома и в учебе'}</h2>
                <p className="mt-5 text-lg font-medium leading-8 text-ink/66">
                  {direction.monthText ??
                    'Мы даем не только красивые занятия, но и понятные изменения, которые родитель замечает уже в первый месяц.'}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {direction.monthResult.map((item) => (
                  <div key={item} className="rounded-[22px] border border-white/80 bg-white/84 p-4 shadow-[0_14px_30px_rgba(16,42,86,0.08)]">
                    <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] ${direction.accentSoft}`}>
                      1 месяц
                    </span>
                    <p className="mt-3 text-base font-extrabold leading-7 text-ink">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            {direction.monthDisclaimer && (
              <p className="mt-5 text-sm font-medium leading-6 text-ink/54">{direction.monthDisclaimer}</p>
            )}
          </div>
        </div>
      </section>

      <section className="px-5 pb-16 pt-8 sm:px-8 sm:pb-20 lg:px-14">
        <div className="container-pad px-0">
          <div className="relative overflow-hidden rounded-[30px] border border-white/78 bg-white/80 p-6 shadow-[0_24px_70px_rgba(16,42,86,0.11)] backdrop-blur-xl sm:p-8">
            <div className={`pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full ${direction.heroGlow} blur-3xl`} />
            <div className="relative grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className={`text-xs font-extrabold uppercase tracking-[0.18em] ${direction.accentText}`}>Финальный шаг</p>
                <h2 className="section-title mt-4">{direction.ctaTitle}</h2>
                <p className="mt-4 max-w-2xl text-lg font-medium leading-8 text-ink/64">{direction.ctaText}</p>
                {direction.ctaBullets && (
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {direction.ctaBullets.map((item) => (
                      <div key={item} className="rounded-[20px] border border-white/80 bg-white/84 px-4 py-4 shadow-[0_14px_28px_rgba(16,42,86,0.07)] transition duration-300 hover:-translate-y-1">
                        <div className="flex items-center gap-3">
                          <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${direction.accentSoft}`}>
                            <Icon name="check" className="h-4.5 w-4.5" />
                          </span>
                          <p className="text-sm font-extrabold leading-6 text-ink">{item}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <a href="/#form" className="primary-btn sm:w-fit">
                Записаться на пробный урок 400 ₽
                <Icon name="arrow" className="relative h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function DirectionHeader({ title }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-4 sm:px-6 sm:pt-5">
      <div className="mx-auto flex min-h-[88px] max-w-[1380px] items-center justify-between gap-4 rounded-[24px] border border-white/75 bg-porcelain/86 px-5 py-4 shadow-color backdrop-blur-2xl sm:px-7">
        <Link href="/" className="flex items-center gap-4" aria-label="На главную">
          <Logo />
          <span className="hidden text-left sm:block">
            <span className="block text-sm font-extrabold uppercase tracking-[0.16em] text-forest-700">Разумейка</span>
            <span className="mt-1 block text-sm font-bold text-ink/52">{title}</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/#programs" className="secondary-btn hidden min-h-[52px] px-6 md:inline-flex">
            Все направления
          </Link>
          <a href="/#form" className="primary-btn min-h-[52px] px-6">
            Пробный урок
            <Icon name="arrow" className="relative h-5 w-5" />
          </a>
        </div>
      </div>
    </header>
  );
}

function InfoTile({ title, text, icon, accent }) {
  return (
    <div className="rounded-[22px] border border-white/80 bg-white/82 p-4 shadow-[0_14px_30px_rgba(16,42,86,0.08)]">
      <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${accent}`}>
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <p className="mt-3 text-xs font-extrabold uppercase tracking-[0.14em] text-ink/46">{title}</p>
      <p className="mt-2 text-sm font-extrabold leading-6 text-ink">{text}</p>
    </div>
  );
}

function ContentCard({ title, accent, children }) {
  return (
    <div className="rounded-[28px] border border-white/80 bg-white/80 p-5 shadow-[0_20px_54px_rgba(16,42,86,0.09)] backdrop-blur-xl sm:p-6">
      <h2 className={`font-display text-[2rem] font-extrabold leading-[1.02] ${accent}`}>{title}</h2>
      <div className="mt-5 grid gap-3">{children}</div>
    </div>
  );
}

function FeatureRow({ text, icon, accent }) {
  return (
    <div className="flex items-start gap-3 rounded-[20px] bg-ink/[0.02] px-4 py-4">
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${accent}`}>
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <p className="pt-1 text-base font-extrabold leading-7 text-ink/82">{text}</p>
    </div>
  );
}

function ProgramStep({ step, text, icon, accent }) {
  return (
    <div className="rounded-[22px] border border-ink/8 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(247,250,255,0.92))] p-4 shadow-[0_12px_28px_rgba(16,42,86,0.06)]">
      <div className="flex items-start gap-3">
        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${accent}`}>
          <Icon name={icon} className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-ink/44">Этап {step}</p>
          <p className="mt-2 text-base font-extrabold leading-7 text-ink">{text}</p>
        </div>
      </div>
    </div>
  );
}

function TimelineProgram({ direction }) {
  return (
    <div className="relative grid gap-4">
      <div className="pointer-events-none absolute left-6 top-6 hidden h-[calc(100%-3rem)] w-[2px] bg-gradient-to-b from-brand-blue via-brand-cyan to-brand-orange sm:block" />
      {direction.timeline.map((item, index) => (
        <div
          key={item.week}
          className={`group relative rounded-[24px] border border-white/90 bg-gradient-to-br ${item.accent} p-5 shadow-[0_16px_34px_rgba(16,42,86,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_44px_rgba(16,42,86,0.12)]`}
        >
          <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-start">
            <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-white shadow-[0_14px_28px_rgba(16,42,86,0.14)]">
              <span className="text-sm font-extrabold">{index + 1}</span>
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-ink/46">{item.week}</p>
              <p className="mt-2 text-xl font-extrabold leading-8 text-ink">{item.title}</p>
              <p className="mt-3 text-base font-medium leading-7 text-ink/66">{item.text}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
