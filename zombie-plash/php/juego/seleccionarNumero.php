<?php
require_once '../../setting/conexion-base-datos.php';
header('Content-Type: application/json');

function seleccionarNumero($id_sala, $id_jugador, $numero) {
    global $conexion;
    $pdo = $conexion->conectar();
    
    try {
        // Verificar que el número no haya salido ya
        $stmt = $pdo->prepare("
            SELECT id_balota 
            FROM balotas 
            WHERE id_sala = ? AND numero = ? AND estado = 1
        ");
        $stmt->execute([$id_sala, $numero]);
        if ($stmt->fetch()) {
            throw new Exception("Este número ya ha sido sacado");
        }

        // Obtener la balota correspondiente
        $stmt = $pdo->prepare("
            SELECT id_balota, letra 
            FROM balotas 
            WHERE id_sala = ? AND numero = ? AND estado = 0
        ");
        $stmt->execute([$id_sala, $numero]);
        $balota = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$balota) {
            throw new Exception("Número no disponible");
        }

        // Obtener el siguiente orden
        $stmt = $pdo->prepare("
            SELECT COALESCE(MAX(orden_salida), 0) + 1 as siguiente_orden
            FROM balotas 
            WHERE id_sala = ? AND estado = 1
        ");
        $stmt->execute([$id_sala]);
        $orden = $stmt->fetch(PDO::FETCH_ASSOC);

        // Marcar la balota como usada
        $stmt = $pdo->prepare("
            UPDATE balotas 
            SET estado = 1,
                orden_salida = ?
            WHERE id_balota = ?
        ");
        $stmt->execute([$orden['siguiente_orden'], $balota['id_balota']]);

        // Registrar que este número fue seleccionado por el jugador
        $stmt = $pdo->prepare("
            INSERT INTO numeros_seleccionados 
            (id_sala, id_jugador, numero, letra) 
            VALUES (?, ?, ?, ?)
        ");
        $stmt->execute([$id_sala, $id_jugador, $numero, $balota['letra']]);

        // Actualizar el estado de la sala para que todos los jugadores vean el nuevo número
        $stmt = $pdo->prepare("
            UPDATE salas 
            SET ultimo_numero_sacado = CURRENT_TIMESTAMP,
                numeros_sacados = JSON_ARRAY_APPEND(
                    COALESCE(numeros_sacados, '[]'),
                    '$',
                    JSON_OBJECT(
                        'numero', ?,
                        'letra', ?,
                        'orden', ?
                    )
                )
            WHERE id_sala = ?
        ");
        $stmt->execute([
            $numero,
            $balota['letra'],
            $orden['siguiente_orden'],
            $id_sala
        ]);

        return [
            'success' => true,
            'numero' => $numero,
            'letra' => $balota['letra'],
            'orden' => $orden['siguiente_orden'],
            'mensaje' => "Has seleccionado el número {$balota['letra']}-{$numero}"
        ];

    } catch (Exception $e) {
        return [
            'success' => false,
            'error' => $e->getMessage()
        ];
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['id_sala']) || !isset($data['id_jugador']) || !isset($data['numero'])) {
        echo json_encode([
            'success' => false,
            'error' => 'Datos incompletos'
        ]);
        exit;
    }
    
    echo json_encode(seleccionarNumero(
        (int)$data['id_sala'],
        (int)$data['id_jugador'],
        (int)$data['numero']
    ));
}
?> 