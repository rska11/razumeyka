import { prisma } from "@/lib/prisma";
import { getAccessMap } from "@/lib/subscription";
import { reconcileUserPayments } from "@/lib/payments";
import { getAllCourseProgress } from "@/lib/course-progress";

export async function getCabinetData(userId: string) {
  // Подтверждаем оплаты, вернувшиеся из ЮKassa, чтобы доступ отобразился актуально.
  await reconcileUserPayments(userId);
  const [accessMap, courseProgress, children, payments] = await Promise.all([
    getAccessMap(userId),
    getAllCourseProgress(userId),
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
  const totalCompletedLessons = Object.values(courseProgress).reduce((s, p) => s + p.completedCount, 0);

  return {
    children,
    payments,
    upcomingLessons,
    activeEnrollments,
    achievementsCount,
    accessMap,
    courseProgress,
    totalCompletedLessons,
  };
}

export type CabinetData = Awaited<ReturnType<typeof getCabinetData>>;
