import Link from 'next/link';
import { Header } from '@/components/Header.jsx';
import { Footer } from '@/components/Footer.jsx';
import { blogPosts } from '@/data/blog.js';

export const metadata = {
  title: 'Блог о развитии детей',
  description:
    'Статьи о развитии детей 4–12 лет: ментальная арифметика, чтение, подготовка к школе и советы родителям от онлайн-школы «Разумейка».',
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Разумейка',
    url: 'https://razumeyka-school.ru/blog',
    title: 'Блог о развитии детей — Разумейка',
    description: 'Понятные статьи для родителей: развитие, чтение, счёт и подготовка к школе.',
  },
};

function fmtDate(iso) {
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));
}

export default function BlogIndex() {
  const posts = [...blogPosts].sort((a, b) => (a.date < b.date ? 1 : -1));
  return (
    <>
      <Header />
      <main className="mesh-bg min-h-screen">
        <section className="px-5 pb-14 pt-28 sm:px-8 sm:pt-32 lg:px-14">
          <div className="container-pad px-0">
            <h1 className="display-title text-[2.4rem] leading-[1.02] sm:text-5xl lg:text-[4rem]">Блог о развитии детей</h1>
            <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-ink/68">
              Понятные статьи для родителей: как развивать ребёнка, готовить к школе и выбирать занятия.
            </p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {posts.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group rounded-[24px] border border-white/80 bg-white/85 p-6 shadow-card backdrop-blur-xl transition hover:-translate-y-1"
                >
                  <p className="text-xs font-bold text-ink/44">{fmtDate(p.date)}</p>
                  <h2 className="mt-2 font-display text-xl font-extrabold leading-tight text-ink transition group-hover:text-brand-blue">
                    {p.title}
                  </h2>
                  <p className="mt-3 text-base font-medium leading-7 text-ink/64">{p.excerpt}</p>
                  <span className="mt-4 inline-flex text-sm font-extrabold text-brand-blue">Читать →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
