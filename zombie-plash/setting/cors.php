<?php
// Middleware centralizado de CORS y seguridad de cabeceras

$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
$allowedOrigins = [
    'https://brayancortes22.github.io',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
];

if (in_array($origin, $allowedOrigins) || $origin === '*') {
    header("Access-Control-Allow-Origin: {$origin}");
} else {
    header("Access-Control-Allow-Origin: *");
}

header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Origin, Accept");
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: SAMEORIGIN");

// Responder de inmediato a peticiones preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
