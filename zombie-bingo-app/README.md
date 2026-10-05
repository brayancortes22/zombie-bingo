# 🧟 Zombie Bingo Apocalypse - Modern Web Edition

Videojuego de Bingo temático post-apocalíptico zombie remasterizado a tecnología moderna (React 19 + TypeScript + Three.js + Tailwind CSS v4 + Vite).

---

## 🚀 Arquitectura y Tecnologías
- **Core:** React 19, TypeScript (~6.0), Vite v8.
- **Gráficos & Animación:** Three.js (Balotera 3D con iluminación dinámica y esferas numeradas), Web Audio API, Canvas Confetti.
- **Estilos:** Tailwind CSS v4, Glassmorphism, animaciones aceleradas por GPU a 60 FPS, tipografía de terror (`Halloweek` / `Z-2`).
- **Autenticación:**
  - Login y Registro de Supervivientes tradicional.
  - **Google Identity Services (GSI) / OAuth 2.0:** Botón oficial "Continuar con Google" con extracción de perfil (`name`, `email`, `avatar`) y fallback interactivo de desarrollo local.
  - Modo Espectador / Invitado.

---

## 🕹️ Pantallas y Flujos
1. **Acceso (`LoginView`):**
   - Formulario de credenciales clásicas.
   - Selector de avatar zombie.
   - Botón oficial Google OAuth 2.0 ("Continuar con Google" / "Registrarse con Google").
   - Modo Invitado rápido.
2. **Inicio del Refugio (`HomeView`):**
   - Mascota Zombie animada en canvas central.
   - HUD superior con estado del jugador (indicador Google o nivel de superviviente).
   - Acciones principales: *Jugar Solo*, *Crear Sala*, *Unirse a Sala*, *Guía de Pociones*, *Control de Audio*.
3. **Guía de Pociones (`PotionsGuideView`):**
   - Catálogo interactivo de pociones (`cura.png`, `escudo.png`, `velocidad.png`, etc.) con efectos de balanceo (`@keyframes agitar`) y descripción táctica.
4. **Crear Sala (`CreateRoomView`):**
   - Configuración de código de sala, límite de jugadores (2 a 8) y contraseña de acceso opcional.
5. **Unirse a Sala (`JoinRoomView`):**
   - Búsqueda y conexión por ID de sala y contraseña.
6. **Lobby de Supervivientes (`LobbyView`):**
   - Sala de espera multijugador con lista de jugadores, indicador de listos (*Ready*) y arranque del host.
7. **Partida Activa (`GameView`):**
   - **Balotera 3D (Three.js):** Cilindro giratorio con esferas numeradas que caen al activarse.
   - **Cartón de Bingo (5x5):** Marco de piedra gótica (`marco.jpg`), celdas circulares con sangre (`mancha1.png` / `mancha2.png`), selector de números cantados y botón central ¡BINGO! con borde láser pulsante.
   - **Estante de Pociones:** Uso en tiempo real de consumibles con cooldown.
   - **Radar de Rivales:** Progreso en vivo de otros supervivientes bot/remotos.

---

## ⚙️ Configuración de Variables de Entorno

Copia el archivo de ejemplo y configura tu Client ID de Google si deseas utilizar autenticación real de Google Cloud Console:

```bash
cp .env.example .env
```

En `.env`:
```env
# Google Identity Services (GSI)
VITE_GOOGLE_CLIENT_ID=tu_cliente_id.apps.googleusercontent.com
```

*Nota: Si `VITE_GOOGLE_CLIENT_ID` se deja vacío o no está configurado, la aplicación activa automáticamente el selector de cuentas Google de desarrollo local para pruebas inmediatas sin bloqueos.*

---

## 🛠️ Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo Vite
npm run dev

# Compilar para producción (TypeScript + Bundle)
npm run build

# Previsualizar build de producción
npm run preview
```
