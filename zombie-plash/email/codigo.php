<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Activar reporte de errores
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Iniciar buffer de salida
ob_start();

header('Content-Type: application/json');

try {
    // Verificar que el archivo autoload existe
    $autoloadPath = '../vendor/autoload.php';
    if (!file_exists($autoloadPath)) {
        throw new Exception('No se encuentra el archivo autoload.php');
    }
    require $autoloadPath;
    require_once('config.php');

    // Verificar la entrada JSON
    $jsonInput = file_get_contents('php://input');
    if (!$jsonInput) {
        throw new Exception('No se recibieron datos');
    }

    $input = json_decode($jsonInput, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Error al decodificar JSON: ' . json_last_error_msg());
    }

    $email = isset($input['email']) ? $input['email'] : null;
    if (!$email) {
        throw new Exception('Email no proporcionado');
    }

    // Verificar credenciales
    if (!defined('EMAIL_USERNAME') || !defined('EMAIL_PASSWORD')) {
        throw new Exception('Credenciales de correo no configuradas');
    }

    $mail = new PHPMailer(true);

    // Habilitar debug
    $mail->SMTPDebug = SMTP::DEBUG_SERVER;
    $mail->Debugoutput = function($str, $level) {
        error_log("PHPMailer Debug: $str");
    };

    // Configuración del servidor
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = EMAIL_USERNAME;
    $mail->Password = EMAIL_PASSWORD;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;
    $mail->CharSet = 'UTF-8';
    $mail->Timeout = 30;

    // Configuración adicional de seguridad
    $mail->SMTPOptions = array(
        'ssl' => array(
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true
        )
    );

    // Resto del código para enviar el correo...
    $mail->setFrom(EMAIL_USERNAME, 'Zombie Plash');
    $mail->addAddress($email);
    $mail->isHTML(true);
    $mail->Subject = 'Código de Verificación - Zombie Plash';

    // Generar código
    $codigo = sprintf("%04d", rand(0, 9999));

    $htmlMessage = "
        <html>
        <body style='font-family: Arial, sans-serif;'>
            <div style='text-align: center;'>
                <h2>Código de Verificación</h2>
                <p>Tu código de verificación es:</p>
                <h1 style='color: #4CAF50; font-size: 36px;'>{$codigo}</h1>
                <p>Este código expirará en 10 minutos.</p>
            </div>
        </body>
        </html>
    ";

    $mail->Body = $htmlMessage;
    $mail->AltBody = "Tu código de verificación es: {$codigo}";

    if ($mail->send()) {
        $_SESSION['codigo_verificacion'] = $codigo;
        $_SESSION['email_recuperacion'] = $email;
        
        echo json_encode([
            'success' => true,
            'message' => 'Código enviado correctamente',
            'redirect' => 'codigoDeVerificacion.html'
        ]);
    } else {
        throw new Exception('Error al enviar el correo');
    }

} catch (Exception $e) {
    error_log("Error PHPMailer: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}