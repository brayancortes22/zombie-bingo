<?php
// Configuración de la base de datos
$host = 'localhost';
$usuario = 'root';
$contraseña = '';
$base_de_datos = 'Zombie_plash';

// Conexión a la base de datos
$conn = new mysqli($host, $usuario, $contraseña, $base_de_datos);

// Verificar la conexión
if ($conn->connect_error) {
    die("La conexión falló: " . $conn->connect_error);
}else{
    echo("conexion exitosa");
}
?>
