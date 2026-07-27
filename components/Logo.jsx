'use client';

const letters = [
  ['З', '#1262F3'],
  ['н', '#1647B8'],
  ['а', '#FF5A36'],
  ['й', '#7146F5'],
  ['т', '#12B8C8'],
  ['о', '#FFA70A'],
  ['н', '#102B63'],
];

function BrandMark({ className = '' }) {
  return (
    <svg viewBox="0 0 76 76" className={className} aria-hidden="true" focusable="false">
      <path d="M7 20c0-4 3-7 7-7 11 0 20 3 28 10v41c-9-6-20-8-35-8V20Z" fill="#1262F3" />
      <path d="M69 20c0-4-3-7-7-7-11 0-20 3-28 10v41c9-6 20-8 35-8V20Z" fill="#7146F5" />
      <path d="M7 51c7 0 13 1 19 3v11c-6-2-12-3-19-3V51Z" fill="#12B8C8" />
      <path d="M27 55c4 1 7 3 11 6v8c-4-3-7-5-11-6v-8Z" fill="#FF7A18" />
      <path d="M39 61c5-4 10-6 16-7v10c-6 1-11 3-16 6v-9Z" fill="#24C76A" />
      <path d="M39 21c-9 8-15 13-18 18 9 3 14 6 18 10-5 4-9 8-12 13" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m38 2 2.7 6.3L47 11l-6.3 2.7L38 20l-2.7-6.3L29 11l6.3-2.7L38 2Z" fill="#FFB300" />
    </svg>
  );
}

function GraduationCap() {
  return (
    <svg viewBox="0 0 54 32" className="pointer-events-none absolute -top-[0.72em] left-1/2 w-[1.22em] -translate-x-1/2" aria-hidden="true">
      <path d="M3 10 27 1l24 9-24 9L3 10Z" fill="#7146F5" />
      <path d="M13 15v7c7 7 21 7 28 0v-7l-14 5-14-5Z" fill="#5B36D6" />
      <path d="M50 11v10" fill="none" stroke="#1647B8" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="50" cy="24" r="3" fill="#1647B8" />
    </svg>
  );
}

export function Logo({ variant = 'nav', theme = 'light' }) {
  const isHero = variant === 'hero';
  const isDark = theme === 'dark';

  return (
    <span className={`inline-flex items-center whitespace-nowrap ${isHero ? 'gap-3 sm:gap-4' : 'gap-2.5 sm:gap-3'}`} aria-label="Знайтон — платформа для детей">
      <BrandMark className={`shrink-0 drop-shadow-[0_10px_24px_rgba(18,98,243,0.18)] ${isHero ? 'h-[4.6rem] w-[4.6rem] sm:h-[5.7rem] sm:w-[5.7rem]' : 'h-[3.25rem] w-[3.25rem] sm:h-[3.8rem] sm:w-[3.8rem]'}`} />
      <span className="flex flex-col">
        <span className={`inline-flex items-baseline font-display font-black leading-none tracking-[-0.055em] ${isHero ? 'text-[2.7rem] sm:text-[3.5rem] lg:text-[4rem]' : 'text-[2rem] sm:text-[2.45rem] lg:text-[2.65rem]'}`} aria-hidden="true">
          {letters.map(([letter, color], index) => (
            <span key={`${letter}-${index}`} className={`relative transition duration-300 hover:-translate-y-0.5 ${index === 3 ? 'z-[1]' : ''}`} style={{ color }}>
              {index === 3 && <GraduationCap />}
              {letter}
            </span>
          ))}
        </span>
        <span className={`mt-1 text-[0.48rem] font-black uppercase leading-none tracking-[0.2em] sm:text-[0.58rem] ${isDark ? 'text-white/62' : 'text-[#102B63]/68'}`}>
          платформа для детей
        </span>
      </span>
    </span>
  );
}
