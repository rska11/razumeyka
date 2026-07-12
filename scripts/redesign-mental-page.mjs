import { writeFile } from 'node:fs/promises';
const file = new URL('../app/mentalnaya-arifmetika/page.jsx', import.meta.url);
const content = `import './mental.css';
import { Header } from '@/components/Header.jsx';
import { Footer } from '@/components/Footer.jsx';
import { MentalLessons } from '@/components/mental/MentalLessons.jsx';
import { SorobanDemo } from '@/components/mental/SorobanDemo.jsx';
import { SubscribeButton } from '@/components/drawing/SubscribeButton.jsx';
import { mentalIntro, whatIsSteps, whyBlocks, mentalSubscription } from '@/data/mental-lessons.js';
import { getAuthSession } from '@/lib/auth';
import { reconcileUserPayments } from '@/lib/payments';
import { getAccessUntil, hasActiveAccess } from '@/lib/subscription';

export const metadata = { title: 'Ментальная арифметика для детей — уроки-игры онлайн', description: 'Интерактивный абакус, последовательные уроки и понятный прогресс в устном счёте для детей 4–10 лет.', alternates: { canonical: '/mentalnaya-arifmetika' }, openGraph: { type: 'website', locale: 'ru_RU', siteName: 'Разумейка', url: 'https://razumeyka-school.ru/mentalnaya-arifmetika', title: 'Ментальная арифметика для детей — Разумейка', description: 'Счёт в уме через интерактивный абакус и короткие уроки-игры.', images: [{ url: '/images/course-arithmetic.webp', width: 1200, height: 630, alt: 'Ментальная арифметика для детей' }] } };

const WHY_ICON = { count: '01', focus: '02', memory: '03', confidence: '04' };
const HOW_STEPS = [
  { n: '01', title: 'Видим число', text: 'Абстрактная цифра превращается в положение бусин. Ребёнок понимает состав числа, а не угадывает ответ.' },
  { n: '02', title: 'Двигаем бусины', text: 'Интерактивный абакус сразу проверяет действие. Можно пробовать, ошибаться и повторять без оценки и спешки.' },
  { n: '03', title: 'Считаем без опоры', text: 'Флеш-карты и короткие цепочки постепенно переносят образ абакуса в воображение.' },
];
const courseSchema = { '@context': 'https://schema.org', '@type': 'Course', name: 'Ментальная арифметика для детей', description: 'Самостоятельные уроки по ментальной арифметике для детей 4–10 лет.', provider: { '@type': 'Organization', name: 'Разумейка', url: 'https://razumeyka-school.ru' } };

export default async function MentalArithmeticPage() {
  const session = await getAuthSession();
  let hasSub = false;
  let accessUntilLabel = '';
  if (session?.user?.id) {
    await reconcileUserPayments(session.user.id);
    hasSub = await hasActiveAccess(session.user.id);
    const until = await getAccessUntil(session.user.id);
    if (until) accessUntilLabel = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(until);
  }

  return (
    <><Header />
      <main className="mental-page min-h-screen">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
        <section className="mental-hero px-5 pb-20 pt-28 sm:px-8 sm:pt-32 lg:px-14 lg:pb-28">
          <div className="container-pad px-0">
            <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_.98fr] lg:gap-16">
              <div>
                <span className="mental-eyebrow"><i /> Интерактивный курс · 4–10 лет</span>
                <h1 className="mental-hero-title mt-7">Счёт в уме начинается с <em>одного движения</em></h1>
                <div className="mt-7 max-w-[680px] space-y-3">{mentalIntro.lead.map((p, i) => <p key={i} className="mental-hero-lead">{p}</p>)}</div>
                <div className="mt-9 flex flex-wrap gap-3"><a href="#uroki" className="mental-primary-btn">Начать бесплатно <span>↗</span></a><a href="#metod" className="mental-ghost-btn">Как работает метод</a></div>
                <div className="mental-stats mt-10">{[['0 ₽','первые уроки'],['5–12 мин','один урок'],['без счётов','абакус на экране']].map(([v,l]) => <div key={l}><strong>{v}</strong><span>{l}</span></div>)}</div>
              </div>
              <div className="mental-demo-stage">
                <div className="mental-orbit mental-orbit-one">+1</div><div className="mental-orbit mental-orbit-two">−1</div><div className="mental-orbit mental-orbit-three">5+2</div>
                <div className="mental-demo-label"><span>Попробуйте прямо сейчас</span><b>Наберите число 7</b></div>
                <SorobanDemo />
                <div className="mental-trust-chip"><span>✓</span><div><b>Рабочий тренажёр</b><small>не декоративная анимация</small></div></div>
              </div>
            </div>
          </div>
        </section>

        <section className="mental-proof px-5 sm:px-8 lg:px-14"><div className="container-pad px-0"><div className="mental-proof-grid">{[['Число видно','Ребёнок видит 7 как пятёрку и две единицы.'],['Ответ проверяется','Абакус реагирует на каждое движение бусины.'],['Темп адаптируется','Младшим медленнее, школьникам быстрее.']].map(([t,p],i)=><div key={t}><span>0{i+1}</span><h3>{t}</h3><p>{p}</p></div>)}</div></div></section>

        <section id="metod" className="mental-section px-5 sm:px-8 lg:px-14"><div className="container-pad px-0">
          <div className="mental-section-head"><span>Метод за минуту</span><h2>От бусины —<br />к образу числа.</h2><p>Без обещаний «магии мозга». Только понятная последовательность: увидеть, сделать руками, удержать в памяти и решить.</p></div>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">{whatIsSteps.map((s,i)=><article key={s.title} className="mental-method-card"><span>0{i+1}</span><div className="mental-method-icon">{s.icon}</div><h3>{s.title}</h3><p>{s.text}</p></article>)}</div>
          <a href="/blog/chto-takoe-mentalnaya-arifmetika" className="mental-article-link">Подробно и честно о методике <span>↗</span></a>
        </div></section>

        <section id="pochemu" className="mental-section mental-benefits px-5 sm:px-8 lg:px-14"><div className="container-pad px-0">
          <div className="mental-section-head mental-section-head-light"><span>Результат занятий</span><h2>Навыки, которые работают<br />не только на математике.</h2></div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{whyBlocks.map((b)=><article key={b.title} className="mental-benefit-card"><span>{WHY_ICON[b.icon] ?? '•'}</span><h3>{b.title}</h3><p>{b.text}</p></article>)}</div>
          <p className="mental-honesty">Ментальная арифметика тренирует устный счёт, внимание и рабочую память. Мы не выдаём популярные обещания про «синхронизацию полушарий» за медицинский факт.</p>
        </div></section>

        <section className="mental-section px-5 sm:px-8 lg:px-14"><div className="container-pad px-0">
          <div className="mental-section-head"><span>Как проходит урок</span><h2>Коротко. Интерактивно.<br />С понятной победой.</h2></div>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">{HOW_STEPS.map((s)=><article key={s.n} className="mental-how-card"><span>{s.n}</span><div /><h3>{s.title}</h3><p>{s.text}</p></article>)}</div>
        </div></section>

        <section id="uroki" className="mental-section mental-course px-5 sm:px-8 lg:px-14"><div className="container-pad px-0">
          <div className="mental-section-head"><span>Программа</span><h2>От первой бусины<br />к счёту в воображении.</h2><p>Выберите возраст — мы настроим скорость. Дальше ребёнок идёт по дням и открывает следующий навык только после понятной практики.</p></div>
          <div className="mt-10"><MentalLessons hasSubscription={hasSub} /></div>
        </div></section>

        <section id="podpiska" className="px-5 pb-24 pt-10 sm:px-8 lg:px-14 lg:pb-32"><div className="container-pad px-0"><div className="mental-price-card">
          <div className="mental-price-copy"><span>Вся школа в одной подписке</span><h2>Регулярная практика<br />без репетитора и поездок</h2><p>Ментальная арифметика и рисование доступны вместе. Ребёнок занимается в удобное время, а прогресс остаётся на устройстве.</p><ul>{mentalSubscription.perks.map((perk)=><li key={perk}><i>✓</i>{perk}</li>)}</ul></div>
          <div className="mental-price-box"><p>Полный доступ</p><strong>{mentalSubscription.price}<small> ₽ / {mentalSubscription.period}</small></strong><span>Бесплатные уроки · без карты</span><SubscribeButton isLoggedIn={Boolean(session?.user?.id)} hasAccess={hasSub} accessUntil={accessUntilLabel} returnTo="/mentalnaya-arifmetika" /><small>Доступ открывается сразу на 30 дней</small></div>
        </div></div></section>
      </main><Footer /></>
  );
}
`;
await writeFile(file, content, 'utf8');
