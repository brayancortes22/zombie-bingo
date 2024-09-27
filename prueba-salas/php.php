<?php

// Conexión a la base de datos
$conexion = new mysqli("localhost", "root", "", "Zombie_plash");

// Validar la conexión
if ($conexion->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Error de conexión: ' . $conexion->connect_error]));
}

// Verificar si el método de la solicitud es POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $creador = $_POST['creador'];  // Obtener el nombre del creador desde el formulario

    if (!empty($creador)) {
        // Generar un código único para la sala (6 caracteres)
        $codigo = substr(md5(uniqid(mt_rand(), true)), 0, 6);

        // Insertar la nueva sala en la base de datos
        $sql = $conexion->prepare("INSERT INTO salas (codigo, creador) VALUES (?, ?)");
        $sql->bind_param("ss", $codigo, $creador);

        if ($sql->execute()) {
            // Si la sala se creó correctamente, enviar el código generado en formato JSON
            echo json_encode(['success' => true, 'codigo' => $codigo]);
        } else {
            // Enviar mensaje de error si la inserción falla
            echo json_encode(['success' => false, 'message' => 'Error al crear la sala: ' . $sql->error]);
        }

        $sql->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'El nombre del creador no puede estar vacío.']);
    }
}

$conexion->close();  // Cerrar la conexión a la base de datos
