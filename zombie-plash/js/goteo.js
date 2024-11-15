// <!-- ayudame a elaborar un efecto de goteo para colocarlo de fondo para mi proyecto -->
function createRaindrop() {
    const rainContainer = document.getElementById('rainContainer');
    const raindrop = document.createElement('div');
    raindrop.classList.add('raindrop');
    
    // Posición aleatoria en X
    const posX = Math.random() * window.innerWidth;
    raindrop.style.left = posX + 'px';
    
    // Duración aleatoria de la animación
    const duration = Math.random() * 1 + 0.5; // Entre 0.5 y 1.5 segundos
    raindrop.style.animationDuration = duration + 's';
    
    rainContainer.appendChild(raindrop);
    
    // Eliminar la gota después de que termine la animación
    setTimeout(() => {
        raindrop.remove();
    }, duration * 1000);
}

// Crear gotas cada cierto intervalo
function startRain() {
    setInterval(createRaindrop, 100); // Crea una gota cada 100ms
}

const duration = Math.random() * 1 + 0.5; // Aumenta los números para gotas más lentas
// Iniciar el efecto cuando se carga la página
document.addEventListener('DOMContentLoaded', startRain);