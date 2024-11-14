<?php
session_start();

// Verificar si el usuario ya ha iniciado sesión
if (isset($_SESSION['id_usuario'])) {
    // El usuario ya ha iniciado sesión, redirigir a la página de inicio
    header("Location: inicio.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/restablecimientoContra.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
<link rel="icon" href="../img/image-removebg-preview.png" type="image/png">    
<link rel="stylesheet" href="../css/fuentes.css">
    
<title>Restablecimento Contraseña</title>
</head>
<body>
    <div class="container-fluid">
        <div class="cuadro">
           <div class="titulo">
            <h1><strong>Restablecimiento de contraseña</strong></h1>
           </div>
           <div class="texto">
                <p><strong>Estimado zombie usuario <br>
                 por favor ingrese un correo <br> 
                 electronico para mandarle<br> 
                 un codigo de verificacion y continuar con el restableci-
                 <br>miento de su contraseña.</strong></p>
           </div>
           <form action="./codigo.php" method="POST">

                <input type="email" class="form-control" class="tx" id="email" placeholder="Ingresa el correo electronico" name="email" >
                <div class="largo"><br>
                    <div class="Aceptar">
                        <button class="btn success" type="submit"><strong>Aceptar</strong></button>
                    </div>  

                        <div class="cancelar">
                            <a href="./login.php">
                                <button class="btn success" type="button"><strong>Cancelar</strong></button>
                            </a>
                        </div>
            </form>
                        <div class="zombie">
                            <img src="../img/image-removebg-preview.png" alt="">
                        </div>
            </div>
        </div>
        <div class="zombie2">
            <iframe src="https://lottie.host/embed/751e8c6f-ff70-4363-9e44-c27542c63b26/qDaxmBsmHg.json" class="tamaño"></iframe>
        </div>
        <div class="zombie3">
            <iframe src="https://lottie.host/embed/39fb0ebe-f2f7-49aa-9987-6535a7ecec25/4pmyl5JGpr.json" class="tamaño3"></iframe>
        </div>
    </div>

    <script>
        document.querySelector('form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            fetch('./codigo.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: 'tu_correo@example.com' })
})
.then(response => response.json())
.then(data => {
    console.log('Código de verificación:', data.codigo);
})
.catch(error => {
    console.error('Error:', error);
});

        });
        </script>
</body>
</html> 
<script>

</script>
