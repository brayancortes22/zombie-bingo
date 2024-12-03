<?php
require_once '../../setting/conexion-base-datos.php';

function reiniciarBalotas($id_sala) {
    global $conexion;
    $pdo = $conexion->conectar();
    
    try {
        $pdo->beginTransaction();
        
        // Reiniciar balotas
        $sql = "UPDATE balotas 
                SET orden_salida = NULL,
                    estado = 0 
                WHERE id_sala = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id_sala]);
        
        // Reiniciar estado de la sala
        $sql = "UPDATE salas 
                SET numeros_sacados = '[]',
                    ultimo_numero_sacado = CURRENT_TIMESTAMP 
                WHERE id_sala = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id_sala]);
        
        $pdo->commit();
        return ['success' => true];
        
    } catch (PDOException $e) {
        $pdo->rollBack();
        error_log("Error al reiniciar balotas: " . $e->getMessage());
        return ['success' => false, 'message' => $e->getMessage()];
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');
    $data = json_decode(file_get_contents('php://input'), true);
    $id_sala = $data['id_sala'] ?? null;
    
    if (!$id_sala) {
        echo json_encode(['success' => false, 'message' => 'ID de sala no proporcionado']);
        exit;
    }
    
    echo json_encode(reiniciarBalotas($id_sala));
}
?> 