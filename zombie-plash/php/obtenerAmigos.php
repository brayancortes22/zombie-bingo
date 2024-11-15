<?php
session_start();
require_once '../setting/conexion-base-datos.php';

class AmigosManager {
    private $pdo;
    private $id_usuario;

    public function __construct() {
        try {
            $conexion = new Conexion();
            $this->pdo = $conexion->conectar();
            $this->id_usuario = $_SESSION['id_usuario'] ?? null;
        } catch (PDOException $e) {
            throw new Exception('Error de conexión: ' . $e->getMessage());
        }
    }

    public function obtenerAmigos() {
        try {
            if (!$this->id_usuario) {
                throw new Exception('Usuario no autenticado');
            }

            $query = "SELECT r.id_registro, r.nombre, r.avatar 
                     FROM amistad a 
                     JOIN registro_usuarios r ON a.id_amigo = r.id_registro 
                     WHERE a.id_jugador = :id_usuario 
                     LIMIT 5"; // Limitamos a 5 amigos
            
            $stmt = $this->pdo->prepare($query);
            $stmt->execute(['id_usuario' => $this->id_usuario]);
            
            return [
                'success' => true,
                'amigos' => $stmt->fetchAll(PDO::FETCH_ASSOC)
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
}

// Si se hace una petición AJAX
if (isset($_GET['action']) && $_GET['action'] === 'obtener') {
    $amigosManager = new AmigosManager();
    header('Content-Type: application/json');
    echo json_encode($amigosManager->obtenerAmigos());
} 