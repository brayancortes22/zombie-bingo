// Asegúrate de que este archivo tenga exactamente este contenido
class CuentaRegresiva {
    constructor() {
        this.countdown = 5;
    }
     iniciarCuentaRegresiva(callback) {
        const overlayContainer = document.createElement('div');
        overlayContainer.className = 'countdown-overlay';
        
        const countdownElement = document.createElement('div');
        countdownElement.className = 'countdown';
        
        const loadingBar = document.createElement('div');
        loadingBar.className = 'loading-bar';
        
        overlayContainer.appendChild(countdownElement);
        overlayContainer.appendChild(loadingBar);
        document.body.appendChild(overlayContainer);
    
        let count = this.countdown;
        const countdownInterval = setInterval(() => {
            if (count > 0) {
                countdownElement.textContent = count;
                count--;
            } else {
                clearInterval(countdownInterval);
                countdownElement.textContent = '¡ZOMBIE PLASH!';
                loadingBar.style.width = '100%';
                setTimeout(() => {
                    overlayContainer.classList.add('fade-out');
                    setTimeout(() => {
                        overlayContainer.remove();
                        if (callback) callback();
                    }, 1000);
                }, 1000);
            }
        }, 1000);
    }
} // Asegúrate de cerrar la clase aquí

export default CuentaRegresiva;  // Exportación por defecto
