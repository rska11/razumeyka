import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { schoolPrepWeekFour } from '../data/school-prep-week-four-discovery.js';
import { schoolPrepWeekFive } from '../data/school-prep-week-five.js';

const supportedTypes = new Set(['choice', 'sequence', 'memory', 'quiz', 'sort', 'action', 'recall', 'attention-grid', 'go-no-go', 'rule-switch', 'trace-line']);
const allMissions = schoolPrepWeekFive.days.flatMap((day) => day.missions);
const previousIds = new Set(schoolPrepWeekFour.days.flatMap((day) => day.missions.map((mission) => mission.id)));
const projectRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const skipAudio = process.argv.includes('--skip-audio');
let expectedAudio = 0;

assert.equal(schoolPrepWeekFive.learningMode, 'adaptive-v1');
assert.equal(schoolPrepWeekFive.days.length, 5);
assert.equal(allMissions.length, 125);
assert.equal(new Set(allMissions.map((mission) => mission.id)).size, 125);
assert.ok(allMissions.every((mission) => !previousIds.has(mission.id)));

for (const [dayIndex, day] of schoolPrepWeekFive.days.entries()) {
  assert.equal(day.number, 21 + dayIndex, `${day.id}: нарушена нумерация`);
  assert.equal(day.missions.length, 25, `${day.id}: должно быть 25 миссий`);
  assert.equal(day.missions.filter((mission) => mission.route === 'core').length, 18, `${day.id}: должно быть 18 основных миссий`);
  assert.equal(day.missions.filter((mission) => mission.route === 'bonus').length, 7, `${day.id}: должно быть 7 бонусных миссий`);
  assert.ok(new Set(day.missions.map((mission) => mission.chapter)).size >= 8, `${day.id}: нужно восемь содержательных глав`);
  assert.ok(new Set(day.missions.map((mission) => mission.skill)).size >= 18, `${day.id}: недостаточная широта навыков`);
  assert.ok(new Set(day.missions.map((mission) => mission.type)).size >= 5, `${day.id}: недостаточно игровых механик`);
  assert.ok(day.workedExample?.steps?.length === 3 && day.foundationAid && day.challengeTask && day.practiceTip, `${day.id}: нет методического сопровождения`);
  assert.equal(new Set(day.missions.map((mission) => mission.prompt)).size, 25, `${day.id}: повторяются задания`);

  const core = day.missions.filter((mission) => mission.route === 'core');
  assert.equal(core.at(-1).type, 'quiz', `${day.id}: основной маршрут должен завершаться диагностикой`);
  assert.equal(day.missions.indexOf(core.at(-1)), 17, `${day.id}: диагностика должна быть восемнадцатой`);
  assert.equal(core.at(-1).questions.length, 8, `${day.id}: в диагностике должно быть восемь вопросов`);

  for (const mission of day.missions) {
    assert.ok(supportedTypes.has(mission.type), `${mission.id}: неподдерживаемый тип`);
    assert.ok(mission.title && mission.prompt && mission.skill && mission.chapter && mission.success, `${mission.id}: не заполнены обязательные поля`);
    if (mission.type === 'choice' || mission.type === 'sequence' || mission.type === 'recall') {
      const ids = new Set(mission.options.map((option) => option.id));
      assert.equal(ids.size, mission.options.length, `${mission.id}: повторяются варианты`);
      assert.ok(mission.correct.length > 0 && mission.correct.every((id) => ids.has(id)), `${mission.id}: неверный ответ`);
      assert.ok(mission.hint?.length >= 20, `${mission.id}: подсказка не объясняет стратегию`);
    }
    if (mission.type === 'memory') {
      const pairs = mission.cards.reduce((map, card) => map.set(card.pair, (map.get(card.pair) || 0) + 1), new Map());
      assert.ok([...pairs.values()].every((count) => count === 2), `${mission.id}: неверные пары`);
    }
    if (mission.type === 'trace-line') {
      assert.ok(mission.points.length >= 5, `${mission.id}: слишком короткая графическая дорожка`);
      assert.ok(mission.points.every(([x, y]) => x >= 0 && x <= 100 && y >= 0 && y <= 60), `${mission.id}: точка вышла за рабочее поле`);
    }

    const audioNames = [
      'instruction.mp3',
      ...(mission.questions || []).map((_, index) => `question-${index + 1}.mp3`),
      ...(mission.actions || []).map((_, index) => `action-${index + 1}.mp3`),
      ...(mission.cues || []).map((_, index) => `cue-${index + 1}.mp3`),
      ...(mission.rounds || []).map((_, index) => `round-${index + 1}.mp3`),
    ];
    expectedAudio += audioNames.length;
    if (!skipAudio) {
      for (const audioName of audioNames) {
        const audioPath = path.join(projectRoot, 'public', 'audio', 'school-prep', day.id, mission.id, audioName);
        assert.ok(fs.existsSync(audioPath), `${mission.id}: нет озвучки ${audioName}`);
        const audio = fs.readFileSync(audioPath);
        assert.ok(audio.length >= 1000, `${mission.id}: повреждена озвучка ${audioName}`);
      }
    }
  }
}

assert.ok(expectedAudio >= 240, 'Ожидается полная озвучка инструкций, действий и диагностик');
console.log(`Неделя 5: 5 дней, 125 миссий, ${expectedAudio} аудиофайлов${skipAudio ? ' запланировано' : ' проверено'}.`);
