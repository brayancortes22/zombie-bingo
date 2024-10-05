<?php
// Conexión a la base de datos
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "Zombie_plash";

$conexion = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
}

// Verificar si el método de la solicitud es POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $codigo = $_POST['codigo'];  // Obtener el código de la sala desde la solicitud

    // Consultar la lista de jugadores conectados a la sala
    $sql = "SELECT nombre FROM jugadores WHERE sala_codigo = '$codigo'";
    $resultado = $conexion->query($sql);

    // Verificar si hay jugadores en la sala
    if ($resultado->num_rows > 0) {
        $jugadores = [];
        while ($fila = $resultado->fetch_assoc()) {
            $jugadores[] = $fila['nombre'];  // Almacenar el nombre del jugador
        }
        echo json_encode(['success' => true, 'jugadores' => $jugadores]);
    } else {
        echo json_encode(['success' => false, 'message' => 'No hay jugadores en la sala']);
    }
}

$conexion->close();  // Cerrar la conexión a la base de datos
?>
