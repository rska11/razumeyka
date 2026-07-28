'use client';

// Секция-приглашение в игру + полноэкранное «раскрытие» поверх страницы.
// Игра монтируется ТОЛЬКО когда её открыли: канвас, цикл кадров и Web Audio
// не должны висеть на странице, которую человек просто прокручивает.

// Оверлей, Esc, блокировка прокрутки и ленивая загрузка игры теперь общие для
// всех игр платформы и живут в GameShell — здесь остаётся только витрина.
import { GameLauncher } from '@/components/games/GameShell.jsx';

export function SchoolPrepBridgeGame({ hasAccess = false }) {
  return (
    <section id={'igra'} className={'scroll-mt-24 px-5 pb-24 sm:px-8 lg:px-14'}>
      <div className={'container-pad px-0'}>
        <div className={'relative overflow-hidden rounded-[38px] bg-[#0D1736] text-white shadow-[0_35px_90px_rgba(13,23,54,.28)]'}>
          <div className={'pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-blue/25 blur-3xl'} />
          <div className={'pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-brand-purple/25 blur-3xl'} />

          <div className={'relative grid lg:grid-cols-[1.08fr_.92fr] lg:items-stretch'}>
            <div className={'p-6 sm:p-9 lg:p-11'}>
              <div className={'flex flex-wrap items-center gap-2'}>
                <span className={'inline-flex rounded-full bg-[#62E3FF]/14 px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.17em] text-[#8BEAFF]'}>
                  🎮 Игра · без регистрации
                </span>
                <span className={'inline-flex rounded-full border border-white/12 bg-white/[0.06] px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.13em] text-white/70'}>
                  8 уровней
                </span>
                <span className={'inline-flex rounded-full border border-white/12 bg-white/[0.06] px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.13em] text-white/70'}>
                  5–7 лет
                </span>
              </div>

              <h2 className={'mt-5 font-display text-4xl font-extrabold leading-[.98] tracking-[-0.05em] sm:text-5xl'}>
                Помоги Искре перейти{' '}
                <span className={'bg-gradient-to-r from-[#62E3FF] to-[#A78BFA] bg-clip-text text-transparent'}>числовую реку</span>
              </h2>
              <p className={'mt-5 max-w-xl text-sm font-semibold leading-6 text-white/66 sm:text-base sm:leading-7'}>
                Выбирай следующий камень в числовом ряду и веди лисёнка к другому берегу.
                Ребёнок считает не «для проверки», а чтобы управлять героем и проходить уровни.
              </p>

              <div className={'mt-6 grid gap-2.5 sm:grid-cols-3'}>
                {[
                  ['1', 'Смотри на число'],
                  ['2', 'Выбирай камень'],
                  ['3', 'Прыгай дальше'],
                ].map(([number, text]) => (
                  <div key={number} className={'flex items-center gap-3 rounded-[18px] border border-white/10 bg-white/[0.065] px-3.5 py-3'}>
                    <span className={'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-xs font-black text-[#17244A]'}>{number}</span>
                    <span className={'text-xs font-extrabold leading-4 text-white/80'}>{text}</span>
                  </div>
                ))}
              </div>

              <GameLauncher
                gameId={'bridge'}
                hasAccess={hasAccess}
                className={'group mt-7 inline-flex min-h-[62px] w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#FFB02E] to-[#FF7A45] px-8 text-base font-black text-[#19213A] shadow-[0_18px_38px_rgba(255,150,52,.27)] transition hover:-translate-y-1 hover:shadow-[0_22px_46px_rgba(255,150,52,.36)] sm:w-auto'}
              >
                <span className={'flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-sm transition group-hover:scale-110'}>▶</span>
                Играть бесплатно
              </GameLauncher>
              <p className={'mt-3 text-xs font-bold text-white/42'}>Запускается сразу · регистрация не нужна · звук можно выключить</p>
            </div>

            <div className={'relative min-h-[390px] overflow-hidden border-t border-white/10 bg-gradient-to-b from-[#224C86] via-[#167FA1] to-[#0B567D] lg:min-h-full lg:border-l lg:border-t-0'}>
              <div className={'absolute inset-x-0 top-0 h-[42%] bg-gradient-to-b from-[#7FD7FF] via-[#BCEBFF] to-[#EAF8FF]'} />
              <div className={'absolute left-[8%] top-[8%] h-10 w-20 rounded-full bg-white/55 blur-[1px]'} />
              <div className={'absolute right-[9%] top-[14%] h-8 w-16 rounded-full bg-white/45 blur-[1px]'} />
              <div className={'absolute inset-x-0 top-[34%] h-20 bg-[#73B96C] [clip-path:polygon(0_45%,10%_20%,22%_52%,35%_18%,48%_58%,62%_20%,78%_48%,90%_15%,100%_42%,100%_100%,0_100%)]'} />
              <div className={'absolute inset-x-0 bottom-0 top-[42%] bg-[linear-gradient(105deg,rgba(255,255,255,.12)_0%,transparent_30%,rgba(255,255,255,.16)_52%,transparent_72%)]'} />

              <div className={'absolute inset-x-5 top-5 flex items-center justify-between sm:inset-x-7'}>
                <div className={'rounded-full border border-white/30 bg-[#10213D]/78 px-4 py-2 text-xs font-black shadow-lg backdrop-blur'}>
                  Уровень 1 <span className={'ml-2 text-[#8BEAFF]'}>Числа до 10</span>
                </div>
                <div className={'rounded-full border border-white/30 bg-[#10213D]/78 px-3 py-2 text-sm shadow-lg backdrop-blur'} aria-label={'Три жизни'}>
                  ❤️ ❤️ ❤️
                </div>
              </div>

              <div className={'absolute left-1/2 top-[46%] -translate-x-1/2 text-center'}>
                <p className={'text-[10px] font-black uppercase tracking-[0.16em] text-white/70'}>Найди следующее число</p>
                <div className={'mt-2 inline-flex min-w-24 items-center justify-center rounded-[18px] border-2 border-white/60 bg-[#10213D]/85 px-5 py-3 font-display text-3xl font-black shadow-xl backdrop-blur'}>
                  4 → ?
                </div>
              </div>

              <div className={'absolute bottom-[19%] left-[4%] z-10 flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/70 bg-gradient-to-br from-[#FFB02E] to-[#FF754C] text-5xl shadow-[0_16px_35px_rgba(7,29,62,.38)] sm:left-[7%] sm:h-24 sm:w-24 sm:text-6xl'}>
                🦊
              </div>

              <div className={'absolute bottom-[13%] left-[26%] right-[4%] flex items-end justify-between gap-2 sm:left-[29%] sm:right-[7%]'}>
                {[
                  ['5', 'bg-[#F9FBFF] text-[#17244A]'],
                  ['7', 'bg-[#F9FBFF] text-[#17244A]'],
                  ['6', 'bg-[#8FF0C5] text-[#103C32] ring-4 ring-[#8FF0C5]/30'],
                ].map(([number, tone], index) => (
                  <div
                    key={number}
                    className={'flex items-center justify-center rounded-[50%] border-4 border-white/55 font-display text-2xl font-black shadow-[0_14px_24px_rgba(5,36,70,.35)] sm:text-3xl ' + tone + (index === 1 ? ' h-16 w-20 sm:h-20 sm:w-24' : ' h-20 w-24 sm:h-24 sm:w-28')}
                    style={{ transform: `translateY(${index === 1 ? 16 : 0}px) rotate(${index === 0 ? -4 : index === 2 ? 5 : 2}deg)` }}
                  >
                    {number}
                  </div>
                ))}
              </div>

              <div className={'absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#10213D]/75 px-4 py-2 text-[11px] font-extrabold text-white/80 shadow-lg backdrop-blur'}>
                <span className={'text-[#8FF0C5]'}>▲</span>
                Выбери камень 5
                <span className={'text-[#8FF0C5]'}>▼</span>
              </div>
            </div>
          </div>

          <div className={'relative border-t border-white/10 bg-white/[0.045] px-6 py-6 sm:px-9 lg:px-11'}>
            <div className={'mb-4 flex flex-wrap items-end justify-between gap-2'}>
              <div>
                <p className={'text-[10px] font-extrabold uppercase tracking-[0.17em] text-[#8BEAFF]'}>Что тренирует игра</p>
                <p className={'mt-1 text-sm font-bold text-white/52'}>Навыки спрятаны внутрь приключения</p>
              </div>
              <span className={'rounded-full bg-[#8FF0C5]/12 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-[#8FF0C5]'}>без оценок и наказаний</span>
            </div>
            <div className={'grid gap-3 sm:grid-cols-2 lg:grid-cols-4'}>
              {[
                ['🔢', 'Числовой ряд', 'Прямой и обратный счёт до 20'],
                ['✌️', 'Счёт двойками', 'Понятный первый шаг к умножению'],
                ['⚡', 'Быстрое решение', 'Ответ во время движения камня'],
                ['💚', 'Спокойствие', 'Ошибка подсказывает, а не завершает игру'],
              ].map(([icon, title, note]) => (
                <div key={title} className={'rounded-[20px] border border-white/10 bg-white/[0.07] p-4'}>
                  <span className={'flex h-10 w-10 items-center justify-center rounded-[14px] bg-white/10 text-xl'}>{icon}</span>
                  <p className={'mt-3 text-sm font-extrabold text-white'}>{title}</p>
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
