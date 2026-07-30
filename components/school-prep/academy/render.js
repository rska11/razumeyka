const rounded = (ctx, x, y, w, h, r) => {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
};

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 2) {
  const words = String(text || '').split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(candidate).width > maxWidth) {
      lines.push(line);
      line = word;
      if (lines.length >= maxLines - 1) break;
    } else {
      line = candidate;
    }
  }
  if (line && lines.length < maxLines) lines.push(line);
  lines.forEach((item, index) => ctx.fillText(item, x, y + index * lineHeight));
}
function cover(ctx, image, width, height) {
  if (!image?.complete || !image.naturalWidth) return;
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const sw = width / scale;
  const sh = height / scale;
  const sx = (image.naturalWidth - sw) / 2;
  const sy = (image.naturalHeight - sh) / 2;
  ctx.drawImage(image, sx, sy, sw, sh, 0, 0, width, height);
}

function drawPlatform(ctx, p) {
  if (p.kind === 'ground') {
    const gradient = ctx.createLinearGradient(0, p.y, 0, p.y + p.h);
    gradient.addColorStop(0, '#d9b65c');
    gradient.addColorStop(0.12, '#885e3b');
    gradient.addColorStop(1, '#26334e');
    ctx.fillStyle = gradient;
    rounded(ctx, p.x, p.y, p.w, p.h + 30, 18);
    ctx.fill();
    ctx.fillStyle = '#f8de85';
    rounded(ctx, p.x, p.y, p.w, 13, 8);
    ctx.fill();
    return;
  }

  if (p.kind === 'step') {
    const floorY = p.floorY || 620;
    const body = ctx.createLinearGradient(0, p.y, 0, floorY);
    body.addColorStop(0, '#aeefff');
    body.addColorStop(0.16, '#4389b2');
    body.addColorStop(1, '#183a61');
    ctx.fillStyle = body;
    ctx.globalAlpha = 0.92;
    rounded(ctx, p.x, p.y, p.w, floorY - p.y + 16, 12);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#e9fbff';
    rounded(ctx, p.x + 8, p.y + 4, p.w - 16, 6, 3);
    ctx.fill();
    ctx.fillStyle = '#0b3555';
    ctx.font = '900 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`СТУПЕНЬ ${p.step}`, p.x + p.w / 2, p.y + 15);
    return;
  }
  const colors = {
    moving: ['#52d6e9', '#186e99'],
    spring: ['#ffb83f', '#e95a46'],
    crumble: ['#d89b67', '#704a52'],
    switch: ['#8d7cff', '#4d3ea9'],
    numberPad: ['#67dff4', '#286db6'],
    comparePad: ['#ffd56a', '#d37b2b'],
    compositionPad: ['#78edbd', '#238b75'],
    step: ['#b9f4ff', '#3d7faf'],
    stone: ['#d7e8ec', '#6e8aa3'],
    bridge: ['#ffd879', '#8d542d'],
    lift: ['#8feaff', '#3265bd'],
    crystal: ['#ffe889', '#d17d35'],
    gear: ['#ff9f68', '#7041a5'],
    conveyor: ['#89e1ef', '#324c8d'],
    symbolPad: ['#ffe689', '#d47a35'],
    rhythmPad: ['#88dfff', '#5544a8'],
  };
  const baseColors = p.locked ? ['#a9b5c2', '#596675'] : (colors[p.kind] || colors.stone);
  const [top, bottom] = p.answerState === 'correct'
    ? ['#83f4c1', '#15966f']
    : p.answerState === 'wrong'
      ? ['#ff9b9b', '#d9485f']
      : baseColors;
  const gradient = ctx.createLinearGradient(0, p.y, 0, p.y + p.h);
  gradient.addColorStop(0, top);
  gradient.addColorStop(1, bottom);
  ctx.shadowColor = '#07112e80';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 6;
  ctx.fillStyle = gradient;
  rounded(ctx, p.x, p.y, p.w, p.h, 10);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#ffffff88';
  rounded(ctx, p.x + 8, p.y + 4, p.w - 16, 4, 3);
  ctx.fill();

  if (p.locked) {
    ctx.fillStyle = '#d9e5ee';
    ctx.font = '900 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('…', p.x + p.w / 2, p.y - 7);
    ctx.fillStyle = '#07152e';
    ctx.font = '900 9px sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText('СНАЧАЛА ПРОЧИТАЙ', p.x + p.w / 2, p.y + p.h / 2 + 1);
    return;
  }  if (p.answerState) {
    ctx.strokeStyle = p.answerState === 'correct' ? '#d9fff0' : '#ffe1e1';
    ctx.lineWidth = 4;
    rounded(ctx, p.x + 2, p.y + 2, p.w - 4, p.h - 4, 8);
    ctx.stroke();
    ctx.fillStyle = p.answerState === 'correct' ? '#0a654a' : '#8f1f35';
    ctx.font = '900 26px sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText(p.answerState === 'correct' ? '✓' : '×', p.x + p.w - 12, p.y - 7);
  }
  if (p.kind === 'spring') {
    ctx.fillStyle = '#fff7bc';
    for (let i = 0; i < 3; i += 1) {
      ctx.fillRect(p.x + p.w / 2 - 35 + i * 28, p.y - 12, 14, 12);
    }
  }
  if (p.kind === 'switch') {
    const colorsRune = ['#66e6ff', '#ffd65a', '#ff7db5'];
    const centerX = p.x + p.w / 2;
    const centerY = p.y - 15;
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.fillStyle = colorsRune[p.rune];
    ctx.strokeStyle = '#ffffffc9';
    ctx.lineWidth = 3;
    ctx.beginPath();
    if (p.shape === 'diamond') {
      ctx.moveTo(0, -22);
      ctx.lineTo(22, 0);
      ctx.lineTo(0, 22);
      ctx.lineTo(-22, 0);
      ctx.closePath();
    } else if (p.shape === 'triangle') {
      ctx.moveTo(0, -23);
      ctx.lineTo(23, 19);
      ctx.lineTo(-23, 19);
      ctx.closePath();
    } else {
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  if (p.kind === 'bridge') {
    ctx.fillStyle = '#68401f';
    for (let x = p.x + 22; x < p.x + p.w - 10; x += 38) {
      ctx.beginPath(); ctx.arc(x, p.y + p.h / 2, 4, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = '#ffe5a5'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(p.x + 10, p.y + 8); ctx.lineTo(p.x + p.w - 10, p.y + 8); ctx.stroke();
  }
  if (p.kind === 'lift' || p.kind === 'crystal') {
    ctx.save(); ctx.translate(p.x + p.w / 2, p.y + p.h + 12);
    ctx.rotate(Math.PI / 4); ctx.fillStyle = p.kind === 'lift' ? '#72eaffaa' : '#ffd86aaa';
    ctx.fillRect(-13, -13, 26, 26); ctx.restore();
  }
  if (p.kind === 'gear') {
    ctx.save(); ctx.translate(p.x + p.w / 2, p.y + p.h + 17);
    ctx.rotate((p.x % 7) * .2); ctx.strokeStyle = '#ffbd72'; ctx.lineWidth = 9;
    ctx.beginPath(); ctx.arc(0, 0, (p.gearSize || 72) / 2, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#382c69'; ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }
  if (p.kind === 'conveyor') {
    ctx.fillStyle = '#e9fbff'; ctx.font = '900 17px sans-serif'; ctx.textAlign = 'center';
    const arrow = p.direction > 0 ? '›' : '‹';
    for (let x = p.x + 28; x < p.x + p.w - 12; x += 42) ctx.fillText(arrow, x, p.y + 20);
  }
  if (p.kind === 'symbolPad') {
    ctx.fillStyle = '#07152e';
    ctx.font = '900 34px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(String(p.value), p.x + p.w / 2, p.y - 6);
  }
  if (p.kind === 'rhythmPad') {
    ctx.shadowColor = p.color || '#fff';
    ctx.shadowBlur = 22;
    ctx.fillStyle = p.color || '#fff';
    ctx.beginPath();
    ctx.arc(p.x + p.w / 2, p.y - 18, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#ffffffdd';
    ctx.beginPath();
    ctx.arc(p.x + p.w / 2 - 6, p.y - 25, 6, 0, Math.PI * 2);
    ctx.fill();
  }  if (p.kind === 'numberPad') {
    ctx.fillStyle = '#07152e';
    ctx.font = '900 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(String(p.value), p.x + p.w / 2, p.y - 7);
  }
  if (p.kind === 'comparePad' || p.kind === 'compositionPad') {
    const amount = p.amount || 0;
    const gap = 19;
    const start = p.x + p.w / 2 - ((amount - 1) * gap) / 2;
    ctx.fillStyle = p.kind === 'comparePad' ? '#fff3b0' : '#d7ffec';
    for (let i = 0; i < amount; i += 1) {
      ctx.beginPath();
      ctx.arc(start + i * gap, p.y - 12, 7, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#07152e';
    ctx.font = '900 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(String(amount), p.x + p.w / 2, p.y + 17);
  }
}

function drawWorkshop(ctx, challenge, state, time, accent) {
  const x = challenge.zone.x + 18;
  const y = 142;
  const w = challenge.zone.w - 36;
  const done = Boolean(state.challengeProgress[challenge.id]);
  const ready = Boolean(state.challengeReady[challenge.id]);
  const pulse = 8 + Math.sin(time * 3 + challenge.number) * 5;

  ctx.save();
  const roomTop = 105;
  const roomHeight = 515;
  ctx.fillStyle = done ? `${accent}18` : '#07152e38';
  rounded(ctx, challenge.zone.x, roomTop, challenge.zone.w, roomHeight, 32);
  ctx.fill();
  ctx.strokeStyle = done ? `${accent}90` : '#ffffff28';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(challenge.zone.x + 8, roomTop + roomHeight);
  ctx.lineTo(challenge.zone.x + 8, roomTop + 40);
  ctx.quadraticCurveTo(challenge.zone.x + 8, roomTop + 8, challenge.zone.x + 40, roomTop + 8);
  ctx.lineTo(challenge.zone.x + challenge.zone.w - 40, roomTop + 8);
  ctx.quadraticCurveTo(challenge.zone.x + challenge.zone.w - 8, roomTop + 8, challenge.zone.x + challenge.zone.w - 8, roomTop + 40);
  ctx.lineTo(challenge.zone.x + challenge.zone.w - 8, roomTop + roomHeight);
  ctx.stroke();
  ctx.fillStyle = done ? accent : '#8eb5d8';
  for (let bolt = 0; bolt < 6; bolt += 1) {
    const bx = challenge.zone.x + 45 + bolt * ((challenge.zone.w - 90) / 5);
    ctx.beginPath(); ctx.arc(bx, roomTop + 9, 5, 0, Math.PI * 2); ctx.fill();
  }

  ctx.fillStyle = done ? '#092d3dcc' : '#07152ed9';
  ctx.shadowColor = done ? `${accent}88` : '#06112599';
  ctx.shadowBlur = done ? 28 + pulse : 18;
  rounded(ctx, x, y, w, 190, 26);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = done ? accent : `${accent}80`;
  ctx.lineWidth = done ? 4 : 2;
  rounded(ctx, x, y, w, 190, 26);
  ctx.stroke();

  ctx.fillStyle = done ? accent : '#ffffff20';
  rounded(ctx, x + 18, y + 16, 150, 27, 14);
  ctx.fill();
  ctx.fillStyle = done ? '#07152e' : accent;
  ctx.font = '900 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`МАСТЕРСКАЯ ${challenge.number} / 3`, x + 93, y + 29);

  for (let i = 0; i < 3; i += 1) {
    ctx.fillStyle = i < challenge.number - 1 || done ? accent : '#ffffff25';
    ctx.beginPath();
    ctx.arc(x + w - 78 + i * 22, y + 29, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = done ? '#9effdc' : '#ffffffb8';
  ctx.font = '800 14px sans-serif';
  ctx.fillText(done ? 'МЕХАНИЗМ ЗАПУЩЕН' : ready ? 'ПУЛЬТ АКТИВЕН — ВЫБЕРИ ОТВЕТ' : 'ОСТАНОВИСЬ И ПРОЧИТАЙ ЗАДАНИЕ', x + 24, y + 70);
  ctx.fillStyle = '#fff';
  ctx.font = '900 30px sans-serif';
  ctx.fillText(done ? 'Дорога построена ✓' : challenge.prompt, x + 24, y + 112);
  ctx.fillStyle = done ? '#c8ffef' : '#ffffff9c';
  ctx.font = '700 13px sans-serif';
  drawWrappedText(ctx, done ? challenge.successDetail : challenge.note, x + 24, y + 143, w - 240, 18, 2);

  const pipeY = y + 190;
  ctx.strokeStyle = done ? `${accent}aa` : '#5682a780';
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.moveTo(x + 46, pipeY);
  ctx.lineTo(x + 46, 390);
  ctx.moveTo(x + w - 46, pipeY);
  ctx.lineTo(x + w - 46, 390);
  ctx.stroke();
  ctx.save();
  ctx.globalAlpha = done ? .9 : .55;
  if (challenge.theme === 'energy') {
    const cx = x + w - 116;
    ctx.strokeStyle = accent; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(cx, y + 74); ctx.lineTo(cx, y + 132); ctx.moveTo(cx - 48, y + 91); ctx.lineTo(cx + 48, y + 91); ctx.stroke();
    ctx.fillStyle = accent;
    ctx.beginPath(); ctx.arc(cx, y + 72, 9, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx - 48, y + 110, 30, 10, 0, 0, Math.PI * 2); ctx.ellipse(cx + 48, y + 110, 30, 10, 0, 0, Math.PI * 2); ctx.fill();
  } else if (challenge.theme === 'rhythm') {
    for (let i = 0; i < 3; i += 1) {
      const gx = x + w - 155 + i * 48;
      const gy = y + 103 + (i % 2) * 20;
      ctx.strokeStyle = i === 1 ? '#ffd65a' : accent; ctx.lineWidth = 8;
      ctx.beginPath(); ctx.arc(gx, gy, 18 + i * 2, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(gx, gy, 5, 0, Math.PI * 2); ctx.fill();
    }
  } else if (challenge.theme === 'reactor') {
    const rx = x + w - 145;
    ctx.strokeStyle = accent; ctx.lineWidth = 6;
    rounded(ctx, rx, y + 68, 105, 70, 18); ctx.stroke();
    ctx.fillStyle = accent;
    for (let i = 0; i < 3; i += 1) { ctx.beginPath(); ctx.arc(rx + 25 + i * 28, y + 103, 9, 0, Math.PI * 2); ctx.fill(); }
  } else {
    ctx.fillStyle = accent; ctx.font = '900 32px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('1 2 3', x + w - 105, y + 116);
  }
  ctx.restore();  ctx.restore();
}
function drawHazard(ctx, hazard, time) {
  if (hazard.kind === 'pendulum') {
    const angle = Math.sin(time * 1.6 + hazard.phase) * .78;
    const x = hazard.pivotX + Math.sin(angle) * hazard.length;
    const y = hazard.pivotY + Math.cos(angle) * hazard.length;
    ctx.strokeStyle = '#ffe49c'; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(hazard.pivotX, hazard.pivotY); ctx.lineTo(x, y); ctx.stroke();
    ctx.shadowColor = '#ffb64f'; ctx.shadowBlur = 18; ctx.fillStyle = '#f58b4a';
    ctx.beginPath(); ctx.arc(x, y, 27, 0, Math.PI * 2); ctx.fill(); ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#fff1b8'; ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI * 2); ctx.fill();
    return;
  }
  if (hazard.kind === 'steam') {
    const active = ((time + hazard.phase) % hazard.period) < hazard.activeFor;
    ctx.fillStyle = '#243d5c'; rounded(ctx, hazard.x - 7, hazard.y + hazard.h - 22, hazard.w + 14, 28, 8); ctx.fill();
    if (!active) {
      ctx.fillStyle = '#8de8ff'; ctx.beginPath(); ctx.arc(hazard.x + hazard.w / 2, hazard.y + hazard.h - 28, 7, 0, Math.PI * 2); ctx.fill();
      return;
    }
    const plume = ctx.createLinearGradient(0, hazard.y, 0, hazard.y + hazard.h);
    plume.addColorStop(0, '#ffffff20'); plume.addColorStop(.55, '#d6f5ffcc'); plume.addColorStop(1, '#8de8fff0');
    ctx.fillStyle = plume; rounded(ctx, hazard.x, hazard.y, hazard.w, hazard.h, 24); ctx.fill();
    for (let i = 0; i < 4; i += 1) {
      ctx.beginPath(); ctx.arc(hazard.x + 12 + (i % 2) * 25, hazard.y + 28 + i * 34, 13 + i * 2, 0, Math.PI * 2); ctx.fill();
    }
    return;
  }
  if (hazard.kind === 'sparkField') {
    ctx.strokeStyle = '#72efff'; ctx.lineWidth = 4; ctx.shadowColor = '#58dfff'; ctx.shadowBlur = 12;
    for (let x = hazard.x; x < hazard.x + hazard.w; x += 34) {
      ctx.beginPath(); ctx.moveTo(x, hazard.y + hazard.h); ctx.lineTo(x + 10, hazard.y + 6); ctx.lineTo(x + 20, hazard.y + hazard.h); ctx.stroke();
    }
    ctx.shadowColor = 'transparent';
  }
}
function drawEnemy(ctx, enemy, time, image) {
  if (enemy.defeated) return;
  ctx.save();
  ctx.translate(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2);
  if (enemy.direction < 0) ctx.scale(-1, 1);
  const bob = Math.sin(time * 5 + enemy.id) * 2;
  ctx.translate(0, bob);

  if (image?.complete && image.naturalWidth) {
    const index = enemy.kind === 'drone' ? 1 : 0;
    const sw = image.naturalWidth / 3;
    const size = enemy.kind === 'drone' ? 82 : 76;
    ctx.drawImage(image, index * sw, 0, sw, image.naturalHeight, -size / 2, -size / 2, size, size);
  } else if (enemy.kind === 'drone') {
    ctx.shadowColor = '#56e5ff';
    ctx.shadowBlur = 18;
    ctx.fillStyle = '#5de9ef';
    ctx.beginPath();
    ctx.ellipse(0, 8, 26, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#17234d';
    rounded(ctx, -20, -14, 40, 28, 12);
    ctx.fill();
    ctx.fillStyle = '#ffcf55';
    ctx.beginPath();
    ctx.arc(8, -1, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e8fbff';
    ctx.fillRect(-29, 2, 10, 4);
    ctx.fillRect(19, 2, 10, 4);
  } else {
    ctx.fillStyle = '#392260';
    rounded(ctx, -24, -17, 48, 34, 14);
    ctx.fill();
    ctx.fillStyle = '#ff7db5';
    rounded(ctx, -16, -10, 32, 16, 7);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(7, -2, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#17152d';
    ctx.beginPath();
    ctx.arc(8, -2, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#7d67e7';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-17, 14);
    ctx.lineTo(-23, 22);
    ctx.moveTo(17, 14);
    ctx.lineTo(23, 22);
    ctx.stroke();
  }
  ctx.restore();
}

function drawHero(ctx, player, image, time, hero) {
  ctx.save();
  const flicker = player.invulnerable > 0 && Math.floor(time * 16) % 2 === 0;
  if (flicker) ctx.globalAlpha = 0.35;
  const squash = player.grounded ? 1 + Math.abs(player.vx) / 4000 : 0.95;
  const bounce = player.grounded && Math.abs(player.vx) > 30 ? Math.sin(time * 14) * 3 : 0;
  ctx.translate(player.x + player.w / 2, player.y + player.h + bounce);
  ctx.scale(player.face * squash, 1 / squash);
  if (image?.complete && image.naturalWidth) {
    const sw = image.naturalWidth / 5;
    const sh = image.naturalHeight / 3;
    let frame = 0;
    if (!player.grounded) frame = 4;
    else if (Math.abs(player.vx) > 35) frame = 1 + (Math.floor(time * 10) % 3);
    ctx.drawImage(image, frame * sw, hero * sh, sw, sh, -46, -102, 92, 106);
  } else {
    ctx.fillStyle = ['#ff607f', '#438cff', '#72e8d0'][hero] || '#ff607f';
    rounded(ctx, -21, -62, 42, 62, 16);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(10, -44, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

export function drawAcademy(ctx, state, assets, camera, viewport) {
  const { width, height } = viewport;
  const ratio = width / height;
  const viewW = Math.min(1280, Math.max(900, 720 * ratio));
  const viewH = 720;
  camera.x += ((state.player.x + state.player.w / 2 - viewW * 0.42) - camera.x) * 0.08;
  camera.x = Math.max(0, Math.min(state.level.worldW - viewW, camera.x));
  const shake = state.shake > 0 ? Math.sin(state.time * 70) * state.shake * 18 : 0;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, width, height);
  cover(ctx, assets.background, width, height);
  ctx.fillStyle = '#07163530';
  ctx.fillRect(0, 0, width, height);
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = state.level.glow;
  ctx.fillRect(0, 0, width, height);
  ctx.globalAlpha = 1;

  const scale = Math.min(width / viewW, height / viewH);
  const dx = (width - viewW * scale) / 2;
  const dy = (height - viewH * scale) / 2;
  ctx.setTransform(scale, 0, 0, scale, dx - (camera.x + shake) * scale, dy);

  // Distant towers and clouds give the panorama a moving parallax layer.
  ctx.globalAlpha = 0.18;
  for (let i = 0; i < 15; i += 1) {
    const x = i * 430 + 80 + camera.x * 0.7;
    const y = 95 + (i % 3) * 42;
    ctx.fillStyle = i % 2 ? '#fff' : '#8de8f7';
    ctx.beginPath();
    ctx.ellipse(x, y, 150, 35, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  for (const challenge of state.level.challenges || []) drawWorkshop(ctx, challenge, state, state.time, state.level.accent);

  for (const platform of state.platforms) {
    if (platform.requiresChallenge && !state.challengeProgress[platform.requiresChallenge]) continue;
    const display = platform.kind === 'moving' || platform.kind === 'lift'
      ? {
          ...platform,
          x: platform.x + (platform.axis === 'x' ? Math.sin(state.time * platform.speed * 2 + (platform.phase ?? state.platforms.indexOf(platform))) * platform.range : 0),
          y: platform.y + (platform.axis === 'y' ? Math.sin(state.time * platform.speed * 2 + (platform.phase ?? state.platforms.indexOf(platform))) * platform.range : 0),
        }
      : platform;
    const locked = Boolean(platform.challengeId && !state.challengeReady[platform.challengeId]);
    if (platform.requiresChallenge) {
      const solvedAt = state.challengeSolvedAt[platform.requiresChallenge] ?? -10;
      const reveal = Math.max(0, Math.min(1, (state.time - solvedAt) / 0.7));
      ctx.save();
      ctx.globalAlpha = reveal;
      drawPlatform(ctx, { ...display, locked, y: display.y + (1 - reveal) * 70 });
      ctx.restore();
    } else {
      drawPlatform(ctx, { ...display, locked });
    }
  }

  const gateIcons = { number: '3', compare: '>', pattern: '◆', composition: '5' };
  for (const item of Object.values(state.level.learningGates)) {
    const solved = state.level.challenges?.length ? state.challengeProgress[item.id] : state.solved[item.id];
    if (solved) continue;
    const gateGradient = ctx.createLinearGradient(item.x, 0, item.x + item.w, 0);
    gateGradient.addColorStop(0, '#163b65');
    gateGradient.addColorStop(0.5, '#72e4ed');
    gateGradient.addColorStop(1, '#163b65');
    ctx.shadowColor = '#72e4ed80';
    ctx.shadowBlur = 16;
    ctx.fillStyle = gateGradient;
    rounded(ctx, item.x, item.y, item.w, item.h, 18);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#fff';
    ctx.font = '900 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(gateIcons[item.id] || '⚙', item.x + item.w / 2, item.y + 42);
  }

  for (const coin of state.coins) {
    if (coin.taken) continue;
    const pulse = 1 + Math.sin(state.time * 6 + coin.id) * 0.08;
    ctx.save();
    ctx.translate(coin.x, coin.y);
    ctx.scale(pulse, pulse);
    ctx.shadowColor = '#ffd75f';
    ctx.shadowBlur = 14;
    ctx.fillStyle = '#ffca35';
    ctx.save();
    ctx.rotate(state.time * 0.8 + coin.id);
    for (let tooth = 0; tooth < 8; tooth += 1) {
      ctx.rotate(Math.PI / 4);
      rounded(ctx, -4, -18, 8, 9, 2);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(0, 0, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fff1a2';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#8d541e';
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.restore();
  }

  for (const star of state.stars) {
    if (star.taken) continue;
    ctx.save();
    ctx.translate(star.x, star.y);
    ctx.rotate(state.time);
    ctx.shadowColor = '#fff6a8';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#fff09c';
    ctx.font = '900 42px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✦', 0, 0);
    ctx.restore();
  }

  for (const hazard of state.hazards) drawHazard(ctx, hazard, state.time);
  for (const enemy of state.enemies) drawEnemy(ctx, enemy, state.time, assets.enemies);

  // Portal remains visible from a distance and becomes brighter when the gate is solved.
  ctx.save();
  const portal = state.level.portal;
  ctx.translate(portal.x + portal.w / 2, portal.y + portal.h / 2);
  ctx.shadowColor = state.gateOpen ? '#7fffe1' : '#7a87aa';
  ctx.shadowBlur = state.gateOpen ? 36 : 8;
  ctx.strokeStyle = state.gateOpen ? '#7fffe1' : '#75809e';
  ctx.lineWidth = 13;
  ctx.beginPath();
  ctx.ellipse(0, 0, 34, 60, 0, 0, Math.PI * 2);
  ctx.stroke();
  if (state.gateOpen) {
    const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, 30);
    glow.addColorStop(0, '#ffffff');
    glow.addColorStop(0.25, '#6ff5db');
    glow.addColorStop(1, '#765cff30');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.ellipse(0, 0, 27, 52, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  for (const particle of state.particles) {
    ctx.globalAlpha = Math.max(0, particle.life / 0.7);
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, 4 + particle.life * 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  drawHero(ctx, state.player, assets.heroes, state.time, state.hero);

  // Short learning prompts live inside the scenery: no modal quiz interrupts the platformer.
  const skill = state.level.skill;
  const gate = state.level.learningGates[skill];
  const showLesson = gate && state.player.x > 820 && state.player.x < gate.x + 120 && !state.solved[skill];
  if (showLesson && !state.level.challenges?.length) {
    const panel = {
      x: Math.max(900, gate.x - 790), y: 175, w: 740,
      title: state.level.taskTitle,
      task: state.level.task,
      note: skill === 'composition' && (state.compositionParts[0] || state.compositionParts[1])
        ? `Часть найдена — теперь прыгни на ${state.compositionParts[0] ? 3 : 2}`
        : state.level.taskNote,
    };
    ctx.fillStyle = '#07152ef2';
    rounded(ctx, panel.x, panel.y, panel.w, 118, 24);
    ctx.fill();
    ctx.strokeStyle = `${state.level.accent}80`;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.font = '900 21px sans-serif';
    ctx.fillText(panel.title, panel.x + panel.w / 2, panel.y + 32);
    ctx.font = '900 25px sans-serif';
    ctx.fillStyle = state.level.accent;
    ctx.fillText(panel.task, panel.x + panel.w / 2, panel.y + 70);
    ctx.font = '700 13px sans-serif';
    ctx.fillStyle = '#ffffffb8';
    ctx.fillText(panel.note, panel.x + panel.w / 2, panel.y + 98);
  }
  return { viewW, viewH, scale };
}
