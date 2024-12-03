<?php
require_once '../../setting/conexion-base-datos.php';
$pdo = $conexion->conectar();

// Asegurarnos de que no haya salida antes del JSON
ob_clean();
header('Content-Type: application/json');

try {
    // Obtener y validar los datos de entrada
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['id_sala']) || !isset($data['id_jugador'])) {
        throw new Exception("Datos de entrada incompletos");
    }

    $idSala = (int)$data['id_sala'];
    $idJugador = (int)$data['id_jugador'];

    // Obtener efectos activos para el jugador
    $stmt = $pdo->prepare("
        SELECT ea.*, 
               UNIX_TIMESTAMP(ea.fecha_aplicacion) as timestamp_aplicacion
        FROM efectos_aplicados ea
        WHERE ea.id_sala = :id_sala 
        AND ea.jugador_destino = :id_jugador 
        AND ea.fecha_aplicacion >= NOW() - INTERVAL (ea.duracion/1000) SECOND
    ");

    $stmt->bindParam(':id_sala', $idSala, PDO::PARAM_INT);
    $stmt->bindParam(':id_jugador', $idJugador, PDO::PARAM_INT);
    $stmt->execute();
    
    $efectos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $response = [
        'success' => true, 
        'efectos' => $efectos,
        'timestamp' => time(),
        'id_jugador' => $idJugador,
        'id_sala' => $idSala
    ];

    echo json_encode($response);

} catch (Exception $e) {
    echo json_encode([
        'success' => false, 
        'error' => $e->getMessage(),
        'detalles' => [
            'id_sala' => $idSala ?? null,
            'id_jugador' => $idJugador ?? null
        ]
    ]);
}
?> 