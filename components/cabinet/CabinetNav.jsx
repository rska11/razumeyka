'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

const links = [
  ['/cabinet', 'Обзор', 'M3 12l9-9 9 9M5 10v10h14V10'],
  ['/cabinet/children', 'Дети', 'M12 11a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0'],
  ['/cabinet/schedule', 'Расписание', 'M8 2v4M16 2v4M3 10h18M5 6h14v14H5z'],
  ['/cabinet/payments', 'Оплаты', 'M3 7h18v10H3zM3 11h18'],
];

export function CabinetNav({ isAdmin = false }) {
  const pathname = usePathname();

  return (
    <nav className="mt-5 grid gap-1">
      {links.map(([href, label, d]) => {
        const active = href === '/cabinet' ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-[14px] px-3 py-2.5 text-sm font-extrabold transition ${
              active ? 'bg-ink text-white shadow-[0_10px_24px_rgba(16,42,86,0.16)]' : 'text-ink/64 hover:bg-ink/[0.05] hover:text-ink'
            }`}
          >
            <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={d} />
            </svg>
            {label}
          </Link>
        );
      })}

      {isAdmin && (
        <Link
          href="/admin"
          className={`mt-1 flex items-center gap-3 rounded-[14px] px-3 py-2.5 text-sm font-extrabold transition ${
            pathname.startsWith('/admin') ? 'bg-ink text-white' : 'text-brand-blue hover:bg-brand-blue/8'
          }`}
        >
          <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-4z" />
          </svg>
          Админка
        </Link>
      )}

      <button
        type="button"
        onClick={() => signOut({ callbackUrl: '/' })}
        className="mt-2 flex items-center gap-3 rounded-[14px] px-3 py-2.5 text-sm font-extrabold text-ink/52 transition hover:bg-brand-red/8 hover:text-brand-red"
      >
        <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 17l5-5-5-5M21 12H9M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
        </svg>
        Выйти
      </button>
    </nav>
  );
}
