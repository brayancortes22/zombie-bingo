<?php
session_start();
require '../../setting/conexion-base-datos.php';

try {
    $conexion = new Conexion();
    $pdo = $conexion->conectar();

    $id_sala = $_GET['id_sala'] ?? null;

    if (!$id_sala) {
        throw new Exception('ID de sala no proporcionado');
    }

    // Verificar si la sala existe y obtener su estado
    $stmt = $pdo->prepare("SELECT estado FROM salas WHERE id_sala = ?");
    $stmt->execute([$id_sala]);
    $sala = $stmt->fetch();

    if (!$sala) {
        // Si la sala no existe, considerarla como cerrada
        echo json_encode([
            'success' => true,
            'estado' => 'cerrada'
        ]);
        exit;
    }

    echo json_encode([
        'success' => true,
        'estado' => $sala['estado']
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}