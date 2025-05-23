document.addEventListener('DOMContentLoaded', function () {
    // Variables para manejar el estado de la bitácora
    let eventosBitacora = [];
    let filtroActual = {
        usuario: '',
        accion: '',
        entidad: '',
        periodo: 'todos' // valores posibles: 'todos', 'hoy', 'semana', 'mes'
    };

    const listaBitacora = document.getElementById('listaBitacora');
    const btnRefrescarBitacora = document.getElementById('btnRefrescarBitacora');
    
    if (!listaBitacora) return;
    
    // Configurar el botón de refrescar
    if (btnRefrescarBitacora) {
        btnRefrescarBitacora.addEventListener('click', function() {
            // Añadir animación al botón
            this.querySelector('iconify-icon').classList.add('spin');
            
            // Cargar eventos
            cargarEventosBitacora()
                .finally(() => {
                    // Detener animación después de la carga
                    setTimeout(() => {
                        this.querySelector('iconify-icon').classList.remove('spin');
                    }, 500);
                });
        });
    }
    
    // Función para mostrar los eventos en la página
    function mostrarEventos(eventos) {
        // Limpiar la lista
        listaBitacora.innerHTML = '';
        
        // Verificar si hay eventos
        if (!eventos || eventos.length === 0) {
            listaBitacora.innerHTML = `
            <div class="empty-state">
                <iconify-icon icon="mdi:note-outline" width="48"></iconify-icon>
                <p>No hay eventos registrados en la bitácora</p>
            </div>`;
            return;
        }
        
        // Recorrer los eventos y agregarlos a la lista
        eventos.forEach(evento => {
            const li = document.createElement('li');
            li.classList.add('activity-item');
            
            // Determinar el tipo e icono según la acción
            let tipo = 'other';
            let icono = 'mdi:note-outline';
            
            if (evento.accion) {
                const accion = evento.accion.toLowerCase();
                
                if (accion.includes('creación') || accion === 'crear') {
                    tipo = 'new';
                    icono = 'mdi:plus-circle-outline';
                } else if (accion.includes('modificación') || accion === 'modificar') {
                    tipo = 'update';
                    icono = 'mdi:file-document-edit';
                } else if (accion.includes('eliminación') || accion === 'eliminar') {
                    tipo = 'delete';
                    icono = 'mdi:delete-outline';
                } else if (accion.includes('consulta') || accion === 'consultar') {
                    tipo = 'view';
                    icono = 'mdi:eye';
                } else if (accion.includes('sesión')) {
                    if (accion.includes('inicio')) {
                        tipo = 'login';
                        icono = 'mdi:login';
                    } else {
                        tipo = 'logout';
                        icono = 'mdi:logout';
                    }
                }
            }
            
            // Formatear el mensaje
            const mensaje = `${evento.accion} de ${evento.entidad}${evento.detalles ? ': ' + evento.detalles : ''}`;
            
            // Formatear el tiempo relativo
            const tiempo = window.BitacoraService ? 
                window.BitacoraService.obtenerTiempoRelativo(evento.fechaHora) : 
                new Date(evento.fechaHora).toLocaleString();
            
            // Crear el contenido HTML
            li.innerHTML = `
                <div class="activity-icon ${tipo}">
                    <iconify-icon icon="${icono}" width="16"></iconify-icon>
                </div>
                <div class="activity-details">
                    <p>${mensaje}</p>
                    <span class="activity-time">${tiempo} - <strong>${evento.usuario || 'Sistema'}</strong></span>
                </div>
            `;
            
            listaBitacora.appendChild(li);
        });
    }
    
    // Función para cargar los eventos de la bitácora
    async function cargarEventosBitacora() {
        try {
            // Mostrar indicador de carga
            listaBitacora.innerHTML = `
                <div class="loading-state">
                    <iconify-icon icon="mdi:loading" class="spin" width="48"></iconify-icon>
                    <p>Cargando registros de bitácora...</p>
                </div>
            `;
            
            // Obtenemos los eventos
            let eventos = [];
            
            // Primero intentamos obtener del servidor
            if (window.BitacoraService) {
                try {
                    const filtros = {};
                    
                    // Aplicar filtros de período
                    if (filtroActual.periodo === 'hoy') {
                        const hoy = new Date();
                        hoy.setHours(0, 0, 0, 0);
                        filtros.fechaDesde = hoy.toISOString();
                    } else if (filtroActual.periodo === 'semana') {
                        const unaSemanaAtras = new Date();
                        unaSemanaAtras.setDate(unaSemanaAtras.getDate() - 7);
                        filtros.fechaDesde = unaSemanaAtras.toISOString();
                    } else if (filtroActual.periodo === 'mes') {
                        const unMesAtras = new Date();
                        unMesAtras.setMonth(unMesAtras.getMonth() - 1);
                        filtros.fechaDesde = unMesAtras.toISOString();
                    }
                    
                    // Aplicar otros filtros
                    if (filtroActual.usuario) filtros.usuario = filtroActual.usuario;
                    if (filtroActual.accion) filtros.accion = filtroActual.accion;
                    if (filtroActual.entidad) filtros.entidad = filtroActual.entidad;
                    
                    // Intentar obtener del servidor
                    eventos = await window.BitacoraService.obtenerEventosServidor(filtros);
                } catch (error) {
                    console.error('Error al obtener eventos del servidor:', error);
                    // Si falla, usamos los eventos locales
                    eventos = window.BitacoraService.obtenerEventosLocales();
                }
            } else {
                // Si no está disponible el servicio, mostramos un error
                listaBitacora.innerHTML = `
                    <div class="error-state">
                        <iconify-icon icon="mdi:alert-circle" width="48"></iconify-icon>
                        <p>No se pudo cargar el servicio de bitácora</p>
                    </div>
                `;
                return;
            }
            
            // Guardamos los eventos para usarlos con los filtros
            eventosBitacora = eventos;
            
            // Mostramos los eventos
            mostrarEventos(eventos);
            
        } catch (error) {
            console.error('Error al cargar la bitácora:', error);
            listaBitacora.innerHTML = `
                <div class="error-state">
                    <iconify-icon icon="mdi:alert-circle" width="48"></iconify-icon>
                    <p>Error al cargar la bitácora: ${error.message}</p>
                </div>
            `;
        }
    }
    
    // Configurar los filtros de la interfaz
    function configurarFiltros() {
        // Filtros de período
        document.querySelectorAll('.filtro-bitacora').forEach(btn => {
            btn.addEventListener('click', function() {
                // Desactivar todos los botones
                document.querySelectorAll('.filtro-bitacora').forEach(b => {
                    b.classList.remove('activo');
                });
                
                // Activar este botón
                this.classList.add('activo');
                
                // Actualizar filtro
                filtroActual.periodo = this.dataset.filtro;
                
                // Recargar eventos
                cargarEventosBitacora();
            });
        });
        
        // Filtros de tipo de acción
        document.querySelectorAll('.filtro-tipo-bitacora').forEach(btn => {
            btn.addEventListener('click', function() {
                // Desactivar todos los botones
                document.querySelectorAll('.filtro-tipo-bitacora').forEach(b => {
                    b.classList.remove('activo');
                });
                
                // Activar este botón
                this.classList.add('activo');
                
                // Actualizar filtro
                filtroActual.accion = this.dataset.tipo === 'todos' ? '' : this.dataset.tipo;
                
                // Recargar eventos
                cargarEventosBitacora();
            });
        });
        
        // Buscador
        const buscarInput = document.getElementById('buscarBitacora');
        if (buscarInput) {
            buscarInput.addEventListener('input', function() {
                // Actualizar filtro de usuario
                filtroActual.usuario = this.value;
                
                // Debounce: esperar a que el usuario termine de escribir
                clearTimeout(this._timeoutId);
                this._timeoutId = setTimeout(() => {
                    cargarEventosBitacora();
                }, 500);
            });
        }
    }
    
    // Cargar eventos iniciales y configurar filtros
    configurarFiltros();
    cargarEventosBitacora();
    
    // Configurar recarga automática cada 2 minutos (120000 ms)
    setInterval(cargarEventosBitacora, 120000);
});