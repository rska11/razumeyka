// Движок мини-игры «Мост через реку» (подготовка к школе, числовой ряд).
//
// Почему движок вынесен отдельным модулем и ничего не знает ни о DOM, ни о React:
//  1) он детерминирован — фиксированный шаг времени плюс собственный генератор
//     случайных чисел с сидом, поэтому уровень можно прогнать в тесте и получить
//     тот же результат;
//  2) правила игры не зависят от того, чем её рисуют, а рисование — от правил.
//
// Механика: лисёнок Искра перепрыгивает реку по камням. По трём дорожкам
// плывут камни с числами, прыгать нужно на камень со СЛЕДУЮЩИМ числом ряда.
// Числовой ряд здесь не вопрос с вариантами ответа, а способ управления:
// не знаешь порядок — не пройдёшь.
//
// Про слова: в интерфейсе для ребёнка всё называется КАМНЯМИ — «плита» и
// «пролёт» пятилетке ничего не говорят. Внутри кода историческое имя slab
// сохранено, чтобы не переименовывать половину движка.
//
// Ошибка показывается ЯВНО: выбранный камень краснеет с крестом, правильный
// подсвечивается зелёным с галочкой — ребёнок должен видеть, где был верный
// ответ. При этом промах не заканчивает игру: нужное число остаётся тем же и
// приплывёт снова, а потерянное сердце можно вернуть, поймав на реке фонарик.

export const WORLD_W = 960;
export const WORLD_H = 540;
export const STEP = 1 / 60;

export const LANE_Y = [188, 300, 412];
export const FOX_X = 268;
export const SLAB_W = 116;
export const SLAB_H = 84;
export const SPAWN_X = WORLD_W + SLAB_W;

export const SLABS_PER_LEVEL = 10;
export const MAX_PARTICLES = 110;
export const LANTERNS = 3;
// Точками показываем только небольшие числа — выше десятка их уже не сосчитать
// взглядом, и задание превращается в мучение.
export const MAX_DOTS = 12;

// Режимы плит:
//  digits — число цифрой (узнавание цифры и порядка),
//  dots   — число точками (счёт количества),
//  mixed  — часть плит цифрой, часть точками (соотнесение числа и количества).
export const LEVELS = [
  {
    id: 1,
    title: 'Первые камни',
    note: 'По порядку от 1 до 10',
    tip: 'Прыгай на камень со следующим числом',
    mode: 'digits',
    from: 1, step: 1, min: 1, max: 10,
    choices: 2, speed: 290, speedUp: 8,
  },
  {
    id: 2,
    title: 'Дальний берег',
    note: 'Второй десяток: 10, 11, 12…',
    tip: 'Числа больше, а порядок тот же',
    mode: 'digits',
    from: 10, step: 1, min: 10, max: 20,
    choices: 3, speed: 320, speedUp: 9,
  },
  {
    id: 3,
    title: 'Камни в точках',
    note: 'На камнях не цифры, а точки',
    tip: 'Сосчитай точки и прыгай на нужный камень',
    mode: 'dots',
    from: 1, step: 1, min: 1, max: 10,
    choices: 2, speed: 285, speedUp: 8,
  },
  {
    id: 4,
    title: 'Дорога назад',
    note: 'Обратный счёт от 10 до 1',
    tip: 'Теперь числа идут назад: 10, 9, 8…',
    mode: 'digits',
    from: 10, step: -1, min: 1, max: 10,
    choices: 3, speed: 335, speedUp: 10,
  },
  {
    id: 5,
    title: 'Цифра и точки',
    note: 'Одно число, разный вид',
    tip: 'Камень с точками тоже может быть верным',
    mode: 'mixed',
    from: 1, step: 1, min: 1, max: 12,
    choices: 3, speed: 330, speedUp: 10,
  },
  {
    id: 6,
    title: 'Через один',
    note: 'Считаем двойками до 20',
    tip: 'Пропускаем каждое второе: 2, 4, 6…',
    mode: 'digits',
    from: 2, step: 2, min: 2, max: 20,
    choices: 3, speed: 355, speedUp: 11,
  },
  {
    id: 7,
    title: 'Назад через один',
    note: 'Двойками назад: 20, 18, 16…',
    tip: 'Самый хитрый ряд — не спеши',
    mode: 'digits',
    from: 20, step: -2, min: 2, max: 20,
    choices: 3, speed: 370, speedUp: 11,
  },
  {
    id: 8,
    title: 'Ночная река',
    note: 'Цифры, точки и высокая скорость',
    tip: 'Финал: всё, чему научился',
    mode: 'mixed',
    from: 1, step: 1, min: 1, max: 20,
    choices: 3, speed: 395, speedUp: 12, night: true,
  },
];

// mulberry32 — быстрый генератор с сидом, чтобы игра была воспроизводимой.
function makeRng(seed) {
  let a = seed >>> 0;
  return function rng() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(list, rng) {
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = list[i];
    list[i] = list[j];
    list[j] = tmp;
  }
  return list;
}

export function nextTarget(level, value) {
  const next = value + level.step;
  if (level.step > 0 && next > level.max) return level.from;
  if (level.step < 0 && next < level.min) return level.from;
  return next;
}

export function starsFor(misses) {
  if (misses === 0) return 3;
  if (misses <= 2) return 2;
  return 1;
}

// Неверные числа берём рядом с правильным: ребёнок должен именно вспомнить
// порядок, а не выбрать «то, которое меньше всех похоже на остальные».
function distractors(state, count) {
  const { level, target, rng } = state;
  const deltas = Math.abs(level.step) === 1 ? [1, -1, 2, -2, 3, -3] : [1, -1, 2, -2, 4, -4];
  const pool = [];
  for (const delta of deltas) {
    const value = target + delta;
    if (value === target || value < 1 || value > level.max + 4) continue;
    if (pool.indexOf(value) === -1) pool.push(value);
  }
  let filler = 1;
  while (pool.length < count && filler <= level.max + 4) {
    if (filler !== target && pool.indexOf(filler) === -1) pool.push(filler);
    filler += 1;
  }
  return shuffle(pool, rng).slice(0, count);
}

function makeDecor(rng) {
  const decor = [];
  for (let i = 0; i < 14; i += 1) {
    decor.push({
      x: rng() * WORLD_W,
      y: 470 + rng() * 60,
      r: 3 + rng() * 5,
      speed: 26 + rng() * 54,
      phase: rng() * Math.PI * 2,
    });
  }
  return decor;
}

export function createGame(levelIndex, seed) {
  const level = LEVELS[levelIndex] || LEVELS[0];
  const rng = makeRng(typeof seed === 'number' ? seed : Date.now());
  return {
    level,
    levelIndex,
    rng,
    status: 'run',
    target: level.from,
    collected: 0,
    misses: 0,
    streak: 0,
    bestStreak: 0,
    hint: false,
    speed: level.speed,
    time: 0,
    shake: 0,
    flash: null,
    fox: { lane: 1, y: LANE_Y[1], hop: 0, dip: 0, cheer: 0 },
    group: null,
    bonus: null,
    spawnIn: 0.75,
    trail: [],
    particles: [],
    decor: makeDecor(rng),
    events: [],
  };
}

// Вид плиты: в mixed-режиме точками показываем только небольшие числа.
function slabKind(state, value) {
  const mode = state.level.mode;
  if (mode === 'dots') return value <= MAX_DOTS ? 'dots' : 'digits';
  if (mode === 'mixed') return value <= MAX_DOTS && state.rng() < 0.5 ? 'dots' : 'digits';
  return 'digits';
}

function spawnGroup(state) {
  const level = state.level;
  const lanes = shuffle([0, 1, 2], state.rng).slice(0, level.choices).sort((a, b) => a - b);
  const correctLane = lanes[Math.floor(state.rng() * lanes.length)];
  const wrong = distractors(state, lanes.length - 1);
  let wrongIndex = 0;
  const slots = lanes.map((lane) => {
    const value = lane === correctLane ? state.target : wrong[wrongIndex++];
    return { lane, value, kind: slabKind(state, value), state: 'idle', anim: 0 };
  });
  state.group = { x: SPAWN_X, slots, correctLane, resolved: false };

  // Фонарик — способ вернуть потерянный фонарь. Появляется тем чаще, чем хуже
  // идут дела: игра сама подставляет ребёнку шанс отыграться.
  if (!state.bonus && state.misses > 0 && state.rng() < 0.45) {
    state.bonus = {
      x: SPAWN_X + 330,
      lane: Math.floor(state.rng() * 3),
      taken: false,
    };
  }
}

function burst(state, x, y, count, kind) {
  for (let i = 0; i < count; i += 1) {
    if (state.particles.length >= MAX_PARTICLES) break;
    const angle = state.rng() * Math.PI * 2;
    const power = kind === 'splash' ? 70 + state.rng() * 120 : 90 + state.rng() * 190;
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * power,
      vy: Math.sin(angle) * power - (kind === 'splash' ? 130 : 60),
      life: 0,
      max: kind === 'splash' ? 0.75 : 0.62,
      kind,
    });
  }
}

function resolve(state) {
  const group = state.group;
  group.resolved = true;
  let hit = null;
  for (const slot of group.slots) {
    if (slot.lane === state.fox.lane) hit = slot;
  }

  if (hit && hit.value === state.target) {
    hit.state = 'ok';
    for (const slot of group.slots) {
      if (slot !== hit) slot.state = 'sink';
    }
    state.trail.push({
      value: state.target,
      kind: hit.kind,
      x: FOX_X,
      y: LANE_Y[state.fox.lane],
      life: 0,
    });
    state.collected += 1;
    state.streak += 1;
    if (state.streak > state.bestStreak) state.bestStreak = state.streak;
    state.speed = Math.min(state.level.speed * 1.75, state.speed + state.level.speedUp);
    state.target = nextTarget(state.level, state.target);
    state.fox.hop = 1;
    state.fox.cheer = 1;
    state.flash = { kind: 'good', life: 0 };
    burst(state, FOX_X, state.fox.y - 46, 16, 'spark');
    state.events.push('ok');
    if (state.collected >= SLABS_PER_LEVEL) {
      state.status = 'done';
      state.events.push('done');
    }
    return;
  }

  // Промах виден явно: выбранная плита краснеет с крестом, а верная —
  // подсвечивается зелёной галочкой, чтобы ребёнок понял, где был ответ.
  if (hit) hit.state = 'wrong';
  for (const slot of group.slots) {
    if (slot.lane === group.correctLane && slot.state === 'idle') slot.state = 'reveal';
    else if (slot.state === 'idle') slot.state = 'sink';
  }
  state.misses += 1;
  state.streak = 0;
  state.speed = Math.max(state.level.speed * 0.82, state.speed - state.level.speedUp * 2.4);
  state.fox.dip = 1;
  state.shake = 1;
  state.flash = { kind: 'bad', life: 0 };
  burst(state, FOX_X, LANE_Y[state.fox.lane] + 24, 16, 'splash');
  state.events.push('miss');
  // Подсказка включается после двух промахов — адаптивная помощь вместо
  // «ты проиграл». Если фонарь вернули, подсказка гаснет.
  state.hint = state.misses >= 2;
}

export function moveLane(state, direction) {
  if (state.status !== 'run') return false;
  const next = Math.min(2, Math.max(0, state.fox.lane + direction));
  if (next === state.fox.lane) return false;
  state.fox.lane = next;
  state.fox.hop = 1;
  state.events.push('jump');
  return true;
}

export function update(state, dt) {
  state.time += dt;

  const fox = state.fox;
  fox.y += (LANE_Y[fox.lane] - fox.y) * Math.min(1, dt * 16);
  if (fox.hop > 0) fox.hop = Math.max(0, fox.hop - dt * 4.4);
  if (fox.dip > 0) fox.dip = Math.max(0, fox.dip - dt * 2.2);
  if (fox.cheer > 0) fox.cheer = Math.max(0, fox.cheer - dt * 1.6);
  if (state.shake > 0) state.shake = Math.max(0, state.shake - dt * 3.4);
  if (state.flash) {
    state.flash.life += dt;
    if (state.flash.life > 0.4) state.flash = null;
  }

  for (let i = state.particles.length - 1; i >= 0; i -= 1) {
    const p = state.particles[i];
    p.life += dt;
    if (p.life >= p.max) {
      state.particles.splice(i, 1);
      continue;
    }
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 620 * dt;
  }

  for (const item of state.decor) {
    item.x -= item.speed * dt;
    if (item.x < -20) {
      item.x = WORLD_W + 20;
      item.y = 470 + state.rng() * 60;
    }
  }

  for (let i = state.trail.length - 1; i >= 0; i -= 1) {
    const slab = state.trail[i];
    slab.x -= state.speed * dt;
    slab.life += dt;
    if (slab.x < -SLAB_W * 1.6) state.trail.splice(i, 1);
  }

  if (state.bonus) {
    const bonus = state.bonus;
    bonus.x -= state.speed * dt;
    if (!bonus.taken && bonus.x <= FOX_X && bonus.lane === state.fox.lane) {
      bonus.taken = true;
      state.misses = Math.max(0, state.misses - 1);
      state.hint = state.misses >= 2;
      state.fox.cheer = 1;
      burst(state, FOX_X, state.fox.y - 40, 18, 'spark');
      state.events.push('bonus');
    }
    if (bonus.x < -120) state.bonus = null;
  }

  if (state.group) {
    const group = state.group;
    group.x -= state.speed * dt;
    for (const slot of group.slots) {
      if (slot.state !== 'idle') slot.anim = Math.min(1, slot.anim + dt * 1.9);
    }
    if (!group.resolved && group.x <= FOX_X) resolve(state);
    if (group.x < -SLAB_W * 2.4) {
      state.group = null;
      state.spawnIn = 0.34;
    }
    return;
  }

  if (state.status !== 'run') return;

  state.spawnIn -= dt;
  if (state.spawnIn <= 0) spawnGroup(state);
}

// События копятся в массиве, а не уходят в колбэки: слой React вычитывает их
// раз в кадр и решает, что играть и что показывать. Движок остаётся чистым.
export function drainEvents(state) {
  if (state.events.length === 0) return null;
  const events = state.events.slice();
  state.events.length = 0;
  return events;
}
