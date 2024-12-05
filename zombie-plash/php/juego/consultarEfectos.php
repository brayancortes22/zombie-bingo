<?php
require_once '../../setting/conexion-base-datos.php';
header('Content-Type: application/json');

function obtenerEfectosActivos($id_sala, $id_jugador) {
    global $conexion;
    $pdo = $conexion->conectar();
    
    try {
        $stmt = $pdo->prepare("
            SELECT ea.*, 
                   UNIX_TIMESTAMP(ea.tiempo_inicio) as timestamp_inicio,
                   ru.nombre as origen_nombre
            FROM efectos_activos ea
            JOIN jugador j ON ea.jugador_origen = j.id_jugador
            JOIN registro_usuarios ru ON j.id_registro = ru.id_registro
            WHERE ea.id_sala = ? 
            AND ea.jugador_destino = ?
            AND ea.estado = 'pendiente'
            AND ea.tiempo_inicio >= NOW() - INTERVAL (ea.duracion/1000) SECOND
        ");
        
        $stmt->execute([$id_sala, $id_jugador]);
        $efectos = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Marcar efectos como activos
        if (!empty($efectos)) {
            $stmt = $pdo->prepare("
                UPDATE efectos_activos 
                SET estado = 'activo' 
                WHERE id_efecto = ?
            ");
            
            foreach ($efectos as $efecto) {
                $stmt->execute([$efecto['id_efecto']]);
            }
        }

        return [
            'success' => true,
            'efectos' => $efectos
        ];

    } catch (PDOException $e) {
        error_log("Error en obtenerEfectosActivos: " . $e->getMessage());
        return [
            'success' => false,
            'error' => $e->getMessage()
        ];
    }
}

// Procesar la solicitud POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['id_sala']) || !isset($data['id_jugador'])) {
        echo json_encode([
            'success' => false,
            'error' => 'Datos incompletos'
        ]);
        exit;
    }

    // Agregar logs para depuración
    error_log("Consultando efectos para sala: " . $data['id_sala'] . ", jugador: " . $data['id_jugador']);
    
    $resultado = obtenerEfectosActivos(
        (int)$data['id_sala'],
        (int)$data['id_jugador']
    );
    
    echo json_encode($resultado);
} else {
    echo json_encode([
        'success' => false,
        'error' => 'Método no permitido'
    ]);
}
?> 