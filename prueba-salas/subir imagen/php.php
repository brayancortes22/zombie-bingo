<?php
class Imagen {
    private $nombre;
    private $imagen;
    private $conexion;

    public function __construct($conexion) {
        $this->conexion = $conexion;
    }

    public function subirImagen($imagen) {
        $this->imagen = $imagen;
        $this->nombre = $imagen['name'];
        $this->guardarImagen();
    }

    private function guardarImagen() {
        $query = "INSERT INTO imagenes (nombre, imagen) VALUES ('$this->nombre', '$this->imagen[tmp_name]')";
        mysqli_query($this->conexion, $query);
    }

    public function getNombreImagen() {
        return $this->nombre;
    }
}
 
if ($_FILES['foto']['error'] == 0) {
    $tipoArchivo = $_FILES['foto']['type'];
    if ($tipoArchivo == 'image/jpeg' || $tipoArchivo == 'image/png') {
        $conexion = new Conexion('localhost', 'usuario', 'contraseña', 'base_de_datos');
        $imagen = new Imagen($conexion->getConexion());
        $imagen->subirImagen($_FILES['foto']);
        $nombreImagen = $imagen->getNombreImagen();
        echo "Imagen subida correctamente: $nombreImagen";
    } else {
        echo 'Solo se permiten archivos JPEG o PNG';
    }
} else {
    echo 'Error al enviar la imagen';
}