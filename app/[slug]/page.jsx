import { notFound } from 'next/navigation';
import { directionsData, getDirectionBySlug } from '@/data/directions.js';
import { landingsData, getLandingBySlug } from '@/data/landings.js';
import { LandingPage } from '@/components/LandingPage.jsx';

export function generateStaticParams() {
  return [
    ...directionsData.map((d) => ({ slug: d.slug })),
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
  { q: 'С какого возраста можно заниматься?', a: 'Программу подбираем под возраст и уровень ребёнка. Точнее подскажем на пробном уроке.' },
  { q: 'Как проходят занятия?', a: 'Онлайн, в мини-группах до 6 детей, по 55 минут. Нужны устройство с камерой и интернет — ссылку пришлём после записи.' },
  { q: 'Сколько детей в группе?', a: 'До 6 — чтобы педагог успевал уделить внимание каждому и подстроить темп.' },
  { q: 'Можно сначала попробовать?', a: 'Да, пробный урок — 400 ₽. Это полноценное занятие: педагог оценит уровень и покажет формат.' },
  { q: 'Что если не подойдёт?', a: 'Честно скажем и предложим другое направление или вернём деньги за пробный. Без обид.' },
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
    return <LandingPage landing={directionToLanding(direction)} />;
  }

  const landing = getLandingBySlug(slug);
  if (landing) {
    return <LandingPage landing={landing} />;
  }

  notFound();
}
