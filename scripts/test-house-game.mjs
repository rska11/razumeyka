// Headless-проверка платформера «Дом знаний»: node scripts/test-house-game.mjs
//
// Главное здесь — не физика (её видно глазом), а ПРОХОДИМОСТЬ комнат:
// каждая платформа достижима прыжком от предыдущей, каждая цифра лежит над
// платформой в пределах прыжка, дверь стоит на достижимой платформе.
// Такую поломку в раскладке глазами не увидишь, пока не застрянешь в игре.

import {
  GRAVITY,
  JUMP_HEIGHT,
  JUMP_RANGE,
  JUMP_VELOCITY,
  PLAYER_H,
  PLAYER_W,
  STEP,
  createGame,
  drainEvents,
  expectedValue,
  pressJump,
  setInput,
  starsFor,
  update,
} from '../components/school-prep/house/engine.js';
import { ROOMS } from '../components/school-prep/house/rooms.js';

let failures = 0;
function check(name, condition, extra) {
  if (condition) {
    console.log('  ok   ' + name);
  } else {
    failures += 1;
    console.log('  FAIL ' + name + (extra === undefined ? '' : ' → ' + JSON.stringify(extra)));
  }
}

// Запас берём меньше расчётного: игрок не идеальная машина, впритык прыгать
// ребёнок не обязан.
const MAX_UP = JUMP_HEIGHT - 15;
const MAX_GAP = JUMP_RANGE * 0.82;

function isOutside(player, hazard) {
  return !(
    player.x < hazard.x + hazard.w &&
    player.x + PLAYER_W > hazard.x &&
    player.y < hazard.y + hazard.h &&
    player.y + PLAYER_H > hazard.y
  );
}

function horizontalGap(a, b) {
  if (a.x + a.w < b.x) return b.x - (a.x + a.w);
  if (b.x + b.w < a.x) return a.x - (b.x + b.w);
  return 0;
}

function canJump(from, to) {
  const up = from.y - to.y;
  if (up > MAX_UP) return false;
  return horizontalGap(from, to) <= MAX_GAP;
}

function reachablePlatforms(room) {
  const start = room.platforms.reduce((best, platform) => {
    const supports =
      room.spawn.x + PLAYER_W > platform.x &&
      room.spawn.x < platform.x + platform.w &&
      platform.y >= room.spawn.y;
    if (!supports) return best;
    return !best || platform.y < best.y ? platform : best;
  }, null);

  const open = [start || room.platforms[0]];
  const seen = new Set(open);
  while (open.length) {
    const current = open.pop();
    for (const platform of room.platforms) {
      if (seen.has(platform)) continue;
      if (!canJump(current, platform)) continue;
      seen.add(platform);
      open.push(platform);
    }
  }
  return seen;
}

console.log('\n1. Физика');
{
  const room = ROOMS[0];
  const game = createGame(room);
  for (let i = 0; i < 2 / STEP; i += 1) update(game, STEP);
  check('лисёнок падает и встаёт на платформу', game.player.onGround === true, {
    y: Math.round(game.player.y),
    vy: Math.round(game.player.vy),
  });

  const before = game.player.y;
  pressJump(game);
  setInput(game, { left: false, right: false, jump: true });
  let highest = before;
  for (let i = 0; i < 1.2 / STEP; i += 1) {
    update(game, STEP);
    highest = Math.min(highest, game.player.y);
  }
  const lifted = before - highest;
  check('прыжок поднимает примерно на расчётную высоту', lifted > JUMP_HEIGHT * 0.7 && lifted < JUMP_HEIGHT * 1.2, {
    lifted: Math.round(lifted),
    expected: Math.round(JUMP_HEIGHT),
  });

  const short = createGame(room);
  for (let i = 0; i < 1 / STEP; i += 1) update(short, STEP);
  const base = short.player.y;
  pressJump(short);
  setInput(short, { left: false, right: false, jump: true });
  update(short, STEP);
  setInput(short, { left: false, right: false, jump: false });
  let shortTop = base;
  for (let i = 0; i < 1.2 / STEP; i += 1) {
    update(short, STEP);
    shortTop = Math.min(shortTop, short.player.y);
  }
  check('короткое нажатие даёт прыжок ниже длинного', base - shortTop < lifted * 0.85, {
    short: Math.round(base - shortTop),
    long: Math.round(lifted),
  });

  check('гравитация и скорость положительные', GRAVITY > 0 && JUMP_VELOCITY < 0);
}

console.log('\n2. Проходимость всех ' + ROOMS.length + ' комнат');
for (const room of ROOMS) {
  const reachable = reachablePlatforms(room);
  check(
    'комната ' + room.id + ' («' + room.title + '»): все платформы достижимы',
    reachable.size === room.platforms.length,
    {
      достижимо: reachable.size,
      всего: room.platforms.length,
      недостижимы: room.platforms.filter((p) => !reachable.has(p)).map((p) => p.x + ':' + p.y),
    },
  );

  const badItems = room.items.filter((item) => {
    return !room.platforms.some((platform) => {
      if (!reachable.has(platform)) return false;
      const overX = item.x > platform.x - 34 && item.x < platform.x + platform.w + 34;
      const overY = item.y <= platform.y + 12 && item.y >= platform.y - 115;
      return overX && overY;
    });
  });
  check('  все цифры лежат в пределах прыжка', badItems.length === 0, badItems.map((i) => i.value + '@' + i.x + ':' + i.y));

  const doorFloor = room.platforms.find(
    (platform) =>
      reachable.has(platform) &&
      Math.abs(room.door.y + 92 - platform.y) < 6 &&
      room.door.x + 56 > platform.x &&
      room.door.x < platform.x + platform.w,
  );
  check('  дверь стоит на достижимой платформе', Boolean(doorFloor), room.door);

  if (room.key) {
    const keyOk = room.platforms.some((platform) => {
      if (!reachable.has(platform)) return false;
      const overX = room.key.x > platform.x - 34 && room.key.x < platform.x + platform.w + 34;
      const overY = room.key.y <= platform.y + 12 && room.key.y >= platform.y - 115;
      return overX && overY;
    });
    check('  ключ достижим', keyOk, room.key);
  }

  const values = room.items.map((item) => item.value).sort((a, b) => a - b);
  const order = room.order.slice().sort((a, b) => a - b);
  check('  набор цифр совпадает с заданием', JSON.stringify(values) === JSON.stringify(order), {
    items: values,
    order,
  });

  const inside = room.items.every((item) => item.x > 20 && item.x < 940 && item.y > 60 && item.y < 500);
  check('  цифры не выпали за экран', inside);

  // Цифра над лужей — ловушка: ребёнок идёт за ней и поскальзывается снова и
  // снова, не понимая, что от него хотят.
  const overHazard = room.items.filter((item) =>
    room.hazards.some(
      (hazard) =>
        item.x + PLAYER_W / 2 > hazard.x &&
        item.x - PLAYER_W / 2 < hazard.x + hazard.w &&
        item.y + PLAYER_H / 2 > hazard.y - 6,
    ),
  );
  check('  ни одна цифра не стоит над лужей', overHazard.length === 0, overHazard.map((i) => i.value));

  // Мебель, под которой герой не помещается, обязана доходить до пола —
  // иначе он «входит» в неё и его выбрасывает рывком к краю.
  const trap = room.platforms.filter((platform) => {
    if (platform.kind === 'floor') return false;
    const bottom = platform.y + platform.h;
    return bottom < 492 && 492 - bottom < PLAYER_H + 8;
  });
  check('  нет мебели с щелью, в которой застревает герой', trap.length === 0, trap.map((p) => p.kind + '@' + p.x));
}

console.log('\n3. Сбор по порядку');
{
  const game = createGame(ROOMS[0]);
  const order = ROOMS[0].order;
  check('сначала нужна первая цифра ряда', expectedValue(game) === order[0]);

  // Ставим лисёнка на неверную цифру.
  const wrong = game.items.find((item) => item.value !== order[0]);
  game.player.x = wrong.x - PLAYER_W / 2;
  game.player.y = wrong.y - PLAYER_H / 2;
  update(game, STEP);
  const events = drainEvents(game) || [];
  check('неверная цифра не засчитана', wrong.taken === false && game.expectedIndex === 0);
  check('неверная цифра отпрыгнула', wrong.bounce > 0);
  check('засчитана ошибка, но игра идёт', game.mistakes === 1 && game.status === 'run');
  check('отправлено событие wrong', events.includes('wrong'));
}

console.log('\n4. Комната проходится до двери');
for (const source of ROOMS) {
  // Лужи проверяются отдельным блоком; здесь важна логика сбора и двери,
  // поэтому подставляем лисёнка прямо к цифрам в комнате без луж.
  const room = { ...source, hazards: [] };
  const game = createGame(room);
  // Подставляем лисёнка к нужной цифре — проверяем логику, а не умение играть.
  for (let step = 0; step < room.order.length; step += 1) {
    const need = expectedValue(game);
    const item = game.items.find((one) => one.value === need);
    game.player.x = item.x - PLAYER_W / 2;
    game.player.y = item.y - PLAYER_H / 2;
    game.player.vy = 0;
    update(game, STEP);
  }
  check('комната ' + room.id + ': все цифры собраны', game.expectedIndex === room.order.length, {
    собрано: game.expectedIndex,
  });

  if (room.key) {
    check('  без ключа дверь закрыта', game.doorOpen === false);
    game.player.x = room.key.x - PLAYER_W / 2;
    game.player.y = room.key.y - PLAYER_H / 2;
    update(game, STEP);
    check('  ключ подобран', game.keyTaken === true);
  }

  update(game, STEP);
  check('  дверь открылась', game.doorOpen === true);

  game.player.x = room.door.x;
  game.player.y = room.door.y + 20;
  update(game, STEP);
  check('  вход в дверь завершает комнату', game.status === 'done', { status: game.status });
}

console.log('\n5. Падение и лужи не убивают');
{
  const game = createGame(ROOMS[1]);
  for (let i = 0; i < 1 / STEP; i += 1) update(game, STEP);
  const safe = { x: game.player.x, y: game.player.y };
  game.player.y = 900;
  update(game, STEP);
  check('падение вниз возвращает на платформу', Math.abs(game.player.y - safe.y) < 40 && game.status === 'run', {
    y: Math.round(game.player.y),
    safeY: Math.round(safe.y),
  });
  check('засчитано поскальзывание', game.slips === 1);

  // Пережидаем короткую неуязвимость после первого поскальзывания.
  for (let i = 0; i < 1 / STEP; i += 1) update(game, STEP);
  const hazard = ROOMS[1].hazards[0];
  game.player.x = hazard.x;
  game.player.y = hazard.y - PLAYER_H + 8;
  update(game, STEP);
  check('лужа отбрасывает к последней платформе, а не заканчивает игру', game.status === 'run' && game.slips === 2, {
    slips: game.slips,
  });
}

console.log('\n5б. Лужа не заклинивает игру (баг с бесконечным возвратом)');
{
  // Ребёнок идёт по полу и наступает в лужу. Раньше точка возврата успевала
  // запомниться прямо в луже — и лисёнка возвращало в неё снова и снова.
  const room = ROOMS[1];
  const hazard = room.hazards[0];
  const game = createGame(room);
  // Встаём на пол правее лужи и идём влево прямо в неё.
  game.player.x = hazard.x + hazard.w + 60;
  game.player.y = 400;
  for (let i = 0; i < 1 / STEP; i += 1) update(game, STEP);

  // Идём в лужу…
  setInput(game, { left: true, right: false, jump: false });
  for (let i = 0; i < 1.2 / STEP; i += 1) {
    update(game, STEP);
    if (game.slips > 0) break;
  }
  const afterFirst = game.slips;
  // …и отпускаем управление. Дальше игра обязана успокоиться: именно здесь
  // раньше начинался вечный цикл «вернулся в лужу — снова поскользнулся».
  setInput(game, { left: false, right: false, jump: false });
  for (let i = 0; i < 3 / STEP; i += 1) update(game, STEP);

  check('поскальзывание случилось', afterFirst >= 1, { slips: afterFirst });
  check('без нажатий больше не срывается', game.slips === afterFirst, {
    было: afterFirst,
    стало: game.slips,
  });
  check('лисёнок стоит не в луже', isOutside(game.player, hazard), {
    x: Math.round(game.player.x),
    y: Math.round(game.player.y),
  });
  check('игра продолжается', game.status === 'run');

  // И отдельно: точка возврата никогда не совпадает с лужей.
  const stuckInHazard =
    game.checkpoint.x + PLAYER_W > hazard.x &&
    game.checkpoint.x < hazard.x + hazard.w &&
    game.checkpoint.y + PLAYER_H > hazard.y;
  check('точка возврата не запомнена внутри лужи', !stuckInHazard, game.checkpoint);
}

console.log('\n6. Звёзды');
{
  const game = createGame(ROOMS[0]);
  check('чисто → 3 звезды', starsFor(game) === 3);
  game.mistakes = 2;
  check('две ошибки → 2 звезды', starsFor(game) === 2);
  game.slips = 3;
  check('пять помарок → 1 звезда', starsFor(game) === 1);
}

console.log(failures === 0 ? '\nВСЁ ЗЕЛЁНОЕ\n' : '\nПРОВАЛОВ: ' + failures + '\n');
process.exit(failures === 0 ? 0 : 1);
