class PerfilManager {
    constructor() {
        this.selectedAvatar = null;
        this.init();
    }

    async init() {
        try {
            console.log('Iniciando carga del perfil...');
            await this.cargarDatosPerfil();
            this.setupEventListeners();
        } catch (error) {
            console.error('Error en init:', error);
            alert('Error al inicializar el perfil: ' + error.message);
        }
    }

    async cargarDatosPerfil() {
        try {
            console.log('Realizando petición al servidor...');
            const response = await fetch('../php/PerfilJugador.php?action=obtener', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache'
                },
                credentials: 'same-origin'
            });
            
            console.log('Respuesta recibida:', response);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            console.log('Tipo de contenido:', contentType);

            const text = await response.text();
            console.log('Texto de respuesta:', text);

            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error('Error al parsear JSON:', e);
                throw new Error('Respuesta no válida del servidor');
            }

            console.log('Datos parseados:', data);

            if (data.success) {
                // Actualizar elementos del DOM
                const elementos = {
                    'nombreUsuario': data.data.nombre,
                    'nombreCompleto': data.data.nombre,
                    'userId': data.data.id
                };

                for (const [id, valor] of Object.entries(elementos)) {
                    const elemento = document.getElementById(id);
                    if (elemento) {
                        elemento.textContent = valor;
                    } else {
                        console.warn(`Elemento ${id} no encontrado`);
                    }
                }

                const avatarImg = document.getElementById('avatarActual');
                if (avatarImg) {
                    avatarImg.src = `../img/${data.data.avatar}`;
                    avatarImg.onerror = () => {
                        console.warn('Error al cargar avatar, usando default');
                        avatarImg.src = '../img/perfil1.jpeg';
                    };
                }
            } else {
                throw new Error(data.message || 'Error al cargar los datos del perfil');
            }
        } catch (error) {
            console.error('Error detallado:', error);
            throw error;
        }
    }

    setupEventListeners() {
        console.log('Configurando event listeners...');
        const avatarOptions = document.querySelectorAll('.avatar-option');
        console.log('Opciones de avatar encontradas:', avatarOptions.length);
        
        avatarOptions.forEach(avatar => {
            avatar.addEventListener('click', (e) => {
                avatarOptions.forEach(a => a.classList.remove('selected'));
                e.target.classList.add('selected');
                this.selectedAvatar = e.target.dataset.avatar;
                console.log('Avatar seleccionado:', this.selectedAvatar);
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado, iniciando PerfilManager...');
    try {
        new PerfilManager();
    } catch (error) {
        console.error('Error al crear PerfilManager:', error);
        alert('Error al inicializar el perfil');
    }
}); 