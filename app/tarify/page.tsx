import { canonical } from '@/lib/seo';
import Link from "next/link";
import { Footer } from "@/components/Footer.jsx";
import { Header } from "@/components/Header.jsx";
import { SubscribeButton } from "@/components/drawing/SubscribeButton.jsx";
import { getAuthSession } from "@/lib/auth";
import { reconcileUserPayments } from "@/lib/payments";
import {
  DIRECTION_COMPARE_PRICE,
  directionAccessLabel,
  directionPrice,
  getAccessMap,
  type DirectionSlug,
} from "@/lib/subscription";
import { COMPARE_PRICE, MIN_PRICE, rub } from "@/lib/access-prices";

export const metadata = {
  title: "Тарифы на детские онлайн-курсы",
  description:
    `Три открытых курса Знайтона: рисование, ментальная арифметика и подготовка к школе. Первые занятия бесплатно, полный доступ — от ${rub(MIN_PRICE)}.`,
  alternates: canonical("/tarify"),
};

const courses = [
  {
    slug: "risovanie",
    href: "/risovanie",
    eyebrow: "Творчество · 3–10 лет",
    title: "Правополушарное рисование",
    description: "Пошаговые уроки, занятия двумя руками и настоящее детское портфолио.",
    features: ["Все возрастные ступени", "Голосовые подсказки", "Новые работы каждую неделю"],
    gradient: "from-[#246BFD] via-[#7257E8] to-[#EC4899]",
    tint: "from-[#EEF4FF] to-[#FFF0F7]",
  },
  {
    slug: "mentalnaya-arifmetika",
    href: "/mentalnaya-arifmetika",
    eyebrow: "Счёт · 4–10 лет",
    title: "Ментальная арифметика",
    description: "Абакус, устный счёт и полноценный адаптивный тренажёр умножения.",
    features: ["Маршрут на 30 дней", "Таблица умножения 2–9", "Игры и прогресс"],
    gradient: "from-[#079A78] via-[#16A6A1] to-[#3B82F6]",
    tint: "from-[#EAFBF6] to-[#EEF7FF]",
  },
  {
    slug: "podgotovka-k-shkole",
    href: "/podgotovka-k-shkole",
    eyebrow: "Школьный старт · 5–7 лет",
    title: "Подготовка к школе",
    description: "Чтение, речь, счёт, логика, письмо и полный тренажёр умножения 2–9.",
    features: ["Сюжетная экспедиция", "Занятия по 20–25 минут", "Тренажёр умножения включён"],
    gradient: "from-[#7257E8] via-[#EC4899] to-[#F59E0B]",
    tint: "from-[#F3EFFF] to-[#FFF4E8]",
  },
] as const;

function accessDate(date: Date | null | undefined) {
  if (!date) return "";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function TariffsPage() {
  const session = await getAuthSession();
  let accessMap: Record<DirectionSlug, Date | null> | null = null;

  if (session?.user?.id) {
    await reconcileUserPayments(session.user.id);
    accessMap = await getAccessMap(session.user.id);
  }

  return (
    <>
      <Header />
      <main className="min-h-screen overflow-hidden bg-[#F8F4EC] pb-24 pt-[142px] sm:pt-[158px]">
        <section className="relative">
          <div className="pointer-events-none absolute -left-24 top-0 h-96 w-96 rounded-full bg-brand-blue/18 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 top-20 h-96 w-96 rounded-full bg-brand-pink/18 blur-3xl" />
          <div className="container-pad relative">
            <div className="mx-auto max-w-4xl text-center">
              <span className="inline-flex rounded-full border border-brand-purple/14 bg-white/78 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-purple shadow-sm">
                Три курса уже открыты
              </span>
              <h1 className="display-title mx-auto mt-6 max-w-4xl text-[2.65rem] leading-[0.98] sm:text-6xl lg:text-[4.6rem]">
                Выберите курс сейчас — <span className="bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink bg-clip-text text-transparent">первые занятия бесплатно</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base font-semibold leading-8 text-ink/62 sm:text-lg">
                Выберите подходящее направление. Без пакетов, скрытых доплат и автоматического продления.
              </p>
              <div className="mx-auto mt-7 inline-flex flex-wrap items-center justify-center gap-3 rounded-[24px] border border-white/90 bg-white/82 px-5 py-4 shadow-card backdrop-blur-xl">
                <del className="text-xl font-extrabold text-ink/30">{rub(COMPARE_PRICE)}</del>
                <strong className="font-display text-4xl font-black text-brand-blue">от {rub(MIN_PRICE)}</strong>
                <span className="text-sm font-extrabold text-ink/48">за полный доступ к курсу</span>
              </div>
            </div>

            <div className="mt-12 grid gap-5 xl:grid-cols-3">
              {courses.map((course) => {
                const slug = course.slug as DirectionSlug;
                const until = accessMap?.[slug] ?? null;
                const active = Boolean(until && until.getTime() > Date.now());
                const price = directionPrice(slug);

                return (
                  <article
                    id={course.slug}
                    key={course.slug}
                    className={`relative isolate flex min-h-[610px] flex-col overflow-hidden rounded-[34px] border border-white/90 bg-gradient-to-br ${course.tint} p-5 shadow-luxe sm:p-7`}
                  >
                    <div className={`absolute inset-x-0 top-0 h-2 bg-gradient-to-r ${course.gradient}`} />
                    <div className={`pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-gradient-to-br ${course.gradient} opacity-20 blur-3xl`} />

                    <div className="relative flex h-full flex-col">
                      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-ink/46">{course.eyebrow}</p>
                      <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-[-0.035em] text-ink sm:text-[2.15rem]">{course.title}</h2>
                      <p className="mt-4 min-h-[5.25rem] text-base font-semibold leading-7 text-ink/62">{course.description}</p>

                      <ul className="mt-6 grid gap-3">
                        {course.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-3 text-sm font-bold text-ink/72">
                            <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br ${course.gradient} text-xs text-white shadow-sm`}>✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <div className="mt-7 rounded-[26px] border border-white bg-white/88 p-5 shadow-card">
                        <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-ink/42">Полный доступ на {directionAccessLabel(course.slug)}</p>
                        <div className="mt-3 flex items-end gap-3">
                          <del className="pb-1 text-lg font-extrabold text-ink/30">{DIRECTION_COMPARE_PRICE.toLocaleString("ru-RU")} ₽</del>
                          <strong className="font-display text-5xl font-black tracking-[-0.06em] text-ink">{price} ₽</strong>
                        </div>
                        <p className="mt-2 text-xs font-semibold leading-5 text-ink/44">Доступ открывается сразу после оплаты. Автосписания нет.</p>
                      </div>

                      <div className="mt-auto pt-6">
                        <Link
                          href={`${course.href}#uroki`}
                          className="inline-flex min-h-[50px] w-full items-center justify-center rounded-full border border-ink/10 bg-white px-5 py-3 text-sm font-extrabold text-ink shadow-sm transition hover:-translate-y-0.5 hover:border-brand-blue/24"
                        >
                          Попробовать бесплатно
                        </Link>
                        <SubscribeButton
                          isLoggedIn={Boolean(session?.user?.id)}
                          hasAccess={active}
                          accessUntil={accessDate(until)}
                          returnTo={course.href}
                          buttonLabel={`Открыть за ${price} ₽`}
                          loginCallback={`/tarify#${course.slug}`}
                        />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mx-auto mt-8 max-w-3xl rounded-[26px] border border-white/90 bg-white/78 p-5 text-center text-sm font-semibold leading-6 text-ink/52 shadow-card">
              Оплачивается одно выбранное направление. Первые занятия можно пройти без карты. Перед оплатой вы увидите публичную оферту и подтвердите согласие.
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
