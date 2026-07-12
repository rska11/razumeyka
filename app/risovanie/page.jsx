import { Header } from '@/components/Header.jsx';
import { Footer } from '@/components/Footer.jsx';
import { DrawingLessons } from '@/components/drawing/DrawingLessons.jsx';
import { SubscribeButton } from '@/components/drawing/SubscribeButton.jsx';
import { drawingIntro, whyBlocks, drawingSubscription } from '@/data/drawing-lessons.js';
import { getAuthSession } from '@/lib/auth';
import { reconcileUserPayments } from '@/lib/payments';
import { getAccessUntil, hasActiveAccess } from '@/lib/subscription';

export const metadata = {
  title: 'Правополушарное рисование для детей — уроки-игры онлайн',
  description:
    'Самостоятельные уроки правополушарного рисования для детей 3–10 лет: рисуем по шагам, красиво выходит с первого раза. Первые уроки бесплатно, дальше — подписка. Онлайн-школа «Разумейка».',
  alternates: { canonical: '/risovanie' },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Разумейка',
    url: 'https://razumeyka-school.ru/risovanie',
    title: 'Правополушарное рисование для детей — уроки-игры онлайн',
    description: 'Рисуем по шагам, без «я не умею». Первые уроки бесплатно, оценивает родитель.',
    images: [{ url: '/images/og.png', width: 1200, height: 630, alt: 'Правополушарное рисование для детей — Разумейка' }],
  },
};

const WHY_ICON = { hands: '🖐️', eye: '👁️', spark: '✨', target: '🎯' };

const HOW_STEPS = [
  { icon: '👀', title: 'Смотри', text: 'Экран — наставник: показывает рисунок по шагам, что и в каком порядке рисовать.' },
  { icon: '✏️', title: 'Рисуй на бумаге', text: 'Ребёнок рисует карандашом на листе, в своём темпе. Планшет не нужен — с компьютера или телефона всё работает. Ошибиться здесь невозможно.' },
  { icon: '💚', title: 'Покажи родителю', text: 'Вы смотрите готовую работу и хвалите. Живая оценка близкого — лучшая награда.' },
];

const courseSchema = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'Правополушарное рисование для детей',
  description:
    'Самостоятельные уроки-игры по рисованию для детей 3–10 лет. Рисуем по шагам, первые уроки бесплатно.',
  provider: { '@type': 'Organization', name: 'Разумейка', url: 'https://razumeyka-school.ru' },
};

export default async function DrawingPage() {
  const session = await getAuthSession();
  let hasSub = false;
  let accessUntilLabel = '';
  if (session?.user?.id) {
    // Подтверждаем оплату по возвращении с ЮKassa (без зависимости от вебхука)
    await reconcileUserPayments(session.user.id);
    hasSub = await hasActiveAccess(session.user.id);
    const until = await getAccessUntil(session.user.id);
    if (until) {
      accessUntilLabel = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(until);
    }
  }

  return (
    <>
      <Header />
      <main className="mesh-bg min-h-screen">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />

        <section className="px-5 pb-8 pt-28 sm:px-8 sm:pt-32 lg:px-14">
          <div className="container-pad px-0">
            <span className="section-kicker">🎨 {drawingIntro.kicker}</span>
            <h1 className="display-title mt-5 text-[2.4rem] leading-[1.02] sm:text-5xl lg:text-[4rem]">{drawingIntro.h1}</h1>
            <div className="mt-6 max-w-2xl space-y-4">
              {drawingIntro.lead.map((p, i) => (
                <p key={i} className="text-lg font-medium leading-8 text-ink/68">{p}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#uroki" className="primary-btn">Начать бесплатно →</a>
              <a href="#pochemu" className="secondary-btn">Зачем это ребёнку</a>
            </div>
          </div>
        </section>

        <section id="pochemu" className="px-5 py-12 sm:px-8 lg:px-14">
          <div className="container-pad px-0">
            <h2 className="section-title">Почему правополушарное рисование</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {whyBlocks.map((b) => (
                <div key={b.title} className="premium-card p-6">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-pink/10 text-2xl">{WHY_ICON[b.icon] ?? '🎨'}</span>
                  <h3 className="mt-4 font-display text-xl font-extrabold text-ink">{b.title}</h3>
                  <p className="mt-2 text-base font-medium leading-7 text-ink/64">{b.text}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 max-w-2xl text-sm font-medium leading-6 text-ink/48">
              Правополушарное рисование — рабочий художественный метод. Его пользу для «синхронизации полушарий» и интуиции мы приводим как мнение сторонников подхода, а не как медицинский факт.
            </p>
          </div>
        </section>

        <section className="px-5 py-12 sm:px-8 lg:px-14">
          <div className="container-pad px-0">
            <h2 className="section-title">Как проходит урок</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {HOW_STEPS.map((s, i) => (
                <div key={s.title} className="premium-card p-6">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{s.icon}</span>
                    <span className="font-display text-sm font-extrabold text-ink/40">Шаг {i + 1}</span>
                  </div>
                  <h3 className="mt-4 font-display text-xl font-extrabold text-ink">{s.title}</h3>
                  <p className="mt-2 text-base font-medium leading-7 text-ink/64">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="uroki" className="px-5 py-12 sm:px-8 lg:px-14">
          <div className="container-pad px-0">
            <h2 className="section-title">Уроки</h2>
            <p className="mt-3 max-w-2xl text-lg font-medium leading-8 text-ink/64">
              Выберите возраст ребёнка — покажем подходящие задания. В каждой ступени первые уроки бесплатны.
            </p>
            <div className="mt-8">
              <DrawingLessons hasSubscription={hasSub} />
            </div>
          </div>
        </section>

        <section id="podpiska" className="px-5 py-14 sm:px-8 lg:px-14">
          <div className="container-pad px-0">
            <div className="color-card overflow-hidden p-8 sm:p-10">
              <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
                <div>
                  <span className="section-kicker">Полный доступ</span>
                  <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
                    Вся мастерская — {drawingSubscription.price} ₽ в {drawingSubscription.period}
                  </h2>
                  <ul className="mt-6 space-y-3">
                    {drawingSubscription.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-3 text-base font-medium leading-7 text-ink/72">
                        <span className="mt-1 grid h-5 w-5 flex-none place-items-center rounded-full bg-brand-green/15 text-xs text-brand-green">✓</span>
                        {perk}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-[22px] border border-white/70 bg-white/80 p-7 text-center shadow-card backdrop-blur-xl">
                  <p className="font-display text-5xl font-extrabold text-ink">
                    {drawingSubscription.price} <span className="text-2xl text-ink/50">₽/{drawingSubscription.period}</span>
                  </p>
                  <p className="mt-2 text-sm font-semibold text-ink/54">Первые уроки — бесплатно, без карты</p>
                  <SubscribeButton isLoggedIn={Boolean(session?.user?.id)} hasAccess={hasSub} accessUntil={accessUntilLabel} />
                  <p className="mt-3 text-xs font-medium text-ink/44">После оплаты доступ открывается сразу, на 30 дней</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
