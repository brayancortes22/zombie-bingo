// Evento para actualizar la vista previa de la imagen seleccionada
document.getElementById('avatarUpload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // Cambiar la imagen del avatar mostrado en la página
            document.getElementById('avatarActual').src = e.target.result;
        }
        
        reader.readAsDataURL(file); // Leer el archivo como una URL de datos
    }
});

// Evento para guardar el avatar
document.getElementById('guardarPerfil').addEventListener('click', function() {
    const formData = new FormData();
    const fileInput = document.getElementById('avatarUpload');
    
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        formData.append('avatarUpload', file);
        
        fetch('guardar_avatar.php', {
            method: 'POST',
            body: formData
        })

        .then(response => response.json())
        .then(data => {
            console.log(guardarPerfil)
            if (data.success) {
                alert('Avatar guardado correctamente');
            } else {
                alert('Error al guardar el avatar');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error en la carga del avatar');
        });
    } else {
        alert('Por favor, selecciona una imagen para el avatar');
    }
});
