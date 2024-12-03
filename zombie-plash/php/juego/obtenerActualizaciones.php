<?php
require_once '../../setting/conexion-base-datos.php';

function obtenerActualizaciones($id_sala) {
    global $conexion;
    $pdo = $conexion->conectar();
    
    try {
        // Llamar al procedimiento almacenado para obtener balotas
        $sql = "CALL obtener_balotas_sacadas(?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id_sala]);
        $balotas = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Obtener estado de la sala
        $sql_sala = "SELECT estado, jugando 
                     FROM salas 
                     WHERE id_sala = ?";
        $stmt = $pdo->prepare($sql_sala);
        $stmt->execute([$id_sala]);
        $sala = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return [
            'success' => true,
            'numerosSacados' => $balotas,
            'estadoSala' => $sala['estado'],
            'jugando' => $sala['jugando'],
            'ultimaActualizacion' => time()
        ];
        
    } catch (PDOException $e) {
        error_log("Error en obtenerActualizaciones: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Error al obtener actualizaciones: ' . $e->getMessage()
        ];
    }
}

// Asegurar que el contenido sea JSON
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id_sala = $data['id_sala'] ?? null;
    
    if (!$id_sala) {
        echo json_encode([
            'success' => false,
            'message' => 'ID de sala no proporcionado'
        ]);
        exit;
    }
    
    $resultado = obtenerActualizaciones($id_sala);
    echo json_encode($resultado);
    exit;
}
?> 