<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ob_start();

header('Content-Type: application/json; charset=utf-8');
session_start();
require '../setting/conexion-base-datos.php';

class LoginUsuario {
    private $pdo;
    private $response;

    public function __construct() {
        $conexion = new Conexion();
        $this->pdo = $conexion->conectar();
        $this->response = ['success' => false, 'errors' => [], 'debug' => []];
    }

    public function validarRequest() {
        $this->response['debug']['request_method'] = $_SERVER['REQUEST_METHOD'];
        $this->response['debug']['post_data'] = $_POST;

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception('Método no permitido');
        }
    }

    public function validarCredenciales($nombre_o_correo, $contrasena) {
        if (empty($nombre_o_correo) || empty($contrasena)) {
            throw new Exception('Nombre de usuario/correo y contraseña son requeridos');
        }
    }

    public function buscarUsuario($nombre_o_correo) {
        $sql = "SELECT id_registro, nombre, correo, contraseña 
                FROM registro_usuarios 
                WHERE nombre = :usuario OR correo = :usuario";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':usuario' => $nombre_o_correo]);
        return $stmt->fetch();
    }

    public function verificarContrasena($contrasena, $hash) {
        return password_verify($contrasena, $hash);
    }

    public function iniciarSesion() {
        try {
            $this->validarRequest();

            $nombre_o_correo = $_POST['nombre'] ?? '';
            $contrasena = $_POST['contraseña'] ?? '';

            $this->validarCredenciales($nombre_o_correo, $contrasena);
            
            $usuario = $this->buscarUsuario($nombre_o_correo);
            
            if (!$usuario) {
                throw new Exception('Usuario no encontrado');
            }

            if (!$this->verificarContrasena($contrasena, $usuario['contraseña'])) {
                throw new Exception('Contraseña incorrecta');
            }

            $_SESSION['id_usuario'] = $usuario['id_registro'];
            $_SESSION['nombre_usuario'] = $usuario['nombre'];

            $this->response['success'] = true;
            $this->response['message'] = 'Inicio de sesión exitoso';
            $this->response['session_info'] = [
                'id_usuario' => $_SESSION['id_usuario'],
                'nombre_usuario' => $_SESSION['nombre_usuario']
            ];

            session_write_close();

        } catch (Exception $e) {
            $this->response['errors']['general'] = $e->getMessage();
        } finally {
            $this->pdo = null;
        }

        return $this->response;
    }
}

// Uso de la clase
$login = new LoginUsuario();
$resultado = $login->iniciarSesion();

ob_end_clean();
echo json_encode($resultado);
exit;
