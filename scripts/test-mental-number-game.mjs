import assert from 'node:assert/strict';
import { FREE_MISSIONS, MISSIONS, makeChallenge, starsFor } from '../components/mental/number-game-engine.js';

function seeded(seed = 1) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

assert.equal(MISSIONS.length, 8, 'На карте должно быть восемь миссий');
assert.equal(FREE_MISSIONS, 3, 'Бесплатными остаются первые три миссии');
assert.deepEqual([starsFor(0), starsFor(2), starsFor(3)], [3, 2, 1]);

for (const mission of MISSIONS) {
  let previous;
  for (let round = 0; round < mission.rounds; round += 1) {
    const challenge = makeChallenge(mission, previous, round, seeded(mission.id * 100 + round));
    assert.equal(challenge.values.length, 3, `Миссия ${mission.id}: нужно три трассы`);
    assert.equal(new Set(challenge.values).size, 3, `Миссия ${mission.id}: ответы не должны повторяться`);
    assert.equal(challenge.values[challenge.correctLane], challenge.answer, `Миссия ${mission.id}: верная трасса вычислена неверно`);
    assert.ok(challenge.taskTitle && challenge.instruction && challenge.explanation, `Миссия ${mission.id}: у задания должно быть объяснение`);
    previous = challenge.answer;
  }
}

const missionSixModes = new Set(
  Array.from({ length: MISSIONS[5].rounds }, (_, round) => makeChallenge(MISSIONS[5], undefined, round, seeded(round + 50)).mode),
);
for (const mode of ['abacus', 'compare', 'neighbor', 'calc', 'flash']) {
  assert.ok(missionSixModes.has(mode), `В шестой миссии отсутствует механика ${mode}`);
}

const finalModes = new Set(
  Array.from({ length: MISSIONS[7].rounds }, (_, round) => makeChallenge(MISSIONS[7], undefined, round, seeded(round + 100)).mode),
);
for (const mode of ['place', 'compare', 'sequence', 'calc', 'neighbor', 'flash', 'friend']) {
  assert.ok(finalModes.has(mode), `В финале отсутствует механика ${mode}`);
}

console.log('Mental number game checks passed');
