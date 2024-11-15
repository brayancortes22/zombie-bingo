<?php
//include '../../setting/conexion-base-datos.php';
include('../setting/conexion-base-datos.php');
// Comprobar si el ID está en la URL
if (!isset($_GET['id'])) {
    die("ID de jugador no proporcionado.");
}

$id = $_GET['id'];

// Crear instancia de la clase Conexion
$conexion = new Conexion();
$pdo = $conexion->conectar(); // Obtener el objeto PDO

// Obtener los datos del jugador
$sql = "SELECT * FROM registro_usuarios WHERE id = :id_registro";
$stmt = $pdo->prepare($sql);
$stmt->bindParam(':id', $id, PDO::PARAM_INT);
$stmt->execute();
$row = $stmt->fetch();

if (!$row) {
    die("Jugador no encontrado.");
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Editar Perfil de Jugador</title>
    <script src="../js/cancelarLetra.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/perfilJugador.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
</head>
<body>
    <div class="container-fluid">
        <div class="imagen">
            <a href="./inicio.html">
                <i class="bi bi-backspace-reverse-fill"></i>
            </a>
            <div class="cua">
                <div class="zombi1">
                    <!-- Mostrar la imagen actual del perfil del jugador -->
                    <img id="mainImage" src="../img/<?php echo htmlspecialchars($row['imagen']); ?>" alt="Imagen de perfil">
                </div>
                <div class="zombie-1">
                    <h1><strong><?php echo htmlspecialchars($row['nombre']); ?></strong></h1>
                </div>
            </div>
            <div class="cuadro">
                <div class="largo">
                    <div class="nombre">
                        <h2><strong>Nombre: </strong></h2>
                    </div>
                    <div class="zo">
                        <h2><strong><?php echo htmlspecialchars($row['nombre']); ?></strong></h2>
                    </div>
                </div><br><br>
                <div class="largo">
                    <div class="nombre">
                        <h2><strong>ID: </strong></h2>
                    </div>
                    <div class="zo">
                        <h2><strong><?php echo htmlspecialchars($row['id_registro']); ?></strong></h2>
                    </div>
                </div>
            </div>
            
            <!-- Imágenes de selección para cambiar el perfil -->
            <div class="row">
                <div class="col">
                    <img src="../img/perfilJugador1.jpeg" alt="Imagen 1" onclick="replaceImage(this)">
                </div>
                <div class="col">
                    <img src="../img/perfilJugador2.jpeg" alt="Imagen 2" onclick="replaceImage(this)">
                </div>
                <div class="col">
                    <img src="../img/perfilJugador3.jpeg" alt="Imagen 3" onclick="replaceImage(this)">
                </div>
                <!-- Puedes agregar más imágenes según sea necesario -->
            </div>

            <!-- Botón para guardar la imagen seleccionada -->
            <form action="../php/actualizar_jugador.php" method="post">
                <input type="hidden" name="id" value="<?php echo htmlspecialchars($row['id']); ?>">
                <input type="hidden" id="imagenSeleccionada" name="imagen" value="<?php echo htmlspecialchars($row['imagen']); ?>">
                <div class="guardare">
                    <div class="guardar">
                        <button type="submit" class="btn btn-success"><strong>Guardar</strong></button>
                    </div>
                </div>
            </form>
        </div>
    </div>
    
    <script>
        // Cambiar la imagen principal al hacer clic en otra imagen
        function replaceImage(imgElement) {
            var mainImage = document.getElementById('mainImage');
            mainImage.src = imgElement.src;
            document.getElementById('imagenSeleccionada').value = imgElement.src; // Actualizar la imagen seleccionada en el formulario
        }
    </script>
</body>
</html>
