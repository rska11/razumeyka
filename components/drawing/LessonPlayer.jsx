'use client';

// Проигрыватель одного урока рисования.
// Модель: рисуют НА БУМАГЕ, экран — наставник. Планшет не нужен.
// «Рисуй за мной»: на каждом шаге линия прорисовывается сама (анимация),
// подсказку можно озвучить (mp3 из public/audio, иначе синтез речи браузера).
// В конце — «покажи родителю» вместо загрузки фото. Экранный холст (мандала) —
// опциональный бонус только для сенсорных устройств.

import { useEffect, useRef, useState } from 'react';
import { SymmetryDraw } from '@/components/games/SymmetryDraw.jsx';

const HAND_LABEL = {
  left: 'Непишущей рукой',
  right: 'Правой рукой',
  both: 'Двумя руками',
};

// Темп «рисуй за мной»: медленно, как ведёт рука ребёнка.
const DRAW_DUR = 4; // секунд на прорисовку одного элемента шага
const DRAW_GAP = 1; // пауза между элементами, чтобы ребёнок успевал

function audioSrcFor(lesson, kind, index = 0) {
  const explicit = lesson.audio;
  if (kind === 'intro' && explicit?.intro) return explicit.intro;
  if (kind === 'parent' && explicit?.parent) return explicit.parent;
  if (kind === 'step' && explicit?.steps) return explicit.steps[index] ?? null;

  const base = `/audio/drawing/${lesson.slug}`;
  if (kind === 'intro') return `${base}/intro.mp3`;
  if (kind === 'parent') return `${base}/parent.mp3`;
  return `${base}/step-${index + 1}.mp3`;
}

function sayTextFor(lesson, kind, index = 0) {
  if (kind === 'intro') return lesson.sayIntro ?? lesson.intro ?? lesson.handHint;
  if (kind === 'parent') return lesson.sayParent ?? lesson.parentNote;
  const step = lesson.steps?.[index];
  return step?.say ?? step?.hint;
}

function materialsFor(lesson) {
  if (lesson.materials) return lesson.materials;
  if (lesson.hand === 'both') return ['Лист бумаги', 'Два карандаша'];
  return ['Лист бумаги', 'Карандаш или фломастер'];
}


function methodAudioSrcFor(lesson) {
  const version = '?v=3';
  if (lesson.hand === 'both') return '/audio/drawing/method/lesson-both.mp3' + version;
  if (lesson.ageBand === '3-4') return '/audio/drawing/method/lesson-3-4.mp3' + version;
  if (lesson.ageBand === '5-7') return '/audio/drawing/method/lesson-5-7.mp3' + version;
  if (lesson.ageBand === '8-10') return '/audio/drawing/method/lesson-8-10.mp3' + version;
  return '/audio/drawing/method/lesson-general.mp3' + version;
}
function methodTipFor(lesson) {
  if (lesson.hand === 'both') {
    return {
      icon: '🤲',
      title: 'Двумя руками.',
      text: lesson.handHint ?? 'Возьми два карандаша и попробуй вести линии зеркально. Красота здесь рождается из синхронного движения, а не из идеальной ровности.',
    };
  }

  if (lesson.hand && lesson.hand !== 'any' && lesson.handHint) {
    return {
      icon: '🖐️',
      title: `${HAND_LABEL[lesson.hand]}.`,
      text: lesson.handHint,
    };
  }

  if (lesson.ageBand === '3-4') {
    return {
      icon: '✨',
      title: 'Как рисуем сегодня.',
      text: 'Главный рисунок делаем удобной рукой. Если ребёнок не устал, 2–3 точки, лучика или травинки можно попробовать второй рукой — просто как игру.',
    };
  }

  if (lesson.ageBand === '5-7') {
    return {
      icon: '🖐️',
      title: 'Как рисуем сегодня.',
      text: 'Форму рисуем удобной рукой, а маленькие детали — точки, травку, узоры, капли — можно доверить непишущей руке. Ровность не важна.',
    };
  }

  if (lesson.ageBand === '8-10') {
    return {
      icon: '✍️',
      title: 'Как рисуем сегодня.',
      text: 'Контур и важные формы ведём привычной рукой. Фактуру, штрихи, крапинки, блики или фон можно попробовать второй рукой — так линия становится живее.',
    };
  }

  return {
    icon: '🎨',
    title: 'Как рисуем сегодня.',
    text: 'Сначала наблюдаем форму, потом рисуем. Небольшую деталь можно сделать второй рукой, если хочется отпустить контроль и добавить живости.',
  };
}

export function LessonPlayer({ lesson, nextLesson, onComplete, onNext, onClose }) {
  const isGame = lesson.game === 'symmetry';
  const steps = lesson.steps ?? [];
  const total = steps.length;
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [voiceOn, setVoiceOn] = useState(false);
  const [replay, setReplay] = useState(0);
  const animRef = useRef(null);
  const audioRef = useRef(null);
  const voiceOnRef = useRef(false);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || (navigator.maxTouchPoints || 0) > 0);
  }, []);

  useEffect(() => {
    voiceOnRef.current = voiceOn;
  }, [voiceOn]);

  function stopVoice() {
    audioRef.current?.pause();
    audioRef.current = null;
    if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
  }

  function playAudioSrc(src, onEnd) {
    if (typeof window === 'undefined' || !src) {
      onEnd?.();
      return;
    }
    stopVoice();

    const audio = new Audio(src);
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      onEnd?.();
    };
    audioRef.current = audio;
    if (onEnd) audio.onended = finish;
    audio.onerror = finish;
    audio.play().catch(finish);
  }

  function speakMethod(onEnd) {
    playAudioSrc(methodAudioSrcFor(lesson), onEnd);
  }

  // Озвучка только готовым mp3 (Yandex SpeechKit). Робо-голос браузера НЕ используем —
  // если mp3 для урока ещё нет, просто тишина (лучше, чем «параллельный робот»).
  function speak(kind, index = step, onEnd) {
    const text = sayTextFor(lesson, kind, index);
    if (typeof window === 'undefined' || !text) {
      onEnd?.();
      return;
    }

    const src = audioSrcFor(lesson, kind, index);
    playAudioSrc(src, onEnd);
  }

  // Анимация прорисовки текущего шага (для пошаговых уроков).
  useEffect(() => {
    if (isGame || done) return;
    const g = animRef.current;
    const s = steps[step];
    if (!g || !s) return;
    g.innerHTML = s.layer;
    g.querySelectorAll('*').forEach((node, i) => {
      const fill = node.getAttribute('fill');
      const delay = i * (DRAW_DUR + DRAW_GAP);
      if (fill && fill !== 'none') {
        node.style.opacity = '0';
        node.style.animation = `rzfade .6s ease ${delay}s forwards`;
      } else if (typeof node.getTotalLength === 'function') {
        let len = 120;
        try {
          len = node.getTotalLength() || 120;
        } catch {}
        node.style.strokeDasharray = String(len);
        node.style.strokeDashoffset = String(len);
        node.style.animation = `rzdraw ${DRAW_DUR}s linear ${delay}s forwards`;
      }
    });
    if (voiceOnRef.current) speak('step', step);
  }, [step, replay, isGame, done]);

  // Урок открыт — голос идёт автоматом: сначала короткая методическая подсказка,
  // затем интро урока и первый шаг. Старт откладываем через setTimeout и снимаем
  // его в cleanup: так переживаем двойной mount React StrictMode (dev).
  useEffect(() => {
    const timer = setTimeout(() => {
      setVoiceOn(true);
      voiceOnRef.current = true;

      const playLessonIntro = () => {
        if (isGame) {
          speak('intro');
        } else {
          speak('intro', 0, () => {
            if (voiceOnRef.current) speak('step', 0);
          });
        }
      };

      speakMethod(playLessonIntro);
    }, 80);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Остановить речь при закрытии урока.
  useEffect(() => () => stopVoice(), []);

  const staticLayers = isGame ? '' : steps.slice(0, step).map((s) => s.layer).join('');
  const finalLayers = isGame ? '' : steps.map((s) => s.layer).join('');
  const lastStep = step >= total - 1;
  const materials = materialsFor(lesson);
  const methodTip = methodTipFor(lesson);
  const palette = lesson.palette ?? ['#fb7185', '#60a5fa', '#facc15'];
  const viewBox = lesson.viewBox ?? '0 0 200 200';
  const coloredViewBox = lesson.coloredViewBox ?? viewBox;
  const wideCanvas = lesson.canvas === 'landscape';
  const drawingFrameClass = wideCanvas ? 'aspect-[297/210]' : 'aspect-square';
  const drawingSvgClass = wideCanvas ? 'h-[90%] w-[94%]' : 'h-4/5 w-4/5';

  function finish() {
    stopVoice();
    setDone(true);
    onComplete?.(lesson.slug);
  }

  function toggleVoice() {
    setVoiceOn((v) => {
      const nv = !v;
      if (nv) speak(isGame ? 'intro' : 'step', step);
      else stopVoice();
      return nv;
    });
  }

  function replayShow() {
    setReplay((r) => r + 1);
    if (isGame && voiceOnRef.current) speak('intro');
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/45 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Урок: ${lesson.title}`}
    >
      <div
        className={`relative flex ${done ? 'max-h-[92vh]' : 'h-[92vh]'} w-full ${wideCanvas ? 'max-w-5xl' : 'max-w-md'} flex-col overflow-hidden rounded-[26px] border border-white/80 bg-white shadow-luxe`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-ink/8 px-5 py-4">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-pink/10 text-2xl">{lesson.cover?.emoji ?? '🎨'}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-lg font-extrabold text-ink">{lesson.title}</p>
            <p className="text-xs font-bold text-ink/48">{lesson.chapterIndex != null ? `Урок ${lesson.chapterIndex + 1} из ${lesson.chapterSize}` : 'Урок'} · {lesson.theme}</p>
          </div>
          <button onClick={onClose} aria-label="Закрыть" className="grid h-9 w-9 place-items-center rounded-full border border-ink/10 text-ink/50 transition hover:bg-ink/5">✕</button>
        </div>

        <div className={done ? 'flex min-h-0 flex-1 flex-col' : 'flex min-h-0 flex-1 flex-col px-4 py-4 sm:px-5 sm:py-5'}>
          {!done && (
            <>
              <div className="mb-3 flex items-center gap-2 rounded-2xl bg-cream/70 px-4 py-2.5 text-sm font-semibold text-ink/64">
                <span className="text-base">✏️</span>
                <span>Понадобится: {materials.join(', ')}</span>
              </div>

              {methodTip && (
                <div className="mb-4 flex items-start gap-2 rounded-2xl bg-brand-purple/8 px-4 py-3">
                  <span className="text-lg leading-none">{methodTip.icon}</span>
                  <p className="text-sm font-semibold leading-6 text-ink/74">
                    <span className="font-extrabold text-brand-purple">{methodTip.title}</span>{' '}
                    {methodTip.text}
                  </p>
                </div>
              )}

              <div className="mb-2 flex items-center justify-center gap-2">
                <button
                  onClick={toggleVoice}
                  aria-pressed={voiceOn}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-extrabold transition ${
                    voiceOn ? 'border-brand-pink/40 bg-brand-pink/10 text-brand-pink' : 'border-ink/12 bg-white text-ink/60 hover:bg-ink/5'
                  }`}
                >
                  {voiceOn ? '🔊 Голос включён' : '🔇 Озвучить'}
                </button>
                <button
                  onClick={replayShow}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink/12 bg-white px-3.5 py-1.5 text-xs font-extrabold text-ink/60 transition hover:bg-ink/5"
                >
                  ↻ Ещё раз
                </button>
              </div>

              {isGame ? (
                <>
                  <p className="mb-2 text-center text-sm font-semibold text-ink/56">Смотри: две линии рисуются одновременно — веди так же двумя руками:</p>
                  <div className="grid aspect-square w-full place-items-center rounded-[20px] border border-ink/8 bg-cream/60">
                    <svg viewBox="0 0 200 200" className="h-4/5 w-4/5 text-brand-purple">
                      {/* Лепестки — зеркальными парами (левая+правая рука синхронно). */}
                      <g key={replay} transform="translate(100,100)">
                        {[0, 1, 2, 3].map((i) => {
                          const angle = 22.5 + i * 45;
                          const anim = { strokeDasharray: 1, strokeDashoffset: 1, animation: `rzdraw 2.4s linear ${(i * 3).toFixed(2)}s forwards` };
                          return [angle, -angle].map((a) => (
                            <ellipse
                              key={`${i}:${a}`}
                              pathLength="1"
                              cx="0"
                              cy="-46"
                              rx="15"
                              ry="34"
                              transform={`rotate(${a})`}
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              style={anim}
                            />
                          ));
                        })}
                        <circle
                          pathLength="1"
                          cx="0"
                          cy="0"
                          r="10"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          style={{ strokeDasharray: 1, strokeDashoffset: 1, animation: 'rzdraw 2s linear 12s forwards' }}
                        />
                      </g>
                    </svg>
                  </div>

                  {isTouch ? (
                    showCanvas ? (
                      <div className="mt-4">
                        <SymmetryDraw />
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowCanvas(true)}
                        className="mt-4 w-full rounded-full border-2 border-ink/12 bg-white/78 px-5 py-3 text-sm font-extrabold text-ink transition hover:border-brand-purple/40 hover:bg-white"
                      >
                        ✏️ Или порисуй на экране пальцем
                      </button>
                    )
                  ) : (
                    <p className="mt-3 text-center text-xs font-medium leading-5 text-ink/44">
                      Совет: с планшета или телефона этот узор можно рисовать прямо на экране пальцем.
                    </p>
                  )}

                  <button onClick={finish} className="primary-btn mt-4 w-full">Я нарисовал ✓</button>
                </>
              ) : (
                <div className={wideCanvas ? 'flex min-h-0 flex-1 flex-col gap-3 lg:grid lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.65fr)]' : 'flex min-h-0 flex-1 flex-col'}>
                  <div className="grid min-h-0 flex-1 place-items-center">
                    <div className={'grid h-full min-h-[180px] w-full place-items-center rounded-[20px] border border-ink/8 bg-cream/60 ' + (wideCanvas ? '' : 'max-w-[420px]')}>
                      <svg viewBox={viewBox} className={drawingSvgClass + ' text-ink'}>
                        <g dangerouslySetInnerHTML={{ __html: staticLayers }} />
                        <g ref={animRef} />
                      </svg>
                    </div>
                  </div>

                  <div className={wideCanvas ? 'flex flex-none flex-col justify-end rounded-2xl bg-cream/45 p-3 lg:min-h-0 lg:justify-between' : 'flex-none'}>
                    <div className="flex items-center justify-center gap-2">
                      {steps.map((_, i) => (
                        <span key={i} className={`h-2.5 w-2.5 rounded-full transition ${i <= step ? 'bg-brand-pink' : 'bg-ink/14'}`} />
                      ))}
                    </div>

                    <p className="mt-3 min-h-[44px] text-center text-sm font-semibold leading-6 text-ink/74 sm:text-base">{steps[step]?.hint}</p>

                    <div className="mt-2 flex items-center gap-3">
                      <button
                        onClick={() => setStep((s) => Math.max(0, s - 1))}
                        disabled={step === 0}
                        className="grid h-12 w-12 flex-none place-items-center rounded-full border-2 border-ink/12 text-ink/60 transition enabled:hover:bg-ink/5 disabled:opacity-30"
                        aria-label="Назад"
                      >
                        ←
                      </button>
                      {lastStep ? (
                        <button onClick={finish} className="primary-btn h-12 min-h-0 flex-1">Я нарисовал ✓</button>
                      ) : (
                        <button onClick={() => setStep((s) => Math.min(total - 1, s + 1))} className="primary-btn h-12 min-h-0 flex-1">Дальше →</button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {done && (
            <>
              {/* Контент скроллится, а кнопки закреплены внизу модалки: ребёнок
                  всегда видит «Следующая картинка» без прокрутки. */}
              <div className="min-h-0 flex-1 animate-softPop overflow-y-auto px-5 py-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl">🌟</span>
                  <p className="font-display text-2xl font-extrabold text-ink">Готово! Молодец</p>
                </div>
                {lesson.coloredPreview && finalLayers && (
                  <div className="mt-3 rounded-3xl border border-brand-green/20 bg-gradient-to-br from-brand-green/8 via-white to-brand-blue/8 p-3 text-left shadow-sm">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-extrabold text-brand-green">Контур и пример рядом</p>
                        <p className="text-xs font-bold leading-5 text-ink/52">Слева то, что ребёнок рисует по шагам. Справа — один красивый вариант раскраски.</p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-[10px] font-extrabold text-ink/45 shadow-sm">А4 горизонтально</span>
                    </div>
                    <div className="grid gap-3 lg:grid-cols-2">
                      <div>
                        <p className="mb-1 text-xs font-extrabold uppercase tracking-[0.12em] text-ink/42">Контур</p>
                        <div className={'grid w-full place-items-center overflow-hidden rounded-2xl bg-white shadow-sm ' + drawingFrameClass}>
                          <svg viewBox={viewBox} className="h-full w-full p-3 text-ink">
                            <g dangerouslySetInnerHTML={{ __html: finalLayers }} />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <p className="mb-1 text-xs font-extrabold uppercase tracking-[0.12em] text-ink/42">Вариант раскраски</p>
                        <div className={'grid w-full place-items-center overflow-hidden rounded-2xl bg-white shadow-sm ' + drawingFrameClass}>
                          <svg viewBox={coloredViewBox} className="h-full w-full">
                            <g dangerouslySetInnerHTML={{ __html: lesson.coloredPreview }} />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className={'mt-3 grid gap-3 text-left ' + (wideCanvas && lesson.storyPrompt ? 'lg:grid-cols-2' : '')}>
                  <div className="rounded-2xl bg-brand-green/10 px-4 py-3">
                    <p className="text-sm font-extrabold text-brand-green">Покажи рисунок родителям 💚</p>
                    <p className="mt-1 text-sm font-semibold leading-6 text-ink/70">{lesson.parentNote}</p>
                  </div>

                  {lesson.storyPrompt && (
                    <div className="rounded-2xl border border-brand-blue/15 bg-brand-blue/5 px-4 py-3">
                      <p className="text-sm font-extrabold text-brand-blue">Сюжетный шаг: {lesson.storyStageLabel ?? 'своя картинка'}</p>
                      <p className="mt-1 text-sm font-semibold leading-6 text-ink/70">{lesson.storyPrompt}</p>
                      {lesson.storyMissions?.length > 0 && (
                        <div className="mt-2 grid gap-1.5">
                          {lesson.storyMissions.map((mission, i) => (
                            <div key={mission} className="flex items-center gap-2 rounded-xl bg-white/75 px-3 py-1.5">
                              <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-brand-blue/10 text-[11px] font-extrabold text-brand-blue">{i + 1}</span>
                              <span className="text-xs font-extrabold leading-4 text-ink/68">{mission}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {!isGame && finalLayers && !lesson.coloredPreview && (
                  <div className="mt-3 rounded-2xl border border-brand-pink/15 bg-brand-pink/5 p-3 text-left">
                    <div className="flex items-center gap-3">
                      <div className="grid h-24 w-24 flex-none place-items-center rounded-2xl bg-white text-brand-pink shadow-sm">
                        <svg viewBox={viewBox} className="h-20 w-20">
                          <g dangerouslySetInnerHTML={{ __html: finalLayers }} />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-extrabold text-brand-pink">Теперь разукрась сюжет</p>
                        <p className="mt-1 text-sm font-semibold leading-5 text-ink/66">
                          {lesson.colorHint ?? 'Выбери 2–3 любимых цвета и добавь свой фон: траву, небо, точки или узоры.'}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {palette.map((color, i) => (
                            <span key={`${color}-${i}`} className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-1 text-[10px] font-extrabold text-ink/55 shadow-sm">
                              <span className="h-3 w-3 rounded-full border border-ink/10" style={{ backgroundColor: color }} />
                              цвет {i + 1}
                            </span>
                          ))}
                        </div>
                        {lesson.finishIdea && <p className="mt-2 text-xs font-bold leading-5 text-ink/48">{lesson.finishIdea}</p>}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-none border-t border-ink/8 px-5 py-3">
                {nextLesson ? (
                  <button onClick={onNext} className="primary-btn w-full">
                    Следующая картинка: {nextLesson.title} →
                  </button>
                ) : (
                  <p className="text-center text-sm font-semibold text-ink/54">Это последняя открытая картинка в этой ступени.</p>
                )}
                <button onClick={onClose} className="mt-2 w-full text-sm font-extrabold text-ink/50 transition hover:text-ink">Вернуться к урокам</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
