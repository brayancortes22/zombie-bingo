<?php
class Conexion {
    private $host = 'localhost';
    private $db = 'zombie_plash_bd';
    private $usuario = 'root';  // Asumiendo que es el usuario por defecto de XAMPP
    private $password = '';     // Contraseña vacía por defecto en XAMPP
    private $charset = 'utf8mb4';
    
    public function conectar() {
        try {
            $dsn = "mysql:host={$this->host};dbname={$this->db};charset={$this->charset}";
            $opciones = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];

            $conexion = new PDO($dsn, $this->usuario, $this->password, $opciones);
            return $conexion;
        } catch (PDOException $e) {
            error_log("Error de conexión a la base de datos: " . $e->getMessage());
            throw new Exception("Error de conexión a la base de datos");
        }
    }
}
?> 