<?php
session_start();

// Verificar si el usuario ha iniciado sesión
if (!isset($_SESSION['id_usuario'])) {
    // Si no hay sesión activa, redirigir al login
    header("Location: login.php");
    exit();
}


?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="../css/inicio.css"><link
    
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
        crossorigin="anonymous"
    />
    <link rel="stylesheet" href="../css/fuentes.css">

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    

    <script src=""></script>
    <title>Zombie plash</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>
<body>
    <!-- Resto del contenido de la página de inicio -->
    <div class="container-fluid">
        <div class="imagen">
            <div class="primera">
            <a href="./perfiljugador.html">
        <div class="circulop1">
            <img src="../uploads/avatars/<?php echo htmlspecialchars($avatar); ?>" alt="Avatar del jugador">
        </div>
    </a>
                   
                    
                    <button class="Btn" onclick="cerrarSesion()">
                        
                        <div class="sign"><svg viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></svg></div>
                        
                        <div class="text">Cerrar sesión</div>
</button>
<div class="nombre">   
    <script src="../js/nombreUsuario.js"></script>
<h1>Bienvenido, <h2><strong id="nombreCompleto"><span>Cargando...</span></strong></h2>
</div>
            </div>
            <div class="izquierda">
                <div class="col1">
                <div class="sonido">
                    <button type="button" class="bsonido" id="botonSonido" onclick="toggleAudio()">
                    <i class="bi bi-volume-up" id="iconoSonido"></i>
                    </button>
                </div>
                    <div class="conpartir"><button type="button" class="bconpartir">
                        <a href="./compartir.html">
                        <i class="bi bi-share-fill"></i>
                        </a>
                    </button></div>
                    <div class="posion"><button type="button" class="bposion">
                        <a href="./posionesZombie.html">
                            <i class="bi bi-capsule"></i>
                        </a>
                    </button></div>
                </div>

                <div class="zombie">
                    <img src="../img/zombie_inicio.png" alt="" srcset="">
                </div>
                <div class="col2">
                    <div class="crear">
                        <button type="submit" class="bcrear" onclick="window.location.href='./creaTuSala.html'">
                                
                                <i class="fas fa-users">
                                </i>
                                <strong>Crear sala</strong></button>
                            </div>
                            <div onclick="window.location.href='./uniseSala.html'" class="unirse">
                                <button type="button" class="bunirse"> 
                            <i class="fas fa-heart">
                            </i>
                            <strong>Unirse a una sala</strong></button>
                        </div>
                        
                </div>
            </div>
            <div class="abajo">
               <div class="titulo"><strong>Amigos agregados</strong></div>
               <div class="filass" id="amigosAvatares">
                <!-- Los avatares se cargarán dinámicamente aquí -->
               </div>
               <div class="filass1" id="amigosNombres">
                <!-- Los nombres se cargarán dinámicamente aquí -->
               </div>
            </div>
            
        </div>
    </div>
    <!-- Otros elementos del head -->
    <script src="/zombie-bingo/zombie-plash/sound/audio.js"></script>

<script>
document.addEventListener('DOMContentLoaded', function() {
    let isMuted = localStorage.getItem('audioMuted') === 'true';
    const iconoSonido = document.getElementById('iconoSonido');
    let isToggling = false; // Prevenir múltiples clics

    if (!window.audioManager) {
        window.audioManager = new AudioManager();
    }

    // Establecer icono inicial
    if (isMuted) {
        iconoSonido.classList.remove('bi-volume-up');
        iconoSonido.classList.add('bi-volume-mute');
    }

    window.toggleAudio = async function() {
        if (isToggling) return; // Evitar múltiples clics
        isToggling = true;
        
        if (!isMuted) {
            await window.audioManager.mute();
            iconoSonido.classList.remove('bi-volume-up');
            iconoSonido.classList.add('bi-volume-mute');
        } else {
            await window.audioManager.unmute();
            iconoSonido.classList.remove('bi-volume-mute');
            iconoSonido.classList.add('bi-volume-up');
        }
        
        isMuted = !isMuted;
        
        // Permitir el siguiente toggle después de un breve delay
        setTimeout(() => {
            isToggling = false;
        }, 200);
    };
});
</script>

<style>
.bsonido {
    background: red;
    border: none;
    cursor: pointer;
    padding: 10px;
    transition: all 0.3s ease;
    /* Prevenir selección de texto al hacer doble clic */
    user-select: none;
    -webkit-user-select: none;
}

.bsonido:hover {
    transform: scale(1.1);
}

.bi-volume-up, .bi-volume-mute {
    font-size: 24px;
    color: #fff;
    transition: all 0.3s ease;
    pointer-events: none; /* Evitar problemas con el icono interno */
}
</style>
      <script src="../js/inicio.js"></script>
    <script src="../js/obtenerAmigos.js"></script>
</body>
</html>