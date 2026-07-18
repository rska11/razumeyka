"use client";

import { useEffect, useRef, useState } from "react";

const AUDIO_EVENT = "razumeyka:school-prep-audio";
const SOUND_KEY = "razumeyka_school_prep_sound";
const AUTO_AUDIO_ID = "school-prep-auto-narration";

export function SchoolPrepAutoNarration({ src }) {
  const audioRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [needsGesture, setNeedsGesture] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  function stopAudio() {
    audioRef.current?.pause();
    setIsPlaying(false);
  }

  function saveSoundPreference(enabled) {
    try {
      window.localStorage.setItem(SOUND_KEY, enabled ? "on" : "off");
    } catch {
      // localStorage may be unavailable in a restrictive browser mode.
    }
  }

  function playInstruction(force = false) {
    if (!force && !soundEnabled) return;

    stopAudio();
    window.dispatchEvent(new CustomEvent(AUDIO_EVENT, { detail: AUTO_AUDIO_ID }));

    const audio = new Audio(src);
    audioRef.current = audio;
    audio.onplay = () => setIsPlaying(true);
    audio.onpause = () => setIsPlaying(false);
    audio.onended = () => setIsPlaying(false);
    audio.play()
      .then(() => {
        setNeedsGesture(false);
      })
      .catch(() => {
        setIsPlaying(false);
        setNeedsGesture(true);
      });
  }

  useEffect(() => {
    try {
      setSoundEnabled(window.localStorage.getItem(SOUND_KEY) !== "off");
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready || !soundEnabled) return;
    playInstruction();
    // Autoplay is retried whenever the child opens another mission.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, ready]);

  useEffect(() => {
    const stopForOtherAudio = (event) => {
      if (event.detail !== AUTO_AUDIO_ID) stopAudio();
    };
    window.addEventListener(AUDIO_EVENT, stopForOtherAudio);
    return () => {
      window.removeEventListener(AUDIO_EVENT, stopForOtherAudio);
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  function handleSoundButton() {
    if (!soundEnabled || needsGesture) {
      setSoundEnabled(true);
      saveSoundPreference(true);
      playInstruction(true);
      return;
    }

    setSoundEnabled(false);
    saveSoundPreference(false);
    setNeedsGesture(false);
    stopAudio();
    window.dispatchEvent(new CustomEvent(AUDIO_EVENT, { detail: "sound-off" }));
  }

  const buttonLabel = !soundEnabled
    ? "Включить озвучку"
    : needsGesture
      ? "Начать со звуком"
      : isPlaying
        ? "Звук включён · выключить"
        : "Автоозвучка включена";

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-[24px] border border-brand-purple/18 bg-gradient-to-r from-brand-purple/[0.1] via-white to-brand-pink/[0.12] p-4 shadow-card sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-2xl shadow-sm" aria-hidden="true">
          {soundEnabled ? "🔊" : "🔇"}
        </span>
        <div>
          <p className="text-sm font-extrabold text-ink">Инструкция перед каждым заданием</p>
          <p className="mt-1 text-xs font-semibold leading-5 text-ink/52">
            {needsGesture
              ? "Нажмите один раз — дальше задания зазвучат сами."
              : soundEnabled
                ? "Следующие шаги будут озвучиваться автоматически."
                : "Звук выключен и не запустится сам."}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={handleSoundButton}
        className="inline-flex min-h-[54px] shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-purple to-brand-pink px-6 py-3 text-sm font-extrabold text-white shadow-button transition hover:-translate-y-0.5 hover:shadow-color"
        aria-pressed={soundEnabled}
      >
        <span aria-hidden="true">{soundEnabled ? "🔊" : "▶"}</span>
        {buttonLabel}
      </button>
    </div>
  );
}