#!/usr/bin/env bash
# Копирует ключи ЮKassa (SHOP_ID + SECRET_KEY) из genpic в .env школы.
set -euo pipefail

DEST=/var/www/razumeyka/.env
SRC=""
for f in /var/www/magicpic/.env.local /var/www/magicpic/.env /var/www/magicpic/.env.production; do
  if [ -f "$f" ] && grep -q '^YOOKASSA_SHOP_ID=' "$f"; then SRC="$f"; break; fi
done

if [ -z "$SRC" ]; then
  echo "ОШИБКА: не нашёл YOOKASSA_SHOP_ID в env-файлах genpic."
  echo "Вот какие env-файлы есть у genpic:"
  ls -la /var/www/magicpic/.env* 2>/dev/null || echo "  (нет /var/www/magicpic/.env*)"
  echo "Подскажи, где лежат ключи ЮKassa у genpic — поправлю."
  exit 1
fi

echo "Источник ключей: $SRC"
for K in YOOKASSA_SHOP_ID YOOKASSA_SECRET_KEY; do
  sed -i "/^$K=/d" "$DEST"
  grep "^$K=" "$SRC" >> "$DEST"
done

echo "Готово. Проверка (значения скрыты):"
grep '^YOOKASSA_SHOP_ID='   "$DEST" | sed 's/=.*/=<заполнено>/' || echo "SHOP_ID не записался"
grep '^YOOKASSA_SECRET_KEY=' "$DEST" | sed 's/=.*/=<заполнено>/' || echo "SECRET_KEY не записался"
