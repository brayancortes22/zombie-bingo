<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../PHPMailer/Exception.php';
require '../PHPMailer/PHPMailer.php';
require '../PHPMailer/SMTP.php';

header('Content-Type: application/json');

try {
    // Obtener el email del POST
    $email = $_POST['email'] ?? '';
    
    if (empty($email)) {
        throw new Exception('El correo electrónico es requerido');
    }

    // Generar código aleatorio de 6 dígitos
    $codigo = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);

    // Guardar el código en la sesión para verificarlo después
    session_start();
    $_SESSION['codigo_verificacion'] = $codigo;
    $_SESSION['email_verificacion'] = $email;
    $_SESSION['codigo_tiempo'] = time(); // Para expiración

    // Configurar PHPMailer
    $mail = new PHPMailer(true);

    // Configuración del servidor
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'zombieplash@gmail.com';
    $mail->Password = 'lylk zzzc msxd ytzb'; // Tu contraseña de aplicación
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;

    // Agregar debug
    $mail->SMTPDebug = 2;
    $mail->Debugoutput = 'html';

    // Desactivar verificación de certificados (solo si es necesario)
    $mail->SMTPOptions = array(
        'ssl' => array(
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true
        )
    );

    // Configuración del correo
    $mail->setFrom('zombieplash@gmail.com', 'Zombie Plash');
    $mail->addAddress($email);
    $mail->isHTML(true);
    $mail->CharSet = 'UTF-8';

    // Contenido del correo
    $mail->Subject = 'Código de Verificación - Zombie Plash';
    $mail->Body = '
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4a148c;">Código de Verificación Zombie Plash</h2>
            <p>Tu código de verificación es:</p>
            <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 24px; letter-spacing: 5px;">
                <strong>' . $codigo . '</strong>
            </div>
            <p>Este código expirará en 10 minutos.</p>
            <p>Si no solicitaste este código, puedes ignorar este correo.</p>
            <hr>
            <p style="color: #666; font-size: 12px;">Este es un correo automático, por favor no responder.</p>
        </div>
    ';

    $mail->send();

    echo json_encode([
        'success' => true,
        'message' => 'Código enviado correctamente'
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error al enviar el código: ' . $e->getMessage()
    ]);
}