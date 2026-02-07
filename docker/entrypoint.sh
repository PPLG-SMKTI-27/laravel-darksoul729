#!/usr/bin/env bash
set -e

cd /var/www/html

mkdir -p storage/framework/{cache,sessions,views} bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache || true
chmod -R ug+rwX storage bootstrap/cache || true

# .env fallback (tidak menimpa env vars dari Coolify)
if [ ! -f .env ] && [ -f .env.example ]; then
  cp .env.example .env
fi

if [ -z "${APP_KEY:-}" ]; then
  echo "WARNING: APP_KEY is not set."
fi

# Jalankan artisan hanya kalau file-nya ada
if [ -f artisan ]; then
  php artisan config:clear || true
  php artisan cache:clear || true
  php artisan config:cache || true
  php artisan route:cache || true
  php artisan view:cache || true

  if [ "${MIGRATE_ON_START:-false}" = "true" ]; then
    php artisan migrate --force || true
  fi
fi

exec apache2-foreground
