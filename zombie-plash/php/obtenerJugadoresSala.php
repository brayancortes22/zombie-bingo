<?php
session_start();
require '../setting/conexion-base-datos.php';

class ObtenerJugadores {
    private $pdo;
    private $response;
    private $id_sala;

    public function __construct() {
        $conexion = new Conexion();
        $this->pdo = $conexion->conectar();
        $this->response = [];
        $this->id_sala = $_GET['id_sala'] ?? null;
    }

    private function validarEntrada() {
        if (!$this->id_sala) {
            throw new Exception('ID de sala no proporcionado');
        }
    }

    private function obtenerJugadores() {
        $query = "SELECT id_jugador, nombre_jugador 
                 FROM jugadores_en_sala 
                 WHERE id_sala = :id_sala";
                 
        $stmt = $this->pdo->prepare($query);
        $stmt->execute(['id_sala' => $this->id_sala]);
        
        return $stmt->fetchAll();
    }

    public function ejecutarConsulta() {
        try {
            $this->validarEntrada();
            $this->response = $this->obtenerJugadores();
            
        } catch (Exception $e) {
            $this->response = ['error' => $e->getMessage()];
        } finally {
            $this->pdo = null;
        }

        return $this->response;
    }
}

// Uso de la clase
header('Content-Type: application/json');

$obtenerJugadores = new ObtenerJugadores();
$resultado = $obtenerJugadores->ejecutarConsulta();
echo json_encode($resultado);
