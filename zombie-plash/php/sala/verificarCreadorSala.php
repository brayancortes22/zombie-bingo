<?php
session_start();
require '../../setting/conexion-base-datos.php';

$id_sala = $_GET['id_sala'] ?? null;
$id_jugador = $_SESSION['id_usuario'] ?? null;

if (!$id_sala || !$id_jugador) {
    echo json_encode(['success' => false, 'message' => 'Faltan parámetros']);
    exit();
}

try {
    $pdo = (new Conexion())->conectar();
    
    // Verificar si el jugador es el creador de la sala
    $query = "SELECT jes.rol 
             FROM jugadores_en_sala jes 
             WHERE jes.id_sala = :id_sala 
             AND jes.id_jugador = (
                 SELECT id_jugador 
                 FROM jugador 
                 WHERE id_registro = :id_jugador
             )";
             
    $stmt = $pdo->prepare($query);
    $stmt->execute([
        'id_sala' => $id_sala,
        'id_jugador' => $id_jugador
    ]);
    
    $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'esCreador' => ($resultado && $resultado['rol'] === 'creador')
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} 