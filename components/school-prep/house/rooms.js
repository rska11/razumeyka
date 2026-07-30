// Комнаты «Дома знаний». Каждая комната — отдельный уровень платформера.
//
// Правила раскладки (их проверяет scripts/test-house-game.mjs):
//  · соседние платформы — не выше 110 px и не дальше 170 px друг от друга,
//    иначе лисёнок физически не допрыгнет;
//  · каждая цифра лежит над какой-нибудь платформой, а не в воздухе;
//  · дверь стоит на достижимой платформе.
// Тест ловит поломанную раскладку раньше, чем на неё наткнётся ребёнок.

export const FLOOR = { x: 0, y: 492, w: 960, h: 48, kind: 'floor' };

export const ROOMS = [
  {
    id: 1,
    title: 'Прихожая',
    note: 'Собери числа от 1 до 5',
    hint: 'Бери цифры по порядку: 1, 2, 3…',
    theme: 'hall',
    order: [1, 2, 3, 4, 5],
    spawn: { x: 60, y: 430 },
    platforms: [
      FLOOR,
      { x: 120, y: 410, w: 150, h: 22, kind: 'bench' },
      { x: 380, y: 350, w: 140, h: 20, kind: 'shelf' },
      { x: 620, y: 402, w: 140, h: 22, kind: 'cabinet' },
      { x: 745, y: 300, w: 150, h: 20, kind: 'shelf' },
    ],
    items: [
      { x: 310, y: 452, value: 3 },
      { x: 190, y: 376, value: 1 },
      { x: 450, y: 316, value: 5 },
      { x: 690, y: 368, value: 2 },
      { x: 820, y: 266, value: 4 },
    ],
    hazards: [],
    key: null,
    door: { x: 878, y: 400 },
  },
  {
    id: 2,
    title: 'Кухня',
    note: 'Числа от 1 до 10',
    hint: 'Считай по порядку и не спеши',
    theme: 'kitchen',
    order: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    spawn: { x: 50, y: 430 },
    platforms: [
      FLOOR,
      { x: 40, y: 420, w: 210, h: 22, kind: 'counter' },
      { x: 170, y: 322, w: 150, h: 18, kind: 'shelf' },
      { x: 330, y: 400, w: 170, h: 22, kind: 'table' },
      { x: 420, y: 282, w: 150, h: 18, kind: 'shelf' },
      { x: 560, y: 440, w: 100, h: 18, kind: 'stool' },
      { x: 640, y: 336, w: 150, h: 20, kind: 'fridge' },
      { x: 780, y: 236, w: 160, h: 18, kind: 'shelf' },
    ],
    items: [
      { x: 345, y: 452, value: 4 },
      { x: 520, y: 452, value: 9 },
      { x: 120, y: 386, value: 1 },
      { x: 240, y: 288, value: 7 },
      { x: 400, y: 366, value: 2 },
      { x: 480, y: 248, value: 10 },
      { x: 600, y: 406, value: 5 },
      { x: 700, y: 302, value: 3 },
      { x: 850, y: 202, value: 8 },
      { x: 760, y: 452, value: 6 },
    ],
    hazards: [{ x: 250, y: 476, w: 60, h: 16, kind: 'puddle' }],
    key: null,
    door: { x: 890, y: 400 },
  },
  {
    id: 3,
    title: 'Гостиная',
    note: 'Обратный счёт от 10 до 1',
    hint: 'Теперь числа идут назад: 10, 9, 8…',
    theme: 'living',
    order: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
    spawn: { x: 60, y: 430 },
    platforms: [
      FLOOR,
      { x: 60, y: 414, w: 190, h: 22, kind: 'sofa' },
      { x: 300, y: 344, w: 140, h: 18, kind: 'shelf' },
      { x: 150, y: 268, w: 150, h: 18, kind: 'shelf' },
      { x: 470, y: 420, w: 150, h: 22, kind: 'table' },
      { x: 520, y: 312, w: 140, h: 18, kind: 'shelf' },
      { x: 700, y: 400, w: 150, h: 22, kind: 'cabinet' },
      { x: 760, y: 286, w: 160, h: 18, kind: 'shelf' },
      { x: 640, y: 200, w: 150, h: 18, kind: 'shelf' },
    ],
    items: [
      { x: 160, y: 380, value: 6 },
      { x: 370, y: 310, value: 10 },
      { x: 220, y: 234, value: 2 },
      { x: 540, y: 386, value: 8 },
      { x: 590, y: 278, value: 4 },
      { x: 770, y: 366, value: 7 },
      { x: 840, y: 252, value: 3 },
      { x: 710, y: 166, value: 1 },
      { x: 400, y: 452, value: 9 },
      { x: 660, y: 452, value: 5 },
    ],
    hazards: [{ x: 430, y: 476, w: 70, h: 16, kind: 'puddle' }],
    key: { x: 195, y: 380 },
    door: { x: 30, y: 400 },
  },
  {
    id: 4,
    title: 'Детская',
    note: 'Счёт двойками до 20',
    hint: 'Пропускай каждое второе: 2, 4, 6…',
    theme: 'kids',
    order: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
    spawn: { x: 60, y: 430 },
    platforms: [
      FLOOR,
      { x: 100, y: 420, w: 150, h: 22, kind: 'bed' },
      { x: 250, y: 330, w: 140, h: 18, kind: 'shelf' },
      { x: 90, y: 244, w: 140, h: 18, kind: 'shelf' },
      { x: 420, y: 396, w: 150, h: 22, kind: 'table' },
      { x: 430, y: 288, w: 140, h: 18, kind: 'shelf' },
      { x: 610, y: 356, w: 140, h: 20, kind: 'box' },
      { x: 620, y: 236, w: 150, h: 18, kind: 'shelf' },
      { x: 790, y: 420, w: 150, h: 22, kind: 'chest' },
      { x: 800, y: 318, w: 140, h: 18, kind: 'shelf' },
    ],
    items: [
      { x: 170, y: 386, value: 6 },
      { x: 320, y: 296, value: 14 },
      { x: 150, y: 210, value: 20 },
      { x: 490, y: 362, value: 2 },
      { x: 500, y: 254, value: 10 },
      { x: 680, y: 322, value: 4 },
      { x: 690, y: 202, value: 16 },
      { x: 860, y: 386, value: 8 },
      { x: 870, y: 284, value: 18 },
      { x: 560, y: 452, value: 12 },
    ],
    hazards: [
      { x: 300, y: 476, w: 60, h: 16, kind: 'puddle' },
      { x: 720, y: 476, w: 60, h: 16, kind: 'puddle' },
    ],
    key: { x: 215, y: 386 },
    door: { x: 890, y: 400 },
  },
  {
    id: 5,
    title: 'Библиотека',
    note: 'Второй десяток: 11–20',
    hint: 'После десяти идут 11, 12, 13…',
    theme: 'library',
    order: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    spawn: { x: 50, y: 430 },
    platforms: [
      FLOOR,
      { x: 40, y: 408, w: 160, h: 20, kind: 'shelf' },
      { x: 40, y: 300, w: 160, h: 20, kind: 'shelf' },
      { x: 230, y: 356, w: 150, h: 20, kind: 'shelf' },
      { x: 230, y: 246, w: 150, h: 20, kind: 'shelf' },
      { x: 420, y: 412, w: 150, h: 20, kind: 'table' },
      { x: 430, y: 306, w: 150, h: 20, kind: 'shelf' },
      { x: 440, y: 200, w: 150, h: 20, kind: 'shelf' },
      { x: 630, y: 360, w: 150, h: 20, kind: 'shelf' },
      { x: 640, y: 254, w: 150, h: 20, kind: 'shelf' },
      { x: 800, y: 414, w: 150, h: 20, kind: 'shelf' },
      { x: 810, y: 308, w: 140, h: 20, kind: 'shelf' },
    ],
    items: [
      { x: 110, y: 374, value: 15 },
      { x: 110, y: 266, value: 19 },
      { x: 300, y: 322, value: 11 },
      { x: 300, y: 212, value: 17 },
      { x: 490, y: 378, value: 13 },
      { x: 500, y: 272, value: 20 },
      { x: 510, y: 166, value: 12 },
      { x: 700, y: 326, value: 16 },
      { x: 710, y: 220, value: 14 },
      { x: 870, y: 380, value: 18 },
    ],
    hazards: [{ x: 590, y: 476, w: 70, h: 16, kind: 'puddle' }],
    key: { x: 875, y: 274 },
    door: { x: 20, y: 400 },
  },
  {
    id: 6,
    title: 'Чердак',
    note: 'Всё вперемешку и повыше',
    hint: 'Самая верхняя комната дома',
    theme: 'attic',
    order: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
    spawn: { x: 60, y: 430 },
    platforms: [
      FLOOR,
      { x: 110, y: 424, w: 130, h: 20, kind: 'box' },
      { x: 250, y: 332, w: 130, h: 18, kind: 'beam' },
      { x: 80, y: 246, w: 140, h: 18, kind: 'beam' },
      { x: 390, y: 420, w: 130, h: 20, kind: 'box' },
      { x: 400, y: 316, w: 130, h: 18, kind: 'beam' },
      { x: 250, y: 176, w: 150, h: 18, kind: 'beam' },
      { x: 560, y: 380, w: 130, h: 20, kind: 'box' },
      { x: 570, y: 272, w: 130, h: 18, kind: 'beam' },
      { x: 730, y: 424, w: 130, h: 20, kind: 'box' },
      { x: 740, y: 320, w: 140, h: 18, kind: 'beam' },
      { x: 730, y: 214, w: 150, h: 18, kind: 'beam' },
    ],
    items: [
      { x: 170, y: 390, value: 5 },
      { x: 310, y: 298, value: 13 },
      { x: 150, y: 212, value: 19 },
      { x: 450, y: 386, value: 1 },
      { x: 460, y: 282, value: 9 },
      { x: 320, y: 142, value: 17 },
      { x: 620, y: 346, value: 3 },
      { x: 630, y: 238, value: 11 },
      { x: 800, y: 286, value: 7 },
      { x: 800, y: 180, value: 15 },
    ],
    hazards: [
      { x: 300, y: 476, w: 70, h: 16, kind: 'puddle' },
      { x: 560, y: 476, w: 70, h: 16, kind: 'puddle' },
      { x: 860, y: 476, w: 60, h: 16, kind: 'puddle' },
    ],
    key: { x: 805, y: 168 },
    door: { x: 890, y: 400 },
  },
];

export function getRoom(index) {
  return ROOMS[index] || ROOMS[0];
}

// Мебель, под которой не помещается стоящий герой, доводим до пола.
// Иначе получается ловушка: пролезть нельзя, а формально герой «внутри»
// платформы — и столкновение выбрасывает его к её краю рывком.
const MIN_CLEARANCE = 62;

for (const room of ROOMS) {
  room.platforms = room.platforms.map((platform) => {
    if (platform.kind === 'floor') return platform;
    const bottom = platform.y + platform.h;
    if (bottom < FLOOR.y && FLOOR.y - bottom < MIN_CLEARANCE) {
      return { ...platform, h: FLOOR.y - platform.y, grounded: true };
    }
    return platform;
  });
}
