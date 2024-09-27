<?php
include_once ('../setting/conexion-base-datos.php');

// Verificar si se enviaron todos los datos necesarios del formulario
if (isset($_POST['nombre']) && isset($_POST['correo']) && isset($_POST['contraseña']) && isset($_POST['confirmar_contraseña'])) {
    
    // Obtenga los datos del formulario de la solicitud
    $usuario = $_POST['nombre'];
    $correo = $_POST['correo'];
    $contraseña = $_POST['contraseña'];

    // Verificar si el usuario ya está registrado
    $checkQuery = "SELECT * FROM registro_usuarios WHERE usuario='$usuario' OR correo='$correo'";
    $result = $conn->query($checkQuery);

    if ($result->num_rows > 0) {
        // Si se encuentra una fila con el mismo usuario o correo, mostrar un mensaje de error
        echo "<script>alert('El usuario o correo ya estan registrados.')</script>";
    } else {
        // Si no está registrado, inserte los datos en la base de datos
        $sql = "INSERT INTO registro_usuarios(usuario, correo, contraseña) VALUES ('$usuario', '$correo', '$contraseña')";
        if ($conn->query($sql) === TRUE) {
            echo "<script>alert('Nuevo registro creado con éxito.');
            window.location.href = '../html/login.html';
            </script>";
        } else {
            echo "<script>alert('ups un error en el proceso')</script>" . $conn->error;
        }
    }

    // Cerrar la conexión
    $conn->close();

} else {
    echo "Por favor, complete todos los campos del formulario.";
}
?>
