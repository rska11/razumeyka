#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# redirect-old-domain.sh — 301 со старого домена на новый (шаг переезда сайта
# в Яндекс Вебмастере).
#
# Зачем: сейчас razumeyka-school.ru и znayton.ru обслуживаются как ДВА
# самостоятельных сайта с одинаковым содержимым. Яндекс требует, чтобы
# неглавные адреса отдавали 301 на соответствующие страницы главного —
# без этого заявка на переезд отклоняется.
#
# Сертификат старого домена остаётся подключённым намеренно: робот должен
# суметь зайти по https и получить редирект, а не ошибку сертификата.
#
# Запуск на сервере:  bash /var/www/razumeyka/deploy/redirect-old-domain.sh
# Откат:              bash /var/www/razumeyka/deploy/redirect-old-domain.sh --revert
# ---------------------------------------------------------------------------
set -euo pipefail

OLD=razumeyka-school.ru
NEW=znayton.ru
CERT=/etc/letsencrypt/live/$OLD
CONF=/etc/nginx/sites-available/razumeyka.conf
BACKUP=/etc/nginx/sites-available/razumeyka.conf.before-redirect

if [ "${1:-}" = "--revert" ]; then
  if [ ! -f "$BACKUP" ]; then
    echo "ОШИБКА: копии $BACKUP нет — откатывать нечего."
    echo "Верни прежний конфиг вручную: bash deploy/fix-nginx.sh"
    exit 1
  fi
  cp "$BACKUP" "$CONF"
  nginx -t && systemctl reload nginx
  echo "ОТКАЧЕНО: $OLD снова отдаёт сайт сам, без редиректа."
  exit 0
fi

if [ ! -f "$CERT/fullchain.pem" ]; then
  echo "ОШИБКА: нет сертификата в $CERT."
  echo "Сертификат старого домена нужен: без него робот получит ошибку вместо редиректа."
  echo "Выпусти: certbot certonly --nginx -d $OLD -d www.$OLD --non-interactive --agree-tos -m admin@genpic.ai"
  exit 1
fi

# Сохраняем текущий конфиг один раз — чтобы --revert всегда возвращал исходное.
if [ -f "$CONF" ] && [ ! -f "$BACKUP" ]; then
  cp "$CONF" "$BACKUP"
  echo "[redirect] прежний конфиг сохранён в $BACKUP"
fi

cat > "$CONF" <<EOF
# Старый домен: только 301 на новый, с сохранением пути и параметров.
server {
    listen 80;
    server_name $OLD www.$OLD;
    return 301 https://$NEW\$request_uri;
}
server {
    listen 443 ssl;
    server_name $OLD www.$OLD;
    ssl_certificate $CERT/fullchain.pem;
    ssl_certificate_key $CERT/privkey.pem;
    return 301 https://$NEW\$request_uri;
}
EOF

ln -sf "$CONF" /etc/nginx/sites-enabled/razumeyka.conf
nginx -t && systemctl reload nginx

echo
echo "ГОТОВО: $OLD → 301 → https://$NEW (путь сохраняется)."
echo
echo "Проверь прямо сейчас:"
echo "  curl -I https://$OLD/podgotovka-k-shkole    # ждём 301 и Location на $NEW"
echo "  curl -I https://$NEW/podgotovka-k-shkole    # ждём 200"
echo
echo "Дальше в Яндекс Вебмастере: открыть панель СТАРОГО сайта ($OLD),"
echo "Настройки индексирования → Переезд сайта → выбрать $NEW, галка HTTPS."
echo "Если Яндекс скажет, что старый сайт недоступен — временно откатись"
echo "($0 --revert), подай заявку и верни редирект обратно."
