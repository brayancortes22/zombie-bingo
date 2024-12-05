<?php
require_once '../../setting/conexion-base-datos.php';
header('Content-Type: application/json');

function verificarPoder($id_sala, $id_jugador) {
    global $conexion;
    $pdo = $conexion->conectar();
    
    try {
        // Verificar último poder usado
        $stmt = $pdo->prepare("
            SELECT 
                ultimo_poder_usado,
                poder_bloqueado_hasta
            FROM jugadores_en_sala 
            WHERE id_sala = ? AND id_jugador = ?
        ");
        $stmt->execute([$id_sala, $id_jugador]);
        $jugador = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$jugador) {
            throw new Exception("Jugador no encontrado en la sala");
        }

        $ahora = new DateTime();
        
        // Verificar si el jugador está bloqueado por recibir un efecto
        if ($jugador['poder_bloqueado_hasta'] !== null) {
            $bloqueado_hasta = new DateTime($jugador['poder_bloqueado_hasta']);
            if ($ahora < $bloqueado_hasta) {
                return [
                    'puede_usar' => false,
                    'mensaje' => 'Bloqueado por efecto recibido'
                ];
            }
        }

        // Verificar cooldown de 2 minutos
        if ($jugador['ultimo_poder_usado'] !== null) {
            $ultimo_uso = new DateTime($jugador['ultimo_poder_usado']);
            $diferencia = $ahora->getTimestamp() - $ultimo_uso->getTimestamp();
            
            if ($diferencia < 120) { // 120 segundos = 2 minutos
                return [
                    'puede_usar' => false,
                    'mensaje' => 'Debes esperar 2 minutos entre poderes',
                    'tiempo_restante' => 120 - $diferencia
                ];
            }
        }

        return [
            'puede_usar' => true
        ];

    } catch (Exception $e) {
        return [
            'puede_usar' => false,
            'error' => $e->getMessage()
        ];
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['id_sala']) || !isset($data['id_jugador'])) {
        echo json_encode([
            'puede_usar' => false,
            'error' => 'Datos incompletos'
        ]);
        exit;
    }
    
    echo json_encode(verificarPoder(
        (int)$data['id_sala'],
        (int)$data['id_jugador']
    ));
}
?> 