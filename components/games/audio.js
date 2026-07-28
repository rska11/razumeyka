// Звук игр синтезируется через Web Audio — ни одного mp3.
// Причина простая: четыре коротких сигнала весят ноль байт, не тормозят первый
// экран и не зависят от того, дошла ли до устройства озвучка урока.
//
// AudioContext создаётся только по первому жесту пользователя: браузеры
// блокируют звук до взаимодействия, а лишний висящий контекст ест батарею.

let audioCtx = null;
let muted = false;

const SOUNDS = {
  jump: [{ f: 520, to: 700, t: 0, d: 0.09, type: 'triangle', g: 0.14 }],
  ok: [
    { f: 620, to: 660, t: 0, d: 0.1, type: 'triangle', g: 0.18 },
    { f: 820, to: 880, t: 0.08, d: 0.16, type: 'triangle', g: 0.16 },
  ],
  miss: [
    { f: 300, to: 190, t: 0, d: 0.2, type: 'sine', g: 0.16 },
    { f: 150, to: 120, t: 0.05, d: 0.22, type: 'sine', g: 0.12 },
  ],
  bonus: [
    { f: 700, to: 900, t: 0, d: 0.1, type: 'triangle', g: 0.16 },
    { f: 900, to: 1200, t: 0.09, d: 0.14, type: 'triangle', g: 0.14 },
  ],
  sparkle: [{ f: 900, to: 1350, t: 0, d: 0.09, type: 'triangle', g: 0.12 }],
  lost: [{ f: 260, to: 200, t: 0, d: 0.16, type: 'sine', g: 0.1 }],
  done: [
    { f: 523, to: 523, t: 0, d: 0.14, type: 'triangle', g: 0.16 },
    { f: 659, to: 659, t: 0.12, d: 0.14, type: 'triangle', g: 0.16 },
    { f: 784, to: 784, t: 0.24, d: 0.14, type: 'triangle', g: 0.16 },
    { f: 1046, to: 1046, t: 0.36, d: 0.28, type: 'triangle', g: 0.18 },
  ],
};

export function unlockAudio() {
  if (typeof window === 'undefined') return;
  try {
    if (!audioCtx) {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return;
      audioCtx = new Ctor();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
  } catch {
    audioCtx = null;
  }
}

export function setMuted(value) {
  muted = Boolean(value);
}

export function playSound(name) {
  if (muted || !audioCtx || audioCtx.state !== 'running') return;
  const parts = SOUNDS[name];
  if (!parts) return;
  const now = audioCtx.currentTime;

  for (const part of parts) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = part.type;
    osc.frequency.setValueAtTime(part.f, now + part.t);
    if (part.to !== part.f) {
      osc.frequency.exponentialRampToValueAtTime(part.to, now + part.t + part.d);
    }
    gain.gain.setValueAtTime(0.0001, now + part.t);
    gain.gain.exponentialRampToValueAtTime(part.g, now + part.t + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + part.t + part.d);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now + part.t);
    osc.stop(now + part.t + part.d + 0.02);
  }
}

export function closeAudio() {
  if (!audioCtx) return;
  try {
    audioCtx.close();
  } catch {
    // контекст мог быть уже закрыт — это не ошибка сценария
  }
  audioCtx = null;
}
