<?php
require_once '../../setting/conexion-base-datos.php';

function sacarBalota($id_sala) {
    global $conexion;
    $pdo = $conexion->conectar();
    
    try {
        // Iniciar transacción
        $pdo->beginTransaction();
        
        // Obtener una balota no usada aleatoria
        $sql = "SELECT id_balota, numero, letra 
                FROM balotas 
                WHERE id_sala = ? AND estado = 0 
                ORDER BY RAND() 
                LIMIT 1 
                FOR UPDATE";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id_sala]);
        $balota = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$balota) {
            $pdo->commit();
            return ['success' => false, 'message' => 'No hay más balotas disponibles'];
        }
        
        // Marcar la balota como usada
        $sql_update = "UPDATE balotas 
                      SET estado = 1 
                      WHERE id_balota = ?";
        $stmt = $pdo->prepare($sql_update);
        $stmt->execute([$balota['id_balota']]);
        
        // Actualizar números sacados en la sala
        $sql_update_sala = "UPDATE salas 
                           SET numeros_sacados = JSON_ARRAY_APPEND(
                               COALESCE(numeros_sacados, '[]'),
                               '$',
                               ?
                           )
                           WHERE id_sala = ?";
        $stmt = $pdo->prepare($sql_update_sala);
        $stmt->execute([$balota['numero'], $id_sala]);
        
        // Confirmar transacción
        $pdo->commit();
        
        return [
            'success' => true,
            'numero' => $balota['numero'],
            'letra' => $balota['letra']
        ];
        
    } catch (PDOException $e) {
        $pdo->rollBack();
        error_log("Error en sacarBalota: " . $e->getMessage());
        return ['success' => false, 'message' => 'Error al sacar balota'];
    }
}

// Asegurar que el contenido sea JSON
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id_sala = $data['id_sala'] ?? null;
    
    if (!$id_sala) {
        echo json_encode(['success' => false, 'message' => 'ID de sala no proporcionado']);
        exit;
    }
    
    $resultado = sacarBalota($id_sala);
    echo json_encode($resultado);
    exit;
} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}
?>
