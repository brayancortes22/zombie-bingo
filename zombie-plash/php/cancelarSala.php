<?php
session_start();
require '../setting/conexion-base-datos.php';

class CancelarSala {
    private $pdo;
    private $response;
    private $id_sala;
    private $id_usuario;

    public function __construct() {
        $conexion = new Conexion();
        $this->pdo = $conexion->conectar();
        $this->response = ['success' => false, 'message' => ''];
        $this->id_usuario = $_SESSION['id_usuario'] ?? null;
    }

    public function obtenerDatosEntrada() {
        $input = json_decode(file_get_contents('php://input'), true);
        $this->id_sala = $input['id_sala'] ?? null;

        if (!$this->id_sala) {
            throw new Exception('ID de sala no proporcionado');
        }
    }

    public function verificarCreadorSala() {
        $query = "SELECT id_creador FROM salas WHERE id_sala = :id_sala";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute(['id_sala' => $this->id_sala]);
        $sala = $stmt->fetch();

        if (!$sala) {
            throw new Exception('Sala no encontrada');
        }

        if ($sala['id_creador'] != $this->id_usuario) {
            throw new Exception('No tienes permiso para cancelar esta sala');
        }

        return true;
    }

    public function eliminarJugadoresSala() {
        $query = "DELETE FROM jugadores_en_sala WHERE id_sala = :id_sala";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute(['id_sala' => $this->id_sala]);
    }

    public function eliminarSala() {
        $query = "DELETE FROM salas WHERE id_sala = :id_sala";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute(['id_sala' => $this->id_sala]);
    }

    public function ejecutarCancelacion() {
        try {
            $this->obtenerDatosEntrada();
            $this->verificarCreadorSala();

            $this->pdo->beginTransaction();
            
            $this->eliminarJugadoresSala();
            $this->eliminarSala();
            
            $this->pdo->commit();
            
            $this->response['success'] = true;
            $this->response['message'] = 'Sala cancelada exitosamente';

        } catch (Exception $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }
            $this->response['message'] = 'Error al cancelar la sala: ' . $e->getMessage();
        } finally {
            $this->pdo = null;
        }

        return $this->response;
    }
}

// Uso de la clase
header('Content-Type: application/json');

$cancelador = new CancelarSala();
$resultado = $cancelador->ejecutarCancelacion();
echo json_encode($resultado);
