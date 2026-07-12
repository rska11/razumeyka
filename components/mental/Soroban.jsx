'use client';

// Интерактивный абакус (соробан) — сердце уроков ментальной арифметики.
// Одна колонка = один разряд: верхняя бусина = 5, четыре нижних = по 1.
// Число «набрано», когда бусины придвинуты к перекладине.
//
// Управляемый компонент: value + onChange(next). interactive={false} — только
// показ (шаги teach/read и флеш-карты). Количество разрядов задаёт columns.

const COL_W = 64; // ширина колонки
const PAD = 8; // поле рамки
const BAR_Y = 72; // перекладина
const HEAVEN_UP = 32; // пятёрка не набрана (вверху)
const HEAVEN_DOWN = 57; // пятёрка набрана (у перекладины)
const EARTH_UP = 87; // первая позиция набранной единицы (под перекладиной)
const EARTH_DOWN = 123; // первая позиция ненабранной единицы (внизу)
const EARTH_STEP = 27; // шаг между бусинами
const H = 232;

// Цвета — фирменная палитра (tailwind brand.*): бусины-единицы оранжевые,
// пятёрка синяя, ненабранные — приглушённые.
const EARTH_ON = '#F59E0B';
const HEAVEN_ON = '#3B82F6';
const BEAD_OFF = '#E3DCCB';
const FRAME = '#D9CFB8';

function digitsOf(value, columns) {
  const digits = [];
  let rest = Math.max(0, Math.floor(value));
  for (let i = 0; i < columns; i += 1) {
    digits.unshift(rest % 10);
    rest = Math.floor(rest / 10);
  }
  return digits;
}

function Bead({ cx, cy, active, color, onClick, label }) {
  const clickable = Boolean(onClick);
  return (
    <ellipse
      cx={cx}
      cy={0}
      rx={24}
      ry={12.5}
      fill={active ? color : BEAD_OFF}
      stroke="rgba(19,35,27,0.14)"
      strokeWidth="1.5"
      role={clickable ? 'button' : undefined}
      aria-label={clickable ? label : undefined}
      onClick={onClick}
      style={{
        transform: `translateY(${cy}px)`,
        transition: 'transform 0.22s ease, fill 0.22s ease',
        cursor: clickable ? 'pointer' : 'default',
      }}
    />
  );
}

export function Soroban({ value = 0, onChange, columns = 1, interactive = true, className = '' }) {
  const width = PAD * 2 + columns * COL_W;
  const maxValue = 10 ** columns - 1;
  const digits = digitsOf(Math.min(value, maxValue), columns);

  function setDigit(col, digit) {
    if (!onChange) return;
    const next = digits.map((d, i) => (i === col ? digit : d)).reduce((acc, d) => acc * 10 + d, 0);
    onChange(next);
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${H}`}
      className={className}
      role={interactive ? 'group' : 'img'}
      aria-label={`Абакус, набрано число ${Math.min(value, maxValue)}`}
    >
      <rect x="1.5" y="1.5" width={width - 3} height={H - 3} rx="18" fill="#FFFDF8" stroke={FRAME} strokeWidth="3" />
      <line x1={PAD + 2} y1={BAR_Y} x2={width - PAD - 2} y2={BAR_Y} stroke={FRAME} strokeWidth="5" strokeLinecap="round" />

      {digits.map((digit, col) => {
        const cx = PAD + COL_W * col + COL_W / 2;
        const heavenOn = digit >= 5;
        const earth = digit % 5;
        return (
          <g key={col}>
            <line x1={cx} y1={12} x2={cx} y2={H - 12} stroke={FRAME} strokeWidth="3" />

            <Bead
              cx={cx}
              cy={heavenOn ? HEAVEN_DOWN : HEAVEN_UP}
              active={heavenOn}
              color={HEAVEN_ON}
              label={heavenOn ? 'Убрать пятёрку' : 'Набрать пятёрку'}
              onClick={interactive ? () => setDigit(col, heavenOn ? digit - 5 : digit + 5) : undefined}
            />

            {[0, 1, 2, 3].map((j) => {
              const active = j < earth;
              return (
                <Bead
                  key={j}
                  cx={cx}
                  cy={(active ? EARTH_UP : EARTH_DOWN) + j * EARTH_STEP}
                  active={active}
                  color={EARTH_ON}
                  label={active ? `Опустить бусину ${j + 1}` : `Поднять бусину ${j + 1}`}
                  onClick={
                    interactive
                      ? () => setDigit(col, (heavenOn ? 5 : 0) + (active ? j : j + 1))
                      : undefined
                  }
                />
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

// Сколько разрядов нужно, чтобы показать число (минимум один).
export function columnsFor(maxNumber) {
  return Math.max(1, String(Math.max(0, Math.floor(maxNumber))).length);
}
