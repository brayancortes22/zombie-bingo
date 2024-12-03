<?php
require_once '../../setting/conexion-base-datos.php';

function obtenerActualizaciones($id_sala) {
    global $conexion;
    $pdo = $conexion->conectar();
    
    try {
        // Obtener números sacados y estado actual del juego
        $sql = "SELECT b.numero, b.letra 
                FROM balotas b 
                WHERE b.id_sala = ? AND b.estado = 1 
                ORDER BY b.id_balota";
                
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
        
        // Formatear números sacados
        $numerosSacados = array_map(function($balota) {
            return [
                'numero' => $balota['numero'],
                'letra' => $balota['letra']
            ];
        }, $balotas);
        
        return [
            'success' => true,
            'numerosSacados' => $numerosSacados,
            'estadoSala' => $sala['estado'],
            'jugando' => $sala['jugando']
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
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido'
    ]);
    exit;
}
?> 