<?php
include_once ('../setting/conexion-base-datos.php');

// Obtenga los datos del formulario de la solicitud
$name = $_POST['nombre'];
$email = $_POST['correo'];
$password = $_POST['contraseña'];
$confirm_password = $_POST['confirmar_contraseña'];

// Valide los datos del formulario (por ejemplo, verifique si las contraseñas coinciden)
if ($password != $confirm_password) {
    echo "Las contraseñas no coinciden";
    exit;
}

// Inserte los datos en la base de datos
$sql = "INSERT INTO registro_usuarios(nombre, correo, contraseña) VALUES ('$name', '$email', '$password')";
if ($conn->query($sql) === TRUE) {
    echo "Nuevo registro creado con éxito";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();