<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
require '../setting/conexion-base-datos.php'; // Asegúrate de tener este archivo con la conexión

header('Content-Type: application/json');

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método no permitido');
    }

    if (!isset($_SESSION['id_usuario'])) {
        throw new Exception('Usuario no autenticado.');
    }

    $contrasena = $_POST['contraseñaSala'] ?? '';
    $num_jugadores = $_POST['maxJugadores'] ?? 0;
    $id_registro = $_SESSION['id_usuario'];
    $nombre_usuario = $_SESSION['nombre_usuario'];

    if (empty($contrasena) || empty($num_jugadores)) {
        throw new Exception('Datos incompletos');
    }

    // Iniciar transacción
    $conexion->begin_transaction();

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

    $contrasena_hash = password_hash($contrasena, PASSWORD_DEFAULT);

    // Crear la sala
    $query = "INSERT INTO salas (id_creador, contraseña, max_jugadores, jugadores_unidos) VALUES (?, ?, ?, 1)";
    $stmt = $conexion->prepare($query);
    $stmt->bind_param("isi", $id_jugador, $contrasena_hash, $num_jugadores);

    if (!$stmt->execute()) {
        throw new Exception('Error al crear la sala: ' . $stmt->error);
    }

    $id_sala = $conexion->insert_id;

    // Insertar al creador en jugadores_en_sala
    $query_insertar_jugador = "INSERT INTO jugadores_en_sala (id_sala, id_jugador, nombre_jugador) VALUES (?, ?, ?)";
    $stmt_insertar = $conexion->prepare($query_insertar_jugador);
    $stmt_insertar->bind_param("iis", $id_sala, $id_jugador, $nombre_usuario);
    
    if (!$stmt_insertar->execute()) {
        throw new Exception('Error al insertar jugador en la sala: ' . $stmt_insertar->error);
    }

    // Confirmar transacción
    $conexion->commit();

    $respuesta = [
        'success' => true,
        'id_sala' => $id_sala,
        'nombre_jugador' => $nombre_usuario,
        'contraseña_sala' => $contrasena,
        'max_jugadores' => $num_jugadores,
        'jugadores_conectados' => 1
    ];

    echo json_encode($respuesta);
} catch (Exception $e) {
    $conexion->rollback();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

$conexion->close();
