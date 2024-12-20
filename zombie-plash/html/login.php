
<?php
session_start();

// Verificar si el usuario ya ha iniciado sesión
if (isset($_SESSION['user_id'])) {
    // El usuario ya ha iniciado sesión, redirigir a la página de inicio
    header("Location: inicio.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/login.css">
    <link rel="icon" href="../img/image-removebg-preview.png" type="image/png">
    <link rel="stylesheet" href="../css/fuentes.css">
        <!-- ... otros elementos ... -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js"></script>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <title>Login</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>

<body>
    <div class="container">
            <div class="cuadro">
                <div class="largo">
                    <div class="verjuego">
                        <a href="./ver_juego.html">
                           <button type="button" class="btn success ver" ><strong>Ver juego</strong></button>
                        </a>
                    </div>
                    <div class="cuenta">
                        <a href="./registrate.html">
                            <button type="button" class="btn success cuentas"><strong>Crear cuenta</strong></button>
                        </a>
                    </div>
            </div>
            <div class="texto">Iniciar sesión</div>
                <div class="todo">
                    <div class="cuadro1">
                        <div class="zombie2">
                            <img src="../img/image-removebg-preview.png"  alt="imagen" class="ww">
                        </div> 
                    </div>
                    <div class="cuadro2">
                    <form id="formulario" onsubmit="redirectAfterLogin(event)">
                <div class="form1">
                    <label for="nombre">Usuario o correo electrónico</label>
                    <input type="text" class="redondeo" id="nombre" name="nombre" placeholder="nombre_usu" required>
                </div>
                <div class="form2">
                    <label for="contraseña">Contraseña</label>
                    <input type="password" class="redondeo" id="contraseña" name="contraseña" placeholder="contraseña_usu" required>
                </div>
                <div class="iniciar">
                    <button type="submit" class="btn success nj"><strong>Iniciar sesión</strong></button>
                </div>
                <!-- mensaje de error -->
                <div id="generalError" class="error"></div>
<br>
                <div class="olvidado">
                    <a href="../html/restablecimientoContra.html">¿Olvidaste tu contraseña?</a>
                </div>
                
            </form>
        </div>
        <div class="cuadro3">
        <div class="zombie" id="z_3"></div>
        </div>
        </div>
            <script>
                // Función que se ejecuta cuando el formulario es enviado
                function redirectAfterLogin(event) {
                    event.preventDefault(); // Evita que el formulario se envíe de forma normal
            
                    // Redirige a la página de cargando con el redirect a la página de inicio
                    window.location.href = './cargando.html?redirect=./inicio.php';
                }
            </script>
            
        </div>
    </div>
      <!-- Otros elementos del head -->
      <script src="/zombie-bingo/zombie-plash/sound/audio.js"></script>

<script>
document.addEventListener('DOMContentLoaded', function() {
    audioManager.play('game');
});
</script>
    <script src="../json/anima.js"></script>
    <script src="../js/validar_inicio_sesion.js"></script>
    
</body>
</html>
<script>

</script>