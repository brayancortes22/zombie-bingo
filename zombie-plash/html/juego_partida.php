<?php
include 'pregunta.php';

$partida_id = $_GET['partida_id'];
$sql = "SELECT * FROM partidas WHERE id='$partida_id'";
$result = $conn->query($sql);
$partida = $result->fetch_assoc();

// Obtener los cartones del jugador
$sql_cartones = "SELECT * FROM cartones WHERE partida_id='$partida_id'";
$result_cartones = $conn->query($sql_cartones);

?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Partida de Bingo</title>
</head>
<body>
    <h2>Partida de Bingo</h2>
    
    <h3>Cartones</h3>
    <?php while ($carton = $result_cartones->fetch_assoc()): ?>
        <div>
            <h4>Cartón <?php echo $carton['id']; ?></h4>
            <p><?php echo implode(", ", json_decode($carton['numeros'])); ?></p>
        </div>
    <?php endwhile; ?>
    
    <h3>Acciones</h3>
    <form action="realizar_accion.php" method="post">
        <input type="hidden" name="partida_id" value="<?php echo $partida_id; ?>">
        
        <label for="accion">Elige una acción:</label>
        <select name="accion">
            <option value="humo">Mostrar Humo</option>
            <option value="completar">Completar Números</option>
            <option value="eliminar">Eliminar Números</option>
        </select><br><br>
        
        <input type="submit" value="Realizar Acción">
    </form>
    
    <h3>Números Generados</h3>
    <div id="numeros_generados"></div>
    
    <script>
        // Generar números aleatorios y mostrarlos lentamente
        let numerosGenerados = [];
        setInterval(function() {
            if (numerosGenerados.length < 75) {
                let nuevoNumero = Math.floor(Math.random() * 75) + 1;
                if (!numerosGenerados.includes(nuevoNumero)) {
                    numerosGenerados.push(nuevoNumero);
                    document.getElementById('numeros_generados').innerHTML += nuevoNumero + " ";
                }
            }
        }, 3000); // Cambia el tiempo según lo necesites
    </script>
</body>
</html>
Procesar Acciones
Crear un archivo realizar_accion.php para manejar las acciones seleccionadas.
php
<?php
include 'config.php';

$partida_id = $_POST['partida_id'];
$accion = $_POST['accion'];

// Lógica de las acciones (puedes expandir esto según lo necesites)
if ($accion == 'humo') {
    // Mostrar humo (puedes agregar lógica específica aquí)
    echo "Humo mostrado a todos los jugadores.";
} elseif ($accion == 'completar') {
    // Completar números en el cartón del jugador (lógica de ejemplo)
    echo "Números completados en tu cartón.";
} elseif ($accion == 'eliminar') {
    // Eliminar números del cartón del jugador (lógica de ejemplo)
    echo "Números eliminados de tu cartón.";
}

$conn->close();
?>