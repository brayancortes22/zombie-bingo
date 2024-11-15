<?php 
session_start();
require '../setting/conexion-base-datos.php';

class Registro {
    private $pdo;
    private $response;
    private $usuario;
    private $correo;
    private $contraseña;
    private $confirmar_contraseña;

    public function __construct() {
        $conexion = new Conexion();
        $this->pdo = $conexion->conectar();
        $this->response = ['success' => false, 'errors' => []];
    }

    private function validarEntrada() {
        if (!isset($_POST['nombre']) || !isset($_POST['correo']) || 
            !isset($_POST['contraseña']) || !isset($_POST['confirmar_contraseña'])) {
            throw new Exception('Por favor, complete todos los campos del formulario.');
        }

        $this->usuario = $_POST['nombre'];
        $this->correo = $_POST['correo'];
        $this->contraseña = $_POST['contraseña'];
        $this->confirmar_contraseña = $_POST['confirmar_contraseña'];
    }

    private function validarContraseñas() {
        if ($this->contraseña !== $this->confirmar_contraseña) {
            throw new Exception('Las contraseñas no coinciden');
        }
    }

    private function verificarUsuarioExistente() {
        $query = "SELECT nombre, correo 
                 FROM registro_usuarios 
                 WHERE nombre = :nombre OR correo = :correo";
                 
        $stmt = $this->pdo->prepare($query);
        $stmt->execute([
            ':nombre' => $this->usuario,
            ':correo' => $this->correo
        ]);
        
        $usuario_existente = $stmt->fetch();

        if ($usuario_existente) {
            $errors = [];
            if ($usuario_existente['nombre'] == $this->usuario) {
                $errors= 'El nombre de usuario ya está registrado.';
            }
            if ($usuario_existente['correo'] == $this->correo) {
                $errors = 'El correo ya está registrado.';
            }
            if (!empty($errors)) {
                throw new Exception(json_encode($errors));
            }
        }
    }

    private function registrarUsuario() {
        $hashed_password = password_hash($this->contraseña, PASSWORD_DEFAULT);
        
        $query = "INSERT INTO registro_usuarios (nombre, correo, contraseña) 
                 VALUES (:nombre, :correo, :contrasena)";
                 
        $stmt = $this->pdo->prepare($query);
        $stmt->execute([
            ':nombre' => $this->usuario,
            ':correo' => $this->correo,
            ':contrasena' => $hashed_password
        ]);

        return $stmt->rowCount() > 0;
    }

    public function procesarRegistro() {
        try {
            $this->validarEntrada();
            $this->validarContraseñas();
            $this->verificarUsuarioExistente();
            
            if ($this->registrarUsuario()) {
                $this->response['success'] = true;
            } else {
                throw new Exception('Error al crear el registro');
            }

        } catch (Exception $e) {
            $this->response['errors']['general'] = $e->getMessage();
        } finally {
            $this->pdo = null;
        }

        return $this->response;
    }
}

// Uso de la clase
header('Content-Type: application/json');

$registro = new Registro();
$resultado = $registro->procesarRegistro();
echo json_encode($resultado);