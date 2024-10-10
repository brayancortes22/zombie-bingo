<?php
session_start();
include('../setting/conexion-base-datos.php');

if (isset($_POST['codigo'])) {
    $codigo = $_POST['codigo'];
    $email = $_SESSION['reset_email'] ?? '';
    
    $stmt = $conn->prepare("SELECT cv.id FROM codigos_verificacion cv JOIN registro_usuarios ru ON cv.usuario_id = ru.id WHERE cv.codigo = ? AND ru.correo = ? AND cv.expira_en > NOW() AND cv.usado = 0");
    $stmt->bind_param("ss", $codigo, $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $_SESSION['codigo_verificado'] = true;
        echo json_encode(["success" => true, "message" => "Código verificado correctamente."]);
    } else {
        echo json_encode(["success" => false, "message" => "El código de verificación es inválido o ha expirado."]);
    }
}
?>