'use client';

// «Звёздный абакус» — real-time аркада, в которой ответ выбирается движением героя,
// а не кнопкой теста. Числовой образ управляет маршрутом по трём воздушным трассам.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const STORAGE_KEY = 'znayton_mental_sky_v1';
const FREE_MISSIONS = 3;
const START_LANE = 1;

const MISSIONS = [
  { id: 1, title: 'Первый полёт', note: 'Бусины и числа до 5', mode: 'abacus', min: 1, max: 5, rounds: 7, speed: 10 },
  { id: 2, title: 'Выше облаков', note: 'Образы чисел до 9', mode: 'abacus', min: 1, max: 9, rounds: 8, speed: 11.5 },
  { id: 3, title: 'Звёздная вспышка', note: 'Запомни исчезнувший абакус', mode: 'flash', min: 1, max: 9, rounds: 8, speed: 12, revealMs: 1450 },
  { id: 4, title: 'Ветер перемен', note: 'Плюс и минус в пределах 9', mode: 'calc', min: 1, max: 9, rounds: 9, speed: 12.5 },
  { id: 5, title: 'Орбита десятки', note: 'Пары, из которых получается 10', mode: 'friend', min: 1, max: 9, rounds: 9, speed: 13 },
  { id: 6, title: 'Метеорный микс', note: 'Память, примеры и числа до 20', mode: 'mix', min: 1, max: 20, rounds: 10, speed: 14 },
  { id: 7, title: 'Десятки и единицы', note: 'Двузначные числа на абакусе', mode: 'abacus', min: 10, max: 49, rounds: 10, speed: 14.5 },
  { id: 8, title: 'Космический марафон', note: 'Финальный микс всех механик', mode: 'mix', min: 1, max: 49, rounds: 12, speed: 15 },
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffled(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function makeChoices(answer, min, max) {
  const choices = new Set([answer]);
  let guard = 0;
  while (choices.size < 3 && guard < 80) {
    const distance = randomInt(1, Math.max(2, Math.ceil((max - min) / 3)));
    const candidate = Math.random() > 0.5 ? answer + distance : answer - distance;
    if (candidate >= min && candidate <= max) choices.add(candidate);
    guard += 1;
  }
  for (let value = min; choices.size < 3 && value <= max; value += 1) choices.add(value);
  return shuffled([...choices]);
}

function makeChallenge(mission, previousAnswer) {
  let mode = mission.mode;
  if (mode === 'mix') mode = shuffled(['flash', 'calc', 'friend'])[0];

  let answer = randomInt(mission.min, mission.max);
  let label = '';
  let instruction = 'Найди число по бусинам';

  if (mode === 'calc') {
    let start;
    let delta;
    let guard = 0;
    do {
      start = randomInt(1, Math.min(15, mission.max));
      delta = shuffled([-3, -2, -1, 1, 2, 3])[0];
      answer = start + delta;
      guard += 1;
    } while ((answer < mission.min || answer > mission.max || answer === previousAnswer) && guard < 60);
    label = `${start} ${delta > 0 ? '+' : '−'} ${Math.abs(delta)}`;
    instruction = 'Реши пример и поймай ответ';
  } else if (mode === 'friend') {
    const base = randomInt(1, 9);
    answer = 10 - base;
    label = `${base} + ? = 10`;
    instruction = 'Найди число, которого не хватает до 10';
  } else {
    let guard = 0;
    while (answer === previousAnswer && guard < 30) {
      answer = randomInt(mission.min, mission.max);
      guard += 1;
    }
    instruction = mode === 'flash' ? 'Запомни абакус и поймай число' : 'Прочитай абакус и поймай число';
  }

  const values = makeChoices(answer, mission.min, mission.max);
  return {
    id: `${Date.now()}-${Math.random()}`,
    mode,
    answer,
    values,
    label,
    instruction,
    correctLane: values.indexOf(answer),
  };
}

function starsFor(mistakes) {
  if (mistakes === 0) return 3;
  if (mistakes <= 2) return 2;
  return 1;
}

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
    <span className="mental-sky-abacus" role="img" aria-label={`На абакусе число ${value}`}>
      {digits.map((digit, index) => <AbacusColumn key={`${digit}-${index}`} digit={digit} />)}
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

  const beginRound = useCallback((targetMission, previousAnswer) => {
    const next = makeChallenge(targetMission, previousAnswer);
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

    setFeedback({ chosenLane, correctLane: challenge?.correctLane, correct });
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
      const nextHearts = heartsRef.current - 1;
      heartsRef.current = nextHearts;
      mistakesRef.current += 1;
      comboRef.current = 0;
      setHearts(nextHearts);
      setMistakes(mistakesRef.current);
      setCombo(0);
      if (soundOn) playTone('wrong');
      if (nextHearts <= 0) {
        later(() => setView('fail'), 750);
        return;
      }
    }

    if (nextRound >= mission.rounds) {
      later(() => finishMission(mission), 760);
      return;
    }

    later(() => {
      roundRef.current = nextRound;
      setRoundIndex(nextRound);
      beginRound(mission, challenge?.answer);
    }, 760);
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
      if (event.key === 'Escape' && view === 'play') setView('missions');
    };
    window.addEventListener('keydown', onKey, { passive: false });
    return () => window.removeEventListener('keydown', onKey);
  }, [moveLane, view]);

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
    beginRound(targetMission);
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
    setLane(targetLane);
  }

  if (view === 'intro') {
    return (
      <div className={`mental-sky mental-sky-intro ${className}`}>
        <div className="mental-sky-intro-copy">
          <span className="mental-sky-kicker">Аркада · управление героем · без регистрации</span>
          <h3>Звёздный абакус</h3>
          <p>Переключай воздушные трассы, лови правильные кристаллы и уклоняйся от неверных. Чем длиннее серия — тем быстрее полёт и больше очков.</p>
          <div className="mental-sky-intro-facts">
            <span>↕ Стрелки, свайп или тап</span><span>♥ 3 жизни</span><span>⚡ Комбо и ускорение</span>
          </div>
          <button type="button" className="mental-sky-start" onClick={() => setView('missions')}><b>▶</b> Посмотреть 8 миссий</button>
        </div>
        <div className="mental-sky-preview" aria-hidden="true">
          <div className="mental-sky-preview-stars">✦　·　✧　　·　✦</div>
          <div className="mental-sky-preview-ship">🦊<i>✦</i></div>
          <div className="mental-sky-preview-crystal is-one"><span>3</span></div>
          <div className="mental-sky-preview-crystal is-two"><span>5</span></div>
          <div className="mental-sky-preview-crystal is-three"><span>4</span></div>
          <div className="mental-sky-preview-target"><MiniAbacus value={4} /><span>Поймай число</span></div>
        </div>
        <div className="mental-sky-route-summary">
          <span><b>8</b> миссий</span>
          <span><b>3</b> бесплатно</span>
          <span><b>73</b> кристалла</span>
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
  if (view === 'win' || view === 'fail') {
    const won = view === 'win';
    const earned = starsFor(mistakes);
    const nextMission = MISSIONS.find((item) => item.id === missionId + 1);
    return (
      <div className={`mental-sky mental-sky-result ${won ? 'is-win' : 'is-fail'} ${className}`}>
        <span className="mental-sky-result-fox">{won ? '🦊✨' : '🦊'}</span>
        <span className="mental-sky-kicker">{won ? 'Миссия выполнена' : 'Корабль вернулся на базу'}</span>
        <h3>{won ? `Миссия «${mission.title}» выполнена!` : 'Попробуем ещё раз?'}</h3>
        {won ? <MissionStars count={earned} /> : null}
        <p>{won ? `Счёт: ${score}. Ошибок: ${mistakes}.` : 'Ошибки здесь — не оценка: маршрут уже знаком, а значит второй полёт будет спокойнее.'}</p>
        <div className="mental-sky-result-actions">
          {won && nextMission && isMissionOpen(nextMission.id) ? <button type="button" onClick={() => startMission(nextMission.id)}>Следующая миссия →</button> : null}
          {won && nextMission && !isMissionOpen(nextMission.id) && nextMission.id > FREE_MISSIONS ? <a href="#podpiska">Открыть весь маршрут →</a> : null}
          <button type="button" onClick={() => startMission(missionId)}>{won ? 'Ещё один полёт' : 'Запустить снова'}</button>
          <button type="button" onClick={() => setView('missions')}>К карте</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`mental-sky mental-sky-play ${className}`}>
      <div className="mental-sky-hud">
        <button type="button" onClick={() => setView('missions')} aria-label="Выйти к карте">←</button>
        <div><b>{mission.id}. {mission.title}</b><span>Кристалл {roundIndex + 1} из {mission.rounds}</span></div>
        <div className="mental-sky-score"><span>{score} очков</span><strong>{combo > 1 ? `серия ×${combo}` : 'держи курс'}</strong></div>
        <div className="mental-sky-hearts" aria-label={`Жизней: ${hearts}`}>{[1, 2, 3].map((heart) => <i key={heart} className={heart <= hearts ? '' : 'is-lost'}>♥</i>)}</div>
      </div>
      <div className="mental-sky-progress"><i style={{ width: `${(roundIndex / mission.rounds) * 100}%` }} /></div>
      <div className="mental-sky-goal" aria-live="polite">
        <div className="mental-sky-goal-step">
          <i>1</i>
          <span>
            <b>{challenge?.mode === 'abacus' || challenge?.mode === 'flash' ? 'Определи число на абакусе' : 'Реши пример'}</b>
            <small>{challenge?.mode === 'abacus' || challenge?.mode === 'flash' ? 'Верхняя цветная бусина = 5, каждая нижняя = 1' : 'Сохрани ответ в памяти'}</small>
          </span>
        </div>
        <div className="mental-sky-goal-task">
          {challenge?.mode === 'abacus' || challenge?.mode === 'flash'
            ? (reveal
                ? (
                    <>
                      <MiniAbacus value={challenge.answer} />
                      {missionId === 1 && roundIndex < 2 ? <span className="mental-sky-training-answer">= {challenge.answer}</span> : null}
                    </>
                  )
                : <strong className="mental-sky-memory">··· <small>держи число в памяти</small></strong>)
            : <strong>{challenge?.label}</strong>}
        </div>
        <div className="mental-sky-goal-arrow" aria-hidden="true">→</div>
        <div className="mental-sky-goal-step">
          <i>2</i>
          <span>
            <b>Выбери трассу</b>
            <small>Перейди к кристаллу с получившимся числом</small>
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
        {[0, 1, 2].map((track) => <div key={track} className={`mental-sky-track track-${track}`} />)}
        <div className="mental-sky-player" style={{ top: `${16.66 + lane * 33.33}%` }}><span>🦊</span><i>✦</i></div>
        {pack?.values.map((value, crystalLane) => {
          const chosen = feedback?.chosenLane === crystalLane;
          const right = feedback?.correctLane === crystalLane;
          const state = feedback ? (right ? 'is-right' : chosen ? 'is-wrong' : 'is-faded') : '';
          return <div key={`${pack.id}-${crystalLane}`} className={`mental-sky-crystal ${state}`} style={{ left: `${pack.x}%`, top: `${16.66 + crystalLane * 33.33}%` }}><span>{value}</span></div>;
        })}
        {paused ? <div className="mental-sky-paused">Пауза</div> : null}
        {feedback ? <div className={`mental-sky-burst ${feedback.correct ? 'is-good' : 'is-bad'}`}>{feedback.correct ? 'Точно! ✦' : `Нужно было число ${challenge?.answer}`}</div> : null}
      </div>
      <div className="mental-sky-controls">
        <button type="button" onClick={() => moveLane(-1)} disabled={lane === 0 || resolvedRef.current}><b>▲</b><span>выше</span></button>
        <p>Свайпни по игровому полю или выбери высоту кнопками</p>
        <button type="button" onClick={() => moveLane(1)} disabled={lane === 2 || resolvedRef.current}><b>▼</b><span>ниже</span></button>
      </div>
    </div>
  );
}