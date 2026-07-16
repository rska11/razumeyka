'use client';

import { useState } from 'react';
import { AGE_OPTIONS, ArtworkPreview, ageBandLabel, galleryScopeLabel, sortByLikes, useArtworkLikes, usePublishedArtworks } from './DrawingGallery.jsx';

export function ArtworkShowcase() {
  const rawPublished = usePublishedArtworks();
  const { liked, withLikes, likeWork } = useArtworkLikes();
  const published = withLikes(rawPublished);
  const [activeAge, setActiveAge] = useState('3-4');
  const [opened, setOpened] = useState(null);
  const ageWorks = sortByLikes(published.filter((item) => (item.ageBand ?? '3-4') === activeAge));
  const topWorks = ageWorks.slice(0, 4);
  const totalLikes = ageWorks.reduce((sum, item) => sum + (item.likes ?? 0), 0);

  return (
    <section id="raboty-nedeli" className="drawing-showcase-compact px-5 sm:px-8 lg:px-14">
      <div className="container-pad px-0">
        <div className="drawing-showcase-panel">
          <div className="drawing-showcase-compact-head">
            <div>
              <span>Работы учеников</span>
              <h2>Живая галерея, которая растёт вместе с детьми.</h2>
              <p>Переключайте возраст и смотрите, как меняются сюжеты, детали и уверенность юных художников.</p>
            </div>
            <a className="drawing-showcase-link" href="/risovanie/galereya">Открыть всю галерею</a>
          </div>

          <div className="drawing-showcase-compact-main">
            <aside className="drawing-showcase-side-card">
              <div className="drawing-age-filter drawing-age-filter-showcase">
                {AGE_OPTIONS.map((age) => (
                  <button key={age.key} type="button" onClick={() => setActiveAge(age.key)} className={activeAge === age.key ? 'drawing-age-filter-btn drawing-age-filter-btn-active' : 'drawing-age-filter-btn'}>
                    <b>{age.label}</b><span>{age.note}</span>
                  </button>
                ))}
              </div>
              <div className="drawing-showcase-mini-stats">
                <div><b>{ageWorks.length}</b><span>работ в галерее</span></div>
                <div><b>{totalLikes}</b><span>отметок зрителей</span></div>
              </div>
            </aside>

            <div className="drawing-showcase-strip">
              {topWorks.map((item, index) => (
                <article key={item.id} className="drawing-showcase-work">
                  <button type="button" onClick={() => setOpened(item)} className="drawing-showcase-work-image">
                    <ArtworkPreview item={item} />
                    <span>Открыть</span>
                  </button>
                  <div className="drawing-showcase-work-body">
                    <p>#{index + 1} · {ageBandLabel(item.ageBand ?? '3-4')}</p>
                    <h3>{item.title}</h3>
                    <small>{item.child}, {item.city}</small>
                    <button type="button" className={liked.has(item.id) ? 'drawing-like-btn drawing-like-btn-liked' : 'drawing-like-btn'} onClick={() => likeWork(item)} disabled={liked.has(item.id)}>
                      ♥ {item.likes ?? 0}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>

      {opened && (
        <div className="drawing-art-modal" role="dialog" aria-modal="true" onClick={() => setOpened(null)}>
          <div className="drawing-art-modal-card" onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={() => setOpened(null)} className="drawing-art-modal-close">×</button>
            <ArtworkPreview item={opened} />
            <div>
              <p>{ageBandLabel(opened.ageBand ?? '3-4')} · {galleryScopeLabel(opened)}</p>
              <h3>{opened.title}</h3>
              <span>{opened.child}, {opened.city} · {opened.likes ?? 0} отметок</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
