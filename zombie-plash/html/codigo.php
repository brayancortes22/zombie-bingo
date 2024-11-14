<?php

use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once('../setting/conexion-base-datos.php');
require_once('config.php');

// Verificar si el email está definido
$email = isset($_POST['email']) ? $_POST['email'] : null;
if (!$email) {
    echo "Email no proporcionado.";
   
}

// Crear instancia de la conexión a la base de datos
$conexion = new Conexion();
$pdo = $conexion->Conectar(); // Obtener el objeto PDO

// Consulta a la base de datos
$query = "SELECT * FROM usuarios WHERE correo = :email AND status = 1";
$stmt = $pdo->prepare($query);
$stmt->bindParam(':email', $email);
$stmt->execute();

if ($stmt && $stmt->rowCount() > 0) {
    require './PHPMailer/Exception.php';
    require './PHPMailer/SMTP.php';
    require './PHPMailer/PHPMailer.php';

    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = EMAIL_USERNAME;
        $mail->Password   = EMAIL_PASSWORD;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = 465;

        // Destinatarios
        $mail->setFrom(EMAIL_USERNAME, 'Mailer');
        $mail->addAddress($email, 'Usuarios');

        // Contenido del correo
        $mail->isHTML(true);
        $mail->Subject = 'Recuperación de contraseña';
        $mail->Body    = 'Este es el mensaje de recuperación de contraseña <b>en negrita</b>';
        $mail->AltBody = 'Este es el mensaje en texto plano para clientes que no soportan HTML';

        $mail->send();
        echo 'El mensaje ha sido enviado';
    } catch (Exception $e) {
        echo "No se pudo enviar el mensaje. Error de correo: {$mail->ErrorInfo}";
    }
} else {
    header("location: ../html/login.php");
}
?>
