<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

// Rutas absolutas para prevenir fallos según el directorio de ejecución
require __DIR__ . '/PHPMailer-master/src/PHPMailer.php';
require __DIR__ . '/PHPMailer-master/src/SMTP.php';
require __DIR__ . '/PHPMailer-master/src/Exception.php';
require_once __DIR__ . '/../setting/conexion-base-datos.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

try {
    // 1. Verificar si se recibió el correo
    if (!isset($_POST['email']) || empty(trim($_POST['email']))) {
        throw new Exception('No se recibió el correo electrónico');
    }

    $emailUsuario = trim($_POST['email']);

    // 2. Verificar si el correo existe en la base de datos
    $conexion = new Conexion();
    $pdo = $conexion->conectar();
    
    $query = "SELECT id_registro, nombre FROM registro_usuarios WHERE correo = :correo";
    $stmt = $pdo->prepare($query);
    $stmt->execute(['correo' => $emailUsuario]);
    $usuario = $stmt->fetch();
    
    if (!$usuario) {
        throw new Exception('El correo electrónico no está registrado en Zombie Plash');
    }

    $nombreUsuario = !empty($usuario['nombre']) ? htmlspecialchars($usuario['nombre'], ENT_QUOTES, 'UTF-8') : 'Zombie Jugador';

    // 3. Generar código de verificación (4 dígitos)
    $codigoVerificacion = (string)rand(1000, 9999); 

    // 4. Almacenar datos en la sesión para el flujo de validación
    $_SESSION['codigo_verificacion'] = $codigoVerificacion;
    $_SESSION['email_recuperacion'] = $emailUsuario;
    $_SESSION['codigo_verificado'] = false;

    // 5. Configuración dinámica del servidor SMTP (Regla 6: No Hardcoding)
    $smtpHost = getenv('SMTP_HOST') ?: 'smtp.gmail.com';
    $smtpPort = getenv('SMTP_PORT') ? (int)getenv('SMTP_PORT') : 587;
    $smtpUser = getenv('SMTP_USER') ?: 'zombieplash@gmail.com';
    $smtpPass = getenv('SMTP_PASS') ?: 'kfsa ljvg uwvo wsiw';
    $smtpSecure = ($smtpPort == 465) ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;

    // 6. Instanciar y configurar PHPMailer
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = $smtpHost;
    $mail->SMTPAuth   = true;
    $mail->Username   = $smtpUser;
    $mail->Password   = $smtpPass;
    $mail->SMTPSecure = $smtpSecure;
    $mail->Port       = $smtpPort;
    $mail->CharSet    = 'UTF-8';
    $mail->Timeout    = 15;

    // Opciones SSL para entornos locales / Windows sin almacén CA estricto
    $mail->SMTPOptions = [
        'ssl' => [
            'verify_peer'       => false,
            'verify_peer_name'  => false,
            'allow_self_signed' => true
        ]
    ];

    // Remitente y destinatario
    $mail->setFrom($smtpUser, 'Zombie Plash');
    $mail->addAddress($emailUsuario);

    // Contenido del correo con plantilla temática Zombie Plash
    $mail->isHTML(true);
    $mail->Subject = "🧟 Código de Verificación: $codigoVerificacion - Zombie Plash";
    $mail->Body = "
    <!DOCTYPE html>
    <html lang='es'>
    <head>
        <meta charset='UTF-8'>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #121212; color: #ffffff; padding: 20px; }
            .container { max-width: 500px; margin: 0 auto; background: #1e1e1e; border: 2px solid #2ecc71; border-radius: 12px; padding: 30px; text-align: center; box-shadow: 0 4px 15px rgba(0,255,100,0.15); }
            h2 { color: #2ecc71; margin-bottom: 10px; font-size: 24px; text-transform: uppercase; }
            p { color: #cccccc; font-size: 15px; line-height: 1.5; }
            .code-box { display: inline-block; background: #27ae60; color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 12px 28px; border-radius: 8px; margin: 20px 0; border: 1px solid #2ecc71; }
            .footer { font-size: 12px; color: #888888; margin-top: 25px; border-top: 1px solid #333333; padding-top: 15px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <h2>🧟 Zombie Plash</h2>
            <p>Hola <strong>{$nombreUsuario}</strong>, has solicitado restablecer tu contraseña.</p>
            <p>Usa el siguiente código de verificación de 4 dígitos:</p>
            <div class='code-box'>{$codigoVerificacion}</div>
            <p>⏰ Este código expirará en <strong>15 minutos</strong>.</p>
            <div class='footer'>
                <p>Si no solicitaste este código, puedes ignorar este mensaje de forma segura.</p>
                <p>&copy; " . date('Y') . " Zombie Plash Game</p>
            </div>
        </div>
    </body>
    </html>
    ";

    $mail->AltBody = "Zombie Plash - Tu código de verificación es: $codigoVerificacion (expira en 15 minutos).";

    // 7. Enviar el correo
    $mail->send();
    
    // 8. Respuesta con código para facilitar pruebas en local (Dev / Debug)
    echo json_encode([
        'success'      => true,
        'message'      => 'Código enviado correctamente a tu correo',
        'codigo_debug' => $codigoVerificacion
    ]);

} catch (\Throwable $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>