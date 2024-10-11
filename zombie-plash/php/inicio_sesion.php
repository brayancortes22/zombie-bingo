<?php
include_once ('../setting/conexion-base-datos.php');

header('Content-Type: application/json');

$response = ['success' => false, 'errors' => []];

if (isset($_POST['nombre']) && isset($_POST['contraseña'])) {
    
    $usuario = $_POST['nombre'];
    $contraseña = $_POST['contraseña'];

    // Buscar el usuario en la base de datos por nombre o correo
    $checkQuery = "SELECT * FROM registro_usuarios WHERE nombre = ? OR correo = ?";
    $stmt = $conn->prepare($checkQuery);
    $stmt->bind_param("ss", $usuario, $usuario);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        // Verificar la contraseña
        if (password_verify($contraseña, $row['contraseña'])) {
            // Contraseña correcta
            $response['success'] = true;
            $response['message'] = 'Inicio de sesión exitoso';
            // Aquí puedes iniciar una sesión si lo deseas
            // session_start();
            // $_SESSION['user_id'] = $row['id'];
            // $_SESSION['username'] = $row['nombre'];
        } else {
            // Contraseña incorrecta
            $response['errors']['general'] = 'Nombre de usuario o contraseña incorrectos';
        }
    } else {
        // Usuario no encontrado
        $response['errors']['general'] = 'Nombre de usuario o contraseña incorrectos';
    }

    $stmt->close();
    $conn->close();

} else {
    $response['errors']['general'] = 'Por favor, complete todos los campos del formulario.';
}

echo json_encode($response);