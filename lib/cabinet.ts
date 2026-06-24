import { prisma } from "@/lib/prisma";

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Демо-наполнение для нового родителя: чтобы кабинет сразу выглядел живым.
 * Создаётся один раз, если у родителя ещё нет детей. На проде это легко
 * заменить реальными записями (через форму записи на лендинге / админку).
 */
export async function ensureDemoData(userId: string) {
  const existing = await prisma.child.count({ where: { parentId: userId } });
  if (existing > 0) return;

  const now = Date.now();

  await prisma.child.create({
    data: {
      parentId: userId,
      name: "Маша",
      birthYear: 2017,
      avatarColor: "bg-brand-pink",
      enrollments: {
        create: [
          {
            directionSlug: "mental-arithmetic",
            directionTitle: "Ментальная арифметика",
            format: "collective",
            tariff: "3m",
            status: "active",
            progress: 62,
            daysOfWeek: "mon,thu",
            time: "18:30",
            lessons: {
              create: [
                { startsAt: new Date(now + 1 * DAY_MS + 18.5 * 3600_000), status: "scheduled", topic: "Сложение на абакусе" },
                { startsAt: new Date(now + 4 * DAY_MS + 18.5 * 3600_000), status: "scheduled", topic: "Ментальный счёт до 100" },
                { startsAt: new Date(now - 3 * DAY_MS), status: "done", topic: "Знакомство с абакусом" },
              ],
            },
          },
        ],
      },
      achievements: {
        create: [
          { title: "Первая неделя пройдена", icon: "spark" },
          { title: "10 занятий подряд", icon: "check" },
        ],
      },
    },
  });

  await prisma.child.create({
    data: {
      parentId: userId,
      name: "Тимур",
      birthYear: 2015,
      avatarColor: "bg-brand-blue",
      enrollments: {
        create: [
          {
            directionSlug: "speed-reading",
            directionTitle: "Скорочтение",
            format: "individual",
            tariff: "1m",
            status: "active",
            progress: 28,
            daysOfWeek: "tue,fri",
            time: "17:00",
            lessons: {
              create: [
                { startsAt: new Date(now + 2 * DAY_MS + 17 * 3600_000), status: "scheduled", topic: "Скорость чтения: замер" },
              ],
            },
          },
        ],
      },
      achievements: {
        create: [{ title: "Старт направления", icon: "spark" }],
      },
    },
  });

  await prisma.payment.create({
    data: {
      userId,
      amount: 25740,
      status: "paid",
      provider: "demo",
      description: "Ментальная арифметика · 3 месяца",
    },
  });
  await prisma.payment.create({
    data: {
      userId,
      amount: 16200,
      status: "paid",
      provider: "demo",
      description: "Скорочтение · индивидуально · 1 месяц",
    },
  });
}

export async function getCabinetData(userId: string) {
  const [children, payments] = await Promise.all([
    prisma.child.findMany({
      where: { parentId: userId },
      orderBy: { createdAt: "asc" },
      include: {
        enrollments: {
          orderBy: { createdAt: "asc" },
          include: { lessons: { orderBy: { startsAt: "asc" } } },
        },
        achievements: { orderBy: { earnedAt: "desc" } },
      },
    }),
    prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const now = new Date();
  const upcomingLessons = children
    .flatMap((c) =>
      c.enrollments.flatMap((e) =>
        e.lessons
          .filter((l) => l.status === "scheduled" && l.startsAt >= now)
          .map((l) => ({ lesson: l, child: c, enrollment: e })),
      ),
    )
    .sort((a, b) => a.lesson.startsAt.getTime() - b.lesson.startsAt.getTime());

  const activeEnrollments = children.flatMap((c) =>
    c.enrollments.filter((e) => e.status === "active"),
  );

  const achievementsCount = children.reduce((s, c) => s + c.achievements.length, 0);

  return { children, payments, upcomingLessons, activeEnrollments, achievementsCount };
}

export type CabinetData = Awaited<ReturnType<typeof getCabinetData>>;
