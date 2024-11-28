<?php
session_start();
require '../setting/conexion-base-datos.php';

class SalirDeSala {
    private $pdo;
    private $id_sala;
    private $id_jugador;

    public function __construct() {
        try {
            $conexion = new Conexion();
            $this->pdo = $conexion->conectar();
            
            // Obtener datos de la petición
            $data = json_decode(file_get_contents('php://input'), true);
            $this->id_sala = $data['id_sala'] ?? null;
            $this->id_jugador = $data['id_jugador'] ?? null;

            // Debug
            error_log("Datos recibidos en SalirDeSala: " . print_r($data, true));
        } catch (Exception $e) {
            error_log("Error en constructor SalirDeSala: " . $e->getMessage());
        }
    }

    public function ejecutar() {
        try {
            $this->pdo->beginTransaction();

            // 1. Obtener el ID del registro del jugador en la sala
            $idRegistro = $this->obtenerIdJugadorEnSala();
            if (!$idRegistro) {
                throw new Exception('No se encontró el registro del jugador en la sala.');
            }

            // 2. Eliminar jugador de la sala usando el id de la tabla
            $query = "DELETE FROM jugadores_en_sala WHERE id = :id";
            $stmt = $this->pdo->prepare($query);
            $stmt->execute([':id' => $idRegistro]);

            // 3. Actualizar contador de jugadores
            $query = "UPDATE salas 
                     SET jugadores_unidos = jugadores_unidos - 1 
                     WHERE id_sala = :id_sala";
            $stmt = $this->pdo->prepare($query);
            $stmt->execute([':id_sala' => $this->id_sala]);

            $this->pdo->commit();
            return [
                'success' => true,
                'message' => 'Jugador eliminado correctamente'
            ];

        } catch (Exception $e) {
            $this->pdo->rollBack();
            error_log("Error en SalirDeSala::ejecutar: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error al salir de la sala: ' . $e->getMessage()
            ];
        }
    }

    private function obtenerIdJugadorEnSala() {
        $query = "SELECT id FROM jugadores_en_sala WHERE id_sala = :id_sala AND id_jugador = :id_jugador";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute([
            ':id_sala' => $this->id_sala,
            ':id_jugador' => $this->id_jugador
        ]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['id'] ?? null;
    }
}

// Configurar headers y ejecutar
header('Content-Type: application/json');
$salir = new SalirDeSala();
echo json_encode($salir->ejecutar());