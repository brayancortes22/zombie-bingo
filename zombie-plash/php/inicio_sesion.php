<?php
// Desactivar la salida de errores PHP
error_reporting(0);
ini_set('display_errors', 0);

// Asegurarse de que no haya salida antes de este punto
ob_start();

header('Content-Type: application/json');
session_start();
require '../setting/conexion-base-datos.php';

$response = ['success' => false, 'errors' => []];

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método no permitido');
    }

    $nombre = $_POST['nombre'] ?? '';
    $contrasena = $_POST['contrasena'] ?? '';

    if (empty($nombre) || empty($contrasena)) {
        throw new Exception('Nombre de usuario y contraseña son requeridos');
    }

    $sql = "SELECT id_registro, nombre, contraseña FROM registro_usuarios WHERE nombre = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->execute([$nombre]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$usuario || !password_verify($contrasena, $usuario['contraseña'])) {
        throw new Exception('Nombre de usuario o contraseña incorrectos');
    }

    $_SESSION['id_usuario'] = $usuario['id_registro'];
    $_SESSION['nombre_usuario'] = $usuario['nombre'];

    $response['success'] = true;
    $response['message'] = 'Inicio de sesión exitoso';
} catch (Exception $e) {
    $response['errors']['general'] = $e->getMessage();
} finally {
    if (isset($conexion)) {
        $conexion->close();
    }
}

// Limpiar cualquier salida anterior
ob_end_clean();

echo json_encode($response);
exit;
