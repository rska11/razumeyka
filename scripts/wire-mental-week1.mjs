import { readFile, writeFile } from 'node:fs/promises';
const file = new URL('../data/mental-lessons.js', import.meta.url);
let source = await readFile(file, 'utf8');
if (!source.includes("mental-week1-lessons.js")) source = "import { mentalWeekOneLessons } from './mental-week1-lessons.js';\n\n" + source;
const hook = `];

export function getMentalLesson`;
if (!source.includes('mentalLessons.push(...mentalWeekOneLessons);')) {
  if (!source.includes(hook)) throw new Error('Mental lessons array end not found');
  source = source.replace(hook, `];

mentalLessons.push(...mentalWeekOneLessons);

export function getMentalLesson`);
}
await writeFile(file, source, 'utf8');
