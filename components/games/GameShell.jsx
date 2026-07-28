'use client';

// Общая оболочка для любой игры платформы.
//
// Раньше эта обвязка (портал, Esc, блокировка прокрутки, возврат фокуса) жила
// внутри секции «Моста через реку». Каждая следующая игра означала копипасту
// полутора сотен строк. Теперь она одна на всех: кнопка + оверлей + ленивая
// загрузка компонента по id из data/games.js.
//
// Пример: <GameLauncher gameId="bridge" className="…">🎮 Играть</GameLauncher>

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { getGame } from '@/data/games.js';
import { gameEntry } from './registry.client.js';

function Loading() {
  return (
    <div className={'flex h-full min-h-[240px] items-center justify-center text-sm font-bold text-white/60'}>
      Загружаем игру…
    </div>
  );
}

export function GameOverlay({ title, onClose, fill = false, restoreFocusTo, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    // Кнопку-открывашку берём из ref, а не из document.activeElement: клик мышью
    // фокус на кнопку ставит, а запуск с клавиатуры или из кода — нет.
    const opener = (restoreFocusTo && restoreFocusTo.current) || document.activeElement;
    document.body.style.overflow = 'hidden';

    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', onKey);

    const focusTimer = window.setTimeout(() => {
      if (dialogRef.current) dialogRef.current.focus();
    }, 30);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
      window.clearTimeout(focusTimer);
      // Фокус возвращаем на кнопку, с которой игру открыли: иначе после
      // закрытия клавиатурный пользователь оказывается в начале страницы.
      if (opener && typeof opener.focus === 'function') opener.focus();
    };
  }, [onClose, restoreFocusTo]);

  return createPortal(
    <div
      // Фон — инлайн-стилем намеренно: класс с произвольным цветом и
      // прозрачностью (bg-[#070E20]/97) в сборку не попадает, и оверлей
      // остаётся прозрачным.
      className={'fixed inset-0 z-[90] flex flex-col p-3 sm:p-6'}
      style={{ backgroundColor: '#070E20' }}
      role={'dialog'}
      aria-modal={'true'}
      aria-label={title ? 'Игра «' + title + '»' : 'Игра'}
      ref={dialogRef}
      tabIndex={-1}
    >
      <div className={'mx-auto flex h-full w-full max-w-5xl flex-col'}>
        <div className={'mb-3 flex items-center justify-between gap-3'}>
          <p className={'truncate font-display text-sm font-extrabold text-white/70'}>{title}</p>
          <button
            type={'button'}
            onClick={onClose}
            className={'shrink-0 rounded-full border border-white/20 px-4 py-2 text-xs font-extrabold text-white transition hover:border-white/40'}
          >
            ✕ Закрыть
          </button>
        </div>
        <div className={'min-h-0 flex-1 ' + (fill ? '' : 'overflow-y-auto')}>{children}</div>
      </div>
    </div>,
    document.body,
  );
}

export function GameLauncher({ gameId, hasAccess = false, className, children, onOpen, defaultOpen = false }) {
  const [open, setOpen] = useState(Boolean(defaultOpen));
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  const game = getGame(gameId);
  const entry = gameEntry(gameId);
  // Игры нет в реестре — кнопку не рисуем вовсе, чтобы не вести в пустоту.
  if (!game || !game.ready || !entry) return null;
  const { Comp, fill } = entry;

  return (
    <>
      <button
        ref={buttonRef}
        type={'button'}
        onClick={() => {
          setOpen(true);
          if (onOpen) onOpen(game);
        }}
        className={className}
      >
        {children}
      </button>

      {mounted && open && (
        <GameOverlay title={game.title} onClose={close} fill={fill} restoreFocusTo={buttonRef}>
          <Suspense fallback={<Loading />}>
            {/* Игры принимают разные пропсы (доступ к курсу называется
                по-разному) — передаём оба, лишний просто игнорируется. */}
            <Comp hasAccess={hasAccess} hasSubscription={hasAccess} onExit={close} />
          </Suspense>
        </GameOverlay>
      )}
    </>
  );
}
