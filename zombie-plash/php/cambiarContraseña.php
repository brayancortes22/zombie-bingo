<?php
session_start();
include('../setting/conexion-base-datos.php');

if (isset($_POST['nueva_contrasena']) && isset($_SESSION['reset_email']) && isset($_SESSION['codigo_verificado'])) {
    $nueva_contrasena = password_hash($_POST['nueva_contrasena'], PASSWORD_DEFAULT);
    $email = $_SESSION['reset_email'];
    
    $stmt = $conn->prepare("UPDATE registro_usuarios SET contraseña = ? WHERE correo = ?");
    $stmt->bind_param("ss", $nueva_contrasena, $email);
    
    if ($stmt->execute()) {
        // Marcar el código como usado
        $stmt = $conn->prepare("UPDATE codigos_verificacion cv JOIN registro_usuarios ru ON cv.usuario_id = ru.id SET cv.usado = 1 WHERE ru.correo = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        
        // Limpiar las variables de sesión
        unset($_SESSION['reset_email']);
        unset($_SESSION['codigo_verificado']);
        
        echo json_encode(["success" => true, "message" => "Contraseña cambiada con éxito."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al cambiar la contraseña."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Acceso no autorizado o datos incompletos."]);
}
?>