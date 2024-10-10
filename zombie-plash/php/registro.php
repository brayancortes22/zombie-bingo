<?php
include_once ('../setting/conexion-base-datos.php');

header('Content-Type: application/json');

$response = ['success' => false, 'errors' => []];

if (isset($_POST['nombre']) && isset($_POST['correo']) && isset($_POST['contraseña']) && isset($_POST['confirmar_contraseña'])) {
    
    $usuario = $_POST['nombre'];
    $correo = $_POST['correo'];
    $contraseña = $_POST['contraseña'];
    $confirmar_contraseña = $_POST['confirmar_contraseña'];

    // Verificar que las contraseñas coincidan
    if ($contraseña !== $confirmar_contraseña) {
        $response['errors']['confirmar_contraseña'] = 'Las contraseñas no coinciden';
    } else {
        $checkQuery = "SELECT * FROM registro_usuarios WHERE usuario='$usuario' OR correo='$correo'";
        $result = $conn->query($checkQuery);

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            if ($row['usuario'] == $usuario) {
                $response['errors']['nombre'] = 'El nombre de usuario ya está registrado.';
            }
            if ($row['correo'] == $correo) {
                $response['errors']['correo'] = 'El correo ya está registrado.';
            }
        } else {
            // Aquí deberías usar password_hash() para la contraseña
            $hashed_password = password_hash($contraseña, PASSWORD_DEFAULT);
            $sql = "INSERT INTO registro_usuarios(usuario, correo, contraseña) VALUES ('$usuario', '$correo', '$hashed_password')";
            if ($conn->query($sql) === TRUE) {
                $response['success'] = true;
            } else {
                $response['errors']['general'] = 'Error al crear el registro: ' . $conn->error;
            }
        }
    }

    $conn->close();

} else {
    $response['errors']['general'] = 'Por favor, complete todos los campos del formulario.';
}

echo json_encode($response);
?>