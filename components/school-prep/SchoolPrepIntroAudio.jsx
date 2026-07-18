"use client";

import { SchoolPrepAudioButton } from "./SchoolPrepAudioButton.jsx";

export function SchoolPrepIntroAudio({ src = "/audio/school-prep/method/intro-hero-v1.mp3" }) {
  return (
    <SchoolPrepAudioButton
      src={src}
      label="Послушать идею курса"
      className="min-h-[58px] border-ink/10 bg-white/75 px-6 py-4 text-sm text-ink/68 shadow-sm hover:bg-white"
    />
  );
}
