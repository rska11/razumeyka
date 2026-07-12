import { readFileSync, writeFileSync } from 'node:fs';

const galleryFile = new URL('../components/drawing/DrawingGallery.jsx', import.meta.url);
let gallery = readFileSync(galleryFile, 'utf8');
gallery = gallery.replace(
  "const topWorks = sortByLikes(published.filter((item) => (item.ageBand ?? '3-4') === activeAge)).slice(0, 10);",
  "const topWorks = sortByLikes(published.filter((item) => (item.ageBand ?? '3-4') === activeAge)).slice(0, 3);",
);
gallery = gallery.replace(
  '<span>Топ категории {ageBandLabel(activeAge)}</span>',
  '<span>Топ-3 категории {ageBandLabel(activeAge)}</span>',
);
writeFileSync(galleryFile, gallery);

const teaserFile = new URL('../components/drawing/ArtworkShowcase.jsx', import.meta.url);
let teaser = readFileSync(teaserFile, 'utf8');
teaser = teaser.replace(
  "const topWorks = sortByLikes(published.filter((item) => (item.ageBand ?? '3-4') === activeAge)).slice(0, 10);",
  "const topWorks = sortByLikes(published.filter((item) => (item.ageBand ?? '3-4') === activeAge)).slice(0, 3);",
);
teaser = teaser.replace("  const rest = topWorks.slice(3);\n", "");
teaser = teaser.replace(
  `<div className="drawing-rating-table">
            <div className="drawing-ranking-title">
              <span>Топ {ageBandLabel(activeAge)}</span>
              <p>Наведи на строку, чтобы увидеть миниатюру</p>
            </div>
            {rest.map((item, index) => (
              <a key={item.id} href="/risovanie/galereya" className="drawing-rating-link-row">
                <span>{index + 4}</span>
                <div>
                  <b>{item.child}</b>
                  <small>{item.city} · {item.title}</small>
                </div>
                <strong>{item.likes ?? 0}</strong>
                <div className="drawing-hover-preview">
                  <ArtworkPreview item={item} />
                </div>
              </a>
            ))}
            <a className="drawing-gallery-more-link" href="/risovanie/galereya">Смотреть всю галерею</a>
          </div>`,
  `<aside className="drawing-rating-note">
            <span>Топ-3 {ageBandLabel(activeAge)}</span>
            <h3>Сейчас показываем только призёров</h3>
            <p>После запуска и первых реальных загрузок расширим рейтинг до топ-10. Пока так честнее и визуально чище.</p>
            <a className="drawing-gallery-more-link" href="/risovanie/galereya">Смотреть всю галерею</a>
          </aside>`,
);
writeFileSync(teaserFile, teaser);
