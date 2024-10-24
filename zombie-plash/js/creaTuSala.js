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
          localStorage.setItem('datosSala', JSON.stringify(data));
          
          // Redirigir a la página de jugadores en sala
          window.location.href = 'jugadoresSala.html';
      } else {
          alert('Error al crear la sala: ' + data.message);
      }
  })
  .catch(error => {
      console.error('Error:', error);
      document.getElementById('mensaje').textContent = 'Error al crear la sala. Por favor, intenta de nuevo.';
  });
});
