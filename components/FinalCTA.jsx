'use client';

import { useEffect, useState } from 'react';
import { Icon } from './Icon.jsx';

const MAX_DIRECTIONS = 3;

const DIRECTIONS = [
  { name: 'Ментальная арифметика', short: 'Арифметика', icon: 'abacus',
    bar: 'bg-brand-blue', badgeBg: 'bg-brand-blue', iconSel: 'bg-brand-blue text-white',
    cardGrad: 'from-brand-blue/12 via-brand-blue/4 to-white', selBorder: 'border-brand-blue/40',
    chipBg: 'bg-brand-blue/10', chipText: 'text-brand-blue', shadow: 'shadow-[0_18px_36px_rgba(59,130,246,0.18)]' },
  { name: 'Скорочтение', short: 'Скорочтение', icon: 'book',
    bar: 'bg-brand-orange', badgeBg: 'bg-brand-orange', iconSel: 'bg-brand-orange text-white',
    cardGrad: 'from-brand-orange/12 via-brand-orange/4 to-white', selBorder: 'border-brand-orange/40',
    chipBg: 'bg-brand-orange/10', chipText: 'text-brand-orange', shadow: 'shadow-[0_18px_36px_rgba(251,146,60,0.18)]' },
  { name: 'Правополушарное рисование', short: 'Рисование', icon: 'palette',
    bar: 'bg-brand-pink', badgeBg: 'bg-brand-pink', iconSel: 'bg-brand-pink text-white',
    cardGrad: 'from-brand-pink/12 via-brand-pink/4 to-white', selBorder: 'border-brand-pink/40',
    chipBg: 'bg-brand-pink/10', chipText: 'text-brand-pink', shadow: 'shadow-[0_18px_36px_rgba(236,72,153,0.18)]' },
  { name: 'Интуиция', short: 'Интуиция', icon: 'spark',
    bar: 'bg-brand-cyan', badgeBg: 'bg-brand-cyan', iconSel: 'bg-brand-cyan text-white',
    cardGrad: 'from-brand-cyan/12 via-brand-cyan/4 to-white', selBorder: 'border-brand-cyan/40',
    chipBg: 'bg-brand-cyan/10', chipText: 'text-brand-cyan', shadow: 'shadow-[0_18px_36px_rgba(6,182,212,0.18)]' },
  { name: 'Языки', short: 'Языки', icon: 'screen',
    bar: 'bg-brand-green', badgeBg: 'bg-brand-green', iconSel: 'bg-brand-green text-white',
    cardGrad: 'from-brand-green/12 via-brand-green/4 to-white', selBorder: 'border-brand-green/40',
    chipBg: 'bg-brand-green/10', chipText: 'text-brand-green', shadow: 'shadow-[0_18px_36px_rgba(34,197,94,0.18)]' },
];

const FORMATS = [
  { id: 'trial', label: 'Пробный урок', desc: 'Знакомство с педагогом', detail: '1 занятие · 30 мин · 1 направление',
    priceHint: '400 ₽', icon: 'calendar', iconBg: 'bg-brand-blue text-white',
    accent: 'from-brand-blue/14 via-white to-brand-cyan/8', ring: 'ring-brand-blue/22',
    topBar: 'bg-gradient-to-r from-brand-blue to-brand-cyan' },
  { id: 'collective', label: 'Коллективное', desc: 'Мини-группа до 6 детей', detail: '2 раза/нед · 30 мин · до 3 направлений',
    priceHint: 'от 890 ₽/урок', icon: 'users', iconBg: 'bg-brand-pink text-white',
    accent: 'from-brand-pink/12 via-white to-brand-orange/8', ring: 'ring-brand-pink/22',
    topBar: 'bg-gradient-to-r from-brand-pink to-brand-orange', badge: 'Популярно' },
  { id: 'individual', label: 'Индивидуальное', desc: 'Один на один с педагогом', detail: '2 раза/нед · 30 мин · до 3 направлений',
    priceHint: 'от 1 350 ₽/урок', icon: 'mentor', iconBg: 'bg-gold-300 text-ink',
    accent: 'from-gold-300/16 via-white to-brand-blue/6', ring: 'ring-gold-300/26',
    topBar: 'bg-gradient-to-r from-gold-300 to-brand-blue', badge: 'Максимум внимания' },
];

const DURATIONS = [
  { id: '1m', label: '1 месяц', lessons: 9,
    collective: { total: 10800, per: 1200 }, individual: { total: 16200, per: 1800 },
    savings: null, accent: 'from-brand-blue/8 via-white to-brand-cyan/5', topBar: 'bg-brand-blue' },
  { id: '3m', label: '3 месяца', lessons: 26,
    collective: { total: 25740, per: 990 }, individual: { total: 39000, per: 1500 },
    savings: 21, badge: 'Популярно', accent: 'from-brand-pink/8 via-white to-brand-orange/5', topBar: 'bg-brand-pink' },
  { id: '6m', label: '6 месяцев', lessons: 52,
    collective: { total: 46280, per: 890 }, individual: { total: 70200, per: 1350 },
    savings: 29, badge: 'Лучшая цена', accent: 'from-brand-orange/8 via-white to-brand-yellow/5', topBar: 'bg-brand-orange' },
];

const DAYS_PER_DIR = 2; // занятий в неделю на каждое направление

const DAYS = [
  { id: 'mon', label: 'Пн', full: 'Понедельник',  time: '18:30', spots: 2 },
  { id: 'tue', label: 'Вт', full: 'Вторник',      time: '18:30', spots: 3 },
  { id: 'wed', label: 'Ср', full: 'Среда',        time: '18:30', spots: 1 },
  { id: 'thu', label: 'Чт', full: 'Четверг',      time: '18:30', spots: 3 },
  { id: 'fri', label: 'Пт', full: 'Пятница',      time: '17:00', spots: 2 },
  { id: 'sat', label: 'Сб', full: 'Суббота',      time: '10:30', spots: 2 },
  { id: 'sun', label: 'Вс', full: 'Воскресенье',  time: '16:00', spots: 3 },
];

function rub(n) {
  return n.toLocaleString('ru-RU') + ' ₽';
}

export function FinalCTA() {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedDirs, setSelectedDirs] = useState([DIRECTIONS[0].name]);
  const [format, setFormat] = useState(null);
  const [duration, setDuration] = useState(null);
  // per-direction days: { [dirName]: dayId[] } — max 2 per direction
  const [daysByDir, setDaysByDir] = useState({});
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  // dirs paused/excluded in review step
  const [pausedDirs, setPausedDirs] = useState([]);
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState('');

  const isTrial      = format === 'trial';
  const activeFormat = FORMATS.find((f) => f.id === format);
  const activeDur    = DURATIONS.find((d) => d.id === duration);
  const dirLimit     = isTrial ? 1 : MAX_DIRECTIONS;
  const maxReached   = selectedDirs.length >= dirLimit;

  // directions actually being paid for in review
  const activeDirsInReview = selectedDirs.filter((d) => !pausedDirs.includes(d));

  const pricePerDir = isTrial ? 400
    : activeDur && format ? (activeDur[format]?.total ?? 0) : 0;

  const totalPrice = format && (isTrial || activeDur) && activeDirsInReview.length > 0
    ? pricePerDir * activeDirsInReview.length : null;

  const perLesson = !isTrial && activeDur && format
    ? activeDur[format]?.per ?? null : null;

  function getDays(dirName) { return daysByDir[dirName] ?? []; }

  const allDaysChosen = selectedDirs.length > 0
    && selectedDirs.every((d) => getDays(d).length === DAYS_PER_DIR);

  const scheduleSummary = (() => {
    if (selectedDirs.length === 0) return 'Не выбрано';
    if (selectedDirs.length === 1) {
      const days = getDays(selectedDirs[0]);
      if (days.length === 0) return 'Не выбрано';
      const labels = days.map((id) => DAYS.find((d) => d.id === id)?.label).join(' + ');
      return days.length < DAYS_PER_DIR ? `${labels} (выберите ещё 1)` : labels;
    }
    const done = selectedDirs.filter((d) => getDays(d).length === DAYS_PER_DIR).length;
    return done === selectedDirs.length ? 'Расписание подобрано' : `${done} из ${selectedDirs.length} настроено`;
  })();

  // ds: displayed step number (trial shifts steps ≥4 down by 1)
  function ds(n) { return isTrial && n >= 4 ? n - 1 : n; }

  // proper toggle: clicking open step closes it
  function toggleStep(n) {
    setActiveStep((prev) => (prev === n ? 0 : n));
  }

  const dirSummary = selectedDirs.length === 0 ? 'Не выбрано'
    : selectedDirs.length === 1 ? selectedDirs[0]
    : `${DIRECTIONS.find((d) => d.name === selectedDirs[0])?.short} +${selectedDirs.length - 1}`;

  function toggleDirection(dirName) {
    // allow full deselect — no minimum enforced
    setSelectedDirs((cur) =>
      cur.includes(dirName)
        ? cur.filter((d) => d !== dirName)
        : cur.length >= dirLimit ? cur : [...cur, dirName],
    );
    setPausedDirs([]);
    setDaysByDir({});
  }

  function removeChip(dirName) {
    setSelectedDirs((cur) => cur.filter((d) => d !== dirName));
    setPausedDirs((cur) => cur.filter((d) => d !== dirName));
    setDaysByDir((cur) => { const next = { ...cur }; delete next[dirName]; return next; });
  }

  function handleFormatSelect(f) {
    setFormat(f);
    setDuration(null);
    if (f === 'trial' && selectedDirs.length > 1) setSelectedDirs([selectedDirs[0]]);
    setPausedDirs([]);
    setActiveStep(f === 'trial' ? 4 : 3);
  }

  function toggleDayForDir(dirName, dayId) {
    setDaysByDir((prev) => {
      const cur = prev[dirName] ?? [];
      const next = cur.includes(dayId)
        ? { ...prev, [dirName]: cur.filter((d) => d !== dayId) }
        : cur.length >= DAYS_PER_DIR
          ? prev
          : { ...prev, [dirName]: [...cur, dayId] };
      // auto-advance when every selected dir has 2 days
      const nextAll = selectedDirs.every((d) => (next[d] ?? []).length === DAYS_PER_DIR);
      if (nextAll) setTimeout(() => setActiveStep(5), 400);
      return next;
    });
  }

  function togglePausedDir(dirName) {
    setPausedDirs((cur) =>
      cur.includes(dirName) ? cur.filter((d) => d !== dirName) : [...cur, dirName],
    );
  }

  async function handlePayment() {
    setPayError('');
    if (!email.trim()) {
      setPayError('Укажите email — на него придёт чек и доступ в кабинет');
      setActiveStep(5);
      return;
    }
    setPayLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isTrial,
          format,
          tariff: duration,
          directions: activeDirsInReview,
          email,
          name,
          phone,
          schedule: scheduleSummary,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setPayError(
        data.error === 'PAYMENTS_DISABLED' ? 'Оплата временно недоступна'
          : data.error === 'INVALID_EMAIL' ? 'Укажите корректный email'
          : 'Не удалось создать оплату. Попробуйте ещё раз.',
      );
    } catch {
      setPayError('Сеть недоступна. Попробуйте ещё раз.');
    }
    setPayLoading(false);
  }

  // Плашка «Записаться на пробный урок — 400 ₽» из Hero открывает мастер сразу на сценарии пробного урока
  useEffect(() => {
    function onTrialIntent() {
      setFormat('trial');
      setDuration(null);
      setSelectedDirs((cur) => (cur.length > 1 ? [cur[0]] : cur));
      setPausedDirs([]);
      setActiveStep(4);
    }
    window.addEventListener('razumeika:trial', onTrialIntent);
    return () => window.removeEventListener('razumeika:trial', onTrialIntent);
  }, []);

  return (
    <section id="form" className="presentation-slide mesh-bg py-16 sm:py-20 lg:py-24">
      <div className="container-pad">
        <div className="relative overflow-hidden rounded-[36px] border border-white/70 bg-[linear-gradient(160deg,rgba(255,255,255,0.82),rgba(241,245,255,0.72))] p-5 shadow-[0_48px_120px_rgba(16,42,86,0.14)] backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute inset-0 rounded-[36px] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(255,255,255,0.5)]" />
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-brand-blue/16 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-brand-pink/14 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-brand-orange/10 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">

            {/* ── LEFT: live summary ── */}
            <div className="lg:pr-2">
              <span className="section-kicker">Маршрут старта</span>
              <h2 className="section-title mt-5">Выберите удобный формат</h2>
              <p className="mt-5 text-lg font-medium leading-8 text-ink/66">
                Пробный урок — 400 ₽. Для продолжения — коллективное или индивидуальное обучение с прозрачной ценой.
              </p>

              <div className="mt-8 overflow-hidden rounded-[26px] border border-white/70 bg-white shadow-[0_24px_56px_rgba(16,42,86,0.1)]">
                <div className="flex items-center justify-between border-b border-ink/6 bg-[linear-gradient(135deg,rgba(16,42,86,0.03),rgba(255,255,255,0.8))] px-5 py-4">
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/38">Ваш выбор</p>
                  {totalPrice && (
                    <span className="rounded-full bg-ink px-3 py-1.5 text-xs font-extrabold text-white">
                      {rub(totalPrice)}
                    </span>
                  )}
                </div>

                <div className="divide-y divide-ink/5 border-b border-ink/6">
                  {selectedDirs.length > 0 ? selectedDirs.map((dName) => {
                    const dir = DIRECTIONS.find((d) => d.name === dName);
                    const isPaused = pausedDirs.includes(dName);
                    return (
                      <div key={dName} className={`flex items-center gap-3 px-5 py-3 transition-opacity ${isPaused ? 'opacity-35' : ''}`}>
                        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-white ${dir?.badgeBg ?? 'bg-ink'}`}>
                          <Icon name={dir?.icon ?? 'check'} className="h-3.5 w-3.5" />
                        </span>
                        <span className={`flex-1 text-sm font-extrabold ${isPaused ? 'text-ink/40 line-through' : 'text-ink'}`}>
                          {dir?.short ?? dName}
                        </span>
                        {pricePerDir > 0 && (
                          <span className={`text-sm font-extrabold ${isPaused ? 'text-ink/30 line-through' : 'text-ink'}`}>
                            {rub(pricePerDir)}
                          </span>
                        )}
                      </div>
                    );
                  }) : (
                    <div className="px-5 py-4 text-sm font-bold text-ink/36">Направления не выбраны</div>
                  )}
                </div>

                <div className="divide-y divide-ink/5">
                  {[
                    ['Формат', activeFormat?.label ?? '—'],
                    ['Срок', isTrial ? 'Пробный урок' : (activeDur?.label ?? '—')],
                  ].map(([label, val]) => (
                    <div key={label} className="flex items-center justify-between px-5 py-3">
                      <span className="text-sm font-medium text-ink/48">{label}</span>
                      <span className="text-sm font-extrabold text-ink">{val}</span>
                    </div>
                  ))}
                  <div className="flex items-end justify-between bg-[linear-gradient(135deg,rgba(59,130,246,0.06),rgba(236,72,153,0.04))] px-5 py-4">
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-ink/40">Итого</p>
                      {activeDirsInReview.length > 1 && pricePerDir > 0 && (
                        <p className="mt-1 text-xs font-extrabold text-ink/52">{rub(pricePerDir)} × {activeDirsInReview.length}</p>
                      )}
                    </div>
                    <span className={`font-display text-2xl font-extrabold leading-none ${totalPrice ? 'text-brand-blue' : 'text-ink/20'}`}>
                      {totalPrice ? rub(totalPrice) : '—'}
                    </span>
                  </div>
                </div>

                {perLesson && (
                  <div className="border-t border-ink/6 bg-ink/[0.015] px-5 py-3">
                    <p className="text-sm font-extrabold text-brand-blue">{rub(perLesson)}/урок</p>
                    <p className="mt-0.5 text-xs font-medium text-ink/44">30 мин · 2 раза в неделю · за каждое направление</p>
                    {activeDur?.savings && (
                      <p className="mt-2 text-xs font-extrabold text-brand-orange">Экономия {activeDur.savings}% относительно помесячной оплаты</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT: booking steps ── */}
            <div className="rounded-[28px] border border-white/80 bg-white shadow-[0_32px_80px_rgba(16,42,86,0.12)]">
              <div className="flex items-center justify-between rounded-t-[28px] border-b border-ink/6 bg-[linear-gradient(135deg,rgba(16,42,86,0.03),rgba(255,255,255,0.9))] px-5 py-4">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-ink/38">Запись на занятие</p>
                  <p className="mt-1 text-sm font-extrabold text-ink">Направление · Формат · Оплата</p>
                </div>
                <span className={`rounded-full px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] ${totalPrice ? 'bg-ink text-white' : 'bg-ink/6 text-ink/40'}`}>
                  {totalPrice ? rub(totalPrice) : '—'}
                </span>
              </div>

              <div className="divide-y divide-ink/5 p-4 sm:p-5">

                {/* ── STEP 1: Directions ── */}
                <StepBlock step={1} title="Направления" value={dirSummary}
                  isOpen={activeStep === 1} isDone={activeStep > 1 && selectedDirs.length > 0}
                  onToggle={() => toggleStep(1)}>
                  <div className="space-y-4 pt-1">
                    {/* Counter bar */}
                    <div className="flex items-center justify-between rounded-[14px] bg-ink/[0.03] px-4 py-3">
                      <p className="text-xs font-extrabold text-ink/56">
                        {selectedDirs.length === 0 ? 'Нет выбранных направлений'
                          : isTrial ? 'Пробный — 1 направление'
                          : selectedDirs.length === MAX_DIRECTIONS ? '3 из 3 выбрано · максимум'
                          : `${selectedDirs.length} из ${MAX_DIRECTIONS} выбрано`}
                      </p>
                      <div className="flex items-center gap-1.5">
                        {Array.from({ length: MAX_DIRECTIONS }).map((_, i) => {
                          const dir = DIRECTIONS.find((d) => d.name === selectedDirs[i]);
                          return (
                            <span key={i} className={`h-2.5 w-8 rounded-full transition-all duration-300 ${i < selectedDirs.length ? (dir?.bar ?? 'bg-brand-blue') : 'bg-ink/10'}`} />
                          );
                        })}
                      </div>
                    </div>

                    {/* Direction cards */}
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                      {DIRECTIONS.map((dir) => {
                        const selIdx = selectedDirs.indexOf(dir.name);
                        const isSelected = selIdx !== -1;
                        const isDisabled = !isSelected && maxReached;
                        return (
                          <button key={dir.name} type="button" onClick={() => toggleDirection(dir.name)} disabled={isDisabled}
                            className={`group relative overflow-hidden rounded-[20px] border-2 p-4 text-left transition-all duration-200 ${
                              isSelected
                                ? `${dir.selBorder} bg-gradient-to-br ${dir.cardGrad} ${dir.shadow} scale-[1.02]`
                                : isDisabled
                                  ? 'cursor-not-allowed border-ink/6 bg-ink/[0.02] opacity-35'
                                  : 'border-ink/8 bg-white hover:border-ink/20 hover:shadow-[0_8px_22px_rgba(16,42,86,0.08)] hover:scale-[1.01]'
                            }`}>
                            {isSelected && <div className={`absolute inset-x-0 top-0 h-[3px] rounded-t-[18px] ${dir.bar}`} />}
                            {isSelected && (
                              <span className={`absolute right-2.5 top-3 flex h-7 w-7 items-center justify-center rounded-full text-xs font-black text-white shadow-[0_4px_10px_rgba(0,0,0,0.2)] ${dir.badgeBg}`}>
                                {selIdx + 1}
                              </span>
                            )}
                            <span className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-200 ${isSelected ? `${dir.iconSel} shadow-[0_8px_18px_rgba(0,0,0,0.14)]` : 'bg-ink/[0.05] text-ink/44'}`}>
                              <Icon name={dir.icon} className="h-5 w-5" />
                            </span>
                            <p className={`mt-3 text-sm font-extrabold leading-[1.3] transition-colors ${isSelected ? 'text-ink' : 'text-ink/60'}`}>
                              {dir.name}
                            </p>
                          </button>
                        );
                      })}
                    </div>

                    {/* Chips + continue */}
                    <div className="space-y-3 rounded-[18px] border border-ink/6 bg-ink/[0.02] p-3">
                      {selectedDirs.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedDirs.map((dName, i) => {
                            const dir = DIRECTIONS.find((d) => d.name === dName);
                            return (
                              <span key={dName} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-extrabold ${dir?.chipBg} ${dir?.chipText}`}>
                                <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-black text-white ${dir?.badgeBg}`}>{i + 1}</span>
                                {dir?.short ?? dName}
                                <button type="button" onClick={(e) => { e.stopPropagation(); removeChip(dName); }}
                                  className="ml-0.5 opacity-50 transition hover:opacity-100" aria-label={`Убрать ${dName}`}>
                                  <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2">
                                    <path d="M9 3L3 9M3 3l6 6" />
                                  </svg>
                                </button>
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs font-bold text-ink/40">Нажмите на направление чтобы выбрать</p>
                      )}
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-bold text-ink/40">
                          {selectedDirs.length < dirLimit && selectedDirs.length > 0
                            ? `+ можно добавить ещё ${dirLimit - selectedDirs.length}`
                            : selectedDirs.length === MAX_DIRECTIONS ? 'Выбраны все 3'
                            : ''}
                        </p>
                        <button type="button" onClick={() => setActiveStep(2)} disabled={selectedDirs.length === 0}
                          className="primary-btn shrink-0 px-5 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-40">
                          {selectedDirs.length > 1 ? `Далее · ${selectedDirs.length} направления` : 'Далее'}
                          <Icon name="arrow" className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </StepBlock>

                {/* ── STEP 2: Format ── */}
                <StepBlock step={2} title="Формат обучения" value={activeFormat?.label ?? 'Не выбрано'}
                  isOpen={activeStep === 2} isDone={activeStep > 2} onToggle={() => toggleStep(2)}>
                  <div className="grid gap-3 pt-1">
                    {FORMATS.map((f) => {
                      const isSelected = format === f.id;
                      return (
                        <button key={f.id} type="button" onClick={() => handleFormatSelect(f.id)}
                          className={`group relative overflow-hidden rounded-[20px] border-2 p-4 text-left transition-all duration-200 ${
                            isSelected
                              ? `border-transparent bg-gradient-to-br ${f.accent} ring-2 ${f.ring} shadow-[0_20px_40px_rgba(16,42,86,0.12)] scale-[1.01]`
                              : 'border-ink/8 bg-white hover:border-ink/18 hover:shadow-[0_10px_24px_rgba(16,42,86,0.07)]'
                          }`}>
                          {isSelected && <div className={`absolute inset-x-0 top-0 h-[3px] ${f.topBar}`} />}
                          <div className="relative flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-[0_10px_24px_rgba(16,42,86,0.12)] ${f.iconBg}`}>
                                <Icon name={f.icon} className="h-5 w-5" />
                              </span>
                              <div>
                                <p className="font-display text-lg font-extrabold leading-tight text-ink">{f.label}</p>
                                <p className="mt-0.5 text-xs font-bold text-ink/52">{f.desc}</p>
                              </div>
                            </div>
                            <div className="shrink-0 text-right">
                              <p className="text-base font-extrabold text-brand-blue">{f.priceHint}</p>
                              {f.badge && <span className="mt-1 block rounded-full bg-ink/8 px-2.5 py-0.5 text-[10px] font-extrabold text-ink/54">{f.badge}</span>}
                            </div>
                          </div>
                          <p className="relative mt-2.5 text-xs font-bold text-ink/42">{f.detail}</p>
                        </button>
                      );
                    })}
                  </div>
                </StepBlock>

                {/* ── STEP 3: Duration (skip trial) ── */}
                {!isTrial && format && (
                  <StepBlock step={3} title="Срок обучения"
                    value={activeDur ? `${activeDur.label} · ${rub(activeDur[format]?.total ?? 0)}/направление` : 'Не выбрано'}
                    isOpen={activeStep === 3} isDone={activeStep > 3} onToggle={() => toggleStep(3)}>
                    <div className="grid gap-3 pt-1">
                      {DURATIONS.map((d) => {
                        const isSelected = duration === d.id;
                        const prices = d[format];
                        return (
                          <button key={d.id} type="button" onClick={() => { setDuration(d.id); setActiveStep(4); }}
                            className={`group relative overflow-hidden rounded-[20px] border-2 p-4 text-left transition-all duration-200 ${
                              isSelected
                                ? `border-transparent bg-gradient-to-br ${d.accent} ring-2 ring-brand-blue/16 shadow-[0_20px_40px_rgba(16,42,86,0.12)] scale-[1.01]`
                                : 'border-ink/8 bg-white hover:border-ink/18 hover:shadow-[0_10px_24px_rgba(16,42,86,0.07)]'
                            }`}>
                            {isSelected && <div className={`absolute inset-x-0 top-0 h-[3px] ${d.topBar}`} />}
                            <div className="relative flex items-start justify-between gap-3">
                              <div>
                                <p className="font-display text-xl font-extrabold text-ink">{d.label}</p>
                                <p className="mt-1 text-xs font-bold text-ink/48">{d.lessons} занятий · 30 мин · 2 раза/нед</p>
                              </div>
                              <div className="shrink-0 text-right">
                                <p className="font-display text-xl font-extrabold text-ink">{rub(prices.total)}</p>
                                <p className="mt-0.5 text-xs font-bold text-ink/48">{rub(prices.per)}/урок</p>
                              </div>
                            </div>
                            {selectedDirs.length > 1 && (
                              <div className="relative mt-3 rounded-[12px] border border-white/80 bg-white/70 px-3 py-2.5">
                                <div className="flex items-center justify-between">
                                  <p className="text-xs font-extrabold text-ink/54">{selectedDirs.length} направления вместе</p>
                                  <p className="text-sm font-extrabold text-ink">{rub(prices.total * selectedDirs.length)}</p>
                                </div>
                                <p className="mt-0.5 text-[11px] font-bold text-ink/38">{rub(prices.total)} × {selectedDirs.length}</p>
                              </div>
                            )}
                            {(d.savings || d.badge) && (
                              <div className="relative mt-3 flex flex-wrap items-center gap-2">
                                {d.savings && <span className="rounded-full bg-brand-orange/14 px-3 py-1 text-xs font-extrabold text-brand-orange">Экономия {d.savings}%</span>}
                                {d.badge && <span className="rounded-full bg-ink/7 px-3 py-1 text-xs font-extrabold text-ink/52">{d.badge}</span>}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </StepBlock>
                )}

                {/* ── STEP 4: Days (2 per direction) ── */}
                <StepBlock step={ds(4)} title="Дни занятий" value={scheduleSummary}
                  isOpen={activeStep === 4} isDone={activeStep > 4 && allDaysChosen}
                  onToggle={() => toggleStep(4)}>
                  <div className="space-y-3 pt-1">

                    {/* Hint */}
                    <div className="rounded-[13px] bg-ink/[0.03] px-4 py-2.5">
                      <p className="text-xs font-bold text-ink/56">
                        Каждое направление — <span className="font-extrabold text-ink">2 раза в неделю</span>. Выберите 2 удобных дня для каждого. В один день можно поставить несколько направлений — до 3 занятий в день.
                      </p>
                    </div>

                    {selectedDirs.length === 1 ? (
                      /* ─ Single direction: 7-day picker ─ */
                      <SingleDirDayPicker
                        dirName={selectedDirs[0]}
                        dir={DIRECTIONS.find((d) => d.name === selectedDirs[0])}
                        chosenDays={getDays(selectedDirs[0])}
                        onToggle={(dayId) => toggleDayForDir(selectedDirs[0], dayId)}
                        blockedDays={[]}
                      />
                    ) : (
                      /* ─ Multiple directions: compact matrix ─ */
                      <div className="space-y-3">
                        <div className="overflow-x-auto rounded-[16px] border border-ink/8 bg-white">
                          <div style={{ minWidth: '520px' }}>
                            {/* Column headers */}
                            <div className="grid border-b border-ink/6 bg-ink/[0.02]"
                              style={{ gridTemplateColumns: `minmax(88px,1.1fr) repeat(${DAYS.length}, 1fr) 48px` }}>
                              <div className="flex items-end px-3 pb-2.5 pt-2">
                                <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-ink/34">Направление</p>
                              </div>
                              {DAYS.map((d) => (
                                <div key={d.id} className="border-l border-ink/6 px-1 py-2 text-center">
                                  <p className="text-xs font-extrabold text-ink">{d.label}</p>
                                  <p className="text-[10px] font-bold text-ink/44">{d.time}</p>
                                  <span className={`mt-0.5 inline-block rounded-full px-1 py-0.5 text-[8px] font-extrabold leading-none ${
                                    d.spots === 1 ? 'bg-brand-orange/14 text-brand-orange' : 'bg-brand-blue/8 text-brand-blue'
                                  }`}>
                                    {d.spots}м
                                  </span>
                                </div>
                              ))}
                              <div className="border-l border-ink/6 px-1 py-2 text-center">
                                <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-ink/34">Дней</p>
                              </div>
                            </div>

                            {/* Direction rows */}
                            {selectedDirs.map((dName, di) => {
                              const dir = DIRECTIONS.find((d) => d.name === dName);
                              const chosen = getDays(dName);
                              const rowFull = chosen.length >= DAYS_PER_DIR;
                              return (
                                <div key={dName}
                                  className={`grid items-center ${di < selectedDirs.length - 1 ? 'border-b border-ink/5' : ''}`}
                                  style={{ gridTemplateColumns: `minmax(88px,1.1fr) repeat(${DAYS.length}, 1fr) 48px` }}>
                                  {/* Label */}
                                  <div className="flex items-center gap-1.5 px-3 py-3">
                                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[9px] font-black text-white ${dir?.badgeBg ?? 'bg-ink'}`}>
                                      {di + 1}
                                    </span>
                                    <span className="text-xs font-extrabold leading-tight text-ink">{dir?.short ?? dName}</span>
                                  </div>

                                  {/* Day cells */}
                                  {DAYS.map((day) => {
                                    const isChosen = chosen.includes(day.id);
                                    // другие направления, уже стоящие в этот день (можно совмещать — до 3 в день)
                                    const sharedBy = selectedDirs.filter((d) => d !== dName && getDays(d).includes(day.id));
                                    const isBlocked = rowFull && !isChosen; // блокирует только лимит «2 дня на направление»

                                    return (
                                      <div key={day.id} className="flex items-center justify-center border-l border-ink/5 py-3">
                                        <button type="button"
                                          onClick={() => !isBlocked && toggleDayForDir(dName, day.id)}
                                          disabled={isBlocked}
                                          title={isChosen ? 'Снять выбор' : isBlocked ? 'Уже выбрано 2 дня' : sharedBy.length ? `В этот день уже: ${sharedBy.join(', ')}` : 'Выбрать'}
                                          className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-150 ${
                                            isChosen
                                              ? `border-transparent text-white shadow-[0_5px_12px_rgba(0,0,0,0.18)] scale-110 ${dir?.badgeBg ?? 'bg-brand-blue'}`
                                              : isBlocked
                                                ? 'cursor-not-allowed border-ink/8 bg-ink/[0.02] opacity-30'
                                              : sharedBy.length
                                                ? 'border-dashed border-ink/28 bg-white hover:border-ink/44 hover:scale-105 hover:shadow-[0_3px_8px_rgba(16,42,86,0.1)]'
                                                : 'border-ink/14 bg-white hover:border-ink/28 hover:scale-105 hover:shadow-[0_3px_8px_rgba(16,42,86,0.1)]'
                                          }`}>
                                          {isChosen && <Icon name="check" className="h-3.5 w-3.5" />}
                                          {!isChosen && sharedBy.length > 0 && (
                                            <span className="flex items-center -space-x-1">
                                              {sharedBy.map((sd) => {
                                                const sdir = DIRECTIONS.find((d) => d.name === sd);
                                                return (
                                                  <span key={sd} className={`h-2 w-2 rounded-full ring-1 ring-white ${sdir?.badgeBg ?? 'bg-ink/40'}`} />
                                                );
                                              })}
                                            </span>
                                          )}
                                        </button>
                                      </div>
                                    );
                                  })}

                                  {/* Per-row counter */}
                                  <div className="flex items-center justify-center border-l border-ink/5 py-3">
                                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                                      chosen.length === DAYS_PER_DIR
                                        ? `${dir?.badgeBg ?? 'bg-brand-blue'} text-white`
                                        : 'bg-ink/8 text-ink/46'
                                    }`}>
                                      {chosen.length}/{DAYS_PER_DIR}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Continue button */}
                        <button type="button" onClick={() => setActiveStep(5)} disabled={!allDaysChosen}
                          className="primary-btn w-full disabled:cursor-not-allowed disabled:opacity-40">
                          {allDaysChosen ? 'Расписание готово · Продолжить'
                            : `Выберите 2 дня для каждого (${selectedDirs.filter((d) => getDays(d).length === DAYS_PER_DIR).length}/${selectedDirs.length} готово)`}
                          <Icon name="arrow" className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    {/* Weekly schedule summary (both single and multi) */}
                    {allDaysChosen && (
                      <WeekSchedule selectedDirs={selectedDirs} daysByDir={daysByDir} />
                    )}

                  </div>
                </StepBlock>

                {/* ── STEP 5: Contacts ── */}
                <StepBlock step={ds(5)} title="Контакты"
                  value={name || phone ? `${name || 'Имя'}${phone ? `, ${phone}` : ''}` : 'Не заполнено'}
                  isOpen={activeStep === 5} isDone={activeStep > 5} onToggle={() => toggleStep(5)}>
                  <form onSubmit={(e) => { e.preventDefault(); setActiveStep(6); }} className="grid gap-3 pt-1">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Имя родителя" icon="mentor">
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                          className="field-input mt-0 h-[52px] bg-white" placeholder="Анна" />
                      </Field>
                      <Field label="Телефон" icon="phone">
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                          className="field-input mt-0 h-[52px] bg-white" placeholder="+7 (___) ___-__-__" />
                      </Field>
                    </div>
                    <Field label="Email" icon="screen">
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        className="field-input mt-0 h-[52px] bg-white" placeholder="anna@example.com" />
                    </Field>
                    <button type="submit" className="secondary-btn min-h-[52px] w-full">Перейти к проверке</button>
                  </form>
                </StepBlock>

                {/* ── STEP 6: Review + Pay ── */}
                <StepBlock step={ds(6)} title="Проверка и оплата"
                  value={totalPrice ? `К оплате ${rub(totalPrice)}` : 'Итоговая заявка'}
                  isOpen={activeStep === 6} isDone={false} onToggle={() => toggleStep(6)}>
                  <div className="space-y-3 pt-1">

                    {/* Package summary */}
                    <div className="overflow-hidden rounded-[20px] border-2 border-brand-blue/16 bg-[linear-gradient(135deg,rgba(59,130,246,0.05),rgba(255,255,255,0.98),rgba(236,72,153,0.03))] shadow-[0_16px_36px_rgba(16,42,86,0.08)]">
                      <div className="flex items-center justify-between border-b border-brand-blue/10 bg-brand-blue/5 px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-brand-blue text-white shadow-sm">
                            <Icon name="check" className="h-3.5 w-3.5" />
                          </span>
                          <p className="text-sm font-extrabold text-ink">
                            {selectedDirs.length === 1 ? '1 направление обучения'
                              : `${selectedDirs.length} направления обучения одновременно`}
                          </p>
                        </div>
                        <span className="rounded-full bg-brand-blue/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-brand-blue">Пакет</span>
                      </div>

                      {/* Direction rows with toggle */}
                      <div className="divide-y divide-ink/5">
                        {selectedDirs.map((dName, i) => {
                          const dir = DIRECTIONS.find((d) => d.name === dName);
                          const isPaused = pausedDirs.includes(dName);
                          const dirDays = getDays(dName);
                          const dayLabels = dirDays.map((id) => DAYS.find((d) => d.id === id)?.label).join(' + ');
                          return (
                            <button key={dName} type="button" onClick={() => togglePausedDir(dName)}
                              title={isPaused ? 'Включить в оплату' : 'Исключить из оплаты'}
                              className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-all duration-200 hover:bg-ink/[0.02] ${isPaused ? 'opacity-40' : ''}`}>
                              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-[0_6px_14px_rgba(0,0,0,0.12)] transition-all ${isPaused ? 'grayscale' : ''} ${dir?.badgeBg ?? 'bg-ink'}`}>
                                <Icon name={dir?.icon ?? 'check'} className="h-4 w-4" />
                              </span>
                              <div className="flex-1">
                                <p className={`text-sm font-extrabold transition-all ${isPaused ? 'text-ink/40 line-through' : 'text-ink'}`}>{dName}</p>
                                {dayLabels && <p className={`mt-0.5 text-xs font-bold ${isPaused ? 'text-ink/30' : 'text-ink/48'}`}>{dayLabels}</p>}
                              </div>
                              <div className="flex items-center gap-2">
                                {pricePerDir > 0 && (
                                  <span className={`text-sm font-extrabold ${isPaused ? 'text-ink/30 line-through' : 'text-ink'}`}>{rub(pricePerDir)}</span>
                                )}
                                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                                  isPaused ? 'border-ink/14 bg-white text-ink/30' : `border-transparent ${dir?.badgeBg ?? 'bg-brand-blue'} text-white`
                                }`}>
                                  {isPaused
                                    ? <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M7 3v8M3 7h8" /></svg>
                                    : <Icon name="check" className="h-3.5 w-3.5" />}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {pausedDirs.length > 0 && (
                        <div className="border-t border-brand-blue/8 bg-brand-orange/5 px-4 py-2.5">
                          <p className="text-xs font-extrabold text-brand-orange">
                            {pausedDirs.length} {pausedDirs.length === 1 ? 'направление исключено' : 'направления исключены'} · нажмите «+» чтобы вернуть
                          </p>
                        </div>
                      )}

                      {/* Meta */}
                      <div className="flex flex-wrap gap-x-3 gap-y-1.5 border-t border-brand-blue/10 bg-brand-blue/[0.03] px-4 py-3">
                        {[
                          activeFormat?.label,
                          isTrial ? 'Пробный урок' : activeDur?.label,
                          !isTrial && activeDur && activeDirsInReview.length > 1
                            ? `${activeDur.lessons * activeDirsInReview.length} занятий (${activeDur.lessons}×${activeDirsInReview.length})`
                            : !isTrial && activeDur ? `${activeDur.lessons} занятий` : null,
                        ].filter(Boolean).map((v, i, arr) => (
                          <span key={v} className="flex items-center gap-2 text-xs font-extrabold text-ink/60">
                            {v}
                            {i < arr.length - 1 && <span className="text-ink/24">·</span>}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Price formula */}
                    <div className="overflow-hidden rounded-[20px] border border-ink/8 bg-white">
                      <div className="px-4 py-4">
                        {activeDirsInReview.length > 1 && pricePerDir > 0 ? (
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/40">Расчёт</p>
                              <p className="mt-1.5 text-sm font-bold text-ink/60">{rub(pricePerDir)} × {activeDirsInReview.length} направления</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/40">Итого</p>
                              <p className="mt-1 font-display text-3xl font-extrabold text-ink">{rub(totalPrice ?? 0)}</p>
                            </div>
                            {activeDur?.savings && (
                              <span className="shrink-0 rounded-[12px] bg-brand-orange/12 px-3 py-2 text-sm font-extrabold text-brand-orange">−{activeDur.savings}%</span>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-end justify-between">
                            <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/40">Итого к оплате</p>
                            <div className="flex items-center gap-3">
                              {activeDur?.savings && <span className="rounded-[12px] bg-brand-orange/12 px-3 py-2 text-sm font-extrabold text-brand-orange">−{activeDur.savings}%</span>}
                              <p className="font-display text-3xl font-extrabold text-ink">{totalPrice ? rub(totalPrice) : '—'}</p>
                            </div>
                          </div>
                        )}
                        {perLesson && (
                          <p className="mt-2 text-xs font-bold text-ink/44">{rub(perLesson)}/урок · {activeDur?.lessons} занятий на каждое направление</p>
                        )}
                      </div>
                      <div className="border-t border-ink/6 bg-ink/[0.02] px-4 py-3">
                        <p className="text-xs font-bold leading-5 text-ink/52">После оплаты мы свяжемся в течение 5–10 минут и пришлём ссылки на первые занятия.</p>
                      </div>
                      <div className="px-4 pb-4 pt-3">
                        <button type="button" onClick={handlePayment} disabled={payLoading || activeDirsInReview.length === 0 || !totalPrice}
                          className="primary-btn w-full disabled:cursor-not-allowed disabled:opacity-40">
                          <span className="relative">{payLoading ? 'Переход к оплате…' : totalPrice ? `Оплатить ${rub(totalPrice)}` : 'Перейти к оплате'}</span>
                          <Icon name="arrow" className="relative h-5 w-5" />
                        </button>
                        {payError && <p className="mt-2 text-center text-xs font-bold text-brand-red">{payError}</p>}
                      </div>
                    </div>

                  </div>
                </StepBlock>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SingleDirDayPicker({ dirName, dir, chosenDays, onToggle, blockedDays }) {
  const rowFull = chosenDays.length >= DAYS_PER_DIR;
  return (
    <div className="space-y-3">
      {/* Progress */}
      <div className="flex items-center justify-between rounded-[13px] bg-ink/[0.03] px-4 py-2.5">
        <p className="text-xs font-extrabold text-ink/56">
          Выбрано {chosenDays.length} из {DAYS_PER_DIR} дней
        </p>
        <div className="flex gap-1.5">
          {Array.from({ length: DAYS_PER_DIR }).map((_, i) => (
            <span key={i} className={`h-2.5 w-7 rounded-full transition-colors duration-200 ${i < chosenDays.length ? (dir?.bar ?? 'bg-brand-blue') : 'bg-ink/10'}`} />
          ))}
        </div>
      </div>

      {/* 7-day grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {DAYS.map((day) => {
          const isChosen = chosenDays.includes(day.id);
          const isBlocked = blockedDays.includes(day.id) || (rowFull && !isChosen);
          return (
            <button key={day.id} type="button"
              onClick={() => !isBlocked && onToggle(day.id)}
              disabled={isBlocked}
              className={`flex flex-col items-center gap-0.5 rounded-[14px] border-2 px-1 py-2.5 transition-all duration-150 ${
                isChosen
                  ? `border-transparent text-white shadow-[0_8px_18px_rgba(0,0,0,0.16)] scale-105 ${dir?.badgeBg ?? 'bg-brand-blue'}`
                  : isBlocked
                    ? 'cursor-not-allowed border-ink/6 bg-ink/[0.02] opacity-30'
                    : 'border-ink/10 bg-white hover:border-ink/22 hover:shadow-[0_4px_10px_rgba(16,42,86,0.09)] hover:scale-[1.03]'
              }`}>
              <span className="text-sm font-extrabold">{day.label}</span>
              <span className={`text-[10px] font-bold leading-none ${isChosen ? 'text-white/80' : 'text-ink/44'}`}>{day.time}</span>
              <span className={`mt-0.5 rounded-full px-1 py-0.5 text-[8px] font-extrabold leading-none ${
                isChosen ? 'bg-white/20 text-white' : day.spots === 1 ? 'bg-brand-orange/14 text-brand-orange' : 'bg-brand-blue/8 text-brand-blue'
              }`}>
                {isChosen ? '✓' : `${day.spots}м`}
              </span>
            </button>
          );
        })}
      </div>

      {/* Chosen days summary */}
      {chosenDays.length > 0 && (
        <div className={`rounded-[13px] border px-4 py-3 transition-all ${chosenDays.length === DAYS_PER_DIR ? 'border-brand-blue/18 bg-brand-blue/6' : 'border-ink/8 bg-ink/[0.02]'}`}>
          <p className="text-sm font-extrabold text-ink">
            {chosenDays.map((id) => {
              const d = DAYS.find((x) => x.id === id);
              return `${d?.full} ${d?.time}`;
            }).join(' и ')}
          </p>
          {chosenDays.length < DAYS_PER_DIR && (
            <p className="mt-1 text-xs font-bold text-ink/46">Выберите ещё {DAYS_PER_DIR - chosenDays.length} день</p>
          )}
        </div>
      )}
    </div>
  );
}

function WeekSchedule({ selectedDirs, daysByDir }) {
  const items = DAYS
    .map((day) => {
      const dName = selectedDirs.find((d) => (daysByDir[d] ?? []).includes(day.id));
      if (!dName) return null;
      const dir = DIRECTIONS.find((d) => d.name === dName);
      return { day, dName, dir, idx: selectedDirs.indexOf(dName) };
    })
    .filter(Boolean);

  if (items.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-[14px] border border-brand-blue/16 bg-gradient-to-br from-brand-blue/6 to-brand-pink/4">
      <div className="border-b border-brand-blue/10 px-4 py-2.5">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-brand-blue">
          Расписание на неделю · {items.length} занятий
        </p>
      </div>
      <div className="grid gap-0 divide-y divide-ink/5">
        {items.map(({ day, dName, dir, idx }) => (
          <div key={`${day.id}-${dName}`} className="flex items-center gap-3 px-4 py-2.5">
            <span className="w-[68px] shrink-0 text-sm font-extrabold text-ink">{day.label} {day.time}</span>
            <span className="text-ink/24">→</span>
            <div className="flex items-center gap-2">
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[9px] font-black text-white ${dir?.badgeBg ?? 'bg-ink'}`}>
                {idx + 1}
              </span>
              <span className="text-sm font-extrabold text-ink">{dName}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepBlock({ step, title, value, isOpen, isDone, onToggle, children }) {
  return (
    <div className={`transition-all duration-200 ${isOpen ? 'bg-[linear-gradient(180deg,rgba(59,130,246,0.03),rgba(255,255,255,0))]' : ''}`}>
      <button type="button" onClick={onToggle} className="flex w-full items-center justify-between gap-4 px-1 py-4 text-left">
        <div className="flex min-w-0 items-center gap-3.5">
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-extrabold shadow-[0_4px_12px_rgba(16,42,86,0.1)] transition-all ${
            isOpen ? 'bg-ink text-white shadow-[0_8px_20px_rgba(16,42,86,0.2)]'
              : isDone ? 'bg-brand-blue text-white'
              : 'bg-ink/[0.06] text-ink/52'
          }`}>
            {isDone ? <Icon name="check" className="h-4.5 w-4.5" /> : step}
          </span>
          <div className="min-w-0">
            <p className={`text-xs font-extrabold uppercase tracking-[0.14em] transition-colors ${isOpen ? 'text-brand-blue' : 'text-ink/40'}`}>{title}</p>
            <p className={`mt-0.5 truncate text-sm font-extrabold transition-colors ${isOpen ? 'text-ink' : isDone ? 'text-ink/60' : 'text-ink/44'}`}>{value}</p>
          </div>
        </div>
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-white text-ink/40 transition-all duration-200 ${isOpen ? 'rotate-180 border-brand-blue/20 shadow-[0_8px_20px_rgba(16,42,86,0.08)]' : 'border-ink/8'}`}>
          <Icon name="chevronDown" className="h-4 w-4" />
        </span>
      </button>
      {isOpen && <div className="pb-4">{children}</div>}
    </div>
  );
}

function Field({ label, icon, children }) {
  return (
    <label className="block">
      <span className="mb-2 inline-flex items-center gap-2 text-sm font-extrabold text-ink/60">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-ink/[0.04] text-ink">
          <Icon name={icon} className="h-4 w-4" />
        </span>
        {label}
      </span>
      {children}
    </label>
  );
}