import { notFound } from 'next/navigation';
import { directionsData, getDirectionBySlug } from '@/data/directions.js';
import { landingsData, getLandingBySlug } from '@/data/landings.js';
import { LandingPage } from '@/components/LandingPage.jsx';
import { isDirectionReady } from '@/data/launch.js';

export function generateStaticParams() {
  return [
    // Направления с href (рисование → /risovanie) отдают свой URL продукту и
    // 301-редиректятся, поэтому [slug]-страницу для них не генерируем.
    ...directionsData.filter((d) => !d.href).map((d) => ({ slug: d.slug })),
    ...landingsData.map((l) => ({ slug: l.slug })),
  ];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const direction = getDirectionBySlug(slug);

  if (direction) {
    const metaTitle = direction.seoTitle ?? direction.title;
    const metaDesc = direction.seoDescription ?? direction.offer;
    return {
      title: metaTitle,
      description: metaDesc,
      alternates: { canonical: `/${slug}` },
      openGraph: {
        type: 'article',
        locale: 'ru_RU',
        siteName: 'Разумейка',
        url: `https://razumeyka-school.ru/${slug}`,
        title: `${metaTitle} — Разумейка`,
        description: metaDesc,
        images: direction.image
          ? [{ url: direction.image, width: 1200, height: 630, alt: direction.title }]
          : [{ url: '/images/og.png', width: 1200, height: 630, alt: direction.title }],
      },
    };
  }

  const landing = getLandingBySlug(slug);
  if (landing) {
    return {
      title: landing.title,
      description: landing.description,
      alternates: { canonical: `/${slug}` },
      openGraph: {
        type: 'article',
        locale: 'ru_RU',
        siteName: 'Разумейка',
        url: `https://razumeyka-school.ru/${slug}`,
        title: `${landing.h1} — Разумейка`,
        description: landing.description,
        images: [{ url: '/images/og.png', width: 1200, height: 630, alt: landing.h1 }],
      },
    };
  }

  return { title: 'Страница не найдена' };
}

const defaultFaq = [
  { q: 'С какого возраста можно заниматься?', a: 'Уроки-игры подбираются под возраст и уровень ребёнка — от малышей до школьников. Начните с бесплатных уроков и посмотрите, что подходит.' },
  { q: 'Как проходят занятия?', a: 'Это самостоятельные уроки-игры: экран показывает шаги, ребёнок занимается сам, в своём темпе. Нужны устройство с экраном и интернет — ни педагога, ни расписания.' },
  { q: 'Нужен ли педагог или группа?', a: 'Нет. Ребёнок занимается один на один с экраном-наставником, а результат оценивает родитель — живая похвала вместо оценок.' },
  { q: 'Можно сначала попробовать?', a: 'Да, первые уроки в каждой ступени — бесплатно и без карты. Полный доступ открывается по подписке от 490 ₽/мес — цена зависит от направления.' },
  { q: 'Что если не подойдёт?', a: 'Отмена подписки в один клик, без звонков и уговоров. А первые уроки в любом случае бесплатны.' },
];

// Направление → форма посадочной. Один премиум-шаблон для всех страниц программ.
function directionToLanding(d) {
  const steps = d.timeline
    ? d.timeline.map((t) => ({ title: t.title, text: t.text }))
    : (d.program ?? []).length
      ? d.program.map((p, i) => ({ title: `Этап ${i + 1}`, text: p }))
      : [];

  const pains = d.pains ?? (d.audience ?? []).filter((x) => !/^Возраст/i.test(x));

  return {
    slug: d.slug,
    h1: d.title,
    title: d.seoTitle ?? d.title,
    description: d.seoDescription ?? d.offer,
    emoji: d.emoji,
    theme: d.theme ?? 'blue',
    image: d.image,
    intro: d.landingIntro ?? [d.offer].filter(Boolean),
    stats: d.stats,
    pains,
    bullets: d.results ?? [],
    steps,
    results: d.monthResult ?? [],
    homeTip: d.homeTip,
    testimonial: d.testimonial,
    faq: d.faq ?? defaultFaq,
    relatedSlugs:
      d.relatedSlugs ??
      directionsData.filter((x) => x.slug !== d.slug).slice(0, 3).map((x) => x.slug),
  };
}

export default async function DirectionPage({ params }) {
  const { slug } = await params;

  const direction = getDirectionBySlug(slug);
  if (direction) {
    const comingSoon = !isDirectionReady(slug);
    return <LandingPage landing={{ ...directionToLanding(direction), comingSoon, waitlistDirection: slug }} />;
  }

  const landing = getLandingBySlug(slug);
  if (landing) {
    // Все [slug]-лендинги — направления, которые ещё не открыты как продукт.
    return <LandingPage landing={{ ...landing, comingSoon: true, waitlistDirection: slug }} />;
  }

  notFound();
}
