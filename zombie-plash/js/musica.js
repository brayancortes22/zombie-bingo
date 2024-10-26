// js/musica.js

// Cargar o inicializar el audio
let audioJuego = new Audio("../musica/esta.mp3");
audioJuego.loop = true;

// Restaurar el tiempo guardado, si existe
let savedTime = localStorage.getItem("audioTime");
if (savedTime) {
    audioJuego.currentTime = savedTime;
}

// Función para controlar el volumen en la página específica
let estadoSonido = localStorage.getItem("estadoSonido") || 2; // 2 = volumen completo, 1 = 50%, 0 = muteado
audioJuego.volume = estadoSonido === "0" ? 0 : (estadoSonido === "1" ? 0.5 : 1.0);

function controlarSonido() {
    const icono = document.getElementById("icono-sonido");

    if (estadoSonido === 2) {
        audioJuego.volume = 0.5;
        icono.className = "fas fa-volume-down";
        estadoSonido = 1;
    } else if (estadoSonido === 1) {
        audioJuego.volume = 0;
        icono.className = "fas fa-volume-mute";
        estadoSonido = 0;
    } else {
        audioJuego.volume = 1;
        icono.className = "fas fa-volume-up";
        estadoSonido = 2;
    }

    // Guardar el estado de sonido en localStorage
    localStorage.setItem("estadoSonido", estadoSonido);
}

// Llamar a initAudio solo cuando el usuario haga clic
function initAudio() {
    audioJuego.play().catch(error => console.log("Error al reproducir audio:", error));
}

// Agregar el evento al botón de sonido para controlar el sonido y reproducir el audio
document.addEventListener("click", function() {
    initAudio();
    document.removeEventListener("click", arguments.callee); // Remueve el listener después de la primera interacción
});
