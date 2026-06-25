import { prisma } from "@/lib/prisma";
import { sendLessonReminderEmail } from "@/lib/mailer";

const WINDOW_MS = 3 * 60 * 60 * 1000; // напоминаем за ~3 часа до начала

function fmtWhen(d: Date) {
  return new Intl.DateTimeFormat("ru-RU", {
    weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit",
  }).format(d);
}

/** Находит занятия, которые скоро начнутся, и шлёт родителю email (один раз на занятие). */
export async function sendDueReminders(): Promise<{ sent: number; checked: number }> {
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

  return { sent, checked: lessons.length };
}
