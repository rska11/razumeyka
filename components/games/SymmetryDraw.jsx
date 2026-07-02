'use client';

import { useRef, useEffect, useState } from 'react';

const COLORS = ['#3b82f6', '#ec4899', '#f59e0b', '#10b981', '#7c3aed', '#ffffff'];
const SECTORS = 8;

export function SymmetryDraw() {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const last = useRef(null);
  const [color, setColor] = useState(COLORS[1]);

  function paintBg(ctx, size) {
    ctx.fillStyle = '#0b1f3a';
    ctx.fillRect(0, 0, size, size);
  }

  useEffect(() => {
    const c = canvasRef.current;
    const size = Math.min(c.parentElement.clientWidth, 460);
    c.width = size;
    c.height = size;
    const ctx = c.getContext('2d');
    ctx.lineCap = 'round';
    paintBg(ctx, size);
  }, []);

  function pos(e) {
    const c = canvasRef.current;
    const r = c.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    const scale = c.width / r.width;
    return { x: (t.clientX - r.left) * scale - c.width / 2, y: (t.clientY - r.top) * scale - c.height / 2 };
  }
  function start(e) {
    e.preventDefault();
    drawing.current = true;
    last.current = pos(e);
  }
  function move(e) {
    if (!drawing.current) return;
    e.preventDefault();
    const c = canvasRef.current;
    const ctx = c.getContext('2d');
    const p = pos(e);
    const l = last.current;
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.save();
    ctx.translate(c.width / 2, c.height / 2);
    for (let i = 0; i < SECTORS; i++) {
      ctx.save();
      ctx.rotate(((Math.PI * 2) / SECTORS) * i);
      ctx.beginPath();
      ctx.moveTo(l.x, l.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      ctx.scale(1, -1);
      ctx.beginPath();
      ctx.moveTo(l.x, l.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
    last.current = p;
  }
  function end() {
    drawing.current = false;
  }
  function clear() {
    const c = canvasRef.current;
    paintBg(c.getContext('2d'), c.width);
  }

  return (
    <div className="rounded-[26px] border border-white/80 bg-white/85 p-6 shadow-card backdrop-blur-xl sm:p-8">
      <canvas
        ref={canvasRef}
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
        className="mx-auto block w-full max-w-[460px] touch-none rounded-[16px] shadow-luxe [cursor:crosshair]"
      />
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            style={{ background: c }}
            aria-label={`цвет ${c}`}
            className={`h-8 w-8 rounded-full border border-ink/10 transition ${color === c ? 'ring-2 ring-brand-blue ring-offset-2' : ''}`}
          />
        ))}
        <button onClick={clear} className="secondary-btn ml-2 h-9 min-h-0 px-4 py-0 text-sm">Очистить</button>
      </div>
      <p className="mt-4 text-center text-sm font-semibold text-ink/56">
        Рисуй — линия сама зеркалится в узор. Так и рождается смелость: красиво выходит без «умею/не умею» 🎨
      </p>
    </div>
  );
}
