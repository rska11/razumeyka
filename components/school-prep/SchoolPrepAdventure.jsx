"use client";

import { useEffect, useMemo, useState } from "react";
import { SchoolPrepAudioButton } from "./SchoolPrepAudioButton.jsx";
import { SchoolPrepAutoNarration } from "./SchoolPrepAutoNarration.jsx";
import { SchoolPrepScene, SchoolPrepShape, SchoolPrepVisual } from "./SchoolPrepVisual.jsx";
import { reachGoal } from "@/lib/metrika";

const WEEK_ONE_STORAGE_KEY = "razumeyka_school_prep_week1";

const toneClasses = {
  "text-brand-blue": "text-brand-blue",
  "text-brand-pink": "text-brand-pink",
  "text-brand-orange": "text-brand-orange",
  "text-brand-yellow": "text-brand-yellow",
  "text-brand-green": "text-brand-green",
  "text-brand-purple": "text-brand-purple",
};

const dayGradientClasses = {
  blue: "from-[#2467d8] via-[#1955a8] to-[#173b78]",
  pink: "from-[#d94d8c] via-[#a73f86] to-[#64377f]",
  orange: "from-[#f08a24] via-[#db5f2d] to-[#9d3b3b]",
  purple: "from-[#7654d8] via-[#5940ad] to-[#3b327c]",
  green: "from-[#32a66b] via-[#27865e] to-[#24624f]",
  cyan: "from-[#229db4] via-[#247ca6] to-[#285a86]",
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
      {option.pattern && (
        <span className="flex flex-wrap items-center justify-center gap-1.5">
          {option.pattern.map((item, index) => (
            item.visual
              ? <SchoolPrepVisual key={index} name={item.visual} compact />
              : <SchoolPrepShape key={index} shape={item.shape} color={item.color} size="small" />
          ))}
        </span>
      )}
      {option.visual && <SchoolPrepVisual name={option.visual} label={option.label} />}
      {option.shape && <SchoolPrepShape shape={option.shape} color={option.color} size={option.size} />}
      {option.emoji && <span className="text-5xl sm:text-6xl">{option.emoji}</span>}
      {option.symbol && (
        <span className={`text-5xl sm:text-6xl ${toneClasses[option.tone] ?? "text-ink"}`}>{option.symbol}</span>
      )}
      <span className="text-base font-extrabold leading-6 text-ink">{option.label}</span>
    </>
  );
}
function MissionPrompt({ mission }) {
  const { prompt, title, scene } = mission;
  if (scene) {
    return (
      <div className="mt-5 rounded-[26px] border border-brand-blue/10 bg-gradient-to-br from-brand-blue/[0.055] via-white to-brand-purple/[0.07] px-4 py-6 text-center sm:px-7 sm:py-8">
        <SchoolPrepScene scene={scene} />
        <p className="mx-auto mt-6 max-w-3xl text-lg font-extrabold leading-8 text-ink/78 sm:text-2xl sm:leading-9">{prompt}</p>
      </div>
    );
  }

  const visualPattern = /\p{Extended_Pictographic}/u;
  const introducesIskra = prompt.includes('🦊') && (prompt.includes('Искра') || title.includes('Искра'));
  if (!visualPattern.test(prompt)) {
    return <p className="mt-4 text-base font-semibold leading-7 text-ink/66 sm:text-lg sm:leading-8">{prompt}</p>;
  }

  const [leading, ...rest] = prompt.split('—');
  const instruction = rest.join('—').trim();
  const leadingIsVisual = rest.length > 0 && visualPattern.test(leading);

  if (leadingIsVisual) {
    return (
      <div className="mt-5 rounded-[24px] border border-brand-blue/10 bg-gradient-to-br from-brand-blue/[0.055] via-white to-brand-purple/[0.06] px-4 py-7 text-center sm:px-7 sm:py-9">
        {introducesIskra && <p className="mx-auto mb-5 inline-flex items-center rounded-full bg-brand-orange/10 px-4 py-2 text-sm font-extrabold text-brand-orange sm:text-base">Это лисёнок Искра</p>}
        <div className="whitespace-pre-wrap text-[68px] leading-none tracking-[0.12em] sm:text-[92px]" aria-label={leading.trim()}>{leading.trim()}</div>
        {instruction && <p className="mx-auto mt-6 max-w-2xl text-base font-extrabold leading-7 text-ink/68 sm:text-lg">{instruction}</p>}
      </div>
    );
  }

  return (
    <div className="mt-5 rounded-[24px] border border-brand-blue/10 bg-gradient-to-br from-brand-blue/[0.055] via-white to-brand-purple/[0.06] px-5 py-7 text-center sm:px-8">
      {introducesIskra && <p className="mx-auto mb-5 inline-flex items-center rounded-full bg-brand-orange/10 px-4 py-2 text-sm font-extrabold text-brand-orange sm:text-base">Это лисёнок Искра</p>}
      <p className="mx-auto max-w-3xl whitespace-pre-wrap text-xl font-extrabold leading-relaxed text-ink/76 sm:text-3xl">{prompt}</p>
    </div>
  );
}

function ChoiceMission({ mission, done, onComplete, onAttempt = () => {} }) {
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
      onAttempt({ correct: true });
      setResult("success");
      onComplete({ verified: true });
    } else {
      onAttempt({ correct: false, hint: true });
      setResult("hint");
    }
  }

  return (
    <>
      <div className={`mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 ${mission.options.length >= 7 ? "lg:grid-cols-4" : ""}`}>
        {mission.options.map((option) => {
          const active = selected.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => toggle(option.id)}
              className={`flex min-h-[142px] flex-col items-center justify-center gap-3 rounded-[22px] border px-3 py-5 text-center transition duration-200 ${
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

function RecallMission({ mission, done, onComplete, onAttempt = () => {} }) {
  const [studying, setStudying] = useState(!done);
  const [selected, setSelected] = useState(done ? mission.correct : []);
  const [result, setResult] = useState(done ? "success" : "");

  function choose(id) {
    setSelected([id]);
    setResult("");
  }

  function check() {
    if (sameAnswers(selected, mission.correct)) {
      onAttempt({ correct: true });
      setResult("success");
      onComplete({ verified: true });
    } else {
      onAttempt({ correct: false, hint: true });
      setResult("hint");
    }
  }

  return (
    <>
      {studying ? (
        <div className="mt-5 rounded-[26px] border border-brand-purple/16 bg-gradient-to-br from-brand-purple/[0.08] via-white to-brand-blue/[0.07] p-5 text-center sm:p-7">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-purple">Запомни, затем спрячь</p>
          <div className="mt-5 flex flex-wrap items-start justify-center gap-4 sm:gap-6">
            {mission.study.map((item, index) => (
              <div key={item.label} className="w-[116px]">
                <SchoolPrepVisual name={item.visual} label={item.label} />
                <p className="mt-3 text-sm font-extrabold leading-5 text-ink/72"><span className="text-brand-purple">{index + 1}.</span> {item.label}</p>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => { setStudying(false); setSelected([]); setResult(""); }} className="mt-6 inline-flex min-h-[52px] items-center justify-center rounded-full bg-ink px-7 py-3 text-sm font-extrabold text-white">
            Запомнил — скрыть код
          </button>
        </div>
      ) : (
        <>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {mission.options.map((option) => {
              const active = selected.includes(option.id);
              return (
                <button key={option.id} type="button" onClick={() => choose(option.id)} className={`flex min-h-[150px] flex-col items-center justify-center gap-3 rounded-[22px] border bg-white p-4 text-center transition ${active ? "border-brand-purple shadow-[0_0_0_3px_rgba(121,87,232,.1)]" : "border-ink/8 hover:-translate-y-0.5 hover:border-brand-purple/28"}`}>
                  <OptionContent option={option} />
                </button>
              );
            })}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" onClick={check} disabled={!selected.length} className="inline-flex min-h-[50px] items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-extrabold text-white disabled:opacity-35">Проверить код</button>
            <button type="button" onClick={() => { setStudying(true); setResult(""); }} className="inline-flex min-h-[50px] items-center justify-center rounded-full border border-ink/10 bg-white px-5 py-3 text-sm font-extrabold text-ink/60">Посмотреть ещё раз</button>
          </div>
        </>
      )}
      <ResultMessage state={result} success={mission.success} hint={mission.hint} />
    </>
  );
}
function SequenceMission({ mission, done, onComplete, onAttempt = () => {} }) {
  const [sequence, setSequence] = useState([]);
  const [result, setResult] = useState(done ? "success" : "");

  function add(id) {
    if (sequence.includes(id)) return;
    setResult("");
    setSequence((current) => [...current, id]);
  }

  function check() {
    if (sequence.length === mission.correct.length && sequence.every((id, index) => id === mission.correct[index])) {
      onAttempt({ correct: true });
      setResult("success");
      onComplete({ verified: true });
    } else {
      onAttempt({ correct: false, hint: true });
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
                <b className="text-brand-purple">{index + 1}</b>
                {option?.visual && <SchoolPrepVisual name={option.visual} compact />}
                {option?.shape && <SchoolPrepShape shape={option.shape} color={option.color} size="small" />}
                {option?.emoji} {option?.label}
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
              className="flex min-h-[132px] flex-col items-center justify-center gap-3 rounded-[20px] border border-ink/8 bg-white px-3 py-4 transition hover:-translate-y-0.5 hover:border-brand-purple/28 hover:shadow-card disabled:opacity-30"
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

function MemoryMission({ mission, done, onComplete, onAttempt = () => {} }) {
  const [open, setOpen] = useState([]);
  const [matched, setMatched] = useState(done ? [...new Set(mission.cards.map((card) => card.pair))] : []);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    if (open.length !== 2) return undefined;
    const [first, second] = open;
    const timer = window.setTimeout(() => {
      if (mission.cards[first].pair === mission.cards[second].pair) {
        onAttempt({ correct: true, subKey: mission.cards[first].pair });
        setMatched((current) => {
          const next = current.includes(mission.cards[first].pair)
            ? current
            : [...current, mission.cards[first].pair];
          if (next.length === new Set(mission.cards.map((card) => card.pair)).size) onComplete({ verified: true, moves });
          return next;
        });
      } else {
        onAttempt({ correct: false, hint: false, subKey: `move-${moves}` });
      }
      setOpen([]);
    }, 650);
    return () => window.clearTimeout(timer);
  }, [mission.cards, moves, onAttempt, onComplete, open]);

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
              {visible
                ? card.visual
                  ? <SchoolPrepVisual name={card.visual} label={card.label} compact />
                  : card.emoji
                : "?"}
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

function QuizMission({ mission, done, onComplete, audioBase, onAttempt = () => {} }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [result, setResult] = useState(done ? "success" : "");
  const [mistakenQuestions, setMistakenQuestions] = useState([]);
  const question = mission.questions[index];
  const last = index === mission.questions.length - 1;

  function answer(id) {
    setSelected(id);
    const correct = id === question.correct;
    onAttempt({ correct, hint: !correct, subKey: `question-${index + 1}` });
    if (!correct) {
      setMistakenQuestions((current) => current.includes(index) ? current : [...current, index]);
    }
    setResult(correct ? "question-success" : "hint");
  }

  function next() {
    if (selected !== question.correct) return;
    if (last) {
      setResult("success");
      onComplete({
        verified: true,
        quizTotal: mission.questions.length,
        quizFirstTry: mission.questions.length - mistakenQuestions.length,
      });
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
        {question.visual && <div className="mt-4 flex justify-center"><SchoolPrepVisual name={question.visual} label={question.prompt} /></div>}
        {question.scene && <div className="mt-4"><SchoolPrepScene scene={question.scene} /></div>}
        <p className="mt-3 font-display text-xl font-extrabold leading-tight text-ink sm:text-2xl">{question.prompt}</p>
        <SchoolPrepAudioButton src={`${audioBase}/question-${index + 1}.mp3`} label="Послушать вопрос" className="mt-4" />
        <div className="mt-4 grid gap-2">
          {question.options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => answer(option.id)}
              className={`flex min-h-[62px] items-center gap-3 rounded-[18px] border px-4 py-3 text-left text-base font-extrabold transition ${
                selected === option.id
                  ? option.id === question.correct
                    ? "border-brand-green/30 bg-brand-green/[0.08] text-forest-700"
                    : "border-brand-orange/30 bg-brand-orange/[0.08] text-ink"
                  : "border-ink/8 bg-white text-ink hover:border-brand-green/24"
              }`}
            >
              {option.visual && <SchoolPrepVisual name={option.visual} label={option.label} compact />}
              {option.shape && <SchoolPrepShape shape={option.shape} color={option.color} size="small" />}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {result === "hint" && (
        <ResultMessage state="hint" hint="Не спеши. Прочитай вопрос ещё раз и попробуй другой ответ." />
      )}
      {result === "question-success" && (
        <div className="mt-4 rounded-[18px] border border-brand-green/20 bg-brand-green/[0.07] px-4 py-3 text-sm font-bold text-forest-700">
          ⭐ Верно: {question.options.find((option) => option.id === question.correct)?.label}. {last ? "Проверка завершена." : "Идём дальше."}
        </div>
      )}
      {result === "success" && <ResultMessage state="success" success={mistakenQuestions.length === 0
        ? `Отличный результат: ${mission.questions.length} из ${mission.questions.length} с первой попытки.`
        : `Проверка завершена: ${mission.questions.length - mistakenQuestions.length} из ${mission.questions.length} с первой попытки. Ошибки сохранены в отчёте — это подсказка, что потренировать.`} />}
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

function SortMission({ mission, done, onComplete, onAttempt = () => {} }) {
  const [itemIndex, setItemIndex] = useState(done ? mission.items.length : 0);
  const [result, setResult] = useState(done ? "success" : "");
  const current = mission.items[itemIndex];

  function place(groupId) {
    if (!current) return;
    if (current.group !== groupId) {
      onAttempt({ correct: false, hint: true, subKey: `item-${itemIndex + 1}` });
      setResult("hint");
      return;
    }
    onAttempt({ correct: true, subKey: `item-${itemIndex + 1}` });
    const next = itemIndex + 1;
    if (next === mission.items.length) {
      setItemIndex(next);
      setResult("success");
      onComplete({ verified: true });
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
            {current.visual
              ? <SchoolPrepVisual name={current.visual} label={current.label} />
              : <span className="text-6xl" aria-hidden="true">{current.emoji}</span>}
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
              {group.visual
                ? <SchoolPrepVisual name={group.visual} label={group.label} compact />
                : <span className="text-3xl">{group.emoji}</span>}
              {group.label}
            </button>
          ))}
        </div>
      )}
      <ResultMessage state={result} success={mission.success} hint={mission.hint} />
    </>
  );
}

function PathMission({ mission, done, onComplete, onAttempt = () => {} }) {
  const checkpointKeys = (mission.checkpoints || []).map(([row, col]) => `${row}-${col}`);
  const [position, setPosition] = useState(done ? mission.goal : mission.start);
  const [visited, setVisited] = useState(done ? checkpointKeys : []);
  const [result, setResult] = useState(done ? "success" : "");
  const blocked = new Set(mission.blocked.map(([row, col]) => `${row}-${col}`));

  function move(rowDelta, colDelta) {
    const next = [position[0] + rowDelta, position[1] + colDelta];
    const nextKey = `${next[0]}-${next[1]}`;
    const outside = next[0] < 0 || next[0] >= mission.rows || next[1] < 0 || next[1] >= mission.cols;
    if (outside || blocked.has(nextKey)) {
      onAttempt({ correct: false, hint: true });
      setResult("hint");
      return;
    }

    const nextVisited = checkpointKeys.includes(nextKey) && !visited.includes(nextKey)
      ? [...visited, nextKey]
      : visited;
    setVisited(nextVisited);
    setPosition(next);

    if (next[0] === mission.goal[0] && next[1] === mission.goal[1]) {
      if (checkpointKeys.every((key) => nextVisited.includes(key))) {
        setResult("success");
        onAttempt({ correct: true });
        onComplete({ verified: true });
      } else {
        onAttempt({ correct: false, hint: true });
        setResult("hint");
      }
    } else {
      setResult("");
    }
  }

  function restart() {
    setPosition(mission.start);
    setVisited([]);
    setResult("");
  }

  return (
    <>
      <div className="mt-5 rounded-[26px] border border-brand-purple/16 bg-brand-purple/[0.035] p-4 sm:p-6">
        {checkpointKeys.length > 0 && (
          <div className="mb-4 flex items-center justify-between gap-3 rounded-[18px] border border-brand-purple/12 bg-white px-4 py-3 text-sm font-extrabold text-ink/64">
            <span>Сначала компас, затем ключ</span>
            <span className={visited.length === checkpointKeys.length ? "text-brand-green" : "text-brand-purple"}>{visited.length} / {checkpointKeys.length} точка</span>
          </div>
        )}
        <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="mx-auto grid w-full max-w-[500px] gap-2.5" style={{ gridTemplateColumns: `repeat(${mission.cols}, minmax(0, 1fr))` }}>
            {Array.from({ length: mission.rows * mission.cols }, (_, index) => {
              const row = Math.floor(index / mission.cols);
              const col = index % mission.cols;
              const key = `${row}-${col}`;
              const explorer = position[0] === row && position[1] === col;
              const goal = mission.goal[0] === row && mission.goal[1] === col;
              const checkpoint = checkpointKeys.includes(key);
              const checkpointVisited = visited.includes(key);
              return (
                <div key={key} className={`grid aspect-square min-h-[58px] place-items-center rounded-[17px] border sm:min-h-[74px] ${blocked.has(key) ? "border-ink/5 bg-ink/8" : goal ? "border-brand-yellow/30 bg-brand-yellow/14" : checkpoint ? "border-brand-purple/22 bg-brand-purple/[0.08]" : "border-white bg-white shadow-sm"}`}>
                  {explorer
                    ? <SchoolPrepVisual name="explorer" label="Исследователь" compact />
                    : blocked.has(key)
                      ? <SchoolPrepVisual name="tree" label="Препятствие" compact />
                      : goal
                        ? <SchoolPrepVisual name={mission.goalVisual || "key"} label="Цель маршрута" compact />
                        : checkpoint && !checkpointVisited
                          ? <SchoolPrepVisual name="compass" label="Контрольная точка" compact />
                          : checkpointVisited
                            ? <span className="text-2xl font-black text-brand-green">✓</span>
                            : ""}
                </div>
              );
            })}
          </div>
          <div className="mx-auto grid grid-cols-3 gap-2.5">
            <span />
            <button type="button" aria-label="Вверх" onClick={() => move(-1, 0)} className="grid h-14 w-14 place-items-center rounded-[17px] bg-ink text-2xl font-black text-white">↑</button>
            <span />
            <button type="button" aria-label="Влево" onClick={() => move(0, -1)} className="grid h-14 w-14 place-items-center rounded-[17px] bg-ink text-2xl font-black text-white">←</button>
            <button type="button" aria-label="Начать маршрут заново" onClick={restart} className="grid h-14 w-14 place-items-center rounded-[17px] border border-ink/10 bg-white text-xl">↻</button>
            <button type="button" aria-label="Вправо" onClick={() => move(0, 1)} className="grid h-14 w-14 place-items-center rounded-[17px] bg-ink text-2xl font-black text-white">→</button>
            <span />
            <button type="button" aria-label="Вниз" onClick={() => move(1, 0)} className="grid h-14 w-14 place-items-center rounded-[17px] bg-ink text-2xl font-black text-white">↓</button>
            <span />
          </div>
        </div>
      </div>
      <ResultMessage state={result} success={mission.success} hint={mission.hint} />
    </>
  );
}

function QuantityBoardMission({ mission, done, onComplete, onAttempt = () => {} }) {
  const [count, setCount] = useState(done ? mission.target : 0);
  const [result, setResult] = useState(done ? "success" : "");

  function check() {
    const correct = count === mission.target;
    onAttempt({ correct, hint: !correct });
    setResult(correct ? "success" : "hint");
    if (correct) onComplete({ verified: true });
  }

  return (
    <>
      <div className="mt-5 rounded-[26px] border border-brand-orange/18 bg-gradient-to-br from-brand-orange/[0.08] via-white to-brand-yellow/[0.08] p-5 sm:p-7">
        <p className="text-center text-xs font-extrabold uppercase tracking-[0.15em] text-brand-orange">Счётное поле · нажимай по одному</p>
        <div className="mx-auto mt-5 grid max-w-xl grid-cols-5 gap-3">
          {Array.from({ length: mission.max }, (_, index) => {
            const active = index < count;
            return (
              <button key={index} type="button" onClick={() => { setCount(index + 1); setResult(""); }} className={`grid aspect-square place-items-center rounded-[18px] border text-3xl transition ${active ? "border-brand-orange/30 bg-brand-orange/12 shadow-sm" : "border-ink/8 bg-white text-ink/18"}`} aria-label={`Отметить ${index + 1} предметов`}>
                {active ? mission.itemEmoji : '·'}
              </button>
            );
          })}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={() => { setCount(Math.max(0, count - 1)); setResult(""); }} className="grid h-12 w-12 place-items-center rounded-full border border-ink/10 bg-white text-xl font-black">−</button>
          <span className="min-w-[130px] text-center font-display text-2xl font-extrabold text-ink">Насчитано: {count}</span>
          <button type="button" onClick={() => { setCount(Math.min(mission.max, count + 1)); setResult(""); }} className="grid h-12 w-12 place-items-center rounded-full border border-ink/10 bg-white text-xl font-black">+</button>
        </div>
      </div>
      <button type="button" onClick={check} className="mt-5 inline-flex min-h-[50px] items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-extrabold text-white">Проверить количество</button>
      <ResultMessage state={result} success={`Верно! Ты отметил ровно ${mission.target} предметов: последнее названное число показывает всё количество.`} hint="Касайся каждого предмета один раз и называй числа по порядку." />
    </>
  );
}

function PartWholeMission({ mission, done, onComplete, onAttempt = () => {} }) {
  const [part, setPart] = useState(done ? mission.correctPart : 0);
  const [result, setResult] = useState(done ? "success" : "");

  function check() {
    const correct = part === mission.correctPart;
    onAttempt({ correct, hint: !correct });
    setResult(correct ? "success" : "hint");
    if (correct) onComplete({ verified: true });
  }

  return (
    <>
      <div className="mt-5 rounded-[26px] border border-brand-green/18 bg-brand-green/[0.045] p-5 sm:p-7">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-brand-green">Числовой домик</p>
          <div className="mt-4 rounded-[22px] bg-ink p-4 text-white"><span className="text-xs font-bold text-white/60">Целое</span><strong className="mt-1 block font-display text-4xl">{mission.total}</strong></div>
          <div className="mx-auto h-7 w-px bg-ink/16" />
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-[22px] border border-brand-green/20 bg-white p-4"><span className="text-xs font-bold text-ink/46">Известная часть</span><strong className="mt-1 block text-3xl text-ink">{mission.known}</strong><div className="mt-2 text-2xl">{mission.itemEmoji.repeat(mission.known)}</div></div>
            <div className="rounded-[22px] border border-brand-orange/20 bg-white p-4"><span className="text-xs font-bold text-ink/46">Найди часть</span><strong className="mt-1 block text-3xl text-brand-orange">{part}</strong><div className="mt-3 flex justify-center gap-2"><button type="button" onClick={() => { setPart(Math.max(0, part - 1)); setResult(""); }} className="h-10 w-10 rounded-full bg-ink text-white">−</button><button type="button" onClick={() => { setPart(Math.min(mission.total, part + 1)); setResult(""); }} className="h-10 w-10 rounded-full bg-ink text-white">+</button></div></div>
          </div>
        </div>
      </div>
      <button type="button" onClick={check} className="mt-5 inline-flex min-h-[50px] items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-extrabold text-white">Собрать целое</button>
      <ResultMessage state={result} success={`Верно! ${mission.known} и ${mission.correctPart} вместе составляют ${mission.total}.`} hint={`Покажи все ${mission.total} предметов и убери известные ${mission.known}. Пересчитай остаток.`} />
    </>
  );
}

function MathBalanceMission({ mission, done, onComplete, onAttempt = () => {} }) {
  const [selected, setSelected] = useState(done ? mission.correctRelation : '');
  const [result, setResult] = useState(done ? "success" : "");
  const relations = [{ id: 'more', label: 'Слева больше', symbol: '>' }, { id: 'equal', label: 'Поровну', symbol: '=' }, { id: 'less', label: 'Слева меньше', symbol: '<' }];

  function check() {
    const correct = selected === mission.correctRelation;
    onAttempt({ correct, hint: !correct });
    setResult(correct ? "success" : "hint");
    if (correct) onComplete({ verified: true });
  }

  return (
    <>
      <div className="mt-5 rounded-[26px] border border-brand-blue/16 bg-gradient-to-br from-brand-blue/[0.06] to-brand-cyan/[0.08] p-5 sm:p-7">
        <p className="text-center text-xs font-extrabold uppercase tracking-[0.15em] text-brand-blue">Математические весы · составь пары</p>
        <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-end gap-3 text-center">
          <div className="rounded-[22px] bg-white p-4 shadow-sm"><div className="flex min-h-24 flex-wrap content-center justify-center gap-2 text-3xl">{Array.from({ length: mission.left }, (_, i) => <span key={i}>{mission.itemEmoji}</span>)}</div><strong className="mt-3 block text-2xl">{mission.left}</strong></div>
          <span className="pb-10 text-4xl">⚖️</span>
          <div className="rounded-[22px] bg-white p-4 shadow-sm"><div className="flex min-h-24 flex-wrap content-center justify-center gap-2 text-3xl">{Array.from({ length: mission.right }, (_, i) => <span key={i}>{mission.itemEmoji}</span>)}</div><strong className="mt-3 block text-2xl">{mission.right}</strong></div>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">{relations.map((relation) => <button key={relation.id} type="button" onClick={() => { setSelected(relation.id); setResult(""); }} className={`rounded-[18px] border px-4 py-3 text-sm font-extrabold ${selected === relation.id ? 'border-brand-blue bg-brand-blue/10' : 'border-ink/8 bg-white'}`}><span className="mr-2 text-xl">{relation.symbol}</span>{relation.label}</button>)}</div>
      </div>
      <button type="button" disabled={!selected} onClick={check} className="mt-5 inline-flex min-h-[50px] items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-extrabold text-white disabled:opacity-35">Проверить весы</button>
      <ResultMessage state={result} success={`Верно! ${mission.left} больше ${mission.right} на ${mission.left - mission.right}: после составления пар слева остались лишние предметы.`} hint="Соединяй по одному предмету слева и справа. Где останутся предметы без пары?" />
    </>
  );
}

function NumberLineMission({ mission, done, onComplete, onAttempt = () => {} }) {
  const [position, setPosition] = useState(done ? mission.target : mission.start);
  const [moves, setMoves] = useState(0);
  const [result, setResult] = useState(done ? "success" : "");

  function move(delta) {
    setPosition((current) => Math.max(mission.min, Math.min(mission.max, current + delta)));
    setMoves((current) => current + 1);
    setResult("");
  }
  function check() {
    const correct = position === mission.target;
    onAttempt({ correct, hint: !correct });
    setResult(correct ? "success" : "hint");
    if (correct) onComplete({ verified: true, moves });
  }

  return (
    <>
      <div className="mt-5 rounded-[26px] border border-brand-purple/16 bg-brand-purple/[0.045] p-5 sm:p-7">
        <p className="text-center text-xs font-extrabold uppercase tracking-[0.15em] text-brand-purple">Числовая дорожка</p>
        <div className="mt-7 flex items-end justify-between gap-1">{Array.from({ length: mission.max - mission.min + 1 }, (_, index) => { const number = mission.min + index; const active = number === position; return <div key={number} className="flex min-w-0 flex-1 flex-col items-center"><span className="mb-2 h-8 text-2xl">{active ? '🦊' : ''}</span><span className={`grid h-9 w-full max-w-10 place-items-center rounded-full text-sm font-black ${active ? 'bg-brand-purple text-white' : 'bg-white text-ink/55'}`}>{number}</span><span className="mt-2 h-1 w-full bg-ink/10" /></div>; })}</div>
        <div className="mt-5 flex items-center justify-center gap-3"><button type="button" onClick={() => move(-1)} className="rounded-full bg-ink px-5 py-3 text-sm font-extrabold text-white">← шаг назад</button><button type="button" onClick={() => move(1)} className="rounded-full bg-ink px-5 py-3 text-sm font-extrabold text-white">шаг вперёд →</button></div>
      </div>
      <button type="button" onClick={check} className="mt-5 inline-flex min-h-[50px] items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-extrabold text-white">Проверить остановку</button>
      <ResultMessage state={result} success={`Верно! От ${mission.start} два шага вперёд: ${mission.start + 1}, ${mission.target}. Ответ — ${mission.target}.`} hint={`Вернись к ${mission.start} и сделай ровно два шага вперёд, называя каждую остановку.`} />
    </>
  );
}

function AttentionGridMission({ mission, done, onComplete, onAttempt = () => {} }) {
  const [selected, setSelected] = useState(done ? mission.correct : []);
  const [result, setResult] = useState(done ? 'success' : '');

  function toggle(id) {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    setResult('');
  }
  function check() {
    const correct = sameAnswers(selected, mission.correct);
    onAttempt({ correct, hint: !correct });
    setResult(correct ? 'success' : 'hint');
    if (correct) onComplete({ verified: true });
  }

  return (
    <>
      <div className="mt-5 rounded-[26px] border border-brand-purple/16 bg-gradient-to-br from-brand-purple/[0.055] to-brand-blue/[0.05] p-4 sm:p-6">
        <p className="text-center text-xs font-extrabold uppercase tracking-[0.15em] text-brand-purple">Поисковое поле · двигайся по клеткам по порядку</p>
        <div className="mx-auto mt-5 grid max-w-2xl grid-cols-3 gap-2.5 sm:grid-cols-4">
          {mission.cells.map((cell) => {
            const active = selected.includes(cell.id);
            return <button key={cell.id} type="button" onClick={() => toggle(cell.id)} aria-label={cell.label} className={`grid min-h-[92px] place-items-center rounded-[18px] border text-4xl font-black transition sm:min-h-[108px] sm:text-5xl ${active ? 'border-brand-purple bg-white shadow-[0_0_0_3px_rgba(121,87,232,.1)]' : 'border-white bg-white/80 hover:-translate-y-0.5 hover:border-brand-purple/25'}`}><span className={toneClasses[cell.tone] ?? 'text-ink'}>{cell.symbol}</span></button>;
          })}
        </div>
      </div>
      <button type="button" onClick={check} disabled={!selected.length} className="mt-5 inline-flex min-h-[50px] items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-extrabold text-white disabled:opacity-35">Проверить поле</button>
      <ResultMessage state={result} success={mission.success} hint={mission.hint} />
    </>
  );
}

function GoNoGoMission({ mission, done, onComplete, onAttempt = () => {}, audioBase }) {
  const [index, setIndex] = useState(done ? mission.cues.length : 0);
  const [result, setResult] = useState(done ? 'success' : '');
  const cue = mission.cues[index];

  function answer(tapped) {
    if (!cue) return;
    const correct = tapped === cue.shouldTap;
    onAttempt({ correct, hint: !correct, subKey: `cue-${index + 1}` });
    if (!correct) {
      setResult('hint');
      return;
    }
    const next = index + 1;
    setIndex(next);
    setResult(next === mission.cues.length ? 'success' : '');
    if (next === mission.cues.length) onComplete({ verified: true, seriesTotal: mission.cues.length });
  }

  return (
    <>
      <div className="mt-5 overflow-hidden rounded-[26px] border border-brand-cyan/18 bg-gradient-to-br from-brand-cyan/[0.08] via-white to-brand-purple/[0.06] p-5 text-center sm:p-7">
        <div className="flex gap-1.5">{mission.cues.map((_, cueIndex) => <span key={cueIndex} className={`h-2 flex-1 rounded-full ${cueIndex < index ? 'bg-brand-green' : cueIndex === index ? 'bg-brand-cyan' : 'bg-ink/8'}`} />)}</div>
        {cue ? <><p className="mt-5 text-xs font-extrabold uppercase tracking-[0.15em] text-brand-cyan">Сигнал {index + 1} из {mission.cues.length}</p><div className="mt-4 text-7xl" aria-label={cue.label}>{cue.symbol}</div><p className="mt-3 font-display text-2xl font-extrabold text-ink">{cue.label}</p><SchoolPrepAudioButton src={`${audioBase}/cue-${index + 1}.mp3`} label="Послушать сигнал" className="mt-4" /><div className="mt-5 grid grid-cols-2 gap-3"><button type="button" onClick={() => answer(true)} className="min-h-[62px] rounded-[18px] bg-brand-green px-5 py-3 text-base font-extrabold text-white">Лови!</button><button type="button" onClick={() => answer(false)} className="min-h-[62px] rounded-[18px] bg-ink px-5 py-3 text-base font-extrabold text-white">Пропусти</button></div></> : <div className="py-7 text-6xl">🎯</div>}
      </div>
      <ResultMessage state={result} success={mission.success} hint={mission.hint} />
    </>
  );
}

function RuleSwitchMission({ mission, done, onComplete, onAttempt = () => {}, audioBase }) {
  const [index, setIndex] = useState(done ? mission.rounds.length : 0);
  const [selected, setSelected] = useState('');
  const [result, setResult] = useState(done ? 'success' : '');
  const round = mission.rounds[index];

  function answer(id) {
    if (!round) return;
    const correct = id === round.correct;
    setSelected(id);
    onAttempt({ correct, hint: !correct, subKey: `round-${index + 1}` });
    setResult(correct ? 'question-success' : 'hint');
  }
  function next() {
    if (!round || selected !== round.correct) return;
    const nextIndex = index + 1;
    setIndex(nextIndex);
    setSelected('');
    setResult(nextIndex === mission.rounds.length ? 'success' : '');
    if (nextIndex === mission.rounds.length) onComplete({ verified: true, switchRounds: mission.rounds.length });
  }

  return (
    <>
      <div className="mt-5 rounded-[26px] border border-brand-orange/18 bg-gradient-to-br from-brand-orange/[0.07] via-white to-brand-purple/[0.05] p-5 sm:p-7">
        <div className="flex gap-1.5">{mission.rounds.map((_, roundIndex) => <span key={roundIndex} className={`h-2 flex-1 rounded-full ${roundIndex < index ? 'bg-brand-green' : roundIndex === index ? 'bg-brand-orange' : 'bg-ink/8'}`} />)}</div>
        {round ? <><div className="mt-5 rounded-[18px] bg-ink px-4 py-3 text-center text-sm font-extrabold text-white">Новое правило: {round.rule}</div><p className="mt-5 text-center font-display text-3xl font-extrabold text-ink">{round.stimulus}</p><SchoolPrepAudioButton src={`${audioBase}/round-${index + 1}.mp3`} label="Послушать правило" className="mx-auto mt-4" /><div className="mt-5 grid gap-2 sm:grid-cols-3">{round.options.map((option) => <button key={option.id} type="button" onClick={() => answer(option.id)} className={`min-h-[58px] rounded-[17px] border px-4 py-3 text-sm font-extrabold ${selected === option.id ? option.id === round.correct ? 'border-brand-green/30 bg-brand-green/10' : 'border-brand-orange/30 bg-brand-orange/10' : 'border-ink/8 bg-white'}`}>{option.label}</button>)}</div>{selected === round.correct && <button type="button" onClick={next} className="mt-4 inline-flex min-h-[48px] items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-extrabold text-white">{index === mission.rounds.length - 1 ? 'Завершить серию' : 'Новое правило →'}</button>}</> : <div className="py-7 text-center text-6xl">🔄</div>}
      </div>
      {result === 'hint' && <ResultMessage state="hint" hint={mission.hint} />}
      {result === 'question-success' && <ResultMessage state="success" success={`Верно! Ты применил правило «${round?.rule}».`} />}
      {result === 'success' && <ResultMessage state="success" success={mission.success} />}
    </>
  );
}

function TraceLineMission({ mission, done, onComplete, onAttempt = () => {} }) {
  const [step, setStep] = useState(done ? mission.points.length : 0);
  const [result, setResult] = useState(done ? "success" : "");
  const points = mission.points;
  const completedPoints = points.slice(0, step);
  const linePoints = completedPoints.map(([x, y]) => `${x},${y}`).join(" ");

  function selectPoint(index) {
    if (index !== step || done) {
      if (!done) {
        onAttempt({ correct: false, hint: true });
        setResult("hint");
      }
      return;
    }
    const nextStep = step + 1;
    setStep(nextStep);
    setResult("");
    if (nextStep === points.length) {
      onAttempt({ correct: true, hint: false });
      setResult("success");
      onComplete({ verified: true, checkpoints: points.length });
    }
  }

  function restart() {
    setStep(0);
    setResult("");
  }

  return (
    <>
      <div className="mt-5 rounded-[26px] border border-brand-pink/18 bg-gradient-to-br from-brand-pink/[0.07] via-white to-brand-cyan/[0.08] p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-brand-pink">Дорожка для руки · веди по порядку</p>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-ink/55">{Math.min(step, points.length)} / {points.length}</span>
        </div>
        <div className="relative mx-auto mt-4 aspect-[5/3] w-full max-w-2xl overflow-hidden rounded-[22px] border border-ink/8 bg-[radial-gradient(circle_at_center,rgba(20,36,61,0.07)_1px,transparent_1.5px)] bg-[length:22px_22px]">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 60" aria-hidden="true">
            <polyline points={points.map(([x, y]) => `${x},${y}`).join(" ")} fill="none" stroke="rgba(20,36,61,.12)" strokeWidth="2.2" strokeDasharray="3 3" strokeLinecap="round" strokeLinejoin="round" />
            {linePoints && <polyline points={linePoints} fill="none" stroke="rgb(236 72 153)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />}
          </svg>
          {points.map(([x, y], index) => {
            const reached = index < step;
            const next = index === step;
            return <button key={`${x}-${y}-${index}`} type="button" aria-label={`Точка ${index + 1}`} onClick={() => selectPoint(index)} style={{ left: `${x}%`, top: `${(y / 60) * 100}%` }} className={`absolute grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 text-xs font-black shadow-sm transition sm:h-11 sm:w-11 ${reached ? "border-brand-green bg-brand-green text-white" : next ? "scale-110 border-brand-pink bg-white text-brand-pink ring-4 ring-brand-pink/12" : "border-ink/12 bg-white text-ink/35"}`}>{reached ? "✓" : index + 1}</button>;
          })}
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 text-sm font-bold text-ink/55"><span>Начинай с 1 и не перепрыгивай точки.</span><button type="button" onClick={restart} className="rounded-full border border-ink/10 bg-white px-4 py-2 text-ink">Начать заново</button></div>
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
    if (nextStep === mission.actions.length) onComplete({ verified: false });
  }

  return (
    <>
      <div className="mt-5 overflow-hidden rounded-[24px] border border-brand-orange/18 bg-gradient-to-br from-brand-orange/[0.1] via-white to-brand-yellow/[0.08] p-5 text-center sm:p-7">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-orange">Перерыв-игра · встаём со стула</p>
        {!finished ? (
          <>
            <div className="mt-5 flex justify-center">
              {action.visual
                ? <SchoolPrepVisual name={action.visual} label={action.title} />
                : <span className="text-7xl" aria-hidden="true">{action.emoji}</span>}
            </div>
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

function WorkedExample({ example }) {
  if (!example) return null;
  return (
    <div className="mt-5 rounded-[28px] border border-brand-cyan/20 bg-gradient-to-br from-brand-cyan/[0.08] via-white to-brand-blue/[0.07] p-5 shadow-card sm:p-7">
      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-blue">Сначала учимся вместе · без оценки</p>
      <h4 className="mt-2 font-display text-2xl font-extrabold text-ink">{example.title}</h4>
      <p className="mt-3 rounded-[18px] bg-white px-4 py-3 text-base font-extrabold leading-7 text-ink/72">{example.task}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">{example.steps.map((step, index) => <div key={step} className="rounded-[18px] border border-ink/7 bg-white p-4 text-sm font-semibold leading-6 text-ink/62"><span className="mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-brand-blue text-xs font-black text-white">{index + 1}</span>{step}</div>)}</div>
      <p className="mt-4 rounded-[18px] border border-brand-green/18 bg-brand-green/[0.07] px-4 py-3 text-sm font-extrabold leading-6 text-forest-700">⭐ {example.answer}</p>
    </div>
  );
}

function ParentProgressReport({ day, learningData, completed, coreComplete }) {
  const coreMissions = day.missions.filter((mission) => mission.route !== 'bonus');
  const records = coreMissions.map((mission) => ({ mission, record: learningData.missions?.[mission.id] })).filter(({ record }) => record?.completedAt);
  const evaluated = records.filter(({ record }) => record.verified !== false && record.attempts > 0);
  const attempts = evaluated.reduce((sum, { record }) => sum + record.attempts, 0);
  const correct = evaluated.reduce((sum, { record }) => sum + record.correctAttempts, 0);
  const firstTry = evaluated.filter(({ record }) => record.errors === 0).length;
  const seconds = records.reduce((sum, { record }) => sum + (record.elapsedSeconds || 0), 0);
  const weak = evaluated.filter(({ record }) => record.errors > 0 || record.hints > 0).sort((a, b) => (b.record.errors + b.record.hints) - (a.record.errors + a.record.hints)).slice(0, 2);
  const strong = evaluated.filter(({ record }) => record.errors === 0).slice(0, 3);
  const diagnosticRecord = records.find(({ mission, record }) => mission.type === 'quiz' && record.quizTotal);
  const accuracy = attempts ? Math.round((correct / attempts) * 100) : null;
  const doneCore = coreMissions.filter((mission) => completed.includes(mission.id)).length;

  return (
    <aside className="mt-5 rounded-[28px] border border-white/80 bg-white/82 p-5 shadow-card backdrop-blur-xl sm:p-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-purple">Отчёт для родителя · по реальному выполнению</p><h4 className="mt-2 font-display text-2xl font-extrabold text-ink">{coreComplete ? 'Основной маршрут дня завершён' : `Выполнено ${doneCore} из ${coreMissions.length}`}</h4></div>
        {records.length > 0 && <span className="rounded-full bg-brand-green/10 px-4 py-2 text-xs font-extrabold text-brand-green">Данные сохранены на этом устройстве</span>}
      </div>
      {records.length === 0 ? (
        <p className="mt-4 text-sm font-semibold leading-6 text-ink/58">После первых заданий здесь появятся попытки, подсказки, время и навыки, которые стоит закрепить.</p>
      ) : (
        <>
          <div className={`mt-5 grid grid-cols-2 gap-3 ${diagnosticRecord ? 'lg:grid-cols-5' : 'lg:grid-cols-4'}`}>
            {[[`${doneCore}/${coreMissions.length}`, 'основных миссий'], [accuracy === null ? '—' : `${accuracy}%`, 'точность попыток'], [evaluated.length ? `${firstTry}/${evaluated.length}` : '—', 'миссий без ошибок'], ...(diagnosticRecord ? [[`${diagnosticRecord.record.quizFirstTry}/${diagnosticRecord.record.quizTotal}`, 'диагностика с первой попытки']] : []), [seconds ? `${Math.max(1, Math.round(seconds / 60))} мин` : '—', 'активной работы']].map(([value, label]) => <div key={label} className="rounded-[18px] bg-ink/[0.035] p-4"><strong className="font-display text-2xl font-extrabold text-ink">{value}</strong><p className="mt-1 text-xs font-bold text-ink/44">{label}</p></div>)}
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="rounded-[20px] border border-brand-green/15 bg-brand-green/[0.055] p-4"><p className="text-xs font-extrabold uppercase tracking-[0.13em] text-brand-green">Получается уверенно</p><p className="mt-2 text-sm font-semibold leading-6 text-ink/64">{strong.length ? strong.map(({ mission }) => mission.skill).join(' · ') : 'Пока собираем данные — важнее спокойное понимание, чем скорость.'}</p></div>
            <div className="rounded-[20px] border border-brand-orange/15 bg-brand-orange/[0.055] p-4"><p className="text-xs font-extrabold uppercase tracking-[0.13em] text-brand-orange">Что закрепить</p><p className="mt-2 text-sm font-semibold leading-6 text-ink/64">{weak.length ? weak.map(({ mission }) => mission.skill).join(' · ') : 'Явных затруднений пока не обнаружено.'}</p></div>
          </div>
        </>
      )}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-blue">Цель дня</p><p className="mt-2 text-sm font-semibold leading-6 text-ink/64">{day.parentOutcome}</p></div>
        <div><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-orange">Практика на 3 минуты</p><p className="mt-2 text-sm font-semibold leading-6 text-ink/64">{weak.length ? day.practiceTip : day.offline}</p></div>
      </div>
    </aside>
  );
}

function MissionCard({ mission, index, done, onComplete, onAttempt, dayId, adaptive, learnerLevel, day }) {
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
          done ? "bg-brand-green/12 text-brand-green" : mission.route === 'bonus' ? "bg-brand-purple/10 text-brand-purple" : "bg-ink/6 text-ink/44"
        }`}>
          {done ? "Звезда получена" : mission.route === 'bonus' ? "Бонусная мастерская" : "1 звезда"}
        </span>
      </div>
      <MissionPrompt mission={mission} />
      <SchoolPrepAudioButton src={`${audioBase}/instruction.mp3`} className="mt-4" />

      {adaptive && (
        <div className={`mt-4 rounded-[18px] border px-4 py-3 text-sm font-bold leading-6 ${learnerLevel === 'foundation' ? 'border-brand-cyan/18 bg-brand-cyan/[0.06] text-ink/64' : 'border-brand-purple/18 bg-brand-purple/[0.06] text-ink/64'}`}>
          <span className="mr-2">{learnerLevel === 'foundation' ? '🧱' : '🚀'}</span>
          {learnerLevel === 'foundation' ? day.foundationAid : day.challengeTask}
        </div>
      )}

      {mission.type === "choice" && <ChoiceMission mission={mission} done={done} onComplete={onComplete} onAttempt={onAttempt} />}
      {mission.type === "recall" && <RecallMission mission={mission} done={done} onComplete={onComplete} onAttempt={onAttempt} />}
      {mission.type === "sequence" && <SequenceMission mission={mission} done={done} onComplete={onComplete} onAttempt={onAttempt} />}
      {mission.type === "memory" && <MemoryMission mission={mission} done={done} onComplete={onComplete} onAttempt={onAttempt} />}
      {mission.type === "quiz" && <QuizMission mission={mission} done={done} onComplete={onComplete} audioBase={audioBase} onAttempt={onAttempt} />}
      {mission.type === "sort" && <SortMission mission={mission} done={done} onComplete={onComplete} onAttempt={onAttempt} />}
      {mission.type === "path" && <PathMission mission={mission} done={done} onComplete={onComplete} onAttempt={onAttempt} />}
      {mission.type === "quantity-board" && <QuantityBoardMission mission={mission} done={done} onComplete={onComplete} onAttempt={onAttempt} />}
      {mission.type === "part-whole" && <PartWholeMission mission={mission} done={done} onComplete={onComplete} onAttempt={onAttempt} />}
      {mission.type === "math-balance" && <MathBalanceMission mission={mission} done={done} onComplete={onComplete} onAttempt={onAttempt} />}
      {mission.type === "number-line" && <NumberLineMission mission={mission} done={done} onComplete={onComplete} onAttempt={onAttempt} />}
      {mission.type === "attention-grid" && <AttentionGridMission mission={mission} done={done} onComplete={onComplete} onAttempt={onAttempt} />}
      {mission.type === "go-no-go" && <GoNoGoMission mission={mission} done={done} onComplete={onComplete} onAttempt={onAttempt} audioBase={audioBase} />}
      {mission.type === "rule-switch" && <RuleSwitchMission mission={mission} done={done} onComplete={onComplete} onAttempt={onAttempt} audioBase={audioBase} />}
      {mission.type === "trace-line" && <TraceLineMission mission={mission} done={done} onComplete={onComplete} onAttempt={onAttempt} />}
      {mission.type === "action" && <ActionMission mission={mission} done={done} onComplete={onComplete} audioBase={audioBase} />}
    </article>
  );
}

export function SchoolPrepAdventure({ week, hasFullAccess = false, price = 490, nextWeekHref = '', waitlistEmail = '', isCourseFinal = false }) {
  const adaptive = week.learningMode === 'adaptive-v1';
  const storageKey = week.number === 1
    ? WEEK_ONE_STORAGE_KEY
    : `razumeyka_school_prep_${week.id || `week${week.number}`}`;
  const learningStorageKey = `${storageKey}_learning_v1`;
  const levelStorageKey = `${storageKey}_level_v1`;
  const [selectedDay, setSelectedDay] = useState(0);
  const [missionIndex, setMissionIndex] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [learningData, setLearningData] = useState({ missions: {} });
  const [learnerLevel, setLearnerLevel] = useState('foundation');
  const [ready, setReady] = useState(false);
  const [nextWeekRequest, setNextWeekRequest] = useState('idle');

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
      if (Array.isArray(saved)) {
        setCompleted(saved);
        if (adaptive) {
          const resumeDayIndex = week.days.findIndex((day) => day.missions.some((mission) => mission.route !== 'bonus' && !saved.includes(mission.id)));
          const safeDayIndex = resumeDayIndex === -1 ? week.days.length - 1 : resumeDayIndex;
          const resumeDay = week.days[safeDayIndex];
          const firstOpenCore = resumeDay.missions.findIndex((mission) => mission.route !== 'bonus' && !saved.includes(mission.id));
          const lastCoreIndex = resumeDay.missions.reduce((last, mission, index) => mission.route !== 'bonus' ? index : last, 0);
          setSelectedDay(safeDayIndex);
          setMissionIndex(firstOpenCore === -1 ? lastCoreIndex : firstOpenCore);
        } else {
          const firstOpen = week.days[0].missions.findIndex((mission) => !saved.includes(mission.id));
          setMissionIndex(firstOpen === -1 ? week.days[0].missions.length - 1 : firstOpen);
        }
      }
      if (adaptive) {
        const savedLearning = JSON.parse(window.localStorage.getItem(learningStorageKey) || '{"missions":{}}');
        if (savedLearning && typeof savedLearning === 'object' && savedLearning.missions) setLearningData(savedLearning);
        const savedLevel = window.localStorage.getItem(levelStorageKey);
        if (savedLevel === 'foundation' || savedLevel === 'challenge') setLearnerLevel(savedLevel);
      }
    } catch {
      setCompleted([]);
    } finally {
      setReady(true);
    }
  }, [adaptive, learningStorageKey, levelStorageKey, storageKey, week.days]);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(storageKey, JSON.stringify(completed));
  }, [completed, ready, storageKey]);

  useEffect(() => {
    if (!ready || !adaptive) return;
    window.localStorage.setItem(learningStorageKey, JSON.stringify(learningData));
  }, [adaptive, learningData, learningStorageKey, ready]);

  useEffect(() => {
    if (!ready || !adaptive) return;
    window.localStorage.setItem(levelStorageKey, learnerLevel);
  }, [adaptive, learnerLevel, levelStorageKey, ready]);

  const allMissionIds = useMemo(
    () => week.days.flatMap((day) => day.missions.map((mission) => mission.id)),
    [week.days],
  );
  const allCoreMissionIds = useMemo(
    () => week.days.flatMap((day) => day.missions.filter((mission) => !adaptive || mission.route !== 'bonus').map((mission) => mission.id)),
    [adaptive, week.days],
  );
  const visibleProgressIds = hasFullAccess
    ? allCoreMissionIds
    : week.days[0].missions.filter((mission) => !adaptive || mission.route !== 'bonus').map((mission) => mission.id);
  const coreMissionsForDay = (day) => day.missions.filter((mission) => !adaptive || mission.route !== 'bonus');
  const bonusMissionsForDay = (day) => day.missions.filter((mission) => adaptive && mission.route === 'bonus');
  const dayComplete = (day) => coreMissionsForDay(day).every((mission) => completed.includes(mission.id));
  const unlocked = (index) => index === 0 || (hasFullAccess && dayComplete(week.days[index - 1]));
  const currentDay = week.days[selectedDay];
  const currentMission = currentDay.missions[missionIndex] ?? currentDay.missions[0];
  const currentMissionDone = completed.includes(currentMission.id);
  const currentCoreMissions = coreMissionsForDay(currentDay);
  const currentBonusMissions = bonusMissionsForDay(currentDay);
  const completedToday = currentCoreMissions.filter((mission) => completed.includes(mission.id)).length;
  const completedBonusToday = currentBonusMissions.filter((mission) => completed.includes(mission.id)).length;
  const currentComplete = dayComplete(currentDay);
  const weekComplete = allCoreMissionIds.every((id) => completed.includes(id));
  const currentCoreErrors = currentCoreMissions.reduce((sum, mission) => sum + (learningData.missions?.[mission.id]?.errors || 0), 0);
  const recommendedBonusCount = adaptive
    ? learnerLevel === 'challenge' ? Math.min(3, currentBonusMissions.length) : Math.min(3, currentCoreErrors)
    : 0;
  const recommendedBonusLabel = `${recommendedBonusCount} ${recommendedBonusCount === 1 ? 'задание' : recommendedBonusCount < 5 ? 'задания' : 'заданий'}`;
  const visibleCompleted = completed.filter((id) => visibleProgressIds.includes(id)).length;
  const progress = Math.round((visibleCompleted / visibleProgressIds.length) * 100);
  const missionTotal = allMissionIds.length;
  const coreMissionTotal = allCoreMissionIds.length;
  const practiceMin = week.days.length * 20;
  const practiceMax = week.days.length * 25;
  const currentDayGradient = currentDay.color?.includes('from-')
    ? currentDay.color
    : dayGradientClasses[currentDay.color] ?? dayGradientClasses.blue;

  useEffect(() => {
    if (!ready || !adaptive || !currentMission?.id || completed.includes(currentMission.id)) return;
    setLearningData((current) => {
      if (current.missions?.[currentMission.id]?.startedAt) return current;
      return {
        ...current,
        missions: {
          ...(current.missions || {}),
          [currentMission.id]: {
            attempts: 0,
            correctAttempts: 0,
            errors: 0,
            hints: 0,
            startedAt: Date.now(),
          },
        },
      };
    });
  }, [adaptive, completed, currentMission?.id, ready]);

  function recordAttempt(id, result = {}) {
    if (!adaptive) return;
    setLearningData((current) => {
      const previous = current.missions?.[id] || { attempts: 0, correctAttempts: 0, errors: 0, hints: 0, startedAt: Date.now() };
      return {
        ...current,
        missions: {
          ...(current.missions || {}),
          [id]: {
            ...previous,
            attempts: previous.attempts + 1,
            correctAttempts: previous.correctAttempts + (result.correct ? 1 : 0),
            errors: previous.errors + (result.correct ? 0 : 1),
            hints: previous.hints + (result.hint ? 1 : 0),
            lastSubKey: result.subKey || previous.lastSubKey,
          },
        },
      };
    });
  }

  function completeMission(id, details = {}) {
    if (adaptive) {
      setLearningData((current) => {
        const now = Date.now();
        const previous = current.missions?.[id] || { attempts: 0, correctAttempts: 0, errors: 0, hints: 0, startedAt: now };
        return {
          ...current,
          missions: {
            ...(current.missions || {}),
            [id]: {
              ...previous,
              ...details,
              completedAt: now,
              elapsedSeconds: Math.max(1, Math.min(600, Math.round((now - previous.startedAt) / 1000))),
              firstTry: previous.errors === 0,
            },
          },
        };
      });
    }
    setCompleted((current) => {
      if (current.includes(id)) return current;
      const next = [...current, id];
      if (current.filter((missionId) => currentCoreMissions.some((mission) => mission.id === missionId)).length === 0) {
        reachGoal("prep_day_start", { week: week.number ?? 1, day: currentDay.number });
      }
      if (currentCoreMissions.every((mission) => next.includes(mission.id))) {
        reachGoal("prep_day_complete", { week: week.number ?? 1, day: currentDay.number, missions: currentCoreMissions.length });
      }
      return next;
    });
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
    if (adaptive && currentDay.missions[index].route === 'bonus') {
      if (!currentComplete) return false;
      const previousBonus = currentDay.missions.slice(0, index).filter((mission) => mission.route === 'bonus').at(-1);
      return !previousBonus || completed.includes(previousBonus.id);
    }
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

  function openBonusWorkshop() {
    const firstBonusIndex = currentDay.missions.findIndex((mission) => mission.route === 'bonus' && !completed.includes(mission.id));
    if (firstBonusIndex === -1) return;
    setMissionIndex(firstBonusIndex);
    window.setTimeout(() => document.getElementById("school-prep-mission")?.scrollIntoView({ behavior: "smooth", block: "center" }), 40);
  }

  function resetWeek() {
    if (!window.confirm(`Начать неделю ${week.number ?? 1} заново? Все полученные звёзды будут сброшены.`)) return;
    setCompleted([]);
    setLearningData({ missions: {} });
    setSelectedDay(0);
    setMissionIndex(0);
  }

  async function requestNextWeek() {
    if (nextWeekRequest !== 'idle') return;
    setNextWeekRequest('sending');
    reachGoal('prep_next_week_request', {
      completed_week: week.number ?? 1,
      requested_week: (week.number ?? 1) + 1,
    });

    if (waitlistEmail) {
      try {
        await fetch('/api/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: waitlistEmail,
            direction: `podgotovka-k-shkole-week-${(week.number ?? 1) + 1}`,
            source: `week-${week.number ?? 1}`,
          }),
        });
      } catch {
        // Сигнал в Метрику уже отправлен; интерфейс ребёнка не прерываем.
      }
    }
    setNextWeekRequest('sent');
  }

  return (
    <div className="relative">
      <div className="rounded-[34px] border border-white/12 bg-[#111a35] p-5 text-white shadow-luxe sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-white/14 bg-white/8 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/72">
              {hasFullAccess ? `Неделя ${week.number ?? 1} · полный маршрут` : "День 1 · полноценный пробный маршрут"}
            </span>
            <h3 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.035em] sm:text-5xl">{week.title}</h3>
            <p className="mt-3 text-base font-medium leading-7 text-white/62">{week.subtitle}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {[
                [String(week.days.length), "учебных дней"],
                [adaptive ? `${coreMissionTotal} + ${missionTotal - coreMissionTotal}` : String(missionTotal), adaptive ? "основных + бонусных" : "игровых шагов"],
                [`${practiceMin}–${practiceMax}`, "минут практики"],
              ].map(([value, label]) => (
                <span key={label} className="inline-flex items-baseline gap-1.5 rounded-full border border-white/10 bg-white/[0.07] px-3 py-2 text-xs font-bold text-white/58">
                  <strong className="font-display text-base font-extrabold text-white">{value}</strong>
                  {label}
                </span>
              ))}
            </div>
            {adaptive && (
              <div className="mt-5 rounded-[20px] border border-white/12 bg-white/[0.07] p-3.5">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-white/52">Маршрут по возрасту ребёнка</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setLearnerLevel('foundation')} className={`rounded-[15px] border px-3 py-3 text-left transition ${learnerLevel === 'foundation' ? 'border-brand-cyan/50 bg-brand-cyan/16 text-white' : 'border-white/10 bg-white/5 text-white/60'}`}><strong className="block text-sm">5–6 лет</strong><span className="mt-1 block text-[10px] font-semibold">Больше предметных подсказок</span></button>
                  <button type="button" onClick={() => setLearnerLevel('challenge')} className={`rounded-[15px] border px-3 py-3 text-left transition ${learnerLevel === 'challenge' ? 'border-brand-purple/60 bg-brand-purple/24 text-white' : 'border-white/10 bg-white/5 text-white/60'}`}><strong className="block text-sm">6–7 лет</strong><span className="mt-1 block text-[10px] font-semibold">Объяснение и второй способ</span></button>
                </div>
              </div>
            )}
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
                        loading="lazy"
                        decoding="async"
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
                    <strong className="font-display text-[26px] font-extrabold leading-none tracking-[-0.045em] text-brand-cyan">{adaptive ? coreMissionsForDay(day).length : day.missions.length}</strong>
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-white/74">{adaptive ? 'основных' : 'шагов'}</span>
                  </div>
                  <p className="mt-1 text-[9px] font-bold text-white/42">{adaptive ? `+ ${bonusMissionsForDay(day).length} бонусных · 20–25 минут` : '20–25 минут'}</p>
                </div>
                {!isUnlocked && <p className="mt-2 text-[9px] font-extrabold uppercase tracking-[0.08em] text-brand-cyan/80">Откроется в полном курсе</p>}
              </button>
            );
          })}
        </div>
      </div>

      <section id="school-prep-day" className="scroll-mt-28 mt-6">
        <div className={`relative overflow-hidden rounded-[32px] bg-gradient-to-br ${currentDayGradient} p-6 text-white shadow-color sm:p-8`}>
          {currentDay.image && (
            <img
              src={currentDay.image}
              loading="lazy"
              decoding="async"
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
              <p className="mt-4 inline-flex items-center rounded-full border border-white/16 bg-white/12 px-4 py-2 text-sm font-extrabold text-white/90 backdrop-blur-xl">
                🦊 Ваш проводник — лисёнок Искра
              </p>
            </div>
            <div className="min-w-[150px] rounded-[24px] border border-white/18 bg-[#0b1930]/48 p-4 shadow-insetline backdrop-blur-xl">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-white/52">Маршрут дня</p>
              <p className="mt-1 font-display text-2xl font-extrabold">{adaptive ? `${currentCoreMissions.length} основных` : `${currentDay.missions.length} шагов`}</p>
              <p className="mt-1 text-xs font-bold text-white/62">{adaptive ? `${currentBonusMissions.length} бонусных · 20–25 минут` : '20–25 минут'}</p>
            </div>
          </div>
          <div className="relative mt-6 rounded-[20px] border border-white/14 bg-white/12 px-4 py-3.5 text-sm font-bold leading-6 text-white/86 backdrop-blur-xl">
            <span className="mr-2">⚡</span>{currentDay.warmup}
          </div>
        </div>

        {adaptive && missionIndex === 0 && !currentMissionDone && <WorkedExample example={currentDay.workedExample} />}

        <div className="mt-5 rounded-[28px] border border-white/80 bg-white/82 p-5 shadow-card backdrop-blur-xl sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-blue">
                {currentMission.chapter ?? "Миссия дня " + (selectedDay + 1)}
              </p>
              <h4 className="mt-2 font-display text-2xl font-extrabold tracking-[-0.025em] text-ink">
                {adaptive
                  ? currentMission.route === 'bonus'
                    ? `Бонус ${currentDay.missions.slice(0, missionIndex + 1).filter((mission) => mission.route === 'bonus').length} из ${currentBonusMissions.length}`
                    : `Основной шаг ${missionIndex + 1} из ${currentCoreMissions.length}`
                  : `Шаг ${missionIndex + 1} из ${currentDay.missions.length}`}
              </h4>
              <p className="mt-1 text-sm font-semibold text-ink/48">
                {adaptive
                  ? `${completedToday} основных выполнено · ${currentCoreMissions.length - completedToday} осталось${completedBonusToday > 0 ? ` · ${completedBonusToday} бонусов` : ''}`
                  : `${completedToday} выполнено · ${currentDay.missions.length - completedToday} осталось`}
              </p>
            </div>
            <div className="w-full max-w-[300px]">
              <div className="h-2.5 overflow-hidden rounded-full bg-ink/7">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink transition-all duration-500"
                  style={{ width: Math.round((completedToday / currentCoreMissions.length) * 100) + "%" }}
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
                          ? mission.route === 'bonus' ? "bg-brand-purple/12 text-brand-purple hover:bg-brand-purple/20" : "bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/18"
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
          <SchoolPrepAutoNarration src={`/audio/school-prep/${currentDay.id}/${currentMission.id}/instruction.mp3`} />
          <MissionCard
            key={currentMission.id}
            mission={currentMission}
            index={missionIndex}
            done={currentMissionDone}
            dayId={currentDay.id}
            day={currentDay}
            adaptive={adaptive}
            learnerLevel={learnerLevel}
            onAttempt={(result) => recordAttempt(currentMission.id, result)}
            onComplete={(details) => completeMission(currentMission.id, details)}
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
                <h4 className="mt-2 font-display text-2xl font-extrabold text-ink">{adaptive ? `Все ${currentCoreMissions.length} основных миссий выполнены!` : `Все ${currentDay.missions.length} шагов выполнены!`}</h4>
                <p className="mt-2 max-w-xl text-sm font-medium leading-6 text-ink/58">
                  {adaptive
                    ? recommendedBonusCount > 0
                      ? `Основной маршрут завершён. По возрастному режиму и попыткам рекомендуем пройти ${recommendedBonusLabel} Бонусной мастерской. Они необязательны и не задерживают следующий день.`
                      : "Основной маршрут завершён уверенно. Можно перейти дальше или открыть Бонусную мастерскую по желанию."
                    : !hasFullAccess && selectedDay === 0
                    ? "Пробный маршрут завершён. В полном курсе приключение продолжается в новых районах Города знаний."
                    : selectedDay < week.days.length - 1
                      ? "Открыт следующий район Города знаний."
                      : nextWeekHref
                        ? `Неделя ${week.number ?? 1} пройдена — все пять наград собраны! Следующая неделя уже открыта, приключение продолжается.`
                        : (week.number ?? 1) === 1
                          ? "Первая неделя пройдена — все пять печатей собраны! Получите награду недели и продолжайте закреплять навыки в игровых тренажёрах."
                          : week.completionLead ?? "Вторая неделя пройдена — все пять фонарей снова горят! Получите награду и отметьте завершение маршрута, чтобы перейти к следующей главе Города знаний."}
                </p>
              </div>
              {adaptive ? (
                <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                  {completedBonusToday < currentBonusMissions.length && <button type="button" onClick={openBonusWorkshop} className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-brand-purple/20 bg-white px-5 py-3 text-sm font-extrabold text-brand-purple transition hover:-translate-y-0.5">{recommendedBonusCount > 0 ? `Пройти ${recommendedBonusLabel} →` : 'Открыть Бонусную мастерскую →'}</button>}
                  {selectedDay < week.days.length - 1 ? <button type="button" onClick={() => selectDay(selectedDay + 1)} className="primary-btn">Открыть день {week.days[selectedDay + 1].number} →</button> : <a href="#school-prep-week-finale" className="primary-btn">Получить награду недели →</a>}
                </div>
              ) : !hasFullAccess && selectedDay === 0 ? (
                <a
                  href="#podpiska"
                  onClick={() => reachGoal("prep_offer_click", { source: "day_complete" })}
                  className="primary-btn shrink-0"
                >
                  Открыть продолжение за {price} ₽ →
                </a>
              ) : selectedDay < week.days.length - 1 ? (
                <button type="button" onClick={() => selectDay(selectedDay + 1)} className="primary-btn shrink-0">
                  Открыть день {week.days[selectedDay + 1].number} →
                </button>
              ) : nextWeekHref ? (
                <a href={nextWeekHref || "#school-prep-games"} className="primary-btn shrink-0">
                  Открыть следующую неделю →
                </a>
              ) : (
                <a href="#school-prep-week-finale" className="primary-btn shrink-0">
                  Получить награду недели →
                </a>
              )}
            </div>
          </div>
        )}

        {adaptive ? <ParentProgressReport day={currentDay} learningData={learningData} completed={completed} coreComplete={currentComplete} /> : <aside className="mt-5 grid gap-4 rounded-[28px] border border-white/80 bg-white/78 p-5 shadow-card backdrop-blur-xl sm:grid-cols-2 sm:p-7">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-purple">Что тренировали</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-ink/64">{currentDay.parentOutcome}</p>
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-orange">Продолжить без экрана</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-ink/64">{currentDay.offline}</p>
          </div>
        </aside>}
      </section>

      {weekComplete && (
        <section id="school-prep-week-finale" className="scroll-mt-28 mt-7 relative overflow-hidden rounded-[36px] bg-gradient-to-br from-[#14264c] via-[#463081] to-[#a63b87] p-7 text-center text-white shadow-luxe sm:p-10">
          <div className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 0 2px, transparent 3px), radial-gradient(circle at 78% 30%, white 0 2px, transparent 3px), radial-gradient(circle at 62% 76%, white 0 2px, transparent 3px)" }} />
          <div className="relative">
            <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-[30px] border border-white/18 bg-white/14 text-5xl shadow-insetline">🗝️</span>
            <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.2em] text-gold-300">Неделя {week.number ?? 1} завершена</p>
            <h3 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.035em] sm:text-5xl">
              {week.completionTitle ?? ((week.number ?? 1) === 1 ? "Золотой ключ твой!" : "Улица живых слов сияет!")}
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-7 text-white/70">
              {week.completionSummary ?? ((week.number ?? 1) === 1
                ? `Ребёнок прошёл ${missionTotal} миссий: слушал инструкцию, находил закономерности, работал со звуками и числами и учился пробовать снова.`
                : `Ребёнок прошёл ${missionTotal} миссий: научился слышать звуки в слове, делить слова на слоги, читать первые слова, собирать предложения и понимать короткие рассказы.`)}
            </p>
            <div className="mx-auto mt-7 inline-flex rounded-full border border-white/16 bg-white/10 px-5 py-3 text-sm font-extrabold">
              Награда: {week.reward} · {adaptive ? `${coreMissionTotal} основных ⭐` : `${missionTotal} ⭐`}
            </div>
            {!nextWeekHref && !isCourseFinal && (week.number ?? 1) >= 2 && (
              <div className="mx-auto mt-8 max-w-xl rounded-[24px] border border-white/14 bg-white/[0.09] p-5 backdrop-blur-xl">
                <p className="text-sm font-semibold leading-6 text-white/76">
                  Маршрут недели {week.number ?? 1} завершён. Подтвердите результат — мы отметим прохождение и активируем для профиля следующий район Города знаний.
                </p>
                <button
                  type="button"
                  disabled={nextWeekRequest !== 'idle'}
                  onClick={requestNextWeek}
                  className="primary-btn mt-5 min-w-[250px] disabled:cursor-default disabled:opacity-80"
                >
                  {nextWeekRequest === 'idle'
                    ? `Завершить неделю ${week.number ?? 1} →`
                    : nextWeekRequest === 'sending'
                      ? 'Сохраняем результат…'
                      : `Неделя ${week.number ?? 1} завершена ✓`}
                </button>
                {nextWeekRequest === 'sent' && (
                  <p className="mt-3 text-xs font-bold text-brand-cyan">Результат сохранён. Следующий район будет добавлен в маршрут.</p>
                )}
              </div>
            )}
            {isCourseFinal && (
              <div className="mx-auto mt-8 max-w-xl rounded-[24px] border border-white/14 bg-white/[0.09] p-5 backdrop-blur-xl">
                <p className="text-sm font-semibold leading-6 text-white/78">
                  Полный маршрут завершён. Итоговые результаты сохранены в прогрессе: теперь можно возвращаться к любимым дням и Бонусным мастерским для спокойного закрепления.
                </p>
                <a href="#program" className="primary-btn mt-5 min-w-[250px]">Посмотреть весь маршрут ✓</a>
              </div>
            )}
          </div>
        </section>
      )}

      {ready && completed.length > 0 && (
        <div className="mt-5 text-center">
          <button type="button" onClick={resetWeek} className="text-xs font-bold text-ink/38 underline decoration-ink/18 underline-offset-4 transition hover:text-ink/62">
            Сбросить прогресс недели {week.number ?? 1}
          </button>
        </div>
      )}
    </div>
  );
}
