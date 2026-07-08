'use client';

import { Icon } from './Icon.jsx';
import { Logo } from './Logo.jsx';

const navLinks = [
  ['Возраст', '/#age'],
  ['Направления', '/#programs'],
  ['Результаты', '/#results'],
  ['Отзывы', '/#reviews'],
  ['Блог', '/blog'],
  ['Запись', '/#form'],
];

const directions = [
  ['Ментальная арифметика', '/mental-arithmetic'],
  ['Скорочтение', '/speed-reading'],
  ['Правополушарное рисование', '/right-brain-drawing'],
  ['Интуиция', '/intuition'],
  ['Языки', '/languages'],
  ['Подготовка к школе', '/podgotovka-k-shkole'],
  ['Актёрское мастерство', '/akterskoe-masterstvo'],
  ['Английский для детей', '/english-for-kids'],
  ['Русский язык для детей', '/russkiy-yazyk-dlya-detey'],
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-forest-900 text-porcelain">
      <div className="container-pad py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-4">
              <Logo />
              <div className="border-l border-white/16 pl-4">
                <span className="block text-sm font-extrabold uppercase tracking-[0.18em] text-gold-300">Разумейка</span>
                <span className="mt-1 block text-xs font-bold text-white/44">онлайн школа развития детей</span>
              </div>
            </div>
            <p className="mt-5 max-w-xs text-sm font-medium leading-7 text-white/54">
              Онлайн школа развития детей 4–12 лет. Ментальная арифметика, скорочтение, рисование, интуиция и языки.
            </p>
            <a
              href="/#form"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold-300 px-5 py-3 text-sm font-extrabold text-forest-900 shadow-luxe transition hover:-translate-y-0.5 hover:bg-white"
            >
              Записаться на урок
              <Icon name="arrow" className="h-4 w-4" />
            </a>
          </div>

          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/38">Навигация</p>
            <ul className="mt-5 grid gap-3">
              {navLinks.map(([label, href]) => (
                <li key={label}>
                  <a href={href} className="text-sm font-bold text-white/62 transition hover:text-white">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/38">Направления</p>
            <ul className="mt-5 grid gap-3">
              {directions.map(([label, href]) => (
                <li key={label}>
                  <a href={href} className="text-sm font-bold text-white/62 transition hover:text-white">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/38">Контакты</p>
            <ul className="mt-5 grid gap-4">
              <li>
                <a
                  href="tel:+78001234567"
                  className="flex items-center gap-3 text-sm font-bold text-white/62 transition hover:text-white"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-gold-300">
                    <Icon name="phone" className="h-4 w-4" />
                  </span>
                  +7 (800) 123-45-67
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@razumeyka-school.ru"
                  className="flex items-center gap-3 text-sm font-bold text-white/62 transition hover:text-white"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-gold-300">
                    <Icon name="mail" className="h-4 w-4" />
                  </span>
                  info@razumeyka-school.ru
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-white/38">
            © {year} Разумейка. Все права защищены.
          </p>
          <div className="flex flex-wrap gap-5">
            <a href="/privacy" className="text-sm font-bold text-white/38 transition hover:text-white">
              Политика конфиденциальности
            </a>
            <a href="/offer" className="text-sm font-bold text-white/38 transition hover:text-white">
              Публичная оферта
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}