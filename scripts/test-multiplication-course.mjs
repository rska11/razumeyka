import { multiplicationStages } from '../data/multiplication-course.js';

const ids = new Set();
for (const stage of multiplicationStages) {
  if (!stage.id || ids.has(stage.id)) throw new Error(`Повторяющийся id: ${stage.id}`);
  ids.add(stage.id);
  if (!Array.isArray(stage.tables) || stage.tables.length === 0) throw new Error(`Нет таблиц: ${stage.id}`);
  if (!Array.isArray(stage.modes) || stage.modes.length < 3) throw new Error(`Мало механик: ${stage.id}`);
  if (!Number.isInteger(stage.rounds) || stage.rounds < 8) throw new Error(`Слишком короткий маршрут: ${stage.id}`);
}

const requiredTables = new Set([2, 3, 4, 5, 6, 7, 8, 9, 10]);
const covered = new Set(multiplicationStages.flatMap((stage) => stage.tables));
for (const table of requiredTables) {
  if (!covered.has(table)) throw new Error(`Не покрыта таблица на ${table}`);
}

if (multiplicationStages.filter((stage) => stage.free).length < 2) {
  throw new Error('Бесплатный маршрут должен показывать и смысл, и практику');
}

const baseRounds = multiplicationStages.reduce((total, stage) => total + stage.rounds, 0);
if (baseRounds < 180) throw new Error(`Слишком мало заданий в полном прохождении: ${baseRounds}`);

const mechanics = new Set(multiplicationStages.flatMap((stage) => stage.modes));
if (mechanics.size < 10) throw new Error(`Недостаточно разных механик: ${mechanics.size}`);

console.log(`Тренажёр умножения: ${multiplicationStages.length} маршрутов, таблицы 2–10 и ${new Set(multiplicationStages.flatMap((stage) => stage.modes)).size} механик.`);
