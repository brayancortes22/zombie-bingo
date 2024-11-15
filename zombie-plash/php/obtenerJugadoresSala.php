<?php
session_start();
require '../setting/conexion-base-datos.php';

class ObtenerJugadores {
    private $pdo;
    private $id_sala;

    public function __construct() {
        $conexion = new Conexion();
        $this->pdo = $conexion->conectar();
        $this->id_sala = $_GET['id_sala'] ?? null;
    }

    public function obtenerJugadores() {
        try {
            if (!$this->id_sala) {
                throw new Exception('ID de sala no proporcionado');
            }

            $query = "SELECT 
                        jes.id,
                        jes.id_jugador,
                        jes.nombre_jugador,
                        s.max_jugadores,
                        s.jugadores_unidos
                    FROM jugadores_en_sala jes
                    JOIN salas s ON jes.id_sala = s.id_sala
                    WHERE jes.id_sala = :id_sala
                    ORDER BY jes.id";
                     
            $stmt = $this->pdo->prepare($query);
            $stmt->execute(['id_sala' => $this->id_sala]);
            
            $jugadores = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $querySala = "SELECT max_jugadores, jugadores_unidos 
                         FROM salas 
                         WHERE id_sala = :id_sala";
            $stmtSala = $this->pdo->prepare($querySala);
            $stmtSala->execute(['id_sala' => $this->id_sala]);
            $infoSala = $stmtSala->fetch(PDO::FETCH_ASSOC);

            return [
                'success' => true,
                'jugadores' => $jugadores,
                'info_sala' => $infoSala
            ];

        } catch (Exception $e) {
            error_log("Error en obtenerJugadores: " . $e->getMessage());
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        } finally {
            $this->pdo = null;
        }
    }
}

header('Content-Type: application/json');

try {
    $obtenerJugadores = new ObtenerJugadores();
    $resultado = $obtenerJugadores->obtenerJugadores();
    echo json_encode($resultado);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}