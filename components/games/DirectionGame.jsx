'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FlashCards } from './FlashCards.jsx';
import { SchulteTable } from './SchulteTable.jsx';
import { FieldOfVision } from './FieldOfVision.jsx';
import { WordPyramid } from './WordPyramid.jsx';
import { SymmetryDraw } from './SymmetryDraw.jsx';
import { IntuitionGuess } from './IntuitionGuess.jsx';
import { SchoolReadinessTest } from './SchoolReadinessTest.jsx';
import { WordCards } from './WordCards.jsx';
import { ActingPrompts } from './ActingPrompts.jsx';
import { RussianSpelling } from './RussianSpelling.jsx';

const SPEED_READING_TABS = [
  {
    id: 'field-of-vision',
    label: '👁️ Поле зрения',
    subtitle: 'Узнаём мелькающие слова целиком на адаптивной скорости',
    Comp: FieldOfVision,
  },
  {
    id: 'word-pyramid',
    label: '🔺 Пирамида чтения',
    subtitle: 'Расширяем боковое зрение по ступеням клиновидной таблицы',
    Comp: WordPyramid,
  },
  {
    id: 'schulte',
    label: '🔢 Таблица Шульте',
    subtitle: 'Классический тренажёр концентрации и скорости взгляда 1→25',
    Comp: SchulteTable,
  },
];

const games = {
  'mental-arithmetic': { title: 'Мини-игра: посчитай в уме', Comp: FlashCards },
  'speed-reading': { title: 'Попробуйте тренажёры скорочтения уже сейчас', multi: SPEED_READING_TABS },
  'right-brain-drawing': { title: 'Порисуем: волшебная симметрия', Comp: SymmetryDraw },
  'intuition': { title: 'Игра на интуицию', Comp: IntuitionGuess },
  'podgotovka-k-shkole': { title: 'Тест: готов ли ребёнок к школе?', Comp: SchoolReadinessTest },
  'english-for-kids': { title: 'Мини-игра: учим английские слова', Comp: WordCards },
  'russkiy-yazyk-dlya-detey': { title: 'Игра: как пишется правильно?', Comp: RussianSpelling },
  'akterskoe-masterstvo': { title: 'Актёрский тренажёр: изобрази!', Comp: ActingPrompts },
};

export function DirectionGame({ slug }) {
  const [activeTab, setActiveTab] = useState(0);
  const g = games[slug];
  if (!g) return null;

  const currentTab = g.multi ? g.multi[activeTab] || g.multi[0] : null;
  const Comp = currentTab ? currentTab.Comp : g.Comp;

  return (
    <section id="trainer" className="scroll-mt-24 px-5 py-14 sm:px-8 lg:px-14">
      <div className="container-pad px-0">
        <div className="mx-auto max-w-3xl">
          <p className="text-center text-xs font-extrabold uppercase tracking-[0.16em] text-brand-blue">
            {g.multi ? 'Тренажёры онлайн · бесплатно' : 'Поиграем?'}
          </p>
          <h2 className="section-title mt-2 text-center">{g.title}</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-base font-medium text-ink/64">
            {currentTab
              ? currentTab.subtitle
              : 'Попробуйте вместе с ребёнком — это бесплатно и весело. А в уроках-играх начнётся настоящее.'}
          </p>

          {g.multi && (
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {g.multi.map((tab, idx) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(idx)}
                  className={`rounded-full px-5 py-2.5 text-sm font-extrabold transition ${
                    activeTab === idx
                      ? 'bg-ink text-white shadow-color'
                      : 'border border-ink/10 bg-white text-ink/70 hover:border-brand-orange/40 hover:text-ink'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          <div className="mt-7">
            <Comp />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-center">
            <a href="/risovanie" className="primary-btn">Начать бесплатно</a>
            {g.multi && (
              <Link href="/igry" className="secondary-btn">
                Все бесплатные игры в Игровом зале →
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
