// Движок игры «Светлячок» — подготовка руки к письму (неделя 6 курса).
//
// История, понятная пятилетке: маленькие светлячки заблудились в ночном лесу.
// Ты ведёшь старшего светлячка по светящейся тропинке, по дороге будишь
// потерявшихся — они пристраиваются в хвост роем — и приводишь всех домой,
// пока не погас фонарик.
//
// Под историей — тренировка руки: вести плавную линию, не срываясь с тропинки.
// Сошёл — фонарик гаснет и тратится быстрее, но прогресс не сбрасывается.
// Никакого проигрыша: кончился фонарик — «светлячок устал», пробуем снова.
//
// Движок ничего не знает про DOM: получает координаты указателя в координатах
// мира и отдаёт состояние. Проверяется симуляцией (scripts/test-firefly-game.mjs).

export const WORLD_W = 960;
export const WORLD_H = 540;
export const STEP = 1 / 60;

// Насколько далеко вперёд по тропинке можно «зацепиться» за точку. Ограничение
// не даёт срезать угол и перепрыгнуть сразу к домику.
export const LOOKAHEAD = 12;
export const SAMPLES = 190;

// Мышью попадать в узкую тропинку заметно труднее, чем пальцем, — на компьютере
// добавляем запас по ширине, иначе игра превращается в борьбу с мышью.
export const MOUSE_BONUS = 9;

// Через сколько точек тропинки сидит следующий потерявшийся светлячок.
const LIGHT_EVERY = 24;
// Длина хвоста позиций, по которому летит рой.
const FOLLOW_LENGTH = 150;

export const LEVELS = [
  { id: 1, title: 'Прямая тропинка', note: 'Ровно и не спеша', shape: 'line', width: 38, seconds: 30, clouds: 0 },
  { id: 2, title: 'Волна', note: 'Плавные подъёмы и спуски', shape: 'wave', width: 36, seconds: 32, clouds: 0 },
  { id: 3, title: 'Горки', note: 'Острые повороты', shape: 'zigzag', width: 36, seconds: 34, clouds: 0 },
  { id: 4, title: 'Радуга', note: 'Большая дуга', shape: 'arc', width: 34, seconds: 32, clouds: 1 },
  { id: 5, title: 'Мелкая волна', note: 'Мельче волна — точнее рука', shape: 'wave2', width: 30, seconds: 34, clouds: 1 },
  { id: 6, title: 'Крючки', note: 'Элемент письменных букв', shape: 'hooks', width: 30, seconds: 36, clouds: 2 },
  { id: 7, title: 'Петельки', note: 'Из них состоят буквы', shape: 'loops', width: 28, seconds: 38, clouds: 2 },
  { id: 8, title: 'Улитка', note: 'Спираль — самое сложное', shape: 'spiral', width: 28, seconds: 40, clouds: 2 },
];

// Тропинки заданы формулой и разворачиваются в набор точек: движку удобнее
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

function makeLights(points) {
  const lights = [];
  for (let i = LIGHT_EVERY; i < points.length - 6; i += LIGHT_EVERY) {
    lights.push({ index: i, x: points[i].x, y: points[i].y, taken: false, phase: i * 0.7 });
  }
  return lights;
}

function makeClouds(count, rng) {
  const clouds = [];
  for (let i = 0; i < count; i += 1) {
    clouds.push({
      x: 300 + rng() * 500,
      y: 150 + rng() * 220,
      r: 70 + rng() * 40,
      vx: (rng() < 0.5 ? -1 : 1) * (16 + rng() * 16),
      phase: rng() * 6.28,
    });
  }
  return clouds;
}

function makeDecor(rng) {
  // Грибы-фонарики вдоль поляны: загораются по мере продвижения — мир
  // оживает от того, что делает ребёнок.
  const mushrooms = [];
  for (let i = 0; i < 9; i += 1) {
    mushrooms.push({
      x: 70 + i * 105 + rng() * 30,
      y: WORLD_H - 34 - rng() * 16,
      size: 9 + rng() * 7,
      at: i / 9,
    });
  }
  return mushrooms;
}

export function createGame(levelIndex, options) {
  const level = LEVELS[levelIndex] || LEVELS[0];
  const pointerType = (options && options.pointerType) || 'touch';
  const points = pathPoints(level.shape);
  let seed = (level.id * 9301 + 49297) % 233280;
  const rng = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

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
    shadowed: false,
    inside: 0,
    outside: 0,
    time: 0,
    swarm: 0,
    lights: makeLights(points),
    clouds: makeClouds(level.clouds || 0, rng),
    mushrooms: makeDecor(rng),
    follow: [],
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

export function totalLights(state) {
  return state.lights.length;
}

function addSpark(state, x, y, kind) {
  if (state.sparks.length > 90) return;
  state.sparks.push({ x, y, life: 0, max: kind === 'big' ? 0.8 : 0.5, kind: kind || 'small' });
}

export function update(state, dt) {
  state.time += dt;

  for (let i = state.sparks.length - 1; i >= 0; i -= 1) {
    const spark = state.sparks[i];
    spark.life += dt;
    if (spark.life >= spark.max) state.sparks.splice(i, 1);
  }

  for (const cloud of state.clouds) {
    cloud.x += cloud.vx * dt;
    if (cloud.x < -140) cloud.x = WORLD_W + 140;
    if (cloud.x > WORLD_W + 140) cloud.x = -140;
  }

  if (state.status !== 'run') return;

  // Светлячок тянется к пальцу, а не прыгает за ним: так линия получается
  // плавной, а не дёрганой, и видно, что ведёшь живое существо.
  state.firefly.x += (state.pointer.x - state.firefly.x) * Math.min(1, dt * 18);
  state.firefly.y += (state.pointer.y - state.firefly.y) * Math.min(1, dt * 18);

  // Хвост позиций — по нему летит спасённый рой.
  state.follow.unshift({ x: state.firefly.x, y: state.firefly.y });
  if (state.follow.length > FOLLOW_LENGTH) state.follow.length = FOLLOW_LENGTH;

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

  // Тучка над головой — фонарик мигает и тратится быстрее. Не наказание,
  // а повод поторопиться: напряжение без проигрыша.
  state.shadowed = false;
  for (const cloud of state.clouds) {
    const dx = cloud.x - state.firefly.x;
    const dy = cloud.y - state.firefly.y;
    if (Math.sqrt(dx * dx + dy * dy) < cloud.r) state.shadowed = true;
  }

  const wasLit = state.lit;
  state.lit = bestDistance <= state.radius;

  if (state.lit) {
    state.inside += 1;
    if (best > state.index) {
      state.index = best;
      for (const light of state.lights) {
        if (!light.taken && state.index >= light.index) {
          light.taken = true;
          state.swarm += 1;
          addSpark(state, light.x, light.y, 'big');
          state.events.push('collect');
        }
      }
    }
    state.energy = Math.max(0, state.energy - dt * (state.shadowed ? 1.6 : 1));
  } else {
    state.outside += 1;
    if (wasLit) state.events.push('lost');
    // Сошёл с тропинки — фонарик тратится быстрее, но путь не сбрасывается:
    // вернулся на линию и продолжил с того же места.
    state.energy = Math.max(0, state.energy - dt * (state.shadowed ? 2.4 : 1.9));
  }

  if (state.index >= state.points.length - 1) {
    state.status = 'done';
    for (let i = 0; i < 26; i += 1) {
      const end = state.points[state.points.length - 1];
      addSpark(state, end.x + (Math.random() - 0.5) * 120, end.y - Math.random() * 90, 'big');
    }
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
