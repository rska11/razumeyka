'use client';

import { useEffect, useState } from 'react';
import { Icon } from './Icon.jsx';

export function StickyMobileCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setIsVisible(window.scrollY > 500);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 border-t border-white/60 bg-porcelain/96 px-4 pb-safe py-3 shadow-[0_-12px_32px_rgba(16,42,86,0.12)] backdrop-blur-2xl transition-transform duration-300 sm:hidden ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <a href="/#programs" className="primary-btn w-full justify-center py-4 text-base">
        <span className="relative">Открыть уроки</span>
        <Icon name="arrow" className="relative h-5 w-5" />
      </a>
    </div>
  );
}