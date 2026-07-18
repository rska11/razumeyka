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
    images: [{ url: '/images/og.png', width: 1200, height: 630, alt: 'Разумейка — онлайн-школа развития детей' }],
  },
};

function fmtDate(iso) {
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));
}

function readingMinutes(body) {
  const words = body.reduce((count, block) => {
    if (block.text) count += block.text.split(/\s+/).length;
    if (block.items) count += block.items.map((item) => (typeof item === 'string' ? item : Object.values(item).join(' '))).join(' ').split(/\s+/).length;
    return count;
  }, 0);
  return Math.max(1, Math.round(words / 170));
}

const postMeta = {
  'kak-podgotovit-rebenka-k-shkole-doma': { category: 'Подготовка к школе', gradient: 'from-[#246BFD] via-[#7257E8] to-[#F05A87]' },
  'razvitie-vnimaniya-u-detey': { category: 'Внимание', gradient: 'from-[#246BFD] via-[#7257E8] to-[#A855F7]' },
  'netraditsionnye-tehniki-risovaniya': { category: 'Творчество', gradient: 'from-[#7257E8] via-[#D946EF] to-[#F05A87]' },
  'uprazhneniya-akterskoe-masterstvo': { category: 'Речь и уверенность', gradient: 'from-[#8B5CF6] via-[#EC4899] to-[#F97316]' },
  'uprazhneniya-dlya-skorochteniya': { category: 'Чтение', gradient: 'from-[#079A78] via-[#16A6A1] to-[#3B82F6]' },
  'podgotovka-k-shkole-chto-dolzhen-umet': { category: 'Подготовка к школе', gradient: 'from-[#246BFD] via-[#7257E8] to-[#F05A87]' },
  'kak-nauchit-rebenka-chitat': { category: 'Чтение', gradient: 'from-[#F59E0B] via-[#F97316] to-[#EC4899]' },
  'chto-takoe-mentalnaya-arifmetika': { category: 'Ментальная арифметика', gradient: 'from-[#079A78] via-[#16A6A1] to-[#3B82F6]' },
  'razvitie-rebenka-s-chego-nachat': { category: 'Развитие', gradient: 'from-[#F97316] via-[#EC4899] to-[#8B5CF6]' },
};

function metaFor(post) {
  return postMeta[post.slug] ?? { category: 'Развитие', gradient: 'from-brand-blue via-brand-purple to-brand-pink' };
}

function Cover({ post, className = '' }) {
  const meta = metaFor(post);
  return (
    <div className={'relative isolate overflow-hidden bg-gradient-to-br ' + meta.gradient + ' ' + className}>
      {post.cover?.image ? (
        <img src={post.cover.image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
      ) : (
        <span className="absolute inset-0 grid place-items-center text-7xl">{post.cover?.emoji ?? '📚'}</span>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#07152f]/72 via-[#07152f]/8 to-transparent" />
      <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/24 blur-3xl" />
      <span className="absolute left-5 top-5 rounded-full border border-white/25 bg-white/16 px-3.5 py-2 text-[10px] font-extrabold uppercase tracking-[0.15em] text-white backdrop-blur-xl">
        {meta.category}
      </span>
    </div>
  );
}

export default function BlogIndex() {
  const posts = [...blogPosts].sort((a, b) => (a.date < b.date ? 1 : -1));
  const featured = posts[0];
  const morePosts = posts.slice(1);

  return (
    <>
      <Header />
      <main className="mesh-bg min-h-screen overflow-hidden">
        <section className="px-5 pb-10 pt-28 sm:px-8 sm:pt-32 lg:px-14">
          <div className="container-pad px-0">
            <div className="relative isolate overflow-hidden rounded-[38px] bg-[#0A1933] px-6 py-10 text-white shadow-luxe sm:px-10 sm:py-14 lg:px-14">
              <div className="pointer-events-none absolute -left-24 -top-28 h-80 w-80 rounded-full bg-brand-blue/40 blur-[90px]" />
              <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-brand-pink/34 blur-[90px]" />
              <div className="pointer-events-none absolute bottom-[-8rem] left-1/3 h-72 w-96 rounded-full bg-brand-green/22 blur-[100px]" />
              <div className="relative grid gap-9 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
                <div>
                  <span className="inline-flex rounded-full border border-white/18 bg-white/10 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand-cyan backdrop-blur-xl">
                    Журнал для родителей
                  </span>
                  <h1 className="mt-6 max-w-4xl font-display text-[2.65rem] font-extrabold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-[4.8rem]">
                    Развитие без гонки.<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-white to-brand-pink">Понятно и по делу.</span>
                  </h1>
                  <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-white/68 sm:text-lg">
                    Практические разборы о внимании, чтении, творчестве и подготовке к школе — без запугивания родителей и невыполнимых обещаний.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="rounded-[22px] border border-white/14 bg-white/9 p-4 backdrop-blur-xl">
                    <strong className="font-display text-3xl font-extrabold">{posts.length}</strong>
                    <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.13em] text-white/48">материалов</span>
                  </div>
                  <div className="rounded-[22px] border border-white/14 bg-white/9 p-4 backdrop-blur-xl">
                    <strong className="font-display text-3xl font-extrabold">4–12</strong>
                    <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.13em] text-white/48">лет</span>
                  </div>
                  <div className="rounded-[22px] border border-white/14 bg-white/9 p-4 backdrop-blur-xl">
                    <strong className="font-display text-3xl font-extrabold">0 ₽</strong>
                    <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.13em] text-white/48">полезно</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {featured && (
          <section className="px-5 py-8 sm:px-8 lg:px-14">
            <div className="container-pad px-0">
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-blue">Выбор редакции</p>
                  <h2 className="mt-1 font-display text-3xl font-extrabold tracking-[-0.04em] text-ink sm:text-4xl">Начните отсюда</h2>
                </div>
                <Link href="/#programs" className="hidden text-sm font-extrabold text-brand-purple transition hover:text-brand-pink sm:inline-flex">Перейти к курсам →</Link>
              </div>

              <Link href={'/blog/' + featured.slug} className="group grid overflow-hidden rounded-[34px] border border-white/80 bg-white/88 shadow-[0_30px_80px_rgba(16,42,86,0.12)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-luxe lg:grid-cols-[1.08fr_.92fr]">
                <Cover post={featured} className="min-h-[300px] sm:min-h-[390px]" />
                <div className="flex flex-col p-6 sm:p-9 lg:p-11">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-ink/44">
                    <span>{fmtDate(featured.date)}</span>
                    <span className="h-1 w-1 rounded-full bg-ink/20" />
                    <span>{readingMinutes(featured.body)} мин чтения</span>
                  </div>
                  <h2 className="mt-5 font-display text-3xl font-extrabold leading-[1.08] tracking-[-0.04em] text-ink transition group-hover:text-brand-blue sm:text-4xl">
                    {featured.title}
                  </h2>
                  <p className="mt-5 text-base font-medium leading-8 text-ink/62 sm:text-lg">{featured.excerpt}</p>
                  <span className={'mt-auto inline-flex self-start rounded-full bg-gradient-to-r ' + metaFor(featured).gradient + ' px-6 py-3.5 text-sm font-extrabold text-white shadow-color transition group-hover:translate-x-1'}>
                    Читать статью <span className="ml-2">→</span>
                  </span>
                </div>
              </Link>
            </div>
          </section>
        )}

        <section className="px-5 pb-20 pt-12 sm:px-8 lg:px-14 lg:pb-28">
          <div className="container-pad px-0">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-pink">Библиотека Разумейки</p>
              <h2 className="mt-1 font-display text-3xl font-extrabold tracking-[-0.04em] text-ink sm:text-4xl">Все материалы</h2>
              <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-ink/56">Выберите тему, которая сейчас важна вашему ребёнку.</p>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {morePosts.map((post) => {
                const meta = metaFor(post);
                return (
                  <Link
                    key={post.slug}
                    href={'/blog/' + post.slug}
                    className="group flex min-h-full flex-col overflow-hidden rounded-[28px] border border-white/85 bg-white/86 shadow-card backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:shadow-luxe"
                  >
                    <Cover post={post} className="h-48" />
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-center justify-between gap-3 text-[11px] font-bold text-ink/42">
                        <span>{fmtDate(post.date)}</span>
                        <span>{readingMinutes(post.body)} мин</span>
                      </div>
                      <h3 className="mt-4 font-display text-[1.35rem] font-extrabold leading-[1.18] tracking-[-0.025em] text-ink transition group-hover:text-brand-purple">
                        {post.title}
                      </h3>
                      <p className="mt-3 text-sm font-medium leading-6 text-ink/58">{post.excerpt}</p>
                      <span className={'mt-6 inline-flex items-center self-start border-b-2 pb-1 text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r ' + meta.gradient}>
                        Читать материал →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="relative mt-12 overflow-hidden rounded-[32px] bg-gradient-to-r from-[#246BFD] via-[#7257E8] to-[#EC4899] p-7 text-white shadow-color sm:p-10">
              <div className="pointer-events-none absolute -right-10 -top-20 h-56 w-56 rounded-full bg-white/22 blur-3xl" />
              <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/62">От чтения — к практике</p>
                  <h2 className="mt-2 font-display text-2xl font-extrabold sm:text-3xl">Три курса уже можно попробовать бесплатно</h2>
                  <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-white/74">Рисование, ментальная арифметика и подготовка к школе — самостоятельные уроки без расписания.</p>
                </div>
                <Link href="/#programs" className="inline-flex min-h-[54px] shrink-0 items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-extrabold text-brand-purple shadow-card transition hover:-translate-y-1">
                  Выбрать курс →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
