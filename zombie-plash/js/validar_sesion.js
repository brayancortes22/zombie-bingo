document.addEventListener('DOMContentLoaded', function() {
    fetch('../php/verificar_sesion.php')
        .then(response => response.json())
        .then(data => {
            if(data.redirect) {
                window.location.href = data.url;
            }
        })
        .catch(error => console.error('Error:', error));
});