<?php
session_start();
require 'vendor/autoload.php'; // Asegúrate de que la ruta sea correcta
include('../setting/conexion-base-datos.php');

if (isset($_POST['email'])) {
    $email = $_POST['email'];
    $stmt = $conn->prepare("SELECT id FROM registro_usuarios WHERE correo = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $userId = $row['id'];
        $codigo = rand(100000, 999999);
        $expira = date('Y-m-d H:i:s', strtotime('+10 minutes'));
        
        $stmt = $conn->prepare("INSERT INTO codigos_verificacion (usuario_id, codigo, expira_en) VALUES (?, ?, ?)");
        $stmt->bind_param("iss", $userId, $codigo, $expira);
        $stmt->execute();
        
        // Enviar correo con SendGrid
        $email = new \SendGrid\Mail\Mail();
        $email->setFrom("tu_email@tudominio.com", "Zombie Plash");
        $email->setSubject("Código de verificación para restablecer contraseña");
        $email->addTo($email);
        $email->addContent("text/plain", "Tu código de verificación es: $codigo");
        $email->addContent(
            "text/html", "<strong>Tu código de verificación es: $codigo</strong>"
        );
        $sendgrid = new \SendGrid(SENDGRID_API_KEY);
        try {
            $response = $sendgrid->send($email);
            if ($response->statusCode() == 202) {
                $_SESSION['reset_email'] = $email;
                echo json_encode(["success" => true, "message" => "Se ha enviado un código de verificación a tu correo electrónico."]);
            } else {
                echo json_encode(["success" => false, "message" => "Error al enviar el correo. Por favor, intenta de nuevo."]);
            }
        } catch (Exception $e) {
            echo json_encode(["success" => false, "message" => "Error al enviar el correo: " . $e->getMessage()]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Este correo no está registrado."]);
    }
}
?>