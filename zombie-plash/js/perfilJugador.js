document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const avatarActual = document.getElementById('avatarActual');
    const successMessage = document.getElementById('successMessage');

    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    if (avatarActual) {
                        avatarActual.src = e.target.result;
                    }
                }
                reader.readAsDataURL(file);
                
                handleFileUpload(file);
            }
        });
    }
});

function handleFileUpload(file) {
    const formData = new FormData();
    formData.append('avatar', file);

    return new Promise((resolve, reject) => {
        fetch('../avatar_icono/guardar_avatar.php', {
            method: 'POST',
            body: formData,
            credentials: 'include'             
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const successMessage = document.getElementById('successMessage');
                if (successMessage) {
                    successMessage.style.display = 'block';
                    setTimeout(() => {
                        successMessage.style.display = 'none';
                    }, 3000);
                }
                resolve(data);
            } else {
                reject(new Error(data.message));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            reject(error);
        });
    });
}
