<?php
require_once '../../setting/conexion-base-datos.php';
header('Content-Type: application/json');

function aplicarEfecto($id_sala, $jugador_origen, $tipo_efecto) {
    global $conexion;
    $pdo = $conexion->conectar();
    
    try {
        // Verificar que el jugador está en la sala
        $stmt = $pdo->prepare("
            SELECT id FROM jugadores_en_sala 
            WHERE id_sala = ? AND id_jugador = ?
        ");
        $stmt->execute([$id_sala, $jugador_origen]);
        if (!$stmt->fetch()) {
            throw new Exception("El jugador no está en la sala");
        }

        // Obtener jugadores destino (todos excepto el origen)
        $stmt = $pdo->prepare("
            SELECT id_jugador 
            FROM jugadores_en_sala 
            WHERE id_sala = ? AND id_jugador != ?
        ");
        $stmt->execute([$id_sala, $jugador_origen]);
        $jugadores = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (empty($jugadores)) {
            throw new Exception("No hay otros jugadores en la sala");
        }

        $duracion = 10000; // 10 segundos
        $efectosAplicados = [];

        foreach ($jugadores as $jugador) {
            $stmt = $pdo->prepare("
                INSERT INTO efectos_activos 
                (id_sala, tipo_efecto, jugador_origen, jugador_destino, duracion, estado)
                VALUES (?, ?, ?, ?, ?, 'pendiente')
            ");
            
            if ($stmt->execute([
                $id_sala,
                $tipo_efecto,
                $jugador_origen,
                $jugador['id_jugador'],
                $duracion
            ])) {
                $efectosAplicados[] = $pdo->lastInsertId();
            }
        }

        // Actualizar timestamp del último poder usado
        $stmt = $pdo->prepare("
            UPDATE jugadores_en_sala 
            SET ultimo_poder_usado = CURRENT_TIMESTAMP
            WHERE id_sala = ? AND id_jugador = ?
        ");
        $stmt->execute([$id_sala, $jugador_origen]);

        // Bloquear a los jugadores afectados por 5 segundos
        $stmt = $pdo->prepare("
            UPDATE jugadores_en_sala 
            SET poder_bloqueado_hasta = DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 5 SECOND)
            WHERE id_sala = ? AND id_jugador = ?
        ");
        foreach ($jugadores as $jugador) {
            $stmt->execute([$id_sala, $jugador['id_jugador']]);
        }

        return [
            'success' => true,
            'efectos_aplicados' => $efectosAplicados,
            'mensaje' => 'Efecto aplicado correctamente'
        ];

    } catch (Exception $e) {
        error_log("Error al aplicar efecto: " . $e->getMessage());
        return [
            'success' => false,
            'error' => $e->getMessage()
        ];
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['id_sala']) || !isset($data['jugador_origen']) || !isset($data['tipo_efecto'])) {
        echo json_encode([
            'success' => false,
            'error' => 'Datos incompletos'
        ]);
        exit;
    }
    
    echo json_encode(aplicarEfecto(
        (int)$data['id_sala'],
        (int)$data['jugador_origen'],
        $data['tipo_efecto']
    ));
}
?> 