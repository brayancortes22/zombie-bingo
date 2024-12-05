<?php
require_once '../../setting/conexion-base-datos.php';
header('Content-Type: application/json');

function guardarRankingJugadores($id_sala, $id_ganador, $pdo) {
    try {
        // Obtener todos los jugadores de la sala
        $stmt = $pdo->prepare("
            SELECT id_jugador 
            FROM jugadores_en_sala 
            WHERE id_sala = ?
        ");
        $stmt->execute([$id_sala]);
        $jugadores = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($jugadores as $jugador) {
            // Obtener números acertados del jugador
            $stmt = $pdo->prepare("
                SELECT COUNT(*) as aciertos, 
                       GROUP_CONCAT(CONCAT(letra, numero) ORDER BY letra, numero) as carton
                FROM casillas_marcadas 
                WHERE id_sala = ? AND id_jugador = ?
            ");
            $stmt->execute([$id_sala, $jugador['id_jugador']]);
            $resultado = $stmt->fetch(PDO::FETCH_ASSOC);

            // Determinar posición (ganador es posición 1, resto ordenados por aciertos)
            $posicion = ($jugador['id_jugador'] == $id_ganador) ? 1 : 2;

            // Guardar en ranking
            $stmt = $pdo->prepare("
                INSERT INTO ranking_partida 
                (id_sala, id_jugador, posicion, numeros_acertados, carton_final)
                VALUES (?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $id_sala,
                $jugador['id_jugador'],
                $posicion,
                $resultado['aciertos'],
                json_encode(['carton' => $resultado['carton']])
            ]);
        }
        return true;
    } catch (Exception $e) {
        error_log("Error al guardar ranking: " . $e->getMessage());
        return false;
    }
}

function verificarBingo($id_sala, $id_jugador, $numeros_marcados) {
    global $conexion;
    $pdo = $conexion->conectar();
    
    try {
        // Verificar que tenga exactamente 25 números marcados
        if (count($numeros_marcados) !== 25) {
            return [
                'success' => false,
                'error' => 'Debes marcar exactamente 25 números para el bingo'
            ];
        }

        // Verificar que todos los números marcados hayan salido
        $stmt = $pdo->prepare("
            SELECT numero, letra 
            FROM balotas 
            WHERE id_sala = ? AND estado = 1
        ");
        $stmt->execute([$id_sala]);
        $balotas_sacadas = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($numeros_marcados as $marcado) {
            $encontrado = false;
            foreach ($balotas_sacadas as $balota) {
                if ($balota['numero'] == $marcado['numero'] && 
                    $balota['letra'] == $marcado['letra']) {
                    $encontrado = true;
                    break;
                }
            }
            if (!$encontrado) {
                return [
                    'success' => false,
                    'error' => 'Has marcado números que aún no han salido'
                ];
            }
        }

        // Iniciar transacción
        $pdo->beginTransaction();

        try {
            // Actualizar estado de la sala
            $stmt = $pdo->prepare("
                UPDATE salas 
                SET estado = 'finalizado', 
                    ganador_id = ? 
                WHERE id_sala = ?
            ");
            $stmt->execute([$id_jugador, $id_sala]);

            // Guardar el ranking de la partida
            if (!guardarRankingJugadores($id_sala, $id_jugador, $pdo)) {
                throw new Exception("Error al guardar el ranking");
            }

            // Obtener información del ganador y ranking
            $stmt = $pdo->prepare("
                SELECT j.nombre_jugador as ganador,
                       rp.numeros_acertados,
                       rp.posicion
                FROM jugador j
                JOIN ranking_partida rp ON j.id_jugador = rp.id_jugador
                WHERE rp.id_sala = ?
                ORDER BY rp.posicion ASC
            ");
            $stmt->execute([$id_sala]);
            $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $pdo->commit();

            return [
                'success' => true,
                'ganador' => $resultados[0]['ganador'],
                'ranking' => $resultados,
                'mensaje' => '¡BINGO válido!'
            ];

        } catch (Exception $e) {
            $pdo->rollBack();
            throw $e;
        }

    } catch (Exception $e) {
        error_log("Error al verificar bingo: " . $e->getMessage());
        return [
            'success' => false,
            'error' => 'Error al verificar bingo: ' . $e->getMessage()
        ];
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['id_sala']) || !isset($data['id_jugador']) || !isset($data['numeros_marcados'])) {
        echo json_encode([
            'success' => false,
            'error' => 'Datos incompletos'
        ]);
        exit;
    }
    
    echo json_encode(verificarBingo(
        (int)$data['id_sala'],
        (int)$data['id_jugador'],
        $data['numeros_marcados']
    ));
}
?> 