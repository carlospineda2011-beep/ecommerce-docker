# Etapa 1: dependencias de Composer
FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction

# Etapa 2: imagen final
FROM php:8.4-fpm-alpine
WORKDIR /var/www/html

RUN docker-php-ext-install pdo_mysql

COPY . .
COPY --from=vendor /app/vendor ./vendor

RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 9000
CMD ["php-fpm"]