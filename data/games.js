// Единый каталог игр платформы. Здесь хранятся только данные, а клиентские
// загрузчики компонентов находятся в components/games/registry.client.js.
//
// ready        — игра технически готова к запуску;
// featured     — показываем в публичном «Игровом зале»;
// weekTrainer  — автоматически показываем в карточке недели курса.
// Эти флаги разделены намеренно: готовый внутренний тренажёр можно спокойно
// проверить и только потом выводить на витрину.

export const GAMES = [
  {
    id: 'bridge',
    aliases: ['most', 'most-cherez-reku'],
    title: 'Мост через реку',
    kicker: 'Числовой ряд',
    note: 'Веди лисёнка по камням — выбирай следующее число',
    skill: 'Прямой и обратный счёт, счёт двойками',
    direction: 'podgotovka-k-shkole',
    weeks: [3, 13],
    ages: '5–7 лет',
    free: true,
    ready: true,
    featured: true,
    weekTrainer: true,
  },
  {
    id: 'house',
    aliases: ['dom', 'dom-znaniy'],
    title: 'Дом знаний',
    kicker: 'Платформер',
    note: 'Бегай по комнатам и собирай цифры по порядку',
    skill: 'Числовой ряд, счёт двойками, обратный счёт',
    direction: 'podgotovka-k-shkole',
    // 3 — «Числовая мастерская», 13 — бонусная «Первые шаги к умножению».
    weeks: [3, 13],
    ages: '5–7 лет',
    free: true,
    ready: false,
    // На витрину выведем после живой проверки на телефоне.
    featured: false,
    weekTrainer: false,
  },
  {
    id: 'academy',
    aliases: ['portaly', 'portaly-znaytona', 'academy'],
    title: 'Порталы Знайтона',
    kicker: 'Большое приключение',
    note: 'Пройди Механическую академию: числа, сравнение, состав числа и закономерности открывают дорогу дальше',
    skill: 'Числовой ряд до 10, больше и меньше, состав числа 5, закономерности и внимание',
    direction: 'podgotovka-k-shkole',
    weeks: [],
    ages: '5–7 лет',
    free: true,
    ready: true,
    featured: true,
    weekTrainer: false,
  },
  {
    id: 'firefly',
    aliases: ['svetlyachok'],
    title: 'Светлячок',
    kicker: 'Рука к письму',
    note: 'Веди светлячка по дорожке до домика',
    skill: 'Графомоторика, плавность и точность движения',
    direction: 'podgotovka-k-shkole',
    weeks: [6],
    ages: '5–7 лет',
    free: true,
    ready: true,
    featured: false,
    weekTrainer: false,
  },
  {
    id: 'mental-quest',
    aliases: ['mental', 'abacus', 'zvezdnyy-abakus'],
    title: 'Звёздный абакус',
    kicker: 'Ментальная арифметика',
    note: 'Управляй полётом и проходи восемь числовых миссий',
    skill: 'Образ числа на абакусе, устный счёт, внимание и память',
    direction: 'mentalnaya-arifmetika',
    weeks: [],
    ages: '4–10 лет',
    free: true,
    ready: true,
    featured: true,
    weekTrainer: false,
  },
  {
    id: 'symmetry',
    aliases: ['simmetriya'],
    title: 'Волшебная симметрия',
    kicker: 'Рисование',
    note: 'Дорисуй вторую половину картинки',
    skill: 'Глазомер, координация и чувство симметрии',
    direction: 'risovanie',
    weeks: [],
    ages: '5–10 лет',
    free: true,
    ready: true,
    featured: false,
    weekTrainer: false,
  },
  {
    id: 'schulte',
    aliases: ['shulte'],
    title: 'Таблица Шульте',
    kicker: 'Внимание',
    note: 'Найди числа по порядку как можно быстрее',
    skill: 'Концентрация, поле зрения и переключение внимания',
    direction: null,
    weeks: [4],
    ages: '6–10 лет',
    free: true,
    ready: true,
    featured: false,
    weekTrainer: false,
  },
];

/** Тренажёры конкретной недели и конкретного направления. */
export function gamesForWeek(week, direction) {
  return GAMES.filter((game) =>
    game.ready
    && game.weekTrainer
    && game.weeks.includes(week)
    && (!direction || game.direction === direction));
}

/** Все технически готовые игры направления. */
export function gamesForDirection(slug) {
  return GAMES.filter((game) => game.ready && game.direction === slug);
}

/** Игры, одобренные для публичного игрового зала. */
export function featuredGames() {
  return GAMES.filter((game) => game.ready && game.featured);
}

export function getGame(id) {
  return GAMES.find((game) => game.id === id) || null;
}

/** Поддерживает короткие рекламные ссылки вроде /igry?game=most. */
export function resolveGameId(value) {
  const normalized = String(value || '').trim().toLowerCase();
  if (!normalized) return null;
  const game = GAMES.find((item) => item.id === normalized || item.aliases?.includes(normalized));
  return game?.id || null;
}