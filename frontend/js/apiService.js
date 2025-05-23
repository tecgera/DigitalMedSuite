// API service for DigitalMedSuite
// This utility file provides functions for making API requests with authentication

const apiService = {
    // Base URL for API requests
    baseUrl: 'http://localhost:5180/api',
      // Generic GET request with authentication
    async get(endpoint) {
        try {
            const response = await window.authUtils.fetchAuth(`${this.baseUrl}/${endpoint}`);
            if (!response) return null;
            
            // Verificar si la respuesta es exitosa antes de intentar parsear JSON
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Error en la respuesta del servidor (${response.status}):`, errorText);
                throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error in GET request:', error);
            throw error;
        }
    },
      // Generic POST request with authentication
    async post(endpoint, data) {
        try {
            const response = await window.authUtils.fetchAuth(`${this.baseUrl}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response) return null;
            
            // Verificar si la respuesta es exitosa antes de intentar parsear JSON
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Error en la respuesta del servidor (${response.status}):`, errorText);
                throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error in POST request:', error);
            throw error;
        }
    },      // Generic PUT request with authentication
    async put(endpoint, data) {
        try {
            const response = await window.authUtils.fetchAuth(`${this.baseUrl}/${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response) return null;
            
            // Handle 204 No Content response
            if (response.status === 204) {
                return { success: true };
            }
            
            // Verificar si la respuesta es exitosa antes de intentar parsear JSON
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Error en la respuesta del servidor (${response.status}):`, errorText);
                throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error in PUT request:', error);
            throw error;
        }
    },      // Generic DELETE request with authentication
    async delete(endpoint) {
        try {
            const response = await window.authUtils.fetchAuth(`${this.baseUrl}/${endpoint}`, {
                method: 'DELETE',
            });
            if (!response) return null;
            
            // Handle 204 No Content response
            if (response.status === 204) {
                return { success: true };
            }
            
            // Verificar si la respuesta es exitosa antes de intentar parsear JSON
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Error en la respuesta del servidor (${response.status}):`, errorText);
                throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error in DELETE request:', error);
            throw error;
        }
    },
    
    // API endpoints for users
    usuarios: {
        getAll: async () => await apiService.get('Usuarios'),
        getById: async (id) => await apiService.get(`Usuarios/${id}`),
        create: async (data) => await apiService.post('Usuarios', data),
        update: async (id, data) => await apiService.put(`Usuarios/${id}`, data),
        delete: async (id) => await apiService.delete(`Usuarios/${id}`)
    },
    
    // API endpoints for patients
    pacientes: {
        getAll: async () => await apiService.get('Pacientes'),
        getById: async (id) => await apiService.get(`Pacientes/${id}`),
        create: async (data) => await apiService.post('Pacientes', data),
        update: async (id, data) => await apiService.put(`Pacientes/${id}`, data),
        delete: async (id) => await apiService.delete(`Pacientes/${id}`)
    },
    
    // API endpoints for appointments
    citas: {
        getAll: async () => await apiService.get('CitasMedicas'),
        getById: async (id) => await apiService.get(`CitasMedicas/${id}`),
        create: async (data) => await apiService.post('CitasMedicas', data),
        update: async (id, data) => await apiService.put(`CitasMedicas/${id}`, data),
        delete: async (id) => await apiService.delete(`CitasMedicas/${id}`)
    },
    
    // API service for consultorios
    consultorios: {        // Get all consultorios
        async getAll() {
            try {
                console.log('Solicitando consultorios al endpoint:', `${apiService.baseUrl}/consultorios`);
                const response = await apiService.get('consultorios');
                console.log('Respuesta del servidor para consultorios:', response);
                return response;
            } catch (error) {
                console.error('Error getting consultorios:', error);
                throw error;
            }
        },
        
        // Get consultorio by ID
        async getById(id) {
            try {
                return await apiService.get(`consultorios/${id}`);
            } catch (error) {
                console.error('Error getting consultorio:', error);
                throw error;
            }
        },
        
        // Create new consultorio
        async create(data) {
            try {
                return await apiService.post('consultorios', data);
            } catch (error) {
                console.error('Error creating consultorio:', error);
                throw error;
            }
        },
        
        // Update consultorio
        async update(id, data) {
            try {
                return await apiService.put(`consultorios/${id}`, data);
            } catch (error) {
                console.error('Error updating consultorio:', error);
                throw error;
            }
        },
        
        // Delete consultorio
        async delete(id) {
            try {
                return await apiService.delete(`consultorios/${id}`);
            } catch (error) {
                console.error('Error deleting consultorio:', error);
                throw error;
            }
        }    },
    
    // API endpoints for medicos
    medicos: {
        getAll: async () => await apiService.get('Medicos'),
        getById: async (id) => await apiService.get(`Medicos/${id}`),
        create: async (data) => await apiService.post('Medicos', data),
        update: async (id, data) => await apiService.put(`Medicos/${id}`, data),
        delete: async (id) => await apiService.delete(`Medicos/${id}`)
    },
    
    // API endpoints for catalogos
    catalogos: {
        getEstatusCitas: async () => await apiService.get('Catalogos/EstatusCitas'),
        getRoles: async () => await apiService.get('Catalogos/Roles'),
        getEstatusUsuarios: async () => await apiService.get('Catalogos/EstatusUsuarios'),
        getEspecialidades: async () => await apiService.get('Catalogos/Especialidades')
    },
    
    // Check if the API is accessible and the user is authenticated
    async checkConnection() {
        try {
            const response = await window.authUtils.fetchAuth(`${this.baseUrl}/Secure/protected`);
            if (!response) return false;
            const data = await response.json();
            return { success: true, message: data.message };
        } catch (error) {
            console.error('Error checking API connection:', error);
            return { success: false, message: 'Error connecting to the API' };
        }
    }
};

// Export for use in other scripts
window.apiService = apiService;
