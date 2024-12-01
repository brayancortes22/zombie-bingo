<?php
header('Content-Type: application/json');
require_once '../setting/conexion-base-datos.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    $id_sala = $data['id_sala'];
    $id_jugador = $data['id_jugador'];

    // Verificar si el usuario es el creador de la sala
    $stmt = $conexion->conectar()->prepare("SELECT id_creador FROM salas WHERE id_sala = ? AND id_creador = ?");
    $stmt->execute([$id_sala, $id_jugador]);
    $result = $stmt->fetch();

    if (!$result) {
        echo json_encode(['success' => false, 'message' => 'No tienes permiso para cerrar esta sala']);
        exit;
    }

    // Eliminar registros de jugadores_en_sala
    $stmt = $conexion->conectar()->prepare("DELETE FROM jugadores_en_sala WHERE id_sala = ?");
    $stmt->execute([$id_sala]);

    // Eliminar la sala
    $stmt = $conexion->conectar()->prepare("DELETE FROM salas WHERE id_sala = ?");
    $stmt->execute([$id_sala]);

    echo json_encode(['success' => true, 'message' => 'Sala cancelada exitosamente']);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>
