<?php
// Configuración de la base de datos
$host = 'localhost';
$db   = 'zombie_plash_bd';
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'errors' => ['general' => 'Error de conexión a la base de datos']]));
}