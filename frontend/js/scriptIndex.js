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

// Función para guardar token en localStorage
function saveAuthToken(token, userData) {
    console.log('Guardando token:', token);
    console.log('Guardando datos de usuario:', userData);
    
    // Using the new authUtils
    const saved = window.authUtils.saveAuth(token, userData);
    
    // Verificar si se guardó correctamente
    if (saved) {
        const savedToken = localStorage.getItem('authToken');
        const savedUserData = localStorage.getItem('userData');
        console.log('Token guardado:', savedToken);
        console.log('UserData guardado:', savedUserData);
    } else {
        console.error('Error al guardar la autenticación');
    }
    
    // Retornar el resultado del guardado
    return saved;
}

// Verificar si el usuario está autenticado
function isAuthenticated() {
    return window.authUtils.isAuthenticated();
}

// Redireccionar si ya está autenticado
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página de login cargada - Verificando autenticación previa...');
    if (isAuthenticated()) {
        console.log('Usuario ya autenticado, redirigiendo a Principal.html');
        window.location.replace('Principal.html');
    } else {
        console.log('Usuario no autenticado, mostrando página de login');
    }
});

// URL base de la API
const apiBaseUrl = 'http://localhost:5180/api'; // Ajustado a la URL del backend

// Manejar el envío del formulario
document.getElementById('submit').addEventListener('click', function() {    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    let isValid = true;
    
    clearError(usernameInput);
    clearError(passwordInput);
    
    // Validar nombre de usuario
    if (!username) {
        showError(usernameInput, 'Por favor, ingrese su nombre de usuario');
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
        submitButton.innerHTML = '<div class="spinner"></div> Iniciando sesión...';            // Preparar datos para enviar
        const loginData = {
            Nombre_Usuario: username,
            Password: password
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
            console.log('Respuesta del servidor:', response);
            console.log('Status:', response.status);
            
            if (!response.ok) {
                return response.json().then(data => {
                    console.error('Error en la respuesta:', data);
                    throw new Error(data.message || 'Credenciales incorrectas');
                });
            }
            return response.json();
        })        .then(data => {
            console.log('Datos recibidos del servidor:', data);
            
            // Procesar la respuesta del servidor
            const authToken = data.token || data.Token;
            console.log('Token recibido:', authToken);
              // Manejar los nombres de propiedades que pueden estar en diferentes formatos
            // y asegurarnos de que nunca sean undefined
            const username = data.nombre_Usuario || data.Nombre_Usuario || '';
            const nombre = data.nombre || data.Nombre || '';
            const apellidoPaterno = data.apellido_Paterno || data.Apellido_Paterno || '';
            const apellidoMaterno = data.apellido_Materno || data.Apellido_Materno || '';
            const email = data.correo || data.Correo || '';
            const rol = data.rol || data.Rol || 'Usuario';
            const id = data.id_Usuario || data.ID_Usuario || 0;
            
            console.log('Nombre de usuario recibido:', username);
            console.log('Rol recibido:', rol);
              // Verificar que tengamos los datos necesarios antes de continuar
            if (!authToken) {
                throw new Error('No se recibió un token válido del servidor');
            }
            
            if (!username) {
                throw new Error('No se recibió un nombre de usuario válido del servidor');
            }
            
            // Guardar el token y datos del usuario
            const userData = {
                username: username,
                nombre: nombre,
                apellidoPaterno: apellidoPaterno,
                apellidoMaterno: apellidoMaterno,
                email: email,
                rol: rol,
                id: id
            };            console.log('Autenticación exitosa:', data);
            
            // Intentar guardar el token y los datos del usuario
            const authSaved = saveAuthToken(authToken, userData);
              if (authSaved) {
                console.log('Datos de autenticación guardados correctamente');
                
                // Registrar el evento de inicio de sesión en la bitácora
                if (window.BitacoraService) {
                    window.BitacoraService.registrarAccion(
                        window.BitacoraService.ACCION.LOGIN,
                        window.BitacoraService.ENTIDAD.SISTEMA,
                        `Inicio de sesión exitoso como ${username} (${rol})`,
                        id
                    );
                }
            } else {
                console.warn('Advertencia: Problemas al guardar datos de autenticación, pero continuando con la redirección');
            }
            
            // Verificar si tenemos suficientes datos para continuar
            if (localStorage.getItem('authToken')) {
                // Usar setTimeout para asegurar que el token se guarde antes de redirigir
                setTimeout(function() {
                    console.log('Redirigiendo a Principal.html...');
                    window.location.replace('Principal.html');
                }, 500); // Esperar medio segundo antes de redirigir
            } else {
                console.error('Error crítico: No se pudo guardar el token de autenticación');
                throw new Error('No se pudo completar el inicio de sesión');
            }
        })        .catch(error => {
            console.error('Error de inicio de sesión:', error);
            
            // Mostrar mensaje de error más detallado
            let errorMsg;
            if (error.message.includes('token')) {
                errorMsg = 'Error de autenticación: No se pudo obtener el token. Por favor contacte al administrador.';
                console.error('Error detallado de token:', error);
            } else if (error.message.includes('usuario')) {
                errorMsg = 'Usuario no encontrado o inactivo. Por favor verifica tus credenciales.';
            } else {
                errorMsg = error.message || 'Error al iniciar sesión. Por favor, verifica tus credenciales.';
            }
            
            showError(usernameInput, errorMsg);
            showError(passwordInput, errorMsg);
            
            // Log adicional para depuración
            console.log('Estado actual de localStorage:');
            console.log('authToken:', localStorage.getItem('authToken'));
            console.log('userData:', localStorage.getItem('userData'));
        })
        .finally(() => {
            // Restaurar el botón
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        });
    }
});





