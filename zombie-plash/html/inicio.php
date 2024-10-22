<?php
session_start();

// Función para verificar si el usuario ha iniciado sesión
function verificarSesion() {
    if (!isset($_SESSION['username'])) {
        // Si no hay sesión activa, redirigir al login
        header("Location: login.php");
        exit();
    }
}

// Verificar la sesión al cargar la página
verificarSesion();

// Obtener el nombre de usuario de forma segura
$username = $_SESSION['username'];

// Añade esto para depuración
error_log("Sesión en inicio.php: " . print_r($_SESSION, true));

// El usuario ha iniciado sesión, mostrar la página de inicio
?>

<!DOCTYPE html>
<html lang="en">
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
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    

    <script src=""></script>
    <title>Zombie plash</title>
</head>
<body>
    <h1>Bienvenido, <?php echo htmlspecialchars($username); ?>!</h1>
    <div class="container-fluid">
        <div class="imagen">
            <div class="primera">
                <a href="./perfiljugador.html">
                    <div class="circulop1"> 
                    </div>
                </a>
                <button class="circulop2 cerrar-sesion" onclick="cerrarSesion()">
                    <div class="circulo-contenido">
                        <img src="../img/salirse.png" alt="Icono cerrar sesión">
                        <span>Cerrar sesión</span>
                    </div>
                </button>
        
<script>
function cerrarSesion() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        window.location.href = '../php/cerrar_sesion.php';
    }
}
</script>
             
            </div>
            <div class="izquierda">
                <div class="col1">
                    <div class="sonido"><button type="button" class="bsonido">
                        <i class="fas fa-volume-up"></i>
                    </button></div>
                    <div class="conpartir"><button type="button" class="bconpartir">
                        <i class="fas fa-share-alt"></i>
                    </button></div>
                    <div class="posion"><button type="button" class="bposion">
                        <a href="./posionesZombie.html">
                            <i class="fas fa-flask"></i>
                        </a>
                    </button></div>
                </div>
                <div class="col2">
                    <div class="crear">
                        <button type="button" class="bcrear" onclick="window.location.href='./creaTuSala.html'">
                                
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
                        <div class="jugar" onclick="window.location.href='jugar.html'">
                            <button type="button" class="bjugar"> 
                            <i class="fas fa-user">
                            </i>
                            <strong>Jugar en solitario</strong></button></div>
                </div>
            </div>
            <div class="abajo">
               <div class="titulo"><strong>Amigos agregados</strong></div>
               <div class="filass">
                <div class="columna">
                    <div class="usuario"></div>
                </div>
                <div class="columna">
                    <div class="usuario"></div>
                </div>
                <div class="columna">
                    <div class="usuario"></div>
                </div>
                <div class="columna">
                    <div class="usuario"></div>
                </div>
                <div class="columna">
                    <div class="usuario"></div>
                </div>
                <div class="columna">
                    <div class="usuario"></div>
                </div>
               </div>
               <div class="filass1">
                <div class="columna1">
                    <strong>Usuario-1</strong>
                </div>
                <div class="columna1">
                    <strong>Usuario-1</strong>
                </div>
                <div class="columna1">
                    <strong>Usuario-1</strong>
                </div>
                <div class="columna1">
                    <strong>Usuario-1</strong>
                </div>
                <div class="columna1">
                    <strong>Usuario-1</strong>
                </div>
                <div class="columna1">
                    <strong>Agregar Amigos</strong>
                </div>
               </div>
            </div>
            <div class="zombie">
                <img src="" alt="">
            </div>
        </div>
    </div>
    
</body>
</html>
