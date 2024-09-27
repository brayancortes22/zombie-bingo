<?php
include_once ('../setting/conexion-base-datos.php');

if (isset($_POST['nombre']) && isset($_POST['contraseña'])) {
    $usuario = $_POST['nombre'];
    $contraseña = $_POST['contraseña'];

    // Prepare SQL query with parameterized queries
    $stmt = $conn->prepare("SELECT * FROM registro_usuarios WHERE (usuario=? OR correo=?) AND contraseña=?");
    $stmt->bind_param("sss", $usuario, $usuario, $contraseña);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Login successful, return success message
        echo "exito";
    } else {
        // Login failed, return error message
        echo "Error: usuario o contraseña incorrectos.";
    }

    $conn->close();
} else {
    echo "Por favor, complete todos los campos del formulario.";
}
