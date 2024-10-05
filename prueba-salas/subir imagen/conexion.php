<?php
class Conexion {
    private $conexion;

    public function __construct($host, $usuario, $contraseña, $baseDeDatos) {
        $this->conexion = mysqli_connect($host, $usuario, $contraseña, $baseDeDatos);
        if (!$this->conexion) {
            die('Error de conexión: ' . mysqli_connect_error());
        }
    }

    public function getConexion() {
        return $this->conexion;
    }
}