// Движок платформера «Дом знаний» — подготовка к школе.
//
// Лисёнок Искра бегает по комнатам дома: прыгает по мебели и полкам, собирает
// разбросанные цифры СТРОГО ПО ПОРЯДКУ, находит ключ и открывает дверь в
// следующую комнату. Числовой ряд здесь не вопрос с вариантами ответа, а
// условие прохождения: возьмёшь не ту цифру — она отпрыгнет обратно.
//
// Никаких смертей: наступил в лужу или упал вниз — лисёнок поскальзывается и
// возвращается на последнюю платформу, где стоял. Штраф — только звёзды в конце.
//
// Физика намеренно «игровая», а не честная: есть коэффициент прощения на краю
// платформы (coyote time) и заранее нажатый прыжок (jump buffer). Без них
// управление ощущается деревянным, и ребёнок винит себя, а не игру.

export const WORLD_W = 960;
export const WORLD_H = 540;
export const STEP = 1 / 60;

export const GRAVITY = 1900;
export const MOVE_SPEED = 250;
export const AIR_CONTROL = 0.68;
export const JUMP_VELOCITY = -690;
export const MAX_FALL = 900;
export const COYOTE_TIME = 0.11;
export const JUMP_BUFFER = 0.13;

export const PLAYER_W = 42;
export const PLAYER_H = 52;

// Расчётные пределы прыжка — по ним же проверяется проходимость комнат в тестах.
export const JUMP_HEIGHT = (JUMP_VELOCITY * JUMP_VELOCITY) / (2 * GRAVITY);
export const JUMP_RANGE = MOVE_SPEED * ((-2 * JUMP_VELOCITY) / GRAVITY);

function overlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export function createGame(room) {
  return {
    room,
    status: 'run',
    time: 0,
    player: {
      x: room.spawn.x,
      y: room.spawn.y,
      w: PLAYER_W,
      h: PLAYER_H,
      vx: 0,
      vy: 0,
      onGround: false,
      face: 1,
      coyote: 0,
      buffer: 0,
      slip: 0,
      anim: 0,
    },
    input: { left: false, right: false, jump: false },
    checkpoint: { x: room.spawn.x, y: room.spawn.y },
    slipCooldown: 0,
    items: room.items.map((item) => ({ ...item, taken: false, bounce: 0 })),
    expectedIndex: 0,
    hasKey: !room.key,
    keyTaken: false,
    doorOpen: false,
    mistakes: 0,
    slips: 0,
    sparks: [],
    events: [],
  };
}

/** Число, которое лисёнок должен подобрать следующим. */
export function expectedValue(state) {
  const order = state.room.order;
  return state.expectedIndex < order.length ? order[state.expectedIndex] : null;
}

export function setInput(state, input) {
  state.input.left = Boolean(input.left);
  state.input.right = Boolean(input.right);
  if (input.jump && !state.input.jump) state.player.buffer = JUMP_BUFFER;
  state.input.jump = Boolean(input.jump);
}

export function pressJump(state) {
  state.player.buffer = JUMP_BUFFER;
}

function addSpark(state, x, y, kind) {
  if (state.sparks.length > 70) return;
  for (let i = 0; i < (kind === 'good' ? 12 : 7); i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const power = 60 + Math.random() * 170;
    state.sparks.push({
      x,
      y,
      vx: Math.cos(angle) * power,
      vy: Math.sin(angle) * power - 90,
      life: 0,
      max: 0.55,
      kind,
    });
  }
}

/** Безопасна ли точка: не стоит ли игрок в этом месте прямо в луже. */
function isSafeSpot(room, x, y) {
  const box = { x: x - 6, y: y - 6, w: PLAYER_W + 12, h: PLAYER_H + 12 };
  return !room.hazards.some((hazard) => overlap(box, hazard));
}

function returnToCheckpoint(state) {
  const player = state.player;
  const room = state.room;
  // Если запомненная точка сама оказалась в луже, возвращаем в начало комнаты:
  // иначе получается вечный цикл «вернулся — снова поскользнулся».
  const safe = isSafeSpot(room, state.checkpoint.x, state.checkpoint.y)
    ? state.checkpoint
    : room.spawn;
  player.x = safe.x;
  player.y = safe.y;
  player.vx = 0;
  player.vy = 0;
  player.slip = 1;
  // Короткая неуязвимость: без неё лужа успевает сработать ещё раз, пока
  // лисёнок только встаёт на ноги.
  state.slipCooldown = 0.7;
  state.slips += 1;
  state.events.push('slip');
}

export function update(state, dt) {
  state.time += dt;
  const player = state.player;
  const room = state.room;

  for (let i = state.sparks.length - 1; i >= 0; i -= 1) {
    const spark = state.sparks[i];
    spark.life += dt;
    if (spark.life >= spark.max) {
      state.sparks.splice(i, 1);
      continue;
    }
    spark.x += spark.vx * dt;
    spark.y += spark.vy * dt;
    spark.vy += 700 * dt;
  }

  for (const item of state.items) {
    if (item.bounce > 0) item.bounce = Math.max(0, item.bounce - dt * 2.2);
  }

  if (state.status !== 'run') {
    player.vy = Math.min(MAX_FALL, player.vy + GRAVITY * dt);
    return;
  }

  if (player.slip > 0) player.slip = Math.max(0, player.slip - dt * 2.4);

  // ── Горизонтальное движение ────────────────────────────────────────────────
  const wanted = (state.input.right ? 1 : 0) - (state.input.left ? 1 : 0);
  const control = player.onGround ? 1 : AIR_CONTROL;
  if (wanted !== 0) {
    player.vx += wanted * MOVE_SPEED * 12 * control * dt;
    player.vx = Math.max(-MOVE_SPEED, Math.min(MOVE_SPEED, player.vx));
    player.face = wanted;
    player.anim += dt * (player.onGround ? 9 : 3);
  } else {
    const friction = player.onGround ? 14 : 3;
    player.vx -= player.vx * Math.min(1, friction * dt);
    if (Math.abs(player.vx) < 6) player.vx = 0;
  }

  // ── Прыжок ─────────────────────────────────────────────────────────────────
  if (player.coyote > 0) player.coyote -= dt;
  if (player.buffer > 0) player.buffer -= dt;
  if (player.buffer > 0 && (player.onGround || player.coyote > 0)) {
    player.vy = JUMP_VELOCITY;
    player.onGround = false;
    player.coyote = 0;
    player.buffer = 0;
    state.events.push('jump');
  }
  // Отпустил кнопку в полёте — прыжок короче. Так высота управляется, и
  // ребёнок быстро понимает: «нажал чуть-чуть — прыгнул чуть-чуть».
  if (!state.input.jump && player.vy < JUMP_VELOCITY * 0.45) {
    player.vy = JUMP_VELOCITY * 0.45;
  }

  player.vy = Math.min(MAX_FALL, player.vy + GRAVITY * dt);

  // ── Столкновения по осям ───────────────────────────────────────────────────
  player.x += player.vx * dt;
  for (const platform of room.platforms) {
    if (!overlap(player, platform)) continue;
    if (player.vx > 0) player.x = platform.x - player.w;
    else if (player.vx < 0) player.x = platform.x + platform.w;
    player.vx = 0;
  }
  player.x = Math.max(8, Math.min(WORLD_W - player.w - 8, player.x));

  const wasOnGround = player.onGround;
  player.onGround = false;
  player.y += player.vy * dt;
  for (const platform of room.platforms) {
    if (!overlap(player, platform)) continue;
    if (player.vy > 0) {
      player.y = platform.y - player.h;
      player.onGround = true;
      // Точка возврата — последняя БЕЗОПАСНАЯ платформа, на которой стоял.
      // Запоминать место в луже нельзя: вернёт прямо в неё и заклинит.
      if (isSafeSpot(room, player.x, player.y - 2)) {
        state.checkpoint = { x: player.x, y: player.y - 2 };
      }
    } else if (player.vy < 0) {
      player.y = platform.y + platform.h;
    }
    player.vy = 0;
  }
  if (player.onGround && !wasOnGround) state.events.push('land');
  if (player.onGround) player.coyote = COYOTE_TIME;

  // ── Провалился вниз ────────────────────────────────────────────────────────
  if (player.y > WORLD_H + 60) returnToCheckpoint(state);

  // ── Лужи ───────────────────────────────────────────────────────────────────
  if (state.slipCooldown > 0) {
    state.slipCooldown = Math.max(0, state.slipCooldown - dt);
  } else {
    for (const hazard of room.hazards) {
      if (overlap(player, hazard)) {
        returnToCheckpoint(state);
        break;
      }
    }
  }

  // ── Сбор цифр ──────────────────────────────────────────────────────────────
  const need = expectedValue(state);
  for (const item of state.items) {
    if (item.taken) continue;
    const box = { x: item.x - 20, y: item.y - 20, w: 40, h: 40 };
    if (!overlap(player, box)) continue;

    if (item.value === need) {
      item.taken = true;
      state.expectedIndex += 1;
      addSpark(state, item.x, item.y, 'good');
      state.events.push('good');
    } else if (item.bounce === 0) {
      // Не та цифра — отпрыгивает, лисёнок цел, счётчик ошибок растёт.
      item.bounce = 1;
      state.mistakes += 1;
      addSpark(state, item.x, item.y, 'wrong');
      state.events.push('wrong');
    }
  }

  // ── Ключ и дверь ───────────────────────────────────────────────────────────
  if (room.key && !state.keyTaken) {
    const box = { x: room.key.x - 20, y: room.key.y - 20, w: 40, h: 40 };
    if (overlap(player, box) && state.expectedIndex >= state.room.order.length) {
      state.keyTaken = true;
      state.hasKey = true;
      addSpark(state, room.key.x, room.key.y, 'good');
      state.events.push('key');
    }
  }

  const collectedAll = state.expectedIndex >= room.order.length;
  const opened = collectedAll && state.hasKey;
  if (opened && !state.doorOpen) {
    state.doorOpen = true;
    state.events.push('open');
  }

  if (state.doorOpen) {
    const door = { x: room.door.x, y: room.door.y, w: 56, h: 92 };
    if (overlap(player, door)) {
      state.status = 'done';
      state.events.push('done');
    }
  }
}

export function starsFor(state) {
  const penalty = state.mistakes + state.slips;
  if (penalty === 0) return 3;
  if (penalty <= 3) return 2;
  return 1;
}

export function drainEvents(state) {
  if (state.events.length === 0) return null;
  const events = state.events.slice();
  state.events.length = 0;
  return events;
}
