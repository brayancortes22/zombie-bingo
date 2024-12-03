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

            $nombre = $_POST['nombre'] ?? null;
            $avatar = null;

            // Manejo de avatar predefinido
            if (isset($_POST['avatarPredefinido'])) {
                $avatar = $_POST['avatarPredefinido'];
            }
            // Manejo de archivo subido
            else if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === UPLOAD_ERR_OK) {
                $file = $_FILES['avatar'];
                $fileName = uniqid() . '_' . basename($file['name']);
                $uploadPath = '../uploads/avatars/' . $fileName;

                // Verificar que sea una imagen válida
                $imageInfo = getimagesize($file['tmp_name']);
                if ($imageInfo === false) {
                    throw new Exception('El archivo subido no es una imagen válida');
                }

                // Mover el archivo a la carpeta de uploads
                if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
                    $avatar = $fileName;
                } else {
                    throw new Exception('Error al guardar la imagen');
                }
            }

            if (!$nombre) {
                throw new Exception('El nombre es requerido');
            }

            // Construir la consulta SQL dinámicamente basada en si hay avatar o no
            if ($avatar !== null) {
                $query = "UPDATE registro_usuarios 
                         SET avatar = :avatar, nombre = :nombre
                         WHERE id_registro = :id";
                $params = [
                    'avatar' => $avatar,
                    'nombre' => $nombre,
                    'id' => $this->id_usuario
                ];
            } else {
                $query = "UPDATE registro_usuarios 
                         SET nombre = :nombre
                         WHERE id_registro = :id";
                $params = [
                    'nombre' => $nombre,
                    'id' => $this->id_usuario
                ];
            }
            
            $stmt = $this->pdo->prepare($query);
            $success = $stmt->execute($params);

            if ($success) {
                return [
                    'success' => true,
                    'message' => 'Perfil actualizado correctamente',
                    'data' => ['nombre' => $nombre]
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