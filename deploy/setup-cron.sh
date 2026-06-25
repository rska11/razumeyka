#!/usr/bin/env bash
# Включает email-напоминания: секрет в .env + ежечасный cron, дёргающий эндпоинт.
# Запуск один раз: bash /var/www/razumeyka/deploy/setup-cron.sh
set -euo pipefail

APP_DIR=/var/www/razumeyka
ENV="$APP_DIR/.env"
DOMAIN=razumeyka-school.ru

# 1. Секрет для cron-эндпоинта (создаём, если нет)
if ! grep -q '^CRON_SECRET=' "$ENV"; then
  echo "CRON_SECRET=$(openssl rand -hex 24)" >> "$ENV"
  echo "[cron] CRON_SECRET создан в .env"
fi
SECRET=$(grep '^CRON_SECRET=' "$ENV" | head -1 | cut -d= -f2- | tr -d '"')

# 2. Crontab: раз в час дёргаем эндпоинт напоминаний
LINE="0 * * * * curl -s -H 'Authorization: Bearer $SECRET' https://$DOMAIN/api/cron/reminders >/dev/null 2>&1"
( crontab -l 2>/dev/null | grep -v 'api/cron/reminders' ; echo "$LINE" ) | crontab -
echo "[cron] crontab установлен (каждый час)"

# 3. Перезапуск приложения, чтобы оно увидело CRON_SECRET
pm2 reload razumeyka --update-env >/dev/null 2>&1 || true

echo "✅ ГОТОВО: email-напоминания включены. Проверка вручную:"
echo "   curl -s -H 'Authorization: Bearer $SECRET' https://$DOMAIN/api/cron/reminders"
