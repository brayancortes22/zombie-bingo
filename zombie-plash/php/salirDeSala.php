<?php
session_start();
require '../setting/conexion-base-datos.php';

class SalirDeSala {
    private $pdo;
    private $id_sala;
    private $id_jugador;
    private $response;
    private $transactionStarted = false;

    public function __construct() {
        try {
            $conexion = new Conexion();
            $this->pdo = $conexion->conectar();
            
            $data = json_decode(file_get_contents('php://input'), true);
            $this->id_sala = $data['id_sala'] ?? null;
            $this->id_jugador = $data['id_jugador'] ?? null;

            // Debug
            error_log("Datos recibidos: " . print_r($data, true));
            
            if (!$this->id_sala || !$this->id_jugador) {
                throw new Exception('Datos incompletos. ID Sala: ' . $this->id_sala . ', ID Jugador: ' . $this->id_jugador);
            }
            
            $this->response = ['success' => false, 'message' => ''];
        } catch (Exception $e) {
            $this->response = [
                'success' => false,
                'message' => 'Error de inicialización: ' . $e->getMessage()
            ];
        }
    }

    public function ejecutar() {
        if (!$this->pdo) {
            return $this->response;
        }

        try {
            // Verificar si el jugador está en la sala antes de iniciar la transacción
            $query = "SELECT COUNT(*) as total FROM jugadores_en_sala 
                     WHERE id_sala = :id_sala AND id_jugador = :id_jugador";
            $stmt = $this->pdo->prepare($query);
            $stmt->execute([
                ':id_sala' => $this->id_sala,
                ':id_jugador' => $this->id_jugador
            ]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($result['total'] == 0) {
                throw new Exception("Jugador no encontrado en la sala. ID Sala: {$this->id_sala}, ID Jugador: {$this->id_jugador}");
            }

            // Iniciar transacción solo si el jugador está en la sala
            $this->pdo->beginTransaction();
            $this->transactionStarted = true;

            // Eliminar jugador de la sala
            $query = "DELETE FROM jugadores_en_sala 
                     WHERE id_sala = :id_sala AND id_jugador = :id_jugador";
            $stmt = $this->pdo->prepare($query);
            $stmt->execute([
                ':id_sala' => $this->id_sala,
                ':id_jugador' => $this->id_jugador
            ]);

            // Actualizar contador de jugadores
            $query = "UPDATE salas 
                     SET jugadores_unidos = jugadores_unidos - 1 
                     WHERE id_sala = :id_sala";
            $stmt = $this->pdo->prepare($query);
            $stmt->execute([':id_sala' => $this->id_sala]);

            // Commit solo si la transacción está activa
            if ($this->transactionStarted) {
                $this->pdo->commit();
            }

            $this->response = [
                'success' => true,
                'message' => 'Jugador eliminado de la sala correctamente'
            ];

        } catch (Exception $e) {
            // Rollback solo si la transacción está activa
            if ($this->transactionStarted) {
                $this->pdo->rollBack();
            }
            $this->response = [
                'success' => false,
                'message' => $e->getMessage()
            ];
        } finally {
            // Cerrar la conexión
            $this->pdo = null;
        }

        return $this->response;
    }
}

header('Content-Type: application/json');
$salir = new SalirDeSala();
echo json_encode($salir->ejecutar()); 