// Движок игры «Светлячок» — подготовка руки к письму (неделя 6 курса).
//
// Ребёнок ведёт светлячка по светящейся дорожке от старта к домику. Пока
// светлячок на дорожке — он светит и продвигается; сошёл — свет гаснет и
// путь не идёт. Никакой картинки не рисуется: это не рисование, а тренировка
// плавного управляемого движения, из которого потом вырастает письмо.
// Поэтому дорожки идут от простой линии к элементам букв и цифр.
//
// Как и в «Мосте», движок ничего не знает про DOM: он получает координаты
// указателя в координатах мира и отдаёт состояние. Проверяется симуляцией.

export const WORLD_W = 960;
export const WORLD_H = 540;
export const STEP = 1 / 60;

// Насколько далеко вперёд по дорожке можно «зацепиться» за точку. Ограничение
// не даёт срезать угол и перепрыгнуть сразу к домику.
export const LOOKAHEAD = 12;
export const SAMPLES = 190;

// Мышью попадать в узкую дорожку заметно труднее, чем пальцем, — на компьютере
// добавляем запас по ширине, иначе игра превращается в борьбу с мышью.
export const MOUSE_BONUS = 9;

export const LEVELS = [
  { id: 1, title: 'Прямая дорожка', note: 'Ровно и не спеша', shape: 'line', width: 38, seconds: 30 },
  { id: 2, title: 'Волна', note: 'Плавные подъёмы и спуски', shape: 'wave', width: 36, seconds: 32 },
  { id: 3, title: 'Горки', note: 'Острые повороты', shape: 'zigzag', width: 36, seconds: 34 },
  { id: 4, title: 'Радуга', note: 'Большая дуга', shape: 'arc', width: 34, seconds: 32 },
  { id: 5, title: 'Волна поменьше', note: 'Мельче волна — точнее рука', shape: 'wave2', width: 30, seconds: 34 },
  { id: 6, title: 'Крючки', note: 'Элемент письменных букв', shape: 'hooks', width: 30, seconds: 36 },
  { id: 7, title: 'Петельки', note: 'Из них состоят буквы', shape: 'loops', width: 28, seconds: 38 },
  { id: 8, title: 'Улитка', note: 'Спираль — самое сложное', shape: 'spiral', width: 28, seconds: 40 },
];

// Дорожки заданы формулой и разворачиваются в набор точек: движку удобнее
// считать расстояние до точки, а художнику — рисовать по тем же точкам.
function pathPoints(shape) {
  const points = [];
  const left = 120;
  const right = WORLD_W - 130;
  const mid = 300;

  for (let i = 0; i < SAMPLES; i += 1) {
    const t = i / (SAMPLES - 1);
    let x = left + (right - left) * t;
    let y = mid;

    if (shape === 'line') {
      y = mid + 40;
    } else if (shape === 'wave') {
      y = mid + Math.sin(t * Math.PI * 2) * 105;
    } else if (shape === 'wave2') {
      y = mid + Math.sin(t * Math.PI * 4) * 85;
    } else if (shape === 'zigzag') {
      const phase = (t * 4) % 1;
      const up = Math.floor(t * 4) % 2 === 0;
      y = mid + (up ? -1 : 1) * (phase - 0.5) * 190;
    } else if (shape === 'arc') {
      y = mid + 120 - Math.sin(t * Math.PI) * 235;
    } else if (shape === 'hooks') {
      const phase = (t * 4) % 1;
      y = mid + 60 - Math.pow(Math.sin(phase * Math.PI), 0.75) * 160;
    } else if (shape === 'loops') {
      const angle = t * Math.PI * 6;
      y = mid + Math.sin(angle) * 95;
      x = left + (right - left) * t + Math.cos(angle) * 34;
    } else if (shape === 'spiral') {
      const angle = t * Math.PI * 5.4;
      const radius = 40 + t * 150;
      x = WORLD_W / 2 + Math.cos(angle) * radius * 1.35;
      y = mid + 10 + Math.sin(angle) * radius * 0.72;
    }

    points.push({ x, y });
  }

  // Спираль удобнее вести из центра наружу — переворачиваем.
  if (shape === 'spiral') points.reverse();
  return points;
}

export function starsFor(accuracy) {
  if (accuracy >= 0.92) return 3;
  if (accuracy >= 0.76) return 2;
  return 1;
}

export function createGame(levelIndex, options) {
  const level = LEVELS[levelIndex] || LEVELS[0];
  const pointerType = (options && options.pointerType) || 'touch';
  const points = pathPoints(level.shape);
  return {
    level,
    levelIndex,
    points,
    pointerType,
    radius: level.width / 2 + (pointerType === 'mouse' ? MOUSE_BONUS : 0),
    status: 'run',
    index: 0,
    energy: level.seconds,
    maxEnergy: level.seconds,
    lit: false,
    holding: false,
    inside: 0,
    outside: 0,
    checkpoint: 0,
    time: 0,
    pointer: { x: points[0].x, y: points[0].y, active: false },
    firefly: { x: points[0].x, y: points[0].y },
    sparks: [],
    events: [],
  };
}

export function setPointer(state, x, y, active) {
  state.pointer.x = x;
  state.pointer.y = y;
  state.pointer.active = active;
  state.holding = active;
}

export function setPointerType(state, type) {
  state.pointerType = type;
  state.radius = state.level.width / 2 + (type === 'mouse' ? MOUSE_BONUS : 0);
}

export function progress(state) {
  return state.index / (state.points.length - 1);
}

export function accuracy(state) {
  const total = state.inside + state.outside;
  return total === 0 ? 1 : state.inside / total;
}

function addSpark(state, x, y) {
  if (state.sparks.length > 60) return;
  state.sparks.push({ x, y, life: 0, max: 0.55 });
}

export function update(state, dt) {
  state.time += dt;

  for (let i = state.sparks.length - 1; i >= 0; i -= 1) {
    const spark = state.sparks[i];
    spark.life += dt;
    if (spark.life >= spark.max) state.sparks.splice(i, 1);
  }

  if (state.status !== 'run') return;

  // Светлячок тянется к пальцу, а не прыгает за ним: так линия получается
  // плавной, а не дёрганой, и ребёнку видно, что он ведёт живое существо.
  state.firefly.x += (state.pointer.x - state.firefly.x) * Math.min(1, dt * 18);
  state.firefly.y += (state.pointer.y - state.firefly.y) * Math.min(1, dt * 18);

  if (!state.holding) {
    if (state.lit) state.events.push('lost');
    state.lit = false;
    // Пока не ведут — фонарик почти не тратится: ребёнок может остановиться,
    // поправить руку и продолжить. Наказывать за паузу нельзя.
    state.energy = Math.max(0, state.energy - dt * 0.35);
    if (state.energy <= 0) state.status = 'tired';
    return;
  }

  let best = -1;
  let bestDistance = Infinity;
  const last = Math.min(state.points.length - 1, state.index + LOOKAHEAD);
  for (let i = state.index; i <= last; i += 1) {
    const point = state.points[i];
    const dx = point.x - state.pointer.x;
    const dy = point.y - state.pointer.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = i;
    }
  }

  const wasLit = state.lit;
  state.lit = bestDistance <= state.radius;

  if (state.lit) {
    state.inside += 1;
    if (best > state.index) {
      state.index = best;
      if (state.index - state.checkpoint >= 24) {
        state.checkpoint = state.index;
        addSpark(state, state.points[state.index].x, state.points[state.index].y);
        state.events.push('sparkle');
      }
    }
    state.energy = Math.max(0, state.energy - dt);
  } else {
    state.outside += 1;
    if (wasLit) state.events.push('lost');
    // Сошёл с дорожки — фонарик тратится быстрее, но путь не сбрасывается:
    // вернулся на линию и продолжил с того же места.
    state.energy = Math.max(0, state.energy - dt * 1.9);
  }

  if (state.index >= state.points.length - 1) {
    state.status = 'done';
    state.events.push('done');
    return;
  }

  if (state.energy <= 0) {
    state.status = 'tired';
    state.events.push('tired');
  }
}

export function drainEvents(state) {
  if (state.events.length === 0) return null;
  const events = state.events.slice();
  state.events.length = 0;
  return events;
}
