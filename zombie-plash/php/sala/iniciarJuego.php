<?php
session_start();
require '../../setting/conexion-base-datos.php';

class IniciarJuego {
    private $pdo;
    private $id_sala;

    public function __construct($id_sala) {
        $conexion = new Conexion();
        $this->pdo = $conexion->conectar();
        $this->id_sala = $id_sala;
    }

    public function iniciar() {
        try {
            if (!$this->id_sala) {
                throw new Exception('ID de sala no proporcionado');
            }

            // Verificar si la sala existe y tiene suficientes jugadores
            $query = "SELECT * FROM salas WHERE id_sala = :id_sala AND jugadores_unidos >= 2";
            $stmt = $this->pdo->prepare($query);
            $stmt->execute(['id_sala' => $this->id_sala]);
            $sala = $stmt->fetch();

            if (!$sala) {
                throw new Exception('La sala no existe o no tiene suficientes jugadores');
            }

            // Actualizar el estado de la sala a "en_juego"
            $updateQuery = "UPDATE salas SET estado = 'en_juego' WHERE id_sala = :id_sala";
            $updateStmt = $this->pdo->prepare($updateQuery);
            $updateStmt->execute(['id_sala' => $this->id_sala]);

            return [
                'success' => true,
                'message' => 'Juego iniciado'
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id_sala = $input['id_sala'] ?? null;

    $iniciarJuego = new IniciarJuego($id_sala);
    $resultado = $iniciarJuego->iniciar();

    header('Content-Type: application/json');
    echo json_encode($resultado);
    exit();
}

