// Headless-проверка движка «Моста через реку»: node scripts/test-bridge-game.mjs
//
// Канвас в автоматической проверке не рисуется (нет DOM), поэтому правила
// проверяем симуляцией игры, а отрисовку — прогоном draw() на мок-контексте:
// это ловит опечатки и падения, хотя и не оценивает красоту.

import {
  FOX_X,
  LANE_Y,
  LEVELS,
  MAX_DOTS,
  SLABS_PER_LEVEL,
  STEP,
  createGame,
  drainEvents,
  moveLane,
  nextTarget,
  starsFor,
  update,
} from '../components/school-prep/bridge/engine.js';
import { draw } from '../components/school-prep/bridge/render.js';

let failures = 0;
function check(name, condition, extra) {
  if (condition) {
    console.log('  ok   ' + name);
  } else {
    failures += 1;
    console.log('  FAIL ' + name + (extra === undefined ? '' : ' → ' + JSON.stringify(extra)));
  }
}

function perfectPlayer(game) {
  if (!game.group || game.group.resolved) return;
  const slot = game.group.slots.find((s) => s.value === game.target);
  if (!slot) return;
  const delta = slot.lane - game.fox.lane;
  if (delta !== 0) moveLane(game, delta > 0 ? 1 : -1);
}

// Важно вставать именно на ЗАНЯТУЮ неверную плиту, а не в пустую дорожку:
// иначе проверка «плита краснеет» проходит вхолостую — краснеть нечему.
function wrongPlayer(game) {
  if (!game.group || game.group.resolved) return;
  const wrong = game.group.slots.find((s) => s.value !== game.target);
  if (!wrong || game.fox.lane === wrong.lane) return;
  moveLane(game, game.fox.lane < wrong.lane ? 1 : -1);
}

function run(game, player, maxSeconds) {
  const steps = Math.round(maxSeconds / STEP);
  const seen = [];
  const events = [];
  for (let i = 0; i < steps; i += 1) {
    player(game);
    update(game, STEP);
    const batch = drainEvents(game);
    if (batch) events.push(...batch);
    if (game.group && !game.group.resolved && seen[seen.length - 1] !== game.target) {
      seen.push(game.target);
    }
    if (game.status === 'done') break;
  }
  return { seen, events };
}

console.log('\n1. Идеальное прохождение каждого из ' + LEVELS.length + ' уровней');
for (let i = 0; i < LEVELS.length; i += 1) {
  const game = createGame(i, 12345 + i);
  const out = run(game, perfectPlayer, 140);
  check(
    'уровень ' + LEVELS[i].id + ' (' + LEVELS[i].title + ') пройден без ошибок',
    game.status === 'done' && game.collected === SLABS_PER_LEVEL && game.misses === 0,
    { status: game.status, collected: game.collected, misses: game.misses },
  );
  check('  событие done ровно одно', out.events.filter((e) => e === 'done').length === 1);
  check('  ok-событий столько же, сколько плит', out.events.filter((e) => e === 'ok').length === SLABS_PER_LEVEL);
}

console.log('\n2. Ряд чисел соответствует настройкам уровня');
for (let i = 0; i < LEVELS.length; i += 1) {
  const level = LEVELS[i];
  const want = [];
  let value = level.from;
  for (let n = 0; n < SLABS_PER_LEVEL; n += 1) {
    want.push(value);
    value = nextTarget(level, value);
  }
  const game = createGame(i, 777 + i);
  const out = run(game, perfectPlayer, 140);
  const row = out.seen.slice(0, SLABS_PER_LEVEL);
  check('уровень ' + level.id + ': ' + row.join(','), JSON.stringify(row) === JSON.stringify(want), { got: row, want });
}

console.log('\n3. Правила выбора плит');
{
  let groups = 0;
  let bad = 0;
  let dotsSeen = 0;
  for (let i = 0; i < LEVELS.length; i += 1) {
    const game = createGame(i, 4242 + i);
    let lastGroup = null;
    for (let s = 0; s < 90 / STEP; s += 1) {
      perfectPlayer(game);
      update(game, STEP);
      if (game.group && game.group !== lastGroup) {
        lastGroup = game.group;
        groups += 1;
        const values = game.group.slots.map((x) => x.value);
        const correct = game.group.slots.filter((x) => x.value === game.target).length;
        const unique = new Set(values).size === values.length;
        const positive = values.every((v) => v >= 1);
        const lanes = new Set(game.group.slots.map((x) => x.lane)).size === game.group.slots.length;
        const count = game.group.slots.length === game.level.choices;
        const dotsOk = game.group.slots.every((x) => x.kind !== 'dots' || x.value <= MAX_DOTS);
        dotsSeen += game.group.slots.filter((x) => x.kind === 'dots').length;
        if (!(correct === 1 && unique && positive && lanes && count && dotsOk)) bad += 1;
      }
      if (game.status === 'done') break;
    }
  }
  check('в каждой группе одна верная плита, числа не повторяются, ≥ 1 (' + groups + ' групп)', bad === 0, { bad });
  check('точками показываются только числа до ' + MAX_DOTS + ' (' + dotsSeen + ' таких плит)', dotsSeen > 0);
}

console.log('\n4. Ошибка показана явно и не наказывает');
{
  const game = createGame(0, 999);
  let before = null;
  let speedBefore = null;
  let group = null;
  for (let s = 0; s < 20 / STEP; s += 1) {
    wrongPlayer(game);
    if (game.group && !game.group.resolved) {
      before = game.target;
      speedBefore = game.speed;
      group = game.group;
    }
    update(game, STEP);
    if (game.misses > 0) break;
  }
  const chosen = group.slots.find((s) => s.lane === game.fox.lane);
  const right = group.slots.find((s) => s.lane === group.correctLane);
  check('промах засчитан', game.misses === 1, { misses: game.misses });
  check('лисёнок стоял именно на плите, а не в пустой дорожке', Boolean(chosen), {
    lane: game.fox.lane,
    lanes: group.slots.map((s) => s.lane),
  });
  check('выбранная плита помечена как ошибочная (красная)', Boolean(chosen) && chosen.state === 'wrong', {
    state: chosen && chosen.state,
  });
  check('верная плита подсвечена (зелёная с галочкой)', right.state === 'reveal' || right.state === 'ok', {
    state: right.state,
  });
  check('нужное число не изменилось', game.target === before, { before, after: game.target });
  check('скорость снизилась, а не выросла', game.speed < speedBefore);
  check('включились тряска и красная вспышка', game.shake > 0 && Boolean(game.flash) && game.flash.kind === 'bad');
  check('игра продолжается — game over нет', game.status === 'run');
}

console.log('\n5. Подсказка после двух промахов');
{
  const game = createGame(0, 31337);
  let guard = 0;
  while (game.misses < 2 && guard < 120 / STEP) {
    wrongPlayer(game);
    update(game, STEP);
    guard += 1;
  }
  check('после двух промахов hint = true', game.misses >= 2 && game.hint === true, {
    misses: game.misses,
    hint: game.hint,
  });
  check('игра всё ещё идёт', game.status === 'run');
}

console.log('\n6. Фонарик возвращает потерянный фонарь');
{
  const game = createGame(0, 5150);
  game.misses = 2;
  game.hint = true;
  game.bonus = { x: FOX_X + 120, lane: game.fox.lane, taken: false };
  let events = [];
  for (let s = 0; s < 5 / STEP; s += 1) {
    update(game, STEP);
    const batch = drainEvents(game);
    if (batch) events = events.concat(batch);
    if (game.bonus && game.bonus.taken) break;
  }
  check('фонарик пойман', Boolean(game.bonus && game.bonus.taken));
  check('промах списан обратно', game.misses === 1, { misses: game.misses });
  check('подсказка выключилась', game.hint === false);
  check('событие bonus отправлено', events.includes('bonus'));
}

console.log('\n7. Звёзды');
check('0 ошибок → 3 звезды', starsFor(0) === 3);
check('2 ошибки → 2 звезды', starsFor(2) === 2);
check('5 ошибок → 1 звезда', starsFor(5) === 1);

console.log('\n8. Случайный игрок не ломает движок');
{
  let seed = 5;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  let crashed = null;
  try {
    for (let i = 0; i < LEVELS.length; i += 1) {
      const game = createGame(i, 606 + i);
      run(game, (g) => (rnd() < 0.03 ? moveLane(g, rnd() < 0.5 ? -1 : 1) : null), 180);
      if (game.particles.length > 110) crashed = 'частиц больше лимита: ' + game.particles.length;
      if (game.trail.length > 40) crashed = 'хвост моста не чистится: ' + game.trail.length;
    }
  } catch (error) {
    crashed = error.message;
  }
  check('180 секунд случайной игры на каждом уровне без исключений и утечек', crashed === null, crashed);
}

console.log('\n9. Отрисовка не падает (мок-контекст)');
{
  const calls = { fillText: [] };
  const noop = () => {};
  const ctx = new Proxy(
    {
      canvas: { width: 960, height: 540 },
      fillText: (text) => calls.fillText.push(String(text)),
      createLinearGradient: () => ({ addColorStop: noop }),
      setLineDash: noop,
      measureText: () => ({ width: 10 }),
    },
    {
      get(target, prop) {
        if (prop in target) return target[prop];
        return noop;
      },
      set() {
        return true;
      },
    },
  );

  let error = null;
  try {
    for (let i = 0; i < LEVELS.length; i += 1) {
      // и удачная игра, и провальная — чтобы отрисовались все состояния плит
      for (const player of [perfectPlayer, wrongPlayer]) {
        const game = createGame(i, 2024 + i);
        game.bonus = { x: 900, lane: 0, taken: false };
        for (let s = 0; s < 40 / STEP; s += 1) {
          player(game);
          update(game, STEP);
          if (s % 5 === 0) draw(ctx, game);
          if (game.status === 'done') break;
        }
        draw(ctx, game);
      }
    }
  } catch (err) {
    error = err.message;
  }
  check('draw() отработал на всех уровнях', error === null, error);
  check('числа выводятся на камни', calls.fillText.some((t) => /^\d+$/.test(t)));
  check('в подсказке нет текста — только цифры', calls.fillText.every((t) => /^\d+$/.test(t)), {
    words: calls.fillText.filter((t) => !/^\d+$/.test(t)).slice(0, 5),
  });
}

console.log('\n10. Геометрия и конфигурация');
check('три дорожки', LANE_Y.length === 3);
check('лисёнок левее точки появления плит', FOX_X < 960);
check('nextTarget зацикливается на границе', nextTarget(LEVELS[0], 10) === 1);
check('у каждого уровня есть режим плит', LEVELS.every((l) => ['digits', 'dots', 'mixed'].includes(l.mode)));
check('у каждого уровня есть подсказка', LEVELS.every((l) => typeof l.tip === 'string' && l.tip.length > 0));

console.log(failures === 0 ? '\nВСЁ ЗЕЛЁНОЕ\n' : '\nПРОВАЛОВ: ' + failures + '\n');
process.exit(failures === 0 ? 0 : 1);
