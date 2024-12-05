<?php
require_once '../../setting/conexion-base-datos.php';
header('Content-Type: application/json');

function aplicarEfecto($id_sala, $jugador_origen, $tipo_efecto) {
    global $conexion;
    $pdo = $conexion->conectar();
    
    try {
        // Obtener jugadores destino
        $stmt = $pdo->prepare("
            SELECT id_jugador 
            FROM jugadores_en_sala 
            WHERE id_sala = ? AND id_jugador != ?
        ");
        $stmt->execute([$id_sala, $jugador_origen]);
        $jugadores = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $duracion = 10000; // 10 segundos
        $efectosAplicados = [];

        foreach ($jugadores as $jugador) {
            $stmt = $pdo->prepare("
                INSERT INTO efectos_activos 
                (id_sala, tipo_efecto, jugador_origen, jugador_destino, duracion)
                VALUES (?, ?, ?, ?, ?)
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

        return [
            'success' => true,
            'efectos_aplicados' => $efectosAplicados
        ];

    } catch (PDOException $e) {
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