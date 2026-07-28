// Отрисовка «Светлячка». Как и в «Мосте» — только вектор, ни одной картинки.
// draw() ничего не меняет в состоянии.

import { WORLD_H, WORLD_W } from './engine.js';

const SKY_TOP = '#0B1030';
const SKY_BOTTOM = '#1E2B60';
const PATH_DIM = 'rgba(255,255,255,.14)';
const PATH_EDGE = 'rgba(140,190,255,.30)';
const PATH_DONE = 'rgba(255,214,120,.85)';
const GLOW = '#FFD873';

function drawSky(ctx, state) {
  const sky = ctx.createLinearGradient(0, 0, 0, WORLD_H);
  sky.addColorStop(0, SKY_TOP);
  sky.addColorStop(1, SKY_BOTTOM);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, WORLD_W, WORLD_H);

  ctx.fillStyle = 'rgba(255,255,255,.8)';
  for (let i = 0; i < 40; i += 1) {
    const x = (i * 173) % WORLD_W;
    const y = (i * 97) % (WORLD_H - 120);
    const twinkle = 0.45 + Math.sin(state.time * 1.6 + i) * 0.45;
    ctx.globalAlpha = 0.2 + twinkle * 0.5;
    ctx.fillRect(x, y, 2.2, 2.2);
  }
  ctx.globalAlpha = 1;

  // Трава внизу — чтобы сцена читалась как ночная поляна, а не как пустой фон.
  ctx.fillStyle = '#132349';
  ctx.beginPath();
  ctx.moveTo(0, WORLD_H - 46);
  for (let x = 0; x <= WORLD_W; x += 40) {
    ctx.lineTo(x, WORLD_H - 52 + Math.sin(x * 0.02) * 7);
  }
  ctx.lineTo(WORLD_W, WORLD_H);
  ctx.lineTo(0, WORLD_H);
  ctx.closePath();
  ctx.fill();
}

function strokePath(ctx, points, from, to, width, color, blur) {
  if (to <= from) return;
  ctx.save();
  if (blur) {
    ctx.shadowColor = GLOW;
    ctx.shadowBlur = blur;
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(points[from].x, points[from].y);
  for (let i = from + 1; i <= to; i += 1) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
  ctx.restore();
}

function drawHouse(ctx, x, y, reached, time) {
  ctx.save();
  ctx.translate(x, y);
  const bob = reached ? Math.sin(time * 5) * 3 : 0;
  ctx.translate(0, bob);

  ctx.fillStyle = '#2A3A72';
  ctx.fillRect(-34, -26, 68, 52);
  ctx.fillStyle = '#3A4E92';
  ctx.beginPath();
  ctx.moveTo(-44, -26);
  ctx.lineTo(0, -62);
  ctx.lineTo(44, -26);
  ctx.closePath();
  ctx.fill();

  // Окно светится, когда светлячок дошёл, — это и есть «победа» без слов.
  ctx.fillStyle = reached ? '#FFD873' : 'rgba(255,216,115,.28)';
  if (reached) {
    ctx.shadowColor = GLOW;
    ctx.shadowBlur = 28;
  }
  ctx.fillRect(-14, -12, 28, 26);
  ctx.restore();
}

function drawFirefly(ctx, state) {
  const { x, y } = state.firefly;
  const lit = state.lit;
  const pulse = 1 + Math.sin(state.time * 8) * 0.12;

  ctx.save();
  ctx.translate(x, y);

  if (lit) {
    const halo = ctx.createRadialGradient(0, 0, 2, 0, 0, 78 * pulse);
    halo.addColorStop(0, 'rgba(255,216,115,.55)');
    halo.addColorStop(1, 'rgba(255,216,115,0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(0, 0, 78 * pulse, 0, Math.PI * 2);
    ctx.fill();
  }

  // Крылышки
  ctx.fillStyle = lit ? 'rgba(255,255,255,.7)' : 'rgba(255,255,255,.28)';
  const flap = Math.sin(state.time * 22) * 6;
  ctx.beginPath();
  ctx.ellipse(-9, -9 + flap * 0.2, 9, 5, -0.7, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(9, -9 - flap * 0.2, 9, 5, 0.7, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = lit ? '#FFE9A8' : '#7C87B5';
  ctx.beginPath();
  ctx.ellipse(0, 0, 11, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = lit ? GLOW : '#5E6894';
  if (lit) {
    ctx.shadowColor = GLOW;
    ctx.shadowBlur = 22;
  }
  ctx.beginPath();
  ctx.arc(0, 7, 7 * pulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function draw(ctx, state) {
  const points = state.points;
  const width = state.level.width;

  drawSky(ctx, state);

  // Вся дорожка — тусклая, пройденная часть — светящаяся.
  strokePath(ctx, points, 0, points.length - 1, width + 8, PATH_EDGE, 0);
  strokePath(ctx, points, 0, points.length - 1, width, PATH_DIM, 0);
  strokePath(ctx, points, 0, state.index, width, PATH_DONE, 22);

  // Старт
  ctx.fillStyle = 'rgba(255,255,255,.5)';
  ctx.beginPath();
  ctx.arc(points[0].x, points[0].y, width * 0.42, 0, Math.PI * 2);
  ctx.fill();

  const end = points[points.length - 1];
  drawHouse(ctx, end.x, end.y - 10, state.status === 'done', state.time);

  for (const spark of state.sparks) {
    const k = 1 - spark.life / spark.max;
    ctx.globalAlpha = Math.max(0, k);
    ctx.fillStyle = GLOW;
    ctx.beginPath();
    ctx.arc(spark.x, spark.y, 4 + (1 - k) * 16, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  drawFirefly(ctx, state);

  // Подсказка на старте: куда ставить палец. Исчезает, как только повели.
  if (state.index < 3 && !state.holding) {
    ctx.save();
    ctx.globalAlpha = 0.55 + Math.sin(state.time * 3) * 0.35;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(points[0].x, points[0].y, width * 0.75 + Math.sin(state.time * 3) * 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}
