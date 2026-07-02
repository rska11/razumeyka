'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const questions = [
  { key: 'age', q: 'Сколько лет ребёнку?', opts: ['4–5 лет', '6–7 лет', '8–9 лет', '10–12 лет'] },
  {
    key: 'goal',
    q: 'Что хотите улучшить больше всего?',
    opts: ['Счёт и математику', 'Чтение', 'Внимание и усидчивость', 'Уверенность и речь', 'Творчество', 'Язык (англ./рус.)', 'Подготовку к школе'],
  },
  {
    key: 'worry',
    q: 'Что беспокоит сейчас?',
    opts: ['Стесняется, зажат', 'Медленно читает', 'Невнимательный', 'Боится математики', 'Скоро в школу', 'Мало фантазии', 'Пишет с ошибками'],
  },
];

const LOADING_MSGS = [
  'Анализирую возраст ребёнка…',
  'Сопоставляю с направлениями…',
  'Взвешиваю, что сейчас важнее…',
  'Формирую персональную рекомендацию…',
];

export function QuizAI() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState(0);
  const [result, setResult] = useState(null);
  const [reasonShown, setReasonShown] = useState('');
  const [error, setError] = useState(null);

  // вращаем сообщения «ИИ думает»
  useEffect(() => {
    if (!loading) return undefined;
    setLoadMsg(0);
    const id = setInterval(() => setLoadMsg((m) => Math.min(m + 1, LOADING_MSGS.length - 1)), 1100);
    return () => clearInterval(id);
  }, [loading]);

  // эффект «печатает» для ответа ИИ
  useEffect(() => {
    if (!result?.reason) return undefined;
    setReasonShown('');
    let i = 0;
    const id = setInterval(() => {
      i += 2;
      setReasonShown(result.reason.slice(0, i));
      if (i >= result.reason.length) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, [result]);

  async function submit(na) {
    setLoading(true);
    setError(null);
    const text = `Возраст: ${na.age}. Цель: ${na.goal}. Беспокоит: ${na.worry}.`;
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: text }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.slug) {
        setResult(data);
      } else {
        setError(data.detail ? `${data.error || 'Ошибка'}: ${data.detail}` : 'Не удалось получить ответ ИИ.');
      }
    } catch (e) {
      setError(`Сеть: ${String(e).slice(0, 120)}`);
    } finally {
      setLoading(false);
    }
  }

  function choose(val) {
    const key = questions[step].key;
    const na = { ...answers, [key]: val };
    setAnswers(na);
    if (step + 1 < questions.length) setStep(step + 1);
    else submit(na);
  }

  function restart() {
    setStep(0);
    setAnswers({});
    setResult(null);
    setError(null);
  }

  return (
    <section className="px-5 py-16 sm:px-8 lg:px-14">
      <div className="container-pad px-0">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-[26px] border border-ink/8 bg-white/92 p-8 shadow-[0_22px_60px_rgba(16,42,86,0.10)] backdrop-blur-xl sm:p-12">
          <div className="text-center">
            <span className="section-kicker bg-brand-purple/8">✨ Подбор с искусственным интеллектом</span>
            <h2 className="section-title mt-5">Не знаете, что выбрать?</h2>
            <p className="mx-auto mt-3 max-w-lg text-lg font-medium text-ink/64">
              Ответьте на 3 вопроса — наш ИИ-помощник за пару секунд подберёт подходящее направление для вашего ребёнка.
            </p>
          </div>

          <div className="mt-9">
            {loading ? (
              <div className="py-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-blue to-brand-purple text-3xl shadow-color">
                  <span className="animate-pulse">🤖</span>
                </div>
                <p className="mt-5 font-display text-xl font-black text-ink">{LOADING_MSGS[loadMsg]}</p>
                <div className="mt-3 flex justify-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="h-2.5 w-2.5 animate-bounce rounded-full bg-brand-purple" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            ) : result ? (
              <div className="rounded-[20px] border border-ink/8 bg-gradient-to-br from-brand-blue/6 to-brand-purple/6 p-7 sm:p-9">
                <div className="flex items-center justify-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue to-brand-purple text-lg">🤖</span>
                  <span className="text-sm font-extrabold uppercase tracking-[0.14em] text-brand-purple">Искусственный интеллект советует</span>
                </div>
                <h3 className="mt-4 text-center font-display text-[1.7rem] font-black text-ink sm:text-[2.1rem]">{result.title}</h3>
                <p className="mx-auto mt-4 min-h-[3.5rem] max-w-xl text-center text-lg font-medium leading-8 text-ink/74">
                  {reasonShown}
                  {reasonShown.length < (result.reason?.length ?? 0) && <span className="animate-pulse">▋</span>}
                </p>
                <div className="mt-7 flex flex-wrap justify-center gap-3">
                  <Link href={`/${result.slug}`} className="primary-btn">Смотреть направление</Link>
                  <a href="/#form" className="secondary-btn">Записаться на пробный</a>
                </div>
                <button onClick={restart} className="mx-auto mt-5 block text-sm font-extrabold text-ink/50 transition hover:text-ink">Пройти заново</button>
              </div>
            ) : error ? (
              <div className="rounded-[20px] border border-brand-red/20 bg-brand-red/6 p-7 text-center">
                <p className="text-base font-bold text-ink/72">Не удалось подобрать автоматически.</p>
                <p className="mt-2 break-words text-xs font-medium text-ink/50">{error}</p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <button onClick={restart} className="secondary-btn">Попробовать снова</button>
                  <a href="/#programs" className="primary-btn">Все направления</a>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6 flex items-center justify-between text-xs font-extrabold uppercase tracking-[0.14em] text-ink/44">
                  <span>Вопрос {step + 1} из {questions.length}</span>
                  <div className="flex gap-1.5">
                    {questions.map((_, i) => (
                      <span key={i} className={`h-2 w-8 rounded-full ${i <= step ? 'bg-brand-purple' : 'bg-ink/10'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-center font-display text-2xl font-black text-ink sm:text-3xl">{questions[step].q}</p>
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {questions[step].opts.map((o) => (
                    <button
                      key={o}
                      onClick={() => choose(o)}
                      className="rounded-[16px] border border-ink/10 bg-white px-5 py-4 text-base font-bold text-ink/80 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-purple/40 hover:bg-brand-purple/5"
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
