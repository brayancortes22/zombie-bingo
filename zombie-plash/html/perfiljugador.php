<?php
include 'config.php';

$id = $_GET['id'];
$sql = "SELECT * FROM jugadores WHERE id='$id'";
$result = $conn->query($sql);
$row = $result->fetch_assoc();
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <script src="../js/cancelarLetra.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/perfilJugador.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous"/>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <title>Editar Perfil de Jugador</title>
</head>
<body>
    <div class="container-fluid">
        <div class="imagen">
            <a href="./inicio.html">
                <i class="bi bi-backspace-reverse-fill"></i>
            </a>
            <div class="cua">
                <div class="zombi1">
                    <img src="../img/perfil1.jpeg" alt="Imagen de Perfil">
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
                        <h2><strong><?php echo htmlspecialchars($row['id']); ?></strong></h2>
                    </div>
                </div>
            </div>

            <div class="row">
                <!-- Display profile pictures, update if required -->
                <?php for ($i = 0; $i < 6; $i++): ?>
                    <div class="col">
                        <img src="../img/perfil1.jpeg" alt="Imagen de Perfil Alternativa">
                    </div>
                <?php endfor; ?>
            </div>

            <div class="guardare">
                <div class="guardar">
                    <form action="actualizar_jugador.php" method="post" enctype="multipart/form-data">
                        <input type="hidden" name="id" value="<?php echo htmlspecialchars($row['id']); ?>">
                        <input type="hidden" name="imagen_actual" value="<?php echo htmlspecialchars($row['imagen']); ?>">

                        <label for="nombre">Nombre:</label>
                        <input type="text" name="nombre" value="<?php echo htmlspecialchars($row['nombre']); ?>" class="form-control"><br><br>

                        <label for="imagen">Imagen Actual:</label><br>
                        <img src="ruta/a/las/imagenes/<?php echo htmlspecialchars($row['imagen']); ?>" alt="Imagen de Perfil" width="100"><br><br>

                        <label for="imagen">Subir Nueva Imagen:</label>
                        <input type="file" name="imagen" class="form-control"><br><br>

                        <button type="submit" class="btn btn-success"><strong>Guardar</strong></button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
