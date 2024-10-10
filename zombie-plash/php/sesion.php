<?php
session_start();
include_once('../setting/conexion-base-datos.php');

$correo = $_POST['nombre'];
$contrasena = $_POST['contraseña'];
$validar_login = mysqli_query($conn, "SELECT * FROM registro_usuarios WHERE correo='$correo' and contraseña='$contraseña'");
if (mysqli_num_rows($validar_login) > 0) {
    $_SESSION['usuario'] =$correo;
    header("location: ../html/inicio.html");
    exit;
} else {
    echo '
<script>
alert("inicio de sesion exitoso");
window.location = "../html/inicio.html";
</script>
';
    exit;
}
