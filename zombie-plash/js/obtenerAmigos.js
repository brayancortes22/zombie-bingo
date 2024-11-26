// <!-- Agregar el script para cargar amigos -->

document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('../php/obtenerAmigos.php?action=obtener');
        const data = await response.json();

        if (data.success) {
            const amigos = data.amigos;
            const avatarUsuario = data.avatar;
            let avatarsHTML = '';
            let nombresHTML = '';

            // Mostrar el avatar del usuario
            document.querySelector('.circulop1 img').src = `../uploads/avatars/${avatarUsuario}`;

            // Generar HTML para los amigos existentes (máximo 5)
            for (let i = 0; i < 5; i++) {
                if (i < amigos.length) {
                    const amigo = amigos[i];
                    avatarsHTML += `
                        <div class="columna">
                            <div class="usuario21">
                                <img src="../uploads/avatars/${amigo.avatar}" alt="Avatar de ${amigo.nombre}">
                            </div>
                        </div>`;
                    nombresHTML += `
                        <div class="columna1">
                            <strong>${amigo.nombre}</strong>
                        </div>`;
                } else {
                    // Espacios vacíos para mantener la estructura
                    avatarsHTML += `
                        <div class="columna">
                            <div class="usuario"></div>
                        </div>`;
                    nombresHTML += `
                        <div class="columna1">
                            <strong>Vacío</strong>
                        </div>`;
                }
            }

            // Agregar el botón de agregar amigos
            avatarsHTML += `
                <div class="columna">
                    <a href="./listaDeJugadores.html">
                        <i class="bi bi-person-plus"></i>
                    </a>
                </div>`;
            nombresHTML += `
                <div class="columna1">
                    <strong>Agregar Amigos</strong>
                </div>`;

            // Actualizar el DOM
            document.getElementById('amigosAvatares').innerHTML = avatarsHTML;
            document.getElementById('amigosNombres').innerHTML = nombresHTML;
        }
    } catch (error) {
        console.error('Error al cargar amigos:', error);
    }
});
