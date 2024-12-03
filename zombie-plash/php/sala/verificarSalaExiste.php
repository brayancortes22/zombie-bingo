<?php
header('Content-Type: application/json');
require_once '../../setting/conexion-base-datos.php';

try {
    $id_sala = $_GET['id_sala'];
    
    $stmt = $conexion->conectar()->prepare("SELECT id_sala FROM salas WHERE id_sala = ?");
    $stmt->execute([$id_sala]);
    $result = $stmt->fetch();

    echo json_encode([
        'success' => true,
        'existe' => $result !== false
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?> 