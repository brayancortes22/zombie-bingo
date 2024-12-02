<?php
require_once '../../setting/conexion-base-datos.php';

function verificarBingo($id_sala, $carton, $numeros_jugador) {
    global $conexion;
    $pdo = $conexion->conectar();
    
    try {
        // Obtener números sacados de la sala
        $sql = "SELECT numeros_sacados FROM salas WHERE id_sala = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id_sala]);
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$resultado) {
            return ['success' => false, 'message' => 'Sala no encontrada'];
        }
        
        $numeros_sala = json_decode($resultado['numeros_sacados'], true);
        
        // Verificar que todos los números del cartón estén en los números sacados
        foreach ($carton as $numero) {
            if (!in_array($numero, $numeros_sala)) {
                return ['success' => false, 'message' => 'Números no coinciden'];
            }
        }
        
        // Obtener ranking de jugadores
        $ranking = obtenerRanking($id_sala);
        
        // Registrar ganador
        registrarGanador($id_sala, $_SESSION['id_jugador']);
        
        return [
            'success' => true,
            'ranking' => $ranking
        ];
        
    } catch (PDOException $e) {
        return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
    }
}

function obtenerRanking($id_sala) {
    global $conexion;
    $pdo = $conexion->conectar();
    
    $sql = "SELECT j.nombre, COUNT(*) as aciertos 
            FROM jugadores_en_sala jes 
            JOIN jugador j ON jes.id_jugador = j.id_jugador 
            WHERE jes.id_sala = ? 
            GROUP BY j.id_jugador 
            ORDER BY aciertos DESC";
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$id_sala]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function registrarGanador($id_sala, $id_jugador) {
    global $conexion;
    $pdo = $conexion->conectar();
    
    $sql = "INSERT INTO partida (id_sala, id_ganador, fecha_partida) 
            VALUES (?, ?, NOW())";
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$id_sala, $id_jugador]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (isset($data['id_sala']) && isset($data['carton']) && isset($data['numeros_sacados'])) {
        $resultado = verificarBingo($data['id_sala'], $data['carton'], $data['numeros_sacados']);
        echo json_encode($resultado);
    } else {
        echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
    }
}
?> 