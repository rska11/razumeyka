import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { schoolPrepWeekTwo } from '../data/school-prep-week-two.js';
import { schoolPrepWeekThree } from '../data/school-prep-week-three.js';

const supportedTypes = new Set(['choice', 'sequence', 'memory', 'quiz', 'sort', 'action', 'quantity-board', 'part-whole', 'math-balance', 'number-line']);
const allMissions = schoolPrepWeekThree.days.flatMap((day) => day.missions);
const previousIds = new Set(schoolPrepWeekTwo.days.flatMap((day) => day.missions.map((mission) => mission.id)));
const projectRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const skipAudio = process.argv.includes('--skip-audio');
let expectedAudio = 0;

assert.equal(schoolPrepWeekThree.days.length, 5, 'В неделе 3 должно быть пять учебных дней');
assert.equal(schoolPrepWeekThree.learningMode, 'adaptive-v1', 'Адаптивный режим недели 3 должен быть включён явно');
assert.equal(allMissions.length, 125, 'В неделе 3 должно быть ровно 125 миссий');
assert.equal(new Set(allMissions.map((mission) => mission.id)).size, 125, 'ID миссий недели 3 должны быть уникальны');
assert.ok(allMissions.every((mission) => !previousIds.has(mission.id)), 'ID недель 2 и 3 не должны пересекаться');

for (const [dayIndex, day] of schoolPrepWeekThree.days.entries()) {
  assert.equal(day.number, 11 + dayIndex, `${day.id}: нарушена сквозная нумерация дней`);
  assert.equal(day.missions.length, 25, `${day.id}: должно быть ровно 25 миссий`);
  assert.equal(day.missions.filter((mission) => mission.route === 'core').length, 18, `${day.id}: должно быть 18 основных миссий`);
  assert.equal(day.missions.filter((mission) => mission.route === 'bonus').length, 7, `${day.id}: должно быть 7 бонусных миссий`);
  assert.ok(new Set(day.missions.map((mission) => mission.chapter)).size >= 8, `${day.id}: нужно восемь содержательных глав`);
  assert.ok(new Set(day.missions.map((mission) => mission.skill)).size >= 18, `${day.id}: недостаточная широта навыков`);
  assert.ok(new Set(day.missions.map((mission) => mission.type)).size >= 6, `${day.id}: должны использоваться все шесть игровых механик`);
  assert.ok(day.parentOutcome && day.offline && day.warmup && day.lead, `${day.id}: не хватает сопровождения для родителя`);
  assert.ok(day.workedExample?.steps?.length === 3 && day.foundationAid && day.challengeTask && day.practiceTip, `${day.id}: не хватает примера, возрастной поддержки или домашней рекомендации`);
  assert.equal(new Set(day.missions.map((mission) => mission.prompt)).size, 25, `${day.id}: повторяются формулировки заданий`);

  const final = day.missions.filter((mission) => mission.route === 'core').at(-1);
  assert.equal(final.type, 'quiz', `${day.id}: день должен завершаться диагностикой`);
  assert.equal(day.missions.indexOf(final), 17, `${day.id}: диагностика должна завершать основной маршрут до бонусов`);
  assert.ok(day.missions.filter((mission) => mission.route === 'core').reduce((sum, mission) => sum + (mission.actions?.length || 0), 0) <= 3, `${day.id}: основной маршрут перегружен двигательными подшагами`);
  assert.equal(final.questions.length, 8, `${day.id}: в диагностике должно быть восемь вопросов`);
  const answerPositions = final.questions.map((question) => question.options.findIndex((option) => option.id === question.correct));
  assert.ok(Math.max(...[0, 1, 2].map((position) => answerPositions.filter((value) => value === position).length)) <= 5, `${day.id}: правильные ответы слишком предсказуемо стоят на одной позиции`);

  for (const mission of day.missions) {
    assert.ok(supportedTypes.has(mission.type), `${mission.id}: неподдерживаемый тип`);
    assert.ok(mission.title && mission.prompt && mission.skill && mission.chapter && mission.success, `${mission.id}: не заполнены обязательные поля`);

    if (mission.type === 'choice' || mission.type === 'sequence') {
      const ids = new Set(mission.options.map((option) => option.id));
      assert.equal(ids.size, mission.options.length, `${mission.id}: повторяются варианты`);
      assert.ok(mission.correct.length > 0 && mission.correct.every((id) => ids.has(id)), `${mission.id}: неверно задан правильный ответ`);
      assert.ok(mission.hint?.length >= 20, `${mission.id}: подсказка должна объяснять стратегию`);
    }
    if (mission.type === 'memory') {
      const pairs = mission.cards.reduce((map, card) => map.set(card.pair, (map.get(card.pair) || 0) + 1), new Map());
      assert.ok([...pairs.values()].every((count) => count === 2), `${mission.id}: у карточки должна быть ровно одна пара`);
      assert.equal(new Set(mission.cards.map((card) => card.label)).size, mission.cards.length, `${mission.id}: внешне одинаковые карточки делают мемори нечестным`);
    }
    if (mission.type === 'sort') {
      const groups = new Set(mission.groups.map((group) => group.id));
      assert.ok(mission.items.length >= 5, `${mission.id}: сортировка слишком короткая`);
      assert.ok(mission.items.every((item) => groups.has(item.group)), `${mission.id}: элемент ведёт в неизвестную группу`);
    }
    if (mission.type === 'action') assert.equal(mission.actions.length, 3, `${mission.id}: практическое задание должно иметь три ясных шага`);
    if (mission.type === 'quantity-board') assert.ok(mission.target > 0 && mission.max >= mission.target, `${mission.id}: неверно настроено счётное поле`);
    if (mission.type === 'part-whole') assert.equal(mission.known + mission.correctPart, mission.total, `${mission.id}: части не собираются в целое`);
    if (mission.type === 'math-balance') assert.ok(['more', 'equal', 'less'].includes(mission.correctRelation), `${mission.id}: неверно настроены математические весы`);
    if (mission.type === 'number-line') assert.ok(mission.target >= mission.min && mission.target <= mission.max, `${mission.id}: цель вне числовой дорожки`);
    if (mission.type === 'quiz') {
      for (const question of mission.questions) {
        assert.equal(question.options.length, 3, `${mission.id}: у вопроса должно быть три варианта`);
        assert.ok(question.options.some((option) => option.id === question.correct), `${mission.id}: правильного ответа нет среди вариантов`);
      }
    }

    const audioNames = [
      'instruction.mp3',
      ...(mission.questions || []).map((_, index) => `question-${index + 1}.mp3`),
      ...(mission.actions || []).map((_, index) => `action-${index + 1}.mp3`),
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

assert.equal(expectedAudio, 213, 'Для недели 3 ожидается ровно 213 аудиофайлов');
console.log(`Неделя 3: 5 дней, 125 миссий, 213 аудиофайлов${skipAudio ? ' запланировано' : ' проверено'}.`);
