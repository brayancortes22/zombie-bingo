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
        throw new Exception('Usuario no autenticado. Información de sesión: ' . json_encode($_SESSION));
    }

    $contrasena = $_POST['contraseñaSala'] ?? '';
    $num_jugadores = $_POST['maxJugadores'] ?? 0;
    $id_registro = $_SESSION['id_usuario'];

    // if (empty($contrasena) || empty($num_jugadores)) {
    //     throw new Exception('Datos incompletos');
    // }

    // Verificar si existe el jugador
    // $query = "SELECT id_jugador FROM jugador WHERE id_registro = '$id_registro'";
    // $result = mysqli_query($conexion, $query);

    // if (!$result) {
    //     throw new Exception('Error en la consulta: ' . mysqli_error($conexion));
    // }

    if (mysqli_num_rows($result) == 0) {
        // Si no existe el jugador, lo creamos
        $insert_query = "INSERT INTO jugador (id_registro, nombre) SELECT id_registro, nombre FROM registro_usuarios WHERE id_registro = '$id_registro'";
        if (!mysqli_query($conexion, $insert_query)) {
            throw new Exception('Error al crear el jugador: ' . mysqli_error($conexion));
        }
        $id_creador = mysqli_insert_id($conexion);
    } else {
        $row = mysqli_fetch_assoc($result);
        $id_creador = $row['id_jugador'];
    }

    $contrasena_hash = password_hash($contrasena, PASSWORD_DEFAULT);

    $query = "INSERT INTO salas (id_creador, contraseña, max_jugadores, jugadores_unidos) VALUES ('$id_creador', '$contrasena_hash', '$num_jugadores', 1)";
    
    if (!mysqli_query($conexion, $query)) {
        throw new Exception('Error al crear la sala: ' . mysqli_error($conexion));
    }

    $id_sala = mysqli_insert_id($conexion);
    $_SESSION['sala_actual'] = $id_sala;

    $respuesta = [
        'success' => true,
        'id_sala' => $id_sala,
        'nombre_jugador' => $datos_sala['nombre'],
        'correo_jugador' => $datos_sala['correo'],
        'contraseña_sala' => $contrasena, // Usamos la contraseña sin hash
        'max_jugadores' => $datos_sala['max_jugadores'],
        'jugadores_conectados' => 1 // Inicialmente solo el creador está conectado
    ];

    echo json_encode($respuesta);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

mysqli_close($conexion);

