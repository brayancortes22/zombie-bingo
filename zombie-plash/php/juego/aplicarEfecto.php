<?php
require_once '../../setting/conexion-base-datos.php';
$pdo = $conexion->conectar();

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

try {
    if (!isset($data['id_sala']) || !isset($data['jugador_origen']) || !isset($data['tipo_efecto'])) {
        throw new Exception("Datos de entrada incompletos");
    }

    $idSala = (int)$data['id_sala'];
    $jugadorOrigen = (int)$data['jugador_origen'];
    $tipoEfecto = $data['tipo_efecto'];
    $duracion = 10000; // 10 segundos por defecto

    // Obtener todos los jugadores en la sala excepto el origen
    $stmt = $pdo->prepare("
        SELECT DISTINCT jes.id_jugador 
        FROM jugadores_en_sala jes
        WHERE jes.id_sala = :id_sala 
        AND jes.id_jugador != :jugador_origen
    ");
    
    $stmt->bindParam(':id_sala', $idSala, PDO::PARAM_INT);
    $stmt->bindParam(':jugador_origen', $jugadorOrigen, PDO::PARAM_INT);
    $stmt->execute();
    
    $jugadores = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $afectados = 0;

    foreach ($jugadores as $jugador) {
        // Insertar efecto para cada jugador
        $stmt2 = $pdo->prepare("
            INSERT INTO efectos_aplicados 
            (id_sala, tipo_efecto, jugador_origen, jugador_destino, duracion) 
            VALUES (:id_sala, :tipo_efecto, :jugador_origen, :jugador_destino, :duracion)
        ");
        
        $stmt2->bindParam(':id_sala', $idSala, PDO::PARAM_INT);
        $stmt2->bindParam(':tipo_efecto', $tipoEfecto, PDO::PARAM_STR);
        $stmt2->bindParam(':jugador_origen', $jugadorOrigen, PDO::PARAM_INT);
        $stmt2->bindParam(':jugador_destino', $jugador['id_jugador'], PDO::PARAM_INT);
        $stmt2->bindParam(':duracion', $duracion, PDO::PARAM_INT);
        
        if ($stmt2->execute()) {
            $afectados++;
        }
    }

    echo json_encode([
        'success' => true,
        'mensaje' => "Efecto aplicado a $afectados jugadores",
        'jugadores_afectados' => $afectados
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false, 
        'error' => $e->getMessage(),
        'detalles' => [
            'id_sala' => $idSala ?? null,
            'jugador_origen' => $jugadorOrigen ?? null,
            'tipo_efecto' => $tipoEfecto ?? null
        ]
    ]);
}
?> 