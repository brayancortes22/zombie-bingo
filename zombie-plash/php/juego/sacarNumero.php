<?php
require_once '../../setting/conexion-base-datos.php';

function sacarBalota($id_sala) {
    global $conexion;
    $pdo = $conexion->conectar();
    
    try {
        error_log("Iniciando sacarBalota para sala: " . $id_sala);
        
        // Inicializar la transacción
        $pdo->beginTransaction();
        
        // Verificar balotas disponibles y seleccionar una
        $sql = "SELECT id_balota, numero, letra 
                FROM balotas 
                WHERE id_sala = ? AND estado = 0 
                ORDER BY RAND() 
                LIMIT 1 
                FOR UPDATE"; // Bloquear la fila seleccionada
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id_sala]);
        $balota = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($balota) {
            error_log("Balota seleccionada - ID: {$balota['id_balota']}, Número: {$balota['numero']}");
            
            // Actualizar el estado de la balota directamente
            $sql_update = "UPDATE balotas 
                          SET estado = 1 
                          WHERE id_balota = ? 
                          AND id_sala = ?";
            
            $stmt = $pdo->prepare($sql_update);
            $result = $stmt->execute([$balota['id_balota'], $id_sala]);
            
            if (!$result) {
                throw new PDOException("Error al actualizar el estado de la balota");
            }
            
            // Actualizar números sacados en la sala
            $sql_update_sala = "UPDATE salas 
                               SET numeros_sacados = JSON_ARRAY_APPEND(
                                   COALESCE(numeros_sacados, '[]'),
                                   '$',
                                   CAST(? AS JSON)
                               )
                               WHERE id_sala = ?";
            
            $stmt = $pdo->prepare($sql_update_sala);
            $result = $stmt->execute([$balota['numero'], $id_sala]);
            
            if (!$result) {
                throw new PDOException("Error al actualizar números en la sala");
            }
            
            // Confirmar la transacción
            $pdo->commit();
            
            error_log("Balota actualizada y guardada correctamente");
            
            return [
                'success' => true,
                'numero' => $balota['numero'],
                'letra' => $balota['letra']
            ];
        }
        
        $pdo->commit();
        return ['success' => false, 'message' => 'No hay más balotas disponibles'];
        
    } catch (PDOException $e) {
        $pdo->rollBack();
        error_log("Error en sacarBalota: " . $e->getMessage());
        return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
    }
}

// Verificar que se recibe el id_sala
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id_sala = $data['id_sala'] ?? null;
    
    if ($id_sala) {
        error_log("Procesando solicitud para sala: " . $id_sala);
        $resultado = sacarBalota($id_sala);
        echo json_encode($resultado);
    } else {
        echo json_encode(['success' => false, 'message' => 'ID de sala no proporcionado']);
    }
}
?>
