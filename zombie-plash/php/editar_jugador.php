<?php
include '../setting/conexion-base-datos.php';

// Crear una instancia de la clase Conexion
$conexion = new Conexion();
$pdo = $conexion->conectar(); // Obtener el objeto PDO

$id = $_GET['id'];
$sql = "SELECT * FROM jugadores WHERE id = :id";
$stmt = $pdo->prepare($sql);
$stmt->bindParam(':id', $id, PDO::PARAM_INT);
$stmt->execute();
$row = $stmt->fetch();

if (!$row) {
    die('Jugador no encontrado');
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Editar Perfil de Jugador</title>
</head>
<body>
    <h2>Editar Perfil de Jugador</h2>
    <form action="actualizar_jugador.php" method="post" enctype="multipart/form-data">
        <input type="hidden" name="id" value="<?php echo htmlspecialchars($row['id']); ?>">
        <input type="hidden" name="imagen_actual" value="<?php echo htmlspecialchars($row['imagen']); ?>">

        <label for="nombre">Nombre:</label>
        <input type="text" name="nombre" value="<?php echo htmlspecialchars($row['nombre']); ?>"><br><br>

        <label for="imagen">Imagen Actual:</label>
        <img src="ruta/a/las/imagenes/<?php echo htmlspecialchars($row['imagen']); ?>" alt="Imagen de Perfil" width="100"><br><br>

        <label for="imagen">Subir Nueva Imagen:</label>
        <input type="file" name="imagen"><br><br>

        <input type="submit" value="Actualizar">
    </form>
</body>
</html>
