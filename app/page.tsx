import Link from 'next/link';
import { AgePrograms } from '@/components/AgePrograms.jsx';
import { BeforeAfter } from '@/components/BeforeAfter.jsx';
import { BetterThanSchool } from '@/components/BetterThanSchool.jsx';
import { Directions } from '@/components/Directions.jsx';
import { FAQ } from '@/components/FAQ.jsx';
import { faqItems } from '@/data/faq.js';
import { FinalCTA } from '@/components/FinalCTA.jsx';
import { Footer } from '@/components/Footer.jsx';
import { Header } from '@/components/Header.jsx';
import { Hero } from '@/components/Hero.jsx';
import { PainPoints } from '@/components/PainPoints.jsx';
import { PresentationMap } from '@/components/PresentationMap.jsx';
import { Process } from '@/components/Process.jsx';
import { Program } from '@/components/Program.jsx';
import { QuizAI } from '@/components/QuizAI.jsx';
import { Results } from '@/components/Results.jsx';
import { Scarcity } from '@/components/Scarcity.jsx';
import { StickyMobileCTA } from '@/components/StickyMobileCTA.jsx';


// canonical только здесь: в layout он наследовался бы всеми страницами без своего canonical
export const metadata = {
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            name: "Знайтон",
            alternateName: "Онлайн-платформа «Знайтон»",
            url: "https://znayton.ru",
            description:
              "Онлайн-платформа для развития детей 3–10+ лет: правополушарное рисование, ментальная арифметика, скорочтение и другие направления.",
            logo: "https://znayton.ru/images/logo.png",
            email: "info@znayton.ru",
            areaServed: "RU",
            audience: { "@type": "EducationalAudience", educationalRole: "student" },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
      <Header />
      <main>
        <Hero />
        <section id="games" aria-labelledby="home-games-title" className="relative overflow-hidden bg-[#F6F8FC] px-5 py-14 sm:px-8 lg:px-14 lg:py-20">
          <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-brand-blue/12 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-brand-pink/12 blur-3xl" />
          <div className="container-pad relative px-0">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <span className="comic-label">можно играть прямо сейчас</span>
                <h2 id="home-games-title" className="mt-5 font-display text-3xl font-extrabold leading-[1.03] tracking-[-0.045em] text-ink sm:text-5xl">
                  Обучение, в которое ребёнку хочется играть
                </h2>
              </div>
              <div className="max-w-xl">
                <p className="text-sm font-semibold leading-6 text-ink/56 sm:text-base">
                  Ребёнок не просто выбирает ответ: он управляет героем, проходит уровни и тренирует навык в действии. Игровой зал будет постепенно пополняться.
                </p>
                <Link href="/igry" className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-brand-blue transition hover:translate-x-1">Открыть игровой зал →</Link>
              </div>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              <Link href="/igry?game=mental" className="group relative min-h-[230px] overflow-hidden rounded-[32px] bg-gradient-to-br from-[#09152E] via-[#143568] to-[#126D75] p-6 text-white shadow-luxe transition duration-300 hover:-translate-y-1.5 hover:shadow-color sm:p-8">
                <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#75E5C1]/20 blur-3xl" />
                <div className="relative flex h-full flex-col">
                  <span className="inline-flex w-fit rounded-full border border-white/14 bg-white/[0.08] px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#9AF3D6]">
                    Ментальная арифметика · 4–10 лет
                  </span>
                  <div className="mt-7 flex items-start gap-4">
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-[18px] bg-[#75E5C1] text-2xl shadow-card">🚀</span>
                    <div>
                      <h3 className="font-display text-3xl font-extrabold tracking-[-0.04em]">Звёздный абакус</h3>
                      <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-white/62">Определяй число на абакусе, выбирай трассу и веди корабль через восемь игровых миссий.</p>
                    </div>
                  </div>
                  <span className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-[#9AF3D6]">Играть бесплатно <b className="transition group-hover:translate-x-1">→</b></span>
                </div>
              </Link>

              <Link href="/igry?game=most" className="group relative min-h-[230px] overflow-hidden rounded-[32px] bg-gradient-to-br from-[#211848] via-[#58317A] to-[#C75C57] p-6 text-white shadow-luxe transition duration-300 hover:-translate-y-1.5 hover:shadow-color sm:p-8">
                <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#FFCF68]/22 blur-3xl" />
                <div className="relative flex h-full flex-col">
                  <span className="inline-flex w-fit rounded-full border border-white/14 bg-white/[0.08] px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#FFE19B]">
                    Подготовка к школе · 5–7 лет
                  </span>
                  <div className="mt-7 flex items-start gap-4">
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-[18px] bg-[#FFCF68] text-2xl shadow-card">🦊</span>
                    <div>
                      <h3 className="font-display text-3xl font-extrabold tracking-[-0.04em]">Мост через реку</h3>
                      <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-white/64">Помогай лисёнку Искре выбирать следующий камень и осваивай числовой ряд в движении.</p>
                    </div>
                  </div>
                  <span className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-[#FFE19B]">Играть бесплатно <b className="transition group-hover:translate-x-1">→</b></span>
                </div>
              </Link>
            </div>
          </div>
        </section>
        <PainPoints />
        <Directions />
        <AgePrograms />
        <QuizAI />
        <BetterThanSchool />
        <PresentationMap />
        <BeforeAfter />
        <Results />
        <Process />
        <Program />

        <Scarcity />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <StickyMobileCTA />
    </>
  );
}
