// Auth utilities for DigitalMedSuite
const authUtils = {    // Save token and user data in localStorage for persistence between page reloads
    saveAuth: function(token, userData) {
        console.log('saveAuth - Token recibido:', token);
        console.log('saveAuth - UserData recibido:', userData);
        
        if (!token || token === 'undefined' || token === 'null') {
            console.error('Error: Intentando guardar un token nulo o indefinido');
            return false;
        }
        
        try {
            // Validar userData
            if (!userData || typeof userData !== 'object' || !userData.username) {
                console.error('Error: userData inválido o incompleto');
                return false;
            }
            
            // Guardar en localStorage
            localStorage.setItem('authToken', token);
            localStorage.setItem('userData', JSON.stringify(userData));
            
            // Verificar que se guardó correctamente
            const savedToken = localStorage.getItem('authToken');
            const savedUserData = localStorage.getItem('userData');
            
            if (!savedToken || !savedUserData) {
                console.error('Error: No se pudo guardar la información en localStorage');
                return false;
            }
            
            console.log('Autenticación guardada correctamente');
            return true;
        } catch (e) {
            console.error('Error al guardar la autenticación:', e);
            return false;
        }
    },// Check if the user is authenticated
    isAuthenticated: function() {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        
        if (!token || !userData) {
            console.log('No token or userData found in localStorage');
            return false;
        }
        
        try {
            // Parse user data to make sure it's valid JSON
            const user = JSON.parse(userData);
            console.log('Usuario autenticado:', user.username);
            return true;
        } catch (e) {
            console.error('Error al verificar autenticación:', e);
            // If userData is not valid JSON, clear authentication data
            this.logout();
            return false;
        }
    },
    
    // Get the stored token
    getToken: function() {
        return localStorage.getItem('authToken');
    },
    
    // Get the stored user data
    getUserData: function() {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    },
    
    // Clear authentication data (logout)
    logout: function() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        console.log('Sesión cerrada');
    },
      // Get authorization headers for API requests
    getAuthHeaders: function() {
        const token = this.getToken();
        if (!token) {
            return {
                'Content-Type': 'application/json'
            };
        }
        
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    },
      // Make an authenticated API request
    fetchAuth: async function(url, options = {}) {
        const headers = this.getAuthHeaders();
        const requestOptions = {
            ...options,
            headers: {
                ...headers,
                ...(options.headers || {})
            }
        };
        
        try {
            const response = await fetch(url, requestOptions);
            
            // If the server returns a 401 Unauthorized, clear auth data and redirect to login
            if (response.status === 401) {
                console.warn('Unauthorized access attempt. Redirecting to login...');
                this.logout();
                window.location.href = 'index.html';
                return null;
            }
            
            return response;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }
};

// Export for use in other scripts
window.authUtils = authUtils;
