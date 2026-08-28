import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { schoolPrepWeekThree } from '../data/school-prep-week-three.js';
import { schoolPrepWeekFour } from '../data/school-prep-week-four-discovery.js';

const supportedTypes = new Set(['choice', 'sequence', 'memory', 'quiz', 'sort', 'action', 'recall', 'attention-grid', 'go-no-go', 'rule-switch', 'trace-line']);
const allMissions = schoolPrepWeekFour.days.flatMap((day) => day.missions);
const previousIds = new Set(schoolPrepWeekThree.days.flatMap((day) => day.missions.map((mission) => mission.id)));
const projectRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const skipAudio = process.argv.includes('--skip-audio');
let expectedAudio = 0;

assert.equal(schoolPrepWeekFour.learningMode, 'adaptive-v1', 'Неделя 4 должна использовать адаптивный режим');
assert.equal(schoolPrepWeekFour.days.length, 5, 'В неделе 4 должно быть пять учебных дней');
assert.equal(allMissions.length, 125, 'В неделе 4 должно быть ровно 125 миссий');
assert.equal(new Set(allMissions.map((mission) => mission.id)).size, 125, 'ID миссий недели 4 должны быть уникальны');
assert.ok(allMissions.every((mission) => !previousIds.has(mission.id)), 'ID недель 3 и 4 не должны пересекаться');

for (const [dayIndex, day] of schoolPrepWeekFour.days.entries()) {
  assert.equal(day.number, 16 + dayIndex, `${day.id}: нарушена сквозная нумерация дней`);
  assert.equal(day.missions.length, 25, `${day.id}: должно быть 25 миссий`);
  assert.equal(day.missions.filter((mission) => mission.route === 'core').length, 18, `${day.id}: должно быть 18 основных миссий`);
  assert.equal(day.missions.filter((mission) => mission.route === 'bonus').length, 7, `${day.id}: должно быть 7 бонусных миссий`);
  assert.ok(new Set(day.missions.map((mission) => mission.chapter)).size >= 8, `${day.id}: нужно восемь содержательных глав`);
  assert.ok(new Set(day.missions.map((mission) => mission.skill)).size >= 18, `${day.id}: недостаточная широта навыков`);
  assert.ok(new Set(day.missions.map((mission) => mission.type)).size >= 5, `${day.id}: недостаточно разнообразны игровые механики`);
  assert.ok(day.workedExample?.steps?.length === 3 && day.foundationAid && day.challengeTask && day.practiceTip, `${day.id}: не хватает методического сопровождения`);
  assert.equal(new Set(day.missions.map((mission) => mission.prompt)).size, 25, `${day.id}: повторяются формулировки заданий`);

  const core = day.missions.filter((mission) => mission.route === 'core');
  const final = core.at(-1);
  assert.equal(final.type, 'quiz', `${day.id}: основной маршрут должен завершаться диагностикой`);
  assert.equal(day.missions.indexOf(final), 17, `${day.id}: диагностика должна стоять перед бонусами`);
  assert.equal(final.questions.length, 8, `${day.id}: в диагностике должно быть восемь вопросов`);
  assert.ok(core.reduce((sum, mission) => sum + (mission.actions?.length || 0), 0) <= 3, `${day.id}: основной маршрут перегружен двигательными подшагами`);

  for (const mission of day.missions) {
    assert.ok(supportedTypes.has(mission.type), `${mission.id}: неподдерживаемый тип`);
    assert.ok(mission.title && mission.prompt && mission.skill && mission.chapter && mission.success, `${mission.id}: не заполнены обязательные поля`);
    if (mission.type === 'choice' || mission.type === 'sequence' || mission.type === 'recall') {
      const ids = new Set(mission.options.map((option) => option.id));
      assert.equal(ids.size, mission.options.length, `${mission.id}: повторяются варианты`);
      assert.ok(mission.correct.length > 0 && mission.correct.every((id) => ids.has(id)), `${mission.id}: неверно задан ответ`);
      assert.ok(mission.hint?.length >= 20, `${mission.id}: подсказка должна объяснять стратегию`);
    }
    if (mission.type === 'memory') {
      const pairs = mission.cards.reduce((map, card) => map.set(card.pair, (map.get(card.pair) || 0) + 1), new Map());
      assert.ok([...pairs.values()].every((count) => count === 2), `${mission.id}: у каждой карточки должна быть одна пара`);
    }
    if (mission.type === 'sort') {
      const groups = new Set(mission.groups.map((group) => group.id));
      assert.ok(mission.items.length >= 5 && mission.items.every((item) => groups.has(item.group)), `${mission.id}: неверно настроена сортировка`);
    }
    if (mission.type === 'attention-grid') {
      const cells = new Set(mission.cells.map((cell) => cell.id));
      assert.ok(mission.cells.length >= 6 && mission.correct.every((id) => cells.has(id)), `${mission.id}: неверно настроено поисковое поле`);
    }
    if (mission.type === 'go-no-go') assert.ok(mission.cues.length >= 4 && mission.cues.some((cue) => cue.shouldTap) && mission.cues.some((cue) => !cue.shouldTap), `${mission.id}: серия должна содержать действие и остановку`);
    if (mission.type === 'rule-switch') assert.ok(mission.rounds.length >= 3 && new Set(mission.rounds.map((round) => round.rule)).size >= 2, `${mission.id}: правила не переключаются`);
    if (mission.type === 'action') assert.equal(mission.actions.length, 3, `${mission.id}: практическое задание должно иметь три шага`);

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
        assert.ok(audio.subarray(0, 3).toString('ascii') === 'ID3' || audio[0] === 0xff, `${mission.id}: неверный формат ${audioName}`);
      }
    }
  }
}

assert.ok(expectedAudio >= 240, 'Для недели 4 ожидается полная озвучка инструкций, действий и диагностик');
console.log(`Неделя 4: 5 дней, 125 миссий, ${expectedAudio} аудиофайлов${skipAudio ? ' запланировано' : ' проверено'}.`);
