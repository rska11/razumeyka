#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# update.sh — БЕСШОВНЫЙ деплой Разумейки (как у genpic).
#   • собирает в .next-pending (сайт продолжает работать на старой .next);
#   • если сборка не удалась — .next НЕ трогаем, сайт остаётся жив;
#   • атомарно подменяет .next и делает pm2 reload (без простоя);
#   • создаёт swap (если нет), чтобы сборка не падала по памяти.
# Запуск (на сервере): bash /var/www/razumeyka/deploy/update.sh
# ---------------------------------------------------------------------------
set -euo pipefail

APP_DIR=/var/www/razumeyka
PM2_APP=razumeyka

cd "$APP_DIR"

# 0. swap (разово) — чтобы next build не убивало по нехватке памяти
if ! swapon --show 2>/dev/null | grep -q .; then
  if [ ! -f /swapfile ]; then
    echo "[update] создаю swap 2G (нет swap)"
    fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile >/dev/null && swapon /swapfile
    grep -q '/swapfile' /etc/fstab 2>/dev/null || echo '/swapfile none swap sw 0 0' >> /etc/fstab
  fi
fi

# 1. Свежий код
echo "[update] git pull"
git fetch origin main
git reset --hard origin/main

# 2. Зависимости + схема БД (идемпотентно)
echo "[update] npm install"
npm install --legacy-peer-deps
echo "[update] prisma db push"
npx prisma generate
npx prisma db push --skip-generate

# 3. Сборка в .next-pending (сайт всё ещё работает на .next)
echo "[update] build → .next-pending"
rm -rf .next-pending
# TypeScript scans the paths listed in tsconfig.json. Remove type stubs from the
# currently running build so deleted routes cannot poison the new build. These
# files are used only for type checking; Next.js does not need them at runtime.
rm -rf .next/types .next/dev/types
NEXT_DIST_DIR=".next-pending" npm run build

if [ ! -f .next-pending/BUILD_ID ]; then
  echo "❌ ОШИБКА: сборка не удалась (.next-pending/BUILD_ID нет)."
  echo "   Сайт НЕ тронут — работает прежняя версия. Деплой прерван."
  rm -rf .next-pending
  exit 1
fi

# 4. Атомарная подмена сборки + reload без простоя
echo "[update] подмена .next и reload"
rm -rf .next-old
[ -d .next ] && mv .next .next-old
mv .next-pending .next
pm2 reload "$PM2_APP" --update-env
pm2 save >/dev/null 2>&1 || true

# 5. Чистим старую сборку через 2 минуты (дать долететь in-flight запросам)
( sleep 120 && rm -rf "$APP_DIR/.next-old" ) >/dev/null 2>&1 &

echo "✅ ГОТОВО без простоя. BUILD_ID: $(cat .next/BUILD_ID)"
pm2 list | grep "$PM2_APP" || true
