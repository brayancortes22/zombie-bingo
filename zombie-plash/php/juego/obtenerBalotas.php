<?php
require_once '../../setting/conexion-base-datos.php';
header('Content-Type: application/json');

function obtenerBalotas($id_sala) {
    global $conexion;
    $pdo = $conexion->conectar();
    
    try {
        // Validar que la sala existe
        $stmt = $pdo->prepare("SELECT id_sala FROM salas WHERE id_sala = ?");
        $stmt->execute([$id_sala]);
        if (!$stmt->fetch()) {
            throw new PDOException("La sala no existe");
        }

        // Obtener las últimas 5 balotas sacadas en orden
        $stmt = $pdo->prepare("
            SELECT numero, letra, orden_salida 
            FROM balotas 
            WHERE id_sala = ? AND estado = 1 
            ORDER BY orden_salida DESC 
            LIMIT 5
        ");
        $stmt->execute([$id_sala]);
        $balotas = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Obtener todas las balotas sacadas para el historial
        $stmt = $pdo->prepare("
            SELECT numero, letra, orden_salida 
            FROM balotas 
            WHERE id_sala = ? AND estado = 1 
            ORDER BY orden_salida ASC
        ");
        $stmt->execute([$id_sala]);
        $historial = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return [
            'success' => true,
            'balotas_recientes' => array_reverse($balotas),
            'historial' => $historial,
            'id_sala' => $id_sala
        ];
        
    } catch (PDOException $e) {
        error_log("Error al obtener balotas: " . $e->getMessage());
        return [
            'success' => false,
            'error' => 'Error al obtener balotas: ' . $e->getMessage(),
            'id_sala' => $id_sala
        ];
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id_sala = $data['id_sala'] ?? null;
    
    if (!$id_sala) {
        echo json_encode([
            'success' => false,
            'error' => 'ID de sala no proporcionado'
        ]);
        exit;
    }
    
    // Asegurarse de que el ID de sala sea un entero
    $id_sala = (int)$id_sala;
    echo json_encode(obtenerBalotas($id_sala));
}
?> 