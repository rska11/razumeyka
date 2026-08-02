'use client';

import { useState } from 'react';
import { Icon } from './Icon.jsx';
import { Logo } from './Logo.jsx';
import { AccountButton } from './auth/AccountButton.jsx';
import { reachGoal } from '@/lib/metrika';

const nav = [
  ['Возраст', '/#age'],
  ['Направления', '/#programs'],
  ['Игры', '/igry'],
  ['Результаты', '/#results'],
  ['Тарифы', '/tarify'],

  ['Блог', '/blog'],
];

export function Header({ primaryHref = '/#programs', primaryLabel = 'Начать бесплатно', primaryGoal = '', focused = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-4 sm:px-6 sm:pt-5">
      <div className="mx-auto flex min-h-[96px] max-w-[1380px] items-center justify-between gap-3 rounded-[8px] sm:gap-6 border border-white/70 bg-porcelain/86 px-5 py-4 shadow-color backdrop-blur-2xl sm:px-7 lg:px-8">
        <a href="/" className="flex items-center pr-2" aria-label="Знайтон — на главную">
          <Logo />
        </a>

        <nav className={`${focused ? 'hidden' : 'hidden lg:flex'} items-center gap-2 rounded-full border border-ink/8 bg-white/58 p-1.5 text-base font-extrabold text-ink/62 shadow-sm xl:gap-3`}>
          {nav.map(([item, href]) => (
            <a key={item} href={href} className="rounded-full px-5 py-3 transition hover:scale-[1.03] hover:bg-forest-900 hover:text-porcelain">
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <AccountButton className="hidden lg:inline-flex" />
          <a href={primaryHref} onClick={() => primaryGoal && reachGoal(primaryGoal, { source: 'header' })} className="primary-btn hidden min-h-[54px] px-7 py-3 text-base shadow-color hover:scale-105 md:inline-flex">
            {primaryLabel}
            <Icon name="arrow" className="relative h-5 w-5" />
          </a>
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-12 w-12 items-center justify-center rounded-[8px] border border-ink/10 bg-white/80 text-ink shadow-sm transition hover:bg-white lg:hidden"
            aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="mx-auto mt-2 max-w-[1380px] overflow-hidden rounded-[8px] border border-white/70 bg-porcelain/96 shadow-color backdrop-blur-2xl lg:hidden">
          <nav className="flex flex-col gap-1 p-4">
            {!focused && nav.map(([item, href]) => (
              <a
                key={item}
                href={href}
                onClick={closeMenu}
                className="flex items-center rounded-[8px] px-4 py-3.5 text-base font-extrabold text-ink/72 transition hover:bg-white/80 hover:text-ink"
              >
                {item}
              </a>
            ))}
            <a
              href={primaryHref}
              onClick={() => {
                primaryGoal && reachGoal(primaryGoal, { source: 'mobile_menu' });
                closeMenu();
              }}
              className="primary-btn mt-3 justify-center"
            >
              {primaryLabel}
              <Icon name="arrow" className="relative h-5 w-5" />
            </a>
            <AccountButton className="mt-2 justify-center" />
          </nav>
        </div>
      )}
    </header>
  );
}
