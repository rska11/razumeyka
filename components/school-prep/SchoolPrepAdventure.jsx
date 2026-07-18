"use client";

import { useEffect, useMemo, useState } from "react";
import { SchoolPrepAudioButton } from "./SchoolPrepAudioButton.jsx";

const STORAGE_KEY = "razumeyka_school_prep_week1";

const toneClasses = {
  "text-brand-blue": "text-brand-blue",
  "text-brand-pink": "text-brand-pink",
  "text-brand-orange": "text-brand-orange",
  "text-brand-yellow": "text-brand-yellow",
  "text-brand-green": "text-brand-green",
  "text-brand-purple": "text-brand-purple",
};

function sameAnswers(selected, correct) {
  if (selected.length !== correct.length) return false;
  return [...selected].sort().every((item, index) => item === [...correct].sort()[index]);
}

function ResultMessage({ state, success, hint }) {
  if (!state) return null;
  const ok = state === "success";
  return (
    <div className={`mt-4 rounded-[18px] border px-4 py-3 text-sm font-bold leading-6 ${
      ok
        ? "border-brand-green/20 bg-brand-green/[0.07] text-forest-700"
        : "border-brand-orange/20 bg-brand-orange/[0.07] text-ink/68"
    }`}>
      <span className="mr-2">{ok ? "⭐" : "💡"}</span>
      {ok ? success : hint}
    </div>
  );
}

function OptionContent({ option }) {
  return (
    <>
      {option.emoji && <span className="text-3xl sm:text-4xl">{option.emoji}</span>}
      {option.symbol && (
        <span className={`text-4xl ${toneClasses[option.tone] ?? "text-ink"}`}>{option.symbol}</span>
      )}
      <span className="text-sm font-extrabold leading-5 text-ink">{option.label}</span>
    </>
  );
}

function ChoiceMission({ mission, done, onComplete }) {
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(done ? "success" : "");

  function toggle(id) {
    setResult("");
    if (mission.mode === "single") {
      setSelected([id]);
      return;
    }
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function check() {
    if (sameAnswers(selected, mission.correct)) {
      setResult("success");
      onComplete();
    } else {
      setResult("hint");
    }
  }

  return (
    <>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {mission.options.map((option) => {
          const active = selected.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => toggle(option.id)}
              className={`flex min-h-[112px] flex-col items-center justify-center gap-2 rounded-[20px] border px-3 py-4 text-center transition duration-200 ${
                active
                  ? "border-brand-blue bg-brand-blue/[0.08] shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
                  : "border-ink/8 bg-white hover:-translate-y-0.5 hover:border-brand-blue/24 hover:shadow-card"
              }`}
            >
              <OptionContent option={option} />
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={check}
        disabled={selected.length === 0}
        className="mt-5 inline-flex min-h-[50px] items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-35"
      >
        Проверить ответ
      </button>
      <ResultMessage state={result} success={mission.success} hint={mission.hint} />
    </>
  );
}

function SequenceMission({ mission, done, onComplete }) {
  const [sequence, setSequence] = useState([]);
  const [result, setResult] = useState(done ? "success" : "");

  function add(id) {
    if (sequence.includes(id)) return;
    setResult("");
    setSequence((current) => [...current, id]);
  }

  function check() {
    if (sequence.length === mission.correct.length && sequence.every((id, index) => id === mission.correct[index])) {
      setResult("success");
      onComplete();
    } else {
      setResult("hint");
    }
  }

  return (
    <>
      <div className="mt-5 rounded-[20px] border border-dashed border-brand-purple/24 bg-brand-purple/[0.035] p-4">
        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-ink/42">Твой порядок</p>
        <div className="mt-3 flex min-h-[54px] flex-wrap items-center gap-2">
          {sequence.length === 0 && <span className="text-sm font-semibold text-ink/38">Нажимай карточки по очереди</span>}
          {sequence.map((id, index) => {
            const option = mission.options.find((item) => item.id === id);
            return (
              <span key={id} className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-extrabold text-ink shadow-sm">
                <b className="text-brand-purple">{index + 1}</b> {option?.emoji} {option?.label}
              </span>
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {mission.options.map((option) => {
          const used = sequence.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              disabled={used}
              onClick={() => add(option.id)}
              className="flex min-h-[104px] flex-col items-center justify-center gap-2 rounded-[18px] border border-ink/8 bg-white px-3 py-4 transition hover:-translate-y-0.5 hover:border-brand-purple/28 hover:shadow-card disabled:opacity-30"
            >
              <OptionContent option={option} />
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={check}
          disabled={sequence.length !== mission.correct.length}
          className="inline-flex min-h-[50px] items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-extrabold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-35"
        >
          Проверить порядок
        </button>
        <button
          type="button"
          onClick={() => { setSequence([]); setResult(""); }}
          className="inline-flex min-h-[50px] items-center justify-center rounded-full border border-ink/10 bg-white px-5 py-3 text-sm font-extrabold text-ink/58 transition hover:bg-ink/[0.04]"
        >
          Начать заново
        </button>
      </div>
      <ResultMessage state={result} success={mission.success} hint={mission.hint} />
    </>
  );
}

function MemoryMission({ mission, done, onComplete }) {
  const [open, setOpen] = useState([]);
  const [matched, setMatched] = useState(done ? [...new Set(mission.cards.map((card) => card.pair))] : []);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    if (open.length !== 2) return undefined;
    const [first, second] = open;
    const timer = window.setTimeout(() => {
      if (mission.cards[first].pair === mission.cards[second].pair) {
        setMatched((current) => {
          const next = current.includes(mission.cards[first].pair)
            ? current
            : [...current, mission.cards[first].pair];
          if (next.length === new Set(mission.cards.map((card) => card.pair)).size) onComplete();
          return next;
        });
      }
      setOpen([]);
    }, 650);
    return () => window.clearTimeout(timer);
  }, [mission.cards, onComplete, open]);

  function flip(index) {
    if (open.length >= 2 || open.includes(index) || matched.includes(mission.cards[index].pair)) return;
    setOpen((current) => [...current, index]);
    if (open.length === 1) setMoves((current) => current + 1);
  }

  const allDone = matched.length === new Set(mission.cards.map((card) => card.pair)).size;

  return (
    <>
      <div className="mt-5 grid grid-cols-4 gap-2.5 sm:gap-3">
        {mission.cards.map((card, index) => {
          const visible = open.includes(index) || matched.includes(card.pair);
          return (
            <button
              key={`${card.pair}-${index}`}
              type="button"
              onClick={() => flip(index)}
              className={`aspect-square rounded-[18px] border text-3xl transition duration-300 sm:text-4xl ${
                visible
                  ? "rotate-0 border-brand-purple/20 bg-white shadow-card"
                  : "border-white/12 bg-gradient-to-br from-brand-purple to-brand-blue text-transparent shadow-sm hover:-translate-y-1"
              }`}
              aria-label={visible ? card.label : "Закрытая карточка"}
            >
              {visible ? card.emoji : "?"}
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 text-xs font-bold text-ink/48">
        <span>Ходов: {moves}</span>
        <span>Найдено пар: {matched.length} из {new Set(mission.cards.map((card) => card.pair)).size}</span>
      </div>
      <ResultMessage state={allDone ? "success" : ""} success={mission.success} />
    </>
  );
}

function QuizMission({ mission, done, onComplete, audioBase }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [result, setResult] = useState(done ? "success" : "");
  const question = mission.questions[index];
  const last = index === mission.questions.length - 1;

  function answer(id) {
    setSelected(id);
    setResult(id === question.correct ? "question-success" : "hint");
  }

  function next() {
    if (selected !== question.correct) return;
    if (last) {
      setResult("success");
      onComplete();
      return;
    }
    setIndex((current) => current + 1);
    setSelected("");
    setResult("");
  }

  return (
    <>
      <div className="mt-5 flex gap-1.5">
        {mission.questions.map((_, questionIndex) => (
          <span
            key={questionIndex}
            className={`h-2 flex-1 rounded-full ${
              questionIndex <= index ? "bg-brand-green" : "bg-ink/8"
            }`}
          />
        ))}
      </div>
      <div className="mt-5 rounded-[20px] bg-ink/[0.025] p-5">
        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-brand-green">
          Вопрос {index + 1} из {mission.questions.length}
        </p>
        <p className="mt-3 font-display text-xl font-extrabold leading-tight text-ink sm:text-2xl">{question.prompt}</p>
        <SchoolPrepAudioButton src={`${audioBase}/question-${index + 1}.mp3`} label="Послушать вопрос" className="mt-4" />
        <div className="mt-4 grid gap-2">
          {question.options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => answer(option.id)}
              className={`rounded-[16px] border px-4 py-3 text-left text-sm font-extrabold transition ${
                selected === option.id
                  ? option.id === question.correct
                    ? "border-brand-green/30 bg-brand-green/[0.08] text-forest-700"
                    : "border-brand-orange/30 bg-brand-orange/[0.08] text-ink"
                  : "border-ink/8 bg-white text-ink hover:border-brand-green/24"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {result === "hint" && (
        <ResultMessage state="hint" hint="Не спеши. Прочитай вопрос ещё раз и попробуй другой ответ." />
      )}
      {result === "question-success" && (
        <div className="mt-4 rounded-[18px] border border-brand-green/20 bg-brand-green/[0.07] px-4 py-3 text-sm font-bold text-forest-700">
          ⭐ Верно! {last ? "Золотой ключ почти собран." : "Идём дальше."}
        </div>
      )}
      {result === "success" && <ResultMessage state="success" success={mission.success} />}
      {selected === question.correct && result !== "success" && (
        <button
          type="button"
          onClick={next}
          className="mt-4 inline-flex min-h-[50px] items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-extrabold text-white transition hover:-translate-y-0.5"
        >
          {last ? "Собрать ключ" : "Следующий вопрос →"}
        </button>
      )}
    </>
  );
}

function SortMission({ mission, done, onComplete }) {
  const [itemIndex, setItemIndex] = useState(done ? mission.items.length : 0);
  const [result, setResult] = useState(done ? "success" : "");
  const current = mission.items[itemIndex];

  function place(groupId) {
    if (!current) return;
    if (current.group !== groupId) {
      setResult("hint");
      return;
    }
    const next = itemIndex + 1;
    if (next === mission.items.length) {
      setItemIndex(next);
      setResult("success");
      onComplete();
      return;
    }
    setItemIndex(next);
    setResult("");
  }

  return (
    <>
      <div className="mt-5 overflow-hidden rounded-[24px] border border-brand-cyan/18 bg-gradient-to-br from-brand-cyan/[0.08] to-brand-blue/[0.04] p-5">
        <div className="flex items-center justify-between gap-3 text-xs font-extrabold text-ink/48">
          <span>Сортировочная станция</span>
          <span>{Math.min(itemIndex, mission.items.length)} / {mission.items.length}</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
          <div className="h-full rounded-full bg-gradient-to-r from-brand-cyan to-brand-blue transition-all" style={{ width: `${(itemIndex / mission.items.length) * 100}%` }} />
        </div>
        {current ? (
          <div className="mt-5 text-center">
            <span className="text-6xl" aria-hidden="true">{current.emoji}</span>
            <p className="mt-2 font-display text-xl font-extrabold text-ink">{current.label}</p>
            <p className="mt-1 text-xs font-bold text-ink/42">В какую зону отправить?</p>
          </div>
        ) : (
          <div className="mt-5 text-center text-5xl" aria-hidden="true">🎉</div>
        )}
      </div>
      {current && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {mission.groups.map((group) => (
            <button key={group.id} type="button" onClick={() => place(group.id)} className="flex min-h-[82px] items-center justify-center gap-3 rounded-[18px] border border-ink/8 bg-white px-4 py-3 text-sm font-extrabold text-ink transition hover:-translate-y-0.5 hover:border-brand-cyan/30 hover:shadow-card">
              <span className="text-3xl">{group.emoji}</span>{group.label}
            </button>
          ))}
        </div>
      )}
      <ResultMessage state={result} success={mission.success} hint={mission.hint} />
    </>
  );
}

function PathMission({ mission, done, onComplete }) {
  const [position, setPosition] = useState(done ? mission.goal : mission.start);
  const [result, setResult] = useState(done ? "success" : "");
  const blocked = new Set(mission.blocked.map(([row, col]) => `${row}-${col}`));

  function move(rowDelta, colDelta) {
    const next = [position[0] + rowDelta, position[1] + colDelta];
    const outside = next[0] < 0 || next[0] >= mission.rows || next[1] < 0 || next[1] >= mission.cols;
    if (outside || blocked.has(`${next[0]}-${next[1]}`)) {
      setResult("hint");
      return;
    }
    setPosition(next);
    if (next[0] === mission.goal[0] && next[1] === mission.goal[1]) {
      setResult("success");
      onComplete();
    } else {
      setResult("");
    }
  }

  function restart() {
    setPosition(mission.start);
    setResult("");
  }

  return (
    <>
      <div className="mt-5 grid gap-5 rounded-[24px] border border-brand-purple/16 bg-brand-purple/[0.035] p-5 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="mx-auto grid w-full max-w-[360px] gap-2" style={{ gridTemplateColumns: `repeat(${mission.cols}, minmax(0, 1fr))` }}>
          {Array.from({ length: mission.rows * mission.cols }, (_, index) => {
            const row = Math.floor(index / mission.cols);
            const col = index % mission.cols;
            const key = `${row}-${col}`;
            const fox = position[0] === row && position[1] === col;
            const goal = mission.goal[0] === row && mission.goal[1] === col;
            return (
              <div key={key} className={`grid aspect-square place-items-center rounded-[14px] border text-2xl sm:text-3xl ${blocked.has(key) ? "border-ink/5 bg-ink/8" : goal ? "border-brand-yellow/30 bg-brand-yellow/14" : "border-white bg-white shadow-sm"}`}>
                {fox ? "🦊" : blocked.has(key) ? "🌳" : goal ? mission.goalEmoji : ""}
              </div>
            );
          })}
        </div>
        <div className="mx-auto grid grid-cols-3 gap-2">
          <span />
          <button type="button" onClick={() => move(-1, 0)} className="grid h-12 w-12 place-items-center rounded-[15px] bg-ink text-xl font-black text-white">↑</button>
          <span />
          <button type="button" onClick={() => move(0, -1)} className="grid h-12 w-12 place-items-center rounded-[15px] bg-ink text-xl font-black text-white">←</button>
          <button type="button" onClick={restart} className="grid h-12 w-12 place-items-center rounded-[15px] border border-ink/10 bg-white text-base">↻</button>
          <button type="button" onClick={() => move(0, 1)} className="grid h-12 w-12 place-items-center rounded-[15px] bg-ink text-xl font-black text-white">→</button>
          <span />
          <button type="button" onClick={() => move(1, 0)} className="grid h-12 w-12 place-items-center rounded-[15px] bg-ink text-xl font-black text-white">↓</button>
          <span />
        </div>
      </div>
      <ResultMessage state={result} success={mission.success} hint={mission.hint} />
    </>
  );
}

function ActionMission({ mission, done, onComplete, audioBase }) {
  const [step, setStep] = useState(done ? mission.actions.length : 0);
  const finished = step >= mission.actions.length;
  const action = mission.actions[step];

  function next() {
    const nextStep = step + 1;
    setStep(nextStep);
    if (nextStep === mission.actions.length) onComplete();
  }

  return (
    <>
      <div className="mt-5 overflow-hidden rounded-[24px] border border-brand-orange/18 bg-gradient-to-br from-brand-orange/[0.1] via-white to-brand-yellow/[0.08] p-5 text-center sm:p-7">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-orange">Перерыв-игра · встаём со стула</p>
        {!finished ? (
          <>
            <div className="mt-5 text-7xl" aria-hidden="true">{action.emoji}</div>
            <h5 className="mt-4 font-display text-2xl font-extrabold text-ink">{action.title}</h5>
            <p className="mx-auto mt-2 max-w-lg text-sm font-semibold leading-6 text-ink/56">{action.text}</p>
            <SchoolPrepAudioButton src={`${audioBase}/action-${step + 1}.mp3`} label="Послушать команду" className="mt-4" />
            <div className="mt-5 flex justify-center gap-1.5">
              {mission.actions.map((_, index) => <span key={index} className={`h-2 w-9 rounded-full ${index <= step ? "bg-brand-orange" : "bg-ink/8"}`} />)}
            </div>
            <button type="button" onClick={next} className="mt-5 inline-flex min-h-[50px] items-center justify-center rounded-full bg-ink px-7 py-3 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5">
              Выполнил! Дальше →
            </button>
          </>
        ) : (
          <div className="py-4"><div className="text-6xl">🌟</div><p className="mt-3 font-display text-2xl font-extrabold text-ink">Тело и внимание снова готовы!</p></div>
        )}
      </div>
      {finished && <ResultMessage state="success" success={mission.success} />}
    </>
  );
}

function MissionCard({ mission, index, done, onComplete, dayId }) {
  const audioBase = `/audio/school-prep/${dayId}/${mission.id}`;
  return (
    <article className={`rounded-[28px] border bg-white/88 p-5 shadow-card backdrop-blur-xl sm:p-7 ${
      done ? "border-brand-green/24" : "border-white/80"
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] text-sm font-black ${
            done ? "bg-brand-green text-white" : "bg-ink text-white"
          }`}>
            {done ? "✓" : index + 1}
          </span>
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-blue">{mission.skill}</p>
            <h4 className="mt-1 font-display text-xl font-extrabold tracking-[-0.02em] text-ink sm:text-2xl">{mission.title}</h4>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1.5 text-[11px] font-extrabold ${
          done ? "bg-brand-green/12 text-brand-green" : "bg-ink/6 text-ink/44"
        }`}>
          {done ? "Звезда получена" : "1 звезда"}
        </span>
      </div>
      <p className="mt-4 text-sm font-semibold leading-6 text-ink/62 sm:text-base">{mission.prompt}</p>
      <SchoolPrepAudioButton src={`${audioBase}/instruction.mp3`} className="mt-4" />

      {mission.type === "choice" && <ChoiceMission mission={mission} done={done} onComplete={onComplete} />}
      {mission.type === "sequence" && <SequenceMission mission={mission} done={done} onComplete={onComplete} />}
      {mission.type === "memory" && <MemoryMission mission={mission} done={done} onComplete={onComplete} />}
      {mission.type === "quiz" && <QuizMission mission={mission} done={done} onComplete={onComplete} audioBase={audioBase} />}
      {mission.type === "sort" && <SortMission mission={mission} done={done} onComplete={onComplete} />}
      {mission.type === "path" && <PathMission mission={mission} done={done} onComplete={onComplete} />}
      {mission.type === "action" && <ActionMission mission={mission} done={done} onComplete={onComplete} audioBase={audioBase} />}
    </article>
  );
}

export function SchoolPrepAdventure({ week, hasFullAccess = false }) {
  const [selectedDay, setSelectedDay] = useState(0);
  const [missionIndex, setMissionIndex] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
      if (Array.isArray(saved)) {
        setCompleted(saved);
        const firstOpen = week.days[0].missions.findIndex((mission) => !saved.includes(mission.id));
        setMissionIndex(firstOpen === -1 ? week.days[0].missions.length - 1 : firstOpen);
      }
    } catch {
      setCompleted([]);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
  }, [completed, ready]);

  const allMissionIds = useMemo(
    () => week.days.flatMap((day) => day.missions.map((mission) => mission.id)),
    [week.days],
  );
  const visibleProgressIds = hasFullAccess
    ? allMissionIds
    : week.days[0].missions.map((mission) => mission.id);
  const dayComplete = (day) => day.missions.every((mission) => completed.includes(mission.id));
  const unlocked = (index) => index === 0 || (hasFullAccess && dayComplete(week.days[index - 1]));
  const currentDay = week.days[selectedDay];
  const currentMission = currentDay.missions[missionIndex] ?? currentDay.missions[0];
  const currentMissionDone = completed.includes(currentMission.id);
  const completedToday = currentDay.missions.filter((mission) => completed.includes(mission.id)).length;
  const currentComplete = dayComplete(currentDay);
  const weekComplete = allMissionIds.every((id) => completed.includes(id));
  const visibleCompleted = completed.filter((id) => visibleProgressIds.includes(id)).length;
  const progress = Math.round((visibleCompleted / visibleProgressIds.length) * 100);

  function completeMission(id) {
    setCompleted((current) => (current.includes(id) ? current : [...current, id]));
  }

  function selectDay(index) {
    if (!unlocked(index)) return;
    const nextDay = week.days[index];
    const firstOpen = nextDay.missions.findIndex((mission) => !completed.includes(mission.id));
    setSelectedDay(index);
    setMissionIndex(firstOpen === -1 ? nextDay.missions.length - 1 : firstOpen);
    window.setTimeout(() => document.getElementById("school-prep-day")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  function missionIsUnlocked(index) {
    if (index === 0) return true;
    return completed.includes(currentDay.missions[index - 1].id);
  }

  function selectMission(index) {
    if (!missionIsUnlocked(index)) return;
    setMissionIndex(index);
    window.setTimeout(() => document.getElementById("school-prep-mission")?.scrollIntoView({ behavior: "smooth", block: "center" }), 40);
  }

  function nextMission() {
    if (missionIndex >= currentDay.missions.length - 1) return;
    setMissionIndex((current) => current + 1);
    window.setTimeout(() => document.getElementById("school-prep-mission")?.scrollIntoView({ behavior: "smooth", block: "center" }), 40);
  }

  function resetWeek() {
    if (!window.confirm("Начать первую неделю заново? Все полученные звёзды будут сброшены.")) return;
    setCompleted([]);
    setSelectedDay(0);
    setMissionIndex(0);
  }

  return (
    <div className="relative">
      <div className="rounded-[34px] border border-white/12 bg-[#111a35] p-5 text-white shadow-luxe sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-white/14 bg-white/8 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/72">
              {hasFullAccess ? "Неделя 1 · полный маршрут" : "День 1 · полноценный пробный маршрут"}
            </span>
            <h3 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.035em] sm:text-5xl">{week.title}</h3>
            <p className="mt-3 text-base font-medium leading-7 text-white/62">{week.subtitle}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {[
                ["5", "учебных дней"],
                ["125", "игровых шагов"],
                ["100–125", "минут практики"],
              ].map(([value, label]) => (
                <span key={label} className="inline-flex items-baseline gap-1.5 rounded-full border border-white/10 bg-white/[0.07] px-3 py-2 text-xs font-bold text-white/58">
                  <strong className="font-display text-base font-extrabold text-white">{value}</strong>
                  {label}
                </span>
              ))}
            </div>
          </div>
          <div className="min-w-[220px] rounded-[22px] border border-white/10 bg-white/8 p-4 backdrop-blur-xl">
            <div className="flex items-center justify-between text-xs font-extrabold text-white/60">
              <span>{hasFullAccess ? "Прогресс недели" : "Прогресс пробного дня"}</span>
              <span>{visibleCompleted} / {visibleProgressIds.length} ⭐</span>
            </div>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-5">
          {week.days.map((day, index) => {
            const isUnlocked = unlocked(index);
            const isDone = dayComplete(day);
            const active = selectedDay === index;
            return (
              <button
                key={day.id}
                type="button"
                disabled={!isUnlocked}
                onClick={() => selectDay(index)}
                className={`relative min-h-[190px] rounded-[22px] border p-3.5 text-left transition duration-250 ${
                  active
                    ? "border-white/30 bg-white/16 shadow-insetline"
                    : isUnlocked
                      ? "border-white/8 bg-white/[0.055] hover:-translate-y-1 hover:bg-white/10"
                      : "border-white/7 bg-white/[0.035]"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  {day.image ? (
                    <span className="relative h-11 w-14 overflow-hidden rounded-[13px] border border-white/14 bg-white/8">
                      <img
                        src={day.image}
                        alt=""
                        className={`h-full w-full object-cover ${isUnlocked ? "" : "opacity-55 saturate-50"}`}
                        style={{ objectPosition: day.imagePosition }}
                      />
                      {!isUnlocked && (
                        <span className="absolute inset-0 flex items-center justify-center bg-[#111a35]/30 text-base" aria-hidden="true">🔒</span>
                      )}
                    </span>
                  ) : (
                    <span className="flex h-11 w-14 items-center justify-center rounded-[13px] bg-white/7 text-2xl">{isUnlocked ? day.emoji : "🔒"}</span>
                  )}
                  {isDone && <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-green text-xs font-black">✓</span>}
                </div>
                <p className="mt-3 text-[10px] font-extrabold uppercase tracking-[0.13em] text-white/42">День {day.number}</p>
                <p className="mt-1 text-xs font-extrabold leading-5 text-white/88 sm:text-sm">{day.title}</p>
                <div className="mt-3 rounded-[15px] border border-white/8 bg-white/[0.07] px-3 py-2.5">
                  <div className="flex items-baseline gap-1.5">
                    <strong className="font-display text-[26px] font-extrabold leading-none tracking-[-0.045em] text-brand-cyan">{day.missions.length}</strong>
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-white/74">шагов</span>
                  </div>
                  <p className="mt-1 text-[9px] font-bold text-white/42">20–25 минут</p>
                </div>
                {!isUnlocked && <p className="mt-2 text-[9px] font-extrabold uppercase tracking-[0.08em] text-brand-cyan/80">Откроется в полном курсе</p>}
              </button>
            );
          })}
        </div>
      </div>

      <section id="school-prep-day" className="scroll-mt-28 mt-6">
        <div className={`relative overflow-hidden rounded-[32px] bg-gradient-to-br ${currentDay.color} p-6 text-white shadow-color sm:p-8`}>
          {currentDay.image && (
            <img
              src={currentDay.image}
              alt=""
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: currentDay.imagePosition }}
            />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0c1930]/95 via-[#11284a]/82 to-[#11284a]/36" />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/68">День {currentDay.number} · {currentDay.zone}</p>
              <h3 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl">{currentDay.title}</h3>
              <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-white/78">{currentDay.lead}</p>
            </div>
            <div className="min-w-[150px] rounded-[24px] border border-white/18 bg-[#0b1930]/48 p-4 shadow-insetline backdrop-blur-xl">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-white/52">Маршрут дня</p>
              <p className="mt-1 font-display text-2xl font-extrabold">{currentDay.missions.length} шагов</p>
              <p className="mt-1 text-xs font-bold text-white/62">20–25 минут</p>
            </div>
          </div>
          <div className="relative mt-6 rounded-[20px] border border-white/14 bg-white/12 px-4 py-3.5 text-sm font-bold leading-6 text-white/86 backdrop-blur-xl">
            <span className="mr-2">⚡</span>{currentDay.warmup}
          </div>
        </div>

        <div className="mt-5 rounded-[28px] border border-white/80 bg-white/82 p-5 shadow-card backdrop-blur-xl sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-blue">
                {currentMission.chapter ?? "Миссия дня " + (selectedDay + 1)}
              </p>
              <h4 className="mt-2 font-display text-2xl font-extrabold tracking-[-0.025em] text-ink">
                Шаг {missionIndex + 1} из {currentDay.missions.length}
              </h4>
              <p className="mt-1 text-sm font-semibold text-ink/48">
                {completedToday} выполнено · {currentDay.missions.length - completedToday} осталось
              </p>
            </div>
            <div className="w-full max-w-[300px]">
              <div className="h-2.5 overflow-hidden rounded-full bg-ink/7">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink transition-all duration-500"
                  style={{ width: Math.round((completedToday / currentDay.missions.length) * 100) + "%" }}
                />
              </div>
              <p className="mt-2 text-right text-[10px] font-extrabold uppercase tracking-[0.12em] text-ink/36">
                прогресс дня
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-8 gap-1.5 sm:grid-cols-12 lg:grid-cols-[repeat(25,minmax(0,1fr))]">
            {currentDay.missions.map((mission, index) => {
              const done = completed.includes(mission.id);
              const available = missionIsUnlocked(index);
              const active = index === missionIndex;
              return (
                <button
                  key={mission.id}
                  type="button"
                  disabled={!available}
                  onClick={() => selectMission(index)}
                  aria-label={"Открыть шаг " + (index + 1)}
                  className={"flex aspect-square min-h-8 items-center justify-center rounded-[10px] text-[10px] font-black transition " + (
                    active
                      ? "bg-ink text-white shadow-sm"
                      : done
                        ? "bg-brand-green/14 text-brand-green"
                        : available
                          ? "bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/18"
                          : "bg-ink/[0.035] text-ink/20"
                  )}
                >
                  {done ? "✓" : index + 1}
                </button>
              );
            })}
          </div>
        </div>

        <div id="school-prep-mission" className="scroll-mt-32 mt-5">
          <MissionCard
            key={currentMission.id}
            mission={currentMission}
            index={missionIndex}
            done={currentMissionDone}
            dayId={currentDay.id}
            onComplete={() => completeMission(currentMission.id)}
          />

          {currentMissionDone && missionIndex < currentDay.missions.length - 1 && (
            <div className="mt-4 flex justify-end">
              <button type="button" onClick={nextMission} className="primary-btn">
                Следующий шаг <span aria-hidden="true">→</span>
              </button>
            </div>
          )}
        </div>

        {currentComplete && (
          <div className="mt-5 overflow-hidden rounded-[28px] border border-brand-green/20 bg-gradient-to-br from-brand-green/[0.09] via-white to-brand-cyan/[0.08] p-6 shadow-card sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-green">Печать дня получена</p>
                <h4 className="mt-2 font-display text-2xl font-extrabold text-ink">Все {currentDay.missions.length} шагов выполнены!</h4>
                <p className="mt-2 max-w-xl text-sm font-medium leading-6 text-ink/58">
                  {!hasFullAccess && selectedDay === 0
                    ? "Пробный маршрут завершён. В полном курсе приключение продолжается в новых районах Города знаний."
                    : selectedDay < week.days.length - 1
                      ? "Открыт следующий район Города знаний."
                      : "Все районы пройдены — золотой ключ собран."}
                </p>
              </div>
              {!hasFullAccess && selectedDay === 0 ? (
                <a href="#program" className="primary-btn shrink-0">
                  Посмотреть полный маршрут →
                </a>
              ) : selectedDay < week.days.length - 1 && (
                <button type="button" onClick={() => selectDay(selectedDay + 1)} className="primary-btn shrink-0">
                  Открыть день {selectedDay + 2} →
                </button>
              )}
            </div>
          </div>
        )}

        <aside className="mt-5 grid gap-4 rounded-[28px] border border-white/80 bg-white/78 p-5 shadow-card backdrop-blur-xl sm:grid-cols-2 sm:p-7">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-purple">Что тренировали</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-ink/64">{currentDay.parentOutcome}</p>
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-orange">Продолжить без экрана</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-ink/64">{currentDay.offline}</p>
          </div>
        </aside>
      </section>

      {weekComplete && (
        <section className="mt-7 relative overflow-hidden rounded-[36px] bg-gradient-to-br from-[#14264c] via-[#463081] to-[#a63b87] p-7 text-center text-white shadow-luxe sm:p-10">
          <div className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 0 2px, transparent 3px), radial-gradient(circle at 78% 30%, white 0 2px, transparent 3px), radial-gradient(circle at 62% 76%, white 0 2px, transparent 3px)" }} />
          <div className="relative">
            <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-[30px] border border-white/18 bg-white/14 text-5xl shadow-insetline">🗝️</span>
            <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.2em] text-gold-300">Первая неделя завершена</p>
            <h3 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.035em] sm:text-5xl">Золотой ключ твой!</h3>
            <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-7 text-white/70">
              Ребёнок прошёл 125 миссий: слушал инструкцию, находил закономерности, работал со звуками и числами и учился пробовать снова.
            </p>
            <div className="mx-auto mt-7 inline-flex rounded-full border border-white/16 bg-white/10 px-5 py-3 text-sm font-extrabold">
              Награда: {week.reward} · 125 ⭐
            </div>
          </div>
        </section>
      )}

      {ready && completed.length > 0 && (
        <div className="mt-5 text-center">
          <button type="button" onClick={resetWeek} className="text-xs font-bold text-ink/38 underline decoration-ink/18 underline-offset-4 transition hover:text-ink/62">
            Сбросить прогресс первой недели
          </button>
        </div>
      )}
    </div>
  );
}
