<?php
include_once ('../setting/conexion-base-datos.php');

if (isset($_POST['nombre']) && isset($_POST['contraseña'])) {
    $usuario = $_POST['nombre'];
    $contraseña = $_POST['contraseña'];

    // Verificar si el usuario existe y si la contraseña es correcta
    $checkQuery = "SELECT * FROM registro_usuarios WHERE (usuario='$usuario' OR correo='$usuario') AND contraseña='$contraseña'";
    $result = $conn->query($checkQuery);

    header('Content-Type: application/json'); // Añadir este encabezado

    if ($result->num_rows > 0) {
        // El usuario existe y la contraseña es correcta
        echo json_encode(['existe' => true]);
    } else {
        // El usuario no existe o la contraseña es incorrecta
        echo json_encode(['existe' => false]);
    }

    $conn->close();
} else {
    echo json_encode(['error' => 'No se enviaron todos los datos.']);
}
?>
