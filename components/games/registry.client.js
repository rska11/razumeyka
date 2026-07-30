'use client';

// Подключение компонентов игр по id из data/games.js.
//
// Файл отделён от данных намеренно: здесь живут ленивые импорты, а значит код
// каждой игры уезжает в свой чанк и грузится только когда игру открыли. На
// лендинге, который человек просто прокручивает, не выполняется ни строки
// игрового кода.
//
// fill: игра сама управляет своей высотой (канвас на весь контейнер) — такой
// оверлей не скроллится. Остальные игры — обычный поток с прокруткой.

import { lazy } from 'react';

export const GAME_COMPONENTS = {
  bridge: {
    fill: true,
    Comp: lazy(() =>
      import('@/components/school-prep/BridgeGame.jsx').then((mod) => ({ default: mod.BridgeGame })),
    ),
  },
  house: {
    fill: true,
    Comp: lazy(() =>
      import('@/components/school-prep/HouseGame.jsx').then((mod) => ({ default: mod.HouseGame })),
    ),
  },
  academy: {
    fill: true,
    Comp: lazy(() =>
      import('@/components/school-prep/AcademyGame.jsx').then((mod) => ({ default: mod.AcademyGame })),
    ),
  },
  firefly: {
    fill: true,
    Comp: lazy(() =>
      import('@/components/school-prep/FireflyGame.jsx').then((mod) => ({ default: mod.FireflyGame })),
    ),
  },
  'mental-quest': {
    fill: false,
    Comp: lazy(() =>
      import('@/components/mental/MentalNumberGame.jsx').then((mod) => ({ default: mod.MentalNumberGame })),
    ),
  },
  symmetry: {
    fill: false,
    Comp: lazy(() =>
      import('@/components/games/SymmetryDraw.jsx').then((mod) => ({ default: mod.SymmetryDraw })),
    ),
  },
  schulte: {
    fill: false,
    Comp: lazy(() =>
      import('@/components/games/SchulteTable.jsx').then((mod) => ({ default: mod.SchulteTable })),
    ),
  },
};

export function gameEntry(id) {
  return GAME_COMPONENTS[id] || null;
}
