<?php
session_start();
require '../setting/conexion-base-datos.php';

header('Content-Type: application/json');

$id_sala = $_GET['id_sala'] ?? null;

if (!$id_sala) {
    echo json_encode(['error' => 'ID de sala no proporcionado']);
    exit;
}

$query = "SELECT id_jugador, nombre_jugador FROM jugadores_en_sala WHERE id_sala = ?";
$stmt = $conexion->prepare($query);
$stmt->bind_param("i", $id_sala);
$stmt->execute();
$result = $stmt->get_result();

$jugadores = [];
while ($row = $result->fetch_assoc()) {
    $jugadores[] = $row;
}

echo json_encode($jugadores);

$conexion->close();
