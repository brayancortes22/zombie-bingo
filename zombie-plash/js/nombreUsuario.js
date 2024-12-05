document.addEventListener('DOMContentLoaded', function() {
    const nombreCompleto = document.getElementById('nombreCompleto');
    // Obtener datos del perfil
    fetch('../php/PerfilJugador.php?action=obtener')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                nombreCompleto.textContent = data.data.nombre;
                // actualiza el nombre y lo guarda en el localstorage para mostralo despues en jugadores en la sala
                
                localStorage.setItem('nombre_usuario', data.data.nombre);
            } else {
                console.error('Error al obtener datos del perfil:', data.message);
            }
        });
});