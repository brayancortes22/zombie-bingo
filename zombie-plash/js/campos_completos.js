// Agrega un evento de submit al formulario
document.getElementById("formulario").addEventListener("submit", function(event) {
    // Verifica que los campos estén completos
    if (this.nombre.value === "" || this.correo.value === "" || this.contraseña.value === "" || this.confirmar_contraseña.value === "") {
      alert("Por favor, complete todos los campos");
      event.preventDefault();
    } else {
      // Verifica que la contraseña y la confirmación de contraseña sean iguales
      if (this.contraseña.value !== this.confirmar_contraseña.value) {
        alert("La contraseña y la confirmación de contraseña no coinciden");
        event.preventDefault();
      } else {
        // Enviar el formulario
        
      }
    }
  });

  // Agrega un evento de blur al campo de correo electrónico
document.getElementById("correo").addEventListener("blur", function() {
    var correo = this.value;
    var regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(correo)) {
      alert("El correo electrónico no es válido");
    }else{
    
    }
  });

  // Agrega un evento de blur al campo de contraseña
document.getElementById("contraseña").addEventListener("blur", function() {
    var contraseña = this.value;
    var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(contraseña)) {
      alert("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial");
    }else{

    }
  });