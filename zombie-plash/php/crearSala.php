<?php
session_start();
require '../setting/conexion-base-datos.php'; // Asegúrate de tener este archivo con la conexión

header('Content-Type: application/json');

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método no permitido');
    }

    if (!isset($_SESSION['id_usuario'])) {
        throw new Exception('Usuario no autenticado. Información de sesión: ' . json_encode($_SESSION));
    }

    $nombre_sala = $_POST['nombreSala'] ?? '';
    $contrasena = $_POST['contraseñaSala'] ?? '';
    $num_jugadores = $_POST['maxJugadores'] ?? 0;
    $id_creador = $_SESSION['id_usuario'];

    if (empty($nombre_sala) || empty($contrasena) || empty($num_jugadores)) {
        throw new Exception('Datos incompletos');
    }

    $contrasena_hash = password_hash($contrasena, PASSWORD_DEFAULT);
    $id_sala = uniqid();

    $sql = "INSERT INTO salas (id_sala, id_creador, nombre_sala, contraseña, max_jugadores, jugadores_unidos) VALUES (?, ?, ?, ?, ?, 1)";
    $stmt = $conexion->prepare($sql);
    
    if (!$stmt->execute([$id_sala, $id_creador, $nombre_sala, $contrasena_hash, $num_jugadores])) {
        throw new Exception('Error al crear la sala: ' . implode(", ", $stmt->errorInfo()));
    }

    $_SESSION['sala_actual'] = $id_sala;

    echo json_encode(['success' => true, 'id_sala' => $id_sala]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
