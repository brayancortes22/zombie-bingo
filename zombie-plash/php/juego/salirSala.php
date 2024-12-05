<?php
// Deshabilitar la salida de errores al navegador
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Definir constantes para las rutas
define('LOG_DIR', __DIR__ . '/../logs');
define('CONEXION_FILE', __DIR__ . '/../../setting/conexion-base-datos.php');

// Asegurarse de que el directorio de logs existe
if (!file_exists(LOG_DIR)) {
    mkdir(LOG_DIR, 0777, true);
}

// Configurar logging
ini_set('log_errors', 1);
ini_set('error_log', LOG_DIR . '/php-errors.log');

// Función para logging personalizado
function logError($message, $context = []) {
    $logMessage = date('Y-m-d H:i:s') . " - " . $message . " - Context: " . json_encode($context) . "\n";
    error_log($logMessage, 3, LOG_DIR . '/php-errors.log');
}

// Función para enviar respuesta JSON
function sendJsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

try {
    // Verificar que el archivo de conexión existe
    if (!file_exists(CONEXION_FILE)) {
        throw new Exception("Archivo de conexión no encontrado");
    }
    
    require_once CONEXION_FILE;
    
    // Obtener y validar el input JSON
    $jsonInput = file_get_contents('php://input');
    logError("JSON recibido", ['input' => $jsonInput]);
    
    if (empty($jsonInput)) {
        throw new Exception('No se recibieron datos JSON');
    }
    
    $datos = json_decode($jsonInput, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Error al decodificar JSON de entrada: ' . json_last_error_msg());
    }

    // Validar datos requeridos
    if (!isset($datos['id_sala'])) {
        throw new Exception('ID de sala no proporcionado');
    }

    $idSala = $datos['id_sala'];

    // Crear conexión
    $conexionObj = new Conexion();
    $conexion = $conexionObj->conectar();

    // Iniciar transacción
    $conexion->beginTransaction();

    try {
        // Primero, eliminar los registros de jugadores_en_sala
        $sql = "DELETE FROM jugadores_en_sala WHERE id_sala = ?";
        $stmt = $conexion->prepare($sql);
        $stmt->execute([$idSala]);

        // Luego, eliminar los efectos activos
        $sql = "DELETE FROM efectos_activos WHERE id_sala = ?";
        $stmt = $conexion->prepare($sql);
        $stmt->execute([$idSala]);

        // Eliminar las balotas
        $sql = "DELETE FROM balotas WHERE id_sala = ?";
        $stmt = $conexion->prepare($sql);
        $stmt->execute([$idSala]);

        // Finalmente, eliminar la sala
        $sql = "DELETE FROM salas WHERE id_sala = ?";
        $stmt = $conexion->prepare($sql);
        $stmt->execute([$idSala]);

        // Confirmar la transacción
        $conexion->commit();

        // Enviar respuesta exitosa
        sendJsonResponse([
            'success' => true,
            'mensaje' => 'Has salido de la sala correctamente'
        ]);

    } catch (Exception $e) {
        // Si hay algún error, revertir todos los cambios
        $conexion->rollBack();
        throw $e;
    }

} catch (PDOException $e) {
    logError("Error de base de datos", [
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ]);
    sendJsonResponse([
        'success' => false,
        'error' => 'Error de base de datos. Por favor, contacte al administrador.'
    ], 500);
} catch (Exception $e) {
    logError("Error general", [
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ]);
    sendJsonResponse([
        'success' => false,
        'error' => $e->getMessage()
    ], 400);
}
?> 