"use client";

import { useEffect, useId, useRef, useState } from "react";

const AUDIO_EVENT = "razumeyka:school-prep-audio";

export function SchoolPrepAudioButton({ src, label = "Послушать задание", playingLabel = "Пауза", className = "" }) {
  const id = useId();
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const stopOtherAudio = (event) => {
      if (event.detail !== id) audioRef.current?.pause();
    };
    window.addEventListener(AUDIO_EVENT, stopOtherAudio);
    return () => {
      window.removeEventListener(AUDIO_EVENT, stopOtherAudio);
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [id, src]);

  function toggleAudio() {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.onpause = () => setIsPlaying(false);
      audioRef.current.onplay = () => setIsPlaying(true);
    }
    if (isPlaying) return audioRef.current.pause();
    window.dispatchEvent(new CustomEvent(AUDIO_EVENT, { detail: id }));
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => setIsPlaying(false));
  }

  return (
    <button type="button" onClick={toggleAudio} className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-brand-purple/18 bg-brand-purple/[0.07] px-4 py-2.5 text-xs font-extrabold text-brand-purple transition hover:-translate-y-0.5 hover:bg-brand-purple/[0.12] ${className}`} aria-pressed={isPlaying}>
      <span aria-hidden="true">{isPlaying ? "❚❚" : "▶"}</span>
      {isPlaying ? playingLabel : label}
    </button>
  );
}
