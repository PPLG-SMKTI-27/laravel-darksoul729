#!/usr/bin/env bash
set -e

cd /var/www/html

mkdir -p storage/framework/{cache,sessions,views} bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache || true
chmod -R ug+rwX storage bootstrap/cache || true

# .env fallback
if [ ! -f .env ] && [ -f .env.example ]; then
  cp .env.example .env
fi

# APP_KEY: paling aman tetap set dari Coolify env (persistent).
# Kalau belum ada, generate.
if ! grep -q '^APP_KEY=base64:' .env 2>/dev/null; then
  if [ -n "${APP_KEY:-}" ]; then
    grep -q '^APP_KEY=' .env && sed -i "s#^APP_KEY=.*#APP_KEY=${APP_KEY}#" .env || echo "APP_KEY=${APP_KEY}" >> .env
  else
    echo "APP_KEY=" >> .env 2>/dev/null || true
    php artisan key:generate --force || true
  fi
fi

php artisan config:clear || true
php artisan cache:clear || true

# ✅ SELALU MIGRATE
php artisan migrate --force || true

php artisan storage:link || true

exec apache2-foreground
