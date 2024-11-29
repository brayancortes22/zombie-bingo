class ListaJugadoresManager {
    constructor() {
        this.init();
        this.amigos = new Set(); // Para almacenar los IDs de amigos
    }

    async init() {
        await this.cargarAmigos(); // Cargar lista de amigos actual
        await this.cargarJugadores();
        this.setupEventListeners();
    }

    async cargarAmigos() {
        try {
            const response = await fetch('../php/ListaJugadores.php?action=obtener_amigos');
            const data = await response.json();
            
            if (data.success) {
                this.amigos = new Set(data.amigos.map(amigo => amigo.id_amigo));
            }
        } catch (error) {
            console.error('Error al cargar amigos:', error);
        }
    }

    async cargarJugadores() {
        try {
            const response = await fetch('../php/ListaJugadores.php?action=obtener');
            const data = await response.json();

            if (data.success) {
                this.mostrarJugadores(data.jugadores);
            } else {
                console.error('Error al cargar jugadores:', data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    mostrarJugadores(jugadores) {
        const container = document.getElementById('listaJugadores');
        container.innerHTML = '';

        const jugadoresHTML = jugadores.map(jugador => {
            let imgSrc;
            if (jugador.avatar) {
                imgSrc = `data:image/jpeg;base64,${jugador.avatar}`;
            } else {
                imgSrc = '../img/perfil1.jpeg';
            }

            return `
                <div class="fila">
                    <div class="cuadrito">
                        <div class="circulo">
                            <img src="${imgSrc}" alt="Avatar de ${jugador.nombre}">
                        </div>
                        <div class="icono" data-jugador-id="${jugador.id_registro}">
                            <i class="bi ${this.amigos.has(jugador.id_registro) ? 'bi-person-fill-check' : 'bi-person-add'}"
                               onclick="listaJugadoresManager.toggleAmigo(${jugador.id_registro}, this)"></i>
                        </div>
                    </div>
                    <div class="cuadritos">${jugador.nombre}</div>
                </div>
            `;
        }).join('');

        container.innerHTML = jugadoresHTML;
    }

    setupEventListeners() {
        document.getElementById('btnBuscar').addEventListener('click', () => {
            const id = document.getElementById('buscarJugadorId').value;
            if (id) this.buscarJugador(id);
        });
    }

    async buscarJugador(id) {
        try {
            const response = await fetch(`../php/ListaJugadores.php?action=buscar&id_jugador=${id}`);
            const data = await response.json();

            if (data.success && data.jugador) {
                this.mostrarJugadores([data.jugador]);
            } else {
                alert('Jugador no encontrado');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async toggleAmigo(idAmigo, iconElement) {
        try {
            if (this.amigos.has(idAmigo)) {
                // Si ya es amigo, mostrar mensaje
                alert('Ya son amigos');
                return;
            }

            const response = await fetch('../php/ListaJugadores.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'agregar_amigo',
                    id_amigo: idAmigo
                })
            });

            const data = await response.json();

            if (data.success) {
                // Cambiar el icono
                iconElement.classList.remove('bi-person-add');
                iconElement.classList.add('bi-person-fill-check');
                
                // Agregar a la lista de amigos
                this.amigos.add(idAmigo);
                
                // Opcional: Agregar clase para estilos adicionales
                iconElement.closest('.icono').classList.add('amigo-agregado');
                
                alert('Amigo agregado correctamente');
            } else {
                alert(data.message || 'Error al agregar amigo');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al agregar amigo');
        }
    }
}

// Inicializar cuando el DOM esté listo
const listaJugadoresManager = new ListaJugadoresManager(); 