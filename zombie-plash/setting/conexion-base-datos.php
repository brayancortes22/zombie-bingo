<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// echo "Iniciando script...<br>";

class Conexion{
    private $servidor;
    private $usuario;
    private $password;
    private $puerto;
    private $baseDatos;
    private $pdo;

    public function __construct(){
        //echo "Construyendo objeto...<br>";
        $this->servidor="localhost";
        $this->usuario="root";
        $this->password="";
        $this->puerto="3306";
        $this->baseDatos="zombie_plash_bd";
        $this->pdo=$this->conectar();
    }

    public function conectar(){
        try {
            // echo "Intentando conectar...<br>";
            $dsn = "mysql:host=$this->servidor;port=$this->puerto;dbname=$this->baseDatos";
            
            // echo "DSN: " . $dsn . "<br>";
            
            $this->pdo = new PDO($dsn, $this->usuario, $this->password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]);
            
            // echo "Conexión exitosa a MySQL<br>";
            
        } catch (PDOException $e) {
            // echo "Error capturado: " . $e->getMessage() . "<br>";
            die('Error en la conexión: ' . $e->getMessage());
        }

        return $this->pdo;
    }
}
     // echo "Creando instancia de Conexion...<br>";
$conexion = new Conexion();

?>
