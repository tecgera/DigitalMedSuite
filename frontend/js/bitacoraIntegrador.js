// =========================================
// Integrador de Bitácora para DigitalMedSuite
// =========================================
// Este script facilita la integración del sistema de bitácora
// en todos los componentes de la aplicación.

// Asegurarse de que el servicio de bitácora esté disponible
async function asegurarServicioBitacora() {
    // Si ya existe, simplemente lo devolvemos
    if (window.BitacoraService) {
        return window.BitacoraService;
    }
    
    // Si no existe, cargamos el script
    return new Promise((resolve, reject) => {
        // Verificar si ya está cargando
        if (document.querySelector('script[src*="bitacoraService.js"]')) {
            // Ya se está cargando, esperamos a que termine
            const checkInterval = setInterval(() => {
                if (window.BitacoraService) {
                    clearInterval(checkInterval);
                    resolve(window.BitacoraService);
                }
            }, 50);
            
            // Si después de 5 segundos no ha cargado, fallamos
            setTimeout(() => {
                if (!window.BitacoraService) {
                    clearInterval(checkInterval);
                    reject(new Error('Tiempo de espera agotado para cargar BitacoraService'));
                }
            }, 5000);
            
            return;
        }
        
        // Cargar el script
        const script = document.createElement('script');
        script.src = '/frontend/js/bitacoraService.js';
        script.onload = () => {
            if (window.BitacoraService) {
                resolve(window.BitacoraService);
            } else {
                reject(new Error('No se pudo cargar BitacoraService'));
            }
        };
        script.onerror = () => {
            reject(new Error('Error al cargar BitacoraService'));
        };
        
        document.head.appendChild(script);
    });
}

// Función para registrar acciones en la bitácora desde cualquier parte de la app
async function registrarAccionBitacora(accion, entidad, detalles, idReferencia = null) {
    try {
        const bitacoraService = await asegurarServicioBitacora();
        return await bitacoraService.registrarAccion(accion, entidad, detalles, idReferencia);
    } catch (error) {
        console.error('Error al registrar acción en bitácora:', error);
        return null;
    }
}

// Función para registrar una consulta de datos en la bitácora
async function registrarConsulta(entidad, detalles, idReferencia = null) {
    try {
        const bitacoraService = await asegurarServicioBitacora();
        return await bitacoraService.registrarAccion(
            bitacoraService.ACCION.CONSULTAR, 
            entidad, 
            detalles, 
            idReferencia
        );
    } catch (error) {
        console.error('Error al registrar consulta en bitácora:', error);
        return null;
    }
}

// Exponer funciones globalmente
window.registrarAccionBitacora = registrarAccionBitacora;
window.registrarConsulta = registrarConsulta;
window.asegurarServicioBitacora = asegurarServicioBitacora;
