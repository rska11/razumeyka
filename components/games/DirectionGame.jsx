import { FlashCards } from './FlashCards.jsx';
import { SchulteTable } from './SchulteTable.jsx';
import { SymmetryDraw } from './SymmetryDraw.jsx';
import { IntuitionGuess } from './IntuitionGuess.jsx';
import { SchoolReadinessTest } from './SchoolReadinessTest.jsx';
import { WordCards } from './WordCards.jsx';
import { ActingPrompts } from './ActingPrompts.jsx';
import { RussianSpelling } from './RussianSpelling.jsx';

const games = {
  'mental-arithmetic': { title: 'Мини-игра: посчитай в уме', Comp: FlashCards },
  'speed-reading': { title: 'Мини-игра: таблица Шульте', Comp: SchulteTable },
  'right-brain-drawing': { title: 'Порисуем: волшебная симметрия', Comp: SymmetryDraw },
  'intuition': { title: 'Игра на интуицию', Comp: IntuitionGuess },
  'podgotovka-k-shkole': { title: 'Тест: готов ли ребёнок к школе?', Comp: SchoolReadinessTest },
  'english-for-kids': { title: 'Мини-игра: учим английские слова', Comp: WordCards },
  'russkiy-yazyk-dlya-detey': { title: 'Игра: как пишется правильно?', Comp: RussianSpelling },
  'akterskoe-masterstvo': { title: 'Актёрский тренажёр: изобрази!', Comp: ActingPrompts },
};

export function DirectionGame({ slug }) {
  const g = games[slug];
  if (!g) return null;
  const { Comp } = g;
  return (
    <section className="px-5 py-14 sm:px-8 lg:px-14">
      <div className="container-pad px-0">
        <div className="mx-auto max-w-2xl">
          <p className="text-center text-xs font-extrabold uppercase tracking-[0.16em] text-brand-blue">Поиграем?</p>
          <h2 className="section-title mt-2 text-center">{g.title}</h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-base font-medium text-ink/64">
            Попробуйте вместе с ребёнком — это бесплатно и весело. А в уроках-играх начнётся настоящее.
          </p>
          <div className="mt-7">
            <Comp />
          </div>
          <div className="mt-6 text-center">
            <a href="/risovanie" className="primary-btn">Начать бесплатно</a>
          </div>
        </div>
      </div>
    </section>
  );
}
