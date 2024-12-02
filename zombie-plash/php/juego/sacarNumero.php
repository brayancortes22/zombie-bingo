<?php
require_once '../../setting/conexion-base-datos.php';

function sacarBalota($id_sala) {
    global $conexion;
    $pdo = $conexion->conectar();
    // Seleccionar una balota no usada aleatoriamente
    $sql = "SELECT id_balota, numero, letra FROM balotas 
            WHERE id_sala = ? AND estado = 0 
            ORDER BY RAND() LIMIT 1";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$id_sala]);
    $resultado = $stmt->fetch();
    
    if ($balota = $resultado) {
        // Después de sacar la balota exitosamente
        $sql_update_sala = "UPDATE salas SET numeros_sacados = JSON_ARRAY_APPEND(
            COALESCE(numeros_sacados, '[]'),
            '$',
            ?
        ) WHERE id_sala = ?";
        $stmt = $pdo->prepare($sql_update_sala);
        $stmt->execute([$balota['numero'], $id_sala]);
        return [
            'success' => true,
            'numero' => $balota['numero'],
            'letra' => $balota['letra']
        ];
    }
    
    return ['success' => false, 'message' => 'No hay más balotas disponibles'];
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id_sala = $data['id_sala'] ?? null;
    
    if ($id_sala) {
        $resultado = sacarBalota($id_sala);
        echo json_encode($resultado);
    } else {
        echo json_encode(['success' => false, 'message' => 'ID de sala no proporcionado']);
    }
}
?>
