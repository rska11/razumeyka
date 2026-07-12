'use client';

import { useState } from 'react';
import { AGE_OPTIONS, ArtworkPreview, ageBandLabel, sortByLikes, usePublishedArtworks, workWeekLabel } from './DrawingGallery.jsx';

export function ArtworkShowcase() {
  const published = usePublishedArtworks();
  const [activeAge, setActiveAge] = useState('3-4');
  const topWorks = sortByLikes(published.filter((item) => (item.ageBand ?? '3-4') === activeAge)).slice(0, 3);
  const podium = topWorks.slice(0, 3);
  const [opened, setOpened] = useState(null);

  return (
    <section id="raboty-nedeli" className="drawing-section drawing-showcase drawing-rating-teaser px-5 sm:px-8 lg:px-14">
      <div className="container-pad px-0">
        <div className="drawing-showcase-head">
          <div>
            <span>Рейтинг работ</span>
            <h2>Работы учеников, которые уже заметили.</h2>
            <p>
              На странице курса показываем только аккуратный рейтинг по возрасту. Полная галерея, загрузка работ и поддержка авторов находятся на отдельной странице.
            </p>
          </div>
          <a className="drawing-showcase-link" href="/risovanie/galereya">Открыть галерею</a>
        </div>

        <div className="drawing-age-filter drawing-age-filter-compact">
          {AGE_OPTIONS.map((age) => (
            <button key={age.key} type="button" onClick={() => setActiveAge(age.key)} className={activeAge === age.key ? 'drawing-age-filter-btn drawing-age-filter-btn-active' : 'drawing-age-filter-btn'}>
              <b>{age.label}</b><span>{age.note}</span>
            </button>
          ))}
        </div>

        <div className="drawing-rating-teaser-grid">
          <div className="drawing-podium-teaser">
            {podium.map((item, index) => (
              <article key={item.id} className={'drawing-podium-mini drawing-podium-mini-' + (index + 1)}>
                <button type="button" onClick={() => setOpened(item)} className="drawing-podium-preview">
                  <ArtworkPreview item={item} />
                  <span>Открыть работу</span>
                </button>
                <div>
                  <p>{index + 1} место · {workWeekLabel(item.week)}</p>
                  <h3>{item.title}</h3>
                  <small>{item.child}, {item.city}</small>
                  <b>♥ {item.likes ?? 0}</b>
                </div>
              </article>
            ))}
          </div>

          <aside className="drawing-rating-note">
            <span>Топ-3 {ageBandLabel(activeAge)}</span>
            <h3>Сейчас показываем только призёров</h3>
            <p>После запуска и первых реальных загрузок расширим рейтинг до топ-10. Пока так честнее и визуально чище.</p>
            <a className="drawing-gallery-more-link" href="/risovanie/galereya">Смотреть всю галерею</a>
          </aside>
        </div>
      </div>

      {opened && (
        <div className="drawing-art-modal" role="dialog" aria-modal="true" onClick={() => setOpened(null)}>
          <div className="drawing-art-modal-card" onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={() => setOpened(null)} className="drawing-art-modal-close">×</button>
            <ArtworkPreview item={opened} />
            <div>
              <p>{ageBandLabel(opened.ageBand ?? '3-4')} · {workWeekLabel(opened.week)}</p>
              <h3>{opened.title}</h3>
              <span>{opened.child}, {opened.city} · {opened.likes ?? 0} отметок</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
