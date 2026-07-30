import { WORLD_H, getAcademyLevel, runeOrder } from './level.js';

export const STEP = 1 / 60;
const PLAYER_W = 46;
const PLAYER_H = 64;

const copy = (items) => items.map((item) => ({ ...item }));
const hit = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

export function learningComplete(state) {
  if (state.level.challenges?.length) return state.level.challenges.every((item) => state.challengeProgress[item.id]);
  return Object.values(state.solved).every(Boolean);
}

export function activeLearningGates(state) {
  if (state.level.challenges?.length) {
    return state.level.challenges.filter((item) => !state.challengeProgress[item.id]).map((item) => item.gate);
  }
  return Object.values(state.level.learningGates).filter((item) => !state.solved[item.id]);
}

export function createAcademyGame(hero = 0, levelId) {
  const level = getAcademyLevel(levelId);
  return {
    level,
    time: 0,
    status: 'play',
    hero,
    player: {
      x: 90, y: 520, w: PLAYER_W, h: PLAYER_H,
      vx: 0, vy: 0, grounded: false, face: 1,
      coyote: 0, jumpBuffer: 0, invulnerable: 0, groundedOn: null,
    },
    input: { left: false, right: false, jump: false },
    platforms: copy(level.platforms),
    coins: copy(level.coins),
    stars: copy(level.stars),
    hazards: copy(level.hazards || []),
    enemies: copy(level.enemies).map((enemy) => ({
      ...enemy,
      w: enemy.kind === 'drone' ? 54 : 50,
      h: enemy.kind === 'drone' ? 42 : 38,
      baseY: enemy.y,
      direction: 1,
      defeated: false,
    })),
    checkpoint: 0,
    collected: 0,
    rareStars: 0,
    hearts: 3,
    solved: { ...level.solved },
    challengeProgress: Object.fromEntries((level.challenges || []).map((item) => [item.id, false])),
    challengeSteps: Object.fromEntries((level.challenges || []).map((item) => [item.id, 0])),
    challengeSolvedAt: {},
    challengeReady: Object.fromEntries((level.challenges || []).map((item) => [item.id, false])),
    challengeReadTime: Object.fromEntries((level.challenges || []).map((item) => [item.id, 0])),
    compositionParts: [false, false],
    lessonMistakes: 0,
    runeProgress: 0,
    runes: [false, false, false],
    gateOpen: false,
    feedback: null,
    feedbackSeq: 0,
    celebration: 0,
    particles: [],
    events: [],
    shake: 0,
    finishedAt: 0,
  };
}

export function setAcademyInput(state, input) {
  state.input = { ...state.input, ...input };
}

export function pressAcademyJump(state) {
  state.player.jumpBuffer = 0.14;
}

function sparkle(state, x, y, color = '#ffd75f', amount = 9) {
  for (let i = 0; i < amount; i += 1) {
    const angle = (Math.PI * 2 * i) / amount + state.time;
    state.particles.push({
      x, y,
      vx: Math.cos(angle) * (70 + (i % 3) * 28),
      vy: Math.sin(angle) * (70 + (i % 4) * 22) - 40,
      life: 0.55 + (i % 3) * 0.08,
      color,
    });
  }
}

function respawn(state) {
  const point = state.level.checkpoints[state.checkpoint];
  Object.assign(state.player, {
    x: point.x, y: point.y, vx: 0, vy: 0,
    invulnerable: 1.4, coyote: 0, jumpBuffer: 0,
  });
  state.hearts = Math.max(1, state.hearts - 1);
  state.shake = 0.35;
  state.events.push('hurt');
}

function currentPlatforms(state) {
  return state.platforms
    .filter((platform) => !platform.requiresChallenge || state.challengeProgress[platform.requiresChallenge])
    .map((platform, index) => {
      if (platform.kind !== 'moving' && platform.kind !== 'lift') return platform;
      const offset = Math.sin(state.time * platform.speed * 2 + (platform.phase ?? index)) * platform.range;
      return {
        ...platform,
        x: platform.x + (platform.axis === 'x' ? offset : 0),
        y: platform.y + (platform.axis === 'y' ? offset : 0),
      };
    });
}

const correctFeedback = {
  number: ['Верно!', 'После 2 идёт 3. Числовой мост открыт.'],
  compare: ['Верно!', '5 зарядов больше, чем 3. Лифт открыт.'],
  pattern: ['Верно!', 'После двух кругов идёт ромб. Часы запущены.'],
  composition: ['Получилось 5!', '2 + 3 = 5. Реактор запущен, ворота открыты.'],
};

const wrongFeedback = {
  number: ['Попробуй ещё', 'Какое число находится между 2 и 4?'],
  compare: ['Посчитай ещё раз', 'Сравни две группы: где точек действительно больше?'],
  pattern: ['Посмотри на повтор', 'Круг, круг, ромб — затем ряд начинается снова.'],
  composition: ['Нужны другие части', 'Чтобы получить 5, выбери группу 2 и группу 3.'],
};

function showFeedback(state, type, title, detail, ttl = 2.2) {
  state.feedbackSeq += 1;
  state.feedback = { id: state.feedbackSeq, type, title, detail, ttl };
}
function markSolved(state, skill, platform, color) {
  if (state.solved[skill]) return;
  state.solved[skill] = true;
  platform.answerState = 'correct';
  state.celebration = 0.9;
  const [title, detail] = correctFeedback[skill];
  showFeedback(state, 'correct', title, detail, 2.6);
  sparkle(state, platform.x + platform.w / 2, platform.y - 12, color, 18);
  state.events.push('lesson', 'gate');
  if (learningComplete(state)) {
    state.gateOpen = true;
    state.events.push('all-lessons');
  }
}

function lessonWrong(state, platform) {
  state.lessonMistakes += 1;
  state.shake = 0.12;
  platform.answerState = 'wrong';
  platform.answerStateTtl = 1.6;
  const [title, detail] = wrongFeedback[state.level.skill];
  showFeedback(state, 'wrong', title, detail, 2.2);
  sparkle(state, platform.x + platform.w / 2, platform.y - 8, '#ff7b85', 7);
  state.events.push('lesson-wrong');
}

function updateChallengeReadiness(state, dt) {
  const challenge = state.level.challenges?.find((item) => !state.challengeProgress[item.id]);
  if (!challenge || state.challengeReady[challenge.id]) return;
  const centerX = state.player.x + state.player.w / 2;
  const inside = centerX >= challenge.zone.x && centerX <= challenge.zone.x + challenge.zone.w;
  if (!inside || !state.player.grounded || state.player.groundedOn !== 'ground') return;
  state.challengeReadTime[challenge.id] += dt;
  if (state.challengeReadTime[challenge.id] < 1.05) return;
  state.challengeReady[challenge.id] = true;
  showFeedback(state, 'part', 'Задание прочитано', 'Теперь выбери ответ и прыгни на нужную платформу.', 1.8);
  state.events.push('challenge-ready');
}
function completeWorkshop(state, challenge, platform) {
  if (state.challengeProgress[challenge.id]) return;
  state.challengeProgress[challenge.id] = true;
  state.challengeSolvedAt[challenge.id] = state.time;
  platform.answerState = 'correct';
  state.celebration = 0.85;
  showFeedback(state, 'correct', challenge.successTitle, challenge.successDetail, 2.7);
  sparkle(state, platform.x + platform.w / 2, platform.y - 12, state.level.accent, 18);
  for (const bridge of state.platforms.filter((item) => item.requiresChallenge === challenge.id)) {
    sparkle(state, bridge.x + bridge.w / 2, bridge.y, '#ffd75f', 7);
  }
  state.events.push('lesson', 'gate', 'workshop-complete');
  if (learningComplete(state)) {
    state.solved[state.level.skill] = true;
    state.gateOpen = true;
    state.events.push('all-lessons');
  }
}

function workshopWrong(state, challenge, platform) {
  state.lessonMistakes += 1;
  state.shake = 0.1;
  if (challenge.resetOnWrong) {
    state.challengeSteps[challenge.id] = 0;
    for (const item of state.platforms.filter((entry) => entry.challengeId === challenge.id)) delete item.answerState;
  }
  platform.answerState = 'wrong';
  platform.answerStateTtl = 1.5;
  showFeedback(state, 'wrong', challenge.wrongTitle, challenge.wrongDetail, 2.25);
  sparkle(state, platform.x + platform.w / 2, platform.y - 8, '#ff7b85', 7);
  state.events.push('lesson-wrong');
}

function handleWorkshopLanding(state, platform) {
  if (!platform.challengeId) return false;
  const challenge = state.level.challenges?.find((item) => item.id === platform.challengeId);
  if (!challenge || state.challengeProgress[challenge.id]) return true;
  if (!state.challengeReady[challenge.id]) {
    showFeedback(state, 'part', 'Сначала прочитай задание', 'Спустись на пол мастерской. Когда пульт включится, выбери ответ.', 1.9);
    state.events.push('answer-not-ready');
    return true;
  }
  const value = platform.value ?? platform.amount ?? platform.shape;
  if (challenge.answers?.length) {
    const step = state.challengeSteps[challenge.id] || 0;
    const expected = challenge.answers[step];
    if (value !== expected) {
      workshopWrong(state, challenge, platform);
      return true;
    }
    platform.answerState = 'correct';
    state.challengeSteps[challenge.id] = step + 1;
    sparkle(state, platform.x + platform.w / 2, platform.y - 12, state.level.accent, 12);
    if (state.challengeSteps[challenge.id] >= challenge.answers.length) {
      completeWorkshop(state, challenge, platform);
    } else {
      const next = challenge.answers[state.challengeSteps[challenge.id]];
      const labels = { blue: 'синий барабан', gold: 'жёлтый барабан', pink: 'розовый барабан' };
      showFeedback(state, 'part', `Шаг ${step + 1} выполнен`, `Теперь активируй: ${labels[next] || next}.`, 2.1);
      state.events.push('lesson-part');
    }
    return true;
  }
  if (value === challenge.answer) completeWorkshop(state, challenge, platform);
  else workshopWrong(state, challenge, platform);
  return true;
}
function handleLessonLanding(state, platform) {
  if (handleWorkshopLanding(state, platform)) return;
  if (platform.kind === 'numberPad' && !state.solved.number) {
    if (platform.value === state.level.answer) markSolved(state, 'number', platform, '#66e6ff');
    else lessonWrong(state, platform);
    return;
  }
  if (platform.kind === 'comparePad' && !state.solved.compare) {
    if (platform.amount === state.level.answer) markSolved(state, 'compare', platform, '#ffd65a');
    else lessonWrong(state, platform);
    return;
  }
  if (platform.kind === 'switch' && !state.solved.pattern) {
    if (platform.shape === state.level.answer) {
      state.runes[platform.rune] = true;
      state.runeProgress = 1;
      markSolved(state, 'pattern', platform, '#ff7db5');
    } else {
      lessonWrong(state, platform);
    }
    return;
  }
  if (platform.kind === 'compositionPad' && !state.solved.composition) {
    if (state.level.answer.includes(platform.amount)) {
      const index = state.level.answer.indexOf(platform.amount);
      if (!state.compositionParts[index]) {
        state.compositionParts[index] = true;
        platform.answerState = 'correct';
        const nextAmount = state.level.answer.find((amount) => amount !== platform.amount);
        showFeedback(state, 'part', `Правильно: найдено ${platform.amount}`, `Теперь выбери группу ${nextAmount}. Вместе получится 5.`, 2.3);
        sparkle(state, platform.x + platform.w / 2, platform.y - 12, '#75f1bd', 12);
        state.events.push('lesson-part');
      } else if (!state.compositionParts.every(Boolean)) {
        const nextAmount = state.level.answer.find((amount) => amount !== platform.amount);
        showFeedback(state, 'part', `${platform.amount} уже найдено`, `Теперь нужна группа ${nextAmount}.`, 1.8);
      }
      if (state.compositionParts.every(Boolean)) markSolved(state, 'composition', platform, '#75f1bd');
    } else {
      lessonWrong(state, platform);
    }
  }
}

function hazardBox(hazard, time) {
  if (hazard.kind === 'pendulum') {
    const angle = Math.sin(time * 1.6 + hazard.phase) * 0.78;
    const x = hazard.pivotX + Math.sin(angle) * hazard.length;
    const y = hazard.pivotY + Math.cos(angle) * hazard.length;
    return { x: x - 27, y: y - 27, w: 54, h: 54, active: true, bobX: x, bobY: y };
  }
  if (hazard.kind === 'steam') {
    const active = ((time + hazard.phase) % hazard.period) < hazard.activeFor;
    return { ...hazard, active };
  }
  return { ...hazard, active: true };
}

function updateHazards(state) {
  if (state.player.invulnerable > 0) return;
  for (const hazard of state.hazards) {
    const box = hazardBox(hazard, state.time);
    hazard.active = box.active;
    hazard.bobX = box.bobX;
    hazard.bobY = box.bobY;
    if (box.active && hit(state.player, box)) {
      respawn(state);
      showFeedback(state, 'wrong', 'Осторожно!', hazard.kind === 'pendulum'
        ? 'Поймай момент, когда маятник уйдёт в сторону.'
        : hazard.kind === 'steam'
          ? 'Дождись, когда паровой клапан закроется.'
          : 'Энергетическое поле нельзя касаться.', 1.8);
      break;
    }
  }
}
function updateEnemies(state, dt) {
  const player = state.player;
  for (const enemy of state.enemies) {
    if (enemy.defeated) continue;
    enemy.x += enemy.direction * (enemy.kind === 'drone' ? 80 : 62) * dt;
    if (enemy.x <= enemy.minX || enemy.x >= enemy.maxX) enemy.direction *= -1;
    if (enemy.kind === 'drone') enemy.y = enemy.baseY + Math.sin(state.time * 3 + enemy.id) * 30;

    if (!hit(player, enemy) || player.invulnerable > 0) continue;
    const playerBottomBefore = player.y + player.h - player.vy * dt;
    if (player.vy > 120 && playerBottomBefore <= enemy.y + 18) {
      enemy.defeated = true;
      player.vy = -430;
      sparkle(state, enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, '#76f4d2', 12);
      state.events.push('enemy');
    } else {
      respawn(state);
      break;
    }
  }
}

export function updateAcademy(state, dt) {
  if (state.status !== 'play') return;
  state.time += dt;
  state.celebration = Math.max(0, state.celebration - dt);
  if (state.feedback) {
    state.feedback.ttl -= dt;
    if (state.feedback.ttl <= 0) state.feedback = null;
  }
  for (const platform of state.platforms) {
    if (platform.answerStateTtl) {
      platform.answerStateTtl -= dt;
      if (platform.answerStateTtl <= 0) {
        delete platform.answerState;
        delete platform.answerStateTtl;
      }
    }
  }
  state.shake = Math.max(0, state.shake - dt);
  const player = state.player;
  player.invulnerable = Math.max(0, player.invulnerable - dt);
  player.jumpBuffer = Math.max(0, player.jumpBuffer - dt);
  player.coyote = player.grounded ? 0.12 : Math.max(0, player.coyote - dt);

  const move = state.celebration > 0 ? 0 : Number(state.input.right) - Number(state.input.left);
  const target = move * 335;
  const accel = player.grounded ? 2500 : 1450;
  const delta = Math.max(-accel * dt, Math.min(accel * dt, target - player.vx));
  player.vx += delta;
  if (!move && player.grounded) player.vx *= Math.pow(0.0008, dt);
  if (move) player.face = move;

  if (state.celebration <= 0 && player.jumpBuffer > 0 && player.coyote > 0) {
    player.vy = -690;
    player.jumpBuffer = 0;
    player.coyote = 0;
    player.grounded = false;
    state.events.push('jump');
  }
  if (!state.input.jump && player.vy < -260) player.vy += 1250 * dt;
  player.vy = Math.min(900, player.vy + 1780 * dt);

  const oldX = player.x;
  player.x += player.vx * dt;
  const worldPlatforms = currentPlatforms(state);
  const activeGates = activeLearningGates(state);
  const solids = worldPlatforms.concat(activeGates);
  // Тонкие платформы односторонние: на них можно приземлиться сверху,
  // но они не превращаются в стену, когда ребёнок бежит к нужному ответу.
  const sideSolids = worldPlatforms.filter((platform) => platform.kind === 'ground' || platform.kind === 'step').concat(activeGates);
  for (const platform of sideSolids) {
    if (!hit(player, platform)) continue;
    if (player.vx > 0 && oldX + player.w <= platform.x + 8) player.x = platform.x - player.w;
    else if (player.vx < 0 && oldX >= platform.x + platform.w - 8) player.x = platform.x + platform.w;
    player.vx = 0;
  }

  const oldY = player.y;
  player.y += player.vy * dt;
  player.grounded = false;
  player.groundedOn = null;
  for (const platform of solids) {
    if (!hit(player, platform)) continue;
    if (player.vy >= 0 && oldY + player.h <= platform.y + 14) {
      const landingSpeed = player.vy;
      player.y = platform.y - player.h;
      player.vy = platform.kind === 'spring' ? -910 : 0;
      player.grounded = platform.kind !== 'spring';
      player.groundedOn = platform.kind;
      if (platform.kind === 'spring') state.events.push('spring');
      if (platform.kind === 'conveyor') player.x += platform.direction * platform.beltSpeed * dt;
      if (landingSpeed > 35) handleLessonLanding(state, platform);
    } else if (player.vy < 0 && oldY >= platform.y + platform.h - 8 && (platform.kind === 'ground' || !platform.kind)) {
      player.y = platform.y + platform.h;
      player.vy = 70;
    }
  }

  updateChallengeReadiness(state, dt);

  player.x = Math.max(0, Math.min(state.level.worldW - player.w, player.x));
  if (player.y > WORLD_H + 100) respawn(state);

  for (const coin of state.coins) {
    if (!coin.taken && hit(player, { x: coin.x - 16, y: coin.y - 16, w: 32, h: 32 })) {
      coin.taken = true;
      state.collected += 1;
      sparkle(state, coin.x, coin.y, '#ffd75f', 7);
      state.events.push('coin');
    }
  }
  for (const star of state.stars) {
    if (!star.taken && hit(player, { x: star.x - 22, y: star.y - 22, w: 44, h: 44 })) {
      star.taken = true;
      state.rareStars += 1;
      sparkle(state, star.x, star.y, '#fff29a', 18);
      state.events.push('star');
    }
  }

  for (let i = state.level.checkpoints.length - 1; i > state.checkpoint; i -= 1) {
    if (player.x >= state.level.checkpoints[i].x) {
      state.checkpoint = i;
      state.events.push('checkpoint');
      break;
    }
  }

  updateEnemies(state, dt);
  updateHazards(state);

  if (learningComplete(state) && hit(player, state.level.portal)) {
    state.status = 'done';
    state.finishedAt = state.time;
    state.events.push('done');
  }

  for (const particle of state.particles) {
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.vy += 300 * dt;
    particle.life -= dt;
  }
  state.particles = state.particles.filter((particle) => particle.life > 0);
}

export function academyScore(state) {
  const lessons = state.level.challenges?.length
    ? Object.values(state.challengeProgress).filter(Boolean).length
    : Object.values(state.solved).filter(Boolean).length;
  return state.collected * 10 + state.rareStars * 250 + state.hearts * 100 + lessons * 150;
}

export function drainAcademyEvents(state) {
  if (!state.events.length) return [];
  return state.events.splice(0);
}

export { WORLD_H, runeOrder };