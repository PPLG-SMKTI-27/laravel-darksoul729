# =========================
# 1) FRONTEND BUILD (Vite)
# =========================
FROM node:20-alpine AS frontend
WORKDIR /app

# install deps
COPY package.json package-lock.json* ./
RUN npm ci

# copy source then build
COPY . .
RUN npm run build

# =========================
# 2) BACKEND BUILD (Composer)
# =========================
FROM composer:2 AS vendor
WORKDIR /app

# only composer files first (better cache)
COPY composer.json composer.lock ./
RUN composer install \
  --no-dev \
  --prefer-dist \
  --no-interaction \
  --no-progress \
  --optimize-autoloader

# copy the rest of app
COPY . .

# =========================
# 3) RUNTIME (Apache + PHP)
# =========================
FROM php:8.4-apache

# Apache: enable rewrite + set Laravel public folder
RUN a2enmod rewrite
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
 && sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# PHP extensions common for Laravel
RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libpng-dev libjpeg62-turbo-dev libfreetype6-dev \
  && docker-php-ext-configure gd --with-freetype --with-jpeg \
  && docker-php-ext-install pdo_mysql zip gd \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

# copy app + vendor (composer result)
COPY --from=vendor /app /var/www/html

# copy built Vite assets (manifest.json lives here)
COPY --from=frontend /app/public/build /var/www/html/public/build

# permissions for Laravel
RUN mkdir -p storage/framework/{cache,sessions,views} bootstrap/cache \
 && chown -R www-data:www-data storage bootstrap/cache \
 && chmod -R ug+rwX storage bootstrap/cache

# optional (kadang membantu, tapi aman juga tanpa ini)
# RUN php artisan config:clear && php artisan view:clear && php artisan route:clear

EXPOSE 80
