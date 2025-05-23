/**
 * Servicio de bitácora para DigitalMedSuite
 * Este servicio se encarga de registrar las acciones realizadas en el sistema
 * y proporciona métodos para recuperar el historial de eventos
 */
const BitacoraService = (function() {
    // Constantes para los tipos de acciones
    const ACCION = {
        CREAR: 'Creación',
        MODIFICAR: 'Modificación',
        ELIMINAR: 'Eliminación',
        CONSULTAR: 'Consulta',
        LOGIN: 'Inicio de sesión',
        LOGOUT: 'Cierre de sesión',
        OTRO: 'Otra acción'
    };

    // Constantes para las entidades del sistema
    const ENTIDAD = {
        USUARIO: 'Usuario',
        PACIENTE: 'Paciente',
        MEDICO: 'Médico',
        CITA: 'Cita',
        CONSULTORIO: 'Consultorio',
        EXPEDIENTE: 'Expediente',
        SISTEMA: 'Sistema'
    };

    // Función para obtener la fecha y hora actual en formato legible
    function obtenerFechaHoraActual() {
        return new Date().toISOString();
    }

    // Función para obtener el usuario actual desde localStorage
    function obtenerUsuarioActual() {
        try {
            const userData = localStorage.getItem('userData');
            if (userData) {
                const user = JSON.parse(userData);
                return user.username || 'Usuario no identificado';
            }
        } catch (error) {
            console.error('Error al obtener usuario actual:', error);
        }
        return 'Sistema';
    }

    // Función para guardar un evento en localStorage (hasta 100 eventos recientes)
    function guardarEventoLocal(evento) {
        try {
            // Recuperar eventos existentes o inicializar array vacío
            let eventos = JSON.parse(localStorage.getItem('bitacoraEventos') || '[]');
            
            // Agregar el nuevo evento al principio
            eventos.unshift(evento);
            
            // Limitar a 100 eventos para no sobrecargar localStorage
            if (eventos.length > 100) {
                eventos = eventos.slice(0, 100);
            }
            
            // Guardar en localStorage
            localStorage.setItem('bitacoraEventos', JSON.stringify(eventos));
        } catch (error) {
            console.error('Error al guardar evento en localStorage:', error);
        }
    }

    // Función para registrar un evento en el servidor
    async function registrarEventoServidor(evento) {
        try {
            // Obtener token de autenticación
            const token = localStorage.getItem('authToken');
            if (!token) {
                // Si no hay token, solo guardamos localmente
                console.warn('No hay token de autenticación, evento guardado solo localmente');
                return false;
            }

            // Enviar evento al servidor
            const response = await fetch('api/Bitacora/RegistrarEvento', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(evento)
            });

            if (!response.ok) {
                throw new Error(`Error al registrar evento: ${response.status}`);
            }

            return true;
        } catch (error) {
            console.error('Error al registrar evento en servidor:', error);
            return false;
        }
    }

    // Función principal para registrar una acción en la bitácora
    async function registrarAccion(tipoAccion, entidad, detalles, idReferencia = null) {
        const evento = {
            fechaHora: obtenerFechaHoraActual(),
            usuario: obtenerUsuarioActual(),
            accion: tipoAccion,
            entidad: entidad,
            detalles: detalles,
            idReferencia: idReferencia
        };

        // Guardar el evento localmente primero (para respuesta inmediata)
        guardarEventoLocal(evento);

        // Intentar guardar en el servidor (no bloqueamos la UI esperando respuesta)
        registrarEventoServidor(evento).then(exito => {
            if (!exito) {
                console.warn('El evento no pudo guardarse en el servidor, solo está disponible localmente');
            }
        });

        return evento;
    }

    // Función para obtener eventos desde localStorage
    function obtenerEventosLocales() {
        try {
            return JSON.parse(localStorage.getItem('bitacoraEventos') || '[]');
        } catch (error) {
            console.error('Error al recuperar eventos de localStorage:', error);
            return [];
        }
    }

    // Función para obtener eventos desde el servidor
    async function obtenerEventosServidor(filtros = {}) {
        try {
            // Construir parámetros de consulta para filtros
            const params = new URLSearchParams();
            if (filtros.usuario) params.append('usuario', filtros.usuario);
            if (filtros.accion) params.append('accion', filtros.accion);
            if (filtros.entidad) params.append('entidad', filtros.entidad);
            if (filtros.fechaDesde) params.append('fechaDesde', filtros.fechaDesde);
            if (filtros.fechaHasta) params.append('fechaHasta', filtros.fechaHasta);
            
            // Obtener token de autenticación
            const token = localStorage.getItem('authToken');
            const headers = {
                'Content-Type': 'application/json'
            };
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            // Realizar petición al servidor
            const response = await fetch(`api/Bitacora/ObtenerEventos?${params.toString()}`, {
                method: 'GET',
                headers: headers
            });

            if (!response.ok) {
                throw new Error(`Error al obtener eventos: ${response.status}`);
            }

            const eventos = await response.json();
            return eventos;
        } catch (error) {
            console.error('Error al obtener eventos del servidor:', error);
            // Si hay error, devolvemos eventos locales como respaldo
            return obtenerEventosLocales();
        }
    }

    // Función para formatear la fecha en formato legible
    function formatearFecha(fechaISOString) {
        try {
            const fecha = new Date(fechaISOString);
            return fecha.toLocaleString('es-MX', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit', 
                minute: '2-digit'
            });
        } catch (error) {
            return fechaISOString;
        }
    }

    // Función para obtener tiempo relativo (hace X minutos, etc.)
    function obtenerTiempoRelativo(fechaISOString) {
        try {
            const fecha = new Date(fechaISOString);
            const ahora = new Date();
            const diferenciaMs = ahora - fecha;
            
            // Convertir a unidades de tiempo
            const segundos = Math.floor(diferenciaMs / 1000);
            const minutos = Math.floor(segundos / 60);
            const horas = Math.floor(minutos / 60);
            const dias = Math.floor(horas / 24);
            
            // Retornar texto según la diferencia
            if (segundos < 60) {
                return "Hace unos segundos";
            } else if (minutos < 60) {
                return minutos === 1 ? "Hace 1 minuto" : `Hace ${minutos} minutos`;
            } else if (horas < 24) {
                return horas === 1 ? "Hace 1 hora" : `Hace ${horas} horas`;
            } else if (dias < 7) {
                return dias === 1 ? "Hace 1 día" : `Hace ${dias} días`;
            } else {
                return formatearFecha(fechaISOString);
            }
        } catch (error) {
            return fechaISOString;
        }
    }

    // Funciones públicas del servicio
    return {
        ACCION,
        ENTIDAD,
        registrarAccion,
        obtenerEventosLocales,
        obtenerEventosServidor,
        formatearFecha,
        obtenerTiempoRelativo
    };
})();

// Exponer el servicio globalmente
window.BitacoraService = BitacoraService;