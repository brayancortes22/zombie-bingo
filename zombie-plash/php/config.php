<?php
session_start();
require_once('../php/config.php');
$email = $_POST['email'];

// Verificar si el usuario ya ha iniciado sesión
if (isset($_SESSION['id_usuario'])) {
    // El usuario ya ha iniciado sesión, redirigir a la página de inicio
    header("Location: inicio.php");
    exit();
}