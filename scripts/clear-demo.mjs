// Одноразовая очистка демо-данных (дети + demo-оплаты).
// Запуск на сервере: cd /var/www/razumeyka && node scripts/clear-demo.mjs
import fs from "node:fs";
import { PrismaClient } from "@prisma/client";

// загрузим DATABASE_URL из .env (node сам .env не читает)
try {
  const env = fs.readFileSync(new URL("../.env", import.meta.url), "utf8");
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^DATABASE_URL=(.*)$/);
    if (m) process.env.DATABASE_URL = m[1].replace(/^"(.*)"$/, "$1");
  }
} catch {}

const prisma = new PrismaClient();

// удаляем всех детей (каскадом уйдут записи/занятия/достижения) и demo-оплаты
const children = await prisma.child.deleteMany({});
const payments = await prisma.payment.deleteMany({ where: { provider: "demo" } });

console.log(`Очищено: детей ${children.count}, demo-оплат ${payments.count}. Кабинет чистый.`);
await prisma.$disconnect();
