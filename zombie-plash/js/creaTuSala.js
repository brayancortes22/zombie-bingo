document.getElementById('crearSalaForm').addEventListener('submit', function(event) {
  event.preventDefault();

  var formData = new FormData(this);

  fetch('../php/crearSala.php', {
      method: 'POST',
      body: formData
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Error en la respuesta del servidor');
      }
      return response.json();
  })
  .then(data => {
      if (data.success) {
          // Guardar los datos en el almacenamiento local
          localStorage.setItem('datosSala', JSON.stringify({
              id_sala: data.id_sala,
              id_creador: data.id_creador, // Asegúrate de que esto se está enviando desde el servidor
              // ... otros datos ...
          }));
          
          // Redirigir a la página de jugadores en sala
          window.location.href = 'jugadoresSala.html';
      } else {
          alert('Error al crear la sala: ' + data.message);
          console.log('erro al crear sala : '+data.message);
      }
  })
  .catch(error => {
      console.error('Error:', error);
      document.getElementById('mensaje').textContent = 'Error al crear la sala. Por favor, intenta de nuevo.';
  });
});

function crearSala() {
    // ... (código existente para crear la sala)

    fetch('php/crearSala.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // La sala se creó exitosamente
            document.getElementById('mensajeUnirse').innerHTML = '¡Sala creada con éxito!';
            mostrarAlerta('¡Sala creada con éxito!');
            // ... (cualquier otro código que quieras ejecutar después de crear la sala)
        } else {
            // Hubo un error al crear la sala
            document.getElementById('mensajeUnirse').innerHTML = 'Error al crear la sala: ' + data.message;
            mostrarAlerta('Error al crear la sala: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('mensajeUnirse').innerHTML = 'Error al conectar con el servidor';
        mostrarAlerta('Error al conectar con el servidor');
    });
}

function mostrarAlerta(mensaje) {
    alert(mensaje);
}
