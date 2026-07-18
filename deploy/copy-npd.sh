#!/usr/bin/env bash
# Копирует креды «Мой налог» (НПД) из genpic в .env школы и включает авто-чеки.
# Запуск один раз: bash /var/www/razumeyka/deploy/copy-npd.sh
# После — pm2 restart razumeyka --update-env (или деплой через update.sh).
set -euo pipefail

DEST=/var/www/razumeyka/.env
SRC=""
for f in /var/www/magicpic/.env.local /var/www/magicpic/.env /var/www/magicpic/.env.production; do
  if [ -f "$f" ] && grep -q '^NPD_INN=' "$f"; then SRC="$f"; break; fi
done

if [ -z "$SRC" ]; then
  echo "ОШИБКА: не нашёл NPD_INN в env-файлах genpic."
  echo "Вот какие env-файлы есть у genpic:"
  ls -la /var/www/magicpic/.env* 2>/dev/null || echo "  (нет /var/www/magicpic/.env*)"
  exit 1
fi

echo "Источник кредов НПД: $SRC"
for K in NPD_INN NPD_PASSWORD; do
  sed -i "/^$K=/d" "$DEST"
  grep "^$K=" "$SRC" >> "$DEST"
done

# Свой device id (не genpic) + включение чеков
sed -i '/^NPD_DEVICE_ID=/d;/^NPD_RECEIPTS_ENABLED=/d' "$DEST"
echo "NPD_DEVICE_ID=razumeyka-server-001" >> "$DEST"
echo "NPD_RECEIPTS_ENABLED=1" >> "$DEST"

# ИНН самозанятого — в реквизиты оферты/политики (подставляется при сборке)
INN=$(grep '^NPD_INN=' "$DEST" | head -1 | cut -d= -f2- | tr -d '"')
sed -i '/^OPERATOR_INN=/d' "$DEST"
echo "OPERATOR_INN=$INN" >> "$DEST"

if ! grep -q '^OPERATOR_NAME=' "$DEST"; then
  echo "ВНИМАНИЕ: OPERATOR_NAME (ФИО самозанятого для оферты) не задан."
  echo "Добавь вручную:  echo 'OPERATOR_NAME=Фамилия Имя Отчество' >> $DEST"
fi

echo "Готово. Проверка (значения скрыты):"
for K in NPD_INN NPD_PASSWORD NPD_RECEIPTS_ENABLED OPERATOR_INN OPERATOR_NAME; do
  grep "^$K=" "$DEST" | sed 's/=.*/=<заполнено>/' || echo "$K НЕ записан"
done
echo "Дальше: реквизиты попадут в оферту при следующей сборке (update.sh),"
echo "чеки заработают после pm2 restart razumeyka --update-env."
