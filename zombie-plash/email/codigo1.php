<?php
session_start();
header('Content-Type: application/json');

try {
    $codigo_ingresado = $_POST['codigo'] ?? '';
    
    if (empty($codigo_ingresado)) {
        throw new Exception('El código es requerido');
    }

    // Verificar si el código existe en la sesión
    if (!isset($_SESSION['codigo_verificacion'])) {
        throw new Exception('No hay código de verificación pendiente');
    }

    // Verificar si el código ha expirado (10 minutos)
    if (time() - $_SESSION['codigo_tiempo'] > 600) {
        unset($_SESSION['codigo_verificacion']);
        unset($_SESSION['email_verificacion']);
        unset($_SESSION['codigo_tiempo']);
        throw new Exception('El código ha expirado');
    }

    // Verificar si el código es correcto
    if ($codigo_ingresado !== $_SESSION['codigo_verificacion']) {
        throw new Exception('Código incorrecto');
    }

    // Si todo está bien, limpiar las variables de sesión
    $email_verificado = $_SESSION['email_verificacion'];
    unset($_SESSION['codigo_verificacion']);
    unset($_SESSION['email_verificacion']);
    unset($_SESSION['codigo_tiempo']);

    echo json_encode([
        'success' => true,
        'message' => 'Código verificado correctamente',
        'email' => $email_verificado
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}