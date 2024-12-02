<?php
require_once '../../setting/conexion-base-datos.php';

function salirDeSala($id_sala, $id_jugador) {
    global $conexion;
    $pdo = $conexion->conectar();
    
    try {
        // Eliminar jugador de la sala
        $sql = "DELETE FROM jugadores_en_sala 
                WHERE id_sala = ? AND id_jugador = ?";
                
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id_sala, $id_jugador]);
        
        // Actualizar contador de jugadores en la sala
        $sql = "UPDATE salas 
                SET jugadores_unidos = jugadores_unidos - 1 
                WHERE id_sala = ?";
                
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id_sala]);
        
        return ['success' => true];
        
    } catch (PDOException $e) {
        return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (isset($data['id_sala'])) {
        $resultado = salirDeSala($data['id_sala'], $_SESSION['id_jugador']);
        echo json_encode($resultado);
    } else {
        echo json_encode(['success' => false, 'message' => 'ID de sala no proporcionado']);
    }
}
?> 