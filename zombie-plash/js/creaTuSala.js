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
          document.getElementById('mensaje').textContent = 'Sala creada exitosamente. Redirigiendo...';
          // Redirigir a la sala inmediatamente
          window.location.href = 'sala.php';
      } else {
          document.getElementById('mensaje').textContent = 'Error: ' + data.message;
      }
  })
  .catch(error => {
      console.error('Error:', error);
      document.getElementById('mensaje').textContent = 'Error al crear la sala. Por favor, intenta de nuevo.';
  });
});
