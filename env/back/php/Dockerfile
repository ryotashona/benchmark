FROM php:8.2.3-fpm

RUN apt-get update\
 && apt-get install -y time libpq-dev \
 && docker-php-ext-install pdo_mysql mysqli

COPY ./php.ini /usr/local/etc/php/php.ini

