<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

require './PHPMailer-master/src/PHPMailer.php';
require './PHPMailer-master/src/SMTP.php';
require './PHPMailer-master/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

try {
    // Verificar si se recibió el correo
    if (!isset($_POST['email'])) {
        throw new Exception('No se recibió el correo electrónico');
    }

    $emailUsuario = $_POST['email'];

    // Generar código de verificación (6 dígitos)
    $codigoVerificacion = rand(1000, 9999); 

    // Almacenar el código en la sesión
    $_SESSION['codigo_verificacion'] = $codigoVerificacion;
    $_SESSION['email_recuperacion'] = $emailUsuario;

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
        'message' => "Error al enviar el código: {$e->getMessage()}"
    ]);
}
?>