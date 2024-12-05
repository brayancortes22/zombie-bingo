<?php
require_once '../../setting/conexion-base-datos.php';
header('Content-Type: application/json');

function verificarBingo($id_sala, $id_jugador) {
    global $conexion;
    $pdo = $conexion->conectar();
    
    try {
        // Obtener casillas marcadas del jugador
        $stmt = $pdo->prepare("
            SELECT numero, letra
            FROM casillas_marcadas
            WHERE id_sala = ? AND id_jugador = ?
            ORDER BY letra, numero
        ");
        $stmt->execute([$id_sala, $id_jugador]);
        $casillas = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Verificar si hay suficientes casillas marcadas
        if (count($casillas) < 25) {
            return [
                'success' => false,
                'error' => 'No hay suficientes casillas marcadas'
            ];
        }

        // Verificar que todas las casillas marcadas correspondan a balotas sacadas
        $stmt = $pdo->prepare("
            SELECT COUNT(*) as total
            FROM casillas_marcadas cm
            WHERE cm.id_sala = ? 
            AND cm.id_jugador = ?
            AND EXISTS (
                SELECT 1 
                FROM balotas b 
                WHERE b.id_sala = cm.id_sala 
                AND b.numero = cm.numero 
                AND b.letra = cm.letra 
                AND b.estado = 1
            )
        ");
        $stmt->execute([$id_sala, $id_jugador]);
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($resultado['total'] < 25) {
            return [
                'success' => false,
                'error' => 'Algunas casillas marcadas no corresponden a balotas sacadas'
            ];
        }

        // Si llegamos aquí, el bingo es válido
        return [
            'success' => true,
            'message' => '¡BINGO válido!'
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
    
    if (!isset($data['id_sala']) || !isset($data['id_jugador'])) {
        echo json_encode([
            'success' => false,
            'error' => 'Datos incompletos'
        ]);
        exit;
    }
    
    echo json_encode(verificarBingo(
        (int)$data['id_sala'],
        (int)$data['id_jugador']
    ));
}
?> 