'use client';

import { useEffect } from 'react';
import { reachGoal } from '@/lib/metrika';

// Отправляет цель при показе страницы. onceKey защищает от повторной отправки
// при перезагрузке (страница «Спасибо» намекает обновлять её для статуса оплаты).
export function GoalOnMount({ goal, params, onceKey }) {
  useEffect(() => {
    if (onceKey) {
      try {
        const key = `ym_goal_${onceKey}`;
        if (localStorage.getItem(key) === '1') return;
        localStorage.setItem(key, '1');
      } catch {
        /* приватный режим — шлём без защиты от повтора */
      }
    }
    reachGoal(goal, params);
    // отправка ровно один раз на монтирование
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
