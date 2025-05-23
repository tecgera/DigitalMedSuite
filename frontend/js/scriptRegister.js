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

function toggleConfirmPassword() {
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const toggleIcon = document.getElementById('toggleIconConfirm');
    
    if (confirmPasswordInput.type === 'password') {
        confirmPasswordInput.type = 'text';
        toggleIcon.setAttribute('icon', 'mdi:eye');
    } else {
        confirmPasswordInput.type = 'password';
        toggleIcon.setAttribute('icon', 'mdi:eye-off');
    }
}

window.togglePassword = togglePassword;
window.toggleConfirmPassword = toggleConfirmPassword;

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
const apiBaseUrl = 'http://localhost:5180/api';

// Removemos la función navigateToPage para evitar confusiones y posibles recursiones
// La navegación debe hacerse directamente usando la función showPage definida en scriptPrincipal.js

// Manejar el envío del formulario de registro
document.getElementById('submit').addEventListener('click', function() {
    const usernameInput = document.getElementById('username');    const nombreInput = document.getElementById('nombre');
    const apellidoPaternoInput = document.getElementById('apellidoPaterno');
    const apellidoMaternoInput = document.getElementById('apellidoMaterno');
    const emailInput = document.getElementById('email');
    const telefonoInput = document.getElementById('telefono-registro');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const rolIdSelect = document.getElementById('rolId');
    
    const username = usernameInput.value.trim();
    const nombre = nombreInput.value.trim();
    const apellidoPaterno = apellidoPaternoInput.value.trim();
    const apellidoMaterno = apellidoMaternoInput.value.trim();
    const email = emailInput.value.trim();
    const telefono = telefonoInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const rolId = parseInt(rolIdSelect.value);
    
    let isValid = true;
    
    // Limpiar errores previos
    clearError(usernameInput);
    clearError(nombreInput);
    clearError(apellidoPaternoInput);
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
    
    // Validar nombre
    if (!nombre) {
        showError(nombreInput, 'Por favor, ingrese su nombre');
        isValid = false;
    }
    
    // Validar apellido paterno
    if (!apellidoPaterno) {
        showError(apellidoPaternoInput, 'Por favor, ingrese su apellido paterno');
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
            Nombre_Usuario: username,
            Password: password,
            Nombre: nombre,
            Apellido_Paterno: apellidoPaterno,
            Apellido_Materno: apellidoMaterno,
            Correo: email,
            Telefono: telefono,
            ID_Rol: rolId
        };
        
        console.log('Enviando datos:', registerData);
        
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
            // Mostrar mensaje de éxito
            alert('Usuario registrado correctamente');
            
            // Guardar el token y datos del usuario
            const userData = {
                username: data.Nombre_Usuario,
                nombre: data.Nombre,
                apellidoPaterno: data.Apellido_Paterno,
                apellidoMaterno: data.Apellido_Materno,
                email: data.Correo,
                rol: data.Rol
            };
            
            // Registrar el evento en la bitácora
            if (window.BitacoraService) {
                window.BitacoraService.registrarAccion(
                    window.BitacoraService.ACCION.CREAR,
                    window.BitacoraService.ENTIDAD.USUARIO,
                    `Se registró al usuario ${data.Nombre_Usuario} con rol ${data.Rol}`,
                    data.ID_Usuario
                );
            }
            
            // Guardar los datos de autenticación si se desea iniciar sesión automáticamente
            // o comentar esta línea si no se desea iniciar sesión automáticamente
            window.authUtils.saveAuth(data.Token, userData);
            
            // Redireccionar a la página de usuarios
            showPage('usuarios');
            
            // Limpiar el formulario
            document.getElementById('registerForm').reset();
            
            // Recargar la lista de usuarios
            if (typeof cargarUsuarios === 'function') {
                cargarUsuarios();
            }
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