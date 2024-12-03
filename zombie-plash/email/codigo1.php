<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

try {
    // Verificar si hay una sesión activa con el correo y código
    if (!isset($_SESSION['codigo_verificacion']) || !isset($_SESSION['email_recuperacion'])) {
        throw new Exception('Sesión no válida o expirada');
    }

    // Verificar si se recibió el código
    if (!isset($_POST['codigo'])) {
        throw new Exception('No se recibió el código');
    }

    $codigoIngresado = $_POST['codigo'];
    $codigoGuardado = $_SESSION['codigo_verificacion'];

    // Validar que el código tenga el formato correcto
    if (!preg_match('/^\d{4}$/', $codigoIngresado)) {
        throw new Exception('El código debe tener 4 dígitos');
    }

    // Comparar los códigos
    if ($codigoIngresado == $codigoGuardado) {
        // Marcar el código como verificado
        $_SESSION['codigo_verificado'] = true;
        
        echo json_encode([
            'success' => true,
            'message' => 'Código verificado correctamente'
        ]);
    } else {
        throw new Exception('El código ingresado es incorrecto');
    }

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>