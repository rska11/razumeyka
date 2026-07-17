export function choice(
  id,
  chapter,
  skill,
  title,
  prompt,
  options,
  correct,
  hint,
  success,
  mode = 'single',
) {
  return { id, type: 'choice', mode, chapter, skill, title, prompt, options, correct, hint, success };
}

export function sequence(id, chapter, skill, title, prompt, options, correct, hint, success) {
  return { id, type: 'sequence', chapter, skill, title, prompt, options, correct, hint, success };
}

export function memory(id, chapter, skill, title, prompt, cards, success) {
  return { id, type: 'memory', chapter, skill, title, prompt, cards, success };
}

export function quiz(id, chapter, skill, title, prompt, questions, success) {
  return { id, type: 'quiz', chapter, skill, title, prompt, questions, success };
}

export const option = (id, label, emoji) => ({ id, label, ...(emoji ? { emoji } : {}) });
export const symbolOption = (id, label, symbol, tone) => ({
  id,
  label,
  symbol,
  ...(tone ? { tone } : {}),
});
