<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

try {
    // Verificar si se recibió el código
    if (!isset($_POST['codigo'])) {
        throw new Exception('No se recibió el código de verificación');
    }

    // Obtener el código ingresado por el usuario
    $codigoIngresado = $_POST['codigo'];

    // Obtener el código almacenado en la sesión
    if (!isset($_SESSION['codigo_verificacion'])) {
        throw new Exception('No hay código de verificación en la sesión');
    }

    $codigoGuardado = $_SESSION['codigo_verificacion'];

    // Comparar los códigos
    if ($codigoIngresado == $codigoGuardado) {
        // Guardar en sesión que el código fue verificado correctamente
        $_SESSION['codigo_verificado'] = true;
        
        echo json_encode([
            'success' => true,
            'message' => 'Código verificado correctamente'
        ]);
    } else {
        throw new Exception('Código incorrecto');
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>