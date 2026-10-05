FROM php:8.2-apache

# Instalar extensiones requeridas para MySQL y utilidades
RUN docker-php-ext-install pdo pdo_mysql mysqli

# Habilitar módulos de Apache esenciales (Rewrite para URLs amigables y Headers para CORS)
RUN a2enmod rewrite headers

# Configurar DocumentRoot y permisos de Apache
ENV APACHE_DOCUMENT_ROOT /var/www/html/zombie-plash
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Habilitar AllowOverride All para soportar .htaccess
RUN sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf

# Copiar el código del backend
WORKDIR /var/www/html
COPY zombie-plash /var/www/html/zombie-plash

# Asignar permisos al usuario www-data
RUN chown -R www-data:www-data /var/www/html/zombie-plash \
    && chmod -R 755 /var/www/html/zombie-plash

# Script de entrada para vincular el puerto dinamico de Render ($PORT)
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 80 10000

ENTRYPOINT ["docker-entrypoint.sh"]
