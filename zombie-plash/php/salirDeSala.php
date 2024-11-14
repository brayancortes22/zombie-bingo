<?php
session_start();
require '../setting/conexion-base-datos.php';

header('Content-Type: application/json');

class SalirDeSala {
    private $pdo;
    private $datos;

    public function __construct() {
        $conexion = new Conexion();
        $this->pdo = $conexion->conectar();
        $this->datos = json_decode(file_get_contents('php://input'), true);
    }

    private function validarDatos() {
        if (!isset($this->datos['id_jugador']) || !isset($this->datos['id_sala'])) {
            throw new Exception('Datos incompletos');
        }
    }

    private function eliminarJugador() {
        try {
            $this->pdo->beginTransaction();

            // Eliminar al jugador de la sala
            $queryEliminar = "DELETE FROM jugadores_en_sala 
                            WHERE id_jugador = :id_jugador 
                            AND id_sala = :id_sala";
            
            $stmt = $this->pdo->prepare($queryEliminar);
            $resultado = $stmt->execute([
                'id_jugador' => $this->datos['id_jugador'],
                'id_sala' => $this->datos['id_sala']
            ]);

            if ($resultado) {
                // Actualizar el contador de jugadores en la sala
                $queryActualizar = "UPDATE salas 
                                  SET jugadores_unidos = jugadores_unidos - 1 
                                  WHERE id_sala = :id_sala 
                                  AND jugadores_unidos > 0";
                
                $stmt = $this->pdo->prepare($queryActualizar);
                $stmt->execute(['id_sala' => $this->datos['id_sala']]);
                
                $this->pdo->commit();
                return true;
            }

            throw new Exception('No se pudo eliminar al jugador');

        } catch (Exception $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }

    public function ejecutar() {
        try {
            $this->validarDatos();
            $resultado = $this->eliminarJugador();
            return [
                'success' => $resultado,
                'message' => 'Jugador eliminado exitosamente'
            ];
        } catch (Exception $e) {
            return [
                'success' => false, 
                'message' => $e->getMessage()
            ];
        } finally {
            $this->pdo = null;
        }
    }
}

$salir = new SalirDeSala();
echo json_encode($salir->ejecutar()); 