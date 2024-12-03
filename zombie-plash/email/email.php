<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

require './PHPMailer-master/src/PHPMailer.php';
require './PHPMailer-master/src/SMTP.php';
require './PHPMailer-master/src/Exception.php';
require_once '../setting/conexion-base-datos.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

try {
    // Verificar si se recibió el correo
    if (!isset($_POST['email'])) {
        throw new Exception('No se recibió el correo electrónico');
    }

    $emailUsuario = $_POST['email'];

    // Verificar si el correo existe en la base de datos
    $conexion = new Conexion();
    $pdo = $conexion->conectar();
    
    $query = "SELECT id_registro FROM registro_usuarios WHERE correo = :correo";
    $stmt = $pdo->prepare($query);
    $stmt->execute(['correo' => $emailUsuario]);
    
    if (!$stmt->fetch()) {
        throw new Exception('El correo electrónico no está registrado');
    }

    // Generar código de verificación (4 dígitos)
    $codigoVerificacion = rand(1000, 9999); 

    // Almacenar datos en la sesión
    $_SESSION['codigo_verificacion'] = $codigoVerificacion;
    $_SESSION['email_recuperacion'] = $emailUsuario;
    $_SESSION['codigo_verificado'] = false;

    // Crear instancia de PHPMailer
    $mail = new PHPMailer(true);
    
    // Configuración del servidor
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'zombieplash@gmail.com';
    $mail->Password = 'kfsa ljvg uwvo wsiw';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;
    $mail->CharSet = 'UTF-8';

    // Remitente y destinatario
    $mail->setFrom('zombieplash@gmail.com', 'Zombie Plash');
    $mail->addAddress($emailUsuario);

    // Contenido del correo
    $mail->isHTML(true);
    $mail->Subject = 'Código de Verificación - Zombie Plash';
    $mail->Body = "
        <html>
        <body style='font-family: Arial, sans-serif;'>
            <h2>Código de Verificación para Zombie Plash</h2>
            <p>Tu código de verificación es: <strong style='font-size: 24px;'>$codigoVerificacion</strong></p>
            <p>Este código expirará en 15 minutos.</p>
            <p>Si no solicitaste este código, puedes ignorar este correo.</p>
        </body>
        </html>
    ";

    // Enviar el correo
    $mail->send();
    
    echo json_encode([
        'success' => true,
        'message' => 'Código enviado correctamente'
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => "Error: {$e->getMessage()}"
    ]);
}
?>