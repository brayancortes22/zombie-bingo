<?php
// invitado.php
include ('../setting/conexion-base-datos.php');

// Obtener el apodo del formulario
$apodo = $_POST['apodo'];

// Validar y sanear los datos de entrada
$apodo = trim($apodo);
$apodo = filter_var($apodo, FILTER_SANITIZE_STRING);

// Verificar si el apodo ya existe en la base de datos
$sql_check = "SELECT * FROM invitados WHERE apodo = '$apodo'";
$result_check = $conn->query($sql_check);

if ($result_check->num_rows > 0) {
    echo '
    <script>
    alert("apodo en uso prueba con otro");
    window.location = "../html/ingresarInvitado.html";
    </script>
    ';
    exit;
}

// Insertar el apodo en una base de datos o realizar cualquier otra acción deseada
// Por ejemplo, utilizando MySQLi:
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

$sql = "INSERT INTO invitados (apodo) VALUES ('$apodo')";
if ($conn->query($sql) === TRUE) {
    echo '
    <script>
    alert("inicio de sesion exitoso");
    window.location = "../html/inicio.html";
    </script>
    ';
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>