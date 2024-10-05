<?php
// Conexión a la base de datos
$conexion = new mysqli("localhost", "root", "", "Zombie_plash");

// Validar la conexión
if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = $_POST['nombre'];
    $codigo = $_POST['codigo'];

    // Verificar si la sala existe
    $sql = "SELECT * FROM salas WHERE codigo = '$codigo'";
    $resultado = $conexion->query($sql);

    if ($resultado->num_rows > 0) {
        // Insertar al jugador en la sala
        $sqlInsert = "INSERT INTO jugadores (nombre, sala_codigo) VALUES ('$nombre', '$codigo')";
        if ($conexion->query($sqlInsert) === TRUE) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al unirse a la sala']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'El código de sala no existe']);
    }
}

$conexion->close();
?>
