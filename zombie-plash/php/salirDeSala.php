<?php
session_start();
require '../setting/conexion-base-datos.php';

class SalirDeSala {
    private $pdo;
    private $response;
    private $id_sala;
    private $id_jugador;

    // Dentro de la clase SalirDeSala
public function __construct() {
    $conexion = new Conexion();
    $this->pdo = $conexion->conectar();
    $this->response = ['success' => false, 'message' => ''];
    
    // Obtener y validar datos del POST
    $datos = json_decode(file_get_contents('php://input'), true);
    
    // Debug
    error_log('Datos recibidos: ' . print_r($datos, true));
    
    $this->id_sala = $datos['id_sala'] ?? null;
    $this->id_jugador = $datos['id_jugador'] ?? null;
    
    // Debug
    error_log('ID Sala: ' . $this->id_sala);
    error_log('ID Jugador: ' . $this->id_jugador);
}

    public function ejecutarSalida() {
        try {
            if (!$this->id_sala || !$this->id_jugador) {
                throw new Exception('Datos incompletos para salir de la sala');
            }

            // Eliminar al jugador de la sala
            $stmt = $this->pdo->prepare("DELETE FROM jugadores_en_sala 
                                       WHERE id_sala = ? AND id_jugador = ?");
            $stmt->execute([$this->id_sala, $this->id_jugador]);

            // Actualizar el contador de jugadores
            $stmt = $this->pdo->prepare("UPDATE salas 
                                       SET jugadores_unidos = jugadores_unidos - 1 
                                       WHERE id_sala = ? AND jugadores_unidos > 0");
            $stmt->execute([$this->id_sala]);

            $this->response = [
                'success' => true,
                'message' => 'Has salido de la sala exitosamente'
            ];

        } catch (Exception $e) {
            $this->response = [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }

        return $this->response;
    }
}

// Ejecutar
header('Content-Type: application/json');
$salir = new SalirDeSala();
$resultado = $salir->ejecutarSalida();
echo json_encode($resultado);