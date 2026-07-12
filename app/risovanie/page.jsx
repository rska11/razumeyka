import './drawing.css';
import { Header } from '@/components/Header.jsx';
import { Footer } from '@/components/Footer.jsx';
import { ArtworkShowcase } from '@/components/drawing/ArtworkShowcase.jsx';
import { DrawingLessons } from '@/components/drawing/DrawingLessons.jsx';
import { SubscribeButton } from '@/components/drawing/SubscribeButton.jsx';
import { drawingIntro, whyBlocks, drawingSubscription, drawingLessons } from '@/data/drawing-lessons.js';
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
const HERO_SLUGS = ['preschool-m1-d20-05', 'preschool-m1-d17-03', 'preschool-m1-d19-03'];
const HERO_LESSONS = HERO_SLUGS.map((slug) => drawingLessons.find((lesson) => lesson.slug === slug)).filter(Boolean);

function Artwork({ lesson, className = '' }) {
  if (!lesson) return null;
  return <svg className={className} viewBox={lesson.coloredViewBox ?? lesson.viewBox ?? '0 0 300 210'} role="img" aria-label={lesson.title} dangerouslySetInnerHTML={{ __html: lesson.coloredPreview ?? '' }} />;
}

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

        <section className="drawing-hero px-5 pb-20 pt-28 sm:px-8 sm:pt-32 lg:px-14 lg:pb-28">
          <div className="container-pad px-0">
            <div className="grid items-center gap-12 lg:grid-cols-[1.03fr_.97fr] lg:gap-16">
              <div className="relative z-10">
                <span className="drawing-eyebrow"><span className="drawing-eyebrow-dot" /> Онлайн-мастерская · 3–10 лет</span>
                <h1 className="drawing-hero-title mt-7">Рисование, после которого <em>виден прогресс</em></h1>
                <div className="mt-7 max-w-[680px] space-y-3">
                  {drawingIntro.lead.slice(0, 2).map((paragraph, index) => <p key={index} className="drawing-hero-lead">{paragraph}</p>)}
                </div>
                <div className="mt-9 flex flex-wrap gap-3">
                  <a href="#uroki" className="drawing-primary-btn">Попробовать первый урок <span>↗</span></a>
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
                <div className="drawing-main-art">
                  <div className="drawing-art-meta"><span>Финальная работа</span><b>Портрет львёнка</b></div>
                  <Artwork lesson={HERO_LESSONS[0]} className="h-full w-full" />
                </div>
                <div className="drawing-mini-art drawing-mini-art-one"><Artwork lesson={HERO_LESSONS[1]} className="h-full w-full" /><span>Ксилофон</span></div>
                <div className="drawing-mini-art drawing-mini-art-two"><Artwork lesson={HERO_LESSONS[2]} className="h-full w-full" /><span>Диплодок</span></div>
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

        <section className="drawing-section drawing-how px-5 sm:px-8 lg:px-14">
          <div className="container-pad px-0">
            <div className="drawing-section-head drawing-section-head-light"><span>Один урок</span><h2>Спокойный процесс.<br />Красивый результат.</h2></div>
            <div className="mt-12 grid gap-4 lg:grid-cols-3">
              {HOW_STEPS.map((step) => <article key={step.number} className="drawing-how-card"><span>{step.number}</span><div className="drawing-how-line" /><h3>{step.title}</h3><p>{step.text}</p></article>)}
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
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
