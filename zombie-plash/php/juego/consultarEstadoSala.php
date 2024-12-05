<?php
require_once '../setting/conexion-base-datos.php';

header('Content-Type: application/json');

try {
    $datos = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($datos['id_sala'])) {
        throw new Exception('ID de sala no proporcionado');
    }

    $conexionObj = new Conexion();
    $conexion = $conexionObj->conectar();

    $sql = "SELECT estado, ganador_id, ganador_nombre, ranking 
            FROM salas 
            WHERE id_sala = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->execute([$datos['id_sala']]);
    $sala = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$sala) {
        throw new Exception('Sala no encontrada');
    }

    echo json_encode([
        'success' => true,
        'estado' => $sala['estado'],
        'ganador_id' => $sala['ganador_id'],
        'ganador_nombre' => $sala['ganador_nombre'],
        'ranking' => json_decode($sala['ranking'], true)
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?> 