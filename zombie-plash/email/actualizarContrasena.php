<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

require_once '../setting/conexion-base-datos.php';

try {
    // Verificar que el código haya sido verificado y tengamos el correo
    if (!isset($_SESSION['codigo_verificado']) || !$_SESSION['codigo_verificado'] || 
        !isset($_SESSION['email_recuperacion'])) {
        throw new Exception('No se ha verificado el código o la sesión ha expirado');
    }

    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['nuevaContrasena']) || !isset($data['confirmarContrasena'])) {
        throw new Exception('Datos incompletos');
    }

    $nuevaContrasena = $data['nuevaContrasena'];
    $confirmarContrasena = $data['confirmarContrasena'];
    $emailUsuario = $_SESSION['email_recuperacion'];

    // Validaciones
    if (strlen($nuevaContrasena) < 6) {
        throw new Exception('La contraseña debe tener al menos 6 caracteres');
    }

    if ($nuevaContrasena !== $confirmarContrasena) {
        throw new Exception('Las contraseñas no coinciden');
    }

    $hashContrasena = password_hash($nuevaContrasena, PASSWORD_DEFAULT);

    $conexion = new Conexion();
    $pdo = $conexion->conectar();

    // Actualizar la contraseña usando el correo electrónico
    $query = "UPDATE registro_usuarios SET contraseña = :contrasena WHERE correo = :email";
    $stmt = $pdo->prepare($query);
    $success = $stmt->execute([
        'contrasena' => $hashContrasena,
        'email' => $emailUsuario
    ]);

    if ($success) {
        // Limpiar las variables de sesión relacionadas con la recuperación
        unset($_SESSION['codigo_verificacion']);
        unset($_SESSION['email_recuperacion']);
        unset($_SESSION['codigo_verificado']);

        echo json_encode([
            'success' => true,
            'message' => 'Contraseña actualizada correctamente'
        ]);
    } else {
        throw new Exception('Error al actualizar la contraseña');
    }

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} 