<?php
require_once '../../setting/conexion-base-datos.php';  // Ruta corregida

function obtenerNumerosSala($id_sala) {
    global $conexion;
    $pdo = $conexion->conectar();
    
    try {
        error_log("Obteniendo números para sala: " . $id_sala); // Debug

        // Obtener números sacados de la sala
        $sql = "SELECT numeros_sacados FROM salas WHERE id_sala = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id_sala]);
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);

        error_log("Resultado de la consulta: " . print_r($resultado, true)); // Debug

        if ($resultado && $resultado['numeros_sacados'] !== null) {
            $numeros = json_decode($resultado['numeros_sacados']);
            error_log("Números decodificados: " . print_r($numeros, true)); // Debug
            return [
                'success' => true,
                'numeros' => $numeros ? $numeros : []
            ];
        }

        return [
            'success' => true,
            'numeros' => []
        ];

    } catch (PDOException $e) {
        error_log("Error al obtener números de la sala: " . $e->getMessage());
        return ['success' => false, 'message' => 'Error al obtener números'];
    }
}

// Asegurar que no haya salida antes del JSON
ob_clean(); // Limpiar cualquier salida anterior
header('Content-Type: application/json'); // Establecer el tipo de contenido

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id_sala = $data['id_sala'] ?? null;
    
    error_log("ID sala recibido: " . ($id_sala ?? 'null')); // Debug
    
    if ($id_sala) {
        $resultado = obtenerNumerosSala($id_sala);
        error_log("Enviando respuesta: " . json_encode($resultado)); // Debug
        echo json_encode($resultado);
    } else {
        echo json_encode(['success' => false, 'message' => 'ID de sala no proporcionado']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}
exit;
?>