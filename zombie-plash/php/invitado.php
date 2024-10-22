<?php
session_start();
include_once ('../setting/conexion-base-datos.php'); 

header('Content-Type: application/json');

$response = ['success' => false, 'errors' => []];

if (isset($_POST['apodo'])) {
    
    $apodo = $_POST['apodo'];

    // Verifica si el apodo ya existe en la base de datos
    $checkQuery = "SELECT * FROM invitados WHERE apodo = ?"; 
    $stmt = $conn->prepare($checkQuery);
    $stmt->bind_param("s", $apodo); // Evita inyecciones SQL 
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) { 
        $response['errors']['apodo'] = 'El apodo ya está registrado.';
    } else {

        // El apodo no existe, procede a insertar en la base de datos
        $insertQuery = "INSERT INTO invitados(apodo) VALUES (?)";
        $stmt = $conn->prepare($insertQuery);
        $stmt->bind_param("s", $apodo); 
        if ($stmt->execute()) {
            $response['success'] = true;
            $_SESSION['apodo'] = $apodo;
        } else {
            $response['errors']['general'] = 'Error al crear el registro: ' . $conn->error;
        }
    }
    $stmt->close();
    $conn->close();

} else {
    $response['errors']['general'] = 'Por favor, complete todos los campos del formulario.';
}
echo json_encode($response);

?>