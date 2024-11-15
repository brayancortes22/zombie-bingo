class PerfilManager {
    constructor() {
        this.selectedAvatar = null;
        this.init();
    }

    async init() {
        try {
            await this.cargarDatosPerfil();
            this.setupEventListeners();
        } catch (error) {
            console.error('Error en init:', error);
            alert('Error al inicializar el perfil');
        }
    }

    async cargarDatosPerfil() {
        try {
            const response = await fetch('../php/PerfilJugador.php?action=obtener');
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Error al cargar el perfil');
            }

            // Actualizar la información del perfil
            const avatarActual = document.getElementById('avatarActual');
            const nombreUsuario = document.getElementById('nombreUsuario');

            if (avatarActual && data.data.avatar) {
                avatarActual.src = `../img/${data.data.avatar}`;
                this.selectedAvatar = data.data.avatar;
            }

            if (nombreUsuario && data.data.nombre) {
                nombreUsuario.textContent = data.data.nombre;
            }

            // Marcar el avatar seleccionado
            if (this.selectedAvatar) {
                const avatarOption = document.querySelector(`[data-avatar="${this.selectedAvatar}"]`);
                if (avatarOption) {
                    avatarOption.closest('.avatar-option').classList.add('selected');
                }
            }
        } catch (error) {
            console.error('Error al cargar perfil:', error);
            throw error;
        }
    }

    setupEventListeners() {
        document.querySelectorAll('.avatar-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.avatar-option').forEach(opt => 
                    opt.classList.remove('selected'));
                
                option.classList.add('selected');
                this.selectedAvatar = option.querySelector('img').dataset.avatar;
                this.actualizarAvatar();
            });
        });
    }

    async actualizarAvatar() {
        if (!this.selectedAvatar) return;

        try {
            const response = await fetch('../php/PerfilJugador.php?action=actualizar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    avatar: this.selectedAvatar
                })
            });

            const data = await response.json();

            if (data.success) {
                const avatarActual = document.getElementById('avatarActual');
                if (avatarActual) {
                    avatarActual.src = `../img/${this.selectedAvatar}`;
                }
                // Opcional: mostrar mensaje de éxito
                console.log('Avatar actualizado correctamente');
            } else {
                throw new Error(data.message || 'Error al actualizar el avatar');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al guardar el avatar');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PerfilManager();
}); 