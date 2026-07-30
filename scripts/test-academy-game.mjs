import assert from 'node:assert/strict';
import {
  STEP,
  activeLearningGates,
  createAcademyGame,
  learningComplete,
  pressAcademyJump,
  setAcademyInput,
  updateAcademy,
} from '../components/school-prep/academy/engine.js';
import { ACADEMY_LEVELS } from '../components/school-prep/academy/level.js';

const test = (name, fn) => { fn(); console.log(`✓ ${name}`); };
const landWithoutReading = (game, platform) => {
  game.player.x = platform.x + Math.min(30, platform.w / 3);
  game.player.y = platform.y - game.player.h - 2;
  game.player.vx = 0;
  game.player.vy = 180;
  updateAcademy(game, STEP);
};
const land = (game, platform) => {
  if (platform.challengeId) game.challengeReady[platform.challengeId] = true;
  landWithoutReading(game, platform);
};
const platform = (game, kind, key, value) => game.platforms.find((item) => item.kind === kind && item[key] === value);
const challengePad = (game, challengeId, value) => game.platforms.find((item) => item.challengeId === challengeId && item.value === value);
const challengeChoice = (game, challengeId, value) => game.platforms.find((item) => item.challengeId === challengeId && (item.value ?? item.amount ?? item.shape) === value);
const jumpOnto = (game, target) => {
  if (target.challengeId) game.challengeReady[target.challengeId] = true;
  Object.assign(game.player, {
    x: target.x + target.w / 2 - game.player.w / 2,
    y: 556,
    vx: 0,
    vy: 0,
    grounded: true,
    invulnerable: 5,
  });
  setAcademyInput(game, { left: false, right: false, jump: true });
  pressAcademyJump(game);
  for (let frame = 0; frame < 14; frame += 1) updateAcademy(game, STEP);
  setAcademyInput(game, { jump: false });
  for (let frame = 0; frame < 150 && !game.solved[game.level.skill]; frame += 1) updateAcademy(game, STEP);
};
const gameFor = (id) => createAcademyGame(0, id);

const solutions = {
  'number-bridge': (game) => {
    land(game, challengeChoice(game, 'missing-number', 3));
    land(game, challengeChoice(game, 'number-neighbors', 7));
    land(game, challengeChoice(game, 'number-neighbors', 9));
    land(game, challengeChoice(game, 'reverse-count', 7));
  },
  'energy-scales': (game) => {
    land(game, challengeChoice(game, 'compare-charge', 5));
    land(game, challengeChoice(game, 'balance-seven', 4));
    land(game, challengeChoice(game, 'compare-sign', '>'));
  },
  'mechanism-rhythm': (game) => {
    land(game, challengeChoice(game, 'shape-pattern', 'diamond'));
    land(game, challengeChoice(game, 'color-rhythm', 'blue'));
    land(game, challengeChoice(game, 'color-rhythm', 'gold'));
    land(game, challengeChoice(game, 'color-rhythm', 'pink'));
    land(game, challengeChoice(game, 'alternating-pattern', 'triangle'));
  },
  'reactor-five': (game) => {
    land(game, challengeChoice(game, 'make-five', 2));
    land(game, challengeChoice(game, 'make-five', 3));
    land(game, challengeChoice(game, 'addition-seven', 7));
    land(game, challengeChoice(game, 'first-groups', 6));
  },
};

test('Механическая академия состоит из четырёх полноценных миссий', () => {
  assert.equal(ACADEMY_LEVELS.length, 4);
  assert.deepEqual(ACADEMY_LEVELS.map((level) => level.id), ['number-bridge', 'energy-scales', 'mechanism-rhythm', 'reactor-five']);
  for (const level of ACADEMY_LEVELS) {
    assert.ok(level.platforms.length >= 10);
    assert.equal(level.stars.length, 3);
    assert.ok(level.coins.length >= 10);
    assert.ok(level.checkpoints.length >= 3);
    assert.equal(Object.keys(level.learningGates).length, level.challenges?.length || 1);
  }
});

test('герой разгоняется и прыгает с буфером ввода', () => {
  const game = gameFor('number-bridge');
  game.player.y = 556;
  game.player.grounded = true;
  setAcademyInput(game, { right: true, jump: true });
  pressAcademyJump(game);
  updateAcademy(game, STEP);
  assert.ok(game.player.vx > 0);
  assert.ok(game.player.vy < 0);
});

test('каждая миссия начинается собственной игровой механикой', () => {
  const byId = Object.fromEntries(ACADEMY_LEVELS.map((level) => [level.id, level]));
  assert.equal(byId['number-bridge'].platforms.filter((item) => item.kind === 'step').length, 3, 'только Числовой мост использует подъём по ступеням');
  assert.equal(byId['energy-scales'].platforms.filter((item) => item.kind === 'step').length, 0);
  assert.equal(byId['mechanism-rhythm'].platforms.filter((item) => item.kind === 'step').length, 0);
  assert.equal(byId['reactor-five'].platforms.filter((item) => item.kind === 'step').length, 0);
  assert.ok(byId['energy-scales'].platforms.slice(0, 5).some((item) => item.kind === 'lift'), 'второй уровень должен начинаться лифтами');
  assert.ok(byId['mechanism-rhythm'].platforms.slice(0, 5).some((item) => item.kind === 'gear'), 'третий уровень должен начинаться шестернями');
  assert.ok(byId['reactor-five'].platforms.slice(0, 5).some((item) => item.kind === 'conveyor'), 'четвёртый уровень должен начинаться конвейерами');
});
test('игровые мастерские доступны с пола и не имеют скрытых препятствий', () => {
  const answerKinds = ['numberPad', 'comparePad', 'switch', 'compositionPad', 'symbolPad', 'rhythmPad'];
  for (const level of ACADEMY_LEVELS) {
    const zones = level.challenges?.length
      ? level.challenges.map((challenge) => ({ ...challenge.zone, id: challenge.id }))
      : [{ ...level.learningZone, id: null }];
    for (const zone of zones) {
      const answers = level.platforms.filter((item) => answerKinds.includes(item.kind) && (!zone.id || item.challengeId === zone.id));
      const ground = level.platforms.find((item) => item.kind === 'ground' && item.x <= zone.x && item.x + item.w >= zone.x + zone.w);
      assert.ok(ground, `${level.id}/${zone.id || 'main'}: под мастерской нет непрерывного пола`);
      assert.ok(answers.length >= 2, `${level.id}/${zone.id || 'main'}: недостаточно вариантов ответа`);
      assert.ok(answers.every((item) => item.y === 525), `${level.id}/${zone.id || 'main'}: ответы стоят на разной высоте`);
      for (const answer of answers) {
        assert.ok(answer.x >= zone.x && answer.x + answer.w <= zone.x + zone.w, `${level.id}/${zone.id || 'main'}: ответ вышел из мастерской`);
        const blockers = level.platforms.filter((item) => item !== answer && item.kind !== 'ground' && item.y < answer.y && item.x < answer.x + answer.w && item.x + item.w > answer.x);
        assert.equal(blockers.length, 0, `${level.id}/${zone.id || 'main'}: над ответом есть препятствие`);
      }
      assert.equal(level.enemies.filter((item) => item.x > zone.x && item.x < zone.x + zone.w).length, 0, `${level.id}/${zone.id || 'main'}: враг мешает решению`);
    }
  }
});
test('до верного ответа можно добежать под неверными платформами, не выбирая их', () => {
  const cases = [
    ['number-bridge', 'numberPad', 'value', 3],
    ['energy-scales', 'comparePad', 'amount', 5],
    ['mechanism-rhythm', 'switch', 'rune', 1],
  ];
  for (const [levelId, kind, key, value] of cases) {
    const game = gameFor(levelId);
    const target = platform(game, kind, key, value);
    Object.assign(game.player, { x: game.level.learningZone.x + 12, y: 556, vx: 0, vy: 0, grounded: true, invulnerable: 5 });
    setAcademyInput(game, { right: true, jump: false });
    for (let frame = 0; frame < 240 && game.player.x < target.x + 12; frame += 1) updateAcademy(game, STEP);
    setAcademyInput(game, { right: false });
    assert.ok(game.player.x >= target.x + 12, `${levelId}: неверная платформа перекрыла путь к верной`);
    assert.equal(game.lessonMistakes, 0, `${levelId}: пробег под платформой ошибочно засчитан как ответ`);
    jumpOnto(game, target);
    if (game.level.challenges?.length) {
      const firstChallenge = game.level.challenges[0];
      assert.equal(game.challengeProgress[firstChallenge.id], true, `${levelId}: первая мастерская не запустилась`);
    } else {
      assert.equal(game.solved[game.level.skill], true, `${levelId}: верная платформа не сработала`);
    }
  }

  const reactor = gameFor('reactor-five');
  land(reactor, platform(reactor, 'compositionPad', 'amount', 2));
  reactor.celebration = 0;
  Object.assign(reactor.player, { x: 1160, y: 556, vx: 0, vy: 0, grounded: true, invulnerable: 5 });
  setAcademyInput(reactor, { right: true, jump: false });
  const secondPart = platform(reactor, 'compositionPad', 'amount', 3);
  for (let frame = 0; frame < 240 && reactor.player.x < secondPart.x + 12; frame += 1) updateAcademy(reactor, STEP);
  assert.ok(reactor.player.x >= secondPart.x + 12, 'reactor-five: платформа 4 перекрыла путь к платформе 3');
  assert.equal(reactor.lessonMistakes, 0, 'пробег под платформой 4 не должен считаться выбором');
  jumpOnto(reactor, secondPart);
  assert.equal(reactor.challengeProgress['make-five'], true, 'reactor-five: на платформу 3 нельзя физически запрыгнуть снизу');
});
test('каждый выбор даёт заметную и понятную обратную связь', () => {
  const numberGame = gameFor('number-bridge');
  const wrongNumber = platform(numberGame, 'numberPad', 'value', 6);
  land(numberGame, wrongNumber);
  assert.equal(numberGame.feedback.type, 'wrong');
  assert.match(numberGame.feedback.detail, /один, два/);
  assert.equal(wrongNumber.answerState, 'wrong');

  const rightNumber = platform(numberGame, 'numberPad', 'value', 3);
  land(numberGame, rightNumber);
  assert.equal(numberGame.feedback.type, 'correct');
  assert.match(numberGame.feedback.detail, /После 2 идёт 3/);
  assert.equal(rightNumber.answerState, 'correct');
  assert.ok(numberGame.celebration > 0);

  const reactor = gameFor('reactor-five');
  const two = platform(reactor, 'compositionPad', 'amount', 2);
  const three = platform(reactor, 'compositionPad', 'amount', 3);
  land(reactor, two);
  assert.equal(reactor.feedback.type, 'part');
  assert.match(reactor.feedback.detail, /активируй: 3/);
  land(reactor, two);
  assert.match(reactor.feedback.title, /не собирают число 5/);
  land(reactor, three);
  assert.equal(reactor.feedback.type, 'correct');
  assert.match(reactor.feedback.detail, /2 \+ 3 = 5/);
});
test('Числовой мост: 3 открывает ворота, неверный ответ не отнимает жизнь', () => {
  const game = gameFor('number-bridge');
  land(game, platform(game, 'numberPad', 'value', 6));
  assert.equal(game.solved.number, false);
  assert.equal(game.hearts, 3);
  land(game, platform(game, 'numberPad', 'value', 3));
  assert.equal(game.challengeProgress['missing-number'], true);
  assert.equal(game.solved.number, false);
});

test('Весы энергии: пять зарядов больше трёх', () => {
  const game = gameFor('energy-scales');
  land(game, platform(game, 'comparePad', 'amount', 3));
  assert.equal(game.solved.compare, false);
  land(game, platform(game, 'comparePad', 'amount', 5));
  assert.equal(game.challengeProgress['compare-charge'], true);
  assert.equal(game.solved.compare, false);
});

test('Ритм механизмов: ромб продолжает ряд', () => {
  const game = gameFor('mechanism-rhythm');
  land(game, platform(game, 'switch', 'rune', 0));
  assert.equal(game.solved.pattern, false);
  land(game, platform(game, 'switch', 'rune', 1));
  assert.equal(game.challengeProgress['shape-pattern'], true);
  assert.equal(game.solved.pattern, false);
});

test('Реактор пяти: две части энергии 2 и 3 запускают реактор', () => {
  const game = gameFor('reactor-five');
  land(game, platform(game, 'compositionPad', 'amount', 2));
  assert.equal(game.solved.composition, false);
  land(game, platform(game, 'compositionPad', 'amount', 4));
  assert.equal(game.solved.composition, false);
  land(game, platform(game, 'compositionPad', 'amount', 3));
  assert.equal(game.challengeProgress['make-five'], true);
  assert.equal(game.solved.composition, false);
});

test('каждая миссия завершается только после учебного действия и входа в портал', () => {
  for (const level of ACADEMY_LEVELS) {
    const game = gameFor(level.id);
    assert.equal(learningComplete(game), false);
    solutions[level.id](game);
    assert.equal(learningComplete(game), true, level.id);
    assert.equal(activeLearningGates(game).length, 0, level.id);
    Object.assign(game.player, { x: level.portal.x + 10, y: level.portal.y + 20, vx: 0, vy: 0 });
    updateAcademy(game, STEP);
    assert.equal(game.status, 'done', level.id);
  }
});

test('падение возвращает к контрольной точке без game over', () => {
  const game = gameFor('energy-scales');
  game.checkpoint = 1;
  game.player.y = 1000;
  updateAcademy(game, STEP);
  assert.equal(game.status, 'play');
  assert.equal(game.player.x, game.level.checkpoints[1].x);
  assert.equal(game.hearts, 2);
});


test('Числовой мост строится только после трёх последовательных мастерских', () => {
  const game = gameFor('number-bridge');
  assert.equal(activeLearningGates(game).length, 3);
  assert.equal(learningComplete(game), false);
  assert.ok(game.platforms.filter((item) => item.requiresChallenge === 'missing-number').length >= 3);

  land(game, challengePad(game, 'missing-number', 3));
  assert.equal(game.challengeProgress['missing-number'], true);
  assert.equal(activeLearningGates(game).length, 2);
  assert.ok(Number.isFinite(game.challengeSolvedAt['missing-number']));

  land(game, challengePad(game, 'number-neighbors', 9));
  assert.equal(game.challengeProgress['number-neighbors'], false);
  assert.equal(game.challengeSteps['number-neighbors'], 0);
  land(game, challengePad(game, 'number-neighbors', 7));
  assert.equal(game.challengeSteps['number-neighbors'], 1);
  assert.equal(game.feedback.type, 'part');
  land(game, challengePad(game, 'number-neighbors', 9));
  assert.equal(game.challengeProgress['number-neighbors'], true);
  assert.equal(activeLearningGates(game).length, 1);

  land(game, challengePad(game, 'reverse-count', 7));
  assert.equal(game.challengeProgress['reverse-count'], true);
  assert.equal(game.solved.number, true);
  assert.equal(learningComplete(game), true);
  assert.equal(activeLearningGates(game).length, 0);
});
test('случайный прыжок при входе не считается ответом', () => {
  const game = gameFor('energy-scales');
  land(game, challengeChoice(game, 'compare-charge', 5));
  const accidental = challengeChoice(game, 'balance-seven', 2);
  landWithoutReading(game, accidental);
  assert.equal(game.challengeProgress['balance-seven'], false);
  assert.equal(game.lessonMistakes, 0);
  assert.match(game.feedback.title, /Сначала прочитай/);

  const room = game.level.challenges.find((item) => item.id === 'balance-seven');
  Object.assign(game.player, { x: room.zone.x + 35, y: 556, vx: 0, vy: 0, grounded: true, groundedOn: 'ground' });
  for (let frame = 0; frame < 70; frame += 1) updateAcademy(game, STEP);
  assert.equal(game.challengeReady['balance-seven'], true);
  landWithoutReading(game, accidental);
  assert.equal(game.lessonMistakes, 1, 'после прочтения осознанно выбранный неверный ответ должен дать подсказку');
});
test('в каждой миссии есть три квест-комнаты и маршрут меняется после решения', () => {
  for (const level of ACADEMY_LEVELS) {
    assert.equal(level.challenges?.length, 3, `${level.id}: должно быть три комнаты`);
    assert.deepEqual(level.challenges.map((item) => item.number), [1, 2, 3], `${level.id}: нарушен порядок комнат`);
    for (const challenge of level.challenges) {
      assert.ok(level.platforms.some((item) => item.requiresChallenge === challenge.id), `${level.id}/${challenge.id}: решение не меняет игровой мир`);
    }
  }
});

test('цветовой ритм требует правильного порядка и сбрасывается после ошибки', () => {
  const game = gameFor('mechanism-rhythm');
  land(game, challengeChoice(game, 'shape-pattern', 'diamond'));
  land(game, challengeChoice(game, 'color-rhythm', 'blue'));
  assert.equal(game.challengeSteps['color-rhythm'], 1);
  land(game, challengeChoice(game, 'color-rhythm', 'pink'));
  assert.equal(game.challengeSteps['color-rhythm'], 0);
  assert.equal(game.challengeProgress['color-rhythm'], false);
  land(game, challengeChoice(game, 'color-rhythm', 'blue'));
  land(game, challengeChoice(game, 'color-rhythm', 'gold'));
  land(game, challengeChoice(game, 'color-rhythm', 'pink'));
  assert.equal(game.challengeProgress['color-rhythm'], true);
});

test('квесты покрывают реальные навыки подготовки к школе', () => {
  const all = ACADEMY_LEVELS.flatMap((level) => level.challenges);
  const prompts = all.map((item) => item.prompt).join(' | ');
  assert.match(prompts, /10\s+·\s+9\s+·\s+8/);
  assert.match(prompts, /3\s+\+\s+\?\s+=\s+7/);
  assert.match(prompts, /8\s+\?\s+6/);
  assert.match(prompts, /4\s+\+\s+3\s+=\s+\?/);
  assert.match(prompts, /2\s+\+\s+2\s+\+\s+2/);
});
test('каждая миссия имеет собственный мир и собственную механику', () => {
  assert.equal(new Set(ACADEMY_LEVELS.map((level) => level.background)).size, 4);
  const byId = Object.fromEntries(ACADEMY_LEVELS.map((level) => [level.id, level]));
  assert.ok(byId['number-bridge'].platforms.some((item) => item.kind === 'bridge'));
  assert.ok(byId['energy-scales'].platforms.filter((item) => item.kind === 'lift').length >= 5);
  assert.ok(byId['mechanism-rhythm'].platforms.some((item) => item.kind === 'gear'));
  assert.ok(byId['mechanism-rhythm'].hazards.filter((item) => item.kind === 'pendulum').length >= 4);
  assert.ok(byId['reactor-five'].platforms.filter((item) => item.kind === 'conveyor').length >= 4);
  assert.ok(byId['reactor-five'].hazards.filter((item) => item.kind === 'steam').length >= 4);
  for (const level of ACADEMY_LEVELS) {
    assert.ok(level.worldW >= 4700, `${level.id}: миссия снова стала слишком короткой`);
    assert.ok(level.portal.x > level.worldW - 200, `${level.id}: портал стоит не в финале`);
  }
});

test('изображение задания, подпись и правильный ответ не расходятся', () => {
  const byId = Object.fromEntries(ACADEMY_LEVELS.map((level) => [level.id, level]));
  assert.equal(byId['number-bridge'].answer, 3);
  assert.deepEqual(byId['number-bridge'].platforms.filter((item) => item.challengeId === 'missing-number').map((item) => item.value), [6, 3, 8]);
  assert.equal(byId['energy-scales'].answer, 5);
  assert.deepEqual(byId['energy-scales'].platforms.filter((item) => item.kind === 'comparePad').map((item) => item.amount), [3, 5]);
  assert.equal(byId['mechanism-rhythm'].answer, 'diamond');
  assert.deepEqual(byId['mechanism-rhythm'].platforms.filter((item) => item.challengeId === 'shape-pattern').map((item) => item.shape), ['circle', 'diamond', 'triangle']);
  assert.match(byId['mechanism-rhythm'].challenges[0].wrongDetail, /ромб/);
  assert.deepEqual(byId['reactor-five'].answer, [2, 3]);
  assert.deepEqual(byId['reactor-five'].platforms.filter((item) => item.kind === 'compositionPad').map((item) => item.amount), [2, 4, 3]);
});
console.log('\n«Механическая академия»: четыре миссии, прогрессия и учебные механики проверены.');