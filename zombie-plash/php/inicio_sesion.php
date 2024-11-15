<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ob_start();

header('Content-Type: application/json; charset=utf-8');
session_start();
require '../setting/conexion-base-datos.php';
class LoginUsuario {
    // Propiedades privadas
    private $pdo;           // Objeto de conexión a base de datos
    private $response;      // Respuesta que se enviará al cliente

    // Constructor: se ejecuta al crear una instancia de la clase
    public function __construct() {
        $conexion = new Conexion();
        $this->pdo = $conexion->conectar();
        // Inicializa la respuesta con valores por defecto
        $this->response = [
            'success' => false,    // Éxito de la operación
            'errors' => [],        // Array para almacenar errores
            'debug' => []          // Información de depuración
        ];
    }

    // Valida que la petición sea POST
    public function validarRequest() {
        // Guarda información de debug
        $this->response['debug']['request_method'] = $_SERVER['REQUEST_METHOD'];
        $this->response['debug']['post_data'] = $_POST;

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception('Método no permitido');
        }
    }

    // Valida que los campos no estén vacíos
    public function validarCredenciales($nombre_o_correo, $contrasena) {
        if (empty($nombre_o_correo) || empty($contrasena)) {
            throw new Exception('Nombre de usuario/correo y contraseña son requeridos');
        }
    }

    // Busca el usuario en la base de datos
    public function buscarUsuario($nombre_o_correo) {
        // Consulta SQL para buscar usuario por nombre o correo
        $sql = "SELECT id_registro, nombre, correo, contraseña 
                FROM registro_usuarios 
                WHERE nombre = :usuario OR correo = :usuario";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':usuario' => $nombre_o_correo]);
        return $stmt->fetch();
    }

    // Verifica si la contraseña coincide con el hash almacenado
    public function verificarContrasena($contrasena, $hash) {
        return password_verify($contrasena, $hash);
    }

    // Método principal que maneja todo el proceso de login
    public function iniciarSesion() {
        try {
            // Valida el método de la petición
            $this->validarRequest();

            // Obtiene datos del formulario
            $nombre_o_correo = $_POST['nombre'] ?? '';
            $contrasena = $_POST['contraseña'] ?? '';

            // Valida que los campos no estén vacíos
            $this->validarCredenciales($nombre_o_correo, $contrasena);
            
            // Busca el usuario
            $usuario = $this->buscarUsuario($nombre_o_correo);
            
            // Verifica si el usuario existe
            if (!$usuario) {
                throw new Exception('Usuario no encontrado');
            }

            // Verifica la contraseña
            if (!$this->verificarContrasena($contrasena, $usuario['contraseña'])) {
                throw new Exception('Contraseña incorrecta');
            }

            // Guarda datos en la sesión
            $_SESSION['id_usuario'] = $usuario['id_registro'];
            $_SESSION['nombre_usuario'] = $usuario['nombre'];

            // Prepara la respuesta exitosa
            $this->response['success'] = true;
            $this->response['message'] = 'Inicio de sesión exitoso';
            $this->response['session_info'] = [
                'id_usuario' => $_SESSION['id_usuario'],
                'nombre_usuario' => $_SESSION['nombre_usuario']
            ];

            // Guarda la sesión
            session_write_close();

        } catch (Exception $e) {
            // Captura cualquier error
            $this->response['errors']['general'] = $e->getMessage();
        } finally {
            // Cierra la conexión a la base de datos
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
