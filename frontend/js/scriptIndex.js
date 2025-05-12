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

// Guardar token en sessionStorage
function saveAuthToken(token, userData) {
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('userData', JSON.stringify(userData));
}

// Verificar si el usuario está autenticado
function isAuthenticated() {
    return sessionStorage.getItem('authToken') !== null;
}

// Redireccionar si ya está autenticado
document.addEventListener('DOMContentLoaded', function() {
    if (isAuthenticated()) {
        window.location.href = 'Principal.html';
    }
});

// URL base de la API
const apiBaseUrl = 'http://localhost:5027/api'; // Ajusta esto a tu URL de backend

// Manejar el envío del formulario
document.getElementById('submit').addEventListener('click', function() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    let isValid = true;
    
    clearError(emailInput);
    clearError(passwordInput);
    
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
        showError(passwordInput, 'Por favor, ingrese su contraseña');
        isValid = false;
    }
    
    if (isValid) {
        // Mostrar animación de carga
        const submitButton = document.getElementById('submit');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.innerHTML = '<div class="spinner"></div> Iniciando sesión...';
        
        // Preparar datos para enviar
        const loginData = {
            email: email,
            password: password
        };
        
        // Hacer la petición al API
        fetch(`${apiBaseUrl}/Auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message || 'Credenciales incorrectas');
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
            console.error('Error de inicio de sesión:', error);
            showError(emailInput, error.message || 'Error al iniciar sesión');
            showError(passwordInput, error.message || 'Error al iniciar sesión');
        })
        .finally(() => {
            // Restaurar el botón
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        });
    }
});





