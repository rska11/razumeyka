#!/usr/bin/env bash
# Восстановление nginx для Разумейки: пишет полный HTTPS-конфиг, используя
# УЖЕ выпущенный сертификат (без обращения к certbot). apex = сайт, www → редирект.
set -euo pipefail

DOMAIN=razumeyka-school.ru
PORT=3001
CERT=/etc/letsencrypt/live/$DOMAIN
CONF=/etc/nginx/sites-available/razumeyka.conf

if [ ! -f "$CERT/fullchain.pem" ]; then
  echo "ОШИБКА: нет сертификата в $CERT."
  echo "Сначала выпусти: certbot --nginx -d $DOMAIN --non-interactive --agree-tos -m admin@genpic.ai --redirect"
  exit 1
fi

cat > "$CONF" <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    return 301 https://$DOMAIN\$request_uri;
}
server {
    listen 443 ssl;
    server_name www.$DOMAIN;
    ssl_certificate $CERT/fullchain.pem;
    ssl_certificate_key $CERT/privkey.pem;
    return 301 https://$DOMAIN\$request_uri;
}
server {
    listen 443 ssl;
    server_name $DOMAIN;
    ssl_certificate $CERT/fullchain.pem;
    ssl_certificate_key $CERT/privkey.pem;
    location / {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        add_header Cache-Control "no-store" always;
    }
}
EOF

ln -sf "$CONF" /etc/nginx/sites-enabled/razumeyka.conf
nginx -t && systemctl reload nginx
echo "ГОТОВО: razumeyka-school.ru снова отдаёт сайт школы (HTTPS, www → без www)."
