<?php
session_start();

// Verificar si el usuario está logueado
if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(['success' => false, 'message' => 'Usuario no autenticado']);
    exit;
}

header('Content-Type: application/json');
try {
    $db = new PDO("mysql:host=localhost;dbname=zombie_plash_bd2", "root", "12345");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if (!isset($_FILES['avatar'])) {
        throw new Exception('No se ha seleccionado ningún archivo');
    }

    $id = $_SESSION['id_usuario']; // Usar ID de la sesión
    $file = $_FILES['avatar'];
   
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!in_array($file['type'], $allowedTypes)) {
        throw new Exception('Tipo de archivo no permitido');
    }

    $uploadDir = 'uploads/avatars/';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $fileName = uniqid() . '_' . basename($file['name']);
    $targetPath = $uploadDir . $fileName;

    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        $stmt = $db->prepare("UPDATE registro_usuarios SET avatar = ? WHERE id_registro = ?");
        $stmt->execute([$fileName, $id]);
        
        $_SESSION['avatar'] = $fileName; // Actualizar avatar en sesión
        echo json_encode([
            'success' => true, 
            'message' => 'Avatar actualizado correctamente',
            'avatarPath' => $uploadDir . $fileName
        ]);
    } else {
        throw new Exception('Error al subir el archivo');
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>