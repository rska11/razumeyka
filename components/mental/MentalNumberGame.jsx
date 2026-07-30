'use client';

// «Звёздный абакус» — real-time аркада, в которой ответ выбирается движением героя,
// а не кнопкой теста. Числовой образ управляет маршрутом по трём воздушным трассам.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FREE_MISSIONS, MISSIONS, makeChallenge, starsFor } from './number-game-engine';

const STORAGE_KEY = 'znayton_mental_sky_v1';
const START_LANE = 1;

function playTone(kind) {
  if (typeof window === 'undefined') return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = kind === 'wrong' ? 'sawtooth' : 'sine';
  oscillator.frequency.value = kind === 'wrong' ? 180 : kind === 'win' ? 880 : 620;
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.09, context.currentTime + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.22);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.24);
  oscillator.addEventListener('ended', () => context.close());
}

function AbacusColumn({ digit }) {
  const upperActive = digit >= 5;
  const lowerActive = digit % 5;
  return (
    <span className="mental-sky-abacus-column" aria-hidden="true">
      <i className={`mental-sky-bead mental-sky-bead-upper ${upperActive ? 'is-active' : ''}`} />
      <b />
      {[4, 3, 2, 1].map((value) => (
        <i key={value} className={`mental-sky-bead mental-sky-bead-lower ${value <= lowerActive ? 'is-active' : ''}`} />
      ))}
    </span>
  );
}

function MiniAbacus({ value }) {
  const digits = value >= 10 ? [Math.floor(value / 10), value % 10] : [value];
  return (
    <span className={`mental-sky-abacus ${digits.length > 1 ? 'is-two-digit' : ''}`} role="img" aria-label={`На абакусе число ${value}`}>
      <span className="mental-sky-abacus-rods">
        {digits.map((digit, index) => <AbacusColumn key={`${digit}-${index}`} digit={digit} />)}
      </span>
      {digits.length > 1 ? <span className="mental-sky-place-labels"><small>десятки</small><small>единицы</small></span> : null}
    </span>
  );
}

function SkyShip({ compact = false }) {
  return (
    <span className={`mental-sky-ship ${compact ? 'is-compact' : ''}`} aria-hidden="true">
      <i className="mental-sky-ship-flame" />
      <i className="mental-sky-ship-wing is-top" />
      <i className="mental-sky-ship-wing is-bottom" />
      <i className="mental-sky-ship-body"><b /></i>
      <i className="mental-sky-ship-cockpit" />
    </span>
  );
}

function MissionStars({ count = 0 }) {
  return <span className="mental-sky-stars" aria-label={`${count} из 3 звёзд`}>{[1, 2, 3].map((star) => <i key={star} className={star <= count ? 'is-on' : ''}>★</i>)}</span>;
}

export function MentalNumberGame({ hasSubscription = false, onComplete, className = '' }) {
  const [ready, setReady] = useState(false);
  const [view, setView] = useState('intro');
  const [progress, setProgress] = useState({});
  const [soundOn, setSoundOn] = useState(true);
  const [missionId, setMissionId] = useState(1);
  const [lane, setLane] = useState(START_LANE);
  const [challenge, setChallenge] = useState(null);
  const [pack, setPack] = useState(null);
  const [roundIndex, setRoundIndex] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [reveal, setReveal] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [paused, setPaused] = useState(false);

  const laneRef = useRef(lane);
  const heartsRef = useRef(hearts);
  const scoreRef = useRef(score);
  const comboRef = useRef(combo);
  const mistakesRef = useRef(mistakes);
  const roundRef = useRef(roundIndex);
  const resolvedRef = useRef(false);
  const timersRef = useRef(new Set());
  const fieldRef = useRef(null);
  const pointerStartRef = useRef(null);

  const mission = MISSIONS.find((item) => item.id === missionId) ?? MISSIONS[0];
  const totalStars = useMemo(() => Object.values(progress).reduce((sum, value) => sum + Number(value || 0), 0), [progress]);
  const flightSpeed = mission.speed + Math.min(combo, 6) * 0.45;

  const later = useCallback((callback, delay) => {
    const timer = window.setTimeout(() => {
      timersRef.current.delete(timer);
      callback();
    }, delay);
    timersRef.current.add(timer);
    return timer;
  }, []);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current.clear();
  }, []);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      if (saved?.progress && typeof saved.progress === 'object') setProgress(saved.progress);
      if (typeof saved?.soundOn === 'boolean') setSoundOn(saved.soundOn);
    } catch {}
    setReady(true);
    return clearTimers;
  }, [clearTimers]);

  useEffect(() => { laneRef.current = lane; }, [lane]);
  useEffect(() => { heartsRef.current = hearts; }, [hearts]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { comboRef.current = combo; }, [combo]);
  useEffect(() => { mistakesRef.current = mistakes; }, [mistakes]);
  useEffect(() => { roundRef.current = roundIndex; }, [roundIndex]);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const persist = useCallback((nextProgress, nextSound = soundOn) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ progress: nextProgress, soundOn: nextSound })); } catch {}
  }, [soundOn]);

  const isMissionOpen = useCallback((id) => {
    if (id > FREE_MISSIONS && !hasSubscription) return false;
    if (id === 1) return true;
    return Boolean(progress[id - 1]);
  }, [hasSubscription, progress]);

  const beginRound = useCallback((targetMission, previousAnswer, targetRound = 0) => {
    const next = makeChallenge(targetMission, previousAnswer, targetRound);
    setChallenge(next);
    setPack({ id: next.id, x: 106, values: next.values });
    setFeedback(null);
    setReveal(true);
    resolvedRef.current = false;
    if (next.mode === 'flash') later(() => setReveal(false), targetMission.revealMs ?? 1350);
  }, [later]);

  const finishMission = useCallback((targetMission) => {
    const earned = starsFor(mistakesRef.current);
    setProgress((current) => {
      const next = { ...current, [targetMission.id]: Math.max(Number(current[targetMission.id] || 0), earned) };
      persist(next);
      return next;
    });
    setView('win');
    if (soundOn) playTone('win');
    onComplete?.({ mission: targetMission.id, stars: earned, score: scoreRef.current, mistakes: mistakesRef.current });
  }, [onComplete, persist, soundOn]);

  const resolvePack = useCallback((currentPack) => {
    const chosenLane = laneRef.current;
    const chosenValue = currentPack.values[chosenLane];
    const correct = chosenValue === challenge?.answer;
    const nextRound = roundRef.current + 1;
    const feedbackDelay = correct ? 900 : 1350;

    setFeedback({
      chosenLane,
      correctLane: challenge?.correctLane,
      correct,
      title: correct ? 'Верный маршрут!' : 'Разберём спокойно',
      detail: challenge?.explanation,
    });

    if (correct) {
      const nextCombo = comboRef.current + 1;
      const nextScore = scoreRef.current + 100 + Math.min(nextCombo, 8) * 15;
      comboRef.current = nextCombo;
      scoreRef.current = nextScore;
      setCombo(nextCombo);
      setScore(nextScore);
      if (nextCombo % 4 === 0 && heartsRef.current < 3) {
        heartsRef.current += 1;
        setHearts(heartsRef.current);
      }
      if (soundOn) playTone('success');
    } else {
      const nextEnergy = Math.max(0, heartsRef.current - 1);
      heartsRef.current = nextEnergy;
      mistakesRef.current += 1;
      comboRef.current = 0;
      setHearts(nextEnergy);
      setMistakes(mistakesRef.current);
      setCombo(0);
      if (soundOn) playTone('wrong');
    }

    if (nextRound >= mission.rounds) {
      later(() => finishMission(mission), feedbackDelay);
      return;
    }

    later(() => {
      roundRef.current = nextRound;
      setRoundIndex(nextRound);
      beginRound(mission, challenge?.answer, nextRound);
    }, feedbackDelay);
  }, [beginRound, challenge, finishMission, later, mission, soundOn]);

  useEffect(() => {
    if (view !== 'play' || !pack || paused) return undefined;
    let frame;
    let previous = performance.now();
    const activePackId = pack.id;

    const tick = (now) => {
      const delta = Math.min((now - previous) / 1000, 0.05);
      previous = now;
      setPack((current) => {
        if (!current || current.id !== activePackId || resolvedRef.current) return current;
        const nextX = current.x - flightSpeed * delta;
        if (nextX <= 13.5) {
          resolvedRef.current = true;
          Promise.resolve().then(() => resolvePack(current));
          return { ...current, x: 13.5 };
        }
        return { ...current, x: nextX };
      });
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [flightSpeed, pack?.id, paused, resolvePack, view]);

  const selectLane = useCallback((targetLane) => {
    if (view !== 'play' || resolvedRef.current || paused) return;
    setLane(Math.max(0, Math.min(2, targetLane)));
  }, [paused, view]);

  const moveLane = useCallback((direction) => {
    if (view !== 'play' || resolvedRef.current || paused) return;
    setLane((current) => Math.max(0, Math.min(2, current + direction)));
  }, [paused, view]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'ArrowUp' || event.key.toLowerCase() === 'w') {
        event.preventDefault();
        moveLane(-1);
      }
      if (event.key === 'ArrowDown' || event.key.toLowerCase() === 's') {
        event.preventDefault();
        moveLane(1);
      }
      if (['1', '2', '3'].includes(event.key)) {
        event.preventDefault();
        selectLane(Number(event.key) - 1);
      }
      if (event.key === ' ' && view === 'play') {
        event.preventDefault();
        setPaused((current) => !current);
      }
      if (event.key === 'Escape' && view === 'play') setView('missions');
    };
    window.addEventListener('keydown', onKey, { passive: false });
    return () => window.removeEventListener('keydown', onKey);
  }, [moveLane, selectLane, view]);

  function startMission(id) {
    if (!isMissionOpen(id)) return;
    clearTimers();
    const targetMission = MISSIONS.find((item) => item.id === id) ?? MISSIONS[0];
    setMissionId(id);
    setLane(START_LANE);
    laneRef.current = START_LANE;
    setRoundIndex(0);
    roundRef.current = 0;
    setHearts(3);
    heartsRef.current = 3;
    setScore(0);
    scoreRef.current = 0;
    setCombo(0);
    comboRef.current = 0;
    setMistakes(0);
    mistakesRef.current = 0;
    setPaused(false);
    setView('play');
    beginRound(targetMission, undefined, 0);
  }

  function toggleSound() {
    setSoundOn((current) => {
      const next = !current;
      persist(progress, next);
      return next;
    });
  }

  function onPointerDown(event) {
    pointerStartRef.current = { y: event.clientY, pointerId: event.pointerId };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function onPointerUp(event) {
    const start = pointerStartRef.current;
    pointerStartRef.current = null;
    if (!start) return;
    if (resolvedRef.current || paused || view !== 'play') return;
    const delta = event.clientY - start.y;
    if (Math.abs(delta) > 24) {
      moveLane(delta > 0 ? 1 : -1);
      return;
    }
    const rect = fieldRef.current?.getBoundingClientRect();
    if (!rect) return;
    const relative = (event.clientY - rect.top) / rect.height;
    const targetLane = Math.max(0, Math.min(2, Math.floor(relative * 3)));
    selectLane(targetLane);
  }

  if (view === 'intro') {
    return (
      <div className={`mental-sky mental-sky-intro ${className}`}>
        <div className="mental-sky-intro-copy">
          <span className="mental-sky-kicker">Аркада · управление героем · без регистрации</span>
          <h3>Звёздный абакус</h3>
          <p>Управляй исследовательским кораблём и решай короткие числовые задачи прямо в полёте: абакус, состав числа, сравнение, соседи и закономерности.</p>
          <div className="mental-sky-intro-facts">
            <span>↕ Тап, свайп или клавиши 1–3</span><span>◇ Ошибка не прерывает полёт</span><span>⚡ Ответ сразу объясняется</span>
          </div>
          <button type="button" className="mental-sky-start" onClick={() => setView('missions')}><b>▶</b> Посмотреть 8 миссий</button>
        </div>
        <div className="mental-sky-preview" aria-hidden="true">
          <div className="mental-sky-preview-stars">✦　·　✧　　·　✦</div>
          <div className="mental-sky-preview-ship"><SkyShip /></div>
          <div className="mental-sky-preview-crystal is-one"><span>3</span></div>
          <div className="mental-sky-preview-crystal is-two"><span>5</span></div>
          <div className="mental-sky-preview-crystal is-three"><span>4</span></div>
          <div className="mental-sky-preview-target"><MiniAbacus value={4} /><span>Поймай число</span></div>
        </div>
        <div className="mental-sky-route-summary">
          <span><b>8</b> миссий</span>
          <span><b>3</b> бесплатно</span>
          <span><b>7</b> типов задач</span>
        </div>
        <button type="button" className="mental-sky-sound" onClick={toggleSound}>{soundOn ? '🔊 Звук включён' : '🔇 Без звука'}</button>
      </div>
    );
  }

  if (view === 'missions') {
    return (
      <div className={`mental-sky mental-sky-map-screen ${className}`}>
        <div className="mental-sky-map-head">
          <button type="button" className="mental-sky-map-back" onClick={() => setView('intro')}>← Назад</button>
          <div>
            <span className="mental-sky-kicker">8 игровых миссий · 3 уровня бесплатно</span>
            <h3>Выбери миссию и уровень</h3>
            <p>Проходи уровни по порядку: новые маршруты открываются после завершения предыдущих.</p>
          </div>
          <div className="mental-sky-map-score"><span>Собрано</span><strong>{ready ? totalStars : 0} / {MISSIONS.length * 3} ★</strong></div>
        </div>
        <div className="mental-sky-map-grid">
          {MISSIONS.map((item) => {
            const open = ready && isMissionOpen(item.id);
            const paid = item.id > FREE_MISSIONS && !hasSubscription;
            const completed = Number(progress[item.id] || 0);
            return (
              <button
                key={item.id}
                type="button"
                disabled={!open}
                onClick={() => startMission(item.id)}
                className={`${open ? 'is-open' : 'is-locked'} ${completed ? 'is-complete' : ''}`}
              >
                <div className="mental-sky-map-card-top">
                  <span>Уровень {item.id} из {MISSIONS.length}</span>
                  <em>{item.id <= FREE_MISSIONS ? 'Бесплатно' : paid ? 'В курсе' : 'Открыта'}</em>
                </div>
                <i className="mental-sky-map-number">{open ? item.id : '🔒'}</i>
                <h4>{item.title}</h4>
                <p>{item.note}</p>
                <div className="mental-sky-map-card-bottom">
                  <span>{item.rounds} кристаллов</span>
                  {open
                    ? <MissionStars count={completed} />
                    : <small>{paid ? 'Открывается с курсом' : 'Сначала пройди предыдущую'}</small>}
                </div>
              </button>
            );
          })}
        </div>
        {!hasSubscription ? (
          <div className="mental-sky-map-access">
            <span>Первые три миссии можно пройти прямо сейчас.</span>
            <a href="#podpiska">Открыть весь маршрут →</a>
          </div>
        ) : null}
      </div>
    );
  }
  if (view === 'win') {
    const earned = starsFor(mistakes);
    const nextMission = MISSIONS.find((item) => item.id === missionId + 1);
    return (
      <div className={`mental-sky mental-sky-result is-win ${className}`}>
        <span className="mental-sky-result-fox"><SkyShip /></span>
        <span className="mental-sky-kicker">Миссия выполнена</span>
        <h3>Маршрут «{mission.title}» пройден!</h3>
        <MissionStars count={earned} />
        <p>Счёт: {score}. Ошибок: {mistakes}. Каждая ошибка разобрана по пути — теперь числовой маршрут знаком лучше.</p>
        <div className="mental-sky-result-actions">
          {nextMission && isMissionOpen(nextMission.id) ? <button type="button" onClick={() => startMission(nextMission.id)}>Следующая миссия →</button> : null}
          {nextMission && !isMissionOpen(nextMission.id) && nextMission.id > FREE_MISSIONS ? <a href="#podpiska">Открыть весь маршрут →</a> : null}
          <button type="button" onClick={() => startMission(missionId)}>Пройти ещё раз</button>
          <button type="button" onClick={() => setView('missions')}>К карте</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`mental-sky mental-sky-play ${className}`}>
      <div className="mental-sky-hud">
        <button type="button" onClick={() => setView('missions')} aria-label="Выйти к карте">←</button>
        <div><b>{mission.id}. {mission.title}</b><span>Задание {roundIndex + 1} из {mission.rounds}</span></div>
        <div className="mental-sky-score"><span>{score} очков</span><strong>{combo > 1 ? `серия ×${combo}` : 'спокойный темп'}</strong></div>
        <div className="mental-sky-hearts" aria-label={`Энергия корабля: ${hearts} из 3`}>{[1, 2, 3].map((cell) => <i key={cell} className={cell <= hearts ? '' : 'is-lost'}>◆</i>)}</div>
        <div className="mental-sky-hud-tools">
          <button type="button" onClick={() => setPaused((current) => !current)} aria-label={paused ? 'Продолжить' : 'Пауза'}>{paused ? '▶' : 'Ⅱ'}</button>
          <button type="button" onClick={toggleSound} aria-label={soundOn ? 'Выключить звук' : 'Включить звук'}>{soundOn ? '♪' : '×'}</button>
        </div>
      </div>
      <div className="mental-sky-progress"><i style={{ width: `${((roundIndex + (feedback ? 1 : 0)) / mission.rounds) * 100}%` }} /></div>
      <div className="mental-sky-goal" aria-live="polite">
        <div className="mental-sky-goal-step">
          <i>1</i>
          <span>
            <b>{challenge?.taskTitle}</b>
            <small>{challenge?.instruction}</small>
          </span>
        </div>
        <div className="mental-sky-goal-task">
          {['abacus', 'flash', 'place'].includes(challenge?.mode)
            ? (reveal
                ? (
                    <>
                      <MiniAbacus value={challenge.answer} />
                      {missionId === 1 && roundIndex < 2 ? <span className="mental-sky-training-answer">= {challenge.answer}</span> : null}
                    </>
                  )
                : <strong className="mental-sky-memory">··· <small>удержи число в памяти</small></strong>)
            : <strong>{challenge?.label}</strong>}
        </div>
        <div className="mental-sky-goal-arrow" aria-hidden="true">→</div>
        <div className="mental-sky-goal-step">
          <i>2</i>
          <span>
            <b>Выбери трассу</b>
            <small>Коснись нужной высоты или нажми кнопку 1, 2 либо 3</small>
          </span>
        </div>
      </div>
      <div
        ref={fieldRef}
        className={`mental-sky-field ${feedback?.correct ? 'is-correct' : feedback && !feedback.correct ? 'is-wrong' : ''}`}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <div className="mental-sky-space"><i /><i /><i /><i /><i /><i /></div>
        <div className="mental-sky-cloud cloud-one" /><div className="mental-sky-cloud cloud-two" />
        {[0, 1, 2].map((track) => <div key={track} className={`mental-sky-track track-${track} ${lane === track ? 'is-selected' : ''}`} />)}
        <div className="mental-sky-player" style={{ top: `${16.66 + lane * 33.33}%` }}><SkyShip compact /></div>
        {pack?.values.map((value, crystalLane) => {
          const chosen = feedback?.chosenLane === crystalLane;
          const right = feedback?.correctLane === crystalLane;
          const state = feedback ? (right ? 'is-right' : chosen ? 'is-wrong' : 'is-faded') : '';
          return <div key={`${pack.id}-${crystalLane}`} className={`mental-sky-crystal ${state}`} style={{ left: `${pack.x}%`, top: `${16.66 + crystalLane * 33.33}%` }}><span>{value}</span></div>;
        })}
        {paused ? <button type="button" className="mental-sky-paused" onClick={() => setPaused(false)}>▶ Продолжить</button> : null}
        {feedback ? (
          <div className={`mental-sky-burst ${feedback.correct ? 'is-good' : 'is-bad'}`}>
            <strong>{feedback.title}</strong>
            <small>{feedback.detail}</small>
          </div>
        ) : null}
      </div>
      <div className="mental-sky-controls mental-sky-lane-controls">
        {[0, 1, 2].map((targetLane) => (
          <button key={targetLane} type="button" className={lane === targetLane ? 'is-selected' : ''} onClick={() => selectLane(targetLane)} disabled={resolvedRef.current || paused}>
            <b>{targetLane + 1}</b><span>{targetLane === 0 ? 'верхняя' : targetLane === 1 ? 'средняя' : 'нижняя'}</span>
          </button>
        ))}
      </div>
    </div>
  );
}