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
    if (b.items) n += b.items.join(' ').split(/\s+/).length;
    if (b.steps) n += b.steps.map((s) => `${s.title} ${s.text}`).join(' ').split(/\s+/).length;
    return n;
  }, 0);
  return Math.max(1, Math.round(words / 170));
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = (post.relatedSlugs ?? [])
    .map((s) => {
      const d = getDirectionBySlug(s);
      if (d) return { slug: d.slug, title: d.title };
      const l = getLandingBySlug(s);
      if (l) return { slug: l.slug, title: l.h1 };
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
          <div className="container-pad mx-auto max-w-3xl px-0">
            <nav className="flex items-center gap-2 text-sm font-bold text-ink/44">
              <Link href="/" className="transition hover:text-ink">Главная</Link>
              <span>/</span>
              <Link href="/blog" className="transition hover:text-ink">Блог</Link>
            </nav>
            {post.cover?.image ? (
              <img src={post.cover.image} alt={post.title} className="mt-6 h-52 w-full rounded-[28px] object-cover shadow-color sm:h-72" />
            ) : (
              <div className={`mt-6 flex h-44 items-center justify-center rounded-[28px] bg-gradient-to-br ${coverGrad} shadow-color sm:h-56`}>
                <span className="text-7xl drop-shadow-lg sm:text-8xl">{post.cover?.emoji ?? '📚'}</span>
              </div>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <span className="rounded-full bg-brand-blue px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-[0.14em] text-white">Развитие детей</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/12 bg-white/70 px-3.5 py-1.5 text-xs font-extrabold text-ink/62">
                <Icon name="calendar" className="h-3.5 w-3.5" /> {minutes} мин чтения
              </span>
              <span className="text-xs font-bold text-ink/44">{fmtDate(post.date)}</span>
            </div>
            <h1 className="display-title mt-5 text-[2.2rem] leading-[1.06] sm:text-[3.1rem]">{post.title}</h1>
            {lead && <p className="mt-6 text-xl font-semibold leading-9 text-ink/72 sm:text-[1.35rem]">{lead.text}</p>}
          </div>
          <div className="pointer-events-none absolute -right-16 top-24 h-64 w-64 rounded-full bg-brand-pink/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 top-52 h-56 w-56 rounded-full bg-brand-blue/20 blur-3xl" />
        </header>

        <article className="px-5 pb-16 pt-10 sm:px-8 lg:px-14">
          <div className="container-pad mx-auto max-w-3xl px-0">
            {/* Оглавление */}
            {toc.length >= 3 && (
              <nav className="mb-10 rounded-[22px] border border-white/80 bg-white/85 p-6 shadow-card backdrop-blur-xl">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-ink/44">В статье</p>
                <ol className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {toc.map((t, i) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`} className="flex items-start gap-2.5 text-sm font-bold text-ink/70 transition hover:text-brand-blue">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-blue/12 text-[11px] font-black text-brand-blue">{i + 1}</span>
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

                return <p key={i} className="text-lg font-medium leading-8 text-ink/74">{b.text}</p>;
              })}
            </div>

            {/* FAQ */}
            {post.faq?.length > 0 && (
              <section className="mt-14">
                <h2 className="font-display text-[1.6rem] font-extrabold text-ink sm:text-[1.9rem]">Частые вопросы</h2>
                <div className="mt-5 grid gap-3">
                  {post.faq.map((f, i) => (
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
              </section>
            )}

            {/* По теме */}
            {related.length > 0 && (
              <section className="mt-14">
                <h2 className="font-display text-[1.6rem] font-extrabold text-ink sm:text-[1.9rem]">По теме</h2>
                <div className="mt-5 flex flex-wrap gap-3">
                  {related.map((r) => (
                    <Link key={r.slug} href={`/${r.slug}`} className="rounded-full border border-ink/12 bg-white/80 px-5 py-3 text-base font-extrabold text-ink transition hover:-translate-y-0.5 hover:bg-white">
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
                      className="group flex items-center justify-between gap-4 rounded-[18px] border border-white/80 bg-white/85 p-5 shadow-card backdrop-blur-xl transition hover:-translate-y-0.5"
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
            <div className="mt-14 overflow-hidden rounded-[28px] bg-gradient-to-br from-brand-blue to-brand-purple p-8 text-center text-white shadow-color sm:p-12">
              <h2 className="font-display text-2xl font-extrabold sm:text-3xl">Попробуйте — пробный урок 400 ₽</h2>
              <p className="mx-auto mt-3 max-w-md text-base font-medium text-white/85">Педагог оценит уровень ребёнка, ответит на вопросы и покажет формат. Без обязательств.</p>
              <a href="/#form" className="mt-7 inline-flex rounded-full bg-white px-8 py-3.5 text-base font-extrabold text-brand-blue transition hover:-translate-y-0.5">Записаться</a>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
