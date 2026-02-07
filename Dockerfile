# =========================
# 1) FRONTEND BUILD (Vite)
# =========================
FROM node:20-alpine AS frontend
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build


# =========================
# 2) BACKEND BUILD (Composer)
# =========================
FROM composer:2 AS vendor
WORKDIR /app

# copy composer files first for caching
COPY composer.json composer.lock ./

# install dependencies WITHOUT running scripts (artisan not copied yet)
RUN composer install \
  --no-dev \
  --prefer-dist \
  --no-interaction \
  --no-progress \
  --optimize-autoloader \
  --no-scripts

# now copy full app (includes artisan)
COPY . .

# run scripts after artisan exists
RUN composer dump-autoload --optimize \
 && php artisan package:discover --ansi || true


# =========================
# 3) RUNTIME (Apache + PHP)
# =========================
FROM php:8.4-apache

RUN a2enmod rewrite
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
 && sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libpng-dev libjpeg62-turbo-dev libfreetype6-dev \
  && docker-php-ext-configure gd --with-freetype --with-jpeg \
  && docker-php-ext-install pdo_mysql zip gd \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

# app + vendor already installed
COPY --from=vendor /app /var/www/html

# copy built Vite assets (manifest.json)
COPY --from=frontend /app/public/build /var/www/html/public/build

RUN mkdir -p storage/framework/{cache,sessions,views} bootstrap/cache \
 && chown -R www-data:www-data storage bootstrap/cache \
 && chmod -R ug+rwX storage bootstrap/cache

EXPOSE 80
