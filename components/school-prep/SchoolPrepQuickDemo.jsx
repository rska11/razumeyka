'use client';

import { useState } from 'react';
import { SchoolPrepAudioButton } from './SchoolPrepAudioButton.jsx';

const tasks = [
  {
    id: 'd1-number-line',
    skill: 'Числовой ряд',
    title: 'Верни плиту на мост',
    visual: '2 · 3 · 4 · ? · 6',
    prompt: 'Какого числа не хватает?',
    options: [
      { id: '5', label: '5', tone: 'bg-brand-blue' },
      { id: '7', label: '7', tone: 'bg-brand-purple' },
      { id: '8', label: '8', tone: 'bg-brand-pink' },
    ],
    correct: '5',
    success: 'Верно! Пятёрка вернулась на своё место.',
    hint: 'Назови числа по порядку и попробуй ещё раз.',
  },
  {
    id: 'd1-pattern-color',
    skill: 'Закономерности',
    title: 'Следующий кристалл',
    visual: '🔵  🔵  🟡   ·   🔵  🔵  🟡   ·   ?',
    prompt: 'Какой цвет продолжит узор?',
    options: [
      { id: 'blue', label: 'Синий', tone: 'bg-brand-blue' },
      { id: 'yellow', label: 'Жёлтый', tone: 'bg-brand-yellow' },
      { id: 'pink', label: 'Розовый', tone: 'bg-brand-pink' },
    ],
    correct: 'blue',
    success: 'Точно! Повтор начинается снова с синего.',
    hint: 'Найди повторяющийся кусочек из трёх цветов.',
  },
  {
    id: 'd1-space',
    skill: 'Пространственное мышление',
    title: 'Где стоит Искра?',
    visual: '🏠       🦊       🌳',
    characterNote: '🦊 Это лисёнок Искра',
    prompt: 'Выбери самое точное описание.',
    options: [
      { id: 'between', label: 'Между домом и деревом', tone: 'bg-brand-green' },
      { id: 'right-tree', label: 'Справа от дерева', tone: 'bg-brand-orange' },
      { id: 'left-house', label: 'Слева от дома', tone: 'bg-brand-purple' },
    ],
    correct: 'between',
    success: 'Верно! Искра стоит между домом и деревом.',
    hint: 'Посмотри, что находится слева и справа от Искры.',
  },
];

export function SchoolPrepQuickDemo() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState('');
  const [result, setResult] = useState('');
  const task = tasks[index];
  const last = index === tasks.length - 1;

  function answer(id) {
    setSelected(id);
    setResult(id === task.correct ? 'success' : 'hint');
  }

  function next() {
    if (last) {
      document.getElementById('week-one')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    setIndex((current) => current + 1);
    setSelected('');
    setResult('');
  }

  return (
    <section id={'quick-demo'} className={'scroll-mt-24 px-5 pb-24 sm:px-8 lg:px-14'}>
      <div className={'container-pad px-0'}>
        <div className={'relative overflow-hidden rounded-[38px] bg-[#111A35] p-5 text-white shadow-luxe sm:p-8 lg:p-10'}>
          <div className={'pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-brand-blue/24 blur-[90px]'} />
          <div className={'pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-brand-pink/18 blur-[100px]'} />
          <div className={'relative grid gap-7 lg:grid-cols-[.72fr_1.28fr] lg:items-center'}>
            <div>
              <span className={'inline-flex rounded-full border border-white/12 bg-white/8 px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.17em] text-brand-cyan'}>Попробуйте прямо сейчас</span>
              <h2 className={'mt-5 font-display text-3xl font-extrabold leading-[1.03] tracking-[-0.04em] sm:text-5xl'}>Три настоящих задания за одну минуту</h2>
              <p className={'mt-4 max-w-xl text-sm font-semibold leading-6 text-white/62 sm:text-base'}>Без регистрации и оплаты. Ребёнок сразу увидит формат курса, услышит инструкцию и получит подсказку.</p>
              <div className={'mt-6 flex gap-2'}>
                {tasks.map((item, taskIndex) => (
                  <span key={item.id} className={'h-2 flex-1 rounded-full transition ' + (taskIndex <= index ? 'bg-brand-cyan' : 'bg-white/12')} />
                ))}
              </div>
              <p className={'mt-2 text-xs font-bold text-white/40'}>Задание {index + 1} из {tasks.length}</p>
            </div>

            <div className={'relative rounded-[30px] border border-white/70 bg-white p-5 text-ink shadow-[0_28px_70px_rgba(4,10,28,.35)] sm:p-7'}>
              <div className={'flex items-start justify-between gap-4'}>
                <div>
                  <p className={'text-[10px] font-extrabold uppercase tracking-[0.15em] text-brand-blue'}>{task.skill}</p>
                  <h3 className={'mt-2 font-display text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl'}>{task.title}</h3>
                </div>
                <span className={'rounded-full bg-brand-green/10 px-3 py-2 text-[10px] font-extrabold text-brand-green'}>Бесплатно</span>
              </div>
              <div className={'mt-5 rounded-[24px] border border-brand-blue/10 bg-gradient-to-br from-brand-blue/[0.07] via-white to-brand-purple/[0.07] px-4 py-7 text-center sm:px-6'}>
                {task.characterNote && (
                  <p className={'mx-auto mb-5 inline-flex items-center rounded-full bg-brand-orange/10 px-4 py-2 text-sm font-extrabold text-brand-orange sm:text-base'}>
                    {task.characterNote}
                  </p>
                )}
                <div className={'font-display text-4xl font-extrabold tracking-[0.04em] text-ink sm:text-6xl'}>{task.visual}</div>
                <p className={'mt-4 text-sm font-extrabold text-ink/64 sm:text-base'}>{task.prompt}</p>
                <SchoolPrepAudioButton src={'/audio/school-prep/day-1/' + task.id + '/instruction.mp3'} label={'Послушать задание'} className={'mt-4'} />
              </div>
              <div className={'mt-4 grid gap-2 sm:grid-cols-3'}>
                {task.options.map((option) => (
                  <button
                    key={option.id}
                    type={'button'}
                    onClick={() => answer(option.id)}
                    className={'min-h-[62px] rounded-[18px] border px-3 py-3 text-sm font-extrabold transition ' + (selected === option.id ? option.tone + ' border-transparent text-white shadow-sm' : 'border-ink/8 bg-white text-ink hover:-translate-y-0.5 hover:border-brand-blue/24')}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {result && (
                <div className={'mt-4 rounded-[18px] px-4 py-3 text-sm font-bold leading-6 ' + (result === 'success' ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-orange/10 text-brand-orange')}>
                  {result === 'success' ? '⭐ ' + task.success : '💡 ' + task.hint}
                </div>
              )}
              {result === 'success' && (
                <button type={'button'} onClick={next} className={'mt-4 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-extrabold text-white transition hover:-translate-y-0.5'}>
                  {last ? 'Продолжить бесплатный день — ещё 22 задания →' : 'Следующее задание →'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
