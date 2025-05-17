/**
 * Script para manejar la funcionalidad de restablecimiento de contraseña
 */

document.addEventListener('DOMContentLoaded', function() {
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const submitButton = document.getElementById('submitReset');
    const messageContainer = document.getElementById('message-container');
    const passwordStrengthBar = document.querySelector('.strength-bar');
    const passwordStrengthText = document.querySelector('.strength-text');
    const resetTokenInput = document.getElementById('resetToken');
    const toggleIconNew = document.getElementById('toggleIconNew');
    const toggleIconConfirm = document.getElementById('toggleIconConfirm');

    // Obtener el token de la URL
    function getTokenFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (!token) {
            showMessage('Token de restablecimiento no válido o expirado. Por favor, solicite un nuevo enlace.', true);
            submitButton.disabled = true;
            return null;
        }
        
        resetTokenInput.value = token;
        return token;
    }

    // Validar el token al cargar la página
    const token = getTokenFromUrl();
    if (!token) {
        newPasswordInput.disabled = true;
        confirmPasswordInput.disabled = true;
    }

    // Función para mostrar mensajes al usuario
    function showMessage(message, isError = false) {
        messageContainer.innerHTML = `<div class="${isError ? 'error-message' : 'success-message'}">${message}</div>`;
        messageContainer.style.display = 'block';
    }

    // Función para alternar la visibilidad de la nueva contraseña
    window.toggleNewPassword = function() {
        if (newPasswordInput.type === 'password') {
            newPasswordInput.type = 'text';
            toggleIconNew.setAttribute('icon', 'mdi:eye-outline');
        } else {
            newPasswordInput.type = 'password';
            toggleIconNew.setAttribute('icon', 'mdi:eye-off-outline');
        }
    };

    // Función para alternar la visibilidad de la confirmación de contraseña
    window.toggleConfirmPassword = function() {
        if (confirmPasswordInput.type === 'password') {
            confirmPasswordInput.type = 'text';
            toggleIconConfirm.setAttribute('icon', 'mdi:eye-outline');
        } else {
            confirmPasswordInput.type = 'password';
            toggleIconConfirm.setAttribute('icon', 'mdi:eye-off-outline');
        }
    };

    // Función para evaluar la fortaleza de la contraseña
    function evaluatePasswordStrength(password) {
        if (!password) {
            return { score: 0, feedback: 'Ingrese una contraseña' };
        }

        let score = 0;
        
        // Longitud
        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 1;
        
        // Complejidad
        if (/[A-Z]/.test(password)) score += 1; // Mayúsculas
        if (/[a-z]/.test(password)) score += 1; // Minúsculas
        if (/[0-9]/.test(password)) score += 1; // Números
        if (/[^A-Za-z0-9]/.test(password)) score += 1; // Caracteres especiales
        
        let feedback = '';
        let color = '';
        
        if (score <= 2) {
            feedback = 'Débil';
            color = '#e74c3c';
        } else if (score <= 4) {
            feedback = 'Moderada';
            color = '#f39c12';
        } else {
            feedback = 'Fuerte';
            color = '#2ecc71';
        }
        
        return { score: (score / 6) * 100, feedback, color };
    }

    // Actualizar indicador de fortaleza de contraseña
    newPasswordInput.addEventListener('input', function() {
        const { score, feedback, color } = evaluatePasswordStrength(this.value);
        
        passwordStrengthBar.style.width = `${score}%`;
        passwordStrengthBar.style.backgroundColor = color;
        passwordStrengthText.textContent = feedback;
        passwordStrengthText.style.color = color;
    });

    // Función para validar el formulario
    function validateForm() {
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (!newPassword) {
            showMessage('Por favor, ingrese una nueva contraseña', true);
            return false;
        }
        
        const strength = evaluatePasswordStrength(newPassword);
        if (strength.score < 50) {
            showMessage('La contraseña es demasiado débil. Incluya mayúsculas, minúsculas, números y caracteres especiales.', true);
            return false;
        }
        
        if (newPassword.length < 8) {
            showMessage('La contraseña debe tener al menos 8 caracteres', true);
            return false;
        }
        
        if (newPassword !== confirmPassword) {
            showMessage('Las contraseñas no coinciden', true);
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
            token: resetTokenInput.value,
            newPassword: newPasswordInput.value
        };
        
        // Cambiar el estado del botón
        submitButton.disabled = true;
        submitButton.textContent = 'Procesando...';
        
        try {
            // Llamada a la API del backend para restablecer la contraseña
            const response = await fetch('http://localhost:5027/api/auth/reset-password', {
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
                showMessage('Su contraseña ha sido restablecida con éxito. Será redirigido al inicio de sesión en unos segundos.');
                
                // Redireccionar al login después de unos segundos
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 3000);
            } else {
                // Mostrar mensaje de error
                showMessage(data.message || 'No se pudo restablecer su contraseña. Por favor, inténtelo de nuevo más tarde.', true);
                submitButton.disabled = false;
                submitButton.textContent = 'Guardar Nueva Contraseña';
            }
        } catch (error) {
            console.error('Error al procesar la solicitud:', error);
            showMessage('Error de conexión. Por favor, verifique su conexión a internet e inténtelo de nuevo.', true);
            submitButton.disabled = false;
            submitButton.textContent = 'Guardar Nueva Contraseña';
        }
    });
});