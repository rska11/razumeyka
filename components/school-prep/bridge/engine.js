// Deterministic engine for the educational game «Мост через реку».
// The river is the game metaphor; every stone is a real school-readiness task.

export const WORLD_W = 960;
export const WORLD_H = 540;
export const STEP = 1 / 60;
export const LANE_Y = [214, 326, 438];
export const FOX_X = 220;
export const SLAB_W = 150;
export const SLAB_H = 88;
export const SPAWN_X = WORLD_W + SLAB_W;
export const SLABS_PER_LEVEL = 10;
export const MAX_PARTICLES = 120;
export const MAX_DOTS = 12;

export const LEVELS = [
  { id: 1, act: 'Разведка', title: 'Шифр числовой тропы', note: 'Пропуски и продолжение ряда до 10', skill: 'Числовой ряд', mode: 'digits', challengeKinds: ['sequence-next', 'sequence-gap'], choices: 3, speed: 220, speedUp: 4, scene: 'day', from: 1, step: 1, min: 1, max: 10 },
  { id: 2, act: 'Разведка', title: 'Соседи на берегу', note: 'Числа до 20: перед, после и между', skill: 'Соседи числа', mode: 'digits', challengeKinds: ['neighbor-after', 'neighbor-before', 'between'], choices: 3, speed: 228, speedUp: 4, scene: 'day', from: 10, step: 1, min: 1, max: 20 },
  { id: 3, act: 'Лаборатория', title: 'Код количества', note: 'Соотносим количество, точки и цифру', skill: 'Количество ↔ цифра', mode: 'digits', challengeKinds: ['quantity', 'quantity-more', 'quantity-less'], choices: 3, speed: 224, speedUp: 4, scene: 'day', from: 1, step: 1, min: 1, max: 12 },
  { id: 4, act: 'Лаборатория', title: 'Весы смотрителя', note: 'Больше, меньше и расстояние между числами', skill: 'Сравнение', mode: 'digits', challengeKinds: ['greater', 'less', 'distance'], choices: 3, speed: 232, speedUp: 5, scene: 'sunset', from: 10, step: -1, min: 1, max: 20 },
  { id: 5, act: 'Мастерская', title: 'Энергия моста', note: 'Состав числа и дополнение до 10', skill: 'Сложение', mode: 'digits', challengeKinds: ['make-number', 'add'], choices: 3, speed: 228, speedUp: 4, scene: 'sunset', from: 1, step: 1, min: 1, max: 10 },
  { id: 6, act: 'Мастерская', title: 'Маршрут через один', note: 'Шаг +2, чётные и нечётные ряды', skill: 'Закономерности', mode: 'digits', challengeKinds: ['step-two', 'odd-step'], choices: 3, speed: 238, speedUp: 5, scene: 'sunset', from: 2, step: 2, min: 1, max: 20 },
  { id: 7, act: 'Экспедиция', title: 'Обратный поток', note: 'Вычитание и обратные ряды до 20', skill: 'Вычитание', mode: 'digits', challengeKinds: ['subtract', 'reverse-gap', 'reverse-two'], choices: 3, speed: 240, speedUp: 5, scene: 'night', from: 20, step: -2, min: 1, max: 20, night: true },
  { id: 8, act: 'Экспедиция', title: 'Ночной экзамен', note: 'Смешанные задачи без повторяющегося шаблона', skill: 'Гибкость мышления', mode: 'mixed', challengeKinds: ['sequence-gap', 'between', 'quantity', 'greater', 'make-number', 'step-two', 'subtract'], choices: 3, speed: 246, speedUp: 5, scene: 'night', from: 1, step: 1, min: 1, max: 20, night: true },
];

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
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

function int(rng, min, max) {
  return min + Math.floor(rng() * (max - min + 1));
}

function makeOptions(answer, candidates, rng) {
  const values = [answer];
  for (const value of candidates) {
    if (Number.isInteger(value) && value >= 0 && value <= 20 && !values.includes(value)) values.push(value);
  }
  let radius = 1;
  while (values.length < 3) {
    for (const value of [answer - radius, answer + radius]) {
      if (value >= 0 && value <= 20 && !values.includes(value)) values.push(value);
      if (values.length >= 3) break;
    }
    radius += 1;
  }
  return shuffle(values.slice(0, 3), rng);
}

function dots(count) {
  return { type: 'dots', count };
}

function challenge(kind, round, rng) {
  let answer;
  let prompt;
  let explanation;
  let visual = null;
  let candidates = [];

  if (kind === 'sequence-next') {
    const start = 1 + ((round * 2) % 5);
    answer = start + 3;
    prompt = `${start}, ${start + 1}, ${start + 2}, ?`;
    explanation = `После ${start + 2} идёт ${answer}.`;
    candidates = [answer - 1, answer + 1, answer + 2];
  } else if (kind === 'sequence-gap') {
    const start = 1 + ((round * 3) % 6);
    answer = start + 2;
    prompt = `${start}, ${start + 1}, ?, ${start + 3}`;
    explanation = `Между ${start + 1} и ${start + 3} стоит ${answer}.`;
    candidates = [answer - 1, answer + 1, answer + 2];
  } else if (kind === 'neighbor-after') {
    const base = 7 + ((round * 3) % 11);
    answer = base + 1;
    prompt = `Сосед справа от ${base}`;
    explanation = `Справа от ${base} на числовой линии стоит ${answer}.`;
    candidates = [base - 1, base, base + 2];
  } else if (kind === 'neighbor-before') {
    const base = 8 + ((round * 3) % 12);
    answer = base - 1;
    prompt = `Сосед слева от ${base}`;
    explanation = `Перед ${base} стоит ${answer}.`;
    candidates = [base, base + 1, base - 2];
  } else if (kind === 'between') {
    answer = 6 + ((round * 4) % 13);
    prompt = `Между ${answer - 1} и ${answer + 1}`;
    explanation = `Число ${answer} находится ровно между ними.`;
    candidates = [answer - 1, answer + 1, answer + 2];
  } else if (kind === 'quantity') {
    answer = 4 + ((round * 3) % 8);
    prompt = 'Сколько огней в сигнальной рамке?';
    visual = dots(answer);
    explanation = `${answer} огней — выбираем цифру ${answer}.`;
    candidates = [answer - 1, answer + 1, answer + 2];
  } else if (kind === 'quantity-more') {
    const base = 3 + ((round * 2) % 6);
    answer = base + 1;
    prompt = 'На один больше, чем показано';
    visual = dots(base);
    explanation = `${base} и ещё один — получится ${answer}.`;
    candidates = [base, answer + 1, answer + 2];
  } else if (kind === 'quantity-less') {
    const base = 5 + ((round * 2) % 7);
    answer = base - 1;
    prompt = 'На один меньше, чем показано';
    visual = dots(base);
    explanation = `${base} без одного — получится ${answer}.`;
    candidates = [base, answer - 1, answer + 1];
  } else if (kind === 'greater') {
    const left = 4 + ((round * 3) % 12);
    const right = Math.min(20, left + 2 + (round % 3));
    answer = Math.max(left, right);
    prompt = `Какое больше: ${left} или ${right}?`;
    explanation = `${answer} дальше от нуля, значит оно больше.`;
    candidates = [Math.min(left, right), answer - 1, answer + 1];
  } else if (kind === 'less') {
    const left = 5 + ((round * 4) % 12);
    const right = Math.min(20, left + 2 + (round % 2));
    answer = Math.min(left, right);
    prompt = `Какое меньше: ${left} или ${right}?`;
    explanation = `${answer} ближе к нулю, значит оно меньше.`;
    candidates = [Math.max(left, right), answer - 1, answer + 1];
  } else if (kind === 'distance') {
    const left = 2 + ((round * 3) % 8);
    const right = left + 3 + (round % 4);
    answer = right - left;
    prompt = `Сколько шагов от ${left} до ${right}?`;
    explanation = `От ${left} до ${right} — ${answer} шага.`;
    candidates = [answer - 1, answer + 1, answer + 2];
  } else if (kind === 'make-number') {
    const total = 6 + (round % 5);
    const known = 2 + ((round * 2) % (total - 3));
    answer = total - known;
    prompt = `${known} + ? = ${total}`;
    explanation = `${known} + ${answer} = ${total}.`;
    candidates = [answer - 1, answer + 1, known];
  } else if (kind === 'add') {
    const left = 2 + (round % 4);
    const right = 2 + ((round * 2) % 5);
    answer = left + right;
    prompt = `${left} + ${right} = ?`;
    explanation = `${left} + ${right} = ${answer}.`;
    candidates = [answer - 1, answer + 1, answer + 2];
  } else if (kind === 'step-two') {
    const start = round % 2 === 0 ? 2 : 4;
    answer = start + 6;
    prompt = `${start}, ${start + 2}, ${start + 4}, ?`;
    explanation = `Шагаем по два: дальше ${answer}.`;
    candidates = [answer - 1, answer + 1, answer + 2];
  } else if (kind === 'odd-step') {
    const start = round % 2 === 0 ? 1 : 3;
    answer = start + 6;
    prompt = `${start}, ${start + 2}, ${start + 4}, ?`;
    explanation = `Это нечётный ряд с шагом два. Ответ ${answer}.`;
    candidates = [answer - 1, answer + 1, answer + 2];
  } else if (kind === 'subtract') {
    const total = 8 + (round % 8);
    const take = 2 + (round % 4);
    answer = total - take;
    prompt = `${total} − ${take} = ?`;
    explanation = `Если от ${total} убрать ${take}, останется ${answer}.`;
    candidates = [answer - 1, answer + 1, total - take + 2];
  } else if (kind === 'reverse-gap') {
    const start = 12 + (round % 7);
    answer = start - 2;
    prompt = `${start}, ${start - 1}, ?, ${start - 3}`;
    explanation = `Считаем назад: после ${start - 1} идёт ${answer}.`;
    candidates = [answer - 1, answer + 1, answer + 2];
  } else if (kind === 'reverse-two') {
    const start = 18 - ((round % 3) * 2);
    answer = start - 6;
    prompt = `${start}, ${start - 2}, ${start - 4}, ?`;
    explanation = `Назад по два — дальше ${answer}.`;
    candidates = [answer - 1, answer + 1, answer - 2];
  } else {
    answer = int(rng, 3, 9);
    prompt = `Найди число ${answer}`;
    explanation = `Верный ответ — ${answer}.`;
    candidates = [answer - 1, answer + 1, answer + 2];
  }

  return {
    id: `${kind}-${round}`,
    kind,
    label: 'Задание моста',
    prompt,
    answer,
    explanation,
    visual,
    options: makeOptions(answer, candidates, rng),
  };
}

export function createChallenge(level, round, rng = Math.random) {
  const kinds = level.challengeKinds || ['sequence-next'];
  return challenge(kinds[round % kinds.length], round, rng);
}

export function nextTarget(level, value) {
  const next = value + (level.step || 1);
  if ((level.step || 1) > 0 && next > (level.max || 20)) return level.from || 1;
  if ((level.step || 1) < 0 && next < (level.min || 1)) return level.from || 10;
  return next;
}

export function starsFor(misses) {
  if (misses === 0) return 3;
  if (misses <= 2) return 2;
  return 1;
}

function makeDecor(rng) {
  return Array.from({ length: 16 }, () => ({
    x: rng() * WORLD_W,
    y: 472 + rng() * 54,
    r: 2 + rng() * 4,
    speed: 18 + rng() * 36,
    phase: rng() * Math.PI * 2,
  }));
}

export function createGame(levelIndex, seed) {
  const level = LEVELS[levelIndex] || LEVELS[0];
  const rng = makeRng(typeof seed === 'number' ? seed : Date.now());
  const first = createChallenge(level, 0, rng);
  return {
    level,
    levelIndex,
    rng,
    status: 'run',
    round: 0,
    challenge: first,
    target: first.answer,
    collected: 0,
    misses: 0,
    streak: 0,
    bestStreak: 0,
    hint: false,
    speed: level.speed,
    time: 0,
    shake: 0,
    flash: null,
    feedback: null,
    fox: { lane: 1, y: LANE_Y[1], hop: 0, dip: 0, cheer: 0 },
    group: null,
    bonus: null,
    spawnIn: 1.65,
    trail: [],
    particles: [],
    decor: makeDecor(rng),
    events: [],
  };
}

function slabKind(state, value) {
  if (state.level.mode === 'mixed' && value <= MAX_DOTS && state.rng() < 0.28) return 'dots';
  return 'digits';
}

function spawnGroup(state) {
  const lanes = shuffle([0, 1, 2], state.rng).slice(0, state.level.choices).sort((a, b) => a - b);
  const values = shuffle(state.challenge.options.slice(), state.rng);
  const slots = lanes.map((lane, index) => ({
    lane,
    value: values[index],
    kind: slabKind(state, values[index]),
    state: 'idle',
    anim: 0,
  }));
  const correctLane = slots.find((slot) => slot.value === state.challenge.answer).lane;
  state.group = { x: SPAWN_X, slots, correctLane, resolved: false };

  if (!state.bonus && state.misses > 0 && state.rng() < 0.38) {
    state.bonus = { x: SPAWN_X + 360, lane: int(state.rng, 0, 2), taken: false };
  }
}

function burst(state, x, y, count, kind) {
  for (let i = 0; i < count && state.particles.length < MAX_PARTICLES; i += 1) {
    const angle = state.rng() * Math.PI * 2;
    const power = kind === 'splash' ? 60 + state.rng() * 100 : 70 + state.rng() * 150;
    state.particles.push({ x, y, vx: Math.cos(angle) * power, vy: Math.sin(angle) * power - 90, life: 0, max: 0.7, kind });
  }
}

function resolve(state) {
  const group = state.group;
  group.resolved = true;
  const hit = group.slots.find((slot) => slot.lane === state.fox.lane) || null;
  const correct = group.slots.find((slot) => slot.lane === group.correctLane);

  if (hit && hit.value === state.challenge.answer) {
    hit.state = 'ok';
    for (const slot of group.slots) if (slot !== hit) slot.state = 'sink';
    state.trail.push({ value: state.challenge.answer, kind: hit.kind, x: FOX_X, y: LANE_Y[state.fox.lane], life: 0 });
    state.collected += 1;
    state.streak += 1;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    state.speed = Math.min(state.level.speed * 1.22, state.speed + state.level.speedUp);
    state.feedback = { kind: 'good', title: 'Точно!', detail: state.challenge.explanation, life: 1.35 };
    state.fox.hop = 1;
    state.fox.cheer = 1;
    state.flash = { kind: 'good', life: 0 };
    burst(state, FOX_X, state.fox.y - 30, 18, 'spark');
    state.events.push('ok');
    if (state.collected >= SLABS_PER_LEVEL) {
      state.status = 'done';
      state.events.push('done');
    } else {
      state.round += 1;
      state.challenge = createChallenge(state.level, state.round, state.rng);
      state.target = state.challenge.answer;
    }
    return;
  }

  if (hit) hit.state = 'wrong';
  if (correct && correct.state === 'idle') correct.state = 'reveal';
  for (const slot of group.slots) if (slot.state === 'idle') slot.state = 'sink';
  state.misses += 1;
  state.streak = 0;
  state.speed = Math.max(state.level.speed * 0.88, state.speed - state.level.speedUp * 2);
  state.feedback = { kind: 'bad', title: 'Почти — смотри', detail: state.challenge.explanation, life: 1.7 };
  state.fox.dip = 1;
  state.shake = 1;
  state.flash = { kind: 'bad', life: 0 };
  burst(state, FOX_X, LANE_Y[state.fox.lane] + 24, 18, 'splash');
  state.events.push('miss');
  state.hint = state.misses >= 2;
}

export function selectLane(state, lane) {
  if (state.status !== 'run' || !Number.isInteger(lane)) return false;
  const next = Math.min(2, Math.max(0, lane));
  if (next === state.fox.lane) return false;
  state.fox.lane = next;
  state.fox.hop = 1;
  state.events.push('jump');
  return true;
}

export function moveLane(state, direction) {
  return selectLane(state, state.fox.lane + direction);
}

export function update(state, dt) {
  state.time += dt;
  const fox = state.fox;
  fox.y += (LANE_Y[fox.lane] - fox.y) * Math.min(1, dt * 15);
  if (fox.hop > 0) fox.hop = Math.max(0, fox.hop - dt * 4.1);
  if (fox.dip > 0) fox.dip = Math.max(0, fox.dip - dt * 2.2);
  if (fox.cheer > 0) fox.cheer = Math.max(0, fox.cheer - dt * 1.5);
  if (state.shake > 0) state.shake = Math.max(0, state.shake - dt * 3.3);
  if (state.flash) {
    state.flash.life += dt;
    if (state.flash.life > 0.38) state.flash = null;
  }
  if (state.feedback) {
    state.feedback.life -= dt;
    if (state.feedback.life <= 0) state.feedback = null;
  }

  for (let i = state.particles.length - 1; i >= 0; i -= 1) {
    const p = state.particles[i];
    p.life += dt;
    if (p.life >= p.max) {
      state.particles.splice(i, 1);
    } else {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 540 * dt;
    }
  }
  for (const item of state.decor) {
    item.x -= item.speed * dt;
    if (item.x < -20) item.x = WORLD_W + 20;
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
      state.feedback = { kind: 'bonus', title: 'Подсказка восстановлена', detail: 'Одна ошибка больше не считается.', life: 1.25 };
      state.fox.cheer = 1;
      burst(state, FOX_X, state.fox.y - 30, 18, 'spark');
      state.events.push('bonus');
    }
    if (bonus.x < -120) state.bonus = null;
  }

  if (state.group) {
    const group = state.group;
    group.x -= state.speed * dt;
    for (const slot of group.slots) if (slot.state !== 'idle') slot.anim = Math.min(1, slot.anim + dt * 1.8);
    if (!group.resolved && group.x <= FOX_X) resolve(state);
    if (group.x < -SLAB_W * 2.2) {
      state.group = null;
      state.spawnIn = state.feedback ? 0.78 : 0.5;
    }
    return;
  }

  if (state.status !== 'run') return;
  state.spawnIn -= dt;
  if (state.spawnIn <= 0 && !state.feedback) spawnGroup(state);
}

export function drainEvents(state) {
  if (state.events.length === 0) return null;
  const events = state.events.slice();
  state.events.length = 0;
  return events;
}