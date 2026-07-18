import './mental.css';
import { Header } from '@/components/Header.jsx';
import { Footer } from '@/components/Footer.jsx';
import { MentalIntroAudio } from '@/components/mental/MentalIntroAudio.jsx';
import { MentalLessons } from '@/components/mental/MentalLessons.jsx';
import { SorobanDemo } from '@/components/mental/SorobanDemo.jsx';
import { SubscribeButton } from '@/components/drawing/SubscribeButton.jsx';
import { CourseDiscovery } from '@/components/CourseDiscovery.jsx';
import {
  mentalIntro,
  mentalSubscription,
  whyBlocks,
} from '@/data/mental-lessons.js';
import { getAuthSession } from '@/lib/auth';
import { reconcileUserPayments } from '@/lib/payments';
import { getAccessUntil, hasActiveAccess } from '@/lib/subscription';

export const metadata = {
  title: 'Ментальная арифметика для детей — счёт в уме онлайн',
  description: 'Премиальный онлайн-курс ментальной арифметики для детей 4–10 лет: интерактивный абакус, флеш-карты, устный счёт, внимание и память.',
  alternates: { canonical: '/mentalnaya-arifmetika' },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Разумейка',
    url: 'https://razumeyka-school.ru/mentalnaya-arifmetika',
    title: 'Лаборатория чисел — ментальная арифметика',
    description: 'Ребёнок сначала двигает бусины, затем видит числа в уме.',
    images: [{ url: '/images/mental/hero-abacus-mind.webp', width: 1200, height: 630, alt: 'Ментальная арифметика для детей' }],
  },
};

const HOW_STEPS = [
  { n: '01', title: 'Вижу число', text: 'Цифра превращается в образ на абакусе: пятёрка и единицы становятся понятной конструкцией.', tone: 'from-[#2C6BFF] to-[#51B6F3]' },
  { n: '02', title: 'Двигаю бусины', text: 'Ребёнок действует сам, сразу видит результат и спокойно исправляет неточное движение.', tone: 'from-[#7A59E8] to-[#B067E8]' },
  { n: '03', title: 'Считаю в уме', text: 'Флеш-карты и цепочки постепенно переносят знакомый образ бусин в воображение.', tone: 'from-[#13A97A] to-[#4BC6A3]' },
];

const GAME_FORMATS = [
  { icon: '◉', title: 'Живой абакус', text: 'Бусины двигаются на экране и отвечают на каждое действие.', label: 'руками' },
  { icon: '⚡', title: 'Флеш-карты', text: 'Число появляется на секунду — ребёнок учится видеть его целиком.', label: 'внимание' },
  { icon: '↗', title: 'Цепочки', text: 'Короткие серии сложения и вычитания с понятным темпом.', label: 'счёт' },
  { icon: '◆', title: 'Числовые игры', text: 'Собрать число, найти ошибку, догнать цель и открыть награду.', label: 'игра' },
  { icon: '◎', title: 'Счёт в уме', text: 'Воображаем бусины и решаем уже без подсказки на экране.', label: 'результат' },
];

const courseSchema = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'Лаборатория чисел — ментальная арифметика для детей',
  description: 'Самостоятельные интерактивные занятия по ментальной арифметике для детей 4–10 лет.',
  provider: { '@type': 'Organization', name: 'Разумейка', url: 'https://razumeyka-school.ru' },
  offers: {
    '@type': 'Offer',
    price: mentalSubscription.price,
    priceCurrency: 'RUB',
    availability: 'https://schema.org/InStock',
  },
};

export default async function MentalArithmeticPage() {
  const session = await getAuthSession();
  let hasSub = false;
  let accessUntilLabel = '';
  if (session?.user?.id) {
    await reconcileUserPayments(session.user.id);
    hasSub = await hasActiveAccess(session.user.id, 'mentalnaya-arifmetika');
    const until = await getAccessUntil(session.user.id, 'mentalnaya-arifmetika');
    if (until) {
      accessUntilLabel = new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(until);
    }
  }

  return (
    <>
      <Header />
      <main className="mental-page mental-v3 min-h-screen overflow-hidden bg-[#F7F9FC] text-ink">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />

        <section className="relative overflow-hidden bg-[#09152E] px-5 pb-24 pt-32 text-white sm:px-8 sm:pt-36 lg:px-14 lg:pb-28">
          <div className="pointer-events-none absolute -left-40 top-10 h-[520px] w-[520px] rounded-full bg-[#235CFF]/22 blur-[120px]" />
          <div className="pointer-events-none absolute -right-40 top-24 h-[560px] w-[560px] rounded-full bg-[#16C69A]/16 blur-[130px]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.055]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)', backgroundSize: '46px 46px' }} />
          <div className="container-pad relative px-0">
            <div className="grid items-center gap-14 lg:grid-cols-[.92fr_1.08fr] lg:gap-16">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.07] px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/72 backdrop-blur-xl">
                  <i className="h-2 w-2 rounded-full bg-[#52E0B5] shadow-[0_0_0_5px_rgba(82,224,181,.12)]" />
                  Лаборатория чисел · 4–10 лет
                </span>
                <h1 className="mt-7 max-w-[780px] font-display text-[46px] font-extrabold leading-[.98] tracking-[-0.06em] text-white sm:text-6xl lg:text-[76px]">
                  Сначала двигаем бусины.<br /><span className="bg-gradient-to-r from-[#56C7FF] via-[#75E5C1] to-[#FFD166] bg-clip-text text-transparent">Потом — числа в уме.</span>
                </h1>
                <p className="mt-7 max-w-[700px] text-base font-semibold leading-7 text-white/64 sm:text-lg sm:leading-8">
                  {mentalIntro.lead[0]} Интерактивный абакус превращает абстрактные цифры в понятные движения, а короткие игры постепенно ведут к настоящему устному счёту.
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <a href="#uroki" className="inline-flex min-h-[58px] items-center justify-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-extrabold text-[#09152E] shadow-[0_18px_46px_rgba(0,0,0,.24)] transition hover:-translate-y-1">
                    Открыть бесплатные уроки <span className="text-lg">→</span>
                  </a>
                  <MentalIntroAudio className="mental-audio-dark" src="/audio/mental/method/intro-hero-v1.mp3" />
                </div>
                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold text-white/46">
                  <span>✓ Без покупки счётов</span>
                  <span>✓ Без карты для старта</span>
                  <span>✓ 5–12 минут за урок</span>
                </div>
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute -inset-10 rounded-full bg-[#3B82F6]/18 blur-[70px]" />
                <div className="relative overflow-hidden rounded-[36px] border border-white/12 bg-white/[0.08] p-3 shadow-[0_42px_100px_rgba(0,0,0,.34)] backdrop-blur-2xl sm:p-5">
                  <div className="mb-3 flex items-center justify-between px-2 py-1">
                    <div className="flex gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-[#FF6B7A]" /><i className="h-2.5 w-2.5 rounded-full bg-[#FFD166]" /><i className="h-2.5 w-2.5 rounded-full bg-[#52E0B5]" /></div>
                    <span className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-white/42">Интерактивная лаборатория</span>
                  </div>
                  <SorobanDemo />
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {[['1', 'нижняя бусина'], ['5', 'верхняя бусина'], ['7', 'это 5 + 2']].map(([value, label]) => (
                      <div key={label} className="rounded-[16px] border border-white/9 bg-[#071126]/70 px-3 py-3 text-center">
                        <strong className="font-display text-xl font-extrabold text-[#75E5C1]">{value}</strong>
                        <span className="mt-1 block text-[8px] font-bold leading-3 text-white/42">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-14 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                ['200', 'игровых миссий', 'маршрут первого месяца', 'from-[#236BFF] to-[#45A9F4]'],
                ['1 000+', 'интерактивных заданий', 'двигать, считать, запоминать', 'from-[#7B59E8] to-[#B366E7]'],
                ['20', 'учебных дней', '4 недели без перегруза', 'from-[#E6942A] to-[#F4BE4B]'],
                ['3', 'урока бесплатно', 'без банковской карты', 'from-[#11A77B] to-[#42C9A3]'],
              ].map(([value, label, note, tone]) => (
                <article key={label} className={`relative overflow-hidden rounded-[24px] bg-gradient-to-br ${tone} p-5 shadow-[0_22px_55px_rgba(0,0,0,.18)] sm:p-6`}>
                  <div className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-white/18 blur-xl" />
                  <strong className="relative font-display text-[40px] font-extrabold leading-none tracking-[-0.06em] sm:text-[48px]">{value}</strong>
                  <p className="relative mt-2 text-sm font-extrabold">{label}</p>
                  <p className="relative mt-2 text-[10px] font-bold text-white/62">{note}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="metod" className="px-5 py-24 sm:px-8 lg:px-14 lg:py-32">
          <div className="container-pad px-0">
            <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr] lg:items-end">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-brand-blue">Метод без магии</span>
                <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.03] tracking-[-0.05em] sm:text-6xl">Три перехода — и число становится образом</h2>
                <p className="mt-5 text-base font-semibold leading-7 text-ink/56">Ребёнок не зубрит ответы. Он проходит понятный путь от движения рукой к внутренней картинке числа.</p>
                <a href="/blog/chto-takoe-mentalnaya-arifmetika" className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-brand-blue">Честно и подробно о методике ↗</a>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {HOW_STEPS.map((step) => (
                  <article key={step.n} className={`relative min-h-[300px] overflow-hidden rounded-[28px] bg-gradient-to-br ${step.tone} p-6 text-white shadow-color`}>
                    <span className="text-xs font-extrabold text-white/58">{step.n}</span>
                    <div className="mt-10 font-display text-4xl font-extrabold">{step.n === '01' ? '7' : step.n === '02' ? '●' : '7→'}</div>
                    <h3 className="mt-8 font-display text-2xl font-extrabold">{step.title}</h3>
                    <p className="mt-3 text-sm font-semibold leading-6 text-white/72">{step.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-24 sm:px-8 lg:px-14 lg:py-32">
          <div className="container-pad px-0">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-brand-purple">Не одно упражнение по кругу</span>
              <h2 className="mt-5 font-display text-4xl font-extrabold tracking-[-0.05em] sm:text-6xl">Пять форматов держат внимание ребёнка</h2>
              <p className="mt-5 text-base font-semibold leading-7 text-ink/54">Темп меняется внутри занятия: посмотреть, подвигать, запомнить, решить и выиграть маленький квест.</p>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {GAME_FORMATS.map((format, index) => (
                <article key={format.title} className="group min-h-[260px] rounded-[28px] border border-ink/7 bg-[#F8FAFD] p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-blue/18 hover:shadow-card">
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid h-14 w-14 place-items-center rounded-[19px] bg-[#09152E] font-display text-2xl font-extrabold text-white">{format.icon}</span>
                    <span className="text-[9px] font-extrabold text-ink/30">0{index + 1}</span>
                  </div>
                  <h3 className="mt-8 font-display text-xl font-extrabold">{format.title}</h3>
                  <p className="mt-3 text-sm font-semibold leading-6 text-ink/52">{format.text}</p>
                  <span className="mt-6 inline-flex rounded-full bg-brand-blue/8 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-brand-blue">{format.label}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#09152E] px-5 py-24 text-white sm:px-8 lg:px-14 lg:py-32">
          <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-[#16C69A]/14 blur-[110px]" />
          <div className="container-pad relative px-0">
            <div className="max-w-4xl">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#75E5C1]">Что растёт вместе со счётом</span>
              <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.03] tracking-[-0.05em] sm:text-6xl">Не только скорость. Спокойная сила мышления.</h2>
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {whyBlocks.map((block, index) => (
                <article key={block.title} className="min-h-[250px] rounded-[28px] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-xl">
                  <span className="font-display text-xs font-extrabold text-[#75E5C1]">0{index + 1}</span>
                  <h3 className="mt-12 font-display text-xl font-extrabold">{block.title}</h3>
                  <p className="mt-3 text-sm font-semibold leading-6 text-white/52">{block.text}</p>
                </article>
              ))}
            </div>
            <p className="mt-7 max-w-3xl text-xs font-semibold leading-6 text-white/34">Ментальная арифметика не волшебная таблетка. Результат появляется через короткую регулярную практику — поэтому курс построен днями, а не случайным набором упражнений.</p>
          </div>
        </section>

        <section id="uroki" className="scroll-mt-24 bg-gradient-to-b from-[#EAF2FF] to-[#F7F9FC] px-5 py-24 sm:px-8 lg:px-14 lg:py-32">
          <div className="container-pad px-0">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="max-w-4xl">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-brand-blue">Полный маршрут первого месяца</span>
                <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.02] tracking-[-0.05em] sm:text-6xl">20 дней. 200 миссий. Более 1 000 игровых заданий.</h2>
                <p className="mt-5 max-w-3xl text-base font-semibold leading-7 text-ink/56">В каждом учебном дне — 10 разных миссий и около 50 действий ребёнка: абакус, память, сравнение, последовательности, цепочки и игровые финалы.</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[[20, 'дней'], [200, 'миссий'], ['1 000+', 'заданий']].map(([value, label]) => (
                  <div key={label} className="min-w-[100px] rounded-[20px] bg-white px-4 py-4 text-center shadow-card">
                    <strong className="font-display text-3xl font-extrabold text-brand-blue">{value}</strong>
                    <span className="mt-1 block text-[9px] font-extrabold text-ink/42">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-12"><MentalLessons hasSubscription={hasSub} /></div>
          </div>
        </section>

        <section className="px-5 py-24 sm:px-8 lg:px-14 lg:py-28">
          <div className="container-pad px-0">
            <div className="overflow-hidden rounded-[36px] border border-ink/7 bg-white p-7 shadow-luxe sm:p-10 lg:p-14">
              <div className="grid gap-10 lg:grid-cols-[.86fr_1.14fr] lg:items-center">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-brand-green">Родителю не нужно преподавать</span>
                  <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.03] tracking-[-0.05em] sm:text-5xl">Курс ведёт ребёнка. Вы замечаете прогресс.</h2>
                  <p className="mt-5 text-base font-semibold leading-7 text-ink/56">На экране есть объяснение, действие и проверка. После урока остаётся короткий результат, который легко обсудить без допроса и оценок.</p>
                </div>
                <div className="grid gap-3">
                  {[
                    ['01', 'Сел и начал', 'Не нужны распечатки, счёты и подготовка материалов.'],
                    ['02', 'Получил подсказку', 'Ошибка не обрывает занятие — ребёнок видит следующий понятный шаг.'],
                    ['03', 'Увидел победу', 'Прогресс сохраняется, а следующий урок продолжает знакомый маршрут.'],
                  ].map(([number, title, text]) => (
                    <article key={number} className="flex gap-4 rounded-[22px] bg-[#F5F8FD] p-5">
                      <span className="font-display text-xs font-extrabold text-brand-blue">{number}</span>
                      <div><h3 className="font-display text-lg font-extrabold">{title}</h3><p className="mt-1 text-sm font-semibold leading-6 text-ink/50">{text}</p></div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="podpiska" className="scroll-mt-24 px-5 pb-24 sm:px-8 lg:px-14 lg:pb-32">
          <div className="container-pad px-0">
            <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#09152E] via-[#142B52] to-[#174C51] p-6 text-white shadow-luxe sm:p-10 lg:p-14">
              <div className="pointer-events-none absolute -right-20 -top-28 h-96 w-96 rounded-full bg-[#38D7AA]/18 blur-[100px]" />
              <div className="relative grid gap-10 lg:grid-cols-[1.1fr_.7fr] lg:items-center">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#75E5C1]">30 дней доступа</span>
                  <h2 className="mt-5 max-w-3xl font-display text-4xl font-extrabold leading-[1.02] tracking-[-0.05em] sm:text-6xl">Целый месяц числовых приключений</h2>
                  <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-white/62">Маршрут из 200 игровых миссий и более 1 000 интерактивных заданий. Включена дополнительная Ступень 0 для уверенного старта.</p>
                  <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                    {mentalSubscription.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-3 rounded-[18px] border border-white/9 bg-white/[0.06] px-4 py-3.5 text-sm font-semibold leading-6 text-white/74">
                        <i className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#52D6AD] text-[10px] not-italic text-[#09152E]">✓</i>{perk}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-[30px] bg-white p-6 text-ink shadow-[0_30px_80px_rgba(0,0,0,.3)] sm:p-8">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-brand-blue">Стоимость доступа</p>
                  <div className="mt-4 flex items-end gap-2">
                    <strong className="font-display text-6xl font-extrabold tracking-[-0.06em]">{mentalSubscription.price}</strong>
                    <span className="pb-2 text-lg font-extrabold text-ink/44">₽</span>
                  </div>
                  <p className="mt-2 text-sm font-bold text-ink/46">на 30 дней · без автосписания</p>
                  <div className="my-6 h-px bg-ink/8" />
                  <div className="space-y-3 text-sm font-semibold text-ink/62">
                    <p className="flex justify-between gap-4"><span>Маршрут месяца</span><strong className="text-ink">200 миссий</strong></p>
                    <p className="flex justify-between gap-4"><span>Игровая практика</span><strong className="text-ink">1 000+ заданий</strong></p>
                    <p className="flex justify-between gap-4"><span>Бесплатный старт</span><strong className="text-brand-green">3 урока</strong></p>
                  </div>
                  <SubscribeButton isLoggedIn={Boolean(session?.user?.id)} hasAccess={hasSub} accessUntil={accessUntilLabel} returnTo="/mentalnaya-arifmetika" />
                  <p className="mt-4 text-center text-[11px] font-semibold leading-5 text-ink/38">Доступ открывается сразу после оплаты. Автоматического продления нет.</p>
                </div>
              </div>
            </div>
            <CourseDiscovery current="mentalnaya-arifmetika" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
