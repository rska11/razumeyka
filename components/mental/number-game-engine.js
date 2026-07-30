export const FREE_MISSIONS = 3;

export const MISSIONS = [
  { id: 1, title: 'Первый полёт', note: 'Числа от 1 до 5 на абакусе', mode: 'abacus', min: 1, max: 5, rounds: 8, speed: 9.5 },
  { id: 2, title: 'Выше облаков', note: 'Числа от 1 до 9 на абакусе', mode: 'abacus', min: 1, max: 9, rounds: 9, speed: 10 },
  { id: 3, title: 'Звёздная вспышка', note: 'Запомни исчезнувший абакус', mode: 'flash', min: 1, max: 9, rounds: 9, speed: 10.5, revealMs: 1750 },
  { id: 4, title: 'Ветер перемен', note: 'Сложение и вычитание в пределах 9', mode: 'calc', min: 1, max: 9, rounds: 10, speed: 10.5 },
  { id: 5, title: 'Орбита десятки', note: 'Состав числа 10', mode: 'friend', min: 1, max: 9, rounds: 10, speed: 11 },
  {
    id: 6,
    title: 'Метеорный маршрут',
    note: 'Числа до 20: сравнение, соседи и счёт',
    mode: 'mix',
    modes: ['abacus', 'compare', 'neighbor', 'calc', 'flash'],
    min: 1,
    max: 20,
    rounds: 12,
    speed: 11.5,
    revealMs: 1650,
  },
  { id: 7, title: 'Десятки и единицы', note: 'Разряды двузначных чисел до 49', mode: 'place', min: 10, max: 49, rounds: 12, speed: 11.5 },
  {
    id: 8,
    title: 'Космический марафон',
    note: 'Большой микс всех числовых механик',
    mode: 'mix',
    modes: ['place', 'compare', 'sequence', 'calc', 'neighbor', 'flash', 'friend'],
    min: 1,
    max: 49,
    rounds: 14,
    speed: 12,
    revealMs: 1550,
  },
];

function randomInt(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function shuffled(rng, items) {
  return [...items].sort(() => rng() - 0.5);
}

function makeChoices(rng, answer, min, max) {
  const choices = new Set([answer]);
  const distanceLimit = Math.max(2, Math.ceil((max - min) / 4));
  let guard = 0;
  while (choices.size < 3 && guard < 80) {
    const distance = randomInt(rng, 1, distanceLimit);
    const candidate = rng() > 0.5 ? answer + distance : answer - distance;
    if (candidate >= min && candidate <= max) choices.add(candidate);
    guard += 1;
  }
  for (let value = min; choices.size < 3 && value <= max; value += 1) choices.add(value);
  return shuffled(rng, [...choices]);
}

function differentAnswer(rng, min, max, previousAnswer) {
  let answer = randomInt(rng, min, max);
  let guard = 0;
  while (answer === previousAnswer && guard < 40) {
    answer = randomInt(rng, min, max);
    guard += 1;
  }
  return answer;
}

export function makeChallenge(mission, previousAnswer, roundIndex = 0, rng = Math.random) {
  const mode = mission.mode === 'mix'
    ? mission.modes[roundIndex % mission.modes.length]
    : mission.mode;

  let answer = differentAnswer(rng, mission.min, mission.max, previousAnswer);
  let choiceMin = mission.min;
  let choiceMax = mission.max;
  let label = '';
  let taskTitle = 'Прочитай абакус';
  let instruction = 'Посчитай активные бусины и выбери число';
  let explanation = '';

  if (mode === 'calc') {
    const maxDelta = mission.max > 20 ? 7 : 3;
    let start;
    let delta;
    let guard = 0;
    do {
      start = randomInt(rng, Math.max(1, mission.min), mission.max);
      delta = randomInt(rng, 1, maxDelta) * (rng() > 0.38 ? 1 : -1);
      answer = start + delta;
      guard += 1;
    } while ((answer < mission.min || answer > mission.max || answer === previousAnswer) && guard < 80);
    label = `${start} ${delta > 0 ? '+' : '−'} ${Math.abs(delta)}`;
    taskTitle = 'Реши пример';
    instruction = 'Вычисли ответ и выбери его на одной из трасс';
    explanation = `${label} = ${answer}`;
  } else if (mode === 'friend') {
    const base = randomInt(rng, 1, 9);
    answer = 10 - base;
    choiceMin = 1;
    choiceMax = 9;
    label = `${base} + ? = 10`;
    taskTitle = 'Собери десятку';
    instruction = 'Найди число, которого не хватает до 10';
    explanation = `${base} + ${answer} = 10`;
  } else if (mode === 'place') {
    choiceMin = 10;
    choiceMax = Math.max(12, mission.max);
    answer = differentAnswer(rng, choiceMin, choiceMax, previousAnswer);
    const tens = Math.floor(answer / 10);
    const ones = answer % 10;
    taskTitle = 'Разбери число по разрядам';
    instruction = 'Слева десятки, справа единицы — выбери всё число';
    explanation = `${answer} — это ${tens} ${tens === 1 ? 'десяток' : 'десятка'} и ${ones} ${ones === 1 ? 'единица' : ones >= 2 && ones <= 4 ? 'единицы' : 'единиц'}`;
  } else if (mode === 'neighbor') {
    const after = roundIndex % 2 === 0;
    const baseMin = after ? mission.min : mission.min + 1;
    const baseMax = after ? mission.max - 1 : mission.max;
    const base = randomInt(rng, baseMin, baseMax);
    answer = base + (after ? 1 : -1);
    label = after ? `После ${base} идёт…` : `Перед ${base} идёт…`;
    taskTitle = 'Найди соседа числа';
    instruction = after ? 'Выбери следующее число' : 'Выбери предыдущее число';
    explanation = after ? `${base}, ${answer} — считаем вперёд` : `${answer}, ${base} — считаем вперёд`;
  } else if (mode === 'compare') {
    const askGreater = roundIndex % 2 === 0;
    let left = randomInt(rng, mission.min, mission.max);
    let right = randomInt(rng, mission.min, mission.max);
    while (right === left) right = randomInt(rng, mission.min, mission.max);
    answer = askGreater ? Math.max(left, right) : Math.min(left, right);
    label = `${left}  или  ${right}`;
    taskTitle = askGreater ? 'Где число больше?' : 'Где число меньше?';
    instruction = askGreater ? 'Выбери большее из двух чисел' : 'Выбери меньшее из двух чисел';
    explanation = askGreater
      ? `${answer} больше, потому что оно дальше при счёте вперёд`
      : `${answer} меньше, потому что оно встречается раньше`;
  } else if (mode === 'sequence') {
    const descending = roundIndex % 2 === 1;
    const step = descending ? -2 : 2;
    const startMin = descending ? Math.max(mission.min + 6, 8) : mission.min;
    const startMax = descending ? mission.max : Math.max(mission.min, mission.max - 6);
    const start = randomInt(rng, startMin, startMax);
    const second = start + step;
    const third = second + step;
    answer = third + step;
    label = `${start}, ${second}, ${third}, …`;
    taskTitle = 'Продолжи числовой ряд';
    instruction = descending ? 'Каждый раз уменьшаем на 2' : 'Каждый раз увеличиваем на 2';
    explanation = `${third} ${step > 0 ? '+' : '−'} 2 = ${answer}`;
  } else {
    taskTitle = mode === 'flash' ? 'Запомни число' : 'Прочитай абакус';
    instruction = mode === 'flash'
      ? 'Абакус исчезнет — удержи число в памяти'
      : 'Верхняя активная бусина равна 5, нижние — по 1';
    const tens = Math.floor(answer / 10);
    const ones = answer % 10;
    explanation = answer >= 10
      ? `${answer} — это ${tens} десятка и ${ones} единиц`
      : `${answer >= 5 ? '5' : '0'} + ${answer % 5} = ${answer}`;
  }

  const values = makeChoices(rng, answer, choiceMin, choiceMax);
  return {
    id: `${mission.id}-${roundIndex}-${Math.floor(rng() * 1e9)}`,
    mode,
    answer,
    values,
    label,
    taskTitle,
    instruction,
    explanation,
    correctLane: values.indexOf(answer),
  };
}

export function starsFor(mistakes) {
  if (mistakes === 0) return 3;
  if (mistakes <= 2) return 2;
  return 1;
}
