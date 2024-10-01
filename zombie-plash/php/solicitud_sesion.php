
<?php
include_once ('../setting/conexion-base-datos.php');

// Verificar si se enviaron todos los datos necesarios del formulario
if (isset($_POST['nombre_usu']) && isset($_POST['contraseña_usu']) ) {
    
    // Obtenga los datos del formulario de la solicitud
    $usuario = $_POST['nombre_usu'];
    $contraseña = $_POST['contraseña_usu'];

    // Verificar si el usuario ya está registrado
    $checkQuery =" SELECT * FROM `registro_usuarios` WHERE usuario =$usuario or correo = $usuario AND contraseña = $contraseña";
    $result = $conn->query($checkQuery);

    if ($result->num_rows > 0) {
        // Si se encuentra una fila con el mismo usuario o correo, mostrar un mensaje de error
        if ($conn->query($result) === TRUE) {
            echo "<script>alert('no te encontramos en la base de datos
            si eres nuevo porfavor registrate.');";
        } else {
            echo "<script>alert('ups un error en el proceso')</script>" . $conn->error;
        }
    } else {
        // Si no está registrado, inserte los datos en la base de datos
        echo "exito";
        
    }

    // Cerrar la conexión
    $conn->close();

} else {
    echo "Por favor, complete todos los campos del formulario.";
}
?>

