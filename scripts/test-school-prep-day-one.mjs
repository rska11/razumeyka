import assert from 'node:assert/strict';
import { schoolPrepWeekOne } from '../data/school-prep-course.js';

const missions = schoolPrepWeekOne.days[0].missions;
const supportedTypes = new Set(['choice', 'sequence', 'recall', 'sort', 'path', 'quiz', 'memory', 'action']);

assert.equal(missions.length, 25, 'В бесплатном дне должно быть ровно 25 шагов');
assert.equal(new Set(missions.map((mission) => mission.id)).size, 25, 'ID заданий не должны повторяться');
assert.ok(missions.every((mission) => supportedTypes.has(mission.type)), 'Найден неподдерживаемый тип задания');
assert.ok(new Set(missions.map((mission) => mission.skill)).size >= 22, 'Навыки дня слишком сильно повторяются');
assert.ok(missions.every((mission) => mission.title && mission.prompt && mission.success), 'У каждого шага нужны заголовок, инструкция и результат');

for (const mission of missions) {
  if (mission.type === 'choice' || mission.type === 'sequence' || mission.type === 'recall') {
    const optionIds = new Set(mission.options.map((option) => option.id));
    assert.ok(mission.correct.length > 0, `${mission.id}: нет правильного ответа`);
    assert.ok(mission.correct.every((id) => optionIds.has(id)), `${mission.id}: правильный ответ отсутствует среди вариантов`);
  }
  if (mission.type === 'quiz') {
    assert.ok(mission.questions.length >= 3, `${mission.id}: итог из слишком малого числа вопросов`);
    for (const question of mission.questions) {
      assert.ok(question.options.some((option) => option.id === question.correct), `${mission.id}: у вопроса нет правильного варианта`);
    }
  }
  if (mission.type === 'memory') {
    const counts = mission.cards.reduce((result, card) => result.set(card.pair, (result.get(card.pair) || 0) + 1), new Map());
    assert.ok([...counts.values()].every((count) => count === 2), `${mission.id}: каждая карточка памяти должна иметь ровно одну пару`);
  }
}

const route = missions.find((mission) => mission.id === 'd1-route');
assert.ok(route.checkpoints?.length, 'Маршрут должен требовать контрольную точку, а не простой проход к финишу');

const countTask = missions.find((mission) => mission.id === 'd1-count');
assert.ok(countTask.scene?.count >= 10, 'Счёт в бесплатном дне не должен ограничиваться слишком малым количеством');

const composition = missions.find((mission) => mission.id === 'd1-make-five');
assert.match(composition.skill, /7/, 'Задание на состав числа должно быть сложнее прежнего состава пяти');
assert.ok(composition.correct.length >= 3, 'Нужно показать несколько составов числа');

const final = missions.find((mission) => mission.id === 'd1-final');
assert.ok(final.questions.length >= 7, 'Финал должен быть содержательной проверкой переноса навыков');

const pictographic = /\p{Extended_Pictographic}/u;
const visualItems = missions.flatMap((mission) => [
  ...(mission.options || []),
  ...(mission.items || []),
  ...(mission.cards || []),
  ...(mission.actions || []),
]);
assert.equal(visualItems.filter((item) => item.emoji || pictographic.test(item.label || '')).length, 0, 'В новых карточках не должно быть системных эмодзи вместо иллюстраций');

console.log('Первый бесплатный день: 25 уникальных шагов, прогрессия, визуалы и ответы проверены.');
