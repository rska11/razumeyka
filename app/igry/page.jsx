import Link from 'next/link';
import { Footer } from '@/components/Footer.jsx';
import { Header } from '@/components/Header.jsx';
import { GameLauncher } from '@/components/games/GameShell.jsx';
import { featuredGames, resolveGameId } from '@/data/games.js';

export const metadata = {
  title: 'Развивающие игры для детей онлайн бесплатно',
  description: 'Игровой зал «Знайтона»: развивающие игры на счёт, внимание и подготовку к школе. Можно играть онлайн без регистрации.',
  alternates: { canonical: '/igry' },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Знайтон',
    url: 'https://znayton.ru/igry',
    title: 'Игровой зал «Знайтона» — развивающие игры для детей',
    description: 'Ребёнок управляет героем, проходит уровни и тренирует полезный навык в действии.',
    images: [{ url: '/images/og.png', width: 1200, height: 630, alt: 'Игровой зал платформы «Знайтон»' }],
  },
};

const gameView = {
  bridge: {
    icon: '🦊',
    directionLabel: 'Подготовка к школе',
    directionHref: '/podgotovka-k-shkole',
    gradient: 'from-[#17234C] via-[#225A8B] to-[#168B9A]',
    glow: 'bg-[#FFCF68]/24',
    accent: 'bg-[#FFCF68] text-[#18213A]',
    text: 'text-[#FFE19B]',
  },
  'mental-quest': {
    icon: '🚀',
    directionLabel: 'Ментальная арифметика',
    directionHref: '/mentalnaya-arifmetika',
    gradient: 'from-[#08142E] via-[#173D73] to-[#13766E]',
    glow: 'bg-[#75E5C1]/22',
    accent: 'bg-[#75E5C1] text-[#09152E]',
    text: 'text-[#9AF3D6]',
  },
};

export default async function GamesPage({ searchParams }) {
  const params = await searchParams;
  const requested = Array.isArray(params?.game) ? params.game[0] : params?.game;
  const games = featuredGames();
  const resolved = resolveGameId(requested);
  const autoOpenId = games.some((game) => game.id === resolved) ? resolved : null;

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Игровой зал «Знайтона»',
    description: 'Развивающие онлайн-игры для детей внутри образовательных направлений платформы «Знайтон».',
    url: 'https://znayton.ru/igry',
    hasPart: games.map((game) => ({
      '@type': 'Game',
      name: game.title,
      description: game.note,
      audience: { '@type': 'PeopleAudience', suggestedMinAge: game.ages },
    })),
  };

  return (
    <>
      <Header />
      <main className="min-h-screen overflow-hidden bg-[#F6F8FC] text-ink">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

        <section className="relative overflow-hidden px-5 pb-20 pt-32 sm:px-8 sm:pt-36 lg:px-14 lg:pb-28">
          <div className="pointer-events-none absolute -left-36 top-8 h-[480px] w-[480px] rounded-full bg-brand-blue/16 blur-[110px]" />
          <div className="pointer-events-none absolute -right-32 top-10 h-[520px] w-[520px] rounded-full bg-brand-pink/14 blur-[120px]" />
          <div className="container-pad relative px-0">
            <div className="mx-auto max-w-4xl text-center">
              <span className="inline-flex rounded-full border border-brand-blue/14 bg-white/82 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-brand-blue shadow-sm backdrop-blur-xl">
                Игры · бесплатно · без регистрации
              </span>
              <h1 className="mt-7 font-display text-[44px] font-extrabold leading-[.98] tracking-[-0.055em] sm:text-6xl lg:text-[76px]">
                Игровой зал <span className="bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink bg-clip-text text-transparent">Знайтона</span>
              </h1>
              <p className="mx-auto mt-7 max-w-3xl text-base font-semibold leading-7 text-ink/60 sm:text-lg sm:leading-8">
                Здесь полезный навык становится правилом игры: чтобы пройти дальше, ребёнок считает, замечает закономерности и принимает решение сам.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-2 text-[11px] font-extrabold text-ink/48 sm:text-xs">
                <span className="rounded-full bg-white px-4 py-2 shadow-sm">Без установки</span>
                <span className="rounded-full bg-white px-4 py-2 shadow-sm">Работает на телефоне и компьютере</span>
                <span className="rounded-full bg-white px-4 py-2 shadow-sm">Новые тренажёры будут появляться постепенно</span>
              </div>
            </div>

            <div className="mt-12 grid gap-5 lg:grid-cols-2">
              {games.map((game) => {
                const view = gameView[game.id];
                if (!view) return null;
                return (
                  <article key={game.id} className={`relative overflow-hidden rounded-[36px] bg-gradient-to-br ${view.gradient} p-6 text-white shadow-luxe sm:p-8 lg:p-10`}>
                    <div className={`pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full ${view.glow} blur-3xl`} />
                    <div className="relative flex h-full min-h-[390px] flex-col">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className={`inline-flex rounded-full border border-white/14 bg-white/[0.08] px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.15em] ${view.text}`}>
                          {view.directionLabel} · {game.ages}
                        </span>
                        <span className="rounded-full bg-white/10 px-3 py-2 text-[9px] font-extrabold uppercase tracking-[0.12em] text-white/66">Можно играть сейчас</span>
                      </div>

                      <div className="mt-8 flex items-start gap-4 sm:gap-5">
                        <span className={`grid h-16 w-16 shrink-0 place-items-center rounded-[20px] text-3xl shadow-[0_16px_36px_rgba(0,0,0,.22)] ${view.accent}`}>{view.icon}</span>
                        <div>
                          <p className={`text-[10px] font-extrabold uppercase tracking-[0.17em] ${view.text}`}>{game.kicker}</p>
                          <h2 className="mt-2 font-display text-3xl font-extrabold leading-none tracking-[-0.045em] sm:text-4xl">{game.title}</h2>
                        </div>
                      </div>

                      <p className="mt-7 max-w-xl text-sm font-semibold leading-6 text-white/68 sm:text-base sm:leading-7">{game.note}.</p>
                      <div className="mt-6 rounded-[22px] border border-white/10 bg-white/[0.065] p-4">
                        <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-white/42">Что тренирует</p>
                        <p className="mt-2 text-sm font-extrabold leading-6 text-white/82">{game.skill}</p>
                      </div>

                      <div className="mt-auto flex flex-col gap-3 pt-7 sm:flex-row sm:items-center">
                        <GameLauncher
                          gameId={game.id}
                          defaultOpen={autoOpenId === game.id}
                          className={`group inline-flex min-h-[58px] flex-1 items-center justify-center gap-3 rounded-full px-6 text-sm font-black shadow-[0_18px_38px_rgba(0,0,0,.20)] transition hover:-translate-y-1 ${view.accent}`}
                        >
                          <span className="grid h-8 w-8 place-items-center rounded-full bg-white/55 text-xs transition group-hover:scale-110">▶</span>
                          Запустить игру
                        </GameLauncher>
                        <Link href={view.directionHref} className="inline-flex min-h-[58px] items-center justify-center rounded-full border border-white/16 px-5 text-sm font-extrabold text-white/78 transition hover:bg-white/10 hover:text-white">
                          О курсе →
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-8 rounded-[28px] border border-ink/7 bg-white p-6 text-center shadow-card sm:p-8">
              <p className="font-display text-2xl font-extrabold tracking-[-0.035em]">Игровой зал будет пополняться</p>
              <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold leading-6 text-ink/54">Мы добавляем игры тогда, когда они действительно тренируют навык курса, а не просто занимают ребёнка экраном.</p>
              <Link href="/#programs" className="mt-5 inline-flex min-h-[48px] items-center justify-center rounded-full bg-ink px-6 text-sm font-extrabold text-white transition hover:-translate-y-1">Посмотреть все направления →</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}