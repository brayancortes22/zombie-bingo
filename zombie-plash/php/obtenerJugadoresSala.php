<?php
session_start();
require '../setting/conexion-base-datos.php';

header('Content-Type: application/json');

$id_sala = $_GET['id_sala'] ?? 0;

$query = "SELECT id_jugador, nombre_jugador FROM jugadores_en_sala WHERE id_sala = ? ORDER BY id ASC";
$stmt = $conexion->prepare($query);
$stmt->bind_param("i", $id_sala);
$stmt->execute();
$result = $stmt->get_result();

$jugadores = [];
while ($row = $result->fetch_assoc()) {
    $jugadores[] = $row;
}

// Log para depuración
error_log("Jugadores en la sala " . $id_sala . ": " . json_encode($jugadores));

echo json_encode($jugadores);

$conexion->close();
