<?php
session_start();
require '../setting/conexion-base-datos.php';

header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$id_sala = $input['id_sala'] ?? null;

if (!$id_sala) {
    echo json_encode(['success' => false, 'message' => 'ID de sala no proporcionado']);
    exit;
}

try {
    // Verificar si el usuario actual es el creador de la sala
    $query_check = "SELECT id_creador FROM salas WHERE id_sala = ?";
    $stmt_check = $conexion->prepare($query_check);
    $stmt_check->bind_param("i", $id_sala);
    $stmt_check->execute();
    $result = $stmt_check->get_result();
    $sala = $result->fetch_assoc();

    // Logging para depuración
    error_log("ID de sala: " . $id_sala);
    error_log("ID del creador en la base de datos: " . ($sala ? $sala['id_creador'] : 'No encontrado'));
    error_log("ID del usuario actual: " . $_SESSION['id_usuario']);

    if (!$sala) {
        echo json_encode(['success' => false, 'message' => 'Sala no encontrada']);
        exit;
    }

    if ($sala['id_creador'] != $_SESSION['id_usuario']) {
        echo json_encode(['success' => false, 'message' => 'No tienes permiso para cancelar esta sala. Creador: ' . $sala['id_creador'] . ', Tu ID: ' . $_SESSION['id_usuario']]);
        exit;
    }

    // Iniciar transacción
    $conexion->begin_transaction();

    // Eliminar jugadores de la sala
    $query_delete_players = "DELETE FROM jugadores_en_sala WHERE id_sala = ?";
    $stmt_delete_players = $conexion->prepare($query_delete_players);
    $stmt_delete_players->bind_param("i", $id_sala);
    $stmt_delete_players->execute();

    // Eliminar la sala
    $query_delete_sala = "DELETE FROM salas WHERE id_sala = ?";
    $stmt_delete_sala = $conexion->prepare($query_delete_sala);
    $stmt_delete_sala->bind_param("i", $id_sala);
    $stmt_delete_sala->execute();

    // Confirmar transacción
    $conexion->commit();

    echo json_encode(['success' => true, 'message' => 'Sala cancelada exitosamente']);
} catch (Exception $e) {
    $conexion->rollback();
    echo json_encode(['success' => false, 'message' => 'Error al cancelar la sala: ' . $e->getMessage()]);
}

$conexion->close();
