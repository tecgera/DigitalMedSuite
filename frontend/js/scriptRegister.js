function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('toggleIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.setAttribute('icon', 'mdi:eye');
    } else {
        passwordInput.type = 'password';
        toggleIcon.setAttribute('icon', 'mdi:eye-off');
    }
}

window.togglePassword = togglePassword;

function showError(inputElement, message) {
    inputElement.classList.add('error-input');
    
    const container = inputElement.closest('.input-with-icon');
    container.classList.add('shake');
    
    setTimeout(() => {
        container.classList.remove('shake');
    }, 600); 
    
    let errorMessage = container.querySelector('.error-message');
    if (!errorMessage) {
        errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        container.appendChild(errorMessage);
    }
    
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

// Función para limpiar errores
function clearError(inputElement) {
    inputElement.classList.remove('error-input');
    
    const container = inputElement.closest('.input-with-icon');
    const errorMessage = container.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.style.display = 'none';
    }
}

// URL base de la API
const apiBaseUrl = 'http://localhost:5027/api';

// Guardar token en sessionStorage
function saveAuthToken(token, userData) {
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('userData', JSON.stringify(userData));
}

// Manejar el envío del formulario de registro
document.getElementById('submit').addEventListener('click', function() {
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const userTypeSelect = document.getElementById('userType');
    
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const rol = userTypeSelect.value;
    
    let isValid = true;
    
    // Limpiar errores previos
    clearError(usernameInput);
    clearError(emailInput);
    clearError(passwordInput);
    clearError(confirmPasswordInput);
    
    // Validar nombre de usuario
    if (!username) {
        showError(usernameInput, 'Por favor, ingrese un nombre de usuario');
        isValid = false;
    } else if (username.length < 3) {
        showError(usernameInput, 'El nombre de usuario debe tener al menos 3 caracteres');
        isValid = false;
    }
    
    // Validar email
    if (!email) {
        showError(emailInput, 'Por favor, ingrese su correo electrónico');
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError(emailInput, 'Por favor, ingrese un correo electrónico válido');
        isValid = false;
    }
    
    // Validar contraseña
    if (!password) {
        showError(passwordInput, 'Por favor, ingrese una contraseña');
        isValid = false;
    } else if (password.length < 6) {
        showError(passwordInput, 'La contraseña debe tener al menos 6 caracteres');
        isValid = false;
    }
    
    // Validar confirmación de contraseña
    if (!confirmPassword) {
        showError(confirmPasswordInput, 'Por favor, confirme su contraseña');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError(confirmPasswordInput, 'Las contraseñas no coinciden');
        isValid = false;
    }
    
    if (isValid) {
        // Mostrar animación de carga
        const submitButton = document.getElementById('submit');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.innerHTML = '<div class="spinner"></div> Registrando...';
        
        // Preparar datos para enviar
        const registerData = {
            username: username,
            email: email,
            password: password,
            confirmPassword: confirmPassword,
            rol: rol
        };
        
        // Hacer la petición al API
        fetch(`${apiBaseUrl}/Auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registerData),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message || 'Error al registrar usuario');
                });
            }
            return response.json();
        })
        .then(data => {
            // Guardar el token y datos del usuario
            const userData = {
                username: data.username,
                email: data.email,
                rol: data.rol
            };
            
            saveAuthToken(data.token, userData);
            
            // Redireccionar al dashboard
            window.location.href = 'Principal.html';
        })
        .catch(error => {
            console.error('Error de registro:', error);
            
            if (error.message.includes('correo electrónico')) {
                showError(emailInput, error.message);
            } else if (error.message.includes('nombre de usuario')) {
                showError(usernameInput, error.message);
            } else {
                showError(usernameInput, error.message || 'Error al registrar. Intente de nuevo.');
            }
        })
        .finally(() => {
            // Restaurar el botón
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        });
    }
});