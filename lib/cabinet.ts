import { prisma } from "@/lib/prisma";
import { getAccessMap } from "@/lib/subscription";
import { reconcileUserPayments } from "@/lib/payments";

export async function getCabinetData(userId: string) {
  // Подтверждаем оплаты, вернувшиеся из ЮKassa, чтобы доступ отобразился актуально.
  await reconcileUserPayments(userId);
  const accessMap = await getAccessMap(userId);
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

  return { children, payments, upcomingLessons, activeEnrollments, achievementsCount, accessMap };
}

export type CabinetData = Awaited<ReturnType<typeof getCabinetData>>;
