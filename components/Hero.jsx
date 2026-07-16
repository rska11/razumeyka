'use client';

import { useRef, useState } from 'react';
import { Icon } from './Icon.jsx';

const stats = [
  ['бесплатно', 'первые уроки'],
  ['3–10+', 'лет'],
  ['490 ₽', 'полный доступ/мес'],
];

const benefits = ['интеллект', 'уверенность', 'креативность'];

const skills = ['память', 'логика', 'речь', 'интуиция', 'артистизм'];

export function Hero() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  async function togglePlay() {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      await videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }

  function toggleMute() {
    if (!videoRef.current) return;

    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  }

  return (
    <section id="top" className="hero-stage relative isolate overflow-hidden pt-[122px] sm:pt-[138px] lg:pt-[154px]">
      <div className="grain-overlay pointer-events-none absolute inset-0 -z-10" />
      <div className="pointer-events-none absolute left-[-8rem] top-24 -z-10 h-[30rem] w-[30rem] rounded-full bg-brand-blue/24 blur-3xl" />
      <div className="pointer-events-none absolute right-[-8rem] top-8 -z-10 h-[32rem] w-[32rem] rounded-full bg-brand-pink/22 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-brand-orange/20 blur-3xl" />

      <div className="container-pad grid min-h-[calc(100vh-88px)] items-center gap-10 pb-12 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative animate-rise">
          <span className="inline-flex rounded-full border-2 border-white/80 bg-white/78 px-5 py-3 text-sm font-extrabold uppercase tracking-[0.18em] text-forest-700 shadow-color backdrop-blur-xl">
            Разумейка · онлайн школа развития детей 3–10+ лет
          </span>

          <div className="mt-6 flex flex-wrap gap-2">
            {benefits.map((item, index) => (
              <span
                key={item}
                className={`floating-chip ${index === 0 ? 'text-brand-blue' : index === 1 ? 'text-brand-pink' : 'text-brand-orange'}`}
              >
                {item}
              </span>
            ))}
          </div>

          <h1 className="display-title mt-7 max-w-4xl text-[2.45rem] sm:text-[3.35rem] lg:text-[4.35rem]">
            <span className="block text-[#0B1F3A]">Ребенок учится</span>
            <span className="mt-2 block bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink bg-clip-text text-transparent">
              смело, быстро
            </span>
            <span className="mt-2 block text-[#0B1F3A]">
              и{' '}
              <span className="bg-gradient-to-r from-brand-orange via-brand-pink to-brand-purple bg-clip-text text-transparent">
                с интересом
              </span>
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-[1.08rem] font-semibold leading-8 text-ink/68 sm:text-lg">
            Онлайн занятия Разумейки развивают интеллект, уверенность и креативность через понятный результат
            для родителя: ребенок лучше читает, считает, говорит и не боится новых задач.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <a href="/risovanie" className="primary-btn">
              <span className="relative">Начать бесплатно</span>
              <Icon name="arrow" className="relative h-5 w-5" />
            </a>
            <a href="#programs" className="secondary-btn">
              Посмотреть направления
            </a>
          </div>

          <div className="mt-9 grid max-w-2xl grid-cols-3 gap-3">
            {stats.map(([value, label], index) => (
              <div key={label} className="group rounded-[22px] border border-white/80 bg-white/78 p-4 shadow-card backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-color">
                <p className={`font-display text-2xl font-bold sm:text-3xl ${index === 0 ? 'text-brand-blue' : index === 1 ? 'text-brand-pink' : 'text-brand-orange'}`}>
                  {value}
                </p>
                <p className="mt-1 text-xs font-extrabold leading-5 text-ink/58 sm:text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[430px] animate-rise sm:min-h-[520px] lg:min-h-[620px]" style={{ animationDelay: '130ms' }}>
          <div className="hero-orbit absolute -inset-4 rounded-[8px] opacity-80 blur-xl" />
          <div className="absolute inset-x-5 bottom-0 top-14 rounded-[8px] bg-night shadow-luxe" />

          <div className="absolute -right-2 top-4 z-20 hidden w-56 rounded-[8px] border-2 border-white/70 bg-white/82 p-4 shadow-luxe backdrop-blur-xl sm:block">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-blue">прогресс</p>
            <p className="mt-2 font-display text-4xl font-bold text-ink">+37%</p>
            <p className="mt-1 text-sm font-bold leading-5 text-ink/58">к концентрации на учебных задачах</p>
          </div>

          <div className="absolute -left-1 top-36 z-20 hidden w-52 animate-floaty rounded-[8px] border-2 border-white/70 bg-white/82 p-4 shadow-luxe backdrop-blur-xl md:block">
            <p className="font-display text-base font-bold text-ink">Мягкая нагрузка</p>
            <p className="mt-2 text-sm font-semibold leading-5 text-ink/58">через практику, вовлечение и личный темп</p>
          </div>

          <div className="absolute bottom-20 left-1/2 z-20 flex max-w-[90%] -translate-x-1/2 flex-wrap justify-center gap-2 rounded-[8px] border border-white/45 bg-night/82 px-3 py-3 text-porcelain shadow-luxe backdrop-blur-xl">
            {skills.map((item) => (
              <span
                key={item}
                className="rounded-[8px] bg-white/10 px-3 py-2 text-xs font-extrabold uppercase tracking-[0.12em] text-brand-yellow"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="relative ml-auto h-full max-w-[690px] overflow-hidden rounded-[8px] border-2 border-white/75 bg-white/50 p-3 shadow-luxe backdrop-blur-xl">
            <video
              ref={videoRef}
              src="/images/video1.mp4"
              poster="/images/video-poster.webp"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Видео онлайн-занятий Разумейка"
              className="h-[430px] w-full rounded-[8px] object-cover object-center sm:h-[520px] lg:h-[620px]"
            />
            <div className="pointer-events-none absolute inset-3 rounded-[8px] bg-gradient-to-t from-night/44 via-night/4 to-white/10" />
            <div className="pointer-events-none absolute inset-3 rounded-[8px] ring-1 ring-white/50" />

            <button
              type="button"
              onClick={togglePlay}
              className="absolute bottom-6 left-6 z-30 flex h-[52px] w-[52px] items-center justify-center rounded-full border border-white/65 bg-white/78 text-ink shadow-luxe backdrop-blur-xl transition hover:-translate-y-1 hover:scale-105 hover:bg-white focus:outline-none focus:ring-4 focus:ring-white/40"
              aria-label={isPlaying ? 'Поставить видео на паузу' : 'Воспроизвести видео'}
            >
              <span className="text-sm font-black">{isPlaying ? 'II' : '▶'}</span>
            </button>

            <button
              type="button"
              onClick={toggleMute}
              className="absolute bottom-6 right-6 z-40 flex h-[52px] min-w-[72px] items-center justify-center rounded-full border border-white/65 bg-white/90 px-4 text-ink shadow-luxe backdrop-blur-xl transition hover:-translate-y-1 hover:scale-105 hover:bg-white focus:outline-none focus:ring-4 focus:ring-white/40"
              aria-label={isMuted ? 'Включить звук' : 'Выключить звук'}
            >
              <span className="text-xs font-black uppercase tracking-[0.12em]">{isMuted ? 'Звук' : 'Тихо'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}