<?php
require_once '../../setting/conexion-base-datos.php';
header('Content-Type: application/json');

function marcarCasilla($id_sala, $id_jugador, $numero, $letra) {
    global $conexion;
    $pdo = $conexion->conectar();
    
    try {
        // Verificar si la balota ha sido sacada
        $stmt = $pdo->prepare("
            SELECT id_balota 
            FROM balotas 
            WHERE id_sala = ? AND numero = ? AND letra = ? AND estado = 1
        ");
        $stmt->execute([$id_sala, $numero, $letra]);
        
        if (!$stmt->fetch()) {
            return [
                'success' => false,
                'error' => 'Esta balota aún no ha sido sacada'
            ];
        }

        // Registrar la casilla marcada
        $stmt = $pdo->prepare("
            INSERT INTO casillas_marcadas (id_sala, id_jugador, numero, letra)
            VALUES (?, ?, ?, ?)
        ");
        $stmt->execute([$id_sala, $id_jugador, $numero, $letra]);

        return [
            'success' => true,
            'message' => 'Casilla marcada correctamente'
        ];

    } catch (PDOException $e) {
        error_log("Error al marcar casilla: " . $e->getMessage());
        return [
            'success' => false,
            'error' => 'Error al marcar casilla: ' . $e->getMessage()
        ];
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['id_sala']) || !isset($data['id_jugador']) || 
        !isset($data['numero']) || !isset($data['letra'])) {
        echo json_encode([
            'success' => false,
            'error' => 'Datos incompletos'
        ]);
        exit;
    }
    
    echo json_encode(marcarCasilla(
        (int)$data['id_sala'],
        (int)$data['id_jugador'],
        (int)$data['numero'],
        $data['letra']
    ));
}
?> 