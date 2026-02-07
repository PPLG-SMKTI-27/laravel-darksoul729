#!/usr/bin/env bash
set -euo pipefail

cd /var/www/html

# ---------------------------
# 1) Ensure folders + perms
# ---------------------------
mkdir -p storage/logs storage/framework/{cache,sessions,views} bootstrap/cache public/storage || true

# kalau ada file/folder kebentuk root, beresin
chown -R www-data:www-data storage bootstrap/cache public/storage || true
chmod -R ug+rwX storage bootstrap/cache public/storage || true

# pastikan laravel.log bisa ditulis
touch storage/logs/laravel.log || true
chown www-data:www-data storage/logs/laravel.log || true
chmod 664 storage/logs/laravel.log || true


# ---------------------------
# 2) .env fallback
# ---------------------------
if [ ! -f .env ] && [ -f .env.example ]; then
  cp .env.example .env
fi

# helper: set/replace key in .env
set_env() {
  local key="$1"
  local val="${2:-}"
  [ -z "$val" ] && return 0
  if grep -q "^${key}=" .env 2>/dev/null; then
    sed -i "s#^${key}=.*#${key}=${val}#g" .env
  else
    echo "${key}=${val}" >> .env
  fi
}

# ---------------------------
# 3) Sync Coolify ENV -> .env
# (ini yang bikin kamu nggak capek manual)
# ---------------------------
set_env APP_URL "${APP_URL:-}"
set_env APP_ENV "${APP_ENV:-production}"
set_env APP_DEBUG "${APP_DEBUG:-false}"

set_env DB_CONNECTION "${DB_CONNECTION:-mysql}"
set_env DB_HOST "${DB_HOST:-}"
set_env DB_PORT "${DB_PORT:-3306}"
set_env DB_DATABASE "${DB_DATABASE:-}"
set_env DB_USERNAME "${DB_USERNAME:-}"
set_env DB_PASSWORD "${DB_PASSWORD:-}"

# kalau kamu pakai session/cache database, ini penting biar nggak error aneh
set_env CACHE_STORE "${CACHE_STORE:-database}"
set_env SESSION_DRIVER "${SESSION_DRIVER:-database}"
set_env QUEUE_CONNECTION "${QUEUE_CONNECTION:-database}"

# ---------------------------
# 4) APP_KEY
# rekomendasi: set APP_KEY dari Coolify env biar persistent
# ---------------------------
if ! grep -q '^APP_KEY=base64:' .env 2>/dev/null; then
  if [ -n "${APP_KEY:-}" ]; then
    set_env APP_KEY "${APP_KEY}"
  else
    # generate kalau belum ada (akan nulis ke .env)
    php artisan key:generate --force || true
  fi
fi

# ---------------------------
# 5) Clear caches (pakai optimize:clear paling aman)
# ---------------------------
php artisan optimize:clear || true

# ---------------------------
# 6) Wait for DB (biar migrate ga "connection refused")
# ---------------------------
if [ "${DB_CONNECTION:-mysql}" = "mysql" ] && [ -n "${DB_HOST:-}" ]; then
  echo "Waiting for MySQL at ${DB_HOST}:${DB_PORT:-3306} ..."
  for i in {1..60}; do
    php -r '
      $h=getenv("DB_HOST"); $p=getenv("DB_PORT")?:3306; $db=getenv("DB_DATABASE");
      $u=getenv("DB_USERNAME"); $pw=getenv("DB_PASSWORD");
      try { new PDO("mysql:host=$h;port=$p;dbname=$db",$u,$pw); echo "DB_OK\n"; exit(0); }
      catch(Exception $e){ exit(1); }
    ' >/dev/null 2>&1 && break
    sleep 2
  done
fi

# ---------------------------
# 7) Always migrate (sesuai maumu)
# ---------------------------
php artisan migrate --force || true

# ---------------------------
# 8) storage:link (aman)
# ---------------------------
# kalau link udah ada, skip
if [ ! -L public/storage ]; then
  php artisan storage:link || true
fi

# last permission sweep
chown -R www-data:www-data storage bootstrap/cache public/storage || true
chmod -R ug+rwX storage bootstrap/cache public/storage || true

exec apache2-foreground
