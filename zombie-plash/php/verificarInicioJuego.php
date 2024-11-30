<?php
session_start();
require '../setting/conexion-base-datos.php';

class VerificarInicioJuego {
    private $pdo;
    private $id_sala;

    public function __construct() {
        $conexion = new Conexion();
        $this->pdo = $conexion->conectar();
        $this->id_sala = $_GET['id_sala'] ?? null;
    }

    public function verificar() {
        try {
            if (!$this->id_sala) {
                throw new Exception('ID de sala no proporcionado');
            }

            // Verificar la información de la sala
            $query = "SELECT max_jugadores, jugadores_unidos FROM salas WHERE id_sala = :id_sala";
            $stmt = $this->pdo->prepare($query);
            $stmt->execute(['id_sala' => $this->id_sala]);
            $sala = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$sala) {
                throw new Exception('Sala no encontrada');
            }

            // Verificar si hay suficientes jugadores
            if ($sala['jugadores_unidos'] < 2) {
                return [
                    'success' => false,
                    'message' => 'Se necesitan al menos 2 jugadores para iniciar el juego'
                ];
            }

            // Actualizar estado de la sala a "en juego"
            $updateQuery = "UPDATE salas SET estado = 'en_juego' WHERE id_sala = :id_sala";
            $updateStmt = $this->pdo->prepare($updateQuery);
            $updateStmt->execute(['id_sala' => $this->id_sala]);

            return [
                'success' => true,
                'message' => 'Juego puede iniciar'
            ];

        } catch (Exception $e) {
            http_response_code(500);
            return [
                'success' => false,
                'message' => 'Error del servidor: ' . $e->getMessage()
            ];
        }
    }

    public function actualizarEstadoSala($estado) {
        $updateQuery = "UPDATE salas SET estado = :estado WHERE id_sala = :id_sala";
        $updateStmt = $this->pdo->prepare($updateQuery);
        $updateStmt->execute(['estado' => $estado, 'id_sala' => $this->id_sala]);
    }
    public function notificarJugadores() {
        // Aquí puedes implementar la lógica para enviar una notificación a todos los jugadores
        // indicando que deben redireccionar al juego. Puedes usar WebSockets, long-polling, etc.
        // Dependiendo de la tecnología que estés utilizando en tu proyecto.
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id_sala = $input['id_sala'] ?? null;

    $verificador = new VerificarInicioJuego($id_sala);
    $resultado = $verificador->verificar();

    if ($resultado['success']) {
        // Actualizar estado de la sala a "en_juego"
        $verificador->actualizarEstadoSala('en_juego');

        // Enviar respuesta a todos los jugadores para que redireccionen al juego
        $verificador->notificarJugadores();
    }

    header('Content-Type: application/json');
    echo json_encode($resultado);
    exit();
}

header('Content-Type: application/json');

try {
    $verificador = new VerificarInicioJuego();
    $resultado = $verificador->verificar();
    echo json_encode($resultado);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error del servidor: ' . $e->getMessage()
    ]);
} 