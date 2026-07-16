import Link from 'next/link';
import { Icon } from './Icon.jsx';

const startPerks = [
  'Сейчас открыты 2 направления: рисование и ментальная арифметика',
  'Первые уроки можно попробовать бесплатно, без карты',
  'Остальные направления запускаем 20 июля',
  'Выберите курс по цели ребёнка и начните в удобное время',
];

const readyDirections = [
  { title: 'Ментальная арифметика', text: 'Счёт, внимание, память и уверенность в примерах.', href: '/mentalnaya-arifmetika', icon: 'abacus' },
  { title: 'Правополушарное рисование', text: 'Творчество, вторая рука, образное мышление и красивый результат.', href: '/risovanie', icon: 'palette' },
];

export function FinalCTA() {
  return (
    <section id="form" className="presentation-slide mesh-bg py-16 sm:py-20 lg:py-24">
      <div className="container-pad">
        <div className="relative overflow-hidden rounded-[36px] border border-white/70 bg-[linear-gradient(160deg,rgba(255,255,255,0.84),rgba(241,245,255,0.74))] p-5 shadow-[0_48px_120px_rgba(16,42,86,0.14)] backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute inset-0 rounded-[36px] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(255,255,255,0.5)]" />
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-brand-blue/16 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-brand-pink/14 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-brand-orange/10 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1.03fr_0.97fr] lg:items-center">
            <div>
              <span className="section-kicker">старт без риска</span>
              <h2 className="section-title mt-5">Начните с одного из двух открытых направлений</h2>
              <p className="mt-5 text-lg font-medium leading-8 text-ink/66">
                Рисование и ментальная арифметика уже готовы к занятиям. Попробуйте бесплатные уроки, а остальные курсы — скорочтение, языки, подготовку к школе и интуицию — откроем 20 июля.
              </p>

              <ul className="mt-7 grid gap-3">
                {startPerks.map((perk) => (
                  <li key={perk} className="flex items-start gap-3 text-base font-semibold leading-7 text-ink/78">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-blue/12 text-brand-blue">
                      <Icon name="check" className="h-3.5 w-3.5" />
                    </span>
                    {perk}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/mentalnaya-arifmetika" className="primary-btn">
                  <span className="relative">Попробовать ментальную арифметику</span>
                  <Icon name="arrow" className="relative h-5 w-5" />
                </Link>
                <Link href="/risovanie" className="secondary-btn">
                  Попробовать рисование
                </Link>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/80 bg-white p-6 shadow-[0_32px_80px_rgba(16,42,86,0.12)] sm:p-8">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/40">Открытые уроки</p>
              <p className="mt-3 font-display text-5xl font-extrabold text-ink">2 <span className="text-2xl font-bold text-ink/50">направления</span></p>
              <p className="mt-2 text-sm font-semibold text-ink/54">Можно начать сегодня: первые уроки бесплатно</p>

              <div className="mt-6 grid gap-3">
                {readyDirections.map((direction) => (
                  <Link
                    key={direction.href}
                    href={direction.href}
                    className="group flex items-start gap-3 rounded-[22px] border border-ink/8 bg-porcelain p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-card"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-ink text-white">
                      <Icon name={direction.icon} className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block font-display text-base font-extrabold leading-tight text-ink">{direction.title}</span>
                      <span className="mt-1 block text-sm font-semibold leading-5 text-ink/56">{direction.text}</span>
                    </span>
                  </Link>
                ))}
              </div>

              <Link href="/#programs" className="primary-btn mt-7 w-full justify-center">
                <span className="relative">Открыть уроки</span>
                <Icon name="arrow" className="relative h-5 w-5" />
              </Link>
              <p className="mt-3 text-center text-xs font-medium text-ink/44">
                В блоке направлений видно, что открыто сейчас, а что запускается 20 июля
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}