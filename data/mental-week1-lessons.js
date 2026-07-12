// Продолжение первого месяца: завершённая первая учебная неделя, дни 2–5.
// Все значения остаются в пределах одного разряда абакуса (0–9).
export const mentalWeekOneLessons = [
  {
    slug: 'ma-m1-d02-soberi-6-9', day: 2, order: 2, title: 'Собери большие числа', kind: 'practice', skill: 'Набираем 6, 7, 8 и 9', free: false, cover: { emoji: '🖐️' },
    intro: 'Пятёрка зовёт нижние бусины — собираем все большие числа самостоятельно.',
    steps: [
      { type: 'set', target: 6, text: 'Набери 6: пятёрка и одна единица.', say: 'Набери шесть: пятёрка и одна единица.' },
      { type: 'read', value: 7, text: 'Какое число собрал абакус?', say: 'Какое число собрал абакус?' },
      { type: 'set', target: 8, text: 'Теперь собери 8.', say: 'Теперь собери восемь.' },
      { type: 'read', value: 9, text: 'Самое большое число дня. Что это?', say: 'Самое большое число дня. Что это?' },
      { type: 'set', target: 7, text: 'Финал: набери 7 одним уверенным движением.', say: 'Финал: набери семь.' },
    ], parentNote: 'Попросите ребёнка объяснить любое число от 6 до 9 словами: «8 — это 5 и ещё 3».',
  },
  {
    slug: 'ma-m1-d02-sostav-chisla', day: 2, order: 3, title: 'Пятёрка и её друзья', kind: 'learn', skill: 'Понимаем состав 6–9', free: false, cover: { emoji: '🧩' },
    intro: 'Не заучиваем числа — разбираем их как конструктор из пятёрки и единиц.',
    steps: [
      { type: 'teach', show: 5, text: 'Пятёрка — основа всех больших чисел этого дня.', say: 'Пятёрка — основа всех больших чисел.' },
      { type: 'teach', show: 6, text: '5 и ещё 1 — это 6.', say: 'Пять и ещё один — это шесть.' },
      { type: 'teach', show: 8, text: '5 и ещё 3 — это 8.', say: 'Пять и ещё три — это восемь.' },
      { type: 'read', value: 7, text: 'Сколько друзей пришло к пятёрке?', say: 'Какое число получилось?' },
      { type: 'read', value: 9, text: 'Пятёрка и все четыре единицы — это…', say: 'Пятёрка и четыре единицы. Сколько всего?' },
    ], parentNote: 'Поиграйте устно: вы называете 5, ребёнок добавляет нужное количество, чтобы получить 6, 7, 8 или 9.',
  },
  {
    slug: 'ma-m1-d02-flash-6-9', day: 2, order: 4, title: 'Флеш-карты 6–9', kind: 'flash', skill: 'Узнаём пятёрку и единицы сразу', free: false, cover: { emoji: '⚡' },
    intro: 'Фотографируем большие числа взглядом — без пересчёта каждой бусины.',
    steps: [
      { type: 'teach', show: 8, text: 'Смотри сначала на верхнюю пятёрку, затем одним взглядом замечай нижние бусины.', say: 'Сначала замечай пятёрку, потом нижние бусины.' },
      { type: 'flash', cards: [6], speedMs: 1700, text: 'Первое число.', say: 'Лови первое число.' },
      { type: 'flash', cards: [8], speedMs: 1500, text: 'Теперь быстрее.', say: 'Теперь быстрее.' },
      { type: 'flash', cards: [7], speedMs: 1300, text: 'Не пересчитывай — узнай картинку.', say: 'Узнай картинку целиком.' },
      { type: 'flash', cards: [9], speedMs: 1200, text: 'Финальная карточка!', say: 'Финальная карточка!' },
    ], parentNote: 'Если ребёнок пересчитывает бусины — это нормально. Скорость появится после уверенного узнавания.',
  },
  {
    slug: 'ma-m1-d02-bolshie-plus-minus', day: 2, order: 5, title: 'Большие числа: +1 и −1', kind: 'solve', skill: 'Меняем числа 5–9 на одну бусину', free: false, cover: { emoji: '➕' },
    intro: 'Большое число тоже легко изменить: нижняя бусина добавляет или убирает единицу.',
    steps: [
      { type: 'solve', chain: [5, 1], useAbacus: true, text: '5 + 1. Каким станет число?', say: 'Пять плюс один.' },
      { type: 'solve', chain: [6, 1], useAbacus: true, text: '6 + 1', say: 'Шесть плюс один.' },
      { type: 'solve', chain: [9, -1], useAbacus: true, text: '9 − 1', say: 'Девять минус один.' },
      { type: 'solve', chain: [7, 2], useAbacus: true, text: '7 + 2', say: 'Семь плюс два.' },
      { type: 'solve', chain: [8, -2], useAbacus: true, text: '8 − 2', say: 'Восемь минус два.' },
    ], parentNote: 'Главное — ребёнок двигает только нижние единицы и сохраняет верхнюю пятёрку у перекладины.',
  },

  {
    slug: 'ma-m1-d03-chitayu-sam', day: 3, order: 1, title: 'Читаю абакус сам', kind: 'practice', skill: 'Узнаём любые числа 1–9', free: false, cover: { emoji: '👀' },
    intro: 'Сегодня подсказок меньше: смотри на бусины и называй число целиком.',
    steps: [1, 4, 6, 9, 7].map((value) => ({ type: 'read', value, text: 'Какое число на абакусе?', say: 'Какое число на абакусе?' })),
    parentNote: 'Попросите не торопиться: сначала верхняя бусина, затем нижние. Правильная стратегия важнее скорости.',
  },
  {
    slug: 'ma-m1-d03-nabirayu-sam', day: 3, order: 2, title: 'Набираю без подсказки', kind: 'practice', skill: 'Переводим цифру в бусины', free: false, cover: { emoji: '☝️' },
    intro: 'Экран называет цифру, а ребёнок сам решает, какие бусины придвинуть.',
    steps: [3, 8, 2, 9, 5].map((target) => ({ type: 'set', target, text: `Набери число ${target}.`, say: `Набери число ${target}.` })),
    parentNote: 'Следите, чтобы числа 5–9 набирались верхней бусиной и единицами, а не долгим перебором.',
  },
  {
    slug: 'ma-m1-d03-flash-miks', day: 3, order: 3, title: 'Числа вперемешку', kind: 'flash', skill: 'Переключаемся между малыми и большими', free: false, cover: { emoji: '🎴' },
    intro: 'Маленькие и большие числа появляются без очереди — учимся быстро менять способ чтения.',
    steps: [
      { type: 'flash', cards: [2], speedMs: 1500, text: 'Лови число.', say: 'Лови число.' },
      { type: 'flash', cards: [7], speedMs: 1500, text: 'Теперь число с пятёркой.', say: 'Теперь число с пятёркой.' },
      { type: 'flash', cards: [4], speedMs: 1300, text: 'Снова маленькое.', say: 'Снова маленькое.' },
      { type: 'flash', cards: [9], speedMs: 1300, text: 'Самое большое.', say: 'Самое большое.' },
      { type: 'flash', cards: [6], speedMs: 1100, text: 'Финиш!', say: 'Финиш!' },
    ], parentNote: 'Хороший результат — узнавать форму числа, а не угадывать по очередности карточек.',
  },
  {
    slug: 'ma-m1-d03-perekluchenie', day: 3, order: 4, title: 'Увидел — собрал', kind: 'game', skill: 'Чередуем чтение и набор', free: false, cover: { emoji: '🔁' },
    intro: 'То читаем готовый абакус, то сами собираем число — внимание постоянно переключается.',
    steps: [
      { type: 'read', value: 3, text: 'Прочитай число.', say: 'Прочитай число.' },
      { type: 'set', target: 7, text: 'А теперь набери 7.', say: 'Теперь набери семь.' },
      { type: 'read', value: 8, text: 'Какое число видишь?', say: 'Какое число видишь?' },
      { type: 'set', target: 4, text: 'Набери 4.', say: 'Набери четыре.' },
      { type: 'read', value: 6, text: 'Последнее число.', say: 'Последнее число.' },
    ], parentNote: 'Такая смена заданий тренирует не только счёт, но и гибкость внимания.',
  },
  {
    slug: 'ma-m1-d03-detektiv', day: 3, order: 5, title: 'Числовой детектив', kind: 'game', skill: 'Итог дня без подсказок', free: false, cover: { emoji: '🔎' },
    intro: 'Финальная проверка: прочитай, собери и поймай числа разными способами.',
    steps: [
      { type: 'read', value: 5, text: 'Найди число.', say: 'Найди число.' },
      { type: 'set', target: 9, text: 'Собери 9.', say: 'Собери девять.' },
      { type: 'flash', cards: [7], speedMs: 1200, text: 'Поймай карточку.', say: 'Поймай карточку.' },
      { type: 'set', target: 1, text: 'Собери самое маленькое число дня.', say: 'Собери один.' },
      { type: 'read', value: 8, text: 'Раскрой последнюю загадку.', say: 'Раскрой последнюю загадку.' },
    ], parentNote: 'Попросите ребёнка назвать задание, которое показалось самым лёгким, и объяснить почему.',
  },

  {
    slug: 'ma-m1-d04-plus-odin', day: 4, order: 1, title: 'Прибавляем один', kind: 'solve', skill: 'Движение одной бусины вверх', free: false, cover: { emoji: '➕' }, intro: 'Каждый пример меняется одним точным движением.',
    steps: [[1,1],[2,1],[3,1],[6,1],[8,1]].map((chain) => ({ type: 'solve', chain, useAbacus: true, text: `${chain[0]} + 1`, say: `${chain[0]} плюс один.` })), parentNote: 'Пусть ребёнок проговаривает: «было — прибавил — стало».',
  },
  {
    slug: 'ma-m1-d04-minus-odin', day: 4, order: 2, title: 'Отнимаем один', kind: 'solve', skill: 'Движение одной бусины вниз', free: false, cover: { emoji: '➖' }, intro: 'Чтобы отнять один, возвращаем одну единичную бусину от перекладины.',
    steps: [[4,-1],[3,-1],[9,-1],[7,-1],[6,-1]].map((chain) => ({ type: 'solve', chain, useAbacus: true, text: `${chain[0]} − 1`, say: `${chain[0]} минус один.` })), parentNote: 'Не подсказывайте ответ заранее — попросите показать изменение на абакусе.',
  },
  {
    slug: 'ma-m1-d04-plus-dva', day: 4, order: 3, title: 'Прибавляем два', kind: 'practice', skill: 'Два последовательных движения', free: false, cover: { emoji: '⬆️' }, intro: 'Прибавляем две единицы по одной и не теряем промежуточное число.',
    steps: [[1,2],[2,2],[5,2],[6,2],[7,2]].map((chain) => ({ type: 'solve', chain, useAbacus: true, text: `${chain[0]} + 2`, say: `${chain[0]} плюс два.` })), parentNote: 'Если сложно, разрешите прибавить сначала один, назвать число, затем ещё один.',
  },
  {
    slug: 'ma-m1-d04-minus-dva', day: 4, order: 4, title: 'Отнимаем два', kind: 'practice', skill: 'Удерживаем число между действиями', free: false, cover: { emoji: '⬇️' }, intro: 'Убираем две единицы по очереди и следим, как меняется число.',
    steps: [[4,-2],[3,-2],[9,-2],[8,-2],[7,-2]].map((chain) => ({ type: 'solve', chain, useAbacus: true, text: `${chain[0]} − 2`, say: `${chain[0]} минус два.` })), parentNote: 'Просите делать два отдельных движения, а не пытаться угадать итог.',
  },
  {
    slug: 'ma-m1-d04-miks', day: 4, order: 5, title: 'Плюс или минус?', kind: 'game', skill: 'Выбираем правильное направление', free: false, cover: { emoji: '↕️' }, intro: 'Знак примера подсказывает направление: к перекладине или от неё.',
    steps: [
      { type: 'solve', chain: [2,1], useAbacus: true, text: '2 + 1', say: 'Два плюс один.' },
      { type: 'solve', chain: [4,-1], useAbacus: true, text: '4 − 1', say: 'Четыре минус один.' },
      { type: 'solve', chain: [5,2], useAbacus: true, text: '5 + 2', say: 'Пять плюс два.' },
      { type: 'solve', chain: [9,-2], useAbacus: true, text: '9 − 2', say: 'Девять минус два.' },
      { type: 'solve', chain: [3,1,1,-1], useAbacus: true, text: '3 + 1 + 1 − 1', say: 'Три плюс один, плюс один, минус один.' },
    ], parentNote: 'Перед движением спросите: «Бусина идёт к перекладине или от неё?»',
  },

  {
    slug: 'ma-m1-d05-flash-1-4', day: 5, order: 1, title: 'Разгон: числа 1–4', kind: 'flash', skill: 'Быстро узнаём единицы', free: false, cover: { emoji: '🏁' }, intro: 'Разогреваем взгляд на знакомых маленьких числах.',
    steps: [1,3,2,4,1].map((value, index) => ({ type: 'flash', cards: [value], speedMs: 1300-index*100, text: 'Какое число мелькнуло?', say: 'Какое число мелькнуло?' })), parentNote: 'Не соревнуйтесь со скоростью экрана — цель в уверенном образе числа.',
  },
  {
    slug: 'ma-m1-d05-flash-5-9', day: 5, order: 2, title: 'Разгон: числа 5–9', kind: 'flash', skill: 'Мгновенно замечаем пятёрку', free: false, cover: { emoji: '⚡' }, intro: 'Теперь тренируем большие числа: верхняя бусина помогает узнать их быстрее.',
    steps: [5,7,9,6,8].map((value, index) => ({ type: 'flash', cards: [value], speedMs: 1400-index*100, text: 'Поймай большое число.', say: 'Поймай большое число.' })), parentNote: 'Напомните: сначала увидеть пятёрку, потом количество нижних бусин.',
  },
  {
    slug: 'ma-m1-d05-flash-miks', day: 5, order: 3, title: 'Скоростной микс', kind: 'flash', skill: 'Переключаемся без порядка', free: false, cover: { emoji: '🎯' }, intro: 'Числа идут вперемешку и становятся чуть быстрее.',
    steps: [2,8,4,6,9].map((value, index) => ({ type: 'flash', cards: [value], speedMs: 1200-index*80, text: 'Смотри на весь абакус.', say: 'Смотри на весь абакус.' })), parentNote: 'Если на последних карточках много ошибок, повторите урок завтра на более медленной возрастной ступени.',
  },
  {
    slug: 'ma-m1-d05-summa-kart', day: 5, order: 4, title: 'Сложи две карточки', kind: 'solve', skill: 'Удерживаем два образа числа', free: false, cover: { emoji: '🧠' }, intro: 'Две карточки появляются подряд. Удержи обе в памяти и сложи.',
    steps: [
      { type: 'flash', cards: [1,2], speedMs: 1500, text: 'Сложи два числа.', say: 'Сложи два числа.' },
      { type: 'flash', cards: [2,2], speedMs: 1450, text: 'Ещё одна пара.', say: 'Ещё одна пара.' },
      { type: 'flash', cards: [3,2], speedMs: 1400, text: 'Удержи оба образа.', say: 'Удержи оба образа.' },
      { type: 'flash', cards: [5,2], speedMs: 1400, text: 'Пятёрка и ещё число.', say: 'Пятёрка и ещё число.' },
      { type: 'flash', cards: [4,4], speedMs: 1300, text: 'Финальная сумма.', say: 'Финальная сумма.' },
    ], parentNote: 'Это первый шаг к ментальному счёту: удержать две картинки и соединить их.',
  },
  {
    slug: 'ma-m1-d05-rekord', day: 5, order: 5, title: 'Мой рекорд недели', kind: 'game', skill: 'Чтение, набор и счёт вместе', free: false, cover: { emoji: '🏆' }, intro: 'Финал первой недели объединяет все навыки — без сравнения с другими детьми.',
    steps: [
      { type: 'read', value: 8, text: 'Прочитай число.', say: 'Прочитай число.' },
      { type: 'set', target: 6, text: 'Набери 6.', say: 'Набери шесть.' },
      { type: 'flash', cards: [9], speedMs: 1100, text: 'Поймай быструю карточку.', say: 'Поймай быструю карточку.' },
      { type: 'solve', chain: [5,2], useAbacus: true, text: '5 + 2', say: 'Пять плюс два.' },
      { type: 'solve', chain: [8,-2,1], useAbacus: true, text: '8 − 2 + 1', say: 'Восемь минус два, плюс один.' },
    ], parentNote: 'Сравнивайте ребёнка только с ним самим: что сегодня получилось быстрее или увереннее, чем в день 1?',
  },
];
