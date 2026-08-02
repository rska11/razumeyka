import './drawing.css';
import { Header } from '@/components/Header.jsx';
import { Footer } from '@/components/Footer.jsx';
import { ArtworkShowcase } from '@/components/drawing/ArtworkShowcase.jsx';
import { DrawingIntroAudio } from '@/components/drawing/DrawingIntroAudio.jsx';
import { DrawingLessons } from '@/components/drawing/DrawingLessons.jsx';
import { SubscribeButton } from '@/components/drawing/SubscribeButton.jsx';
import { CourseDiscovery } from '@/components/CourseDiscovery.jsx';
import { TrackedLink } from '@/components/analytics/TrackedLink.jsx';
import { drawingIntro, whyBlocks, drawingSubscription } from '@/data/drawing-lessons.js';
import { getAuthSession } from '@/lib/auth';
import { reconcileUserPayments } from '@/lib/payments';
import { getAccessUntil, hasActiveAccess } from '@/lib/subscription';
import { canonical } from '@/lib/seo';

export const metadata = {
  title: 'Правополушарное рисование для детей — уроки-игры онлайн',
  description: 'Самостоятельные уроки рисования для детей 3–10 лет: понятный прогресс, авторские сюжеты и красивые работы по шагам.',
  alternates: canonical('/risovanie'),
  openGraph: { type: 'website', locale: 'ru_RU', siteName: 'Знайтон', url: 'https://znayton.ru/risovanie', title: 'Правополушарное рисование для детей — Знайтон', description: 'Рисуем по шагам, развиваем руку и создаём настоящее портфолио.', images: [{ url: '/images/og.png', width: 1200, height: 630, alt: 'Рисование для детей — Знайтон' }] },
};

const WHY_ICON = { hands: '✦', eye: '◉', spark: '✺', target: '◎' };
const HOW_STEPS = [
  { number: '01', title: 'Смотрим один шаг', text: 'На экране появляется только нужная часть рисунка. Ребёнок не теряется в сложной готовой картинке.' },
  { number: '02', title: 'Рисуем на бумаге', text: 'Линия за линией, в удобном темпе. Можно остановиться, повторить шаг и выбрать собственные цвета.' },
  { number: '03', title: 'Превращаем в историю', text: 'В финале ребёнок добавляет детали, придумывает сюжет и показывает законченную работу близким.' },
];
const METHOD_POINTS = [
  {
    title: 'Снимаем страх ошибки',
    text: 'На экране виден только один посильный шаг. Ребёнку не нужно сразу повторять сложную готовую картинку целиком.',
  },
  {
    title: 'Учимся видеть форму',
    text: 'Ребёнок замечает направление линии, размер и расположение деталей, а затем выбирает цвет и добавляет собственные элементы.',
  },
  {
    title: 'Завершаем свою работу',
    text: 'Каждый маршрут приводит к картинке, которую можно показать близким, сохранить в портфолио и дополнить собственной историей.',
  },
];
const HERO_ARTWORKS = [
  { src: '/images/drawing/hero-lion-artist.webp', title: 'Львёнок-художник', label: 'Финальная работа' },
  { src: '/images/drawing/hero-tree-library.webp', title: 'Дом-библиотека', label: 'Образ и детали' },
  { src: '/images/drawing/hero-sky-whale.webp', title: 'Небесный кит', label: 'Цвет и настроение' },
];

const courseSchema = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'Правополушарное рисование для детей',
  description: 'Самостоятельные уроки-игры по рисованию для детей 3–10 лет.',
  provider: { '@type': 'Organization', name: 'Знайтон', url: 'https://znayton.ru' },
  inLanguage: 'ru',
  offers: {
    '@type': 'Offer',
    price: drawingSubscription.price,
    priceCurrency: 'RUB',
    availability: 'https://schema.org/InStock',
  },
};
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://znayton.ru' },
    { '@type': 'ListItem', position: 2, name: 'Рисование для детей', item: 'https://znayton.ru/risovanie' },
  ],
};

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
      <Header focused primaryHref="#uroki" primaryLabel="3 урока бесплатно" primaryGoal="drawing_header_free_click" />
      <main className="drawing-page min-h-screen">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

        <section className="drawing-hero px-5 pb-20 pt-36 sm:px-8 sm:pt-40 lg:px-14 lg:pb-28">
          <div className="container-pad px-0">
            <div className="grid items-center gap-12 lg:grid-cols-[1.03fr_.97fr] lg:gap-16">
              <div className="relative z-10">
                <span className="drawing-eyebrow"><span className="drawing-eyebrow-dot" /> Рисование · правополушарный подход · 3–10 лет</span>
                <h1 className="drawing-hero-title mt-7">Ребёнок создаст свою картину — даже если говорит <em>«я не умею»</em></h1>
                <div className="mt-7 max-w-[680px] space-y-3">
                  {drawingIntro.lead.slice(0, 2).map((paragraph, index) => <p key={index} className="drawing-hero-lead">{paragraph}</p>)}
                </div>
                <div className="mt-9 flex flex-wrap gap-3">
                  <TrackedLink goal="drawing_hero_free_click" params={{ source: 'hero' }} href="#uroki" className="drawing-primary-btn">Пройти 3 урока бесплатно <span>↗</span></TrackedLink>
                  <DrawingIntroAudio />
                  <TrackedLink goal="drawing_hero_gallery_click" params={{ source: 'hero' }} href="#raboty-nedeli" className="drawing-ghost-btn">Посмотреть работы</TrackedLink>
                </div>
                <div className="mt-5 flex max-w-[650px] flex-wrap gap-x-5 gap-y-2 rounded-2xl border border-ink/8 bg-white/65 px-4 py-3 text-xs font-extrabold text-ink/58 shadow-sm backdrop-blur">
                  <span>✓ 3 урока без карты</span>
                  <span>✓ Бумага и карандаши</span>
                  <span className="text-ink">Полный месяц — {drawingSubscription.price} ₽</span>
                  <span>✓ Без автосписания</span>
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

        <section className="px-5 py-20 sm:px-8 lg:px-14 lg:py-24">
          <div className="container-pad px-0">
            <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
              <div className="max-w-xl">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-brand-pink">Когда хочется рисовать, но страшно начать</span>
                <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.03] tracking-[-0.05em] sm:text-5xl">Знакомо вашему ребёнку?</h2>
                <p className="mt-5 text-base font-semibold leading-7 text-ink/58">Мы превратили большой рисунок в короткую последовательность понятных действий, чтобы ребёнок чаще говорил «я сам», а не «нарисуй за меня».</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ['«Я не умею»', 'Отказывается начинать, увидев сложную готовую картинку.'],
                  ['Бросает на середине', 'Расстраивается из-за одной неровной линии и теряет интерес.'],
                  ['Просит дорисовать', 'Ждёт постоянной помощи взрослого вместо самостоятельного шага.'],
                  ['Не знает, что придумать', 'Копирует образец, но боится добавить цвет, фон или свою деталь.'],
                ].map(([title, text]) => (
                  <article key={title} className="rounded-[22px] border border-ink/8 bg-white/80 p-5 shadow-card">
                    <h3 className="font-display text-lg font-extrabold text-ink">{title}</h3>
                    <p className="mt-2 text-sm font-semibold leading-6 text-ink/54">{text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="drawing-method-section px-5 py-14 sm:px-8 sm:py-16 lg:px-14">
          <div className="container-pad px-0">
            <div className="drawing-section-head drawing-method-head">
              <span>Метод курса</span>
              <h2>Метод, который помогает<br /><em>не бояться</em> чистого листа</h2>
              <p>«Правополушарное рисование» — распространённое название творческого подхода. В нашем курсе ребёнок учится видеть форму целиком, двигаться по понятным шагам и свободнее выбирать цвет и детали. Это творческая практика, а не медицинская тренировка отдельных полушарий.</p>
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
                мы не сравниваем детей и не требуем идеальных линий. Главный рисунок ребёнок делает удобной рукой, а вторую подключает только в небольших игровых упражнениях.
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
            <div className="drawing-section-head"><span>Программа курса</span><h2>Выберите возраст.<br />Откройте мастерскую.</h2><p>В каждой программе — последовательные учебные дни, понятный прогресс и три бесплатных стартовых урока.</p></div>
            <div className="mt-10"><DrawingLessons hasSubscription={hasSub} /></div>
          </div>
        </section>

        <section className="px-5 pb-20 pt-8 sm:px-8 lg:px-14 lg:pb-24">
          <div className="container-pad px-0">
            <div className="grid gap-10 rounded-[34px] border border-ink/8 bg-white/80 p-6 shadow-card sm:p-9 lg:grid-cols-[.75fr_1.25fr] lg:p-12">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-brand-pink">Перед стартом</span>
                <h2 className="mt-5 font-display text-3xl font-extrabold leading-tight tracking-[-0.04em] sm:text-5xl">Всё, что важно родителю</h2>
                <p className="mt-5 text-sm font-semibold leading-7 text-ink/56">Начать можно без подготовки: выберите возраст, откройте любой из трёх бесплатных уроков и рисуйте в удобном темпе.</p>
              </div>
              <div className="grid gap-3">
                {[
                  ['Что понадобится?', 'Обычная бумага, простой карандаш, ластик и цветные карандаши или фломастеры. Покупать специальные наборы не нужно.'],
                  ['Сколько длится занятие?', 'Урок разбит на короткие шаги. Можно остановиться, повторить показ и закончить рисунок в своём темпе.'],
                  ['Нужно ли уже уметь рисовать?', 'Нет. Возрастные программы начинаются с простых форм и постепенно ведут к деталям, героям и сюжетам.'],
                  ['Нужно ли постоянно сидеть рядом?', 'Ребёнок видит текущий шаг и может повторить его самостоятельно. Малышам 3–4 лет помощь взрослого может понадобиться на старте.'],
                  ['Что откроется после оплаты?', 'Полный маршрут выбранного месяца, все возрастные программы, пошаговый плеер и творческие задания.'],
                  ['Будут ли повторные списания?', 'Нет. Это разовая оплата за 30 дней доступа без автоматического продления.'],
                ].map(([question, answer]) => (
                  <details key={question} className="group rounded-[18px] border border-ink/8 bg-[#FBF8F1] px-5 py-4">
                    <summary className="cursor-pointer list-none pr-6 font-display text-base font-extrabold text-ink marker:hidden">{question}<span className="float-right text-brand-pink transition group-open:rotate-45">＋</span></summary>
                    <p className="mt-3 pr-6 text-sm font-semibold leading-6 text-ink/58">{answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="podpiska" className="px-5 pb-24 pt-8 sm:px-8 lg:px-14 lg:pb-32">
          <div className="container-pad px-0">
            <div className="drawing-price-card">
              <div className="drawing-price-copy"><span>Полный доступ к мастерской</span><h2>Месяц, который останется<br />в детском портфолио</h2><p>Все уроки, пошаговый плеер, творческие задания и новые работы без ограничений.</p><ul>{drawingSubscription.perks.map((perk) => <li key={perk}><i>✓</i>{perk}</li>)}</ul></div>
              <div className="drawing-price-box"><p>Стоимость доступа на 30 дней</p><del className="mt-3 block text-lg font-extrabold text-white/35">{drawingSubscription.oldPrice} ₽</del><strong>{drawingSubscription.price}<small> ₽ · один платёж</small></strong><span>Сначала пройдите 3 урока бесплатно · без карты</span><SubscribeButton isLoggedIn={Boolean(session?.user?.id)} hasAccess={hasSub} accessUntil={accessUntilLabel} returnTo="/risovanie" loginCallback="/risovanie#podpiska" buttonLabel={`Открыть мастерскую за ${drawingSubscription.price} ₽`} /><small>Доступ открывается сразу · автоматического продления нет</small></div>
            </div>
            <CourseDiscovery current="risovanie" />
          </div>
        </section>
        {!hasSub && (
          <TrackedLink goal="drawing_mobile_sticky_click" params={{ source: 'mobile_sticky' }} href="#uroki" className="fixed inset-x-3 bottom-3 z-40 flex min-h-[58px] items-center justify-between rounded-full bg-[#15233D] px-5 text-sm font-extrabold text-white shadow-[0_20px_50px_rgba(21,35,61,.32)] md:hidden">
            <span>3 урока бесплатно</span>
            <span className="rounded-full bg-white/12 px-3 py-1.5 text-xs text-[#F3C65C]">затем {drawingSubscription.price} ₽ →</span>
          </TrackedLink>
        )}
      </main>
      <Footer />
    </>
  );
}
