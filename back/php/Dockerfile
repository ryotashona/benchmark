FROM php:8.2.3-fpm

RUN apt-get update\
 && apt-get install -y --no-install-recommends time libpq-dev \
 && rm -rf /var/lib/apt/lists/* \
 && docker-php-ext-install pdo_mysql mysqli

COPY ./php.ini /usr/local/etc/php/php.ini

COPY ./src /opt

EXPOSE 9000