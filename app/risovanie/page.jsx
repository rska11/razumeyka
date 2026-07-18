import './drawing.css';
import { Header } from '@/components/Header.jsx';
import { Footer } from '@/components/Footer.jsx';
import { ArtworkShowcase } from '@/components/drawing/ArtworkShowcase.jsx';
import { DrawingIntroAudio } from '@/components/drawing/DrawingIntroAudio.jsx';
import { DrawingLessons } from '@/components/drawing/DrawingLessons.jsx';
import { SubscribeButton } from '@/components/drawing/SubscribeButton.jsx';
import { CourseDiscovery } from '@/components/CourseDiscovery.jsx';
import { drawingIntro, whyBlocks, drawingSubscription } from '@/data/drawing-lessons.js';
import { getAuthSession } from '@/lib/auth';
import { reconcileUserPayments } from '@/lib/payments';
import { getAccessUntil, hasActiveAccess } from '@/lib/subscription';

export const metadata = {
  title: 'Правополушарное рисование для детей — уроки-игры онлайн',
  description: 'Самостоятельные уроки рисования для детей 3–10 лет: понятный прогресс, авторские сюжеты и красивые работы по шагам.',
  alternates: { canonical: '/risovanie' },
  openGraph: { type: 'website', locale: 'ru_RU', siteName: 'Разумейка', url: 'https://razumeyka-school.ru/risovanie', title: 'Правополушарное рисование для детей — Разумейка', description: 'Рисуем по шагам, развиваем руку и создаём настоящее портфолио.', images: [{ url: '/images/og.png', width: 1200, height: 630, alt: 'Рисование для детей — Разумейка' }] },
};

const WHY_ICON = { hands: '✦', eye: '◉', spark: '✺', target: '◎' };
const HOW_STEPS = [
  { number: '01', title: 'Смотрим один шаг', text: 'На экране появляется только нужная часть рисунка. Ребёнок не теряется в сложной готовой картинке.' },
  { number: '02', title: 'Рисуем на бумаге', text: 'Линия за линией, в удобном темпе. Можно остановиться, повторить шаг и выбрать собственные цвета.' },
  { number: '03', title: 'Превращаем в историю', text: 'В финале ребёнок добавляет детали, придумывает сюжет и показывает законченную работу близким.' },
];
const METHOD_POINTS = [
  {
    title: 'Открываем вторую руку',
    text: 'В большинстве случаев это левая рука. Через маленькие безопасные детали ребёнок получает новый маршрут движения и внимания.',
  },
  {
    title: 'Соединяем логику и образ',
    text: 'Левое полушарие помогает держать порядок и шаги, правое — видеть цвет, форму, интуицию и настроение рисунка целиком.',
  },
  {
    title: 'Выводим в уверенность',
    text: 'Когда ребёнок видит «я могу», он смелее проявляет инициативу, предлагает идеи и становится заметнее среди сверстников.',
  },
];
const HERO_ARTWORKS = [
  { src: '/images/drawing/hero-lion-artist.webp', title: 'Львёнок-художник', label: 'Финальная работа' },
  { src: '/images/drawing/hero-tree-library.webp', title: 'Дом-библиотека', label: 'Образ и детали' },
  { src: '/images/drawing/hero-sky-whale.webp', title: 'Небесный кит', label: 'Цвет и настроение' },
];

const courseSchema = { '@context': 'https://schema.org', '@type': 'Course', name: 'Правополушарное рисование для детей', description: 'Самостоятельные уроки-игры по рисованию для детей 3–10 лет.', provider: { '@type': 'Organization', name: 'Разумейка', url: 'https://razumeyka-school.ru' } };

export default async function DrawingPage() {
  const session = await getAuthSession();
  let hasSub = false;
  let accessUntilLabel = '';
  if (session?.user?.id) {
    await reconcileUserPayments(session.user.id);
    hasSub = await hasActiveAccess(session.user.id, 'risovanie');
    const until = await getAccessUntil(session.user.id, 'risovanie');
    if (until) accessUntilLabel = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(until);
  }

  return (
    <>
      <Header />
      <main className="drawing-page min-h-screen">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />

        <section className="drawing-hero px-5 pb-20 pt-36 sm:px-8 sm:pt-40 lg:px-14 lg:pb-28">
          <div className="container-pad px-0">
            <div className="grid items-center gap-12 lg:grid-cols-[1.03fr_.97fr] lg:gap-16">
              <div className="relative z-10">
                <span className="drawing-eyebrow"><span className="drawing-eyebrow-dot" /> Рисование · правополушарный подход · 3–10 лет</span>
                <h1 className="drawing-hero-title mt-7">Рисование, которое развивает <em>смелость</em> и вкус</h1>
                <div className="mt-7 max-w-[680px] space-y-3">
                  {drawingIntro.lead.slice(0, 2).map((paragraph, index) => <p key={index} className="drawing-hero-lead">{paragraph}</p>)}
                </div>
                <div className="mt-9 flex flex-wrap gap-3">
                  <a href="#uroki" className="drawing-primary-btn">Попробовать первый урок <span>↗</span></a>
                  <DrawingIntroAudio />
                  <a href="#programma" className="drawing-ghost-btn">Посмотреть программу</a>
                </div>
                <div className="mt-10 grid max-w-[650px] grid-cols-3 gap-3">
                  {[['20', 'учебных дней'], ['3', 'возрастные программы'], ['5–7', 'понятных шагов']].map(([value, label]) => (
                    <div key={label} className="drawing-stat"><strong>{value}</strong><span>{label}</span></div>
                  ))}
                </div>
              </div>

              <div className="drawing-hero-gallery" aria-label="Примеры работ из курса">
                <div className="drawing-gallery-glow" />
                <div className="drawing-main-art drawing-main-art-image">
                  <img src={HERO_ARTWORKS[0].src} alt={HERO_ARTWORKS[0].title} />
                  <div className="drawing-art-meta"><span>{HERO_ARTWORKS[0].label}</span><b>{HERO_ARTWORKS[0].title}</b></div>
                </div>
                <div className="drawing-mini-art drawing-mini-art-one drawing-mini-art-image"><img src={HERO_ARTWORKS[1].src} alt={HERO_ARTWORKS[1].title} /><span>{HERO_ARTWORKS[1].title}</span></div>
                <div className="drawing-mini-art drawing-mini-art-two drawing-mini-art-image"><img src={HERO_ARTWORKS[2].src} alt={HERO_ARTWORKS[2].title} /><span>{HERO_ARTWORKS[2].title}</span></div>
                <div className="drawing-proof-chip"><span>✓</span><div><b>Реальные уроки</b><small>не рекламные заглушки</small></div></div>
              </div>
            </div>
          </div>
        </section>

        <section id="programma" className="drawing-proof-strip px-5 sm:px-8 lg:px-14">
          <div className="container-pad px-0">
            <div className="grid gap-px overflow-hidden rounded-[28px] border border-ink/8 bg-ink/8 md:grid-cols-3">
              {[['01', 'Не копирование', 'Каждый урок учит видеть большую форму, детали и композицию.'], ['02', 'Настоящий рост', 'От одного объекта — к героям, движению и большим сюжетам.'], ['03', 'Авторский финал', 'Ребёнок выбирает цвета, придумывает историю и оформляет выставку.']].map(([n, title, text]) => (
                <div key={n} className="drawing-proof-cell"><span>{n}</span><div><h3>{title}</h3><p>{text}</p></div></div>
              ))}
            </div>
          </div>
        </section>

        <section className="drawing-method-section px-5 py-14 sm:px-8 sm:py-16 lg:px-14">
          <div className="container-pad px-0">
            <div className="drawing-section-head drawing-method-head">
              <span>Метод курса</span>
              <h2>Что значит<br /><em>правополушарное</em> рисование?</h2>
              <p>Это не набор раскрасок. Мы через рисование включаем вторую руку, чаще левую, и соединяем два режима мышления: логичный пошаговый порядок и правополушарный образ, цвет, интуицию, чувство целого. Ребёнок не просто повторяет — он раскрывает смелость, фантазию и уверенность.</p>
            </div>
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {METHOD_POINTS.map((point, index) => (
                <article key={point.title} className="rounded-[26px] border border-white/75 bg-white/75 p-6 shadow-card">
                  <span className="font-display text-sm font-extrabold text-brand-pink">0{index + 1}</span>
                  <h3 className="mt-8 font-display text-2xl font-extrabold leading-tight text-ink">{point.title}</h3>
                  <p className="mt-3 text-sm font-semibold leading-7 text-ink/62">{point.text}</p>
                </article>
              ))}
            </div>
            <div className="mt-5 rounded-[26px] border border-brand-purple/15 bg-brand-purple/8 px-6 py-5">
              <p className="text-sm font-semibold leading-7 text-ink/70">
                <span className="font-extrabold text-brand-purple">Важно:</span>{' '}
                мы не требуем идеальной левой руки и не сравниваем детей. Главный рисунок ребёнок делает удобной рукой, а непишущей пробует маленькие элементы там, где не страшно ошибиться.
              </p>
            </div>
          </div>
        </section>

        <section id="pochemu" className="drawing-section px-5 sm:px-8 lg:px-14">
          <div className="container-pad px-0">
            <div className="drawing-section-head"><span>Зачем ребёнку</span><h2>Не просто занять на 15 минут.<br />Научить <em>создавать</em>.</h2><p>Курс соединяет тренировку руки, наблюдение, самостоятельный выбор и радость от законченной работы.</p></div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {whyBlocks.map((block, index) => (
                <article key={block.title} className={'drawing-value-card ' + (index === 0 ? 'drawing-value-card-featured' : '')}>
                  <div className="drawing-value-icon">{WHY_ICON[block.icon] ?? '✦'}</div>
                  <span className="drawing-value-index">0{index + 1}</span>
                  <h3>{block.title}</h3><p>{block.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="drawing-how-compact px-5 py-10 sm:px-8 lg:px-14">
          <div className="container-pad px-0">
            <div className="drawing-how-compact-card">
              <div className="drawing-how-compact-copy">
                <span>Один урок</span>
                <h2>Смотрим шаг. Рисуем. Оживляем.</h2>
                <p>Без тяжёлой теории: ребёнок сразу понимает, что делать сейчас, и видит красивый результат на бумаге.</p>
              </div>
              <div className="drawing-how-compact-steps">
                {HOW_STEPS.map((step) => <article key={step.number}><span>{step.number}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></article>)}
              </div>
            </div>
          </div>
        </section>

        <ArtworkShowcase />

        <section id="uroki" className="drawing-section px-5 sm:px-8 lg:px-14">
          <div className="container-pad px-0">
            <div className="drawing-section-head"><span>Программа курса</span><h2>Выберите возраст.<br />Откройте мастерскую.</h2><p>В каждой программе — последовательные учебные дни, понятный прогресс и бесплатные стартовые уроки.</p></div>
            <div className="mt-10"><DrawingLessons hasSubscription={hasSub} /></div>
          </div>
        </section>

        <section id="podpiska" className="px-5 pb-24 pt-8 sm:px-8 lg:px-14 lg:pb-32">
          <div className="container-pad px-0">
            <div className="drawing-price-card">
              <div className="drawing-price-copy"><span>Полный доступ к мастерской</span><h2>Месяц, который останется<br />в детском портфолио</h2><p>Все уроки, пошаговый плеер, творческие задания и новые работы без ограничений.</p><ul>{drawingSubscription.perks.map((perk) => <li key={perk}><i>✓</i>{perk}</li>)}</ul></div>
              <div className="drawing-price-box"><p>Стоимость доступа</p><strong>{drawingSubscription.price}<small> ₽ / {drawingSubscription.period}</small></strong><span>Первые уроки бесплатно · без карты</span><SubscribeButton isLoggedIn={Boolean(session?.user?.id)} hasAccess={hasSub} accessUntil={accessUntilLabel} /><small>После оплаты доступ открывается сразу на 30 дней</small></div>
            </div>
            <CourseDiscovery current="risovanie" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
