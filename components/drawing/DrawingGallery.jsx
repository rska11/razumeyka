'use client';

import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'razumeyka_drawing_artwork_uploads';
const LIKED_KEY = 'razumeyka_drawing_liked_artworks';

export const AGE_OPTIONS = [
  { key: '3-4', label: '3-4 года', note: 'малыши' },
  { key: '5-7', label: '5-7 лет', note: 'дошкольники' },
  { key: '8-10', label: '8-10 лет', note: 'старшие' },
];

export const WEEK_OPTIONS = [
  { key: 'week-1', label: 'Итоги недели 1', short: 'Неделя 1', hint: 'после дней 1-5' },
  { key: 'week-2', label: 'Итоги недели 2', short: 'Неделя 2', hint: 'после дней 6-10' },
  { key: 'week-3', label: 'Итоги недели 3', short: 'Неделя 3', hint: 'после дней 11-15' },
  { key: 'week-4', label: 'Итоги недели 4', short: 'Неделя 4', hint: 'после дней 16-20' },
  { key: 'final', label: 'Финальный рисунок месяца', short: 'Финал', hint: 'главная работа месяца' },
];

export const fallbackWorks = [
  {
    "id": "demo-3-4-1",
    "child": "Саша М.",
    "city": "Краснодар",
    "title": "Солнечный сад",
    "week": "week-1",
    "ageBand": "3-4",
    "likes": 128,
    "imageUrl": "/images/drawing-gallery/age-3-4-sunny-garden.png"
  },
  {
    "id": "demo-3-4-2",
    "child": "Мира К.",
    "city": "Казань",
    "title": "Добрый робот",
    "week": "week-2",
    "ageBand": "3-4",
    "likes": 117,
    "imageUrl": "/images/drawing-gallery/age-3-4-kind-robot.png"
  },
  {
    "id": "demo-3-4-3",
    "child": "Лёва П.",
    "city": "Самара",
    "title": "Домик с солнышком",
    "week": "week-1",
    "ageBand": "3-4",
    "likes": 109,
    "imageUrl": "/images/drawing-gallery/age-3-4-sunny-house.png"
  },
  {
    "id": "demo-3-4-4",
    "child": "Варя Н.",
    "city": "Тула",
    "title": "Рыжий котёнок",
    "week": "week-2",
    "ageBand": "3-4",
    "likes": 101,
    "imageUrl": "/images/drawing-gallery/age-3-4-orange-cat.png"
  },
  {
    "id": "demo-3-4-5",
    "child": "Марк С.",
    "city": "Воронеж",
    "title": "Красный автобус",
    "week": "week-3",
    "ageBand": "3-4",
    "likes": 96,
    "imageUrl": "/images/drawing-gallery/age-3-4-red-bus.png"
  },
  {
    "id": "demo-3-4-6",
    "child": "Аня Д.",
    "city": "Пермь",
    "title": "Мишка с шариком",
    "week": "week-3",
    "ageBand": "3-4",
    "likes": 91,
    "imageUrl": "/images/drawing-gallery/age-3-4-teddy-balloon.png"
  },
  {
    "id": "demo-3-4-7",
    "child": "Тёма В.",
    "city": "Ярославль",
    "title": "Рыбка под водой",
    "week": "week-4",
    "ageBand": "3-4",
    "likes": 86,
    "imageUrl": "/images/drawing-gallery/age-3-4-rainbow-fish.png"
  },
  {
    "id": "demo-3-4-8",
    "child": "Лиза Б.",
    "city": "Омск",
    "title": "Бабочка на лугу",
    "week": "week-4",
    "ageBand": "3-4",
    "likes": 82,
    "imageUrl": "/images/drawing-gallery/age-3-4-butterfly.png"
  },
  {
    "id": "demo-3-4-9",
    "child": "Кира Ф.",
    "city": "Уфа",
    "title": "Праздничный торт",
    "week": "final",
    "ageBand": "3-4",
    "likes": 77,
    "imageUrl": "/images/drawing-gallery/age-3-4-birthday-cake.png"
  },
  {
    "id": "demo-3-4-10",
    "child": "Платон Г.",
    "city": "Ижевск",
    "title": "Яблоня и корзинка",
    "week": "final",
    "ageBand": "3-4",
    "likes": 72,
    "imageUrl": "/images/drawing-gallery/age-3-4-apple-tree.png"
  },
  {
    "id": "demo-5-7-1",
    "child": "Тимур А.",
    "city": "Москва",
    "title": "Городской парк",
    "week": "week-1",
    "ageBand": "5-7",
    "likes": 132,
    "imageUrl": "/images/drawing-gallery/age-5-7-city-park.png"
  },
  {
    "id": "demo-5-7-2",
    "child": "Алиса Р.",
    "city": "Екатеринбург",
    "title": "Дракон и фея",
    "week": "week-3",
    "ageBand": "5-7",
    "likes": 123,
    "imageUrl": "/images/drawing-gallery/age-5-7-dragon-fairy.png"
  },
  {
    "id": "demo-5-7-3",
    "child": "София З.",
    "city": "Нижний Новгород",
    "title": "Пикник зверят",
    "week": "week-1",
    "ageBand": "5-7",
    "likes": 115,
    "imageUrl": "/images/drawing-gallery/age-5-7-animal-picnic.png"
  },
  {
    "id": "demo-5-7-4",
    "child": "Егор Л.",
    "city": "Новосибирск",
    "title": "Завтрак на столе",
    "week": "week-2",
    "ageBand": "5-7",
    "likes": 108,
    "imageUrl": "/images/drawing-gallery/age-5-7-breakfast-table.png"
  },
  {
    "id": "demo-5-7-5",
    "child": "Полина Ч.",
    "city": "Ростов-на-Дону",
    "title": "Скворечник в саду",
    "week": "week-2",
    "ageBand": "5-7",
    "likes": 101,
    "imageUrl": "/images/drawing-gallery/age-5-7-birdhouse-garden.png"
  },
  {
    "id": "demo-5-7-6",
    "child": "Матвей О.",
    "city": "Калининград",
    "title": "Замок у ручья",
    "week": "week-3",
    "ageBand": "5-7",
    "likes": 96,
    "imageUrl": "/images/drawing-gallery/age-5-7-castle-bridge.png"
  },
  {
    "id": "demo-5-7-7",
    "child": "Маша Т.",
    "city": "Сочи",
    "title": "Дождик и зонтик",
    "week": "week-4",
    "ageBand": "5-7",
    "likes": 90,
    "imageUrl": "/images/drawing-gallery/age-5-7-rainy-umbrella.png"
  },
  {
    "id": "demo-5-7-8",
    "child": "Рома И.",
    "city": "Киров",
    "title": "Ферма с подсолнухами",
    "week": "week-4",
    "ageBand": "5-7",
    "likes": 86,
    "imageUrl": "/images/drawing-gallery/age-5-7-farm-sunflowers.png"
  },
  {
    "id": "demo-5-7-9",
    "child": "Элина Ж.",
    "city": "Тюмень",
    "title": "Комната перед сном",
    "week": "final",
    "ageBand": "5-7",
    "likes": 81,
    "imageUrl": "/images/drawing-gallery/age-5-7-cozy-bedroom.png"
  },
  {
    "id": "demo-5-7-10",
    "child": "Глеб Ю.",
    "city": "Саратов",
    "title": "Цирк на лугу",
    "week": "final",
    "ageBand": "5-7",
    "likes": 77,
    "imageUrl": "/images/drawing-gallery/age-5-7-circus-seal.png"
  },
  {
    "id": "demo-8-10-1",
    "child": "Никита С.",
    "city": "Ростов-на-Дону",
    "title": "Выставка месяца",
    "week": "final",
    "ageBand": "8-10",
    "likes": 140,
    "imageUrl": "/images/drawing-gallery/age-8-10-exhibition.png"
  },
  {
    "id": "demo-8-10-2",
    "child": "Вера Л.",
    "city": "Пермь",
    "title": "Музей динозавров",
    "week": "week-4",
    "ageBand": "8-10",
    "likes": 129,
    "imageUrl": "/images/drawing-gallery/age-8-10-dino-museum.png"
  },
  {
    "id": "demo-8-10-3",
    "child": "Даня К.",
    "city": "Санкт-Петербург",
    "title": "Вечерний город",
    "week": "week-1",
    "ageBand": "8-10",
    "likes": 121,
    "imageUrl": "/images/drawing-gallery/age-8-10-city-evening.png"
  },
  {
    "id": "demo-8-10-4",
    "child": "Милана П.",
    "city": "Казань",
    "title": "Карта сказочной страны",
    "week": "week-1",
    "ageBand": "8-10",
    "likes": 114,
    "imageUrl": "/images/drawing-gallery/age-8-10-fantasy-map.png"
  },
  {
    "id": "demo-8-10-5",
    "child": "Илья Б.",
    "city": "Красноярск",
    "title": "Уголок библиотеки",
    "week": "week-2",
    "ageBand": "8-10",
    "likes": 107,
    "imageUrl": "/images/drawing-gallery/age-8-10-library-cat.png"
  },
  {
    "id": "demo-8-10-6",
    "child": "Арина Г.",
    "city": "Владимир",
    "title": "Мастерская робота",
    "week": "week-2",
    "ageBand": "8-10",
    "likes": 100,
    "imageUrl": "/images/drawing-gallery/age-8-10-robot-workshop.png"
  },
  {
    "id": "demo-8-10-7",
    "child": "Фёдор Е.",
    "city": "Барнаул",
    "title": "Осенний парк",
    "week": "week-3",
    "ageBand": "8-10",
    "likes": 94,
    "imageUrl": "/images/drawing-gallery/age-8-10-autumn-park.png"
  },
  {
    "id": "demo-8-10-8",
    "child": "Ксюша А.",
    "city": "Самара",
    "title": "Тёплая оранжерея",
    "week": "week-3",
    "ageBand": "8-10",
    "likes": 89,
    "imageUrl": "/images/drawing-gallery/age-8-10-greenhouse.png"
  },
  {
    "id": "demo-8-10-9",
    "child": "Степан М.",
    "city": "Челябинск",
    "title": "Сцена театра",
    "week": "week-4",
    "ageBand": "8-10",
    "likes": 83,
    "imageUrl": "/images/drawing-gallery/age-8-10-theater-stage.png"
  },
  {
    "id": "demo-8-10-10",
    "child": "Лада Ш.",
    "city": "Иркутск",
    "title": "Горы на рассвете",
    "week": "final",
    "ageBand": "8-10",
    "likes": 78,
    "imageUrl": "/images/drawing-gallery/age-8-10-mountain-river.png"
  }
];

export function ArtworkPreview({ item, className = '' }) {
  return <img className={'drawing-real-art ' + className} src={item.imageUrl} alt={item.title} />;
}

export function sortByLikes(items) {
  return [...items].sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
}

export function workWeekLabel(week) {
  return WEEK_OPTIONS.find((item) => item.key === week)?.label ?? 'Итоги недели';
}

export function ageBandLabel(ageBand) {
  return AGE_OPTIONS.find((item) => item.key === ageBand)?.label ?? '3-4 года';
}

function readStoredUploads() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function readLiked() {
  try {
    return new Set(JSON.parse(localStorage.getItem(LIKED_KEY) || '[]'));
  } catch {
    return new Set();
  }
}

export function usePublishedArtworks() {
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    fetch('/api/drawing/artworks?limit=120')
      .then((response) => response.json())
      .then((data) => setGallery(Array.isArray(data.artworks) ? data.artworks : []))
      .catch(() => setGallery([]));
  }, []);

  return gallery.length ? gallery : fallbackWorks;
}

export function DrawingGallery() {
  const [form, setForm] = useState({ child: '', city: '', title: '', week: 'week-1', ageBand: '3-4' });
  const [preview, setPreview] = useState('');
  const [fileName, setFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [activeWeek, setActiveWeek] = useState('week-1');
  const [activeAge, setActiveAge] = useState('3-4');
  const [liked, setLiked] = useState(() => new Set());
  const [opened, setOpened] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const published = usePublishedArtworks();

  useEffect(() => {
    setUploads(readStoredUploads());
    setLiked(readLiked());
  }, []);

  const activeWorks = sortByLikes(published.filter((item) => item.week === activeWeek && (item.ageBand ?? '3-4') === activeAge));
  const topWorks = sortByLikes(published.filter((item) => (item.ageBand ?? '3-4') === activeAge)).slice(0, 3);
  const canSubmit = selectedFile && preview && form.child.trim() && form.city.trim() && form.title.trim();
  const latestUpload = useMemo(() => uploads[0], [uploads]);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function chooseFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    setSelectedFile(file);
    setError('');

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(String(reader.result || ''));
      setFileName(file.name);
    };
    reader.readAsDataURL(file);
  }

  async function submitArtwork(event) {
    event.preventDefault();
    if (!canSubmit || isSending) return;

    setIsSending(true);
    setError('');

    const body = new FormData();
    body.append('child', form.child.trim());
    body.append('city', form.city.trim());
    body.append('title', form.title.trim());
    body.append('week', form.week);
    body.append('ageBand', form.ageBand);
    body.append('artwork', selectedFile);

    try {
      const response = await fetch('/api/drawing/artworks', { method: 'POST', body });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Не получилось отправить работу.');

      const item = { ...data.artwork, image: preview };
      const next = [item, ...uploads].slice(0, 3);
      setUploads(next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      setForm((current) => ({ child: '', city: '', title: '', week: current.week, ageBand: current.ageBand }));
      setPreview('');
      setFileName('');
      setSelectedFile(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Не получилось отправить работу.');
    } finally {
      setIsSending(false);
    }
  }

  async function likeWork(item) {
    if (item.id.startsWith('demo-') || liked.has(item.id)) return;
    const nextLiked = new Set(liked);
    nextLiked.add(item.id);
    setLiked(nextLiked);
    try {
      localStorage.setItem(LIKED_KEY, JSON.stringify([...nextLiked]));
    } catch {}

    try {
      await fetch('/api/drawing/artworks/' + item.id + '/like', { method: 'POST' });
    } catch {}
  }

  return (
    <>
      <section className="drawing-gallery-hero px-5 pb-16 pt-28 sm:px-8 lg:px-14">
        <div className="container-pad px-0">
          <a className="drawing-back-link" href="/risovanie">← Вернуться к урокам</a>
          <div className="drawing-gallery-hero-grid">
            <div>
              <span className="drawing-eyebrow"><span className="drawing-eyebrow-dot" /> Галерея учеников</span>
              <h1>Работы детей, которые становятся заметными</h1>
              <p>Здесь публикуются одобренные рисунки после недельных заданий. Можно поддержать автора, посмотреть лидеров по возрастам и отправить свою работу на модерацию.</p>
              <div className="drawing-gallery-actions">
                <a href="#upload-artwork" className="drawing-primary-btn">Загрузить работу</a>
                <a href="#gallery-grid" className="drawing-ghost-btn">Смотреть галерею</a>
              </div>
            </div>
            <div className="drawing-gallery-top-card">
              {topWorks[0] && <ArtworkPreview item={topWorks[0]} />}
              <div>
                <span>Лидер категории {ageBandLabel(activeAge)}</span>
                <h3>{topWorks[0]?.title}</h3>
                <p>{topWorks[0]?.child}, {topWorks[0]?.city} · {topWorks[0]?.likes ?? 0} отметок</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="gallery-grid" className="drawing-section drawing-gallery-page px-5 sm:px-8 lg:px-14">
        <div className="container-pad px-0">
          <div className="drawing-age-filter">
            {AGE_OPTIONS.map((age) => (
              <button key={age.key} type="button" onClick={() => setActiveAge(age.key)} className={activeAge === age.key ? 'drawing-age-filter-btn drawing-age-filter-btn-active' : 'drawing-age-filter-btn'}>
                <b>{age.label}</b><span>{age.note}</span>
              </button>
            ))}
          </div>

          <div className="drawing-week-tabs" aria-label="Разделы галереи">
            {WEEK_OPTIONS.map((week) => (
              <button key={week.key} type="button" onClick={() => setActiveWeek(week.key)} className={activeWeek === week.key ? 'drawing-week-tab drawing-week-tab-active' : 'drawing-week-tab'}>
                <b>{week.short}</b>
                <span>{week.hint}</span>
              </button>
            ))}
          </div>

          <div className="drawing-gallery-page-grid">
            {activeWorks.map((item, index) => (
              <article key={item.id} className="drawing-gallery-tile">
                <button type="button" onClick={() => setOpened(item)} className="drawing-gallery-image-button">
                  <ArtworkPreview item={item} />
                  <span>Открыть</span>
                </button>
                <div className="drawing-gallery-tile-body">
                  <div>
                    <p>#{index + 1} · {ageBandLabel(item.ageBand ?? '3-4')} · {workWeekLabel(item.week)}</p>
                    <h3>{item.title}</h3>
                    <small>{item.child}, {item.city}</small>
                  </div>
                  <button type="button" onClick={() => likeWork(item)} disabled={item.id.startsWith('demo-') || liked.has(item.id)}>
                    ♥ {item.likes ?? 0}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-24 sm:px-8 lg:px-14">
        <div className="container-pad px-0">
          <div className="drawing-gallery-bottom">
            <div className="drawing-week-list">
              <div className="drawing-ranking-title">
                <span>Топ-3 категории {ageBandLabel(activeAge)}</span>
                <p>Лидеры по отметкам зрителей</p>
              </div>
              {topWorks.map((item, index) => (
                <button key={item.id} type="button" onClick={() => setOpened(item)} className="drawing-ranking-row drawing-ranking-row-button">
                  <span>{index + 1}</span>
                  <div>
                    <b>{item.child}</b>
                    <small>{item.city} · {item.title}</small>
                  </div>
                  <strong>{item.likes ?? 0}</strong>
                </button>
              ))}
            </div>

            <form id="upload-artwork" className="drawing-upload-card" onSubmit={submitArtwork}>
              <div>
                <span>Заявка на выставку</span>
                <h3>Загрузите фото свободной работы</h3>
                <p>Выберите возраст и неделю, прикрепите фото рисунка и отправьте на модерацию. После одобрения работа появится в своей возрастной категории.</p>
              </div>

              <select value={form.ageBand} onChange={(event) => updateField('ageBand', event.target.value)} className="drawing-upload-select">
                {AGE_OPTIONS.map((age) => <option key={age.key} value={age.key}>{age.label}</option>)}
              </select>
              <select value={form.week} onChange={(event) => updateField('week', event.target.value)} className="drawing-upload-select">
                {WEEK_OPTIONS.map((week) => <option key={week.key} value={week.key}>{week.label}</option>)}
              </select>

              <label className={'drawing-upload-drop ' + (preview ? 'drawing-upload-drop-filled' : '')}>
                {preview ? <img src={preview} alt="Превью загруженной работы" /> : <span>Выбрать фото рисунка</span>}
                <input type="file" accept="image/*" onChange={chooseFile} />
              </label>
              {fileName && <p className="drawing-upload-file">{fileName}</p>}

              <div className="drawing-upload-fields">
                <input value={form.child} onChange={(event) => updateField('child', event.target.value)} placeholder="Имя ребёнка: Саша М." />
                <input value={form.city} onChange={(event) => updateField('city', event.target.value)} placeholder="Город: Краснодар" />
                <input value={form.title} onChange={(event) => updateField('title', event.target.value)} placeholder="Название работы" />
              </div>

              <button type="submit" disabled={!canSubmit || isSending}>{isSending ? 'Отправляем...' : 'Отправить на модерацию'}</button>
              {error && <div className="drawing-upload-error">{error}</div>}

              {latestUpload && (
                <div className="drawing-upload-status">
                  <b>На модерации: {ageBandLabel(latestUpload.ageBand ?? '3-4')} · {workWeekLabel(latestUpload.week)}</b>
                  <span>{latestUpload.child}, {latestUpload.city} · «{latestUpload.title}»</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

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
    </>
  );
}
