<?php
require_once '../../setting/conexion-base-datos.php';

function obtenerRolJugador($id_sala, $id_jugador) {
    global $conexion;
    $pdo = $conexion->conectar();
    
    try {
        $sql = "SELECT rol FROM jugadores_en_sala 
                WHERE id_sala = ? AND id_jugador = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id_sala, $id_jugador]);
        
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return [
            'success' => true,
            'rol' => $resultado ? $resultado['rol'] : 'participante'
        ];
    } catch (PDOException $e) {
        return [
            'success' => false,
            'message' => 'Error al obtener rol: ' . $e->getMessage()
        ];
    }
}

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id_sala = $data['id_sala'] ?? null;
    $id_jugador = $data['id_jugador'] ?? null;
    
    if ($id_sala && $id_jugador) {
        $resultado = obtenerRolJugador($id_sala, $id_jugador);
        echo json_encode($resultado);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Datos incompletos'
        ]);
    }
}
?> 