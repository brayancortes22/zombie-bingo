<?php
session_start();
require_once '../setting/conexion-base-datos.php';

class ListaJugadores {
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

    public function obtenerJugadores() {
        try {
            $query = "SELECT id_registro, nombre, avatar FROM registro_usuarios WHERE id_registro != :id_usuario";
            $stmt = $this->pdo->prepare($query);
            $stmt->execute(['id_usuario' => $this->id_usuario]);
            
            $jugadores = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Modificar la ruta de las imágenes
            foreach ($jugadores as &$jugador) {
                if ($jugador['avatar']) {
                    $rutaImagen = '../uploads/avatars/' . $jugador['avatar'];
                    if (file_exists($rutaImagen)) {
                        $jugador['avatar'] = base64_encode(file_get_contents($rutaImagen));
                    } else {
                        // Si no existe la imagen en uploads, buscar en img
                        $rutaImagenDefault = '../img/' . $jugador['avatar'];
                        if (file_exists($rutaImagenDefault)) {
                            $jugador['avatar'] = base64_encode(file_get_contents($rutaImagenDefault));
                        }
                    }
                }
            }
            
            return [
                'success' => true,
                'jugadores' => $jugadores
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    public function buscarJugador($id_jugador) {
        try {
            $query = "SELECT id_registro, nombre, avatar FROM registro_usuarios WHERE id_registro = :id_jugador";
            $stmt = $this->pdo->prepare($query);
            $stmt->execute(['id_jugador' => $id_jugador]);
            $jugador = $stmt->fetch(PDO::FETCH_ASSOC);
    
            if ($jugador) {
                // Verificar y procesar el avatar
                if ($jugador['avatar']) {
                    $rutaImagen = '../uploads/avatars/' . $jugador['avatar'];
                    if (file_exists($rutaImagen)) {
                        $jugador['avatar'] = base64_encode(file_get_contents($rutaImagen));
                    } else {
                        $rutaImagenDefault = '../img/' . $jugador['avatar'];
                        if (file_exists($rutaImagenDefault)) {
                            $jugador['avatar'] = base64_encode(file_get_contents($rutaImagenDefault));
                        } else {
                            // Si no existe la imagen, usa un avatar predeterminado
                            $jugador['avatar'] = base64_encode(file_get_contents('../img/perfil1.png'));
                        }
                    }
                } else {
                    // Asignar un avatar predeterminado si no hay imagen asociada
                    $jugador['avatar'] = base64_encode(file_get_contents('../img/perfil1.png'));
                }
            }
    
            return [
                'success' => true,
                'jugador' => $jugador
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
    

    public function agregarAmigo($id_amigo) {
        try {
            if (!$this->id_usuario) {
                throw new Exception('Usuario no autenticado');
            }
    
            // Verificar si ya son amigos
            $query = "SELECT * FROM amistad WHERE 
                    (id_jugador = :id_usuario AND id_amigo = :id_amigo) OR 
                    (id_jugador = :id_amigo AND id_amigo = :id_usuario)";
            $stmt = $this->pdo->prepare($query);
            $stmt->execute([
                'id_usuario' => $this->id_usuario,
                'id_amigo' => $id_amigo
            ]);
    
            if ($stmt->rowCount() > 0) {
                return [
                    'success' => false,
                    'message' => 'Ya son amigos'
                ];
            }
    
            // Agregar nueva amistad
            $query = "INSERT INTO amistad (id_jugador, id_amigo) VALUES (:id_usuario, :id_amigo)";
            $stmt = $this->pdo->prepare($query);
            $stmt->execute([
                'id_usuario' => $this->id_usuario,
                'id_amigo' => $id_amigo
            ]);
    
            return [
                'success' => true,
                'message' => 'Amigo agregado correctamente'
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
}

// Manejo de peticiones
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $listaJugadores = new ListaJugadores();
    
    if (isset($_GET['action'])) {
        switch ($_GET['action']) {
            case 'obtener':
                $response = $listaJugadores->obtenerJugadores();
                break;
            case 'buscar':
                $id_jugador = $_GET['id_jugador'] ?? null;
                $response = $listaJugadores->buscarJugador($id_jugador);
                break;
            default:
                $response = ['success' => false, 'message' => 'Acción no válida'];
        }
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $listaJugadores = new ListaJugadores();
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (isset($data['action']) && $data['action'] === 'agregar_amigo') {
        $response = $listaJugadores->agregarAmigo($data['id_amigo']);
    } else {
        $response = ['success' => false, 'message' => 'Acción no válida'];
    }
}

header('Content-Type: application/json');
echo json_encode($response); 