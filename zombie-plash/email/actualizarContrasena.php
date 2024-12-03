<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

require_once '../setting/conexion-base-datos.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['nuevaContrasena']) || !isset($data['confirmarContrasena'])) {
        throw new Exception('Datos incompletos');
    }

    $nuevaContrasena = $data['nuevaContrasena'];
    $confirmarContrasena = $data['confirmarContrasena'];

    // Validaciones
    if (strlen($nuevaContrasena) < 6) {
        throw new Exception('La contraseña debe tener al menos 6 caracteres');
    }

    if ($nuevaContrasena !== $confirmarContrasena) {
        throw new Exception('Las contraseñas no coinciden');
    }

    // Obtener el ID del usuario de la sesión
    if (!isset($_SESSION['id_usuario'])) {
        throw new Exception('Usuario no autenticado');
    }

    $id_usuario = $_SESSION['id_usuario'];
    $hashContrasena = password_hash($nuevaContrasena, PASSWORD_DEFAULT);

    $conexion = new Conexion();
    $pdo = $conexion->conectar();

    $query = "UPDATE registro_usuarios SET contraseña = :contrasena WHERE id_registro = :id";
    $stmt = $pdo->prepare($query);
    $success = $stmt->execute([
        'contrasena' => $hashContrasena,
        'id' => $id_usuario
    ]);

    if ($success) {
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