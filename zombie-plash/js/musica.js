// Esperamos a que el DOM se cargue completamente
document.addEventListener("DOMContentLoaded", function () {
  let audio = document.getElementById("miAudio");

  // Al cargar la página, intentar reproducir el audio
  audio.play().catch(function (error) {
      console.log("Error al reproducir audio: " + error);
  });

  // Guardar el tiempo actual del audio antes de salir de la página
  window.addEventListener("beforeunload", function () {
      localStorage.setItem("audioTime", audio.currentTime);
  });

  // Al cargar la página, continuar desde el tiempo guardado
  window.onload = function () {
      var savedTime = localStorage.getItem("audioTime");
      if (savedTime !== null) {
          audio.currentTime = savedTime; // Continuar desde el tiempo guardado
      }
  };
});
