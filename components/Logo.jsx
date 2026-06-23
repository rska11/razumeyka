'use client';

const letters = [
  ['Р', '#3B82F6'],
  ['а', '#F59E0B'],
  ['з', '#EF4444'],
  ['у', '#22C55E'],
  ['м', '#06B6D4'],
  ['е', '#EAB308'],
  ['й', '#8B5CF6'],
  ['к', '#EC4899'],
  ['а', '#16A34A'],
];

export function Logo({ variant = 'nav' }) {
  const isHero = variant === 'hero';

  return (
    <span
      className={`inline-flex items-baseline whitespace-nowrap font-display font-black leading-none tracking-[-0.04em] ${
        isHero ? 'text-[2.55rem] sm:text-[3.3rem] lg:text-[3.9rem]' : 'text-[2.25rem] sm:text-[2.65rem] lg:text-[2.85rem]'
      }`}
      aria-label="Разумейка"
    >
      {letters.map(([letter, color], index) => (
        <span
          key={`${letter}-${index}`}
          style={{
            color,
            textShadow: '0 10px 26px rgba(19, 35, 27, 0.13)',
          }}
          className="transition duration-300 hover:-translate-y-0.5"
          aria-hidden="true"
        >
          {letter}
        </span>
      ))}
    </span>
  );
}