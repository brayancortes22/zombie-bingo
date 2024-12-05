<?php
session_start();
require '../../setting/conexion-base-datos.php';

class UnirseASala {
    private $pdo;
    private $response;
    private $id_sala;
    private $contraseña;
    private $id_usuario;
    private $nombre_usuario;
    private $id_jugador;
    private $sala_info;

    public function __construct() {
        $conexion = new Conexion();
        $this->pdo = $conexion->conectar();
        $this->response = ['success' => false, 'message' => ''];
        
        $this->id_usuario = $_SESSION['id_usuario'] ?? null;
        $this->nombre_usuario = $_SESSION['nombre_usuario'] ?? null;
        $this->id_sala = $_POST['idSala'] ?? 0;
        $this->contraseña = $_POST['contraseñaSala'] ?? '';
    }

    private function validarSesion() {
        if (!$this->id_usuario) {
            throw new Exception('Usuario no autenticado.');
        }
    }

    private function obtenerOCrearJugador() {
        $query = "SELECT id_jugador FROM jugador WHERE id_registro = :id_registro";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute(['id_registro' => $this->id_usuario]);
        $result = $stmt->fetch();

        if (!$result) {
            $insert = "INSERT INTO jugador (id_registro, nombre) VALUES (:id_registro, :nombre)";
            $stmt = $this->pdo->prepare($insert);
            $stmt->execute([
                'id_registro' => $this->id_usuario,
                'nombre' => $this->nombre_usuario
            ]);
            $this->id_jugador = $this->pdo->lastInsertId();
        } else {
            $this->id_jugador = $result['id_jugador'];
        }
    }

    private function verificarSala() {
        $query = "SELECT * FROM salas WHERE id_sala = :id_sala";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute(['id_sala' => $this->id_sala]);
        $this->sala_info = $stmt->fetch();

        if (!$this->sala_info) {
            throw new Exception('La sala no existe.');
        }

        if ($this->sala_info['jugadores_unidos'] >= $this->sala_info['max_jugadores']) {
            throw new Exception('La sala está llena.');
        }

        if (!password_verify($this->contraseña, $this->sala_info['contraseña'])) {
            throw new Exception('Contraseña incorrecta.');
        }
    }

    private function verificarJugadorEnSala() {
        $query = "SELECT * FROM jugadores_en_sala WHERE id_sala = :id_sala AND id_jugador = :id_jugador";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute([
            'id_sala' => $this->id_sala,
            'id_jugador' => $this->id_jugador
        ]);
        $result = $stmt->fetch();

        if ($result) {
            throw new Exception('Ya estás en esta sala.' );
        }
    }

    public function unirse() {
        try {
            $this->validarSesion();
            $this->obtenerOCrearJugador();
            $this->verificarSala();
            $this->verificarJugadorEnSala();

            $insert = "INSERT INTO jugadores_en_sala (id_sala, id_jugador, nombre_jugador, rol) 
                      VALUES (:id_sala, :id_jugador, :nombre, 'participante')";
            $stmt = $this->pdo->prepare($insert);
            $stmt->execute([
                'id_sala' => $this->id_sala,
                'id_jugador' => $this->id_jugador,
                'nombre' => $this->nombre_usuario
            ]);

            $update = "UPDATE salas SET jugadores_unidos = jugadores_unidos + 1 WHERE id_sala = :id_sala";
            $stmt = $this->pdo->prepare($update);
            $stmt->execute([
                'id_sala' => $this->id_sala
            ]);

            $this->response = [
                'success' => true,
                'message' => 'Te has unido a la sala con éxito.',
                'id_sala' => $this->id_sala,
                'id_jugador' => $this->id_jugador,
                'nombre_jugador' => $this->nombre_usuario,
                'contraseña_sala' => $this->contraseña,
                'jugadores_conectados' => $this->sala_info['jugadores_unidos'] + 1,
                'max_jugadores' => $this->sala_info['max_jugadores'],
                'rol' => 'participante'
            ];
        } catch (Exception $e) {
            $this->response = ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function getResponse() {
        return json_encode($this->response);
    }
}

$unirse = new UnirseASala();
$unirse->unirse();
echo $unirse->getResponse();