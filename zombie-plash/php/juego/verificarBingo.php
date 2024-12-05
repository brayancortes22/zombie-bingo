<?php
session_start();
require_once '../../setting/conexion-base-datos.php';

// Asegurarse de que no haya salida antes del JSON
error_reporting(0);
ini_set('display_errors', 0);
header('Content-Type: application/json');

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['id_sala']) || !isset($data['id_jugador']) || !isset($data['numeros_marcados'])) {
        throw new Exception('Datos incompletos');
    }

    $idSala = $data['id_sala'];
    $idJugador = $data['id_jugador'];
    $numerosMarcados = $data['numeros_marcados'];

    $conexion = new Conexion();
    $pdo = $conexion->conectar();

    // Iniciar transacción
    $pdo->beginTransaction();

    // 1. Verificar que todos los números marcados hayan salido
    $stmt = $pdo->prepare("
        SELECT COUNT(*) as total 
        FROM balotas 
        WHERE id_sala = ? 
        AND estado = 1 
        AND numero = ? 
        AND letra = ?
    ");

    $todosValidos = true;
    foreach ($numerosMarcados as $numero) {
        $stmt->execute([$idSala, $numero['numero'], $numero['letra']]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($result['total'] == 0) {
            $todosValidos = false;
            break;
        }
    }

    if (!$todosValidos) {
        throw new Exception('Algunos números marcados no han salido');
    }

    // 2. Registrar la victoria
    $stmt = $pdo->prepare("
        INSERT INTO partida (id_sala, id_ganador, fecha_partida) 
        VALUES (?, ?, CURRENT_TIMESTAMP)
    ");
    $stmt->execute([$idSala, $idJugador]);

    // 3. Obtener el ranking final
    $stmt = $pdo->prepare("
        SELECT 
            j.nombre_jugador as ganador,
            COUNT(ns.id) as numeros_acertados,
            ROW_NUMBER() OVER (ORDER BY COUNT(ns.id) DESC) as posicion
        FROM jugadores_en_sala j
        LEFT JOIN numeros_seleccionados ns ON j.id_jugador = ns.id_jugador AND j.id_sala = ns.id_sala
        WHERE j.id_sala = ?
        GROUP BY j.id_jugador, j.nombre_jugador
        ORDER BY numeros_acertados DESC
    ");
    $stmt->execute([$idSala]);
    $ranking = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 4. Actualizar estado de la sala
    $stmt = $pdo->prepare("
        UPDATE salas 
        SET estado = 'finalizado', 
            jugando = -1
        WHERE id_sala = ?
    ");
    $stmt->execute([$idSala]);

    // Confirmar transacción
    $pdo->commit();

    // Obtener nombre del ganador
    $stmt = $pdo->prepare("
        SELECT nombre_jugador 
        FROM jugadores_en_sala 
        WHERE id_sala = ? AND id_jugador = ?
    ");
    $stmt->execute([$idSala, $idJugador]);
    $ganador = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'ganador' => $ganador['nombre_jugador'],
        'ranking' => $ranking
    ]);

} catch (Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?> 