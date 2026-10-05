# 🧟 Zombie Bingo Apocalypse

Repositorio oficial del proyecto **Zombie Bingo**, compuesto por una arquitectura desacoplada y moderna:
- **Frontend SPA (React 19 + TypeScript + Vite + Tailwind CSS v4 + Three.js):** Desplegado en producción en GitHub Pages / Vercel.
- **Backend API (PHP 8.2 + Apache + PDO MySQL):** Contenerizado con Docker para despliegue en Render / Cloud.

---

## 🚀 Enlaces de Producción
- **Frontend en Vivo (GitHub Pages):** [https://brayancortes22.github.io/zombie-bingo/](https://brayancortes22.github.io/zombie-bingo/)
- **Backend en Vivo (Render):** [https://zombie-bingo-backend.onrender.com](https://zombie-bingo-backend.onrender.com)
- **Panel del Servicio en Render:** [https://dashboard.render.com/web/srv-db1jrn7avr4c73c9bb10](https://dashboard.render.com/web/srv-db1jrn7avr4c73c9bb10)
- **Repositorio GitHub:** [https://github.com/brayancortes22/zombie-bingo](https://github.com/brayancortes22/zombie-bingo)

---

## 🛠️ Despliegue del Backend en Render (Docker)

El backend cuenta con un [`Dockerfile`](./Dockerfile) oficial basado en `php:8.2-apache` y un manifiesto [`render.yaml`](./render.yaml).

### Pasos para desplegar en Render:
1. Inicia sesión en [render.com](https://render.com).
2. Haz clic en **New +** > **Web Service**.
3. Conecta tu repositorio de GitHub: `brayancortes22/zombie-bingo`.
4. Render detectará automáticamente el archivo `Dockerfile`.
5. En la sección **Environment Variables**, configura tus credenciales de base de datos MySQL (por ejemplo de Railway, TiDB Serverless, Supabase o Clever Cloud):
   - `DB_HOST`: Host de tu servidor MySQL en la nube.
   - `DB_USER`: Usuario de la base de datos.
   - `DB_PASSWORD`: Contraseña de la base de datos.
   - `DB_NAME`: Nombre de la base de datos (ej. `zombie_plash_bd`).
   - `DB_PORT`: Puerto de conexión (por defecto `3306`).
   *Alternativamente, puedes pasar una única variable `DATABASE_URL` o `MYSQL_URL`.*
6. Haz clic en **Create Web Service**. ¡Tu backend estará disponible con una URL pública HTTPS tipo `https://zombie-bingo-backend.onrender.com`!

### Base de Datos MySQL:
El esquema y datos iniciales se encuentran en:
- `zombie-plash/sql/zombie_plash_bd (1).sql`

---

## 🎮 Modos y Funcionalidades Recientes
- **⚡ Modo Auto-Piloto Zombie:** Extracción automática periódica de balotas cada 3.2s combinada con auto-marcado (*auto-dauber*) instantáneo en el cartón del jugador con sonido de sello de sangre (`stamp`) y detección automática de victorias (líneas, diagonales, cuatro esquinas y blackout).
- **👤 Autenticación Dinámica y Personalización:** El juego inicia obligatoriamente en la pantalla de Login permitiendo seleccionar libremente el alias de supervivencia, avatar personalizado, inicio rápido con Google OAuth o modo invitado dinámico, evitando perfiles fijos o credenciales quemadas.

---

## 🛡️ Estructura de Ramas (Regla 4)
El proyecto se rige por un flujo estricto de 3 ramas:
- `development`: Rama de desarrollo activo donde se integran las nuevas características.
- `qa`: Rama de aseguramiento de calidad y pruebas (Staging).
- `production`: Rama de producción oficial y estable.
- `master`: Sincronizada con `production` para integración nativa con GitHub Pages.

---

## 👨‍💻 Autor
**Brayan Stid Cortés Lombana (`bscl`)**
- Email: `brayanstidcorteslombana@gmail.com`
