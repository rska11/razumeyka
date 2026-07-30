import { FOX_X, LANE_Y, SLAB_H, SLAB_W, WORLD_H, WORLD_W } from './engine.js';

const SCENE_TINTS = {
  day: ['rgba(9,37,72,.05)', 'rgba(3,22,50,.24)'],
  sunset: ['rgba(83,34,92,.05)', 'rgba(31,16,62,.32)'],
  night: ['rgba(11,19,56,.08)', 'rgba(3,8,32,.44)'],
};

const OK = '#54E6AE';
const BAD = '#FF6B72';
const GOLD = '#FFD467';

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

function coverImage(ctx, image) {
  const iw = image.naturalWidth || image.width;
  const ih = image.naturalHeight || image.height;
  const scale = Math.max(WORLD_W / iw, WORLD_H / ih);
  const sw = WORLD_W / scale;
  const sh = WORLD_H / scale;
  const sx = (iw - sw) / 2;
  const sy = (ih - sh) / 2;
  ctx.drawImage(image, sx, sy, sw, sh, 0, 0, WORLD_W, WORLD_H);
}

function drawBackground(ctx, state, assets) {
  const scene = state.level.scene || 'day';
  const image = assets && assets[scene];
  if (image && image.complete && image.naturalWidth > 0) {
    coverImage(ctx, image);
  } else {
    const gradient = ctx.createLinearGradient(0, 0, 0, WORLD_H);
    gradient.addColorStop(0, scene === 'night' ? '#111B59' : scene === 'sunset' ? '#8E6FB8' : '#70C9F4');
    gradient.addColorStop(1, scene === 'night' ? '#172D66' : scene === 'sunset' ? '#F0A778' : '#176D99');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);
  }

  const [top, bottom] = SCENE_TINTS[scene] || SCENE_TINTS.day;
  const tint = ctx.createLinearGradient(0, 0, 0, WORLD_H);
  tint.addColorStop(0, top);
  tint.addColorStop(0.44, 'rgba(5,15,38,.08)');
  tint.addColorStop(1, bottom);
  ctx.fillStyle = tint;
  ctx.fillRect(0, 0, WORLD_W, WORLD_H);

  // A soft river corridor separates interactive stones from the detailed art.
  const corridor = ctx.createLinearGradient(0, 145, 0, WORLD_H);
  corridor.addColorStop(0, 'rgba(8,25,58,0)');
  corridor.addColorStop(0.25, 'rgba(5,28,62,.12)');
  corridor.addColorStop(1, 'rgba(5,18,48,.32)');
  ctx.fillStyle = corridor;
  ctx.fillRect(0, 120, WORLD_W, WORLD_H - 120);
}

function drawCurrents(ctx, state) {
  for (let lane = 0; lane < LANE_Y.length; lane += 1) {
    const y = LANE_Y[lane] + SLAB_H / 2 + 8;
    const alpha = state.fox.lane === lane ? 0.34 : 0.15;
    const line = ctx.createLinearGradient(FOX_X + 58, y, WORLD_W, y);
    line.addColorStop(0, `rgba(135,226,255,${alpha * 0.2})`);
    line.addColorStop(0.45, `rgba(135,226,255,${alpha})`);
    line.addColorStop(1, 'rgba(135,226,255,0)');
    ctx.strokeStyle = line;
    ctx.lineWidth = state.fox.lane === lane ? 4 : 2;
    ctx.setLineDash([18, 16]);
    ctx.lineDashOffset = -state.time * (34 + lane * 5);
    ctx.beginPath();
    ctx.moveTo(FOX_X + 58, y);
    ctx.lineTo(WORLD_W, y);
    ctx.stroke();
  }
  ctx.setLineDash([]);
}

function drawDots(ctx, color, count) {
  const columns = count <= 5 ? count : 5;
  const rows = Math.ceil(count / columns);
  const gapX = 20;
  const gapY = 20;
  let index = 0;
  ctx.fillStyle = color;
  for (let row = 0; row < rows; row += 1) {
    const inRow = Math.min(columns, count - index);
    const startX = -((inRow - 1) * gapX) / 2;
    for (let col = 0; col < inRow; col += 1) {
      ctx.beginPath();
      ctx.arc(startX + col * gapX, (row - (rows - 1) / 2) * gapY, 6.5, 0, Math.PI * 2);
      ctx.fill();
      index += 1;
    }
  }
}

function drawMark(ctx, ok) {
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  if (ok) {
    ctx.moveTo(-11, 0);
    ctx.lineTo(-2, 9);
    ctx.lineTo(14, -11);
  } else {
    ctx.moveTo(-11, -11);
    ctx.lineTo(11, 11);
    ctx.moveTo(11, -11);
    ctx.lineTo(-11, 11);
  }
  ctx.stroke();
}

function drawStone(ctx, x, y, slab, options = {}) {
  const status = slab.state || 'idle';
  const scale = options.scale ?? 1;
  const alpha = options.alpha ?? 1;
  const tilt = options.tilt ?? 0;
  if (alpha <= 0.02) return;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.rotate(tilt);
  ctx.scale(scale, scale);

  const fill = ctx.createLinearGradient(0, -SLAB_H / 2, 0, SLAB_H / 2);
  if (status === 'wrong') {
    fill.addColorStop(0, '#FF8B8F');
    fill.addColorStop(1, '#E94758');
  } else if (status === 'ok' || status === 'reveal') {
    fill.addColorStop(0, '#8AF2C9');
    fill.addColorStop(1, '#2FC58B');
  } else {
    fill.addColorStop(0, '#FBFDFF');
    fill.addColorStop(0.58, '#EAF4FF');
    fill.addColorStop(1, '#BFD8EE');
  }

  ctx.shadowColor = options.glow ? 'rgba(255,212,103,.95)' : 'rgba(3,17,43,.38)';
  ctx.shadowBlur = options.glow ? 34 : 18;
  ctx.shadowOffsetY = options.glow ? 0 : 12;
  ctx.fillStyle = fill;
  rrect(ctx, -SLAB_W / 2, -SLAB_H / 2, SLAB_W, SLAB_H, 32);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  ctx.strokeStyle = options.glow ? GOLD : status === 'idle' ? 'rgba(255,255,255,.9)' : 'rgba(255,255,255,.72)';
  ctx.lineWidth = options.glow ? 5 : 3;
  ctx.stroke();

  ctx.fillStyle = status === 'idle' ? 'rgba(255,255,255,.52)' : 'rgba(255,255,255,.26)';
  rrect(ctx, -SLAB_W / 2 + 13, -SLAB_H / 2 + 11, SLAB_W - 26, 12, 6);
  ctx.fill();

  const ink = status === 'idle' ? '#112446' : '#fff';
  if (slab.kind === 'dots') {
    drawDots(ctx, ink, slab.value);
  } else {
    ctx.fillStyle = ink;
    ctx.font = '900 45px system-ui, -apple-system, "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(slab.value), 0, 5);
  }

  if (status === 'wrong' || status === 'ok' || status === 'reveal') {
    ctx.save();
    ctx.translate(SLAB_W / 2 - 18, -SLAB_H / 2 + 17);
    drawMark(ctx, status !== 'wrong');
    ctx.restore();
  }
  ctx.restore();
}

function drawTrail(ctx, state) {
  if (!state.trail.length) return;
  ctx.strokeStyle = 'rgba(255,220,136,.58)';
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.beginPath();
  state.trail.forEach((stone, index) => {
    if (index === 0) ctx.moveTo(stone.x, stone.y + 48);
    else ctx.lineTo(stone.x, stone.y + 48);
  });
  ctx.lineTo(FOX_X, state.fox.y + 48);
  ctx.stroke();
  for (const stone of state.trail) drawStone(ctx, stone.x, stone.y, stone, { scale: 0.82, alpha: 0.72 });
}

function drawGroup(ctx, state) {
  const group = state.group;
  if (!group) return;
  for (const slot of group.slots) {
    const y = LANE_Y[slot.lane] + Math.sin(state.time * 2.6 + slot.lane) * 3;
    if (slot.state === 'idle') {
      drawStone(ctx, group.x, y, slot, { glow: state.hint && !group.resolved && slot.lane === group.correctLane });
    } else if (slot.state === 'ok') {
      drawStone(ctx, group.x, y - slot.anim * 18, slot, { scale: 1 + slot.anim * 0.15, alpha: 1 - slot.anim * 0.65 });
    } else {
      const hold = 0.48;
      const fall = Math.max(0, slot.anim - hold) / (1 - hold);
      drawStone(ctx, group.x, y + fall * 145, slot, { tilt: fall * 0.38, alpha: 1 - fall * 0.78 });
    }
  }
}

function drawBonus(ctx, state) {
  const bonus = state.bonus;
  if (!bonus || bonus.taken) return;
  const y = LANE_Y[bonus.lane] + Math.sin(state.time * 3) * 6;
  ctx.save();
  ctx.translate(bonus.x, y);
  ctx.shadowColor = 'rgba(255,212,103,.95)';
  ctx.shadowBlur = 28;
  const gradient = ctx.createRadialGradient(-5, -7, 3, 0, 0, 28);
  gradient.addColorStop(0, '#FFFBE2');
  gradient.addColorStop(0.35, '#FFD467');
  gradient.addColorStop(1, '#E58A2D');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(0, -28);
  ctx.lineTo(24, 0);
  ctx.lineTo(0, 28);
  ctx.lineTo(-24, 0);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();
}

function drawFallbackFox(ctx, x, y) {
  const body = ctx.createLinearGradient(0, -50, 0, 45);
  body.addColorStop(0, '#FFB04B');
  body.addColorStop(1, '#E96C32');
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.ellipse(x, y, 35, 44, -0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FFF2DA';
  ctx.beginPath();
  ctx.ellipse(x + 19, y - 25, 22, 18, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawFox(ctx, state, assets) {
  const lift = Math.sin(Math.min(1, state.fox.hop) * Math.PI) * 30;
  const bounce = Math.sin(state.time * 8) * 2;
  const y = state.fox.y - 42 - lift + state.fox.dip * 12 + bounce;
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = '#06142F';
  ctx.beginPath();
  ctx.ellipse(FOX_X, state.fox.y + 44, 52 - lift * 0.3, 11, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const image = assets && assets.fox;
  if (image && image.complete && image.naturalWidth > 0) {
    ctx.save();
    const lean = state.fox.hop > 0 ? -0.04 : 0;
    const frameCount = 4;
    const frame = state.fox.hop > 0 ? 2 : Math.floor(state.time * 8) % frameCount;
    const frameWidth = image.naturalWidth / frameCount;
    ctx.translate(FOX_X, y);
    ctx.rotate(lean);
    ctx.drawImage(image, frame * frameWidth, 0, frameWidth, image.naturalHeight, -90, -88, 180, 184);
    ctx.restore();
  } else {
    drawFallbackFox(ctx, FOX_X, y);
  }

  if (state.fox.cheer > 0.05) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, state.fox.cheer);
    ctx.fillStyle = GOLD;
    for (let i = 0; i < 5; i += 1) {
      const angle = state.time * 5 + i * 1.25;
      ctx.beginPath();
      ctx.arc(FOX_X + Math.cos(angle) * 56, y - 65 + Math.sin(angle) * 12, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

function drawParticles(ctx, state) {
  for (const p of state.particles) {
    const opacity = Math.max(0, 1 - p.life / p.max);
    ctx.globalAlpha = opacity;
    ctx.fillStyle = p.kind === 'splash' ? '#9DDEFF' : GOLD;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2 + opacity * 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawFlash(ctx, state) {
  if (!state.flash) return;
  const opacity = Math.max(0, 1 - state.flash.life / 0.38);
  ctx.globalAlpha = opacity * (state.flash.kind === 'bad' ? 0.18 : 0.11);
  ctx.fillStyle = state.flash.kind === 'bad' ? BAD : OK;
  ctx.fillRect(0, 0, WORLD_W, WORLD_H);
  ctx.globalAlpha = 1;
}

export function draw(ctx, state, assets) {
  const shakeX = state.shake > 0 ? Math.sin(state.time * 68) * 7 * state.shake : 0;
  const shakeY = state.shake > 0 ? Math.cos(state.time * 57) * 4 * state.shake : 0;
  ctx.save();
  ctx.translate(shakeX, shakeY);
  drawBackground(ctx, state, assets);
  drawCurrents(ctx, state);
  drawTrail(ctx, state);
  drawBonus(ctx, state);
  drawGroup(ctx, state);
  drawFox(ctx, state, assets);
  drawParticles(ctx, state);
  ctx.restore();
  drawFlash(ctx, state);
}