import Link from 'next/link';
import { Header } from '@/components/Header.jsx';
import { Footer } from '@/components/Footer.jsx';
import { Icon } from '@/components/Icon.jsx';
import { getDirectionBySlug } from '@/data/directions.js';
import { getLandingBySlug } from '@/data/landings.js';
import { DirectionGame } from '@/components/games/DirectionGame.jsx';
import { LanguagesHub } from '@/components/LanguagesHub.jsx';

const accents = {
  blue: { soft: 'bg-brand-blue/8', text: 'text-brand-blue', grad: 'from-brand-blue/25 to-brand-purple/20' },
  pink: { soft: 'bg-brand-pink/8', text: 'text-brand-pink', grad: 'from-brand-pink/25 to-brand-orange/20' },
  green: { soft: 'bg-brand-green/10', text: 'text-forest-700', grad: 'from-brand-green/25 to-brand-blue/20' },
  orange: { soft: 'bg-brand-orange/10', text: 'text-brand-orange', grad: 'from-brand-orange/25 to-brand-pink/20' },
  purple: { soft: 'bg-brand-purple/8', text: 'text-brand-purple', grad: 'from-brand-purple/25 to-brand-pink/20' },
};

// утончённая «премиум» карточка — мягкая рамка и тень + живой ховер (приподнимается)
const PC = 'rounded-[20px] border border-ink/8 bg-white/92 shadow-[0_16px_42px_rgba(16,42,86,0.07)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-color';
const PC_STATIC = 'rounded-[20px] border border-ink/8 bg-white/92 shadow-[0_16px_42px_rgba(16,42,86,0.07)] backdrop-blur-xl';

// градиент для заголовка — эффект как на главной, свой на каждое направление
const h1grad = {
  blue: 'from-brand-blue via-brand-purple to-brand-pink',
  pink: 'from-brand-pink via-brand-purple to-brand-blue',
  green: 'from-forest-700 via-brand-blue to-brand-cyan',
  orange: 'from-brand-orange via-brand-pink to-brand-purple',
  purple: 'from-brand-purple via-brand-pink to-brand-blue',
};

const whyUs = [
  { icon: 'users', t: 'Мини-группы до 6', d: 'Педагог видит каждого и подстраивает темп под ребёнка' },
  { icon: 'screen', t: 'Онлайн из любого города', d: 'Без дороги — занимайтесь из дома в удобное время' },
  { icon: 'confidence', t: 'Честный подход', d: 'Не подойдёт — прямо скажем и предложим другое направление' },
  { icon: 'logic', t: 'Виден прогресс', d: 'Успехи ребёнка отражаются в личном кабинете родителя' },
];

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
  const hg = h1grad[landing.theme] ?? h1grad.blue;
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
        <section className="px-5 pb-12 pt-28 sm:px-8 sm:pt-32 lg:px-14">
          <div className="container-pad px-0">
            <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
              <div>
                <span className={`section-kicker ${a.soft}`}>Онлайн-школа «Разумейка»</span>
                <h1 className={`mt-6 bg-gradient-to-r font-display text-[2.4rem] font-black leading-[1.06] tracking-[-0.01em] text-transparent sm:text-5xl lg:text-[3.7rem] ${hg} bg-clip-text [-webkit-background-clip:text] [text-shadow:0_16px_38px_rgba(59,130,246,0.10)]`}>
                  {landing.h1}
                </h1>
                <div className={`mt-5 h-[6px] w-28 rounded-full bg-gradient-to-r ${hg}`} />
                <p className="mt-6 text-xl font-semibold leading-9 text-ink/72">{landing.intro[0]}</p>
                <div className="mt-5 space-y-3 text-lg font-medium leading-8 text-ink/62">
                  {landing.intro.slice(1).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap gap-4">
                  <a href="/#form" className="primary-btn">Записаться на пробный · 400 ₽</a>
                  <Link href="/" className="secondary-btn">Все направления</Link>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-bold text-ink/56">
                  <span className="text-brand-orange">★★★★★</span>
                  <span>Мини-группы до 6 детей</span>
                  <span>Онлайн из любого города</span>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-lg">
                <div className={`absolute -inset-5 rounded-[32px] bg-gradient-to-br ${a.grad} blur-2xl`} />
                {landing.image ? (
                  <div className="relative overflow-hidden rounded-[26px] border border-white/80 bg-white/60 shadow-color">
                    <img src={landing.image} alt={landing.h1} className="h-[360px] w-full object-cover sm:h-[460px]" />
                    <div className="absolute right-4 top-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 text-3xl shadow-luxe backdrop-blur">
                      {landing.emoji ?? '✨'}
                    </div>
                  </div>
                ) : (
                  <div className={`relative flex aspect-square items-center justify-center rounded-[26px] border border-white/80 bg-gradient-to-br ${a.grad} shadow-color`}>
                    <span className="text-[9rem]">{landing.emoji ?? '✨'}</span>
                  </div>
                )}
                <div className="absolute -bottom-5 -left-4 rounded-[18px] border border-ink/8 bg-white px-5 py-3.5 shadow-color">
                  <p className="font-display text-2xl font-black text-ink">400 ₽</p>
                  <p className="text-xs font-bold text-ink/56">пробный урок</p>
                </div>
              </div>
            </div>

            {/* Статистика */}
            <div className={`mt-16 grid gap-4 ${stats.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'}`}>
              {stats.map((s) => (
                <div key={s.l} className={`${PC} p-5 text-center`}>
                  <p className={`font-display text-3xl font-black sm:text-4xl ${a.text}`}>{s.v}</p>
                  <p className="mt-1.5 text-xs font-bold leading-5 text-ink/56 sm:text-sm">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {landing.slug === 'languages' && <LanguagesHub />}

        {/* Узнали своего ребёнка? */}
        {landing.pains?.length > 0 && (
          <section className="px-5 py-14 sm:px-8 lg:px-14">
            <div className="container-pad px-0">
              <span className={`section-kicker ${a.soft}`}>знакомо?</span>
              <h2 className="section-title mt-6 max-w-3xl">Узнали своего ребёнка?</h2>
              <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {landing.pains.map((p, i) => (
                  <div key={i} className={`flex items-start gap-3.5 ${PC} p-6`}>
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-lg font-black text-brand-red">!</span>
                    <span className="text-base font-semibold leading-6 text-ink/78">{p}</span>
                  </div>
                ))}
              </div>
              <p className="mt-7 max-w-2xl text-lg font-semibold text-ink/64">Это поправимо — и мы работаем именно с этим. Мягко, через игру и без давления.</p>
            </div>
          </section>
        )}

        {/* Что развиваем */}
        <section className="px-5 py-14 sm:px-8 lg:px-14">
          <div className="container-pad px-0">
            <span className={`section-kicker ${a.soft}`}>что развиваем</span>
            <h2 className="section-title mt-6 max-w-3xl">Не оценки, а сами способности</h2>
            <div className="mt-9 grid gap-4 sm:grid-cols-2">
              {landing.bullets.map((b, i) => (
                <div key={i} className={`flex items-start gap-4 ${PC} p-6`}>
                  <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${a.soft} ${a.text}`}>
                    <Icon name="check" className="h-4 w-4" />
                  </span>
                  <span className="text-base font-semibold leading-6 text-ink/80">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Бесплатная польза — попробуйте прямо сейчас */}
        {landing.homeTip && (
          <section className="px-5 py-8 sm:px-8 lg:px-14">
            <div className="container-pad px-0">
              <div className="grid items-center gap-6 rounded-[24px] border border-ink/8 bg-white p-8 shadow-[0_22px_54px_rgba(16,42,86,0.09)] sm:p-10 lg:grid-cols-[auto_1fr] lg:gap-10">
                <div className={`flex h-20 w-20 items-center justify-center rounded-[20px] ${a.soft} text-4xl`}>🎁</div>
                <div>
                  <span className={`section-kicker ${a.soft}`}>бесплатно — попробуйте прямо сейчас</span>
                  <h3 className="section-title mt-4 text-[1.7rem] sm:text-[2.1rem]">{landing.homeTip.title}</h3>
                  <p className="mt-4 text-lg font-medium leading-8 text-ink/70">{landing.homeTip.text}</p>
                  <p className={`mt-4 text-base font-extrabold ${a.text}`}>А на занятиях таких приёмов — десятки, и с педагогом, который ведёт ребёнка к результату.</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Как проходит занятие */}
        {landing.steps?.length > 0 && (
          <section className="px-5 py-14 sm:px-8 lg:px-14">
            <div className="container-pad px-0">
              <span className={`section-kicker ${a.soft}`}>как проходит занятие</span>
              <h2 className="section-title mt-6 max-w-3xl">55 минут пользы без перегруза</h2>
              <div className="mt-9 grid gap-4 lg:grid-cols-2">
                {landing.steps.map((s, i) => (
                  <div key={i} className={`flex gap-5 ${PC} p-7`}>
                    <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${a.soft} font-display text-xl font-black ${a.text}`}>
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-display text-lg font-extrabold text-ink">{s.title}</p>
                      <p className="mt-1.5 text-base font-medium leading-7 text-ink/64">{s.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Что ещё входит — раскрытие-сюрприз */}
        <section className="px-5 py-8 sm:px-8 lg:px-14">
          <div className="container-pad px-0">
            <details className={`group ${PC_STATIC}`}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-7">
                <span className="flex items-center gap-3.5">
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${a.soft} text-2xl`}>🎁</span>
                  <span className="font-display text-lg font-extrabold text-ink sm:text-2xl">Что ещё входит — нажмите, чтобы открыть</span>
                </span>
                <span className={`shrink-0 ${a.text} transition group-open:rotate-45`}>
                  <Icon name="spark" className="h-6 w-6" />
                </span>
              </summary>
              <div className="grid gap-3.5 px-7 pb-7 sm:grid-cols-2">
                {[
                  'Запись каждого занятия — можно пересмотреть',
                  'Личный кабинет с прогрессом ребёнка',
                  'Гибкое расписание — подстроим под вас',
                  'Поддержка родителей между занятиями',
                  'Пропустили урок — компенсируем',
                  'Педагог даёт обратную связь после занятий',
                ].map((x) => (
                  <div key={x} className="flex items-start gap-3">
                    <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${a.soft} ${a.text}`}>
                      <Icon name="check" className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-base font-semibold text-ink/76">{x}</span>
                  </div>
                ))}
              </div>
            </details>
          </div>
        </section>

        {/* Результат через месяц */}
        {landing.results?.length > 0 && (
          <section className="px-5 py-14 sm:px-8 lg:px-14">
            <div className="container-pad px-0">
              <div className="overflow-hidden rounded-[26px] bg-night p-9 text-porcelain shadow-color sm:p-14">
                <span className="section-kicker border-white/15 bg-white/10 text-porcelain/80">результат через 1 месяц</span>
                <h2 className="mt-5 font-display text-2xl font-black text-white sm:text-4xl">Что родители замечают уже через месяц</h2>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {landing.results.map((r, i) => (
                    <div key={i} className="flex items-start gap-3.5 rounded-[16px] border border-white/10 bg-white/[0.05] p-5">
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

        {/* Почему Разумейка */}
        <section className="px-5 py-14 sm:px-8 lg:px-14">
          <div className="container-pad px-0">
            <span className={`section-kicker ${a.soft}`}>почему разумейка</span>
            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {whyUs.map((w) => (
                <div key={w.t} className={`${PC} p-6`}>
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${a.soft} ${a.text}`}>
                    <Icon name={w.icon} className="h-6 w-6" />
                  </span>
                  <p className="mt-4 font-display text-lg font-extrabold leading-tight text-ink">{w.t}</p>
                  <p className="mt-1.5 text-sm font-medium leading-6 text-ink/60">{w.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Отзыв */}
        {landing.testimonial && (
          <section className="px-5 py-10 sm:px-8 lg:px-14">
            <div className="container-pad px-0">
              <div className={`relative mx-auto max-w-3xl overflow-hidden rounded-[24px] border border-ink/8 bg-white p-9 shadow-[0_20px_50px_rgba(16,42,86,0.08)] sm:p-12`}>
                <span className={`font-display text-8xl leading-none ${a.text} opacity-25`}>“</span>
                <p className="-mt-8 text-xl font-semibold leading-9 text-ink/82 sm:text-2xl">{landing.testimonial.text}</p>
                <div className="mt-6 flex items-center gap-3">
                  <span className="text-lg text-brand-orange">★★★★★</span>
                  <span className="text-sm font-extrabold text-ink/56">— {landing.testimonial.author}</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Мини-игра */}
        <DirectionGame slug={landing.slug} />

        {/* Оффер */}
        <section className="px-5 py-14 sm:px-8 lg:px-14">
          <div className="container-pad px-0">
            <div className={`grid items-center gap-10 rounded-[26px] border border-ink/8 ${a.soft} p-9 shadow-color sm:p-14 lg:grid-cols-[1.15fr_0.85fr]`}>
              <div>
                <span className="section-kicker bg-white/70">старт без риска</span>
                <h2 className="section-title mt-5">Начните с пробного урока за 400 ₽</h2>
                <p className="mt-5 text-lg font-medium leading-8 text-ink/70">
                  Это полноценное занятие в мини-группе. Педагог оценит уровень ребёнка, покажет формат и честно скажет,
                  подходит ли направление. Никаких обязательств.
                </p>
                <ul className="mt-6 grid gap-3">
                  {['Пробный урок — 400 ₽', 'Не подойдёт — предложим другое или вернём деньги за пробный', 'Пакет на месяц — от 7900 ₽'].map((t) => (
                    <li key={t} className="flex items-center gap-3 text-base font-semibold text-ink/78">
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white ${a.text} shadow-sm`}>
                        <Icon name="check" className="h-3.5 w-3.5" />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`${PC} p-8 text-center`}>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-ink/44">Пробный урок</p>
                <p className="mt-2 font-display text-6xl font-black text-ink">400₽</p>
                <a href="/#form" className="primary-btn mt-6 w-full">Записаться</a>
                <p className="mt-3.5 text-xs font-semibold text-ink/48">Место бронируем на 30 минут</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-5 py-12 sm:px-8 lg:px-14">
          <div className="container-pad mx-auto max-w-3xl px-0">
            <span className={`section-kicker ${a.soft}`}>частые вопросы</span>
            <div className="mt-8 grid gap-3">
              {landing.faq.map((f, i) => (
                <details key={i} className={`group ${PC} p-6`}>
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
              <span className={`section-kicker ${a.soft}`}>другие направления</span>
              <div className="mt-7 flex flex-wrap gap-3">
                {related.map((d) => (
                  <Link key={d.slug} href={`/${d.slug}`} className={`${PC} px-5 py-3 text-base font-extrabold text-ink transition hover:-translate-y-0.5`}>
                    {d.title}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Финальный CTA */}
        <section className="px-5 py-16 sm:px-8 lg:px-14">
          <div className="container-pad px-0">
            <div className="overflow-hidden rounded-[26px] bg-night p-10 text-center text-porcelain shadow-color sm:p-16">
              <h2 className="font-display text-3xl font-black text-white sm:text-5xl">Попробуйте — это ни к чему не обязывает</h2>
              <p className="mx-auto mt-4 max-w-xl text-lg font-medium text-porcelain/80">На пробном уроке за 400 ₽ педагог познакомится с ребёнком, покажет формат и ответит на все вопросы.</p>
              <a href="/#form" className="mt-8 inline-flex rounded-full bg-gold-300 px-9 py-4 text-base font-extrabold text-night transition hover:-translate-y-0.5 hover:bg-white">Записаться на пробный урок</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
