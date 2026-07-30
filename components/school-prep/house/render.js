// Отрисовка «Дома знаний». Только вектор, ни одной картинки — игра ничего не
// докачивает и одинаково выглядит на любом устройстве.
//
// draw() ничего не меняет в состоянии, только читает.

import { PLAYER_H, PLAYER_W, WORLD_H, WORLD_W, expectedValue } from './engine.js';

const THEMES = {
  hall: { wall: '#2B3566', wall2: '#222B54', accent: '#6F86D6', floor: '#7A5334', rug: '#C9553F' },
  kitchen: { wall: '#1F4B4A', wall2: '#183D3C', accent: '#57B8A9', floor: '#8A6440', rug: '#D9A441' },
  living: { wall: '#3A2B57', wall2: '#2E2246', accent: '#A279DC', floor: '#7C5638', rug: '#4E7FCB' },
  kids: { wall: '#274A72', wall2: '#1E3B5C', accent: '#5FA8E8', floor: '#8B6242', rug: '#E27BA6' },
  library: { wall: '#3B2E22', wall2: '#2E241B', accent: '#C9A05C', floor: '#6E4C2F', rug: '#7A5C9E' },
  attic: { wall: '#232A46', wall2: '#1A2038', accent: '#8892C8', floor: '#5E4630', rug: '#C98A45' },
};

function rrect(ctx, x, y, w, h, r) {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
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

function drawRoom(ctx, theme, state) {
  const wall = ctx.createLinearGradient(0, 0, 0, WORLD_H);
  wall.addColorStop(0, theme.wall);
  wall.addColorStop(1, theme.wall2);
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, WORLD_W, WORLD_H);

  // Обои в полоску
  ctx.fillStyle = 'rgba(255,255,255,.03)';
  for (let x = 0; x < WORLD_W; x += 56) ctx.fillRect(x, 0, 26, WORLD_H);

  // Окно с ночным небом
  ctx.fillStyle = '#0C1738';
  rrect(ctx, 60, 70, 150, 120, 12);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.75)';
  for (let i = 0; i < 12; i += 1) {
    const x = 74 + ((i * 47) % 122);
    const y = 84 + ((i * 31) % 92);
    ctx.globalAlpha = 0.35 + Math.sin(state.time * 1.6 + i) * 0.35;
    ctx.fillRect(x, y, 2.4, 2.4);
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#FFE9A8';
  ctx.beginPath();
  ctx.arc(176, 104, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = theme.accent;
  ctx.lineWidth = 6;
  rrect(ctx, 60, 70, 150, 120, 12);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(135, 70);
  ctx.lineTo(135, 190);
  ctx.moveTo(60, 130);
  ctx.lineTo(210, 130);
  ctx.lineWidth = 4;
  ctx.stroke();

  // Картина на стене
  ctx.fillStyle = 'rgba(255,255,255,.08)';
  rrect(ctx, 520, 90, 110, 80, 8);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.18)';
  ctx.lineWidth = 5;
  rrect(ctx, 520, 90, 110, 80, 8);
  ctx.stroke();
  ctx.fillStyle = theme.accent;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.moveTo(534, 156);
  ctx.lineTo(566, 112);
  ctx.lineTo(596, 156);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;

  // Плинтус
  ctx.fillStyle = 'rgba(0,0,0,.22)';
  ctx.fillRect(0, 478, WORLD_W, 14);
}

function drawPlatform(ctx, theme, platform) {
  const { x, y, w, h, kind } = platform;

  if (kind === 'floor') {
    ctx.fillStyle = theme.floor;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = 'rgba(0,0,0,.16)';
    for (let i = x; i < x + w; i += 64) ctx.fillRect(i, y, 3, h);
    ctx.fillStyle = theme.rug;
    rrect(ctx, 300, y + 6, 360, 12, 6);
    ctx.fill();
    return;
  }

  ctx.fillStyle = 'rgba(4,8,22,.28)';
  rrect(ctx, x + 4, y + 7, w, h, 8);
  ctx.fill();

  if (kind === 'sofa' || kind === 'bed') {
    ctx.fillStyle = theme.rug;
    rrect(ctx, x, y, w, h + 26, 12);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.16)';
    rrect(ctx, x + 10, y + 6, w - 20, 10, 5);
    ctx.fill();
    return;
  }

  if (kind === 'fridge' || kind === 'chest' || kind === 'cabinet' || kind === 'box') {
    ctx.fillStyle = theme.accent;
    rrect(ctx, x, y, w, h + 60, 10);
    ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,.18)';
    ctx.fillRect(x + 12, y + h + 16, w - 24, 5);
    ctx.fillStyle = 'rgba(255,255,255,.2)';
    rrect(ctx, x + 8, y + 5, w - 16, 8, 4);
    ctx.fill();
    return;
  }

  if (kind === 'table' || kind === 'counter' || kind === 'stool' || kind === 'bench') {
    ctx.fillStyle = '#8B6242';
    rrect(ctx, x, y, w, h, 7);
    ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,.3)';
    ctx.fillRect(x + 10, y + h, 10, 70);
    ctx.fillRect(x + w - 20, y + h, 10, 70);
    ctx.fillStyle = 'rgba(255,255,255,.14)';
    rrect(ctx, x + 6, y + 3, w - 12, 5, 3);
    ctx.fill();
    return;
  }

  // Полка или балка
  ctx.fillStyle = kind === 'beam' ? '#6E4C2F' : theme.accent;
  rrect(ctx, x, y, w, h, 6);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.18)';
  rrect(ctx, x + 6, y + 3, w - 12, 4, 2);
  ctx.fill();
  if (kind === 'shelf') {
    ctx.fillStyle = 'rgba(0,0,0,.22)';
    ctx.fillRect(x + 6, y + h, 8, 16);
    ctx.fillRect(x + w - 14, y + h, 8, 16);
  }
}

function drawItem(ctx, item, needed, time) {
  if (item.taken) return;
  const bounce = item.bounce > 0 ? Math.sin(item.bounce * Math.PI) * 16 : 0;
  const float = Math.sin(time * 3 + item.x * 0.02) * 4;
  const y = item.y + float - bounce;

  ctx.save();
  ctx.translate(item.x, y);

  if (needed) {
    // Нужную цифру подсвечиваем и подписываем стрелкой — ребёнок не должен
    // гадать, что от него хотят.
    const pulse = 1 + Math.sin(time * 5) * 0.09;
    ctx.save();
    ctx.scale(pulse, pulse);
    ctx.shadowColor = 'rgba(255,214,110,.95)';
    ctx.shadowBlur = 26;
    ctx.fillStyle = '#FFD86E';
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = '#FFD86E';
    ctx.beginPath();
    ctx.moveTo(-9, -40);
    ctx.lineTo(9, -40);
    ctx.lineTo(0, -28);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.fillStyle = item.bounce > 0 ? '#F2504B' : 'rgba(255,255,255,.86)';
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = needed ? '#3A2B08' : '#17244A';
  ctx.font = '700 26px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(item.value), 0, 1);
  ctx.restore();
}

function drawKey(ctx, key, active, time) {
  ctx.save();
  ctx.translate(key.x, key.y + Math.sin(time * 3) * 5);
  if (active) {
    ctx.shadowColor = 'rgba(255,214,110,.9)';
    ctx.shadowBlur = 24;
  }
  ctx.fillStyle = active ? '#FFD86E' : 'rgba(255,216,110,.35)';
  ctx.beginPath();
  ctx.arc(-8, 0, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(-2, -4, 24, 8);
  ctx.fillRect(14, 0, 5, 10);
  ctx.fillRect(6, 0, 5, 8);
  ctx.restore();
}

function drawDoor(ctx, door, open, time) {
  ctx.save();
  ctx.translate(door.x, door.y);

  ctx.fillStyle = open ? '#FFD86E' : '#5A4126';
  if (open) {
    ctx.shadowColor = 'rgba(255,214,110,.85)';
    ctx.shadowBlur = 30;
  }
  rrect(ctx, 0, 0, 56, 92, 10);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = open ? 'rgba(255,255,255,.55)' : 'rgba(0,0,0,.3)';
  rrect(ctx, 8, 8, 40, 34, 6);
  ctx.fill();
  ctx.fillStyle = open ? '#3A2B08' : '#D8B45F';
  ctx.beginPath();
  ctx.arc(44, 54, 5, 0, Math.PI * 2);
  ctx.fill();

  if (open) {
    ctx.fillStyle = '#FFD86E';
    ctx.globalAlpha = 0.6 + Math.sin(time * 4) * 0.3;
    ctx.beginPath();
    ctx.moveTo(19, -22);
    ctx.lineTo(37, -22);
    ctx.lineTo(28, -8);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

function drawHazard(ctx, hazard, time) {
  ctx.save();
  ctx.fillStyle = 'rgba(90,170,255,.55)';
  rrect(ctx, hazard.x, hazard.y, hazard.w, hazard.h, 8);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.5)';
  const shine = (Math.sin(time * 2) * 0.5 + 0.5) * (hazard.w - 26);
  rrect(ctx, hazard.x + 8 + shine, hazard.y + 4, 16, 4, 2);
  ctx.fill();
  ctx.restore();
}

function drawFox(ctx, state) {
  const p = state.player;
  const x = p.x + PLAYER_W / 2;
  const y = p.y + PLAYER_H;
  const run = p.onGround && Math.abs(p.vx) > 12 ? Math.sin(p.anim * 2) * 7 : 0;
  const air = !p.onGround;

  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = 'rgba(4,8,22,.3)';
  ctx.beginPath();
  ctx.ellipse(0, 4, 20, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.scale(p.face, 1);
  ctx.translate(0, -PLAYER_H + 6);

  // хвост
  ctx.fillStyle = '#EF8F3C';
  ctx.beginPath();
  ctx.moveTo(-12, 28);
  ctx.quadraticCurveTo(-40, 22 + run, -30, 2 + run);
  ctx.quadraticCurveTo(-20, 18, -8, 20);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#FFF3E2';
  ctx.beginPath();
  ctx.ellipse(-31, 4 + run, 6, 7, -0.5, 0, Math.PI * 2);
  ctx.fill();

  // лапы
  ctx.fillStyle = '#D9762A';
  if (air) {
    ctx.fillRect(-12, 34, 9, 12);
    ctx.fillRect(4, 30, 9, 12);
  } else {
    ctx.fillRect(-12, 34 + run * 0.4, 9, 14 - run * 0.4);
    ctx.fillRect(4, 34 - run * 0.4, 9, 14 + run * 0.4);
  }

  // тело
  ctx.fillStyle = '#F79A45';
  ctx.beginPath();
  ctx.ellipse(0, 24, 17, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FFF3E2';
  ctx.beginPath();
  ctx.ellipse(4, 29, 10, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // голова
  ctx.fillStyle = '#F79A45';
  ctx.beginPath();
  ctx.ellipse(4, 2, 16, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-6, -8);
  ctx.lineTo(-3, -24);
  ctx.lineTo(8, -12);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(10, -12);
  ctx.lineTo(19, -24);
  ctx.lineTo(21, -6);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#FFF3E2';
  ctx.beginPath();
  ctx.ellipse(13, 7, 10, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2A2740';
  ctx.beginPath();
  ctx.arc(22, 6, 3.4, 0, Math.PI * 2);
  ctx.fill();

  if (p.slip > 0.25) {
    ctx.strokeStyle = '#2A2740';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(4, -2);
    ctx.lineTo(12, -2);
    ctx.stroke();
  } else {
    ctx.fillStyle = '#2A2740';
    ctx.beginPath();
    ctx.arc(8, -2, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Звёздочки при поскальзывании
  if (p.slip > 0.05) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, p.slip);
    ctx.fillStyle = '#FFD86E';
    for (let i = 0; i < 3; i += 1) {
      const angle = state.time * 7 + i * 2.1;
      ctx.beginPath();
      ctx.arc(x + Math.cos(angle) * 22, y - PLAYER_H - 12 + Math.sin(angle) * 8, 3.4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

export function draw(ctx, state) {
  const theme = THEMES[state.room.theme] || THEMES.hall;
  const need = expectedValue(state);

  drawRoom(ctx, theme, state);

  for (const platform of state.room.platforms) drawPlatform(ctx, theme, platform);
  for (const hazard of state.room.hazards) drawHazard(ctx, hazard, state.time);

  drawDoor(ctx, state.room.door, state.doorOpen, state.time);
  if (state.room.key && !state.keyTaken) {
    drawKey(ctx, state.room.key, state.expectedIndex >= state.room.order.length, state.time);
  }

  for (const item of state.items) drawItem(ctx, item, item.value === need, state.time);

  drawFox(ctx, state);

  for (const spark of state.sparks) {
    const k = 1 - spark.life / spark.max;
    ctx.globalAlpha = Math.max(0, k);
    ctx.fillStyle = spark.kind === 'wrong' ? '#F2504B' : '#FFD86E';
    ctx.beginPath();
    ctx.arc(spark.x, spark.y, 4 * k + 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}
