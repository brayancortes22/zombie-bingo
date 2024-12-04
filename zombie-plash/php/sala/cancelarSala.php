<?php
session_start();
require '../../setting/conexion-base-datos.php';

// Habilitar logs de error
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

class CancelarSala {
    private $pdo;
    private $response;

    public function __construct() {
        $conexion = new Conexion();
        $this->pdo = $conexion->conectar();
        $this->response = ['success' => false, 'message' => ''];
    }

    public function cancelar() {
        try {
            // Log de la solicitud recibida
            $rawData = file_get_contents('php://input');
            error_log('Datos recibidos: ' . $rawData);
            
            $datos = json_decode($rawData, true);
            $id_sala = $datos['id_sala'] ?? null;
            $id_jugador = $datos['id_jugador'] ?? null;

            error_log("ID Sala: $id_sala, ID Jugador: $id_jugador");

            if (!$id_sala || !$id_jugador) {
                throw new Exception('Datos incompletos');
            }

            // Verificar si es el creador
            $query = "SELECT rol FROM jugadores_en_sala 
                     WHERE id_sala = :id_sala AND id_jugador = :id_jugador";
            $stmt = $this->pdo->prepare($query);
            $stmt->execute([
                'id_sala' => $id_sala,
                'id_jugador' => $id_jugador
            ]);
            $jugador = $stmt->fetch();

            error_log('Resultado verificación creador: ' . print_r($jugador, true));

            if (!$jugador || $jugador['rol'] !== 'creador') {
                throw new Exception('No tienes permisos para cancelar la sala');
            }

            // Iniciar transacción
            $this->pdo->beginTransaction();

            // Eliminar jugadores de la sala
            $stmt = $this->pdo->prepare("DELETE FROM jugadores_en_sala WHERE id_sala = :id_sala");
            $stmt->execute(['id_sala' => $id_sala]);

            // Eliminar la sala
            $stmt = $this->pdo->prepare("DELETE FROM salas WHERE id_sala = :id_sala");
            $stmt->execute(['id_sala' => $id_sala]);

            $this->pdo->commit();
            $this->response = ['success' => true, 'message' => 'Sala cancelada exitosamente'];

        } catch (Exception $e) {
            error_log('Error en cancelarSala: ' . $e->getMessage());
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }
            $this->response = ['success' => false, 'message' => $e->getMessage()];
        }

        return $this->response;
    }
}

header('Content-Type: application/json');
$cancelar = new CancelarSala();
echo json_encode($cancelar->cancelar());
?>
