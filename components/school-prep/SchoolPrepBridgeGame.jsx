'use client';

import Image from 'next/image';
import { GameLauncher } from '@/components/games/GameShell.jsx';

function PlayIcon() {
  return (
    <svg viewBox={'0 0 24 24'} fill={'none'} aria-hidden className={'h-5 w-5'}>
      <path d={'m9 7 8 5-8 5V7Z'} fill={'currentColor'} />
    </svg>
  );
}

function SkillIcon({ type }) {
  const paths = {
    row: <path d={'M5 12h14M6 8l-3 4 3 4M18 8l3 4-3 4'} />,
    compare: <path d={'m7 8 10 4-10 4V8ZM5 20h14'} />,
    sum: <path d={'M5 12h14M12 5v14'} />,
    pattern: <path d={'M5 17 9 9l4 6 6-10'} />,
  };
  return (
    <svg viewBox={'0 0 24 24'} fill={'none'} stroke={'currentColor'} strokeWidth={'2'} strokeLinecap={'round'} strokeLinejoin={'round'} aria-hidden className={'h-5 w-5'}>
      {paths[type]}
    </svg>
  );
}

export function SchoolPrepBridgeGame({ hasAccess = false }) {
  return (
    <section id={'igra'} className={'scroll-mt-24 px-5 pb-24 sm:px-8 lg:px-14'}>
      <div className={'container-pad px-0'}>
        <div className={'relative overflow-hidden rounded-[38px] bg-[#0D1736] text-white shadow-[0_35px_90px_rgba(13,23,54,.28)]'}>
          <div className={'pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#77E5FF]/16 blur-3xl'} />
          <div className={'pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-[#A78BFA]/18 blur-3xl'} />

          <div className={'relative grid lg:grid-cols-[1.02fr_.98fr] lg:items-stretch'}>
            <div className={'p-6 sm:p-9 lg:p-11'}>
              <div className={'flex flex-wrap items-center gap-2'}>
                <span className={'inline-flex rounded-full bg-[#62E3FF]/14 px-3 py-2 text-[10px] font-black uppercase tracking-[.17em] text-[#8BEAFF]'}>Математическое приключение</span>
                <span className={'inline-flex rounded-full border border-white/12 bg-white/[.06] px-3 py-2 text-[10px] font-black uppercase tracking-[.13em] text-white/70'}>8 миссий</span>
                <span className={'inline-flex rounded-full border border-white/12 bg-white/[.06] px-3 py-2 text-[10px] font-black uppercase tracking-[.13em] text-white/70'}>5–7 лет</span>
              </div>

              <h2 className={'mt-5 font-display text-4xl font-black leading-[.98] tracking-[-.05em] sm:text-5xl'}>
                Построй мост{' '}
                <span className={'bg-gradient-to-r from-[#62E3FF] via-[#7EF0C4] to-[#FFD467] bg-clip-text text-transparent'}>решениями, а не угадыванием</span>
              </h2>
              <p className={'mt-5 max-w-xl text-sm font-semibold leading-6 text-white/66 sm:text-base sm:leading-7'}>
                На каждом камне — вариант ответа. Чтобы продвинуться, ребёнок восстанавливает числовые ряды,
                сравнивает числа, находит состав числа, складывает и вычитает до 20.
              </p>

              <div className={'mt-6 grid gap-2.5 sm:grid-cols-3'}>
                {[
                  ['01', 'Прочитай крупную задачу'],
                  ['02', 'Выбери дорожку с ответом'],
                  ['03', 'Получи понятное объяснение'],
                ].map(([number, text]) => (
                  <div key={number} className={'rounded-[18px] border border-white/10 bg-white/[.065] px-4 py-3'}>
                    <span className={'text-[10px] font-black tracking-[.14em] text-[#8BEAFF]'}>{number}</span>
                    <span className={'mt-1 block text-xs font-black leading-4 text-white/82'}>{text}</span>
                  </div>
                ))}
              </div>

              <GameLauncher
                gameId={'bridge'}
                hasAccess={hasAccess}
                className={'group mt-7 inline-flex min-h-[62px] w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#FFD467] to-[#FF9F55] px-8 text-base font-black text-[#19213A] shadow-[0_18px_38px_rgba(255,178,72,.25)] transition hover:-translate-y-1 hover:shadow-[0_22px_46px_rgba(255,178,72,.36)] sm:w-auto'}
              >
                <span className={'flex h-9 w-9 items-center justify-center rounded-full bg-white/70 transition group-hover:scale-110'}><PlayIcon /></span>
                Начать экспедицию
              </GameLauncher>
              <p className={'mt-3 text-xs font-bold text-white/42'}>Первые миссии бесплатно · без регистрации · без наказания за ошибку</p>
            </div>

            <div className={'relative min-h-[440px] overflow-hidden border-t border-white/10 lg:min-h-full lg:border-l lg:border-t-0'}>
              <Image src={'/images/games/bridge/bridge-day-v2.webp'} alt={''} fill sizes={'(max-width: 1024px) 100vw, 50vw'} className={'object-cover'} />
              <div className={'absolute inset-0 bg-gradient-to-t from-[#08142F]/70 via-[#08142F]/8 to-[#08142F]/18'} />

              <div className={'absolute inset-x-5 top-5 flex items-center justify-between gap-3 sm:inset-x-7'}>
                <div className={'rounded-full border border-white/30 bg-[#10213D]/78 px-4 py-2 text-xs font-black shadow-lg backdrop-blur'}>Миссия 5 <span className={'ml-2 text-[#8BEAFF]'}>Состав числа</span></div>
                <div className={'rounded-full border border-white/30 bg-[#10213D]/78 px-3 py-2 text-xs font-black shadow-lg backdrop-blur'}>7 / 10</div>
              </div>

              <div className={'absolute left-1/2 top-[24%] w-[min(88%,420px)] -translate-x-1/2 rounded-[24px] border border-white/28 bg-[#10213D]/86 px-5 py-4 text-center shadow-2xl backdrop-blur-md'}>
                <p className={'text-[9px] font-black uppercase tracking-[.16em] text-[#8BEAFF]'}>Задание моста</p>
                <p className={'mt-1 font-display text-3xl font-black'}>4 + ? = 9</p>
              </div>

              <span className={'bridge-fox-runner'} role={'img'} aria-label={'Лисёнок-исследователь бежит к мосту'}>
                <Image
                  src={'/images/games/bridge/bridge-fox-run-v3.webp'}
                  alt={''}
                  width={1983}
                  height={570}
                  className={'bridge-fox-runner-sheet'}
                />
              </span>

              <div className={'absolute bottom-[10%] left-[31%] right-[4%] flex items-end justify-between gap-2 sm:right-[7%]'}>
                {[
                  ['5', 'bg-[#8FF0C5] text-[#103C32] ring-4 ring-[#8FF0C5]/30'],
                  ['6', 'bg-[#F9FBFF] text-[#17244A]'],
                  ['4', 'bg-[#F9FBFF] text-[#17244A]'],
                ].map(([number, tone], index) => (
                  <div key={number} className={`flex h-16 w-[30%] items-center justify-center rounded-[24px] border-[3px] border-white/70 font-display text-2xl font-black shadow-[0_14px_24px_rgba(5,36,70,.4)] sm:h-20 sm:text-3xl ${tone}`} style={{ transform: `translateY(${index === 1 ? 12 : 0}px)` }}>{number}</div>
                ))}
              </div>
            </div>
          </div>

          <div className={'relative border-t border-white/10 bg-white/[.045] px-6 py-6 sm:px-9 lg:px-11'}>
            <div className={'mb-4 flex flex-wrap items-end justify-between gap-2'}>
              <div>
                <p className={'text-[10px] font-black uppercase tracking-[.17em] text-[#8BEAFF]'}>Не просто счёт по порядку</p>
                <p className={'mt-1 text-sm font-bold text-white/52'}>Сложность растёт через новые способы думать, а не через бешеную скорость</p>
              </div>
              <span className={'rounded-full bg-[#8FF0C5]/12 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.12em] text-[#8FF0C5]'}>10 решений в миссии</span>
            </div>
            <div className={'grid gap-3 sm:grid-cols-2 lg:grid-cols-4'}>
              {[
                ['row', 'Ряды и соседи', 'Пропуски, порядок и числа до 20'],
                ['compare', 'Сравнение', 'Больше, меньше и расстояние'],
                ['sum', 'Состав числа', 'Сложение и вычитание до 20'],
                ['pattern', 'Закономерности', 'Шаг +2, обратные и смешанные ряды'],
              ].map(([icon, title, note]) => (
                <div key={title} className={'rounded-[20px] border border-white/10 bg-white/[.07] p-4'}>
                  <span className={'flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#77E5FF]/10 text-[#8BEAFF]'}><SkillIcon type={icon} /></span>
                  <p className={'mt-3 text-sm font-black'}>{title}</p>
                  <p className={'mt-1 text-xs font-semibold leading-5 text-white/48'}>{note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}