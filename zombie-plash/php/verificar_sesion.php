<?php
session_start();
header('Content-Type: application/json');

echo json_encode([
    'autenticado' => isset($_SESSION['id_usuario']),
    'id_usuario' => $_SESSION['id_usuario'] ?? null
]);
?>
