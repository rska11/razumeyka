'use client';

import { reachGoal } from '@/lib/metrika';

export function TrackedLink({ goal, params, href, children, ...props }) {
  return (
    <a
      href={href}
      onClick={() => reachGoal(goal, params)}
      {...props}
    >
      {children}
    </a>
  );
}
