import './mental.css';
import { Header } from '@/components/Header.jsx';
import { Footer } from '@/components/Footer.jsx';
import { MentalIntroAudio } from '@/components/mental/MentalIntroAudio.jsx';
import { MentalLessons } from '@/components/mental/MentalLessons.jsx';
import { SorobanDemo } from '@/components/mental/SorobanDemo.jsx';
import { SubscribeButton } from '@/components/drawing/SubscribeButton.jsx';
import { mentalIntro, whatIsSteps, whyBlocks, mentalSubscription } from '@/data/mental-lessons.js';
import { getAuthSession } from '@/lib/auth';
import { reconcileUserPayments } from '@/lib/payments';
import { getAccessUntil, hasActiveAccess } from '@/lib/subscription';

export const metadata = {
  title: 'Ментальная арифметика для детей — счёт в уме онлайн',
  description: 'Премиальный онлайн-курс ментальной арифметики для детей 4–10 лет: абакус на экране, устный счёт, внимание, память и уверенность в математике.',
  alternates: { canonical: '/mentalnaya-arifmetika' },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Разумейка',
    url: 'https://razumeyka-school.ru/mentalnaya-arifmetika',
    title: 'Ментальная арифметика для детей — Разумейка',
    description: 'Ребёнок учится видеть числа, считать в уме и спокойно чувствовать себя в математике.',
    images: [{ url: '/images/mental/hero-abacus-mind.webp', width: 1200, height: 630, alt: 'Ментальная арифметика для детей' }],
  },
};

const WHY_ICON = { count: '01', focus: '02', memory: '03', confidence: '04' };
const HOW_STEPS = [
  { n: '01', title: 'Смотрим на число', text: 'Цифра превращается в ясную картинку: ребёнок видит состав числа, а не угадывает ответ.' },
  { n: '02', title: 'Двигаем бусины', text: 'Интерактивный абакус проверяет каждое действие. Ошибка становится подсказкой, а не поводом расстроиться.' },
  { n: '03', title: 'Считаем в голове', text: 'Флеш-карты и цепочки постепенно переносят образ абакуса в воображение — так появляется настоящий устный счёт.' },
];
const PITCH_POINTS = [
  { title: 'Без страха перед математикой', text: 'Ребёнок получает маленькие победы каждый урок и начинает спокойнее относиться к примерам.' },
  { title: 'Внимание и рабочая память', text: 'Чтобы удержать образ бусин, нужно концентрироваться — это помогает не только на математике.' },
  { title: 'Заметный прогресс дома', text: 'Родитель видит результат: ребёнок быстрее отвечает, меньше считает на пальцах и увереннее объясняет ход решения.' },
];
const HERO_ARTWORKS = [
  { src: '/images/mental/hero-abacus-mind.webp', title: 'Абакус превращается в счёт в уме', label: 'Главный навык' },
  { src: '/images/mental/hero-fox-mentor.webp', title: 'Умный наставник', label: 'Мотивация' },
  { src: '/images/mental/hero-mental-path.webp', title: 'Образ числа', label: 'Фокус' },
];

const courseSchema = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'Ментальная арифметика для детей',
  description: 'Самостоятельные уроки по ментальной арифметике для детей 4–10 лет.',
  provider: { '@type': 'Organization', name: 'Разумейка', url: 'https://razumeyka-school.ru' },
};

export default async function MentalArithmeticPage() {
  const session = await getAuthSession();
  let hasSub = false;
  let accessUntilLabel = '';
  if (session?.user?.id) {
    await reconcileUserPayments(session.user.id);
    hasSub = await hasActiveAccess(session.user.id, 'mentalnaya-arifmetika');
    const until = await getAccessUntil(session.user.id, 'mentalnaya-arifmetika');
    if (until) accessUntilLabel = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(until);
  }

  return (
    <>
      <Header />
      <main className="mental-page min-h-screen">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />

        <section className="mental-hero mental-hero-premium px-5 pb-20 pt-28 sm:px-8 sm:pt-32 lg:px-14 lg:pb-28">
          <div className="container-pad px-0">
            <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_.98fr] lg:gap-16">
              <div className="relative z-10">
                <span className="mental-eyebrow"><i /> Ментальная арифметика · абакус · 4–10 лет</span>
                <h1 className="mental-hero-title mt-7">Ребёнок считает быстрее, потому что <em>видит числа</em></h1>
                <div className="mt-7 max-w-[700px] space-y-3">
                  {mentalIntro.lead.map((p, i) => <p key={i} className="mental-hero-lead">{p}</p>)}
                </div>
                <div className="mt-9 flex flex-wrap gap-3">
                  <a href="#uroki" className="mental-primary-btn">Начать бесплатно <span>↗</span></a>
                  <MentalIntroAudio src="/audio/mental/method/intro-hero-v1.mp3" />
                  <a href="#metod" className="mental-ghost-btn">Как работает метод</a>
                </div>
                <div className="mental-stats mt-10">
                  {[[ '0 ₽', 'первые уроки' ], [ '5–12 мин', 'один урок' ], [ '20 дней', 'первый месяц' ]].map(([v, l]) => <div key={l}><strong>{v}</strong><span>{l}</span></div>)}
                </div>
              </div>

              <div className="mental-hero-showcase" aria-label="Ментальная арифметика в Разумейке">
                <div className="mental-showcase-glow" />
                <div className="mental-showcase-shell">
                  <div className="mental-main-art-card">
                    <img src={HERO_ARTWORKS[0].src} alt={HERO_ARTWORKS[0].title} />
                    <div className="mental-art-meta"><span>{HERO_ARTWORKS[0].label}</span><b>{HERO_ARTWORKS[0].title}</b></div>
                  </div>
                  <div className="mental-showcase-badges">
                    <div><strong>Абакус на экране</strong><span>ничего покупать не нужно</span></div>
                    <div><strong>5–12 минут</strong><span>короткая практика без перегруза</span></div>
                  </div>
                  <div className="mental-art-strip">
                    <div className="mental-mini-art"><img src={HERO_ARTWORKS[1].src} alt={HERO_ARTWORKS[1].title} /><div><span>{HERO_ARTWORKS[1].label}</span><b>{HERO_ARTWORKS[1].title}</b></div></div>
                    <div className="mental-mini-art"><img src={HERO_ARTWORKS[2].src} alt={HERO_ARTWORKS[2].title} /><div><span>{HERO_ARTWORKS[2].label}</span><b>{HERO_ARTWORKS[2].title}</b></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mental-proof px-5 sm:px-8 lg:px-14"><div className="container-pad px-0"><div className="mental-proof-grid">{[
          ['Образ числа', 'Ребёнок видит 7 как пятёрку и две единицы — число становится понятным.'],
          ['Быстрая обратная связь', 'Абакус реагирует на каждое движение: ребёнок учится без страха ошибки.'],
          ['Путь к устному счёту', 'Сначала бусины на экране, потом тот же образ — уже в воображении.'],
        ].map(([t, p], i) => <div key={t}><span>0{i + 1}</span><h3>{t}</h3><p>{p}</p></div>)}</div></div></section>

        <section className="mental-demo-section px-5 py-12 sm:px-8 lg:px-14"><div className="container-pad px-0"><div className="mental-demo-premium">
          <div className="mental-demo-copy"><span>Попробуйте метод</span><h2>Попробуйте абакус вживую и сразу поймите метод.</h2><p>Здесь родитель может сам подвигать бусины и за несколько секунд понять механику курса: число видно, действие проверяется, ребёнку проще удержать ответ в голове.</p></div>
          <div className="mental-demo-card-premium"><SorobanDemo /></div>
        </div></div></section>
        <section className="mental-pitch px-5 py-12 sm:px-8 lg:px-14"><div className="container-pad px-0"><div className="mental-pitch-card">
          <div className="mental-pitch-copy"><span>Почему родители выбирают курс</span><h2>Математика перестаёт быть стрессом и становится сильной стороной.</h2><p>Мы не заставляем зубрить. Ребёнок видит число, двигает бусины, удерживает образ и постепенно начинает считать в уме. Это понятный путь от «я путаюсь» к «я сам решил».</p></div>
          <div className="mental-pitch-list">{PITCH_POINTS.map((item, index) => <article key={item.title}><span>0{index + 1}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></article>)}</div>
        </div></div></section>

        <section id="metod" className="mental-section px-5 sm:px-8 lg:px-14"><div className="container-pad px-0">
          <div className="mental-section-head"><span>Метод за минуту</span><h2>От бусины —<br />к образу числа.</h2><p>Сначала ребёнок считает руками на абакусе, потом удерживает картинку числа в памяти и решает уже в уме. Так тренируются устный счёт, внимание, рабочая память и уверенность.</p></div>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">{whatIsSteps.map((s, i) => <article key={s.title} className="mental-method-card"><span>0{i + 1}</span><div className="mental-method-icon">{s.icon}</div><h3>{s.title}</h3><p>{s.text}</p></article>)}</div>
          <a href="/blog/chto-takoe-mentalnaya-arifmetika" className="mental-article-link">Подробно и честно о методике <span>↗</span></a>
        </div></section>

        <section id="pochemu" className="mental-section mental-benefits px-5 sm:px-8 lg:px-14"><div className="container-pad px-0">
          <div className="mental-section-head mental-section-head-light"><span>Результат занятий</span><h2>Навыки, которые ребёнок забирает<br />с собой в школу и жизнь.</h2></div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{whyBlocks.map((b) => <article key={b.title} className="mental-benefit-card"><span>{WHY_ICON[b.icon] ?? '•'}</span><h3>{b.title}</h3><p>{b.text}</p></article>)}</div>
          <p className="mental-honesty">Ментальная арифметика — не волшебная таблетка. Она работает через регулярную практику: ребёнок тренирует счёт, внимание, память и спокойную уверенность перед задачами.</p>
        </div></section>

        <section className="mental-section px-5 sm:px-8 lg:px-14"><div className="container-pad px-0">
          <div className="mental-section-head"><span>Как проходит урок</span><h2>Коротко. Интерактивно.<br />С понятной победой.</h2></div>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">{HOW_STEPS.map((s) => <article key={s.n} className="mental-how-card"><span>{s.n}</span><div /><h3>{s.title}</h3><p>{s.text}</p></article>)}</div>
        </div></section>

        <section id="uroki" className="mental-section mental-course px-5 sm:px-8 lg:px-14"><div className="container-pad px-0">
          <div className="mental-section-head"><span>Программа</span><h2>От первой бусины<br />к счёту в воображении.</h2><p>Выберите возраст — мы настроим скорость. Дальше ребёнок идёт по дням и открывает следующий навык только после понятной практики.</p></div>
          <div className="mt-10"><MentalLessons hasSubscription={hasSub} /></div>
        </div></section>

        <section id="podpiska" className="px-5 pb-24 pt-10 sm:px-8 lg:px-14 lg:pb-32"><div className="container-pad px-0"><div className="mental-price-card">
          <div className="mental-price-copy"><span>Доступ к ментальной арифметике</span><h2>Регулярная практика,<br />которая окупается уверенностью</h2><p>Все уроки ментальной арифметики открываются сразу. Ребёнок занимается дома в удобное время, а родитель видит понятный прогресс без поездок, репетиторов и покупки счётов.</p><ul>{mentalSubscription.perks.map((perk) => <li key={perk}><i>✓</i>{perk}</li>)}</ul></div>
          <div className="mental-price-box"><p>Полный доступ</p><strong>{mentalSubscription.price}<small> ₽ / {mentalSubscription.period}</small></strong><span>Бесплатные уроки · без карты</span><SubscribeButton isLoggedIn={Boolean(session?.user?.id)} hasAccess={hasSub} accessUntil={accessUntilLabel} returnTo="/mentalnaya-arifmetika" /><small>Доступ открывается сразу на 30 дней</small></div>
        </div></div></section>
      </main>
      <Footer />
    </>
  );
}