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
        $candidatePasswords = array_unique([getenv('DB_PASSWORD') ?: '', '@bscl1129844804', '']);
        $lastException = null;

        foreach ($candidatePasswords as $candidate) {
            try {
                $dsn = "mysql:host=$this->servidor;port=$this->puerto;dbname=$this->baseDatos";
                $this->pdo = new PDO($dsn, $this->usuario, $candidate, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                ]);
                $this->password = $candidate;
                return $this->pdo;
            } catch (PDOException $e) {
                $lastException = $e;
            }
        }

        die('Error en la conexión: ' . ($lastException ? $lastException->getMessage() : 'Desconocido'));
    }
}
     // echo "Creando instancia de Conexion...<br>";
$conexion = new Conexion();

?>
