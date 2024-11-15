<?php
include 'pregunta.php';

$num_cartones = $_POST['num_cartones'];
$figura = $_POST['figura'];

// Asumiendo que el jugador está logueado y su ID es 1
$jugador_id = 1;

$sql = "INSERT INTO partidas (jugador_id, num_cartones, figura, estado) VALUES ('$jugador_id', '$num_cartones', '$figura', 'en curso')";
if ($conn->query($sql) === TRUE) {
    $partida_id = $conn->insert_id;

    // Crear los cartones
    for ($i = 0; $i < $num_cartones; $i++) {
        $numeros = json_encode(array_rand(range(1, 75), 24)); // Ejemplo de generación de números
        $sql_carton = "INSERT INTO cartones (partida_id, jugador_id, numeros) VALUES ('$partida_id', '$jugador_id', '$numeros')";
        $conn->query($sql_carton);
    }

    header("Location: partida.php?partida_id=$partida_id");
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>