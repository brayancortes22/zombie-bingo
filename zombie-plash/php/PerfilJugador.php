<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

require_once '../setting/conexion-base-datos.php';

class PerfilJugador {
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

    public function obtenerDatosPerfil() {
        try {
            if (!$this->id_usuario) {
                throw new Exception('Usuario no autenticado');
            }
    
            $query = "SELECT r.id_registro, r.nombre, r.avatar 
                     FROM registro_usuarios r 
                     WHERE r.id_registro = :id";
            
            $stmt = $this->pdo->prepare($query);
            $stmt->execute(['id' => $this->id_usuario]);
            
            if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                return [
                    'success' => true,
                    'data' => [
                        'id' => $row['id_registro'],
                        'nombre' => $row['nombre'],
                        'avatar' => $row['avatar']
                    ]
                ];
            } else {
                throw new Exception('Usuario no encontrado en la base de datos');
            }
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
    public function actualizarAvatar() {
        try {
            if (!$this->id_usuario) {
                throw new Exception('Usuario no autenticado');
            }

            $data = json_decode(file_get_contents('php://input'), true);
            $avatar = $data['avatar'] ?? null;
            $nombre = $data['nombre'] ?? null;

            if (!$avatar || !$nombre) {
                throw new Exception('Datos incompletos');
            }

            $query = "UPDATE registro_usuarios 
                     SET avatar = :avatar, nombre = :nombre
                     WHERE id_registro = :id";
            
            $stmt = $this->pdo->prepare($query);
            $success = $stmt->execute([
                'avatar' => $avatar,
                'nombre' => $nombre,
                'id' => $this->id_usuario
            ]);

            if ($success) {
                return [
                    'success' => true,
                    'message' => 'Perfil actualizado correctamente',
                    'data' => ['avatar' => $avatar, 'nombre' => $nombre]
                ];
            } else {
                throw new Exception('Error al actualizar el perfil');
            }
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
}

try {
    $perfil = new PerfilJugador();
    $action = $_GET['action'] ?? '';

    switch ($action) {
        case 'obtener':
            $response = $perfil->obtenerDatosPerfil();
            break;
        case 'actualizar':
            $response = $perfil->actualizarAvatar();
            break;
        default:
            $response = [
                'success' => false,
                'message' => 'Acción no válida'
            ];
    }
} catch (Exception $e) {
    $response = [
        'success' => false,
        'message' => $e->getMessage()
    ];
}

echo json_encode($response);
exit; 