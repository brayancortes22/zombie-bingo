<?php
require_once '../../setting/conexion-base-datos.php';

function sacarBalota($id_sala) {
    global $conexion;
    $pdo = $conexion->conectar();
    
    try {
        // Llamar al procedimiento almacenado
        $sql = "CALL sacar_balota(?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id_sala]);
        
        $balota = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$balota) {
            return ['success' => false, 'message' => 'No hay más balotas disponibles'];
        }
        
        // Log para debug
        error_log("Balota sacada - Número: {$balota['numero']}, Letra: {$balota['letra']}, Orden: {$balota['orden_salida']}");
        
        return [
            'success' => true,
            'numero' => $balota['numero'],
            'letra' => $balota['letra'],
            'orden' => $balota['orden_salida']
        ];
        
    } catch (PDOException $e) {
        error_log("Error en sacarBalota: " . $e->getMessage());
        return ['success' => false, 'message' => 'Error al sacar balota: ' . $e->getMessage()];
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
}
?>
