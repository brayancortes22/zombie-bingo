<?php
session_start();
require '../setting/conexion-base-datos.php';

class CancelarSala {
    private $pdo;
    private $response;
    private $id_sala;
    private $id_jugador;

    public function __construct() {
        $conexion = new Conexion();
        $this->pdo = $conexion->conectar();
        $this->response = ['success' => false, 'message' => ''];
        
        // Obtener datos del POST
        $datos = json_decode(file_get_contents('php://input'), true);
        $this->id_sala = $datos['id_sala'] ?? null;
        $this->id_jugador = $datos['id_jugador'] ?? null;
    }

    public function ejecutarCancelacion() {
        try {
            if (!$this->id_sala || !$this->id_jugador) {
                throw new Exception('Datos incompletos para cancelar la sala');
            }

            $this->pdo->beginTransaction();

            // Verificar si es el creador de la sala
            $stmt = $this->pdo->prepare("SELECT rol FROM jugadores_en_sala 
                                       WHERE id_sala = ? AND id_jugador = ?");
            $stmt->execute([$this->id_sala, $this->id_jugador]);
            $jugador = $stmt->fetch();

            if (!$jugador || $jugador['rol'] !== 'creador') {
                throw new Exception('No tienes permisos para cerrar esta sala');
            }

            // Eliminar todos los jugadores de la sala
            $stmt = $this->pdo->prepare("DELETE FROM jugadores_en_sala WHERE id_sala = ?");
            $stmt->execute([$this->id_sala]);

            // Eliminar la sala
            $stmt = $this->pdo->prepare("DELETE FROM salas WHERE id_sala = ?");
            $stmt->execute([$this->id_sala]);

            $this->pdo->commit();
            
            $this->response = [
                'success' => true,
                'message' => 'Sala cerrada exitosamente'
            ];

        } catch (Exception $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }
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
$cancelar = new CancelarSala();
$resultado = $cancelar->ejecutarCancelacion();
echo json_encode($resultado);
