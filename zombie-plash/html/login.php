<?php
session_start();

// Verificar si el usuario ya ha iniciado sesión
if (isset($_SESSION['id_usuario'])) {
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
</head>

<body>
    <div class="flex-container">
        <div class="cuadro">
            <div class="largo">
                <div class="invitado">
                    <a href="">
                        <button type="button" class="btn success"><strong>Ver juego</strong></button>
                    </a>
                </div>
                <div class="cuenta">
                    <a href="./registrate.html">
                        <button type="button" class="btn success"><strong>Crear cuenta</strong></button>
                    </a>
                </div>
            </div>
            <!-- formulario  -->
            <form id="formulario" action="../php/inicio_sesion.php" method="POST">
                <div class="texto"><strong>Iniciar sesión</strong></div>
                <div class="zombie2">
                    <img src="../img/image-removebg-preview.png" alt="">
                </div>
                <div class="form1">
                    <label for="nombre"><strong>Usuario o correo electrónico</strong></label>
                    <input type="text" class="redondeo" id="nombre" name="nombre" placeholder="nombre_usu" required>
                </div>
                <div class="form2">
                    <label for="contraseña"><strong>Contraseña</strong></label>
                    <input type="password" class="redondeo" id="contraseña" name="contraseña" placeholder="contraseña_usu" required>
                </div>
                <div class="iniciar">
                    <button type="submit" class="btn success"><strong>Iniciar sesión</strong></button>
                </div>
                <!-- mensaje de error -->
                <div id="generalError" class="error"></div>
                <div class="olvidado">
                    <a href="./codigo1.php">¿Olvidaste tu contraseña?</a>
                </div>
                <div class="zombie" id="z_3"></div>
            </form>
        </div>
        <!-- animacion de fantasma -->
        <div id="z_1" class="fantasma1"></div>
        <div id="z_2" class="fantasma2"></div>
    </div>
    <script src="../json/anima.js"></script>
</html>
<script>

</script>
