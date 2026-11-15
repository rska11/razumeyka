'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { unlockAudio, playSound } from './audio.js';

const PYRAMID_PAIRS = [
  {
    left: 'МА',
    right: 'ША',
    full: 'МА — ША',
    word: 'МАША',
    options: ['МА — ША', 'МИ — ША', 'МА — МА', 'КА — ША'],
  },
  {
    left: 'ЛЕ',
    right: 'ТО',
    full: 'ЛЕ — ТО',
    word: 'ЛЕТО',
    options: ['ЛЕ — ТО', 'НЕ — БО', 'ЛЕ — СА', 'СИ — ТО'],
  },
  {
    left: 'МО',
    right: 'РЕ',
    full: 'МО — РЕ',
    word: 'МОРЕ',
    options: ['МО — РЕ', 'ПО — ЛЕ', 'ГО — РЕ', 'МО — СТ'],
  },
  {
    left: 'РЕ',
    right: 'КА',
    full: 'РЕ — КА',
    word: 'РЕКА',
    options: ['РЕ — КА', 'РУ — КА', 'РЕ — ПА', 'ЩЕ — КА'],
  },
  {
    left: 'ЛИ',
    right: 'СА',
    full: 'ЛИ — СА',
    word: 'ЛИСА',
    options: ['ЛИ — СА', 'КО — СА', 'РО — СА', 'ЛИ — ПА'],
  },
  {
    left: 'СО',
    right: 'ВА',
    full: 'СО — ВА',
    word: 'СОВА',
    options: ['СО — ВА', 'СО — ДА', 'ТРА — ВА', 'СЛО — ВА'],
  },
  {
    left: 'КНИ',
    right: 'ГА',
    full: 'КНИ — ГА',
    word: 'КНИГА',
    options: ['КНИ — ГА', 'ВЬЮ — ГА', 'СЛУ — ГА', 'КНИ — ГИ'],
  },
  {
    left: 'ШКО',
    right: 'ЛА',
    full: 'ШКО — ЛА',
    word: 'ШКОЛА',
    options: ['ШКО — ЛА', 'СКА — ЛА', 'СМО — ЛА', 'ПЧЕ — ЛА'],
  },
  {
    left: 'ПА',
    right: 'РУС',
    full: 'ПА — РУС',
    word: 'ПАРУС',
    options: ['ПА — РУС', 'КАК — ТУС', 'ГЛО — БУС', 'ПА — РК'],
  },
  {
    left: 'ВЕ',
    right: 'ТЕР',
    full: 'ВЕ — ТЕР',
    word: 'ВЕТЕР',
    options: ['ВЕ — ТЕР', 'ВЕ — ЧЕР', 'КА — ТЕР', 'СЕ — ВЕР'],
  },
  {
    left: 'КОТ',
    right: 'ДОМ',
    full: 'КОТ — ДОМ',
    word: 'КОТ И ДОМ',
    options: ['КОТ — ДОМ', 'КИТ — ДОМ', 'КОТ — ДЫМ', 'ПЁС — ДОМ'],
  },
  {
    left: 'ЛЕС',
    right: 'ЛУГ',
    full: 'ЛЕС — ЛУГ',
    word: 'ЛЕС И ЛУГ',
    options: ['ЛЕС — ЛУГ', 'ЛЕС — ЛУК', 'САД — ЛУГ', 'ЛЕС — ЮГ'],
  },
  {
    left: 'ШАР',
    right: 'МЯЧ',
    full: 'ШАР — МЯЧ',
    word: 'ШАР И МЯЧ',
    options: ['ШАР — МЯЧ', 'ЖАР — МЯЧ', 'ШАР — МЕЧ', 'ПАР — МЯЧ'],
  },
  {
    left: 'СНЕГ',
    right: 'ЛЁД',
    full: 'СНЕГ — ЛЁД',
    word: 'СНЕГ И ЛЁД',
    options: ['СНЕГ — ЛЁД', 'СНЕГ — МЁД', 'ДОЖДЬ — ЛЁД', 'СВЕТ — ЛЁД'],
  },
];

const SPREAD_STEPS = [
  { step: 1, label: 'Ступень 1 · Узко', gapClass: 'gap-6 sm:gap-10', ms: 850 },
  { step: 2, label: 'Ступень 2 · Шире', gapClass: 'gap-10 sm:gap-16', ms: 780 },
  { step: 3, label: 'Ступень 3 · Средне', gapClass: 'gap-14 sm:gap-24', ms: 700 },
  { step: 4, label: 'Ступень 4 · Широко', gapClass: 'gap-20 sm:gap-36', ms: 640 },
  { step: 5, label: 'Ступень 5 · Супер-охват', gapClass: 'gap-24 sm:gap-48', ms: 580 },
  { step: 6, label: 'Ступень 6 · Вершина пирамиды', gapClass: 'gap-28 sm:gap-60', ms: 520 },
];

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function WordPyramid() {
  const [stepIdx, setStepIdx] = useState(0);
  const [phase, setPhase] = useState('idle'); // idle | focus | show | choose | feedback
  const [pair, setPair] = useState(null);
  const [options, setOptions] = useState([]);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [maxStepReached, setMaxStepReached] = useState(1);
  const timersRef = useRef([]);
  const lastFullRef = useRef(null);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  useEffect(() => {
    const saved = Number(localStorage.getItem('pyramid-max-step'));
    if (saved && saved >= 1 && saved <= SPREAD_STEPS.length) {
      setMaxStepReached(saved);
    }
    return clearTimers;
  }, [clearTimers]);

  const currentSpread = SPREAD_STEPS[stepIdx] || SPREAD_STEPS[0];

  const runFlash = useCallback(
    (targetPair, spreadCfg) => {
      clearTimers();
      setPicked(null);
      setPhase('focus');
      timersRef.current.push(
        setTimeout(() => {
          setPhase('show');
          playSound('sparkle');
        }, 480),
      );
      timersRef.current.push(
        setTimeout(() => {
          setPhase('choose');
        }, 480 + spreadCfg.ms),
      );
    },
    [clearTimers],
  );

  function startRound(nextIdx = stepIdx) {
    unlockAudio();
    const pool = PYRAMID_PAIRS.filter((p) => p.full !== lastFullRef.current);
    const chosen = pool[Math.floor(Math.random() * pool.length)] || PYRAMID_PAIRS[0];
    lastFullRef.current = chosen.full;
    setPair(chosen);
    setOptions(shuffle(chosen.options));
    const spreadCfg = SPREAD_STEPS[nextIdx] || SPREAD_STEPS[0];
    runFlash(chosen, spreadCfg);
  }

  function handlePick(option) {
    if (phase !== 'choose' || !pair) return;
    unlockAudio();
    setPicked(option);
    setPhase('feedback');

    const ok = option === pair.full;
    if (ok) {
      playSound('ok');
      const nextStepIdx = Math.min(SPREAD_STEPS.length - 1, stepIdx + 1);
      setScore((s) => s + (stepIdx + 1) * 15);
      const nextStepNumber = nextStepIdx + 1;
      if (nextStepNumber > maxStepReached) {
        setMaxStepReached(nextStepNumber);
        try {
          localStorage.setItem('pyramid-max-step', String(nextStepNumber));
        } catch {
          // ignore storage limits
        }
      }
      setStepIdx(nextStepIdx);
    } else {
      playSound('miss');
      setStepIdx((idx) => Math.max(0, idx - 1));
    }
  }

  return (
    <div className="rounded-[26px] border border-white/80 bg-white/92 p-5 text-ink shadow-card backdrop-blur-xl sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-brand-purple/12 px-3.5 py-1.5 text-xs font-extrabold text-brand-purple">
            {currentSpread.label}
          </span>
          <span className="rounded-full bg-brand-orange/12 px-3.5 py-1.5 text-xs font-extrabold text-brand-orange">
            Очки: {score}
          </span>
          <span className="rounded-full bg-brand-green/14 px-3.5 py-1.5 text-xs font-extrabold text-forest-700">
            Рекорд: {maxStepReached}/6
          </span>
        </div>

        <div className="flex items-center gap-1" aria-label="Ширина пирамиды">
          {SPREAD_STEPS.map((s, idx) => (
            <button
              key={s.step}
              type="button"
              onClick={() => {
                clearTimers();
                setStepIdx(idx);
                setPhase('idle');
              }}
              title={s.label}
              className={`h-2.5 rounded-full transition-all ${
                idx === stepIdx
                  ? 'w-7 bg-brand-purple'
                  : idx < stepIdx
                    ? 'w-3.5 bg-brand-green'
                    : 'w-3.5 bg-ink/12'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="relative mt-5 flex min-h-[220px] flex-col items-center justify-center overflow-hidden rounded-[22px] border border-brand-purple/15 bg-gradient-to-br from-[#F7F4FF] via-white to-[#FFF7F0] p-6 text-center">
        {phase === 'idle' && (
          <div className="max-w-md">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-purple/12 text-2xl">
              🔺
            </span>
            <h3 className="mt-3 font-display text-2xl font-extrabold text-ink">
              Тренажёр «Пирамида чтения»
            </h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-ink/66">
              Держи взгляд на звёздочке ★ в центре и прочитай боковым зрением оба слога или слова слева и справа. С каждым верным ответом пирамида становится шире!
            </p>
            <button
              type="button"
              onClick={() => startRound(stepIdx)}
              className="primary-btn mt-5"
            >
              Запустить пирамиду
            </button>
          </div>
        )}

        {(phase === 'focus' || phase === 'show') && (
          <div className="flex w-full items-center justify-center py-6">
            <div className={`flex items-center justify-center ${currentSpread.gapClass}`}>
              <span
                className={`min-w-[64px] text-right font-display text-2xl font-black tracking-wide text-ink transition-opacity sm:min-w-[88px] sm:text-4xl ${
                  phase === 'show' ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {pair?.left ?? ''}
              </span>

              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-orange/16 text-xl font-black text-brand-orange shadow-sm">
                ★
              </span>

              <span
                className={`min-w-[64px] text-left font-display text-2xl font-black tracking-wide text-ink transition-opacity sm:min-w-[88px] sm:text-4xl ${
                  phase === 'show' ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {pair?.right ?? ''}
              </span>
            </div>
          </div>
        )}

        {(phase === 'choose' || phase === 'feedback') && pair && (
          <div className="w-full max-w-lg">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-ink/48">
                Что было по краям от звёздочки ★?
              </p>
              {phase === 'choose' && (
                <button
                  type="button"
                  onClick={() => runFlash(pair, currentSpread)}
                  className="text-xs font-extrabold text-brand-purple underline underline-offset-2 hover:text-brand-blue"
                >
                  Показать ещё раз
                </button>
              )}
            </div>

            <div className="mt-3.5 grid grid-cols-2 gap-2.5">
              {options.map((opt) => {
                let btnStyle =
                  'border-ink/10 bg-white text-ink hover:border-brand-purple/40 hover:bg-brand-purple/5';
                if (phase === 'feedback') {
                  if (opt === pair.full) {
                    btnStyle = 'border-brand-green bg-brand-green/16 text-forest-700';
                  } else if (opt === picked) {
                    btnStyle = 'border-brand-red/40 bg-brand-red/12 text-brand-red';
                  } else {
                    btnStyle = 'border-ink/8 bg-white/60 text-ink/40';
                  }
                }
                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={phase === 'feedback'}
                    onClick={() => handlePick(opt)}
                    className={`min-h-[54px] rounded-[16px] border px-4 py-3 font-display text-lg font-extrabold transition sm:text-xl ${btnStyle}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {phase === 'feedback' && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[16px] bg-ink/[0.04] px-4 py-3">
                <p className="text-sm font-extrabold">
                  {picked === pair.full ? (
                    <span className="text-forest-700">
                      Отлично! Получилось «{pair.word}» — расширяем шаг пирамиды 🎉
                    </span>
                  ) : (
                    <span className="text-brand-red">
                      Была пара «{pair.full}» ({pair.word}). Сделаем шаг чуть поуже!
                    </span>
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => startRound(stepIdx)}
                  className="primary-btn min-h-[42px] px-5 py-2 text-sm"
                >
                  Следующая ступень →
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="mt-4 text-center text-xs font-semibold text-ink/56">
        Клиновидная пирамида учит глаза видеть сразу несколько слов в строке и не терять начало предложения.
      </p>
    </div>
  );
}
