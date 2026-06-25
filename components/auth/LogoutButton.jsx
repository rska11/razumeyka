'use client';

import { signOut } from 'next-auth/react';

export function LogoutButton({ className = '', children = 'Выйти' }) {
  return (
    <button type="button" onClick={() => signOut({ callbackUrl: '/' })} className={className}>
      {children}
    </button>
  );
}
