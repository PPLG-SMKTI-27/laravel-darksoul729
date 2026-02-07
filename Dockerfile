FROM node:20-alpine AS frontend
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Copy config build yang sering dibutuhkan
COPY vite.config.* ./
COPY postcss.config.* tailwind.config.* ./
COPY resources/ resources/
COPY public/ public/
RUN npm run build


FROM php:8.4-apache

RUN apt-get update && apt-get install -y \
    git unzip zip curl ca-certificates \
    libzip-dev libpng-dev libjpeg-dev libfreetype6-dev \
    libonig-dev libxml2-dev \
 && docker-php-ext-configure gd --with-freetype --with-jpeg \
 && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip \
 && rm -rf /var/lib/apt/lists/*

RUN a2enmod rewrite

# Set DocumentRoot ke public secara aman
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
 && sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock ./
COPY . .

RUN composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader

COPY --from=frontend /app/public/build /var/www/html/public/build

RUN mkdir -p storage/framework/{cache,sessions,views} bootstrap/cache \
 && chown -R www-data:www-data storage bootstrap/cache || true \
 && chmod -R ug+rwX storage bootstrap/cache || true

COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["apache2-foreground"]
