<?php
include 'config.php';
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Iniciar Partida de Bingo</title>
</head>
<body>
    <h2>Iniciar Partida de Bingo</h2>
    <form action="iniciar_partida.php" method="post">
        <label for="num_cartones">Número de Cartones:</label>
        <input type="number" name="num_cartones" min="1" required><br><br>

        <label for="figura">Figura Deseada:</label>
        <select name="figura">
            <option value="linea">Línea</option>
            <option value="cuadro">Cuadro</option>
            <option value="esquina">Esquina</option>
        </select><br><br>

        <input type="submit" value="Iniciar Partida">
    </form>
</body>
</html>