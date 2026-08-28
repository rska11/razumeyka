import { canonical } from '@/lib/seo';
import { Header } from '@/components/Header.jsx';
import { Footer } from '@/components/Footer.jsx';
import { TrackedLink } from '@/components/analytics/TrackedLink.jsx';
import { MultiplicationTrainer } from '@/components/multiplication/MultiplicationTrainer.jsx';
import { SubscribeButton } from '@/components/drawing/SubscribeButton.jsx';
import { multiplicationBenefits, multiplicationStages } from '@/data/multiplication-course.js';
import { getAuthSession } from '@/lib/auth';
import { reconcileUserPayments } from '@/lib/payments';
import { prisma } from '@/lib/prisma';
import { directionPrice, getAccessUntil, hasActiveAccess } from '@/lib/subscription';

const PRIMARY_DIRECTION = 'mentalnaya-arifmetika';
const INCLUDED_DIRECTIONS = ['mentalnaya-arifmetika', 'podgotovka-k-shkole'];
const MENTAL_PRICE = directionPrice(PRIMARY_DIRECTION);
const SCHOOL_PRICE = directionPrice('podgotovka-k-shkole');

export const metadata = {
  title: 'Приложение «Таблица умножения» — онлайн-тренажёр для детей',
  description: 'Приложение для изучения таблицы умножения, которое работает прямо в браузере — без скачивания и установки. Тренажёр умножения для детей 6–10 лет: смысл действия, таблицы 2–9, деление, задачи и повторение сложных примеров.',
  keywords: [
    'приложение таблица умножения',
    'таблица умножения онлайн',
    'тренажёр умножения',
    'таблица умножения тренажёр',
    'выучить таблицу умножения',
    'умножение для детей онлайн',
  ],
  alternates: canonical('/trenazher-umnozheniya'),
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Знайтон',
    url: 'https://znayton.ru/trenazher-umnozheniya',
    title: 'Таблица умножения без зубрёжки — приложение-тренажёр Знайтон',
    description: 'Работает в браузере без скачивания: ребёнок понимает умножение, тренирует слабые примеры и видит свой прогресс.',
  },
};

const FAQ = [
  ['Это приложение? Нужно ли что-то скачивать?', 'Скачивать и устанавливать ничего не нужно: приложение для изучения таблицы умножения работает прямо в браузере — на компьютере, планшете и телефоне. Страницу можно добавить на главный экран, и тренажёр будет открываться как обычное приложение.'],
  ['С какого возраста подходит тренажёр?', 'Оптимально с 6–7 лет, когда ребёнок уверенно считает и понимает сложение. Начальные маршруты объясняют смысл умножения через предметы и одинаковые группы.'],
  ['Нужно ли сначала выучить таблицу?', 'Нет. Тренажёр сначала помогает понять действие, затем показывает удобные стратегии и только после этого переводит примеры в быстрое узнавание.'],
  ['Что доступно бесплатно?', 'Без регистрации открыты два маршрута: смысл умножения и таблица на 2. Они позволяют проверить формат до оплаты.'],
  ['Какая покупка открывает тренажёр?', 'Полный тренажёр открывается при покупке любого одного курса: ментальной арифметики или подготовки к школе. Покупка ментальной арифметики даёт доступ к менталке и тренажёру; покупка подготовки к школе — к подготовке и тренажёру. Сами курсы продаются отдельно: один курс не открывает другой.'],
  ['Есть ли автоматическое списание?', 'Нет. Доступ продлевается только вручную: 30 дней с курсом ментальной арифметики или 45 дней с курсом подготовки к школе.'],
];

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://znayton.ru' },
    { '@type': 'ListItem', position: 2, name: 'Ментальная арифметика', item: 'https://znayton.ru/mentalnaya-arifmetika' },
    { '@type': 'ListItem', position: 3, name: 'Тренажёр умножения', item: 'https://znayton.ru/trenazher-umnozheniya' },
  ],
};

const courseSchema = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'Таблица умножения без зубрёжки',
  description: 'Интерактивная программа освоения таблицы умножения для детей 6–10 лет: смысл действия, стратегии, деление, задачи и адаптивное повторение.',
  provider: { '@type': 'Organization', name: 'Знайтон', url: 'https://znayton.ru' },
  offers: [
    { '@type': 'Offer', name: 'Ментальная арифметика + тренажёр умножения', price: MENTAL_PRICE, priceCurrency: 'RUB', availability: 'https://schema.org/InStock' },
    { '@type': 'Offer', name: 'Подготовка к школе + тренажёр умножения', price: SCHOOL_PRICE, priceCurrency: 'RUB', availability: 'https://schema.org/InStock' },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(([question, answer]) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
};

function MultiplicationBoard() {
  const rows = [
    [2, 4, 6, 8, 10],
    [3, 6, 9, 12, 15],
    [5, 10, 15, 20, 25],
  ];
  return (
    <div className="relative overflow-hidden rounded-[36px] border border-white/14 bg-white/[0.075] p-5 shadow-[0_42px_100px_rgba(0,0,0,.32)] backdrop-blur-2xl sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#75E5C1]">Карта примеров</p>
          <p className="mt-1 font-display text-xl font-extrabold text-white">Каждый ответ становится увереннее</p>
        </div>
        <span className="rounded-full bg-[#75E5C1] px-3 py-2 text-[9px] font-extrabold text-[#09283A]">живой прогресс</span>
      </div>
      <div className="mt-6 grid gap-3">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-[44px_repeat(5,1fr)] gap-2">
            <span className="grid h-11 place-items-center rounded-[13px] bg-white/12 text-sm font-extrabold text-white">×{rowIndex === 0 ? 2 : rowIndex === 1 ? 3 : 5}</span>
            {row.map((value, index) => <span key={value} className={`grid h-11 place-items-center rounded-[13px] text-sm font-extrabold ${index < 2 + rowIndex ? 'bg-[#75E5C1] text-[#09283A]' : 'border border-white/10 bg-white/[0.055] text-white/42'}`}>{value}</span>)}
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-[22px] border border-[#FFD166]/20 bg-[#FFD166]/10 p-5">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#FFD166]">Сегодня тренируем</p>
        <div className="mt-3 flex items-center justify-between gap-4">
          <strong className="font-display text-3xl font-extrabold text-white">6 × 7</strong>
          <span className="text-sm font-bold text-white/58">5 × 7 + ещё 7</span>
          <strong className="font-display text-3xl font-extrabold text-[#FFD166]">42</strong>
        </div>
      </div>
    </div>
  );
}

export default async function MultiplicationTrainerPage() {
  const session = await getAuthSession();
  let hasAccess = false;
  let mentalHasAccess = false;
  let schoolHasAccess = false;
  let mentalAccessUntilLabel = '';
  let schoolAccessUntilLabel = '';
  let children = [];
  if (session?.user?.id) {
    await reconcileUserPayments(session.user.id);
    const [accessStates, childRows] = await Promise.all([
      Promise.all(INCLUDED_DIRECTIONS.map((direction) => hasActiveAccess(session.user.id, direction))),
      prisma.child.findMany({ where: { parentId: session.user.id }, orderBy: { createdAt: 'asc' }, select: { id: true, name: true } }),
    ]);
    children = childRows;
    hasAccess = accessStates.some(Boolean);
    [mentalHasAccess, schoolHasAccess] = accessStates;
    const accessDates = await Promise.all(INCLUDED_DIRECTIONS.map((direction) => getAccessUntil(session.user.id, direction)));
    const formatAccess = (date) => date ? new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(date) : '';
    mentalAccessUntilLabel = formatAccess(accessDates[0]);
    schoolAccessUntilLabel = formatAccess(accessDates[1]);
  }

  return (
    <>
      <Header primaryHref="#trenazher" primaryLabel="Попробовать бесплатно" primaryGoal="multiplication_header_click" />
      <main className="min-h-screen overflow-hidden bg-[#F7F9FC] text-ink">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

        <section className="relative overflow-hidden bg-[#09152E] px-5 pb-20 pt-32 text-white sm:px-8 sm:pt-36 lg:px-14 lg:pb-28">
          <div className="pointer-events-none absolute -left-40 top-0 h-[540px] w-[540px] rounded-full bg-[#3978F6]/22 blur-[120px]" />
          <div className="pointer-events-none absolute -right-40 top-20 h-[560px] w-[560px] rounded-full bg-[#10A77A]/17 blur-[130px]" />
          <div className="container-pad relative px-0">
            <div className="grid items-center gap-12 lg:grid-cols-[.96fr_1.04fr] lg:gap-16">
              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex rounded-full border border-white/12 bg-white/[0.07] px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.17em] text-[#9AECD3]">Тренажёр умножения · 6–10 лет</span>
                  <span className="inline-flex rounded-full border border-[#FFD166]/24 bg-[#FFD166]/10 px-4 py-2 text-[10px] font-extrabold text-[#FFD166]">Включён в любой один выбранный курс</span>
                </div>
                <h1 className="mt-7 max-w-[760px] font-display text-[40px] font-extrabold leading-[1] tracking-[-0.055em] sm:text-6xl lg:text-[72px]">
                  Таблица умножения <span className="bg-gradient-to-r from-[#66B6FF] via-[#75E5C1] to-[#FFD166] bg-clip-text text-transparent">без скучной зубрёжки</span>
                </h1>
                <p className="mt-7 max-w-[690px] text-base font-semibold leading-7 text-white/66 sm:text-lg sm:leading-8">Приложение для изучения таблицы умножения, которое открывается прямо в браузере — скачивать и устанавливать ничего не нужно. Ребёнок сначала понимает одинаковые группы и удобные стратегии, затем тренирует таблицы 2–9, деление и задачи. Слабые примеры возвращаются чаще — освоенные не мешают двигаться дальше.</p>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <TrackedLink goal="multiplication_hero_start" href="#trenazher" className="inline-flex min-h-[58px] items-center justify-center rounded-full bg-[#75E5C1] px-7 py-4 text-sm font-extrabold text-[#09152E] shadow-[0_18px_46px_rgba(65,220,175,.22)] transition hover:-translate-y-1">Попробовать 2 маршрута бесплатно →</TrackedLink>
                  <TrackedLink goal="multiplication_hero_program" href="#programma" className="inline-flex min-h-[58px] items-center justify-center rounded-full border border-white/15 bg-white/8 px-7 py-4 text-sm font-extrabold text-white transition hover:-translate-y-1 hover:bg-white/12">Посмотреть программу</TrackedLink>
                </div>
                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold text-white/46">
                  <span>✓ Работает в браузере, без скачивания</span><span>✓ Без регистрации для старта</span><span>✓ Прогресс каждого примера</span><span>✓ Без автосписания</span>
                </div>
              </div>
              <MultiplicationBoard />
            </div>
            <div className="mt-14 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                ['12', 'учебных маршрутов', 'от смысла до задач'],
                ['2–9', 'вся таблица умножения', '80 сочетаний, повторения без лимита'],
                ['186+', 'заданий в программе', 'и повторения без лимита'],
                ['2', 'маршрута бесплатно', 'без банковской карты'],
              ].map(([value, label, note]) => <article key={label} className="rounded-[22px] border border-white/10 bg-white/[0.065] p-5 backdrop-blur-xl"><strong className="font-display text-4xl font-extrabold text-[#75E5C1]">{value}</strong><p className="mt-2 text-sm font-extrabold">{label}</p><p className="mt-1 text-[10px] font-bold text-white/42">{note}</p></article>)}
            </div>
          </div>
        </section>

        <section id="trenazher" className="scroll-mt-24 px-5 py-20 sm:px-8 lg:px-14 lg:py-28">
          <div className="container-pad px-0">
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-brand-blue">Можно начать прямо сейчас</span>
              <h2 className="mt-5 font-display text-4xl font-extrabold tracking-[-0.045em] sm:text-6xl">Тренажёр запоминает, что ребёнок уже умеет</h2>
              <p className="mt-5 text-base font-semibold leading-7 text-ink/56 sm:text-lg">Выберите первый маршрут. После каждого ответа карта навыка обновляется, а слабые примеры получают дополнительное повторение.</p>
            </div>
            <MultiplicationTrainer hasAccess={hasAccess} children={children} isLoggedIn={Boolean(session?.user?.id)} />
          </div>
        </section>

        <section id="programma" className="scroll-mt-24 bg-[#0D1936] px-5 py-20 text-white sm:px-8 lg:px-14 lg:py-28">
          <div className="container-pad px-0">
            <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#75E5C1]">Не тренировка ради скорости</span>
                <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.03] tracking-[-0.045em] sm:text-6xl">Четыре слоя настоящего навыка</h2>
                <p className="mt-5 text-base font-semibold leading-7 text-white/56">Быстрый ответ появляется в конце пути. Сначала ребёнку нужно увидеть смысл действия и научиться восстанавливать забытый результат.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {multiplicationBenefits.map(([title, text], index) => <article key={title} className="rounded-[24px] border border-white/9 bg-white/[0.055] p-6"><span className="text-xs font-extrabold text-[#75E5C1]">0{index + 1}</span><h3 className="mt-7 font-display text-xl font-extrabold">{title}</h3><p className="mt-3 text-sm font-semibold leading-6 text-white/54">{text}</p></article>)}
              </div>
            </div>
            <div className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {multiplicationStages.map((stage) => <article key={stage.id} className="rounded-[22px] border border-white/9 bg-white/[0.045] p-5"><div className="flex items-center justify-between"><span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#75E5C1]">Маршрут {stage.number}</span>{stage.free && <span className="rounded-full bg-[#75E5C1] px-2.5 py-1 text-[8px] font-extrabold text-[#09283A]">бесплатно</span>}</div><h3 className="mt-4 font-display text-xl font-extrabold">{stage.title}</h3><p className="mt-2 text-xs font-semibold leading-5 text-white/48">{stage.description}</p></article>)}
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 lg:px-14 lg:py-28">
          <div className="container-pad px-0">
            <div className="grid gap-6 lg:grid-cols-4">
              {[
                ['Не заставляет начинать заново', 'Освоенные примеры появляются реже, чтобы ребёнок тратил время на то, что пока не получается.'],
                ['Объясняет после ошибки', 'Тренажёр показывает группу, стратегию или обратное действие — не ограничивается красным крестиком.'],
                ['Не гонит секундомером', 'Скорость подключается после понимания. На первых маршрутах важен ход мысли, а не рекорд.'],
                ['Показывает результат родителю', 'На карте сразу видно, какие таблицы уже закреплены и какие примеры нужно повторить.'],
              ].map(([title, text], index) => <article key={title} className="min-h-[230px] rounded-[28px] border border-ink/7 bg-white p-6 shadow-card"><span className="font-display text-sm font-extrabold text-brand-blue">0{index + 1}</span><h3 className="mt-10 font-display text-xl font-extrabold">{title}</h3><p className="mt-3 text-sm font-semibold leading-6 text-ink/52">{text}</p></article>)}
            </div>
          </div>
        </section>

        <section id="dostup" className="scroll-mt-24 px-5 pb-20 sm:px-8 lg:px-14 lg:pb-28">
          <div className="container-pad px-0">
            <div className="relative overflow-hidden rounded-[38px] bg-gradient-to-br from-[#13264D] via-[#293A78] to-[#176C6C] p-6 text-white shadow-luxe sm:p-10 lg:p-14">
              <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-[#3978F6]/24 blur-[100px]" />
              <div className="relative grid gap-10 lg:grid-cols-[.82fr_1.18fr] lg:items-center">
                <div>
                  <span className="inline-flex rounded-full border border-[#75E5C1]/20 bg-[#75E5C1]/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.17em] text-[#9AECD3]">Открывается с любым из двух курсов</span>
                  <h2 className="mt-6 max-w-3xl font-display text-4xl font-extrabold leading-[1.02] tracking-[-0.05em] sm:text-6xl">Выберите один курс — тренажёр будет включён</h2>
                  <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-white/64 sm:text-lg">Ментальная арифметика и подготовка к школе — два самостоятельных курса. Покупка менталки открывает менталку + тренажёр умножения. Покупка подготовки открывает подготовку + тот же тренажёр. Второй курс не открывается и приобретается отдельно.</p>
                  <div className="mt-5 max-w-2xl rounded-[18px] border border-[#FFD166]/22 bg-[#FFD166]/10 px-5 py-4 text-sm font-extrabold leading-6 text-[#FFE19A]">Важно: это не объединённый пакет из двух курсов. Общим для них является только тренажёр умножения.</div>
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {['Все таблицы от 2 до 9', 'Умножение, деление и задачи', 'Адаптивное повторение ошибок', 'Прогресс каждого примера'].map((perk) => <div key={perk} className="flex items-start gap-3 rounded-[18px] border border-white/10 bg-white/[0.07] px-4 py-3.5 text-sm font-bold text-white/76"><span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#75E5C1] text-[10px] text-[#09283A]">✓</span>{perk}</div>)}
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <article className="rounded-[28px] bg-white p-6 text-ink shadow-[0_30px_80px_rgba(0,0,0,.25)]">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-green">Отдельный курс №1</p>
                    <h3 className="mt-3 font-display text-2xl font-extrabold">Ментальная арифметика</h3>
                    <p className="mt-2 min-h-[48px] text-xs font-semibold leading-5 text-ink/48">Абакус, устный счёт и полный тренажёр умножения.</p>
                    <del className="mt-5 block text-sm font-extrabold text-ink/28">1 490 ₽</del>
                    <div className="mt-1 flex items-end gap-2"><strong className="font-display text-5xl font-extrabold tracking-[-0.06em]">{MENTAL_PRICE}</strong><span className="pb-1.5 text-base font-extrabold text-ink/44">₽</span></div>
                    <SubscribeButton isLoggedIn={Boolean(session?.user?.id)} hasAccess={mentalHasAccess} accessUntil={mentalAccessUntilLabel} returnTo="/mentalnaya-arifmetika" loginCallback="/trenazher-umnozheniya#dostup" buttonLabel={`Выбрать менталку · ${MENTAL_PRICE} ₽`} />
                  </article>
                  <article className="rounded-[28px] bg-white p-6 text-ink shadow-[0_30px_80px_rgba(0,0,0,.25)]">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-purple">Отдельный курс №2</p>
                    <h3 className="mt-3 font-display text-2xl font-extrabold">Подготовка к школе</h3>
                    <p className="mt-2 min-h-[48px] text-xs font-semibold leading-5 text-ink/48">Чтение, речь, логика, письмо и полный тренажёр умножения.</p>
                    <del className="mt-5 block text-sm font-extrabold text-ink/28">1 490 ₽</del>
                    <div className="mt-1 flex items-end gap-2"><strong className="font-display text-5xl font-extrabold tracking-[-0.06em]">{SCHOOL_PRICE}</strong><span className="pb-1.5 text-base font-extrabold text-ink/44">₽</span></div>
                    <SubscribeButton isLoggedIn={Boolean(session?.user?.id)} hasAccess={schoolHasAccess} accessUntil={schoolAccessUntilLabel} returnTo="/podgotovka-k-shkole" loginCallback="/trenazher-umnozheniya#dostup" buttonLabel={`Выбрать подготовку · ${SCHOOL_PRICE} ₽`} />
                  </article>
                  <p className="text-center text-[11px] font-semibold leading-5 text-white/48 md:col-span-2">Вы покупаете только выбранный курс. Второй курс не откроется. Продление — вручную, без автосписания.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 pb-24 sm:px-8 lg:px-14 lg:pb-32">
          <div className="container-pad px-0">
            <div className="mx-auto max-w-3xl text-center"><span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-brand-blue">Вопросы родителей</span><h2 className="mt-5 font-display text-4xl font-extrabold sm:text-5xl">Коротко о тренажёре</h2></div>
            <div className="mx-auto mt-10 grid max-w-4xl gap-3">
              {FAQ.map(([question, answer]) => <details key={question} className="group rounded-[22px] border border-ink/7 bg-white p-5 shadow-sm open:shadow-card"><summary className="cursor-pointer list-none pr-8 font-display text-lg font-extrabold">{question}<span className="float-right text-brand-blue transition group-open:rotate-45">＋</span></summary><p className="mt-4 max-w-3xl text-sm font-semibold leading-6 text-ink/56">{answer}</p></details>)}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
