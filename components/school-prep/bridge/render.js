// Отрисовка «Моста через реку». Ни одной картинки: всё рисуется вектором,
// поэтому игра ничего не докачивает, одинаково выглядит на любом экране и
// не зависит от того, как система рисует эмодзи.
//
// Функция draw() ничего не меняет в состоянии — только читает его.

import { FOX_X, LANE_Y, SLAB_H, SLAB_W, WORLD_H, WORLD_W } from './engine.js';

const DAY = {
  skyTop: '#BBE2FF',
  skyBottom: '#EEF7FF',
  hillFar: '#A9D9C0',
  hillNear: '#7FC5A4',
  riverTop: '#5AB4F0',
  riverBottom: '#2A63D8',
  // Тёплый серо-песочный вместо белого: так плита читается как речной камень,
  // а не как карточка интерфейса.
  slab: '#F4EFE3',
  slabEdge: 'rgba(72,54,28,.22)',
  slabInk: '#16224A',
  deck: 'rgba(255,255,255,.55)',
  lane: 'rgba(255,255,255,.35)',
  badge: '#111A35',
  badgeInk: '#FFFFFF',
};

const NIGHT = {
  skyTop: '#0E1740',
  skyBottom: '#27356F',
  hillFar: '#1B2A57',
  hillNear: '#16224A',
  riverTop: '#22407F',
  riverBottom: '#101C4B',
  slab: '#E8EFFF',
  slabEdge: 'rgba(0,0,0,.28)',
  slabInk: '#101B3D',
  deck: 'rgba(255,255,255,.28)',
  lane: 'rgba(255,255,255,.16)',
  badge: '#FFFFFF',
  badgeInk: '#111A35',
};

const OK_FILL = '#28B463';
const BAD_FILL = '#F2504B';

function rrect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.arcTo(x + w, y, x + w, y + radius, radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius);
  ctx.lineTo(x + radius, y + h);
  ctx.arcTo(x, y + h, x, y + h - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
}

function drawSky(ctx, palette, time, night) {
  const sky = ctx.createLinearGradient(0, 0, 0, WORLD_H);
  sky.addColorStop(0, palette.skyTop);
  sky.addColorStop(1, palette.skyBottom);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, WORLD_W, WORLD_H);

  if (night) {
    ctx.fillStyle = 'rgba(255,255,255,.85)';
    for (let i = 0; i < 26; i += 1) {
      const x = ((i * 137) % WORLD_W) + Math.sin(time * 0.3 + i) * 2;
      const y = 30 + ((i * 61) % 190);
      const twinkle = 0.5 + Math.sin(time * 1.8 + i) * 0.5;
      ctx.globalAlpha = 0.25 + twinkle * 0.55;
      ctx.fillRect(x, y, 2.4, 2.4);
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#FFF6D8';
    ctx.beginPath();
    ctx.arc(818, 104, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = palette.skyTop;
    ctx.beginPath();
    ctx.arc(802, 94, 30, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  ctx.fillStyle = '#FFF2C2';
  ctx.beginPath();
  ctx.arc(816, 104, 40, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.72)';
  for (let i = 0; i < 3; i += 1) {
    const x = ((time * 12 + i * 340) % (WORLD_W + 260)) - 130;
    const y = 78 + i * 44;
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.arc(x + 30, y + 6, 20, 0, Math.PI * 2);
    ctx.arc(x - 28, y + 8, 17, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawHills(ctx, palette, time) {
  ctx.fillStyle = palette.hillFar;
  ctx.beginPath();
  ctx.moveTo(0, 330);
  for (let x = 0; x <= WORLD_W; x += 60) {
    ctx.lineTo(x, 300 + Math.sin((x + time * 8) * 0.006) * 26);
  }
  ctx.lineTo(WORLD_W, WORLD_H);
  ctx.lineTo(0, WORLD_H);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = palette.hillNear;
  ctx.beginPath();
  ctx.moveTo(0, 386);
  for (let x = 0; x <= WORLD_W; x += 60) {
    ctx.lineTo(x, 360 + Math.cos((x + time * 14) * 0.008) * 20);
  }
  ctx.lineTo(WORLD_W, WORLD_H);
  ctx.lineTo(0, WORLD_H);
  ctx.closePath();
  ctx.fill();
}

function drawRiver(ctx, palette, state) {
  const top = 452;
  const river = ctx.createLinearGradient(0, top, 0, WORLD_H);
  river.addColorStop(0, palette.riverTop);
  river.addColorStop(1, palette.riverBottom);
  ctx.fillStyle = river;
  ctx.fillRect(0, top, WORLD_W, WORLD_H - top);

  ctx.strokeStyle = 'rgba(255,255,255,.32)';
  ctx.lineWidth = 3;
  for (let row = 0; row < 3; row += 1) {
    const y = top + 22 + row * 26;
    ctx.beginPath();
    for (let x = -40; x <= WORLD_W + 40; x += 20) {
      const wave = Math.sin((x + state.time * (70 + row * 26)) * 0.02) * 5;
      if (x === -40) ctx.moveTo(x, y + wave);
      else ctx.lineTo(x, y + wave);
    }
    ctx.stroke();
  }

  ctx.fillStyle = 'rgba(255,255,255,.5)';
  for (const item of state.decor) {
    ctx.beginPath();
    ctx.arc(item.x, item.y + Math.sin(state.time * 2 + item.phase) * 4, item.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawLanes(ctx, palette) {
  ctx.strokeStyle = palette.lane;
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 14]);
  for (const y of LANE_Y) {
    ctx.beginPath();
    ctx.moveTo(FOX_X + 40, y + SLAB_H / 2 + 4);
    ctx.lineTo(WORLD_W, y + SLAB_H / 2 + 4);
    ctx.stroke();
  }
  ctx.setLineDash([]);
}

// Точки раскладываем рядами по четыре — так их видно «кучками», а не сплошной
// россыпью, и ребёнок считает группами.
function drawDots(ctx, color, count) {
  const perRow = count <= 3 ? count : count <= 8 ? Math.ceil(count / 2) : 4;
  const rows = Math.ceil(count / perRow);
  const stepX = 19;
  const stepY = 19;
  const radius = count > 9 ? 6 : 7;
  ctx.fillStyle = color;
  let drawn = 0;
  for (let row = 0; row < rows; row += 1) {
    const inRow = Math.min(perRow, count - drawn);
    const offsetX = -((inRow - 1) * stepX) / 2;
    const offsetY = -((rows - 1) * stepY) / 2 + row * stepY;
    for (let i = 0; i < inRow; i += 1) {
      ctx.beginPath();
      ctx.arc(offsetX + i * stepX, offsetY, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    drawn += inRow;
  }
}

function drawMark(ctx, kind, x, y) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  if (kind === 'cross') {
    ctx.moveTo(-13, -13);
    ctx.lineTo(13, 13);
    ctx.moveTo(13, -13);
    ctx.lineTo(-13, 13);
  } else {
    ctx.moveTo(-14, 0);
    ctx.lineTo(-4, 11);
    ctx.lineTo(15, -12);
  }
  ctx.stroke();
  ctx.restore();
}

function drawSlab(ctx, palette, x, y, slab, options) {
  const scale = options.scale === undefined ? 1 : options.scale;
  const tilt = options.tilt === undefined ? 0 : options.tilt;
  const alpha = options.alpha === undefined ? 1 : options.alpha;
  if (alpha <= 0.02) return;

  const status = slab.state || 'idle';
  const fill = status === 'wrong' ? BAD_FILL : status === 'ok' || status === 'reveal' ? OK_FILL : palette.slab;
  const ink = status === 'idle' || status === 'sink' ? palette.slabInk : '#FFFFFF';

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.rotate(tilt);
  ctx.scale(scale, scale);

  if (options.glow) {
    ctx.shadowColor = 'rgba(255,196,72,.95)';
    ctx.shadowBlur = 26;
  }

  ctx.fillStyle = 'rgba(6,14,36,.18)';
  rrect(ctx, -SLAB_W / 2 + 4, -SLAB_H / 2 + 8, SLAB_W, SLAB_H, 20);
  ctx.fill();

  ctx.fillStyle = fill;
  rrect(ctx, -SLAB_W / 2, -SLAB_H / 2, SLAB_W, SLAB_H, 20);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = options.glow ? 'rgba(255,171,32,.9)' : palette.slabEdge;
  ctx.lineWidth = options.glow ? 4 : 2;
  ctx.stroke();

  if (status === 'idle' || status === 'sink') {
    ctx.fillStyle = 'rgba(8,18,44,.07)';
    rrect(ctx, -SLAB_W / 2 + 10, -SLAB_H / 2 + 9, SLAB_W - 20, 12, 6);
    ctx.fill();
  }

  if (slab.kind === 'dots') {
    drawDots(ctx, ink, slab.value);
  } else {
    ctx.fillStyle = ink;
    ctx.font = '700 44px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(slab.value), 0, 4);
  }

  if (status === 'wrong') drawMark(ctx, 'cross', SLAB_W / 2 - 6, -SLAB_H / 2 + 6);
  if (status === 'reveal' || status === 'ok') drawMark(ctx, 'check', SLAB_W / 2 - 6, -SLAB_H / 2 + 6);

  ctx.restore();
}

function drawTrail(ctx, palette, state) {
  if (state.trail.length === 0) return;

  ctx.strokeStyle = palette.deck;
  ctx.lineWidth = 9;
  ctx.lineCap = 'round';
  ctx.beginPath();
  for (let i = 0; i < state.trail.length; i += 1) {
    const slab = state.trail[i];
    if (i === 0) ctx.moveTo(slab.x, slab.y + SLAB_H / 2 + 6);
    else ctx.lineTo(slab.x, slab.y + SLAB_H / 2 + 6);
  }
  const last = state.trail[state.trail.length - 1];
  ctx.lineTo(FOX_X, last.y + SLAB_H / 2 + 6);
  ctx.stroke();

  for (const slab of state.trail) {
    const pop = slab.life < 0.25 ? 1 + (0.25 - slab.life) * 0.9 : 1;
    drawSlab(ctx, palette, slab.x, slab.y, slab, { scale: pop, alpha: 0.92 });
  }
}

function drawGroup(ctx, palette, state) {
  const group = state.group;
  if (!group) return;

  for (const slot of group.slots) {
    const y = LANE_Y[slot.lane];
    if (slot.state === 'idle') {
      const glow = state.hint && !group.resolved && slot.lane === group.correctLane;
      const bob = Math.sin(state.time * 3 + slot.lane) * 4;
      drawSlab(ctx, palette, group.x, y + bob, slot, { glow });
      continue;
    }
    if (slot.state === 'ok') {
      drawSlab(ctx, palette, group.x, y - slot.anim * 26, slot, {
        scale: 1 + slot.anim * 0.3,
        alpha: 1 - slot.anim,
      });
      continue;
    }
    // Красную и зелёную плиту держим на экране дольше: первые полсекунды они
    // почти не тонут — это и есть объяснение ошибки.
    const hold = slot.state === 'sink' ? 0 : 0.45;
    const fall = Math.max(0, slot.anim - hold) / (1 - hold || 1);
    drawSlab(ctx, palette, group.x, y + fall * 150, slot, {
      tilt: fall * 0.5,
      alpha: 1 - fall * 0.9,
    });
  }
}

function drawBonus(ctx, state) {
  const bonus = state.bonus;
  if (!bonus || bonus.taken) return;
  const y = LANE_Y[bonus.lane] + Math.sin(state.time * 3.4) * 6;

  ctx.save();
  ctx.translate(bonus.x, y);
  ctx.shadowColor = 'rgba(255,196,72,.9)';
  ctx.shadowBlur = 30;
  ctx.fillStyle = '#FFC64B';
  rrect(ctx, -20, -26, 40, 52, 14);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#FFF3D0';
  rrect(ctx, -12, -18, 24, 36, 9);
  ctx.fill();
  ctx.fillStyle = '#E08A1E';
  rrect(ctx, -24, -32, 48, 8, 4);
  ctx.fill();
  rrect(ctx, -24, 24, 48, 8, 4);
  ctx.fill();
  ctx.restore();
}

function drawFox(ctx, state) {
  const fox = state.fox;
  const lift = Math.sin(Math.min(1, fox.hop) * Math.PI) * 40;
  const y = fox.y - 44 - lift + fox.dip * 14;
  const squash = 1 + Math.sin(Math.min(1, fox.hop) * Math.PI) * 0.1;
  const run = Math.sin(state.time * 14) * 3;

  ctx.save();
  ctx.translate(FOX_X, y);

  ctx.fillStyle = 'rgba(6,14,36,.2)';
  ctx.beginPath();
  ctx.ellipse(0, 46 + lift * 0.5, 28 - lift * 0.12, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.scale(1 / squash, squash);

  ctx.fillStyle = '#EF8F3C';
  ctx.beginPath();
  ctx.moveTo(-20, 6);
  ctx.quadraticCurveTo(-58, 2 + run, -46, -26 + run);
  ctx.quadraticCurveTo(-34, -6, -18, -4);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#FFF3E2';
  ctx.beginPath();
  ctx.ellipse(-47, -22 + run, 8, 9, -0.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#D9762A';
  ctx.fillRect(-12, 22, 10, 16 + run);
  ctx.fillRect(6, 22, 10, 16 - run);

  ctx.fillStyle = '#F79A45';
  ctx.beginPath();
  ctx.ellipse(0, 6, 26, 24, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FFF3E2';
  ctx.beginPath();
  ctx.ellipse(4, 14, 15, 13, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#F79A45';
  ctx.beginPath();
  ctx.ellipse(10, -22, 22, 19, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-2, -36);
  ctx.lineTo(2, -56);
  ctx.lineTo(16, -40);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(18, -38);
  ctx.lineTo(28, -54);
  ctx.lineTo(32, -32);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#E4703E';
  ctx.beginPath();
  ctx.moveTo(2, -38);
  ctx.lineTo(4, -50);
  ctx.lineTo(13, -40);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#FFF3E2';
  ctx.beginPath();
  ctx.ellipse(22, -16, 13, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2A2740';
  ctx.beginPath();
  ctx.arc(33, -17, 4, 0, Math.PI * 2);
  ctx.fill();

  if (fox.dip > 0.3) {
    ctx.strokeStyle = '#2A2740';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(11, -27);
    ctx.lineTo(21, -27);
    ctx.stroke();
  } else {
    ctx.fillStyle = '#2A2740';
    ctx.beginPath();
    ctx.arc(16, -27, 3.6, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();

  // Радость после верной плиты — короткие искры над головой.
  if (fox.cheer > 0.05) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, fox.cheer);
    ctx.fillStyle = '#FFC64B';
    for (let i = 0; i < 3; i += 1) {
      const angle = state.time * 6 + i * 2.1;
      ctx.beginPath();
      ctx.arc(FOX_X + Math.cos(angle) * 34, y - 62 + Math.sin(angle) * 10, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

// Подсказка «что искать» — без единого слова: игрок читать ещё не умеет.
// Показываем сам камень с нужным числом, он мягко пульсирует и смотрит
// стрелкой на лисёнка.
function drawTargetBadge(ctx, palette, state) {
  const y = state.fox.y - 136 + state.fox.dip * 8;
  const pulse = 1 + Math.sin(state.time * 3.2) * 0.035;

  ctx.save();
  ctx.translate(FOX_X, y);
  ctx.scale(pulse, pulse);

  ctx.fillStyle = palette.badge;
  rrect(ctx, -62, -38, 124, 76, 24);
  ctx.fill();

  ctx.strokeStyle = 'rgba(80,182,243,.75)';
  ctx.lineWidth = 4;
  rrect(ctx, -62, -38, 124, 76, 24);
  ctx.stroke();

  ctx.fillStyle = palette.badgeInk;
  ctx.font = '700 46px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(state.target), 0, 2);
  ctx.restore();

  ctx.fillStyle = palette.badge;
  ctx.beginPath();
  ctx.moveTo(FOX_X - 11, y + 38);
  ctx.lineTo(FOX_X + 11, y + 38);
  ctx.lineTo(FOX_X, y + 52);
  ctx.closePath();
  ctx.fill();
}

function drawParticles(ctx, state) {
  for (const p of state.particles) {
    const k = 1 - p.life / p.max;
    ctx.globalAlpha = Math.max(0, k);
    ctx.fillStyle = p.kind === 'splash' ? '#8FD4FF' : '#FFC64B';
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.kind === 'splash' ? 5 * k + 1 : 4.5 * k + 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawFlash(ctx, state) {
  if (!state.flash) return;
  const k = Math.max(0, 1 - state.flash.life / 0.4);
  ctx.globalAlpha = k * (state.flash.kind === 'bad' ? 0.3 : 0.16);
  ctx.fillStyle = state.flash.kind === 'bad' ? BAD_FILL : OK_FILL;
  ctx.fillRect(0, 0, WORLD_W, WORLD_H);
  ctx.globalAlpha = 1;
}

export function draw(ctx, state) {
  const palette = state.level.night ? NIGHT : DAY;

  // Тряска при ошибке — ещё один сигнал «это было неверно», кроме цвета.
  const shakeX = state.shake > 0 ? Math.sin(state.time * 70) * 9 * state.shake : 0;
  const shakeY = state.shake > 0 ? Math.cos(state.time * 61) * 6 * state.shake : 0;

  ctx.save();
  ctx.translate(shakeX, shakeY);

  drawSky(ctx, palette, state.time, state.level.night);
  drawHills(ctx, palette, state.time);
  drawRiver(ctx, palette, state);
  drawLanes(ctx, palette);
  drawTrail(ctx, palette, state);
  drawBonus(ctx, state);
  drawGroup(ctx, palette, state);
  drawFox(ctx, state);
  drawTargetBadge(ctx, palette, state);
  drawParticles(ctx, state);

  ctx.restore();

  drawFlash(ctx, state);
}
