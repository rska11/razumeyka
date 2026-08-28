import fs from 'node:fs';
import { PrismaClient } from '@prisma/client';

try {
  const raw = fs.readFileSync(new URL('../.env', import.meta.url), 'utf8');
  for (const line of raw.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match || line.trim().startsWith('#') || process.env[match[1]] !== undefined) continue;
    process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
  }
} catch {
  // На production переменные передаются окружением процесса.
}

const prisma = new PrismaClient();
const migrationKey = 'migration:school-prep-access-45-days:v1';

try {
  const result = await prisma.$transaction(async (tx) => {
    const completed = await tx.systemSetting.findUnique({ where: { key: migrationKey } });
    if (completed) return { skipped: true, updated: 0 };

    const active = await tx.access.findMany({
      where: { direction: 'podgotovka-k-shkole', until: { gt: new Date() } },
      select: { id: true, until: true },
    });
    for (const access of active) {
      const until = new Date(access.until);
      until.setDate(until.getDate() + 15);
      await tx.access.update({ where: { id: access.id }, data: { until } });
    }
    await tx.systemSetting.create({
      data: { key: migrationKey, value: JSON.stringify({ updated: active.length, completedAt: new Date().toISOString() }) },
    });
    return { skipped: false, updated: active.length };
  });

  console.log(result.skipped
    ? 'Продление уже было выполнено ранее — изменений нет.'
    : `Активный доступ к подготовке продлён на 15 дней. Записей: ${result.updated}.`);
} finally {
  await prisma.$disconnect();
}
