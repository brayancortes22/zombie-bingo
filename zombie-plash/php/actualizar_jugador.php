<?php
include '../setting/conexion-base-datos.php';

// Crear una instancia de la clase Conexion
$conexion = new Conexion();
$pdo = $conexion->conectar(); // Obtener el objeto PDO

$id = $_POST['id_registro'];
$nombre = $_POST['nombre'];
$imagen_actual = $_POST['imagen_actual'];

if ($_FILES['imagen']['name']) {
    $target_dir = "../img/";
    $imagen = basename($_FILES["imagen"]["name"]);
    $target_file = $target_dir . $imagen;
    $uploadOk = 1;
    $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

    // Verificar si el archivo es una imagen real
    $check = getimagesize($_FILES["imagen"]["tmp_name"]);
    if ($check !== false) {
        $uploadOk = 1;
    } else {
        echo "El archivo no es una imagen.";
        $uploadOk = 0;
    }

    // Verificar si el archivo ya existe
    if (file_exists($target_file)) {
        echo "Lo siento, el archivo ya existe.";
        $uploadOk = 0;
    }

    // Verificar el tamaño del archivo
    if ($_FILES["imagen"]["size"] > 500000) {
        echo "Lo siento, tu archivo es demasiado grande.";
        $uploadOk = 0;
    }

    // Permitir ciertos formatos de archivo
    if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg") {
        echo "Lo siento, solo se permiten archivos JPG, JPEG y PNG.";
        $uploadOk = 0;
    }

    // Si todo está bien, intentar subir el archivo
    if ($uploadOk == 1) {
        if (move_uploaded_file($_FILES["imagen"]["tmp_name"], $target_file)) {
            echo "El archivo ". htmlspecialchars($imagen). " ha sido subido.";
            // Eliminar la imagen anterior si existe
            if (file_exists($target_dir . $imagen_actual)) {
                unlink($target_dir . $imagen_actual);
            }
        } else {
            echo "Lo siento, hubo un error al subir tu archivo.";
        }
    }
} else {
    $imagen = $imagen_actual; // Si no se sube una nueva imagen, mantener la actual
}

// Actualizar la base de datos con PDO
$sql = "UPDATE registro_usuarios SET nombre = :nombre, imagen = :imagen WHERE id = :id";
$stmt = $pdo->prepare($sql);
$stmt->bindParam(':nombre', $nombre);
$stmt->bindParam(':imagen', $imagen);
$stmt->bindParam(':id', $id, PDO::PARAM_INT);

if ($stmt->execute()) {
    // Redirige a la página principal después de actualizar
    header("Location: inicio.php");
    echo "Perfil actualizado exitosamente";
    exit();
} else {
    echo "Error al actualizar la base de datos.";
}

?>
