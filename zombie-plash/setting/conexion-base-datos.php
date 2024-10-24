<?php
// Configuración de la base de datos
$host = 'localhost';
$db   = 'zombie_plash_bd';
$user = 'root';
$pass = '';

$conexion = new mysqli($host, $user, $pass, $db);

if ($conexion->connect_error) {
    die(json_encode(['success' => false, 'errors' => ['general' => 'Error de conexión a la base de datos: ' . $conexion->connect_error]]));
}

// Establecer el conjunto de caracteres a utf8
$conexion->set_charset("utf8");
