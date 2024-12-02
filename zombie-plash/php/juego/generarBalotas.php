<?php
require_once '../../setting/conexion-base-datos.php';

function generarBalotas($id_sala) {
    global $conexion;
    $pdo = $conexion->conectar();
    
    try {
        // Log para debug
        error_log("Generando balotas para sala: " . $id_sala);
        
        // Limpiar balotas existentes para esta sala
        $sql_limpiar = "DELETE FROM balotas WHERE id_sala = ?";
        $stmt = $pdo->prepare($sql_limpiar);
        $stmt->execute([$id_sala]);
        
        // Generar nuevas balotas
        $balotas = [];
        
        // B: 1-12
        for ($i = 1; $i <= 12; $i++) {
            $balotas[] = ['numero' => $i, 'letra' => 'B'];
        }
        
        // I: 13-23
        for ($i = 13; $i <= 23; $i++) {
            $balotas[] = ['numero' => $i, 'letra' => 'I'];
        }
        
        // N: 24-34
        for ($i = 24; $i <= 34; $i++) {
            $balotas[] = ['numero' => $i, 'letra' => 'N'];
        }
        
        // G: 35-45
        for ($i = 35; $i <= 45; $i++) {
            $balotas[] = ['numero' => $i, 'letra' => 'G'];
        }
        
        // O: 46-60
        for ($i = 46; $i <= 60; $i++) {
            $balotas[] = ['numero' => $i, 'letra' => 'O'];
        }

         // Log cantidad de balotas
         error_log("Total balotas a insertar: " . count($balotas));
        

        // Insertar balotas en la base de datos
        $sql_insertar = "INSERT INTO balotas (numero, letra, id_sala, estado) VALUES (?, ?, ?, 0)";
        $stmt = $pdo->prepare($sql_insertar);
        
        foreach ($balotas as $balota) {
            $stmt->execute([$balota['numero'], $balota['letra'], $id_sala]);
              // Log cada inserción
              error_log("Balota insertada: Número {$balota['numero']}, Letra {$balota['letra']}");
            }
        // Verificar balotas insertadas
        $sql_verificar = "SELECT COUNT(*) as total FROM balotas WHERE id_sala = ?";
        $stmt = $pdo->prepare($sql_verificar);
        $stmt->execute([$id_sala]);
        $total = $stmt->fetch()['total'];
        error_log("Total balotas insertadas en BD: " . $total);
        
        return ['success' => true, 'message' => 'Balotas generadas correctamente', 'total' => $total];
        
    } catch (PDOException $e) {
        error_log("Error al generar balotas: " . $e->getMessage());
        return ['succes'=> false, 'massage'=> 'Error al generar balotas' . $e->getMessage()];
    }
}

// Uso del endpoint
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id_sala = $data['id_sala'] ?? null;
    
    error_log("POST recibido en generarBalotas.php");
    error_log("ID sala recibido: " . ($id_sala ?? 'null'));
    
    if ($id_sala) {
        $resultado = generarBalotas($id_sala);
        echo json_encode($resultado);
    } else {
        echo json_encode(['success' => false, 'message' => 'ID de sala no proporcionado']);
    }
}
?> 