<?php
// Desactivar la salida de errores PHP
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Asegurarse de que no haya salida antes de este punto
ob_start();

header('Content-Type: application/json; charset=utf-8');
session_start();
require '../setting/conexion-base-datos.php';

$response = ['success' => false, 'errors' => [], 'debug' => []];

try {
    $response['debug']['request_method'] = $_SERVER['REQUEST_METHOD'];
    $response['debug']['post_data'] = $_POST;

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método no permitido');
    }

    $nombre_o_correo = $_POST['nombre'] ?? '';
    $contrasena = $_POST['contraseña'] ?? ''; // Cambiado de 'contrasena' a 'contraseña'

    $response['debug']['nombre_o_correo'] = $nombre_o_correo;
    $response['debug']['contrasena_length'] = strlen($contrasena);

    if (empty($nombre_o_correo) || empty($contrasena)) {
        throw new Exception('Nombre de usuario/correo y contraseña son requeridos');
    }

    // Modificar la consulta SQL para buscar por nombre o correo
    $sql = "SELECT id_registro, nombre, correo, contraseña FROM registro_usuarios WHERE nombre = ? OR correo = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("ss", $nombre_o_correo, $nombre_o_correo);
    $stmt->execute();
    $result = $stmt->get_result();
    $usuario = $result->fetch_assoc();

    $response['debug']['usuario_encontrado'] = $usuario ? 'sí' : 'no';
    
    if (!$usuario) {
        throw new Exception('Usuario no encontrado');
    }

    $response['debug']['contraseña_almacenada'] = $usuario['contraseña'];
    $response['debug']['contraseña_proporcionada'] = $contrasena;
    $response['debug']['verificacion_contraseña'] = password_verify($contrasena, $usuario['contraseña']) ? 'exitosa' : 'fallida';

    if (!password_verify($contrasena, $usuario['contraseña'])) {
        throw new Exception('Contraseña incorrecta');
    }

    $_SESSION['id_usuario'] = $usuario['id_registro'];
    $_SESSION['nombre_usuario'] = $usuario['nombre'];

    $response['success'] = true;
    $response['message'] = 'Inicio de sesión exitoso';
    $response['session_info'] = [
        'id_usuario' => $_SESSION['id_usuario'],
        'nombre_usuario' => $_SESSION['nombre_usuario']
    ];

    // Asegurarse de que la sesión se guarde
    session_write_close();
} catch (Exception $e) {
    $response['errors']['general'] = $e->getMessage();
} finally {
    if (isset($stmt)) {
        $stmt->close();
    }
    if (isset($conexion)) {
        $conexion->close();
    }
}

// Limpiar cualquier salida anterior
ob_end_clean();

echo json_encode($response);
exit;
