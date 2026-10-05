#!/bin/sh
set -e

PORT=${PORT:-80}

# Adaptar Apache al puerto dinámico asignado por Render / Cloud
sed -i "s/Listen 80/Listen $PORT/g" /etc/apache2/ports.conf
sed -i "s/:80/:$PORT/g" /etc/apache2/sites-available/000-default.conf

echo "🧟 Zombie Bingo Backend iniciando en puerto: $PORT"

exec apache2-foreground
