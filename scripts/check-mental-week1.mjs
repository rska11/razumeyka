import { mentalLessons, mentalLessonsByDay } from '../data/mental-lessons.js';

const allowed = new Set(['teach', 'count', 'set', 'read', 'flash', 'solve']);
const slugs = new Set();
for (const lesson of mentalLessons) {
  if (slugs.has(lesson.slug)) throw new Error(`Duplicate slug: ${lesson.slug}`);
  slugs.add(lesson.slug);
  if (!Array.isArray(lesson.steps) || lesson.steps.length < 5) throw new Error(`Too few steps: ${lesson.slug}`);
  for (const [index, step] of lesson.steps.entries()) {
    if (!allowed.has(step.type)) throw new Error(`Unknown type ${step.type} in ${lesson.slug}`);
    for (const key of ['show', 'target', 'value', 'n']) {
      if (step[key] != null && (step[key] < 0 || step[key] > 9)) throw new Error(`${key} out of range in ${lesson.slug}`);
    }
    if (Array.isArray(step.cards) && step.cards.some((n) => n < 0 || n > 9)) throw new Error(`Card out of range in ${lesson.slug}`);
    if (step.type === 'solve') {
      let total = step.chain[0];
      if (total < 0 || total > 9) throw new Error(`Bad solve start in ${lesson.slug}`);
      for (const delta of step.chain.slice(1)) {
        total += delta;
        if (total < 0 || total > 9) throw new Error(`Solve leaves one digit in ${lesson.slug}, step ${index + 1}`);
      }
    }
  }
}
const days = mentalLessonsByDay();
for (let day = 1; day <= 5; day += 1) {
  const found = days.find((item) => item.n === day);
  if (!found || found.lessons.length !== 5) throw new Error(`Day ${day}: expected 5 lessons, found ${found?.lessons.length ?? 0}`);
  console.log(`Day ${day}: ${found.lessons.length} lessons, ${found.lessons.reduce((sum, lesson) => sum + lesson.steps.length, 0)} steps`);
}
console.log(`Total active lessons: ${mentalLessons.length}`);
