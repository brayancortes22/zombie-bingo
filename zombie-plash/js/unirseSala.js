document.getElementById('unirseSalaForm').addEventListener('submit', function(event) {
  event.preventDefault();

  var formData = new FormData(this);

  fetch('../php/unirseSala.php', {
      method: 'POST',
      body: formData
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          document.getElementById('mensajeUnirse').textContent = 'Te has unido a la sala correctamente.';
      } else {
          document.getElementById('mensajeUnirse').textContent = 'Error: ' + data.message;
      }
  })
  .catch(error => console.error('Error:', error));
});
