import { AgePrograms } from '@/components/AgePrograms.jsx';
import { BeforeAfter } from '@/components/BeforeAfter.jsx';
import { BetterThanSchool } from '@/components/BetterThanSchool.jsx';
import { Directions } from '@/components/Directions.jsx';
import { FAQ } from '@/components/FAQ.jsx';
import { FinalCTA } from '@/components/FinalCTA.jsx';
import { Footer } from '@/components/Footer.jsx';
import { Header } from '@/components/Header.jsx';
import { Hero } from '@/components/Hero.jsx';
import { PainPoints } from '@/components/PainPoints.jsx';
import { PresentationMap } from '@/components/PresentationMap.jsx';
import { Process } from '@/components/Process.jsx';
import { Program } from '@/components/Program.jsx';
import { Results } from '@/components/Results.jsx';
import { Scarcity } from '@/components/Scarcity.jsx';
import { StickyMobileCTA } from '@/components/StickyMobileCTA.jsx';
import { Teachers } from '@/components/Teachers.jsx';
import { Testimonials } from '@/components/Testimonials.jsx';

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            name: "Разумейка",
            alternateName: "Онлайн-школа Разумейка",
            url: "https://razumeyka-school.ru",
            description:
              "Онлайн-школа развития детей 4–12 лет: ментальная арифметика, скорочтение, правополушарное рисование и другие направления.",
            logo: "https://razumeyka-school.ru/images/course-arithmetic.png",
            areaServed: "RU",
            audience: { "@type": "EducationalAudience", educationalRole: "student" },
          }),
        }}
      />
      <Header />
      <main>
        <Hero />
        <PainPoints />
        <AgePrograms />
        <Directions />
        <BetterThanSchool />
        <PresentationMap />
        <BeforeAfter />
        <Results />
        <Process />
        <Program />
        <Teachers />
        <Testimonials />
        <Scarcity />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <StickyMobileCTA />
    </>
  );
}
