class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.errorElements = {
            nombre: document.getElementById('nombreError'),
            correo: document.getElementById('correoError'),
            contraseña: document.getElementById('contraseñaError'),
            confirmar_contraseña: document.getElementById('confirmar_ContraseñaError')
        };
        this.initialize();
    }

    initialize() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    clearErrors() {
        Object.values(this.errorElements).forEach(element => {
            if (element) element.textContent = '';
        });
    }

    showError(field, message) {
        const errorElement = this.errorElements[field];
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.color = '#ff0000';
        }
    }

    validatePasswords() {
        const password = document.getElementById('contraseña').value;
        const confirmPassword = document.getElementById('confirmar_contraseña').value;

        if (password !== confirmPassword) {
            this.showError('confirmar_contraseña', 'Las contraseñas no coinciden');
            return false;
        }
        return true;
    }

    async handleSubmit(e) {
        e.preventDefault();
        this.clearErrors();

        if (!this.validatePasswords()) {
            return;
        }

        try {
            const formData = new FormData(this.form);
            const response = await fetch('../php/registro.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            console.log('Respuesta del servidor:', data);

            if (data.success) {
                alert('Registro exitoso');
                window.location.href = '../html/login.html';
            } else {
                // Mostrar errores específicos
                if (data.errors) {
                    if (data.errors.general) {
                        // Si hay un error general, mostrarlo en todos los campos relevantes
                        const errorMessage = data.errors.general;
                        if (errorMessage.includes('usuario')) {
                            this.showError('nombre', errorMessage);
                        }
                        if (errorMessage.includes('correo')) {
                            this.showError('correo', errorMessage);
                        }
                        if (errorMessage.includes('contraseña')) {
                            this.showError('contraseña', errorMessage);
                        }
                    }
                    // Mostrar errores específicos por campo
                    Object.entries(data.errors).forEach(([field, message]) => {
                        if (field !== 'general') {
                            this.showError(field, message);
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al procesar el registro');
        }
    }
}

// Inicializar el validador cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    new FormValidator('formulario');
});
