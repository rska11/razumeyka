// Единый список игр платформы — как launch.js для дат запуска.
//
// Здесь ТОЛЬКО данные: ни компонентов, ни функций-загрузчиков. Файл читают и
// серверные страницы (бейджи в программе, будущая страница /igry, разметка для
// поиска), и клиентские компоненты, а функции из серверного компонента в
// клиентский передавать нельзя. Сами компоненты игр подключаются в
// components/games/registry.client.js по тому же id.
//
// Чтобы добавить игру: дописать сюда объект и загрузчик в registry.client.js.
// Бейдж в нужной неделе курса, карточка на странице игр и ссылка в направлении
// появятся сами.

export const GAMES = [
  {
    id: 'bridge',
    title: 'Мост через реку',
    kicker: 'Числовой ряд',
    note: 'Веди лисёнка по камням — выбирай следующее число',
    skill: 'Прямой и обратный счёт, счёт двойками',
    direction: 'podgotovka-k-shkole',
    // Недели курса «Подготовка к школе», навык которых игра тренирует:
    // 3 — «Числовая мастерская», 13 — бонусная «Первые шаги к умножению».
    weeks: [3, 13],
    ages: '5–7 лет',
    free: true,
    ready: true,
  },
  {
    id: 'firefly',
    title: 'Светлячок',
    kicker: 'Рука к письму',
    note: 'Веди светлячка по дорожке до домика',
    skill: 'Графомоторика, плавность и точность движения',
    direction: 'podgotovka-k-shkole',
    // 6 — «Мастерская умной руки».
    weeks: [6],
    ages: '5–7 лет',
    free: true,
    ready: true,
  },
  {
    id: 'mental-quest',
    title: 'Путь Искры',
    kicker: 'Абакус',
    note: 'Двенадцать уровней на счёт с бусинами',
    skill: 'Состав числа, счёт в уме, память',
    direction: 'mentalnaya-arifmetika',
    weeks: [],
    ages: '4–10 лет',
    free: true,
    ready: true,
  },
  {
    id: 'symmetry',
    title: 'Волшебная симметрия',
    kicker: 'Рисование',
    note: 'Дорисуй вторую половину картинки',
    skill: 'Глазомер, координация, симметрия',
    direction: 'risovanie',
    weeks: [],
    ages: '5–10 лет',
    free: true,
    ready: true,
  },
  {
    id: 'schulte',
    title: 'Таблица Шульте',
    kicker: 'Внимание',
    note: 'Найди числа по порядку как можно быстрее',
    skill: 'Концентрация, поле зрения, переключение',
    direction: null,
    // 4 — «Лаборатория внимания».
    weeks: [4],
    ages: '6–10 лет',
    free: true,
    ready: true,
  },
];

/** Игры, тренирующие навык конкретной недели курса подготовки к школе. */
export function gamesForWeek(week) {
  return GAMES.filter((game) => game.ready && game.weeks.includes(week));
}

/** Игры направления (для карточек направлений и страниц курсов). */
export function gamesForDirection(slug) {
  return GAMES.filter((game) => game.ready && game.direction === slug);
}

export function getGame(id) {
  return GAMES.find((game) => game.id === id) || null;
}
