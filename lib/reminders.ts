import { prisma } from "@/lib/prisma";
import { sendLessonReminderEmail, sendWeeklyProgressEmail } from "@/lib/mailer";
import { DIRECTIONS, isDirectionSlug } from "@/lib/subscription";

const WINDOW_MS = 3 * 60 * 60 * 1000; // напоминаем за ~3 часа до начала
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function fmtWhen(d: Date) {
  return new Intl.DateTimeFormat("ru-RU", {
    weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit",
  }).format(d);
}

/** Находит занятия, которые скоро начнутся, и шлёт родителю email (один раз на занятие). */
export async function sendDueReminders(): Promise<{
  sent: number;
  checked: number;
  weeklyReportsSent: number;
}> {
  const now = new Date();
  const until = new Date(now.getTime() + WINDOW_MS);

  const lessons = await prisma.lesson.findMany({
    where: {
      status: "scheduled",
      reminderSentAt: null,
      startsAt: { gt: now, lte: until },
    },
    include: {
      enrollment: {
        include: {
          child: { select: { name: true, parent: { select: { email: true } } } },
        },
      },
    },
  });

  let sent = 0;
  for (const l of lessons) {
    const email = l.enrollment.child.parent?.email;
    if (!email) {
      await prisma.lesson.update({ where: { id: l.id }, data: { reminderSentAt: now } });
      continue;
    }
    try {
      await sendLessonReminderEmail(email, {
        childName: l.enrollment.child.name,
        direction: l.enrollment.directionTitle,
        whenText: fmtWhen(l.startsAt),
        topic: l.topic,
        joinUrl: l.joinUrl || l.enrollment.zoomUrl,
      });
      await prisma.lesson.update({ where: { id: l.id }, data: { reminderSentAt: now } });
      sent++;
    } catch (e) {
      console.error("[reminders] не удалось отправить для занятия", l.id, e);
      // не помечаем — попробуем в следующий запуск
    }
  }

  const weeklyReportsSent = await sendDueWeeklyProgressReports(now);

  return { sent, checked: lessons.length, weeklyReportsSent };
}

/**
 * Раз в 7 дней отправляет родителям, у которых была активность на курсах за последнюю
 * неделю, короткое письмо со сводкой прогресса и наградами ребёнка.
 */
export async function sendDueWeeklyProgressReports(now = new Date()): Promise<number> {
  const weekAgo = new Date(now.getTime() - WEEK_MS);
  const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://znayton.ru").replace(/\/+$/, "");

  const users = await prisma.user.findMany({
    where: {
      isBlocked: false,
      OR: [{ lastWeeklyReportAt: null }, { lastWeeklyReportAt: { lte: weekAgo } }],
      courseProgress: {
        some: {
          completedCount: { gt: 0 },
          lastActivityAt: { gte: weekAgo },
        },
      },
    },
    include: {
      courseProgress: true,
      children: {
        orderBy: { createdAt: "asc" },
        include: { achievements: { orderBy: { earnedAt: "desc" }, take: 6 } },
      },
    },
    take: 50,
  });

  let sent = 0;
  for (const u of users) {
    if (!u.email) continue;
    const courses = u.courseProgress
      .filter((cp) => cp.completedCount > 0 && isDirectionSlug(cp.direction))
      .map((cp) => ({
        title: DIRECTIONS[cp.direction as keyof typeof DIRECTIONS].title,
        completedCount: cp.completedCount,
        unit: cp.direction === "podgotovka-k-shkole" ? "миссий" : "уроков",
      }));
    if (courses.length === 0) continue;

    const firstChild = u.children[0];
    const achievements = u.children.flatMap((c) => c.achievements).slice(0, 6);

    try {
      await sendWeeklyProgressEmail(u.email, {
        parentName: u.name,
        childName: firstChild?.name,
        courses,
        achievements,
        cabinetUrl: `${site}/cabinet`,
      });
      await prisma.user.update({ where: { id: u.id }, data: { lastWeeklyReportAt: now } });
      sent++;
    } catch (e) {
      console.error("[weekly-report] не удалось отправить для", u.id, e);
    }
  }

  return sent;
}
