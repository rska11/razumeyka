import { Header } from '@/components/Header.jsx';
import { Footer } from '@/components/Footer.jsx';
import { SchoolPrepAdventure } from '@/components/school-prep/SchoolPrepAdventure.jsx';
import { schoolPrepProgram, schoolPrepWeekOne } from '@/data/school-prep-course.js';

export const metadata = {
  title: 'Подготовка к школе 5–7 лет — курс-игра онлайн',
  description:
    'Умная подготовка к школе в формате приключения: речь, чтение, счёт, логика, внимание, графомоторика и уверенность. Первая игровая неделя открыта бесплатно.',
  alternates: { canonical: '/podgotovka-k-shkole' },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Разумейка',
    url: 'https://razumeyka-school.ru/podgotovka-k-shkole',
    title: 'Экспедиция в Город знаний — подготовка к школе',
    description: '12 недель умных игр, которые помогают ребёнку думать, говорить, считать и уверенно начинать новое.',
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

const courseSchema = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'Экспедиция в Город знаний — подготовка к школе',
  description: 'Игровой онлайн-курс подготовки к школе для детей 5–7 лет: речь, чтение, счёт, логика, внимание и уверенность.',
  provider: { '@type': 'Organization', name: 'Разумейка', url: 'https://razumeyka-school.ru' },
  educationalLevel: 'Дошкольное образование',
  timeRequired: 'P12W',
  inLanguage: 'ru',
};

function CityMap() {
  const stops = [
    { icon: '🎒', label: 'Ворота порядка', className: 'left-[5%] top-[9%] border-brand-blue/20' },
    { icon: '🔤', label: 'Площадь слов', className: 'right-[3%] top-[22%] border-brand-pink/20' },
    { icon: '🔢', label: 'Числовой мост', className: 'left-[1%] top-[53%] border-brand-orange/20' },
    { icon: '🧠', label: 'Лаборатория', className: 'right-[4%] top-[64%] border-brand-purple/20' },
  ];

  return (
    <div className="relative mx-auto aspect-[1.02] w-full max-w-[580px]" aria-label="Карта первой недели курса">
      <div className="absolute inset-[8%] rounded-[42%_58%_50%_50%] border border-white/70 bg-white/54 shadow-luxe backdrop-blur-xl" />
      <svg className="absolute inset-[13%] h-[74%] w-[74%] translate-x-[8%]" viewBox="0 0 440 420" fill="none" aria-hidden="true">
        <path d="M40 76C115 20 177 110 232 91C308 65 351 80 382 143C412 203 322 229 323 287C324 343 250 381 183 349C112 315 116 263 62 231C12 201 1 112 40 76Z" fill="url(#mapFill)" />
        <path d="M63 91C114 45 161 124 231 105C302 86 347 101 358 155C368 207 293 225 296 280C300 332 237 352 185 326C131 299 132 249 76 217C30 191 25 126 63 91Z" stroke="white" strokeWidth="4" strokeDasharray="8 13" strokeLinecap="round" />
        <path d="M109 171C139 139 173 173 204 155C237 135 277 151 280 189C284 226 243 234 231 260C216 291 166 277 160 243C155 215 82 201 109 171Z" fill="white" fillOpacity=".7" />
        <defs>
          <linearGradient id="mapFill" x1="40" y1="55" x2="355" y2="355" gradientUnits="userSpaceOnUse">
            <stop stopColor="#DDEBFF" />
            <stop offset=".45" stopColor="#F3E6FF" />
            <stop offset="1" stopColor="#DDF8E8" />
          </linearGradient>
        </defs>
      </svg>

      {stops.map((stop) => (
        <div key={stop.label} className={`absolute ${stop.className} z-10 flex items-center gap-2 rounded-2xl border bg-white/90 px-3 py-2 shadow-card backdrop-blur-xl sm:px-4 sm:py-3`}>
          <span className="text-xl sm:text-2xl">{stop.icon}</span>
          <span className="hidden text-xs font-extrabold text-ink/70 sm:block">{stop.label}</span>
        </div>
      ))}

      <div className="absolute left-1/2 top-1/2 z-20 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 animate-floaty items-center justify-center rounded-[38px] border border-white/80 bg-white shadow-luxe sm:h-40 sm:w-40">
        <span className="text-7xl sm:text-8xl" role="img" aria-label="Лисёнок Искра">🦊</span>
        <span className="absolute -bottom-3 rounded-full bg-ink px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.13em] text-white">Проводник Искра</span>
      </div>

      <div className="absolute bottom-[2%] right-[16%] z-20 rotate-6 rounded-[22px] border border-brand-yellow/25 bg-[#FFF8D8] px-4 py-3 shadow-card">
        <span className="text-3xl">🔑</span>
        <p className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-ink/55">Награда недели</p>
      </div>
    </div>
  );
}

export default function SchoolPrepPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen overflow-hidden bg-[#FBFAF7] text-ink">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />

        <section className="relative px-5 pb-20 pt-32 sm:px-8 sm:pt-36 lg:px-14 lg:pb-28">
          <div className="pointer-events-none absolute -left-40 top-10 h-[520px] w-[520px] rounded-full bg-brand-blue/10 blur-[110px]" />
          <div className="pointer-events-none absolute -right-40 top-20 h-[560px] w-[560px] rounded-full bg-brand-pink/10 blur-[120px]" />
          <div className="container-pad relative px-0">
            <div className="grid items-center gap-12 lg:grid-cols-[1.04fr_.96fr] lg:gap-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-ink/8 bg-white/80 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.15em] text-ink/58 shadow-sm backdrop-blur-xl">
                  <span className="h-2 w-2 rounded-full bg-brand-green shadow-[0_0_0_4px_rgba(34,197,94,.12)]" />
                  Подготовка к школе · 5–7 лет
                </div>
                <h1 className="mt-7 max-w-[780px] font-display text-[44px] font-extrabold leading-[.98] tracking-[-0.055em] text-ink sm:text-6xl lg:text-[78px]">
                  Не готовимся<br />к школе. <span className="bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink bg-clip-text text-transparent">Отправляемся</span> в неё.
                </h1>
                <p className="mt-7 max-w-[680px] text-base font-semibold leading-7 text-ink/62 sm:text-lg sm:leading-8">
                  {schoolPrepProgram.promise} Ребёнок проходит сюжетную экспедицию, а родитель видит, какой настоящий навык растёт за каждой игрой.
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <a href="#week-one" className="group inline-flex min-h-[58px] items-center justify-center gap-3 rounded-full bg-ink px-7 py-4 text-sm font-extrabold text-white shadow-button transition hover:-translate-y-1">
                    Начать первую неделю <span className="transition group-hover:translate-x-1">→</span>
                  </a>
                  <a href="#program" className="inline-flex min-h-[58px] items-center justify-center rounded-full border border-ink/10 bg-white/75 px-7 py-4 text-sm font-extrabold text-ink/68 transition hover:-translate-y-1 hover:bg-white">
                    Посмотреть 12 недель
                  </a>
                </div>
                <div className="mt-9 grid max-w-[680px] grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    ['12', 'недель'],
                    ['15–20', 'минут в день'],
                    ['5', 'дней в неделю'],
                    ['1-я', 'неделя бесплатно'],
                  ].map(([value, label]) => (
                    <div key={label} className="rounded-[20px] border border-white/80 bg-white/65 p-4 shadow-sm backdrop-blur-xl">
                      <strong className="font-display text-2xl font-extrabold tracking-tight text-ink">{value}</strong>
                      <span className="mt-1 block text-[11px] font-bold leading-4 text-ink/48">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <CityMap />
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
          <div className="container-pad px-0">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand-blue">Можно начать прямо сейчас</span>
              <h2 className="mt-5 font-display text-4xl font-extrabold tracking-[-0.045em] sm:text-6xl">Первая неделя — уже живая</h2>
              <p className="mt-5 text-base font-semibold leading-7 text-ink/58 sm:text-lg">Пять дней открываются по порядку. В каждом — разминка, три короткие миссии и понятный итог для родителя. Прогресс сохранится на этом устройстве.</p>
            </div>
            <SchoolPrepAdventure week={schoolPrepWeekOne} />
          </div>
        </section>

        <section id="program" className="scroll-mt-24 border-y border-ink/6 bg-white px-5 py-24 sm:px-8 lg:px-14 lg:py-32">
          <div className="container-pad px-0">
            <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:gap-14">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand-purple">Маршрут на 12 недель</span>
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
                      <span className={`rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.1em] ${week.available ? 'bg-brand-green text-white' : 'bg-ink/6 text-ink/38'}`}>
                        {week.available ? 'Открыта' : 'В программе'}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-lg font-extrabold leading-tight text-ink">{week.title}</h3>
                    <p className="mt-2 text-xs font-semibold leading-5 text-ink/52">{week.focus}</p>
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
                    ['01', 'Рядом 15–20 минут', 'Не нужно готовить материалы и объяснять длинную теорию.'],
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
      </main>
      <Footer />
    </>
  );
}
