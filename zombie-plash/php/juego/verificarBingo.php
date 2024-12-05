<?php
// Habilitar temporalmente la visualización de errores para depuración
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Definir constantes para las rutas
define('LOG_DIR', __DIR__ . '/../logs');
define('CONEXION_FILE', __DIR__ . '/../../setting/conexion-base-datos.php');

// Asegurarse de que el directorio de logs existe
if (!file_exists(LOG_DIR)) {
    mkdir(LOG_DIR, 0777, true);
}

// Configurar logging detallado
ini_set('log_errors', 1);
ini_set('error_log', LOG_DIR . '/php-errors.log');

// Función para logging personalizado
function logError($message, $context = []) {
    global $logDir;
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
    logError("Iniciando verificación de bingo");
    
    // Verificar que el archivo de conexión existe
    if (!file_exists(CONEXION_FILE)) {
        throw new Exception("Archivo de conexión no encontrado en: " . CONEXION_FILE);
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
    if (!isset($datos['id_sala']) || !isset($datos['id_jugador']) || !isset($datos['numeros_marcados'])) {
        throw new Exception('Faltan datos requeridos');
    }

    $idSala = $datos['id_sala'];
    $idJugador = $datos['id_jugador'];
    $numerosMarcados = $datos['numeros_marcados'];

    // Validar que los datos no estén vacíos
    if (empty($idSala) || empty($idJugador) || empty($numerosMarcados)) {
        throw new Exception('Los datos no pueden estar vacíos');
    }

    logError("Datos procesados", [
        'idSala' => $idSala,
        'idJugador' => $idJugador,
        'numerosMarcados' => $numerosMarcados
    ]);

    // Crear conexión
    $conexionObj = new Conexion();
    $conexion = $conexionObj->conectar();

    // Verificar números sacados
    $sql = "SELECT numero FROM balotas WHERE id_sala = ? AND estado = 1";
    $stmt = $conexion->prepare($sql);
    $stmt->execute([$idSala]);
    $numerosSacados = $stmt->fetchAll(PDO::FETCH_COLUMN);

    if (empty($numerosSacados)) {
        throw new Exception('No hay números sacados en esta sala');
    }

    logError("Números sacados obtenidos", ['numerosSacados' => $numerosSacados]);

    // Verificar números marcados
    foreach ($numerosMarcados as $numero) {
        if (!in_array($numero, $numerosSacados)) {
            throw new Exception("El número $numero no ha sido sacado todavía");
        }
    }

    // Actualizar estado de la sala
    $sql = "UPDATE salas SET estado = 'finalizado' WHERE id_sala = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->execute([$idSala]);

    // Obtener ranking
    $sql = "SELECT 
                j.nombre_jugador,
                COUNT(b.id_balota) as aciertos
            FROM jugadores_en_sala j
            LEFT JOIN balotas b ON b.id_sala = j.id_sala AND b.estado = 1
            WHERE j.id_sala = ?
            GROUP BY j.id_jugador, j.nombre_jugador
            ORDER BY aciertos DESC";
    $stmt = $conexion->prepare($sql);
    $stmt->execute([$idSala]);
    $ranking = $stmt->fetchAll(PDO::FETCH_ASSOC);

    logError("Ranking obtenido", ['ranking' => $ranking]);

    // Enviar respuesta exitosa
    sendJsonResponse([
        'success' => true,
        'mensaje' => '¡Bingo válido!',
        'ranking' => $ranking
    ]);

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