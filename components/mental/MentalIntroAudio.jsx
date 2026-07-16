'use client';

import { useEffect, useRef, useState } from 'react';

export function MentalIntroAudio({ src = '/audio/mental/method/intro-hero-v1.mp3', className = '' }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => () => {
    audioRef.current?.pause();
  }, []);

  function toggleAudio() {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.onpause = () => setIsPlaying(false);
      audioRef.current.onplay = () => setIsPlaying(true);
    }

    if (isPlaying) {
      audioRef.current.pause();
      return;
    }

    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => setIsPlaying(false));
  }

  return (
    <button type="button" onClick={toggleAudio} className={'mental-audio-btn ' + className} aria-pressed={isPlaying}>
      <span>{isPlaying ? '❚❚' : '▶'}</span>
      {isPlaying ? 'Пауза' : 'Послушать идею курса'}
    </button>
  );
}