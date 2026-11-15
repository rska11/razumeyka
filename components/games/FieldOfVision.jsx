'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { unlockAudio, playSound } from './audio.js';

const WORD_BANKS = {
  easy: {
    label: '3–4 буквы',
    startMs: 480,
    items: [
      { word: 'КОТ', options: ['КОТ', 'КИТ', 'КОМ', 'РОТ'] },
      { word: 'ДОМ', options: ['ДОМ', 'ДЫМ', 'ТОМ', 'СОМ'] },
      { word: 'ЛЕС', options: ['ЛЕС', 'ВЕС', 'ПЁС', 'ЛЕВ'] },
      { word: 'ШАР', options: ['ШАР', 'ЖАР', 'ПАР', 'ШАГ'] },
      { word: 'ЛУНА', options: ['ЛУНА', 'ЛУПА', 'ЛУЖА', 'ЛИСА'] },
      { word: 'РЕКА', options: ['РЕКА', 'РУКА', 'РЕПА', 'РОЗА'] },
      { word: 'СОВА', options: ['СОВА', 'СОДА', 'ГОРА', 'КОЗА'] },
      { word: 'МОРЕ', options: ['МОРЕ', 'ПОЛЕ', 'ГОРЕ', 'МОСТ'] },
      { word: 'ЗИМА', options: ['ЗИМА', 'ТЕМА', 'МАМА', 'ЗАРЯ'] },
      { word: 'НЕБО', options: ['НЕБО', 'ЛЕТО', 'ДЕЛО', 'СЕНО'] },
      { word: 'СЛОН', options: ['СЛОН', 'СТОН', 'КЛЁН', 'СОН'] },
      { word: 'ПАРК', options: ['ПАРК', 'ПАРУС', 'ПОРТ', 'ПАРА'] },
    ],
  },
  medium: {
    label: '5–6 букв',
    startMs: 420,
    items: [
      { word: 'ШКОЛА', options: ['ШКОЛА', 'ШКАЛА', 'СМОЛА', 'ПЧЕЛА'] },
      { word: 'КНИГА', options: ['КНИГА', 'ВЬЮГА', 'ФЛЯГА', 'КНЯЗЬ'] },
      { word: 'ВЕТЕР', options: ['ВЕТЕР', 'ВЕЧЕР', 'КАТЕР', 'СЕВЕР'] },
      { word: 'РАКЕТА', options: ['РАКЕТА', 'КАРЕТА', 'МОНЕТА', 'ГАЗЕТА'] },
      { word: 'ОБЛАКО', options: ['ОБЛАКО', 'ЯБЛОКО', 'МОЛОКО', 'ОДЕЯЛО'] },
      { word: 'ДЕРЕВО', options: ['ДЕРЕВО', 'ДЕРЕВНЯ', 'СЕРЕБРО', 'ЗЕРКАЛО'] },
      { word: 'ФОНАРЬ', options: ['ФОНАРЬ', 'СУХАРЬ', 'СЛОВАРЬ', 'ЯНВАРЬ'] },
      { word: 'РАДУГА', options: ['РАДУГА', 'ПОДРУГА', 'РАКЕТА', 'ЛАГУНА'] },
      { word: 'ПАРУС', options: ['ПАРУС', 'ПАВЛИН', 'КАКТУС', 'ГЛОБУС'] },
      { word: 'СОЛНЦЕ', options: ['СОЛНЦЕ', 'СЕРДЦЕ', 'ОКОНЦЕ', 'КОЛЬЦО'] },
      { word: 'МОСТИК', options: ['МОСТИК', 'ХВОСТИК', 'ЛИСТИК', 'КУСТИК'] },
      { word: 'КРАСКИ', options: ['КРАСКИ', 'СКАЗКИ', 'САЛАЗКИ', 'ГЛАЗКИ'] },
    ],
  },
  hard: {
    label: 'Длинные слова',
    startMs: 380,
    items: [
      { word: 'КОРАБЛЬ', options: ['КОРАБЛЬ', 'ЖУРАВЛЬ', 'БИНОКЛЬ', 'КАРУСЕЛЬ'] },
      { word: 'СНЕЖИНКА', options: ['СНЕЖИНКА', 'ТРОПИНКА', 'КАРТИНКА', 'РОСИНКА'] },
      { word: 'КАРАНДАШ', options: ['КАРАНДАШ', 'КАЛЕНДАРЬ', 'КАРНАВАЛ', 'КАПИТАН'] },
      { word: 'ЧЕРЕПАХА', options: ['ЧЕРЕПАХА', 'ЧЕРЕМУХА', 'ЧЕЧЕВИЦА', 'ЧАЕПИТИЕ'] },
      { word: 'ЗВЕЗДОПАД', options: ['ЗВЕЗДОПАД', 'ЛИСТОПАД', 'ВОДОПАД', 'СНЕГОПАД'] },
      { word: 'САМОЛЁТ', options: ['САМОЛЁТ', 'ВЕРТОЛЁТ', 'САМОКАТ', 'ПАРОХОД'] },
      { word: 'АЛЫЙ ПАРУС', options: ['АЛЫЙ ПАРУС', 'БЕЛЫЙ ПАРУС', 'АЛЫЙ ЗАКАТ', 'ЯРКИЙ ПАРУС'] },
      { word: 'ТИХИЙ ЛЕС', options: ['ТИХИЙ ЛЕС', 'ГУСТОЙ ЛЕС', 'ТИХИЙ САД', 'ТЁПЛЫЙ ЛЕС'] },
      { word: 'ЯРКАЯ ЗВЕЗДА', options: ['ЯРКАЯ ЗВЕЗДА', 'ЯСНАЯ ЗВЕЗДА', 'ЯРКАЯ КОМЕТА', 'НОВАЯ ЗВЕЗДА'] },
      { word: 'БЫСТРЫЙ ВЕТЕР', options: ['БЫСТРЫЙ ВЕТЕР', 'СИЛЬНЫЙ ВЕТЕР', 'БЫСТРЫЙ КАТЕР', 'СВЕЖИЙ ВЕТЕР'] },
    ],
  },
};

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function FieldOfVision() {
  const [tier, setTier] = useState('easy');
  const [phase, setPhase] = useState('idle'); // idle | focus | flash | choose | feedback
  const [flashMs, setFlashMs] = useState(WORD_BANKS.easy.startMs);
  const [bestMs, setBestMs] = useState(null);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [currentItem, setCurrentItem] = useState(null);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [picked, setPicked] = useState(null);
  const timersRef = useRef([]);
  const lastWordRef = useRef(null);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  useEffect(() => {
    const saved = Number(localStorage.getItem('fov-best-ms'));
    if (saved && saved >= 100 && saved <= 1000) {
      setBestMs(saved);
    }
    return clearTimers;
  }, [clearTimers]);

  const launchFlash = useCallback(
    (item, durationMs) => {
      clearTimers();
      setPicked(null);
      setPhase('focus');
      timersRef.current.push(
        setTimeout(() => {
          setPhase('flash');
          playSound('sparkle');
        }, 520),
      );
      timersRef.current.push(
        setTimeout(() => {
          setPhase('choose');
        }, 520 + durationMs),
      );
    },
    [clearTimers],
  );

  function startRound(customTier = tier, customMs = flashMs) {
    unlockAudio();
    const bank = WORD_BANKS[customTier].items;
    const pool = bank.filter((it) => it.word !== lastWordRef.current);
    const nextItem = pool[Math.floor(Math.random() * pool.length)] || bank[0];
    lastWordRef.current = nextItem.word;
    setCurrentItem(nextItem);
    setShuffledOptions(shuffle(nextItem.options));
    setRound((r) => r + 1);
    launchFlash(nextItem, customMs);
  }

  function replayFlash() {
    if (!currentItem) return;
    unlockAudio();
    launchFlash(currentItem, flashMs);
  }

  function changeTier(nextTier) {
    clearTimers();
    setTier(nextTier);
    const defaultMs = WORD_BANKS[nextTier].startMs;
    setFlashMs(defaultMs);
    setPhase('idle');
    setPicked(null);
  }

  function handlePick(option) {
    if (phase !== 'choose' || !currentItem) return;
    unlockAudio();
    setPicked(option);
    setPhase('feedback');

    const isCorrect = option === currentItem.word;
    if (isCorrect) {
      playSound('ok');
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setScore((s) => s + Math.round(1000 / flashMs) * 5);

      const achievedMs = flashMs;
      if (!bestMs || achievedMs < bestMs) {
        setBestMs(achievedMs);
        try {
          localStorage.setItem('fov-best-ms', String(achievedMs));
        } catch {
          // ignore storage limits
        }
      }

      if (nextStreak % 2 === 0) {
        setFlashMs((ms) => Math.max(140, ms - 40));
      }
    } else {
      playSound('miss');
      setStreak(0);
      setFlashMs((ms) => Math.min(620, ms + 50));
    }
  }

  return (
    <div className="rounded-[26px] border border-white/80 bg-white/92 p-5 text-ink shadow-card backdrop-blur-xl sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(WORD_BANKS).map(([key, cfg]) => (
            <button
              key={key}
              type="button"
              onClick={() => changeTier(key)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-extrabold transition ${
                tier === key
                  ? 'bg-brand-orange text-white shadow-sm'
                  : 'bg-ink/6 text-ink/65 hover:bg-ink/10'
              }`}
            >
              {cfg.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-brand-blue/12 px-3 py-1.5 text-xs font-extrabold text-brand-blue">
            Вспышка: {flashMs} мс
          </span>
          <span className="rounded-full bg-brand-orange/12 px-3 py-1.5 text-xs font-extrabold text-brand-orange">
            Серия: {streak}
          </span>
          {bestMs && (
            <span className="rounded-full bg-brand-green/14 px-3 py-1.5 text-xs font-extrabold text-forest-700">
              Рекорд: {bestMs} мс
            </span>
          )}
        </div>
      </div>

      <div className="relative mt-5 flex min-h-[220px] flex-col items-center justify-center overflow-hidden rounded-[22px] border border-brand-orange/15 bg-gradient-to-br from-[#FFF9F2] via-white to-[#F2F6FF] p-6 text-center">
        {phase === 'idle' && (
          <div className="max-w-md">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-orange/12 text-2xl">
              👁️
            </span>
            <h3 className="mt-3 font-display text-2xl font-extrabold text-ink">
              Тренажёр «Поле зрения: быстрые слова»
            </h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-ink/66">
              Смотри на точку в центре. Слово появится на долю секунды — схватывай его взглядом целиком и выбирай правильный ответ.
            </p>
            <button
              type="button"
              onClick={() => startRound(tier, flashMs)}
              className="primary-btn mt-5"
            >
              Начать тренировку
            </button>
          </div>
        )}

        {phase === 'focus' && (
          <div className="flex flex-col items-center justify-center">
            <span className="flex h-5 w-5 animate-ping items-center justify-center rounded-full bg-brand-orange/60" />
            <span className="-mt-5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-orange" />
            <p className="mt-4 text-xs font-extrabold uppercase tracking-[0.16em] text-ink/45">
              Смотри в центр…
            </p>
          </div>
        )}

        {phase === 'flash' && currentItem && (
          <div className="select-none px-4 py-2">
            <p className="font-display text-4xl font-black tracking-wide text-ink sm:text-5xl">
              {currentItem.word}
            </p>
          </div>
        )}

        {(phase === 'choose' || phase === 'feedback') && currentItem && (
          <div className="w-full max-w-lg">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-ink/48">
                Раунд {round} · Какое слово мелькнуло?
              </p>
              {phase === 'choose' && (
                <button
                  type="button"
                  onClick={replayFlash}
                  className="text-xs font-extrabold text-brand-blue underline underline-offset-2 hover:text-brand-purple"
                >
                  Показать ещё раз
                </button>
              )}
            </div>

            <div className="mt-3.5 grid grid-cols-2 gap-2.5">
              {shuffledOptions.map((opt) => {
                let btnStyle =
                  'border-ink/10 bg-white text-ink hover:border-brand-blue/40 hover:bg-brand-blue/5';
                if (phase === 'feedback') {
                  if (opt === currentItem.word) {
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
                  {picked === currentItem.word ? (
                    <span className="text-forest-700">
                      Зорко! Слово «{currentItem.word}» прочитано за {flashMs} мс 🎉
                    </span>
                  ) : (
                    <span className="text-brand-red">
                      Было слово «{currentItem.word}». Попробуем чуть плавнее!
                    </span>
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => startRound(tier, flashMs)}
                  className="primary-btn min-h-[42px] px-5 py-2 text-sm"
                >
                  Дальше →
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-ink/56">
        <span>Очки: {score}</span>
        <span>Упражнение учит узнавать слово целиком, без чтения по слогам.</span>
      </div>
    </div>
  );
}
