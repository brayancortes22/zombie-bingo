<?php
session_start();
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require '../setting/conexion-base-datos.php';

header('Content-Type: application/json');

try {
    if (!isset($_SESSION['id_usuario'])) {
        throw new Exception('Usuario no autenticado.');
    }

    $id_sala = $_POST['idSala'] ?? 0;
    $contraseña = $_POST['contraseñaSala'] ?? '';
    $id_registro = $_SESSION['id_usuario'];
    $nombre_usuario = $_SESSION['nombre_usuario'];

    // Verificar si existe el jugador
    $query = "SELECT id_jugador FROM jugador WHERE id_registro = ?";
    $stmt = $conexion->prepare($query);
    $stmt->bind_param("i", $id_registro);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 0) {
        // Si no existe el jugador, lo creamos
        $insert_query = "INSERT INTO jugador (id_registro, nombre) VALUES (?, ?)";
        $stmt_insert = $conexion->prepare($insert_query);
        $stmt_insert->bind_param("is", $id_registro, $nombre_usuario);
        $stmt_insert->execute();
        $id_jugador = $conexion->insert_id;
    } else {
        $row = $result->fetch_assoc();
        $id_jugador = $row['id_jugador'];
    }

    // Verificar la sala y la contraseña
    $query = "SELECT * FROM salas WHERE id_sala = ?";
    $stmt = $conexion->prepare($query);
    $stmt->bind_param("i", $id_sala);
    $stmt->execute();
    $result = $stmt->get_result();
    $sala = $result->fetch_assoc();


    // Verificar si la sala está llena
    if ($sala['jugadores_unidos'] >= $sala['max_jugadores']) {
        throw new Exception('La sala está llena.');
    }

    if (!$sala) {
        throw new Exception('La sala no existe.');
    }

    if (!password_verify($contraseña, $sala['contraseña'])) {
        throw new Exception('Contraseña incorrecta.');
    }

    // Verificar si el jugador ya está en la sala
    $query = "SELECT * FROM jugadores_en_sala WHERE id_sala = ? AND id_jugador = ?";
    $stmt = $conexion->prepare($query);
    $stmt->bind_param("ii", $id_sala, $id_jugador);
    $stmt->execute();
    if ($stmt->get_result()->num_rows > 0) {
        throw new Exception('Ya estás en esta sala.' );
        // lo redirige a jugadores sala
        // por el windos location en php
        
    }

    // Unir al jugador a la sala
    $query = "INSERT INTO jugadores_en_sala (id_sala, id_jugador, nombre_jugador) VALUES (?, ?, ?)";
    $stmt = $conexion->prepare($query);
    $stmt->bind_param("iis", $id_sala, $id_jugador, $nombre_usuario);
    $stmt->execute();

    // Actualizar el contador de jugadores en la sala
    $query = "UPDATE salas SET jugadores_unidos = jugadores_unidos + 1 WHERE id_sala = ?";
    $stmt = $conexion->prepare($query);
    $stmt->bind_param("i", $id_sala);
    $stmt->execute();

    echo json_encode([
        'success' => true,
        'message' => 'Te has unido a la sala con éxito.',
        'id_sala' => $id_sala,
        'contraseña_sala' => $contraseña,
        'jugadores_conectados' => $sala['jugadores_unidos'] + 1,
        'max_jugadores' => $sala['max_jugadores']
    ]);
} catch (Exception $e) {
    error_log("Intentando unir jugador: id_registro = $id_registro, id_jugador = $id_jugador, id_sala = $id_sala");
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

$conexion->close();
