// Headless-проверка движка «Светлячка»: node scripts/test-firefly-game.mjs
//
// Правила проверяем симуляцией ведения указателя, отрисовку — прогоном draw()
// на мок-контексте (ловит падения, но не оценивает красоту).

import {
  LEVELS,
  MOUSE_BONUS,
  STEP,
  WORLD_H,
  WORLD_W,
  accuracy,
  createGame,
  drainEvents,
  progress,
  setPointer,
  setPointerType,
  starsFor,
  update,
} from '../components/school-prep/firefly/engine.js';
import { draw } from '../components/school-prep/firefly/render.js';

let failures = 0;
function check(name, condition, extra) {
  if (condition) {
    console.log('  ok   ' + name);
  } else {
    failures += 1;
    console.log('  FAIL ' + name + (extra === undefined ? '' : ' → ' + JSON.stringify(extra)));
  }
}

// Игрок, который ведёт точно по дорожке.
function perfect(game) {
  const next = Math.min(game.points.length - 1, game.index + 2);
  const point = game.points[next];
  setPointer(game, point.x, point.y, true);
}

function run(game, player, maxSeconds) {
  const steps = Math.round(maxSeconds / STEP);
  const events = [];
  for (let i = 0; i < steps; i += 1) {
    if (player) player(game);
    update(game, STEP);
    const batch = drainEvents(game);
    if (batch) events.push(...batch);
    if (game.status !== 'run') break;
  }
  return events;
}

console.log('\n1. Все ' + LEVELS.length + ' дорожек проходятся до домика');
for (let i = 0; i < LEVELS.length; i += 1) {
  const game = createGame(i);
  const events = run(game, perfect, 90);
  check(
    'дорожка ' + LEVELS[i].id + ' (' + LEVELS[i].title + ') пройдена',
    game.status === 'done' && progress(game) === 1,
    { status: game.status, progress: progress(game).toFixed(2), energy: game.energy.toFixed(1) },
  );
  check('  точность 100% → три звезды', starsFor(accuracy(game)) === 3, { accuracy: accuracy(game) });
  check('  событие done ровно одно', events.filter((e) => e === 'done').length === 1);
  const collected = events.filter((e) => e === 'collect').length;
  check('  все потерявшиеся светлячки спасены', collected === game.lights.length && game.swarm === collected, {
    собрано: collected,
    всего: game.lights.length,
    рой: game.swarm,
  });
}

console.log('\n2. Срезать путь нельзя');
{
  const game = createGame(1);
  const end = game.points[game.points.length - 1];
  for (let i = 0; i < 2 / STEP; i += 1) {
    setPointer(game, end.x, end.y, true);
    update(game, STEP);
  }
  check('указатель в конце дорожки не перематывает прогресс', game.index < 20 && game.status === 'run', {
    index: game.index,
    status: game.status,
  });
}

console.log('\n3. Сход с дорожки');
{
  const game = createGame(0);
  run(game, perfect, 0.5);
  const indexBefore = game.index;
  const energyBefore = game.energy;
  for (let i = 0; i < 1 / STEP; i += 1) {
    setPointer(game, game.points[game.index].x, WORLD_H - 10, true);
    update(game, STEP);
  }
  check('фонарик погас', game.lit === false);
  check('путь не продвинулся', game.index === indexBefore, { before: indexBefore, after: game.index });
  check('заряд тратится быстрее обычного', energyBefore - game.energy > 1.5, {
    spent: (energyBefore - game.energy).toFixed(2),
  });
  check('дорожка не сброшена — можно вернуться', game.index > 0 && game.status === 'run');
}

console.log('\n4. Пауза: палец отпустили');
{
  const game = createGame(0);
  run(game, perfect, 0.5);
  const energyBefore = game.energy;
  const indexBefore = game.index;
  for (let i = 0; i < 2 / STEP; i += 1) {
    setPointer(game, game.pointer.x, game.pointer.y, false);
    update(game, STEP);
  }
  check('за 2 секунды паузы заряд почти не потрачен', energyBefore - game.energy < 0.9, {
    spent: (energyBefore - game.energy).toFixed(2),
  });
  check('прогресс сохранился', game.index === indexBefore);
}

console.log('\n5. Кончился заряд — «устал», а не «проиграл»');
{
  const game = createGame(0);
  game.energy = 0.4;
  for (let i = 0; i < 2 / STEP; i += 1) {
    perfect(game);
    update(game, STEP);
    if (game.status !== 'run') break;
  }
  check('статус tired', game.status === 'tired', { status: game.status });
  check('звёзд за незаконченную дорожку не даём', starsFor(accuracy(game)) >= 1 && game.status !== 'done');
}

console.log('\n6. Мышь получает дорожку пошире');
{
  const touch = createGame(0, { pointerType: 'touch' });
  const mouse = createGame(0, { pointerType: 'mouse' });
  check('радиус для мыши больше на ' + MOUSE_BONUS, mouse.radius - touch.radius === MOUSE_BONUS, {
    touch: touch.radius,
    mouse: mouse.radius,
  });
  const switched = createGame(0);
  setPointerType(switched, 'mouse');
  check('переключение типа указателя на лету работает', switched.radius === mouse.radius);
}

console.log('\n7. Точность считается честно');
{
  const game = createGame(0);
  // половину времени ведём по дорожке, половину — мимо
  for (let i = 0; i < 240; i += 1) {
    if (i % 2 === 0) perfect(game);
    else setPointer(game, game.points[game.index].x, WORLD_H - 10, true);
    update(game, STEP);
    if (game.status !== 'run') break;
  }
  const value = accuracy(game);
  check('точность около 50%', value > 0.35 && value < 0.65, { accuracy: value.toFixed(2) });
  check('такая точность даёт не три звезды', starsFor(value) < 3);
}

console.log('\n8. Геометрия дорожек');
{
  let bad = 0;
  for (let i = 0; i < LEVELS.length; i += 1) {
    const game = createGame(i);
    for (const point of game.points) {
      if (point.x < 40 || point.x > WORLD_W - 40 || point.y < 40 || point.y > WORLD_H - 60) bad += 1;
    }
  }
  check('все точки дорожек внутри экрана с полями', bad === 0, { outside: bad });
  check('у каждой дорожки задана ширина и время', LEVELS.every((l) => l.width > 0 && l.seconds > 0));
}

console.log('\n9. Отрисовка не падает (мок-контекст)');
{
  const noop = () => {};
  const ctx = new Proxy(
    {
      canvas: { width: 960, height: 540 },
      createLinearGradient: () => ({ addColorStop: noop }),
      createRadialGradient: () => ({ addColorStop: noop }),
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
      const game = createGame(i);
      for (let s = 0; s < 30 / STEP; s += 1) {
        perfect(game);
        update(game, STEP);
        if (s % 6 === 0) draw(ctx, game);
        if (game.status !== 'run') break;
      }
      draw(ctx, game);
    }
  } catch (err) {
    error = err.message;
  }
  check('draw() отработал на всех дорожках', error === null, error);
}

console.log(failures === 0 ? '\nВСЁ ЗЕЛЁНОЕ\n' : '\nПРОВАЛОВ: ' + failures + '\n');
process.exit(failures === 0 ? 0 : 1);
