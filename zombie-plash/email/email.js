document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();

    fetch('../email/email.php', {
        method: 'POST',
        body: new FormData(this)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            window.location.href = '../html/restablecimientoContra2.html';
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        alert('Error al enviar el código');
        console.error(error);
    });
});