<?php
session_start();
require '../setting/conexion-base-datos.php';

$id_sala = $_GET['id_sala'] ?? null;

if (!$id_sala) {
    echo json_encode(['success' => false, 'message' => 'ID de sala no proporcionado']);
    exit();
}

$pdo = (new Conexion())->conectar();
$query = "SELECT estado FROM salas WHERE id_sala = :id_sala";
$stmt = $pdo->prepare($query);
$stmt->execute(['id_sala' => $id_sala]);
$sala = $stmt->fetch();

if (!$sala) {
    echo json_encode(['success' => false, 'message' => 'Sala no encontrada']);
    exit();
}

echo json_encode(['success' => true, 'estado' => $sala['estado']]); 