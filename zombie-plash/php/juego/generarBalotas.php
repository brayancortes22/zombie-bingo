<?php
require_once '../../setting/conexion-base-datos.php';
session_start();

header('Content-Type: application/json');

function generarBalotas($id_sala) {
    global $conexion;
    $pdo = $conexion->conectar();
    
    try {
        // Validar que la sala existe
        $stmt = $pdo->prepare("SELECT id_sala FROM salas WHERE id_sala = ?");
        $stmt->execute([$id_sala]);
        if (!$stmt->fetch()) {
            throw new PDOException("La sala no existe");
        }

        // Primero limpiamos las balotas existentes para esta sala
        $stmt = $pdo->prepare("DELETE FROM balotas WHERE id_sala = ?");
        $stmt->execute([$id_sala]);
        
        // Generamos nuevas balotas
        $letras = ['B', 'I', 'N', 'G', 'O'];
        $rangos = [
            'B' => [1, 15],
            'I' => [16, 30],
            'N' => [31, 45],
            'G' => [46, 60],
            'O' => [61, 75]
        ];
        
        // Preparar la consulta una sola vez
        $stmt = $pdo->prepare("
            INSERT INTO balotas (id_sala, numero, letra, estado) 
            VALUES (?, ?, ?, 0)
        ");
        
        $balotasGeneradas = 0;
        // Insertar todas las balotas
        foreach ($letras as $letra) {
            $min = $rangos[$letra][0];
            $max = $rangos[$letra][1];
            
            for ($numero = $min; $numero <= $max; $numero++) {
                $stmt->execute([$id_sala, $numero, $letra]);
                $balotasGeneradas++;
            }
        }
        
        echo json_encode([
            'success' => true,
            'message' => "Se generaron $balotasGeneradas balotas exitosamente",
            'sala_id' => $id_sala
        ]);
        
    } catch (PDOException $e) {
        error_log("Error en generarBalotas: " . $e->getMessage());
        echo json_encode([
            'success' => false, 
            'error' => 'Error al generar balotas: ' . $e->getMessage(),
            'sala_id' => $id_sala
        ]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $sala_id = $_POST['sala_id'] ?? null;
    
    if (!$sala_id) {
        echo json_encode([
            'success' => false,
            'error' => 'ID de sala no proporcionado'
        ]);
        exit;
    }
    
    if (!is_numeric($sala_id)) {
        echo json_encode([
            'success' => false,
            'error' => 'ID de sala inválido'
        ]);
        exit;
    }
    
    generarBalotas((int)$sala_id);
}
?>