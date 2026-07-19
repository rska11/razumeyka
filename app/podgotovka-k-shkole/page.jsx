import { Header } from '@/components/Header.jsx';
import { Footer } from '@/components/Footer.jsx';
import { SchoolPrepAdventure } from '@/components/school-prep/SchoolPrepAdventure.jsx';
import { SchoolPrepIntroAudio } from '@/components/school-prep/SchoolPrepIntroAudio.jsx';
import { SchoolPrepQuickDemo } from '@/components/school-prep/SchoolPrepQuickDemo.jsx';
import { SubscribeButton } from '@/components/drawing/SubscribeButton.jsx';
import { CourseDiscovery } from '@/components/CourseDiscovery.jsx';
import { schoolPrepProgram, schoolPrepWeekOne } from '@/data/school-prep-course.js';
import { getAuthSession } from '@/lib/auth';
import { reconcileUserPayments } from '@/lib/payments';
import { directionPrice, getAccessUntil, hasActiveAccess } from '@/lib/subscription';

const SCHOOL_PREP_DIRECTION = 'podgotovka-k-shkole';
const SCHOOL_PREP_PRICE = directionPrice(SCHOOL_PREP_DIRECTION);

export const metadata = {
  title: 'Подготовка к школе 5–7 лет — курс-игра онлайн',
  description:
    'Умная подготовка к школе в формате приключения: речь, чтение, счёт, логика, внимание, графомоторика и уверенность. Первый полноценный игровой день доступен бесплатно.',
  alternates: { canonical: '/podgotovka-k-shkole' },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Разумейка',
    url: 'https://razumeyka-school.ru/podgotovka-k-shkole',
    title: 'Подготовка к школе 5–7 лет — игровой онлайн-курс',
    description: 'Чтение, счёт, логика, внимание и подготовка руки к письму в коротких игровых занятиях по 20–25 минут.',
    images: [{ url: '/images/og.png', width: 1200, height: 630, alt: 'Подготовка к школе — Разумейка' }],
  },
};

const principleIcons = {
  map: '⌁',
  star: '★',
  move: '↗',
  heart: '♥',
};

const principleStyles = [
  'from-brand-blue/12 to-brand-cyan/5 text-brand-blue',
  'from-brand-pink/12 to-brand-purple/5 text-brand-pink',
  'from-brand-orange/14 to-brand-yellow/5 text-brand-orange',
  'from-brand-green/12 to-brand-cyan/5 text-brand-green',
];

const weekStyles = {
  blue: 'border-brand-blue/18 bg-brand-blue/[0.045] text-brand-blue',
  pink: 'border-brand-pink/18 bg-brand-pink/[0.045] text-brand-pink',
  orange: 'border-brand-orange/18 bg-brand-orange/[0.05] text-brand-orange',
  purple: 'border-brand-purple/18 bg-brand-purple/[0.045] text-brand-purple',
  green: 'border-brand-green/18 bg-brand-green/[0.045] text-brand-green',
  cyan: 'border-brand-cyan/18 bg-brand-cyan/[0.045] text-brand-cyan',
  yellow: 'border-brand-yellow/18 bg-brand-yellow/[0.05] text-brand-yellow',
};

const skills = [
  { icon: 'А', title: 'Речь и чтение', text: 'Слышать звуки, собирать слоги, понимать смысл и рассказывать своими словами.', color: 'bg-brand-pink/10 text-brand-pink' },
  { icon: '7', title: 'Числа и логика', text: 'Не угадывать, а замечать связи, сравнивать и объяснять ход мысли.', color: 'bg-brand-orange/10 text-brand-orange' },
  { icon: '◎', title: 'Внимание и память', text: 'Удерживать инструкцию, переключаться и спокойно проверять себя.', color: 'bg-brand-purple/10 text-brand-purple' },
  { icon: '✎', title: 'Готовая к письму рука', text: 'Линия, клетка, ритм и координация — без скучных прописей и перегруза.', color: 'bg-brand-blue/10 text-brand-blue' },
  { icon: '↗', title: 'Самостоятельность', text: 'Понять задачу, составить план, закончить начатое и попросить помощь.', color: 'bg-brand-cyan/10 text-brand-cyan' },
  { icon: '♥', title: 'Спокойная уверенность', text: 'Ошибка становится подсказкой, а новое задание — интересной пробой сил.', color: 'bg-brand-green/10 text-brand-green' },
];

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://razumeyka-school.ru' },
    { '@type': 'ListItem', position: 2, name: 'Подготовка к школе', item: 'https://razumeyka-school.ru/podgotovka-k-shkole' },
  ],
};

const courseSchema = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'Подготовка к школе 5–7 лет — «Экспедиция в Город знаний»',
  description: 'Игровой онлайн-курс подготовки к школе для детей 5–7 лет: речь, чтение, счёт, логика, внимание и уверенность.',
  provider: { '@type': 'Organization', name: 'Разумейка', url: 'https://razumeyka-school.ru' },
  educationalLevel: 'Дошкольное образование',
  timeRequired: 'P12W',
  inLanguage: 'ru',
  offers: {
    '@type': 'Offer',
    price: SCHOOL_PREP_PRICE,
    priceCurrency: 'RUB',
    availability: 'https://schema.org/InStock',
  },
};

const heroSkills = [
    ['АБ', 'Чтение и речь', 'Звуки, слоги, первые слова и пересказ', 'from-[#FFE5F0] to-[#FFF4F8]', 'bg-[#F05A91]', 'text-[#C83772]'],
    ['1+2', 'Счёт и числа', 'Сравнение, состав числа и устный счёт', 'from-[#FFF0D6] to-[#FFF8E9]', 'bg-[#F3A62E]', 'text-[#B66C08]'],
    ['◎', 'Логика и внимание', 'Закономерности, память и точность', 'from-[#EAE5FF] to-[#F6F3FF]', 'bg-[#7658DF]', 'text-[#5940B5]'],
    ['✎', 'Подготовка к письму', 'Линии, клетка, ритм и координация', 'from-[#DFF3FF] to-[#F0FAFF]', 'bg-[#368FDC]', 'text-[#216CAD]'],
    ['↗', 'Самостоятельность', 'Инструкция, план и завершение задания', 'from-[#DDF8F0] to-[#EFFCF8]', 'bg-[#20A97E]', 'text-[#147A5B]'],
    ['×2', 'Первые шаги к умножению', 'Пары, равные группы и счёт двойками', 'from-[#FFE8D9] to-[#FFF6EF]', 'bg-[#F27B42]', 'text-[#B94D1C]'],
];

function CityMap() {
  return (
    <div className="relative mx-auto h-full w-full max-w-[680px]" aria-label="Иллюстрированная карта Города знаний">
      <div className="pointer-events-none absolute -inset-8 rounded-full bg-gradient-to-br from-brand-blue/16 via-brand-purple/12 to-brand-pink/14 blur-3xl" />
      <div className="relative aspect-[3/2] overflow-hidden rounded-[34px] border border-white/80 bg-white shadow-luxe sm:rounded-[42px] lg:h-full lg:min-h-[470px] lg:aspect-auto">
        <img
          src="/images/school-prep/city-of-knowledge-hero.webp"
          alt="Лисёнок Искра приглашает ребёнка в Город знаний"
          className="h-full w-full object-cover object-left"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0c1930]/46 via-transparent to-white/5" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 sm:bottom-6 sm:left-6 sm:right-6">
          <div className="rounded-[18px] border border-white/28 bg-[#0b1930]/68 px-4 py-3 text-white shadow-card backdrop-blur-xl">
            <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-white/58">Проводник экспедиции</p>
            <p className="mt-1 font-display text-lg font-extrabold">Лисёнок Искра</p>
          </div>
          <div className="rounded-[18px] border border-white/38 bg-[#FFF6CF]/92 px-3 py-2 text-center shadow-card backdrop-blur-xl">
            <span className="text-2xl" aria-hidden="true">🔑</span>
            <p className="text-[8px] font-extrabold uppercase tracking-[0.12em] text-ink/56">Награда недели</p>
          </div>
        </div>
      </div>
      <div className={'hidden'}>
        <div className={'pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-brand-purple/12 blur-3xl'} />
        <div className={'relative flex items-end justify-between gap-4'}>
          <div>
            <p className={'text-[10px] font-extrabold uppercase tracking-[0.18em] text-brand-purple'}>Результат программы</p>
            <h2 className={'mt-2 max-w-[470px] font-display text-2xl font-extrabold leading-[1.05] tracking-[-0.035em] text-ink sm:text-[28px]'}>
              6 навыков для уверенного старта в школе
            </h2>
          </div>
          <span className={'hidden shrink-0 rounded-full bg-ink px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.1em] text-white sm:inline-flex'}>5–7 лет</span>
        </div>
        <div className={'relative mt-5 grid gap-3 sm:grid-cols-2'}>
          {heroSkills.map(([icon, title, text, background, iconTone, textTone]) => (
            <div key={title} className={'group flex min-h-[86px] items-center gap-4 rounded-[22px] border border-white bg-gradient-to-br ' + background + ' p-4 shadow-[0_10px_30px_rgba(30,45,85,.08)] transition duration-300 hover:-translate-y-0.5 hover:shadow-card'}>
              <span className={'grid h-12 w-12 shrink-0 place-items-center rounded-[16px] text-sm font-black text-white shadow-sm ' + iconTone}>{icon}</span>
              <span className={'min-w-0'}>
                <strong className={'block font-display text-[15px] font-extrabold leading-5 ' + textTone}>{title}</strong>
                <span className={'mt-1 block text-[11px] font-bold leading-[1.45] text-ink/54 sm:text-xs'}>{text}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HeroSkills() {
  return (
    <section className={'relative mt-10 overflow-hidden rounded-[36px] border border-white bg-gradient-to-br from-white via-[#F8F6FF] to-[#ECF8FF] p-6 shadow-luxe sm:p-8'}>
      <div className={'pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-brand-purple/12 blur-3xl'} />
      <div className={'relative flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'}>
        <div>
          <p className={'text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand-purple'}>Результат программы</p>
          <h2 className={'mt-2 max-w-3xl font-display text-3xl font-extrabold leading-[1.04] tracking-[-0.04em] text-ink sm:text-4xl'}>
            6 навыков для уверенного старта в школе
          </h2>
        </div>
        <span className={'shrink-0 text-sm font-bold text-ink/46'}>Для детей 5–7 лет</span>
      </div>
      <div className={'relative mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3'}>
        {heroSkills.map(([icon, title, text, background, iconTone, textTone]) => (
          <article key={title} className={'group flex min-h-[112px] items-center gap-4 rounded-[24px] border border-white bg-gradient-to-br ' + background + ' p-5 shadow-[0_12px_34px_rgba(30,45,85,.09)] transition duration-300 hover:-translate-y-1 hover:shadow-card'}>
            <span className={'grid h-14 w-14 shrink-0 place-items-center rounded-[18px] text-base font-black text-white shadow-sm ' + iconTone}>{icon}</span>
            <span className={'min-w-0'}>
              <strong className={'block font-display text-lg font-extrabold leading-5 ' + textTone}>{title}</strong>
              <span className={'mt-2 block text-xs font-bold leading-[1.5] text-ink/54'}>{text}</span>
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

export default async function SchoolPrepPage() {
  const session = await getAuthSession();
  let hasAccess = false;
  let accessUntilLabel = '';
  if (session?.user?.id) {
    await reconcileUserPayments(session.user.id);
    hasAccess = await hasActiveAccess(session.user.id, SCHOOL_PREP_DIRECTION);
    const until = await getAccessUntil(session.user.id, SCHOOL_PREP_DIRECTION);
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
      <main className="min-h-screen overflow-hidden bg-[#FBFAF7] text-ink">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

        <section className="relative px-5 pb-20 pt-32 sm:px-8 sm:pt-36 lg:px-14 lg:pb-28">
          <div className="pointer-events-none absolute -left-40 top-10 h-[520px] w-[520px] rounded-full bg-brand-blue/10 blur-[110px]" />
          <div className="pointer-events-none absolute -right-40 top-20 h-[560px] w-[560px] rounded-full bg-brand-pink/10 blur-[120px]" />
          <div className="container-pad relative px-0">
            <div className="grid items-stretch gap-10 lg:grid-cols-[1.04fr_.96fr] lg:gap-10">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-ink/8 bg-white/80 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.15em] text-ink/58 shadow-sm backdrop-blur-xl">
                  <span className="h-2 w-2 rounded-full bg-brand-green shadow-[0_0_0_4px_rgba(34,197,94,.12)]" />
                  Подготовка к школе · 5–7 лет
                </div>
                <h1 className="mt-7 max-w-[780px] font-display text-[44px] font-extrabold leading-[.98] tracking-[-0.055em] text-ink sm:text-6xl lg:text-[78px]">
                  Подготовка к школе <span className="bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink bg-clip-text text-transparent">без скучных тетрадей</span>
                </h1>
                <p className="mt-7 max-w-[680px] text-base font-semibold leading-7 text-ink/62 sm:text-lg sm:leading-8">
                  Чтение по слогам, счёт, логика, внимание, речь и подготовка руки к письму — в игровых занятиях по 20–25 минут.
                </p>
                <p className="mt-3 max-w-[660px] text-sm font-semibold leading-6 text-ink/48 sm:text-base">
                  Ребёнка ведёт сюжет «Экспедиция в Город знаний», а родитель после каждого занятия видит конкретный результат.
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <a href="#quick-demo" className="group inline-flex min-h-[58px] items-center justify-center gap-3 rounded-full bg-ink px-7 py-4 text-sm font-extrabold text-white shadow-button transition hover:-translate-y-1">
                    Пройти первое занятие бесплатно <span className="transition group-hover:translate-x-1">→</span>
                  </a>
                  <SchoolPrepIntroAudio />
                </div>
                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-extrabold text-ink/48 sm:text-xs">
                  <span>● Без карты</span>
                  <span>● Голосовые подсказки</span>
                  <span>● Результат для родителя</span>
                </div>
                <div className="mt-8 grid grid-cols-3 gap-3">
                  {[
                    ['12+1', 'недель', 'полная программа'],
                    ['20–25', 'минут', 'одно занятие'],
                    ['1', 'занятие', 'можно бесплатно'],
                  ].map(([value, unit, note]) => (
                    <div key={note} className="rounded-[20px] border border-ink/7 bg-white/82 p-4 shadow-card backdrop-blur-xl sm:p-5">
                      <div className="flex items-baseline gap-1.5">
                        <strong className="font-display text-2xl font-extrabold tracking-[-0.045em] text-brand-blue sm:text-3xl">{value}</strong>
                        <span className="text-[10px] font-extrabold text-ink/52 sm:text-xs">{unit}</span>
                      </div>
                      <p className="mt-2 text-[9px] font-bold leading-4 text-ink/42 sm:text-[11px]">{note}</p>
                    </div>
                  ))}
                </div>
                <div className="hidden">
                  <div className="mb-4 flex items-end justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-brand-purple">Масштаб курса</span>
                      <p className="mt-1 font-display text-xl font-extrabold tracking-[-0.035em] text-ink sm:text-2xl">Не несколько пробных игр — большая программа</p>
                    </div>
                    <span className="hidden rounded-full bg-brand-green/10 px-3 py-2 text-[10px] font-extrabold text-brand-green sm:inline-flex">12 недель + бонус</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                  {[
                    ['Один день', '25', 'шагов', '20–25 минут увлекательной практики', 'from-[#E5F8FF] to-[#DDEBFF]', 'text-[#1978D4]', 'bg-[#35BFD0]'],
                    ['Одна неделя', '125', 'шагов', '5 полноценных учебных дней', 'from-[#FFF5D5] to-[#FFE8CB]', 'text-[#E57C14]', 'bg-[#F4B83F]'],
                    ['Один месяц', '500', 'шагов', '20 занятий без однообразия', 'from-[#FFE5F0] to-[#EDE4FF]', 'text-[#D93F83]', 'bg-[#E4589A]'],
                    ['Полный курс', '1 625', 'шагов', '12 недель и бонусный маршрут', 'from-[#DFF8EE] to-[#DDF7F8]', 'text-[#0B9B70]', 'bg-[#20B98B]'],
                  ].map(([period, value, label, note, background, tone, accent]) => (
                    <div key={period} className={`group relative min-h-[164px] overflow-hidden rounded-[26px] border border-white bg-gradient-to-br ${background} p-5 shadow-[0_18px_48px_rgba(20,35,70,.10)] transition duration-300 hover:-translate-y-1 hover:shadow-color sm:min-h-[184px] sm:p-6`}>
                      <i className={`absolute -right-8 -top-10 h-28 w-28 rounded-full ${accent} opacity-15 blur-xl transition group-hover:scale-125`} />
                      <div className={`absolute inset-y-5 left-0 w-1 rounded-r-full ${accent}`} />
                      <span className="relative text-[10px] font-extrabold uppercase tracking-[0.17em] text-ink/48">{period}</span>
                      <div className="relative mt-3 flex items-end gap-2">
                        <strong className={`font-display text-[48px] font-extrabold leading-[.84] tracking-[-0.07em] sm:text-[62px] ${tone}`}>{value}</strong>
                        <span className="pb-1 text-sm font-extrabold text-ink/66 sm:text-base">{label}</span>
                      </div>
                      <p className="relative mt-4 text-[11px] font-bold leading-5 text-ink/52 sm:text-xs">{note}</p>
                    </div>
                  ))}
                  </div>
                </div>
              </div>
              <CityMap />
            </div>
            <HeroSkills />
          </div>
        </section>

        <SchoolPrepQuickDemo />

        <section id="volume" className="px-5 pb-24 sm:px-8 lg:px-14">
          <div className="container-pad px-0">
            <div className="relative overflow-hidden rounded-[36px] bg-[#111A35] p-7 text-white shadow-luxe sm:p-10 lg:p-14">
              <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-brand-blue/22 blur-[90px]" />
              <div className="pointer-events-none absolute -bottom-28 right-0 h-80 w-80 rounded-full bg-brand-pink/18 blur-[100px]" />
              <div className="relative grid gap-10 lg:grid-cols-[.82fr_1.18fr] lg:items-end">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-brand-cyan">Понятный ритм без перегруза</span>
                  <h2 className="mt-5 max-w-2xl font-display text-4xl font-extrabold leading-[1.03] tracking-[-0.045em] sm:text-5xl">
                    Регулярные занятия, которые легко встроить в день.
                  </h2>
                  <p className="mt-5 max-w-xl text-base font-medium leading-7 text-white/62">
                    Короткие игровые задания постепенно усложняются, а ребёнок возвращается к чтению, счёту, логике и вниманию в новых сюжетах.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['01 · Занятие', '20–25', 'минут', 'достаточно для практики без усталости', 'from-[#168ED9] to-[#34C9D3]', 'shadow-[0_22px_55px_rgba(52,201,211,.18)]'],
                    ['02 · Ритм', '5', 'дней', 'короткие занятия в течение недели', 'from-[#F59E0B] to-[#F6C945]', 'shadow-[0_22px_55px_rgba(245,158,11,.16)]'],
                    ['03 · Программа', '12+1', 'недель', 'основной маршрут и бонус по умножению', 'from-[#E74887] to-[#8C5BE8]', 'shadow-[0_22px_55px_rgba(231,72,135,.18)]'],
                    ['04 · Старт', '1', 'занятие', 'можно пройти бесплатно прямо сейчас', 'from-[#10A875] to-[#22B8A7]', 'shadow-[0_22px_55px_rgba(16,168,117,.16)]'],
                  ].map(([period, value, unit, note, tone, shadow]) => (
                    <article key={value} className={`relative min-h-[178px] overflow-hidden rounded-[26px] bg-gradient-to-br ${tone} p-5 text-white ${shadow} sm:min-h-[196px] sm:p-6`}>
                      <div className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-white/18 blur-2xl" />
                      <p className="relative text-[9px] font-extrabold uppercase tracking-[0.18em] text-white/68">{period}</p>
                      <p className="relative mt-4 font-display text-[44px] font-extrabold leading-none tracking-[-0.065em] sm:text-[58px]">{value}</p>
                      <p className="relative mt-1 text-base font-extrabold text-white">{unit}</p>
                      <p className="relative mt-4 text-[11px] font-bold leading-5 text-white/72">{note}</p>
                    </article>
                  ))}
                </div>
              </div>
              <div className="relative mt-7 grid grid-cols-2 gap-2 rounded-[22px] border border-white/9 bg-white/[0.055] p-3 text-center text-xs font-extrabold text-white/68 sm:grid-cols-3 sm:items-center">
                <span className="rounded-[14px] bg-white/7 px-3 py-2.5"><b className="text-brand-cyan">Чтение</b> и речь</span>
                <span className="rounded-[14px] bg-white/7 px-3 py-2.5"><b className="text-brand-yellow">Счёт</b> и логика</span>
                <span className="col-span-2 rounded-[14px] bg-white/7 px-3 py-2.5 sm:col-span-1"><b className="text-brand-green">Внимание</b> и самостоятельность</span>
              </div>
              <div className="relative mt-8 flex flex-col gap-3 border-t border-white/9 pt-6 text-sm font-semibold text-white/56 sm:flex-row sm:items-center sm:justify-between">
                <p>Первое занятие показывает формат курса без оплаты и привязки карты.</p>
                <a href="#program" className="shrink-0 font-extrabold text-white transition hover:text-brand-cyan">Посмотреть всю программу →</a>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 pb-24 sm:px-8 lg:px-14">
          <div className="container-pad px-0">
            <div className="rounded-[34px] border border-ink/7 bg-white/80 p-6 shadow-card sm:p-9">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {schoolPrepProgram.principles.map((principle, index) => (
                  <article key={principle.title} className="rounded-[26px] border border-ink/6 bg-[#FBFAF7] p-5 sm:p-6">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-[18px] bg-gradient-to-br text-xl font-black ${principleStyles[index]}`}>
                      {principleIcons[principle.icon]}
                    </div>
                    <h2 className="mt-5 font-display text-xl font-extrabold leading-tight tracking-[-0.025em]">{principle.title}</h2>
                    <p className="mt-3 text-sm font-semibold leading-6 text-ink/56">{principle.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[#121A31] px-5 py-24 text-white sm:px-8 lg:px-14 lg:py-32">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,.16),transparent_38%),radial-gradient(circle_at_85%_70%,rgba(236,72,153,.13),transparent_40%)]" />
          <div className="container-pad relative px-0">
            <div className="grid gap-12 lg:grid-cols-[.78fr_1.22fr] lg:items-start">
              <div className="lg:sticky lg:top-32">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand-cyan">Сбалансированная готовность</span>
                <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.04] tracking-[-0.045em] sm:text-5xl">Школа просит не только читать.</h2>
                <p className="mt-5 max-w-xl text-base font-medium leading-7 text-white/58">Поэтому курс развивает шесть опор одновременно. Без гонки, сравнений и бесконечных листочков на скорость.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {skills.map((skill) => (
                  <article key={skill.title} className="rounded-[26px] border border-white/9 bg-white/[0.055] p-6 backdrop-blur-xl">
                    <span className={`flex h-11 w-11 items-center justify-center rounded-[16px] text-lg font-black ${skill.color}`}>{skill.icon}</span>
                    <h3 className="mt-5 font-display text-xl font-extrabold">{skill.title}</h3>
                    <p className="mt-2 text-sm font-medium leading-6 text-white/52">{skill.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="week-one" className="scroll-mt-24 px-5 py-24 sm:px-8 lg:px-14 lg:py-32">
          <span id="uroki" className="block scroll-mt-24" />
          <div className="container-pad px-0">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand-blue">Полноценный пробный маршрут</span>
              <h2 className="mt-5 font-display text-4xl font-extrabold tracking-[-0.045em] sm:text-6xl"><span className="text-brand-blue">25 шагов.</span><br />Один день, чтобы почувствовать весь подход</h2>
              <p className="mt-5 text-base font-semibold leading-7 text-ink/58 sm:text-lg">25 последовательных шагов на 20–25 минут: разминка, игры на речь, счёт, внимание и самостоятельность, а в финале — понятный итог для родителя. День 1 бесплатный, продолжение входит в полный курс.</p>
            </div>
            <div className="mb-10 overflow-hidden rounded-[32px] border border-ink/7 bg-white/82 p-6 shadow-card backdrop-blur-xl sm:p-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-brand-pink">Не тест из одинаковых вопросов</span>
                  <h3 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.035em] text-ink sm:text-4xl">Ребёнок не только выбирает ответ — он играет и действует</h3>
                  <p className="mt-3 text-sm font-semibold leading-6 text-ink/56 sm:text-base">Первые игровые механики уже есть в бесплатном дне. Дальше они возвращаются с новыми правилами, картами и сюжетами.</p>
                </div>
                <span className="shrink-0 rounded-full bg-brand-green/10 px-4 py-2 text-xs font-extrabold text-brand-green">Можно попробовать бесплатно ✓</span>
              </div>
              <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  ['🧭', 'Мини-маршруты', 'Вести Искру стрелками, обходить препятствия и искать короткий путь.', 'Управление героем'],
                  ['📦', 'Сортировочные станции', 'Распределять предметы по зонам и самому открывать правило.', 'Игра на логику'],
                  ['🧠', 'Карточки памяти', 'Открывать пары, запоминать места и улучшать собственный результат.', 'Мемори'],
                  ['🧩', 'Конструкторы историй', 'Собирать события, планы и предложения в осмысленном порядке.', 'Собери сам'],
                  ['🏃', 'Живые задания', 'Встать, хлопнуть, повторить движение и вернуть внимание к экрану.', 'Экран + движение'],
                  ['🏆', 'Квесты и награды', 'Открывать печати, проходить мини-финалы и собирать золотой ключ.', 'Сюжетный финал'],
                ].map(([icon, title, text, label]) => (
                  <article key={title} className="group rounded-[22px] border border-ink/7 bg-[#FBFAF7] p-5 transition duration-300 hover:-translate-y-1 hover:border-brand-blue/18 hover:shadow-card">
                    <div className="flex items-start justify-between gap-3">
                      <span className="grid h-12 w-12 place-items-center rounded-[16px] bg-white text-2xl shadow-sm">{icon}</span>
                      <span className="rounded-full bg-ink/5 px-2.5 py-1 text-[8px] font-extrabold uppercase tracking-[0.1em] text-ink/42">{label}</span>
                    </div>
                    <h4 className="mt-4 font-display text-lg font-extrabold text-ink">{title}</h4>
                    <p className="mt-2 text-xs font-semibold leading-5 text-ink/52">{text}</p>
                  </article>
                ))}
              </div>
            </div>
            <SchoolPrepAdventure
              week={schoolPrepWeekOne}
              hasFullAccess={hasAccess || process.env.NODE_ENV !== 'production'}
            />
          </div>
        </section>

        <section id="program" className="scroll-mt-24 border-y border-ink/6 bg-white px-5 py-24 sm:px-8 lg:px-14 lg:py-32">
          <div className="container-pad px-0">
            <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:gap-14">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand-purple">12 недель + бонусная неделя</span>
                <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-[-0.045em] sm:text-5xl">Каждая неделя открывает новый район</h2>
                <p className="mt-5 text-base font-semibold leading-7 text-ink/58">Навыки возвращаются в новых сюжетах и постепенно усложняются. Ребёнок видит приключение, взрослый — продуманную образовательную траекторию.</p>
                <div className="mt-8 rounded-[24px] bg-ink p-5 text-white">
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-white/42">Ритм курса</p>
                  <p className="mt-3 font-display text-xl font-extrabold">{schoolPrepProgram.rhythm}</p>
                  <p className="mt-2 text-sm font-semibold text-white/54">{schoolPrepProgram.lessonTime} · коротко, регулярно, без перегруза</p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {schoolPrepProgram.weeks.map((week) => (
                  <article key={week.week} className={`relative rounded-[24px] border p-5 ${weekStyles[week.color]}`}>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[11px] font-extrabold uppercase tracking-[0.14em]">Неделя {week.week}</span>
                      <span className={`rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.1em] ${week.available ? 'bg-brand-green text-white' : week.bonus ? 'bg-brand-orange text-white' : 'bg-ink/6 text-ink/38'}`}>
                        {week.available ? 'День 1 бесплатно' : week.bonus ? 'Бонусная неделя' : 'В полном курсе'}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-lg font-extrabold leading-tight text-ink">{week.title}</h3>
                    <p className="mt-2 text-xs font-semibold leading-5 text-ink/52">{week.focus}</p>
                    <div className="mt-4 rounded-[18px] border border-white/80 bg-white/72 p-3 shadow-sm">
                      <div className="flex items-end justify-between gap-3">
                        <div><strong className="font-display text-3xl font-extrabold leading-none tracking-[-0.045em]">{125}</strong><span className="ml-1.5 text-xs font-extrabold text-ink/68">шагов</span></div>
                        <span className="rounded-full bg-ink/5 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.08em] text-ink/44">5 дней</span>
                      </div>
                      <p className="mt-2 text-[10px] font-bold text-ink/42">20–25 минут в день</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-24 sm:px-8 lg:px-14 lg:py-32">
          <div className="container-pad px-0">
            <div className="overflow-hidden rounded-[36px] bg-gradient-to-br from-[#17243E] via-[#172034] to-[#251A3B] p-7 text-white shadow-luxe sm:p-12 lg:p-16">
              <div className="grid gap-10 lg:grid-cols-[1fr_.9fr] lg:items-center">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand-yellow">Для родителей</span>
                  <h2 className="mt-5 max-w-2xl font-display text-4xl font-extrabold leading-[1.04] tracking-[-0.045em] sm:text-5xl">Вы не превращаетесь в учителя. Вы остаётесь рядом.</h2>
                  <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-white/58">Курс сам ведёт ребёнка по заданию, мягко подсказывает и отмечает успех. В конце дня вы получаете одну понятную формулировку результата и короткую игру без экрана.</p>
                  <a href="#week-one" className="mt-8 inline-flex min-h-[56px] items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-extrabold text-ink transition hover:-translate-y-1">Открыть день 1 →</a>
                </div>
                <div className="grid gap-3">
                  {[
                    ['01', 'Рядом 20–25 минут', 'Не нужно готовить материалы и объяснять длинную теорию.'],
                    ['02', 'Видеть реальный навык', 'Не просто «молодец», а конкретно: удержал инструкцию, нашёл закономерность, составил план.'],
                    ['03', 'Продолжить в обычной жизни', 'Одна мини-игра переносит навык с экрана в прогулку, дорогу или домашнее дело.'],
                  ].map(([number, title, text]) => (
                    <article key={number} className="flex gap-4 rounded-[22px] border border-white/9 bg-white/[0.055] p-5">
                      <span className="font-display text-sm font-extrabold text-brand-cyan">{number}</span>
                      <div><h3 className="font-display text-base font-extrabold">{title}</h3><p className="mt-1 text-xs font-medium leading-5 text-white/48">{text}</p></div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="podpiska" className="scroll-mt-24 px-5 pb-24 sm:px-8 lg:px-14 lg:pb-32">
          <div className="container-pad px-0">
            <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#13264D] via-[#382B72] to-[#8C356F] p-6 text-white shadow-luxe sm:p-10 lg:p-14">
              <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-brand-blue/24 blur-[100px]" />
              <div className="pointer-events-none absolute -bottom-32 right-1/4 h-96 w-96 rounded-full bg-brand-pink/20 blur-[110px]" />
              <div className="relative grid gap-10 lg:grid-cols-[1.08fr_.72fr] lg:items-center">
                <div>
                  <span className="inline-flex rounded-full border border-white/14 bg-white/10 px-3.5 py-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-brand-cyan">
                    Маршрут первого месяца
                  </span>
                  <h2 className="mt-6 max-w-3xl font-display text-4xl font-extrabold leading-[1.02] tracking-[-0.05em] sm:text-6xl">
                    500 умных шагов в месяц — по цене одного семейного похода в кафе.
                  </h2>
                  <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-white/66 sm:text-lg">
                    20 полноценных занятий, понятный прогресс и спокойный маршрут к школе. Ребёнок занимается дома, а родитель видит не обещания, а выполненные шаги и растущие навыки.
                  </p>
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {[
                      '4 тематические недели · 20 учебных дней',
                      'До 500 интерактивных заданий в месяц',
                      'Результат дня понятным языком для родителя',
                      'Без автосписания и скрытых платежей',
                    ].map((perk) => (
                      <div key={perk} className="flex items-start gap-3 rounded-[18px] border border-white/10 bg-white/[0.07] px-4 py-3.5 text-sm font-bold leading-6 text-white/78">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-green text-[11px] font-black text-white">✓</span>
                        {perk}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[30px] border border-white/70 bg-white p-6 text-ink shadow-[0_30px_80px_rgba(7,17,42,.34)] sm:p-8">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-brand-purple">30 дней полного доступа</p>
                  <div className="mt-4 text-lg font-extrabold text-ink/38">
                    <del>1 490 ₽</del>
                  </div>
                  <div className="mt-1 flex items-end gap-2">
                    <strong className="font-display text-6xl font-extrabold tracking-[-0.06em]">{SCHOOL_PREP_PRICE}</strong>
                    <span className="pb-2 text-lg font-extrabold text-ink/48">₽</span>
                  </div>
                  <p className="mt-2 text-sm font-bold text-ink/48">≈ {Math.round(SCHOOL_PREP_PRICE / 20)} ₽ за учебный день</p>
                  <div className="my-6 h-px bg-ink/8" />
                  <div className="space-y-3 text-sm font-semibold text-ink/64">
                    <p className="flex items-center justify-between gap-4"><span>Учебных дней</span><strong className="text-ink">20</strong></p>
                    <p className="flex items-center justify-between gap-4"><span>Шагов в маршруте</span><strong className="text-ink">до 500</strong></p>
                    <p className="flex items-center justify-between gap-4"><span>Первый день</span><strong className="text-brand-green">бесплатно</strong></p>
                  </div>
                  <SubscribeButton
                    isLoggedIn={Boolean(session?.user?.id)}
                    hasAccess={hasAccess}
                    accessUntil={accessUntilLabel}
                    returnTo="/podgotovka-k-shkole"
                  />
                  <p className="mt-4 text-center text-[11px] font-semibold leading-5 text-ink/40">
                    Доступ открывается сразу после оплаты на 30 дней. Автопродления нет.
                  </p>
                </div>
              </div>
            </div>
            <CourseDiscovery current="podgotovka-k-shkole" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
