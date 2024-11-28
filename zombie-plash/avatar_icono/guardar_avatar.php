<?php
session_start();
header('Content-Type: application/json');

try {
    // Más logs para debugging
    error_log("Iniciando proceso de subida de avatar");
    error_log("Sesión actual: " . print_r($_SESSION, true));
    error_log("FILES recibidos: " . print_r($_FILES, true));

    // Conexión a la base de datos
    $db = new PDO("mysql:host=localhost;dbname=zombie_plash_bd", "root", "");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if (!isset($_SESSION['id_usuario'])) {
        throw new Exception('No hay sesión de usuario activa');
    }

    // Verificar si se recibió el archivo
    if (!isset($_FILES['avatar']) || $_FILES['avatar']['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('No se ha recibido el archivo correctamente. Error: ' . $_FILES['avatar']['error']);
    }

    $file = $_FILES['avatar'];
    
    // Debug para verificar el archivo
    error_log("Archivo recibido: " . print_r($file, true));
    
    // Verificar tipo de archivo
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!in_array($file['type'], $allowedTypes)) {
        throw new Exception('Tipo de archivo no permitido. Solo se permiten JPG, PNG y GIF');
    }

    // Crear directorio si no existe
    $uploadDir = __DIR__ . '/../uploads/avatars/';
    if (!file_exists($uploadDir)) {
        if (!mkdir($uploadDir, 0777, true)) {
            throw new Exception('No se pudo crear el directorio de uploads');
        }
    }

    // Generar nombre único para el archivo
    $fileName = uniqid() . '_' . basename($file['name']);
    $targetPath = $uploadDir . $fileName;

    // Debug para verificar rutas
    error_log("Ruta de destino: " . $targetPath);

    // Mover el archivo
    if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
        throw new Exception('Error al mover el archivo. Permisos: ' . substr(sprintf('%o', fileperms($uploadDir)), -4));
    }

    // Actualizar la base de datos
    $stmt = $db->prepare("UPDATE registro_usuarios SET avatar = ? WHERE id_registro = ?");
    $result = $stmt->execute([$fileName, $_SESSION['id_usuario']]);
    
    error_log("Resultado de la actualización: " . ($result ? "éxito" : "fallo"));
    error_log("Filas afectadas: " . $stmt->rowCount());
    
    // Verificar si la actualización fue exitosa
    if ($stmt->rowCount() === 0) {
        // Intentar insertar si la actualización no afectó ninguna fila
        $stmt = $db->prepare("INSERT INTO registro_usuarios (id_registro, avatar) VALUES (?, ?) ON DUPLICATE KEY UPDATE avatar = VALUES(avatar)");
        $stmt->execute([$_SESSION['id_usuario'], $fileName]);
        error_log("Intento de inserción realizado. Filas afectadas: " . $stmt->rowCount());
    }

    echo json_encode([
        'success' => true,
        'message' => 'Avatar actualizado correctamente',
        'avatarPath' => '/zombie-plash/uploads/avatars/' . $fileName,
        'userId' => $_SESSION['id_usuario']
    ]);

} catch (Exception $e) {
    error_log("Error en guardar_avatar.php: " . $e->getMessage());
    error_log("Traza del error: " . $e->getTraceAsString());
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>