class SalaManager {
    constructor() {
        this.form = document.getElementById('crearSalaForm');
        this.mensajeElement = document.getElementById('mensaje');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        try {
            const formData = new FormData(this.form);
            
            // Debug: Mostrar datos que se envían
            // console.log('Datos del formulario:');
            for (let pair of formData.entries()) {
                // console.log(pair[0] + ': ' + pair[1]);
            }

            const response = await fetch('../php/crearSala.php', {
                method: 'POST',
                body: formData
            });

            // Debug: Mostrar respuesta completa
            // const responseText = await response.text();
            // console.log('Respuesta del servidor (raw):', responseText);

            let data;
            try {
                data = JSON.parse(responseText);
                // console.log('Respuesta parseada:', data);
            } catch (parseError) {
                // console.error('Error al parsear JSON:', parseError);
                // console.error('Texto recibido:', responseText);
                throw new Error('La respuesta del servidor no es válida');
            }

            if (data.success) {
                localStorage.setItem('datosSala', JSON.stringify({
                    id_sala: data.id_sala,
                    nombre_jugador: data.nombre_jugador,
                    contraseña_sala: data.contraseña_sala,
                    max_jugadores: data.max_jugadores,
                    jugadores_conectados: data.jugadores_conectados
                }));
                
                window.location.href = 'jugadoresSala.html';
            } else {
                throw new Error(data.message || 'Error al crear la sala');
            }

        } catch (error) {
            console.error('Error completo:', error);
            this.mostrarError(error.message);
        }
    }

    mostrarError(mensaje) {
        this.mensajeElement.textContent = `Error: ${mensaje}`;
        this.mensajeElement.style.color = 'withe';
        this.mensajeElement.style.marginTop = '10px';
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const salaManager = new SalaManager();
});
