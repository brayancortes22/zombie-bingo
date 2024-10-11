window.onload = function() {
    var audio = document.getElementById('background-music');
    audio.play();
};

function cambiarPagina(pagina) {
    // Guarda el estado del audio en el almacenamiento local
    localStorage.setItem('audioPlaying', true);
    window.location.href = pagina;
}

// En la nueva página, comprueba si el audio debe seguir reproduciéndose
window.addEventListener('load', function() {
    if (localStorage.getItem('audioPlaying')) {
        var audio = document.getElementById('background-music');
        audio.play();
    }
});
