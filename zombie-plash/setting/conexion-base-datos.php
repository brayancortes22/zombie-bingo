<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';

class Conexion {
    private $servidor;
    private $usuario;
    private $password;
    private $puerto;
    private $baseDatos;
    private $pdo;

    public function __construct() {
        $dbUrl = getenv('DATABASE_URL') ?: getenv('MYSQL_URL');

        if ($dbUrl) {
            $parsed = parse_url($dbUrl);
            $this->servidor  = $parsed['host'] ?? 'localhost';
            $this->puerto    = $parsed['port'] ?? 3306;
            $this->usuario   = $parsed['user'] ?? 'root';
            $this->password  = $parsed['pass'] ?? '';
            $this->baseDatos = ltrim($parsed['path'] ?? 'zombie_plash_bd', '/');
        } else {
            $this->servidor  = getenv('DB_HOST') ?: 'localhost';
            $this->puerto    = getenv('DB_PORT') ?: '3306';
            $this->usuario   = getenv('DB_USER') ?: 'root';
            $this->password  = getenv('DB_PASSWORD') !== false ? getenv('DB_PASSWORD') : '';
            $this->baseDatos = getenv('DB_NAME') ?: 'zombie_plash_bd';
        }

        $this->pdo = $this->conectar();
    }

    public function conectar() {
        try {
            $dsn = "mysql:host={$this->servidor};port={$this->puerto};dbname={$this->baseDatos};charset=utf8mb4";
            $this->pdo = new PDO($dsn, $this->usuario, $this->password, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
            return $this->pdo;
        } catch (PDOException $e) {
            // Error amigable sin exponer credenciales
            http_response_code(500);
            header('Content-Type: application/json');
            die(json_encode([
                'success' => false,
                'message' => 'Error de conexión a la base de datos',
                'error'   => $e->getMessage(),
            ]));
        }
    }

    public function getPdo() {
        return $this->pdo;
    }
}

$conexion = new Conexion();
$pdo = $conexion->getPdo();
