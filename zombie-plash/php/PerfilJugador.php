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

            $query = "SELECT r.id_registro, r.nombre, r.correo, r.estado 
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
                        'correo' => $row['correo'],
                        'estado' => $row['estado'],
                        'avatar' => $row['avatar']
                    ]
                ];
            } else {
                throw new Exception('Usuario no encontrado en la base de datos');
            }
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error en la base de datos: ' . $e->getMessage(),
                'debug' => [
                    'error_code' => $e->getCode(),
                    'error_message' => $e->getMessage()
                ]
            ];
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

            if (!$avatar) {
                throw new Exception('No se proporcionó un avatar');
            }

            $query = "UPDATE registro_usuarios 
                     SET avatar = :avatar 
                     WHERE id_registro = :id";
            
            $stmt = $this->pdo->prepare($query);
            $success = $stmt->execute([
                'avatar' => $avatar,
                'id' => $this->id_usuario
            ]);

            if ($success) {
                return [
                    'success' => true,
                    'message' => 'Avatar actualizado correctamente',
                    'data' => ['avatar' => $avatar]
                ];
            } else {
                throw new Exception('Error al actualizar el avatar');
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