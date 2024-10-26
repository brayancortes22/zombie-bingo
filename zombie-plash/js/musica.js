// js/musica.js

// Cargar o inicializar el audio
let audioJuego = new Audio("../musica/fondo.mp3");
audioJuego.loop = true;
audioJuego.volume = 1.0;

// Restaurar el tiempo guardado, si existe
let savedTime = localStorage.getItem("audioTime");
if (savedTime) {
    audioJuego.currentTime = savedTime;
}

// Función para controlar el volumen en la página específica
let estadoSonido = 2; // 2 = volumen completo, 1 = 50%, 0 = muteado

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
}

// Reproducir el audio al cargar la primera vez
audioJuego.play().catch(error => console.log("Error al reproducir audio:", error));

// Guardar el tiempo actual antes de salir
window.addEventListener("beforeunload", function () {
    localStorage.setItem("audioTime", audioJuego.currentTime);
});
