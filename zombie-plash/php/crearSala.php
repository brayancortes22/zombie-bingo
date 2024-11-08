<?php
ob_start(); // Iniciar buffer de salida
header('Content-Type: application/json; charset=utf-8');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
require '../setting/conexion-base-datos.php';

class CrearSala {
    private $pdo;
    private $response;
    private $id_usuario;
    private $nombre_usuario;
    private $contrasena;
    private $num_jugadores;
    private $id_jugador;
    private $id_sala;

    public function __construct() {
        try {
            $conexion = new Conexion();
            $this->pdo = $conexion->conectar();
            $this->response = ['success' => false, 'message' => ''];
            $this->id_usuario = $_SESSION['id_usuario'] ?? null;
            $this->nombre_usuario = $_SESSION['nombre_usuario'] ?? null;
        } catch (Exception $e) {
            $this->response = [
                'success' => false,
                'message' => 'Error de conexión: ' . $e->getMessage()
            ];
        }
    }

    private function validarEntrada() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception('Método no permitido');
        }

        if (!$this->id_usuario || !$this->nombre_usuario) {
            throw new Exception('Usuario no autenticado o sesión expirada');
        }

        $this->contrasena = $_POST['contraseñaSala'] ?? '';
        $this->num_jugadores = intval($_POST['maxJugadores'] ?? 0);

        if (empty($this->contrasena) || $this->num_jugadores < 2 || $this->num_jugadores > 4) {
            throw new Exception('Datos de entrada inválidos');
        }
    }

    private function obtenerOCrearJugador() {
        $query = "SELECT id_jugador FROM jugador WHERE id_registro = :id_registro";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute(['id_registro' => $this->id_usuario]);
        $result = $stmt->fetch();

        if (!$result) {
            $insert_query = "INSERT INTO jugador (id_registro, nombre) VALUES (:id_registro, :nombre)";
            $stmt = $this->pdo->prepare($insert_query);
            $stmt->execute([
                'id_registro' => $this->id_usuario,
                'nombre' => $this->nombre_usuario
            ]);
            $this->id_jugador = $this->pdo->lastInsertId();
        } else {
            $this->id_jugador = $result['id_jugador'];
        }
    }

    private function crearSala() {
        $contrasena_hash = password_hash($this->contrasena, PASSWORD_DEFAULT);
        
        $query = "INSERT INTO salas (id_creador, contraseña, max_jugadores, jugadores_unidos) 
                 VALUES (:id_jugador, :contrasena, :max_jugadores, 1)";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute([
            'id_jugador' => $this->id_jugador,
            'contrasena' => $contrasena_hash,
            'max_jugadores' => $this->num_jugadores
        ]);

        $this->id_sala = $this->pdo->lastInsertId();
    }

    private function agregarJugadorASala() {
        $query = "INSERT INTO jugadores_en_sala (id_sala, id_jugador, nombre_jugador) 
                 VALUES (:id_sala, :id_jugador, :nombre_jugador)";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute([
            'id_sala' => $this->id_sala,
            'id_jugador' => $this->id_jugador,
            'nombre_jugador' => $this->nombre_usuario
        ]);
    }

    private function prepararRespuesta() {
        $this->response = [
            'success' => true,
            'id_sala' => $this->id_sala,
            'nombre_jugador' => $this->nombre_usuario,
            'contraseña_sala' => $this->contrasena,
            'max_jugadores' => $this->num_jugadores,
            'jugadores_conectados' => 1
        ];

        $_SESSION['datosSala'] = $this->response;
    }

    public function crearNuevaSala() {
        try {
            $this->validarEntrada();
            
            $this->pdo->beginTransaction();
            
            $this->obtenerOCrearJugador();
            $this->crearSala();
            $this->agregarJugadorASala();
            $this->prepararRespuesta();
            
            $this->pdo->commit();

        } catch (Exception $e) {
            if ($this->pdo && $this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }
            $this->response = [
                'success' => false,
                'message' => $e->getMessage(),
                'debug' => [
                    'post_data' => $_POST,
                    'session_data' => [
                        'id_usuario' => $this->id_usuario,
                        'nombre_usuario' => $this->nombre_usuario
                    ]
                ]
            ];
        }

        return $this->response;
    }
}

// Limpiar cualquier salida previa
ob_clean();

try {
    $creadorSala = new CrearSala();
    $resultado = $creadorSala->crearNuevaSala();
} catch (Exception $e) {
    $resultado = [
        'success' => false,
        'message' => 'Error del sistema: ' . $e->getMessage()
    ];
}

echo json_encode($resultado);
exit;
