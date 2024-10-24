<?php
// Conectar a la base de datos
require '../setting/conexion-base-datos.php'; // Asegúrate de tener este archivo con la conexión

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id_sala = $_POST['idSala'];
    $contrasena_ingresada = $_POST['contrasenaSala'];

    // Verificar que la sala existe y obtener la contraseña
    $sql = "SELECT contrasena, num_jugadores, max_jugadores FROM salas WHERE id_sala = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->execute([$id_sala]);
    $sala = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($sala) {
        // Verificar la contraseña
        if (password_verify($contrasena_ingresada, $sala['contrasena'])) {
            // Verificar si la sala tiene espacio
            if ($sala['num_jugadores'] < $sala['max_jugadores']) {
                // Incrementar el número de jugadores en la sala
                $sql_update = "UPDATE salas SET num_jugadores = num_jugadores + 1 WHERE id_sala = ?";
                $stmt_update = $conexion->prepare($sql_update);
                if ($stmt_update->execute([$id_sala])) {
                    echo json_encode(['success' => true]);
                } else {
                    echo json_encode(['success' => false, 'message' => 'Error al unirse a la sala']);
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'La sala está llena']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Contraseña incorrecta']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'La sala no existe']);
    }
}
?>
