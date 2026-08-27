import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { schoolPrepWeekTwo } from '../data/school-prep-week-two.js';

const supportedTypes = new Set(['choice', 'sequence', 'memory', 'quiz', 'sort', 'action']);
const allMissions = schoolPrepWeekTwo.days.flatMap((day) => day.missions);
const projectRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
let audioCount = 0;

assert.equal(schoolPrepWeekTwo.days.length, 5, 'Во второй неделе должно быть пять учебных дней');
assert.equal(allMissions.length, 125, 'Во второй неделе должно быть ровно 125 миссий');
assert.equal(new Set(allMissions.map((mission) => mission.id)).size, 125, 'ID миссий недели 2 должны быть уникальны');

for (const day of schoolPrepWeekTwo.days) {
  assert.equal(day.missions.length, 25, `${day.id}: должно быть ровно 25 миссий`);
  assert.ok(new Set(day.missions.map((mission) => mission.chapter)).size >= 7, `${day.id}: слишком мало учебных глав`);
  assert.ok(new Set(day.missions.map((mission) => mission.skill)).size >= 12, `${day.id}: недостаточно разнообразия навыков`);
  assert.ok(new Set(day.missions.map((mission) => mission.type)).size >= 5, `${day.id}: недостаточно разных механик`);
  assert.ok(day.parentOutcome && day.offline && day.warmup, `${day.id}: не хватает сопровождения для родителя`);

  const final = day.missions.at(-1);
  assert.equal(final.type, 'quiz', `${day.id}: день должен завершаться диагностикой`);
  assert.ok(final.questions.length >= 7, `${day.id}: итоговая диагностика слишком короткая`);

  for (const mission of day.missions) {
    assert.ok(supportedTypes.has(mission.type), `${mission.id}: неподдерживаемый тип`);
    assert.ok(mission.title && mission.prompt && mission.skill && mission.chapter && mission.success, `${mission.id}: не заполнены обязательные поля`);

    if (mission.type === 'choice' || mission.type === 'sequence') {
      const ids = new Set(mission.options.map((option) => option.id));
      assert.equal(ids.size, mission.options.length, `${mission.id}: повторяются варианты ответа`);
      assert.ok(mission.correct.length > 0, `${mission.id}: нет правильного ответа`);
      assert.ok(mission.correct.every((id) => ids.has(id)), `${mission.id}: правильного ответа нет среди вариантов`);
      assert.ok(mission.hint, `${mission.id}: ребёнку нужна содержательная подсказка`);
    }

    if (mission.type === 'memory') {
      const pairs = mission.cards.reduce((map, card) => map.set(card.pair, (map.get(card.pair) || 0) + 1), new Map());
      assert.ok([...pairs.values()].every((count) => count === 2), `${mission.id}: у каждой карточки должна быть одна пара`);
    }

    if (mission.type === 'sort') {
      const groups = new Set(mission.groups.map((group) => group.id));
      assert.ok(mission.items.every((item) => groups.has(item.group)), `${mission.id}: элемент ведёт в неизвестную группу`);
    }

    if (mission.type === 'action') {
      assert.ok(mission.actions.length >= 3, `${mission.id}: практическое задание должно содержать минимум три действия`);
    }

    if (mission.type === 'quiz') {
      for (const question of mission.questions) {
        assert.ok(question.options.some((option) => option.id === question.correct), `${mission.id}: неверно задан правильный ответ диагностики`);
      }
    }

    const audioNames = [
      'instruction.mp3',
      ...(mission.questions || []).map((_, index) => `question-${index + 1}.mp3`),
      ...(mission.actions || []).map((_, index) => `action-${index + 1}.mp3`),
    ];
    for (const audioName of audioNames) {
      const audioPath = path.join(projectRoot, 'public', 'audio', 'school-prep', day.id, mission.id, audioName);
      assert.ok(fs.existsSync(audioPath), `${mission.id}: нет озвучки ${audioName}`);
      const audio = fs.readFileSync(audioPath);
      assert.ok(audio.length >= 1000, `${mission.id}: повреждена озвучка ${audioName}`);
      assert.ok(
        audio.subarray(0, 3).toString('ascii') === 'ID3' || audio[0] === 0xff,
        `${mission.id}: неверный формат ${audioName}`,
      );
      audioCount += 1;
    }
  }
}

assert.equal(audioCount, 191, 'Для недели 2 должно быть ровно 191 аудиофайл');
console.log('Неделя 2: 5 дней, 125 уникальных миссий и 191 аудиофайл проверены.');
