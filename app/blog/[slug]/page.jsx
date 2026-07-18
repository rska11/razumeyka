import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header.jsx';
import { Footer } from '@/components/Footer.jsx';
import { Icon } from '@/components/Icon.jsx';
import { getDirectionBySlug } from '@/data/directions.js';
import { getLandingBySlug } from '@/data/landings.js';
import { blogPosts, getPostBySlug } from '@/data/blog.js';

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Статья не найдена' };
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: 'article',
      locale: 'ru_RU',
      siteName: 'Разумейка',
      url: `https://razumeyka-school.ru/blog/${slug}`,
      title: `${post.title} — Разумейка`,
      description: post.description,
      images: [
        post.cover?.image
          ? { url: post.cover.image, alt: post.title }
          : { url: '/images/og.png', width: 1200, height: 630, alt: post.title },
      ],
    },
  };
}

function fmtDate(iso) {
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));
}

function readingMinutes(body) {
  const words = body.reduce((n, b) => {
    if (b.text) n += b.text.split(/\s+/).length;
    if (b.items) n += b.items.map((x) => (typeof x === 'string' ? x : Object.values(x).join(' '))).join(' ').split(/\s+/).length;
    if (b.steps) n += b.steps.map((s) => `${s.title} ${s.text}`).join(' ').split(/\s+/).length;
    return n;
  }, 0);
  return Math.max(1, Math.round(words / 170));
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const cta = post.cta ?? {
    title: 'Выберите курс для ребёнка',
    text: 'Три самостоятельных направления уже открыты. Первые уроки можно попробовать бесплатно.',
    href: '/#programs',
    label: 'Посмотреть направления',
    tone: 'blue',
  };
  const ctaThemes = {
    blue: 'from-brand-blue to-brand-purple',
    green: 'from-[#079A78] to-[#3B82F6]',
    pink: 'from-brand-purple to-brand-pink',
    orange: 'from-brand-orange to-brand-pink',
  };

  const related = (post.relatedSlugs ?? [])
    .map((s) => {
      const d = getDirectionBySlug(s);
      if (d) return { slug: d.slug, title: d.title, href: d.href ?? `/${d.slug}` };
      const l = getLandingBySlug(s);
      if (l) return { slug: l.slug, title: l.h1, href: `/${l.slug}` };
      return null;
    })
    .filter(Boolean);

  const minutes = readingMinutes(post.body);

  // перелинковка статей между собой — свежие, кроме текущей
  const morePosts = [...blogPosts]
    .filter((p) => p.slug !== slug)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 3);

  // Оглавление из заголовков H2
  const toc = post.body
    .map((b, i) => ({ ...b, _id: `s${i}` }))
    .filter((b) => b.type === 'h2')
    .map((b) => ({ id: b._id, text: b.text }));

  // Первый абзац — как «лид»
  const leadIndex = post.body.findIndex((b) => b.type === 'p');
  const lead = leadIndex >= 0 ? post.body[leadIndex] : null;

  const coverThemes = {
    blue: 'from-brand-blue to-brand-purple',
    pink: 'from-brand-pink to-brand-orange',
    green: 'from-brand-green to-brand-blue',
    orange: 'from-brand-orange to-brand-pink',
  };
  const coverGrad = coverThemes[post.cover?.theme] ?? coverThemes.blue;
  const editorialMeta = {
    'kak-podgotovit-rebenka-k-shkole-doma': { category: 'Подготовка к школе', gradient: 'from-[#246BFD] via-[#7257E8] to-[#F05A87]' },
    'razvitie-vnimaniya-u-detey': { category: 'Внимание', gradient: 'from-[#246BFD] via-[#7257E8] to-[#A855F7]' },
    'netraditsionnye-tehniki-risovaniya': { category: 'Творчество', gradient: 'from-[#7257E8] via-[#D946EF] to-[#F05A87]' },
    'uprazhneniya-akterskoe-masterstvo': { category: 'Речь и уверенность', gradient: 'from-[#8B5CF6] via-[#EC4899] to-[#F97316]' },
    'uprazhneniya-dlya-skorochteniya': { category: 'Чтение', gradient: 'from-[#079A78] via-[#16A6A1] to-[#3B82F6]' },
    'podgotovka-k-shkole-chto-dolzhen-umet': { category: 'Подготовка к школе', gradient: 'from-[#246BFD] via-[#7257E8] to-[#F05A87]' },
    'kak-nauchit-rebenka-chitat': { category: 'Чтение', gradient: 'from-[#F59E0B] via-[#F97316] to-[#EC4899]' },
    'chto-takoe-mentalnaya-arifmetika': { category: 'Ментальная арифметика', gradient: 'from-[#079A78] via-[#16A6A1] to-[#3B82F6]' },
    'razvitie-rebenka-s-chego-nachat': { category: 'Развитие', gradient: 'from-[#F97316] via-[#EC4899] to-[#8B5CF6]' },
  }[slug] ?? { category: 'Развитие', gradient: coverGrad };
  const relatedGradients = {
    'mental-arithmetic': 'from-[#079A78] via-[#16A6A1] to-[#3B82F6]',
    'right-brain-drawing': 'from-[#7257E8] via-[#D946EF] to-[#F05A87]',
    'podgotovka-k-shkole': 'from-[#246BFD] via-[#7257E8] to-[#F05A87]',
  };

  const calloutStyles = {
    secret: { wrap: 'border-brand-blue/25 bg-brand-blue/8', badge: 'bg-brand-blue text-white', icon: 'spark', label: 'Главное' },
    tip: { wrap: 'border-brand-green/25 bg-brand-green/8', badge: 'bg-brand-green text-white', icon: 'check', label: 'Совет' },
    warning: { wrap: 'border-brand-orange/30 bg-brand-orange/10', badge: 'bg-brand-orange text-white', icon: 'focus', label: 'Важно' },
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: 'Разумейка' },
    publisher: { '@type': 'Organization', name: 'Разумейка' },
    mainEntityOfPage: `https://razumeyka-school.ru/blog/${slug}`,
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://razumeyka-school.ru' },
      { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://razumeyka-school.ru/blog' },
      { '@type': 'ListItem', position: 3, name: post.title },
    ],
  };
  const faqSchema = post.faq?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      }
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <Header />
      <main className="mesh-bg min-h-screen">
        {/* Обложка */}
        <header className="relative overflow-hidden px-5 pt-28 sm:px-8 sm:pt-32 lg:px-14">
          <div className="container-pad mx-auto max-w-6xl px-0">
            <nav className="flex items-center gap-2 text-sm font-bold text-ink/44">
              <Link href="/" className="transition hover:text-brand-blue">Главная</Link>
              <span>/</span>
              <Link href="/blog" className="transition hover:text-brand-blue">Блог</Link>
            </nav>

            <div className="relative isolate mt-6 overflow-hidden rounded-[38px] bg-[#0A1933] text-white shadow-luxe">
              <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-brand-blue/38 blur-[90px]" />
              <div className="pointer-events-none absolute bottom-[-7rem] left-1/3 h-64 w-80 rounded-full bg-brand-pink/24 blur-[90px]" />
              <div className="relative grid lg:grid-cols-[1.08fr_.92fr] lg:items-stretch">
                <div className="flex flex-col p-6 sm:p-10 lg:p-12">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className={'rounded-full bg-gradient-to-r ' + editorialMeta.gradient + ' px-3.5 py-2 text-[10px] font-extrabold uppercase tracking-[0.15em] text-white shadow-color'}>
                      {editorialMeta.category}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/14 bg-white/9 px-3.5 py-2 text-xs font-extrabold text-white/70 backdrop-blur-xl">
                      <Icon name="calendar" className="h-3.5 w-3.5" /> {minutes} мин чтения
                    </span>
                    <span className="text-xs font-bold text-white/42">{fmtDate(post.date)}</span>
                  </div>
                  <h1 className="mt-7 font-display text-[2.25rem] font-extrabold leading-[1.02] tracking-[-0.045em] text-white sm:text-[3.3rem] lg:text-[3.7rem]">{post.title}</h1>
                  {lead && <p className="mt-6 text-lg font-semibold leading-8 text-white/70 sm:text-xl sm:leading-9">{lead.text}</p>}
                  <div className="mt-auto flex items-center gap-3 pt-8 text-xs font-bold text-white/42">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-lg">Р</span>
                    <span>Редакция «Разумейки»</span>
                  </div>
                </div>

                <div className={'group relative min-h-[300px] overflow-hidden bg-gradient-to-br ' + editorialMeta.gradient + ' sm:min-h-[390px] lg:min-h-full'}>
                  {post.cover?.image ? (
                    <img src={post.cover.image} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                  ) : (
                    <span className="absolute inset-0 grid place-items-center text-8xl">{post.cover?.emoji ?? '📚'}</span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07152f]/55 via-transparent to-white/5" />
                  <div className="absolute bottom-5 left-5 right-5 rounded-[20px] border border-white/20 bg-[#07152f]/36 px-4 py-3 text-xs font-semibold leading-5 text-white/78 backdrop-blur-xl">
                    Практический материал для спокойных занятий дома
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute -right-20 top-24 h-72 w-72 rounded-full bg-brand-pink/18 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 top-64 h-64 w-64 rounded-full bg-brand-blue/18 blur-3xl" />
        </header>

        <article className="px-5 pb-20 pt-10 sm:px-8 lg:px-14 lg:pb-28">
          <div className="container-pad mx-auto max-w-[880px] px-0">
            {/* Оглавление */}
            {toc.length >= 3 && (
              <nav className="mb-12 rounded-[26px] border border-brand-blue/14 bg-gradient-to-br from-brand-blue/[0.1] via-white/90 to-brand-pink/[0.12] p-6 shadow-color backdrop-blur-xl sm:p-7">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-ink/44">В статье</p>
                <ol className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {toc.map((t, i) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`} className="flex items-start gap-2.5 text-sm font-bold text-ink/70 transition hover:text-brand-blue">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-purple text-[11px] font-black text-white shadow-sm">{i + 1}</span>
                        {t.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            {/* Тело */}
            <div className="space-y-6">
              {post.body.map((b, i) => {
                if (i === leadIndex) return null; // лид уже показан в обложке

                if (b.type === 'h2') {
                  return (
                    <h2 key={i} id={`s${i}`} className="scroll-mt-28 pt-4 font-display text-[1.6rem] font-extrabold leading-tight text-ink sm:text-[1.9rem]">
                      <span className="mr-3 inline-block h-6 w-1.5 translate-y-0.5 rounded-full bg-gradient-to-b from-brand-blue to-brand-purple align-middle" />
                      {b.text}
                    </h2>
                  );
                }

                if (b.type === 'callout') {
                  const st = calloutStyles[b.variant] ?? calloutStyles.secret;
                  return (
                    <div key={i} className={`rounded-[22px] border ${st.wrap} p-6 sm:p-7`}>
                      <div className="flex items-center gap-2.5">
                        <span className={`flex h-8 w-8 items-center justify-center rounded-full ${st.badge}`}>
                          <Icon name={st.icon} className="h-4 w-4" />
                        </span>
                        <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-ink/60">{b.title ?? st.label}</span>
                      </div>
                      <p className="mt-3 text-lg font-bold leading-8 text-ink/82">{b.text}</p>
                    </div>
                  );
                }

                if (b.type === 'steps') {
                  return (
                    <ol key={i} className="grid gap-3">
                      {b.steps.map((s, j) => (
                        <li key={j} className="flex gap-4 rounded-[20px] border border-white/80 bg-white/85 p-5 shadow-card backdrop-blur-xl">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-purple text-lg font-black text-white">{j + 1}</span>
                          <div>
                            <p className="font-display text-lg font-extrabold text-ink">{s.title}</p>
                            <p className="mt-1 text-base font-medium leading-7 text-ink/68">{s.text}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  );
                }

                // инфографика: карточки «понятие + объяснение» (2 колонки)
                if (b.type === 'cards') {
                  return (
                    <div key={i} className="grid gap-3 sm:grid-cols-2">
                      {b.items.map((c, j) => (
                        <div key={j} className="rounded-[20px] border border-white/80 bg-white/85 p-5 shadow-card backdrop-blur-xl">
                          <div className="flex items-center gap-3">
                            {c.emoji && (
                              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-blue/10 text-xl">{c.emoji}</span>
                            )}
                            <p className="font-display text-lg font-extrabold leading-tight text-ink">{c.t}</p>
                          </div>
                          <p className="mt-2.5 text-[15px] font-medium leading-7 text-ink/68">{c.d}</p>
                        </div>
                      ))}
                    </div>
                  );
                }

                // инфографика: горизонтальные бары (нормы, сравнения)
                if (b.type === 'bars') {
                  const max = Math.max(...b.items.map((x) => x.value));
                  return (
                    <div key={i} className="rounded-[22px] border border-white/80 bg-white/85 p-6 shadow-card backdrop-blur-xl sm:p-7">
                      {b.title && <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-ink/44">{b.title}</p>}
                      <div className="mt-4 grid gap-4">
                        {b.items.map((it, j) => (
                          <div key={j}>
                            <div className="flex items-baseline justify-between gap-3">
                              <span className="text-sm font-extrabold text-ink">{it.label}</span>
                              <span className="shrink-0 text-sm font-extrabold text-brand-blue">{it.note}</span>
                            </div>
                            <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-ink/6">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-purple"
                                style={{ width: `${Math.round((it.value / max) * 100)}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      {b.footnote && <p className="mt-4 text-xs font-medium leading-5 text-ink/48">{b.footnote}</p>}
                    </div>
                  );
                }

                // инфографика: плитки с большими цифрами
                if (b.type === 'stats') {
                  return (
                    <div key={i} className={`grid grid-cols-2 gap-3 ${b.items.length >= 4 ? 'sm:grid-cols-4' : 'sm:grid-cols-3'}`}>
                      {b.items.map((s, j) => (
                        <div key={j} className="rounded-[18px] border border-white/80 bg-white/85 p-4 text-center shadow-card backdrop-blur-xl">
                          <p className="font-display text-2xl font-black text-brand-blue sm:text-[1.7rem]">{s.v}</p>
                          <p className="mt-1 text-xs font-bold leading-4 text-ink/56">{s.l}</p>
                        </div>
                      ))}
                    </div>
                  );
                }

                if (b.type === 'list') {
                  return (
                    <ul key={i} className="grid gap-2.5 sm:grid-cols-2">
                      {b.items.map((it, j) => (
                        <li key={j} className="flex items-start gap-3 rounded-[16px] border border-white/70 bg-white/75 p-4 shadow-[0_10px_30px_rgba(16,42,86,0.05)] backdrop-blur-xl">
                          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-green/14 text-brand-green">
                            <Icon name="check" className="h-3.5 w-3.5" />
                          </span>
                          <span className="text-[15px] font-semibold leading-6 text-ink/76">{it}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }

                return <p key={i} className="text-[1.08rem] font-medium leading-[1.9] text-ink/72 sm:text-lg">{b.text}</p>;
              })}
            </div>

            {/* FAQ */}
            {post.faq?.length > 0 && (
              <section className="mt-14">
                <h2 className="font-display text-[1.6rem] font-extrabold text-ink sm:text-[1.9rem]">Частые вопросы</h2>
                <div className="mt-5 grid gap-3">
                  {post.faq.map((f, i) => (
                    <details key={i} className="group rounded-[22px] border border-white/85 bg-gradient-to-br from-white via-white/90 to-brand-blue/[0.045] p-5 shadow-card backdrop-blur-xl transition open:shadow-color">
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
              </section>
            )}

            {/* По теме */}
            {related.length > 0 && (
              <section className="mt-14">
                <h2 className="font-display text-[1.6rem] font-extrabold text-ink sm:text-[1.9rem]">По теме</h2>
                <div className="mt-5 flex flex-wrap gap-3">
                  {related.map((r) => (
                    <Link key={r.slug} href={r.href} className={'inline-flex min-h-[54px] items-center rounded-[18px] bg-gradient-to-r ' + (relatedGradients[r.slug] ?? 'from-brand-blue to-brand-purple') + ' px-5 py-3 text-base font-extrabold text-white shadow-color transition hover:-translate-y-1 hover:shadow-luxe'}>
                      {r.title}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Ещё из блога */}
            {morePosts.length > 0 && (
              <section className="mt-14">
                <h2 className="font-display text-[1.6rem] font-extrabold text-ink sm:text-[1.9rem]">Ещё из блога</h2>
                <div className="mt-5 grid gap-3">
                  {morePosts.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/blog/${p.slug}`}
                      className="group flex items-center justify-between gap-4 rounded-[22px] border border-white/85 bg-white/88 p-5 shadow-card backdrop-blur-xl transition hover:-translate-y-1 hover:border-brand-purple/18 hover:shadow-color"
                    >
                      <div>
                        <p className="font-display text-lg font-extrabold leading-tight text-ink transition group-hover:text-brand-blue">{p.title}</p>
                        <p className="mt-1 text-sm font-medium text-ink/56">{p.excerpt}</p>
                      </div>
                      <span className="shrink-0 text-brand-blue">
                        <Icon name="arrow" className="h-5 w-5" />
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* CTA */}
            <div className={'mt-14 overflow-hidden rounded-[28px] bg-gradient-to-br ' + (ctaThemes[cta.tone] ?? ctaThemes.blue) + ' p-8 text-center text-white shadow-color sm:p-12'}>
              <h2 className="font-display text-2xl font-extrabold sm:text-3xl">{cta.title}</h2>
              <p className="mx-auto mt-3 max-w-lg text-base font-medium text-white/85">{cta.text}</p>
              <Link href={cta.href} className="mt-7 inline-flex rounded-full bg-white px-8 py-3.5 text-base font-extrabold text-brand-blue transition hover:-translate-y-0.5">{cta.label}</Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
