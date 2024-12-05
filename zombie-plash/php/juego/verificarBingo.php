<?php
require_once '../../setting/conexion-base-datos.php';
header('Content-Type: application/json');

function verificarBingo($id_sala, $id_jugador, $numeros_marcados) {
    global $conexion;
    $pdo = $conexion->conectar();
    
    try {
        // Obtener números que han salido en la sala
        $stmt = $pdo->prepare("
            SELECT numero, letra 
            FROM balotas 
            WHERE id_sala = ? AND estado = 1
        ");
        $stmt->execute([$id_sala]);
        $balotas_sacadas = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Verificar que todos los números marcados hayan salido
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

        // Si llegamos aquí, el bingo es válido
        // Actualizar estado de la sala
        $stmt = $pdo->prepare("
            UPDATE salas 
            SET estado = 'finalizado', 
                ganador_id = ? 
            WHERE id_sala = ?
        ");
        $stmt->execute([$id_jugador, $id_sala]);

        // Obtener información del ganador
        $stmt = $pdo->prepare("
            SELECT nombre_jugador 
            FROM jugador 
            WHERE id_jugador = ?
        ");
        $stmt->execute([$id_jugador]);
        $ganador = $stmt->fetch(PDO::FETCH_ASSOC);

        return [
            'success' => true,
            'ganador' => $ganador['nombre_jugador'],
            'mensaje' => '¡BINGO válido!'
        ];

    } catch (PDOException $e) {
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