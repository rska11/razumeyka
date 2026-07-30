import {
  FOX_X,
  LANE_Y,
  LEVELS,
  MAX_DOTS,
  MAX_PARTICLES,
  SLABS_PER_LEVEL,
  STEP,
  WORLD_H,
  WORLD_W,
  createChallenge,
  createGame,
  drainEvents,
  selectLane,
  starsFor,
  update,
} from '../components/school-prep/bridge/engine.js';
import { draw } from '../components/school-prep/bridge/render.js';

let failures = 0;
function check(name, condition, extra) {
  if (condition) console.log('  ok   ' + name);
  else {
    failures += 1;
    console.log('  FAIL ' + name + (extra === undefined ? '' : ' → ' + JSON.stringify(extra)));
  }
}

function perfectPlayer(game) {
  if (!game.group || game.group.resolved) return;
  const slot = game.group.slots.find((item) => item.value === game.challenge.answer);
  if (slot) selectLane(game, slot.lane);
}

function wrongPlayer(game) {
  if (!game.group || game.group.resolved) return;
  const slot = game.group.slots.find((item) => item.value !== game.challenge.answer);
  if (slot) selectLane(game, slot.lane);
}

function run(game, player, maxSeconds = 180) {
  const events = [];
  const challenges = [];
  let lastId = null;
  for (let index = 0; index < Math.round(maxSeconds / STEP); index += 1) {
    player(game);
    update(game, STEP);
    if (game.challenge && game.challenge.id !== lastId) {
      lastId = game.challenge.id;
      challenges.push(game.challenge);
    }
    const batch = drainEvents(game);
    if (batch) events.push(...batch);
    if (game.status === 'done') break;
  }
  return { events, challenges };
}

function seeded(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

console.log('\n1. Идеальное прохождение всех миссий');
for (let index = 0; index < LEVELS.length; index += 1) {
  const game = createGame(index, 1200 + index);
  const out = run(game, perfectPlayer);
  check(`миссия ${LEVELS[index].id} (${LEVELS[index].title}) пройдена`, game.status === 'done' && game.collected === SLABS_PER_LEVEL && game.misses === 0, { status: game.status, collected: game.collected, misses: game.misses });
  check('  десять осмысленных решений', out.events.filter((event) => event === 'ok').length === SLABS_PER_LEVEL);
  check('  событие done ровно одно', out.events.filter((event) => event === 'done').length === 1);
}

console.log('\n2. Учебная программа и сложность заданий');
{
  const kinds = new Set();
  let invalid = 0;
  for (const level of LEVELS) {
    const rng = seeded(9000 + level.id);
    for (let round = 0; round < SLABS_PER_LEVEL; round += 1) {
      const item = createChallenge(level, round, rng);
      kinds.add(item.kind);
      const unique = new Set(item.options);
      const oneAnswer = item.options.filter((value) => value === item.answer).length === 1;
      const valid = level.challengeKinds.includes(item.kind) && item.prompt.includes('?') || ['neighbor-after', 'neighbor-before', 'between', 'quantity-more', 'quantity-less'].includes(item.kind);
      if (!(Number.isInteger(item.answer) && item.answer >= 0 && item.answer <= 20 && item.options.length === 3 && unique.size === 3 && oneAnswer && item.prompt.length >= 5 && item.explanation.includes(String(item.answer)) && valid)) invalid += 1;
    }
  }
  check('каждое задание имеет три разных варианта и один верный', invalid === 0, { invalid });
  check('используется не меньше 15 разных типов мышления', kinds.size >= 15, [...kinds]);
  check('финал смешивает минимум 7 типов задач', new Set(LEVELS[7].challengeKinds).size >= 7, LEVELS[7].challengeKinds);
  check('простое узнавание готового числа не является механикой', LEVELS.every((level) => !level.challengeKinds.includes('find-number')));
}

console.log('\n3. Генерация камней');
{
  let groups = 0;
  let invalid = 0;
  let dotsSeen = 0;
  for (let index = 0; index < LEVELS.length; index += 1) {
    const game = createGame(index, 4200 + index);
    let lastGroup = null;
    for (let step = 0; step < 170 / STEP && game.status !== 'done'; step += 1) {
      perfectPlayer(game);
      update(game, STEP);
      if (game.group && game.group !== lastGroup) {
        lastGroup = game.group;
        groups += 1;
        const values = game.group.slots.map((slot) => slot.value);
        const lanes = game.group.slots.map((slot) => slot.lane);
        const correct = values.filter((value) => value === game.challenge.answer).length;
        const dotsOk = game.group.slots.every((slot) => slot.kind !== 'dots' || slot.value <= MAX_DOTS);
        dotsSeen += game.group.slots.filter((slot) => slot.kind === 'dots').length;
        if (!(values.length === 3 && new Set(values).size === 3 && new Set(lanes).size === 3 && correct === 1 && dotsOk)) invalid += 1;
      }
    }
  }
  check(`в ${groups} группах по три дорожки, один ответ и без дублей`, invalid === 0, { invalid });
  check('в финале встречается перевод количества в число', dotsSeen > 0, { dotsSeen });
}

console.log('\n4. Ошибка объясняет, но не обрывает игру');
{
  const game = createGame(4, 999);
  let group = null;
  let challenge = null;
  for (let step = 0; step < 30 / STEP; step += 1) {
    wrongPlayer(game);
    if (game.group && !game.group.resolved) {
      group = game.group;
      challenge = game.challenge;
    }
    update(game, STEP);
    if (game.misses > 0) break;
  }
  const wrong = group.slots.find((slot) => slot.lane === game.fox.lane);
  const right = group.slots.find((slot) => slot.value === challenge.answer);
  check('промах засчитан', game.misses === 1);
  check('выбранный камень красный', wrong?.state === 'wrong', wrong);
  check('верный камень показан зелёным', ['reveal', 'ok'].includes(right?.state), right);
  check('есть короткое объяснение решения', game.feedback?.kind === 'bad' && game.feedback.detail === challenge.explanation, game.feedback);
  check('тот же навык можно попробовать снова', game.challenge.id === challenge.id && game.status === 'run');
}

console.log('\n5. Адаптивная помощь');
{
  const game = createGame(5, 31337);
  let guard = 0;
  while (game.misses < 2 && guard < 160 / STEP) {
    wrongPlayer(game);
    update(game, STEP);
    guard += 1;
  }
  check('после двух промахов включается золотая подсветка', game.misses >= 2 && game.hint === true, { misses: game.misses, hint: game.hint });
  game.bonus = { x: FOX_X + 80, lane: game.fox.lane, taken: false };
  for (let step = 0; step < 5 / STEP && !game.bonus.taken; step += 1) update(game, STEP);
  check('бонус снимает один промах', game.misses === 1, { misses: game.misses });
  check('после восстановления помощь снова выключена', game.hint === false);
}

console.log('\n6. Прямой выбор дорожки');
{
  const game = createGame(0, 33);
  check('можно сразу выбрать верхнюю дорожку', selectLane(game, 0) && game.fox.lane === 0);
  check('можно сразу выбрать нижнюю дорожку', selectLane(game, 2) && game.fox.lane === 2);
  check('индекс безопасно ограничивается', selectLane(game, 99) === false && game.fox.lane === 2);
}

console.log('\n7. Звёзды');
check('0 ошибок → 3 звезды', starsFor(0) === 3);
check('2 ошибки → 2 звезды', starsFor(2) === 2);
check('5 ошибок → 1 звезда', starsFor(5) === 1);

console.log('\n8. Случайная игра не ломает движок');
{
  const random = seeded(5);
  let error = null;
  try {
    for (let index = 0; index < LEVELS.length; index += 1) {
      const game = createGame(index, 600 + index);
      run(game, (state) => (random() < 0.035 ? selectLane(state, Math.floor(random() * 3)) : null), 180);
      if (game.particles.length > MAX_PARTICLES) throw new Error('частицы вышли за лимит');
      if (game.trail.length > 40) throw new Error('старые части моста не удаляются');
    }
  } catch (caught) {
    error = caught.message;
  }
  check('180 секунд на каждой миссии без исключений и утечек', error === null, error);
}

console.log('\n9. Отрисовка');
{
  const calls = { fillText: 0, drawImage: 0 };
  const noop = () => {};
  const gradient = () => ({ addColorStop: noop });
  const ctx = new Proxy({
    canvas: { width: WORLD_W, height: WORLD_H },
    fillText: () => { calls.fillText += 1; },
    drawImage: () => { calls.drawImage += 1; },
    createLinearGradient: gradient,
    createRadialGradient: gradient,
    setLineDash: noop,
  }, {
    get(target, property) {
      if (property in target) return target[property];
      return noop;
    },
    set() { return true; },
  });
  let error = null;
  try {
    for (let index = 0; index < LEVELS.length; index += 1) {
      const game = createGame(index, 2000 + index);
      for (let step = 0; step < 45 / STEP; step += 1) {
        perfectPlayer(game);
        update(game, STEP);
        if (step % 8 === 0) draw(ctx, game);
        if (game.status === 'done') break;
      }
      draw(ctx, game);
    }
  } catch (caught) {
    error = caught.message;
  }
  check('canvas-отрисовка всех состояний не падает', error === null, error);
  check('варианты ответа действительно рисуются', calls.fillText > 0, calls);
}

console.log('\n10. Конфигурация продукта');
check('восемь миссий и десять решений в каждой', LEVELS.length === 8 && SLABS_PER_LEVEL === 10);
check('три дорожки', LANE_Y.length === 3);
check('герой расположен до зоны появления камней', FOX_X < WORLD_W / 2);
check('у каждой миссии есть навык, акт и отдельная сцена', LEVELS.every((level) => level.skill && level.act && ['day', 'sunset', 'night'].includes(level.scene)));
check('скорость растёт умеренно, а не заменяет сложность', LEVELS.every((level) => level.speed <= 250 && level.speedUp <= 5));

console.log(failures === 0 ? '\nВСЁ ЗЕЛЁНОЕ\n' : `\nПРОВАЛОВ: ${failures}\n`);
process.exit(failures === 0 ? 0 : 1);