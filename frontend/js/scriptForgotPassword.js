/**
 * Script para manejar la funcionalidad de recuperación de contraseña
 */

document.addEventListener('DOMContentLoaded', function() {
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const submitButton = document.getElementById('submitRecovery');
    const messageContainer = document.getElementById('message-container');

    // Función para mostrar mensajes al usuario
    function showMessage(message, isError = false) {
        messageContainer.innerHTML = `<div class="${isError ? 'error-message' : 'success-message'}">${message}</div>`;
        messageContainer.style.display = 'block';
    }

    // Función para validar el formulario
    function validateForm() {
        if (!usernameInput.value.trim()) {
            showMessage('Por favor, ingrese su nombre de usuario', true);
            return false;
        }
        
        if (!emailInput.value.trim()) {
            showMessage('Por favor, ingrese su correo electrónico', true);
            return false;
        }
        
        // Validación simple de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            showMessage('Por favor, ingrese un correo electrónico válido', true);
            return false;
        }
        
        return true;
    }

    // Manejar el envío del formulario
    submitButton.addEventListener('click', async function() {
        // Limpiar mensajes previos
        messageContainer.style.display = 'none';
        
        // Validar el formulario
        if (!validateForm()) {
            return;
        }
        
        // Preparar los datos para enviar al servidor
        const formData = {
            username: usernameInput.value.trim(),
            email: emailInput.value.trim()
        };
        
        // Cambiar el estado del botón
        submitButton.disabled = true;
        submitButton.textContent = 'Procesando...';
        
        try {
            // Llamada a la API del backend para solicitar recuperación de contraseña
            const response = await fetch('http://localhost:5027/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'cors', // Explicitly set CORS mode
                credentials: 'same-origin', // Include credentials if needed
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Mostrar mensaje de éxito
                showMessage('Se ha enviado un correo con instrucciones para restablecer su contraseña. Por favor revise su bandeja de entrada.');
                
                // Vaciar los campos del formulario
                usernameInput.value = '';
                emailInput.value = '';
            } else {
                // Mostrar mensaje de error
                showMessage(data.message || 'No se pudo procesar su solicitud. Por favor, inténtelo de nuevo más tarde.', true);
            }
        } catch (error) {
            console.error('Error al procesar la solicitud:', error);
            showMessage('Error de conexión. Por favor, verifique su conexión a internet e inténtelo de nuevo.', true);
        } finally {
            // Restaurar el estado del botón
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar Solicitud';
        }
    });
});