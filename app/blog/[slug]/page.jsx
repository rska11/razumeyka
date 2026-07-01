import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header.jsx';
import { Footer } from '@/components/Footer.jsx';
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
    },
  };
}

function fmtDate(iso) {
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));
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
        mainEntity: post.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <Header />
      <main className="mesh-bg min-h-screen">
        <article className="px-5 pb-14 pt-28 sm:px-8 sm:pt-32 lg:px-14">
          <div className="container-pad mx-auto max-w-3xl px-0">
            <nav className="text-sm font-bold text-ink/44">
              <Link href="/" className="hover:text-ink">Главная</Link> <span className="mx-1">/</span>{' '}
              <Link href="/blog" className="hover:text-ink">Блог</Link>
            </nav>
            <h1 className="display-title mt-5 text-[2.1rem] leading-[1.08] sm:text-[3rem]">{post.title}</h1>
            <p className="mt-3 text-sm font-bold text-ink/44">{fmtDate(post.date)}</p>

            <div className="mt-8 space-y-5">
              {post.body.map((b, i) => {
                if (b.type === 'h2') {
                  return <h2 key={i} className="section-title text-[1.5rem] sm:text-[1.8rem]">{b.text}</h2>;
                }
                if (b.type === 'list') {
                  return (
                    <ul key={i} className="grid gap-2.5">
                      {b.items.map((it, j) => (
                        <li key={j} className="flex items-start gap-3 text-lg font-medium leading-8 text-ink/72">
                          <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-brand-blue" />
                          {it}
                        </li>
                      ))}
                    </ul>
                  );
                }
                return <p key={i} className="text-lg font-medium leading-8 text-ink/72">{b.text}</p>;
              })}
            </div>

            {post.faq?.length > 0 && (
              <section className="mt-12">
                <h2 className="section-title text-[1.5rem] sm:text-[1.8rem]">Частые вопросы</h2>
                <div className="mt-5 grid gap-3">
                  {post.faq.map((f, i) => (
                    <details key={i} className="rounded-[18px] border border-white/80 bg-white/80 p-5 shadow-card backdrop-blur-xl">
                      <summary className="cursor-pointer list-none text-lg font-extrabold text-ink">{f.q}</summary>
                      <p className="mt-3 text-base font-medium leading-7 text-ink/68">{f.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {related.length > 0 && (
              <section className="mt-12">
                <h2 className="section-title text-[1.5rem] sm:text-[1.8rem]">По теме</h2>
                <div className="mt-5 flex flex-wrap gap-3">
                  {related.map((r) => (
                    <Link key={r.slug} href={`/${r.slug}`} className="rounded-full border border-ink/12 bg-white/80 px-5 py-3 text-base font-extrabold text-ink transition hover:bg-white">
                      {r.title}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <div className="mt-12 rounded-[24px] bg-gradient-to-br from-brand-blue to-brand-purple p-8 text-center text-white shadow-color">
              <h2 className="font-display text-2xl font-extrabold sm:text-3xl">Попробуйте — пробный урок 400 ₽</h2>
              <p className="mx-auto mt-2 max-w-md text-base font-medium text-white/85">Педагог оценит уровень ребёнка и покажет формат.</p>
              <a href="/#form" className="mt-6 inline-flex rounded-full bg-white px-7 py-3.5 text-base font-extrabold text-brand-blue transition hover:-translate-y-0.5">Записаться</a>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
