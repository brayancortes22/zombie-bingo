<?php
header('Content-Type: application/json');
require_once '../setting/conexion-base-datos.php';

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Verificar si se recibió el apodo
        if (!isset($_POST['apodo'])) {
            throw new Exception('No se recibió el apodo');
        }

        $apodo = trim($_POST['apodo']);
        
        // Log para depuración
        error_log("Apodo recibido: " . $apodo);
        
        // Validación básica
        if (strlen($apodo) < 3) {
            throw new Exception('El apodo debe tener al menos 3 caracteres');
        }
        
        // Verificar conexión
        if (!$conexion) {
            throw new Exception('Error de conexión a la base de datos');
        }
        
        // Verificar si el apodo ya existe
        $stmt = $conexion->prepare("SELECT id_invitado FROM invitados WHERE apodo = ?");
        if (!$stmt) {
            throw new Exception('Error en la preparación de la consulta: ' . $conexion->error);
        }
        
        $stmt->bind_param("s", $apodo);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            throw new Exception('Este apodo ya está en uso');
        }
        
        // Insertar nuevo invitado
        $stmt = $conexion->prepare("INSERT INTO invitados (apodo) VALUES (?)");
        if (!$stmt) {
            throw new Exception('Error en la preparación de la inserción: ' . $conexion->error);
        }
        
        $stmt->bind_param("s", $apodo);
        
        if ($stmt->execute()) {
            $id_invitado = $conexion->insert_id;
            echo json_encode([
                'success' => true, 
                'message' => 'Registro exitoso',
                'id_invitado' => $id_invitado
            ]);
        } else {
            throw new Exception('Error al registrar el invitado: ' . $stmt->error);
        }
    } else {
        throw new Exception('Método de solicitud no válido');
    }
} catch (Exception $e) {
    error_log("Error en registro_invitado.php: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?> 