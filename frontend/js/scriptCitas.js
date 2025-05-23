// Wrap entire script in an IIFE to avoid global variable conflicts
(function() {
  // ========================
  // Variables globales
  // ========================
  let citasPorFiltro = {
    hoy: [],
    manana: [],
    semana: []
  };

  let todasLasCitas = [];
  let citaSeleccionada = null;
  let tipoBusqueda = 'paciente';
  let filtroActual = 'todos';

  // ========================
  // Cargar citas desde la API
  // ========================
  async function cargarCitasDesdeAPI() {
    try {
      console.log('Obteniendo citas desde la API...');
      const citas = await window.apiService.citas.getAll();
      console.log('Citas recibidas de la API:', citas);

      if (!Array.isArray(citas)) {
        console.error('Error: La API no devolvió un array de citas');
        return false;
      }

      // Reiniciar el objeto de citasPorFiltro
      citasPorFiltro = {
        hoy: [],
        manana: [],
        semana: []
      };

      // Guardar todas las citas
      todasLasCitas = [...citas];

      // Obtener las fechas para cada filtro en la zona horaria local
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      const manana = new Date(hoy);
      manana.setDate(manana.getDate() + 1);
      
      const finSemana = new Date(hoy);
      finSemana.setDate(finSemana.getDate() + 7);

      console.log('Fechas de filtro:', {
        hoy: hoy.toLocaleDateString(),
        manana: manana.toLocaleDateString(),
        finSemana: finSemana.toLocaleDateString()
      });

      // Clasificar las citas según su fecha
      citas.forEach((cita, index) => {
        console.log(`\nProcesando cita ${index + 1}:`, cita);
        
        // Convertir la fecha de la cita a un objeto Date en la zona horaria local
        const fechaStr = cita.Fecha_Cita ? cita.Fecha_Cita.split('T')[0] : null;
        if (!fechaStr) {
          console.warn(`La cita ${cita.ID_Cita} no tiene una fecha válida`);
          return;
        }

        const fechaCita = new Date(fechaStr + 'T00:00:00');
        fechaCita.setHours(0, 0, 0, 0);
        
        console.log('Fecha de la cita:', fechaCita.toLocaleDateString());
        console.log('Comparando con:', {
          hoy: hoy.toLocaleDateString(),
          manana: manana.toLocaleDateString()
        });

        // Formatear la hora para mostrar
        const horaStr = cita.Hora_Cita || '00:00:00';
        const horaPartes = horaStr.split(':');
        const horaFormateada = new Date(2000, 0, 1, horaPartes[0], horaPartes[1])
          .toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

        // Crear objeto de cita con formato para mostrar
        const citaFormateada = {
          id: cita.ID_Cita,
          nombre: `${cita.NombrePaciente || ''} ${cita.ApellidoPaciente || ''}`.trim(),
          hora: horaFormateada,
          fechaHora: `${fechaCita.toLocaleDateString('es-ES')} ${horaFormateada}`,
          medico: `Dr(a). ${cita.NombreMedico || ''} ${cita.ApellidoMedico || ''}`.trim(),
          consultorio: cita.NombreConsultorio || 'No asignado',
          estatus: cita.EstatusNombre || 'Pendiente',
          fechaRegistro: cita.Fecha_Creacion ? new Date(cita.Fecha_Creacion).toLocaleDateString('es-ES') : 'N/D',
          ultimaActualizacion: cita.Ultima_Actualizacion ? new Date(cita.Ultima_Actualizacion).toLocaleDateString('es-ES') : 'N/D',
          id_Paciente: cita.ID_Paciente,
          id_Medico: cita.ID_Medico,
          id_Consultorio: cita.ID_Consultorio,
          id_Estatus: cita.ID_Estatus,
          fecha_Cita: cita.Fecha_Cita,
          hora_Cita: cita.Hora_Cita
        };

        // Clasificar según la fecha usando getTime() para comparación
        if (fechaCita.getTime() === hoy.getTime()) {
          console.log('Agregando cita a "hoy"');
          citasPorFiltro.hoy.push(citaFormateada);
        } else if (fechaCita.getTime() === manana.getTime()) {
          console.log('Agregando cita a "mañana"');
          citasPorFiltro.manana.push(citaFormateada);
        } else if (fechaCita > hoy && fechaCita <= finSemana) {
          console.log('Agregando cita a "semana"');
          citasPorFiltro.semana.push(citaFormateada);
        } else {
          console.log('La cita no se clasificó en ningún filtro:', {
            fecha: fechaCita.toLocaleDateString(),
            esHoy: fechaCita.getTime() === hoy.getTime(),
            esManana: fechaCita.getTime() === manana.getTime(),
            enRangoSemana: fechaCita > hoy && fechaCita <= finSemana
          });
        }
      });

      console.log('Clasificación final de citas:', {
        hoy: citasPorFiltro.hoy.length,
        manana: citasPorFiltro.manana.length,
        semana: citasPorFiltro.semana.length,
        total: citas.length
      });

      return true;
    } catch (error) {
      console.error('Error al cargar las citas:', error);
      console.error('Stack trace:', error.stack);
      alert('Ocurrió un error al cargar las citas. Por favor, intente nuevamente.');
      return false;
    }
  }
  // ========================
  // Mostrar listado de citas
  // ========================
  function mostrarListadoCitas(listaDestinoId, citas) {
    console.log(`[mostrarListadoCitas] Iniciando con destino: ${listaDestinoId}, citas:`, citas);
    
    const lista = document.getElementById(listaDestinoId);
    if (!lista) {
      console.error(`[mostrarListadoCitas] ERROR: Elemento con ID "${listaDestinoId}" no encontrado`);
      return;
    }
    
    console.log(`[mostrarListadoCitas] Elemento encontrado:`, lista);
    lista.innerHTML = '';

    if (!citas || citas.length === 0) {
      console.log(`[mostrarListadoCitas] No hay citas para mostrar. Citas recibidas:`, citas);
      lista.innerHTML = `
        <div class="empty-state">
          <iconify-icon icon="mdi:calendar-blank" width="48"></iconify-icon>
          <p>No hay citas programadas para este período</p>
        </div>`;
      return;
    }

    console.log(`[mostrarListadoCitas] Mostrando ${citas.length} citas`);
    
    citas.forEach((cita, index) => {
      console.log(`[mostrarListadoCitas] Procesando cita ${index + 1}:`, cita);
      
      const div = document.createElement('div');
      div.classList.add('cita');
      div.setAttribute('data-index', index);
      div.setAttribute('data-id', cita.id);

      // Añadir un indicador de estado visual
      const statusClass = getStatusClass(cita.estatus);
      const statusColor = getStatusColor(cita.estatus);

      div.innerHTML = `
        <div class="card-content">
          <div class="appointment-header">
            <div class="appointment-name">${cita.nombre || 'Sin nombre'}</div>
            <div class="appointment-status" style="display: flex; align-items: center;">
              <span class="circle" style="background:${statusColor}; width:10px; height:10px; border-radius:50%; display:inline-block; margin-right: 5px;"></span>
              <span>${cita.estatus || 'Pendiente'}</span>
            </div>
          </div>
          <div class="appointment-details">
            <div class="detail"><strong>Hora:</strong> ${cita.hora || 'No definida'}</div>
            <div class="detail"><strong>Médico:</strong> ${cita.medico || 'Sin asignar'}</div>
            <div class="detail"><strong>Consultorio:</strong> ${cita.consultorio || 'Sin asignar'}</div>
          </div>
        </div>
      `;      div.addEventListener('click', () => {
        seleccionarCita(div, cita);
        // El botón Modificar ha sido eliminado, solo verificamos el botón de eliminar
        const botonEliminar = document.getElementById('btnEliminarCita');
        if (botonEliminar) botonEliminar.disabled = false;
      });

      lista.appendChild(div);
      console.log(`[mostrarListadoCitas] Cita ${index + 1} agregada al DOM`);
    });
    
    console.log(`[mostrarListadoCitas] Finalizado. Total de elementos en lista:`, lista.children.length);
  }

  // Obtener clase CSS según el estado de la cita
  function getStatusClass(estatus) {
    const estado = estatus ? estatus.toLowerCase() : '';
    
    if (estado.includes('confirmada')) return 'confirmada';
    if (estado.includes('pendiente')) return 'pendiente';
    if (estado.includes('cancelada')) return 'cancelada';
    if (estado.includes('completada')) return 'completada';
    
    return 'pendiente'; // Estado por defecto
  }

  // Obtener color según el estado de la cita
  function getStatusColor(estatus) {
    const estado = estatus ? estatus.toLowerCase() : '';
    
    if (estado.includes('confirmada')) return '#28a745';
    if (estado.includes('pendiente')) return '#ffc107';
    if (estado.includes('cancelada')) return '#dc3545';
    if (estado.includes('completada')) return '#17a2b8';
    
    return '#6c757d'; // Color por defecto
  }

  // ========================
  // Cargar citas por filtro
  // ========================
  function cargarCitas(filtro = 'todos', destino = 'listaCitas') {
    filtroActual = filtro; // Actualizar variable global
    let citas = [];

    if (filtro === 'todos') {
      citas = Object.values(citasPorFiltro).flat();
    } else {
      citas = citasPorFiltro[filtro] || [];
    }

    console.log(`Cargando citas para filtro "${filtro}"`, citas);
    mostrarListadoCitas(destino, citas);
  }

  // ========================
  // Selección de cita
  // ========================
  function seleccionarCita(elemento, datos) {
    document.querySelectorAll('.cita').forEach(c => c.classList.remove('seleccionada'));
    elemento.classList.add('seleccionada');
    citaSeleccionada = datos;
    mostrarCitaSeleccionada(datos);
  }

  // ========================
  // Mostrar detalles de cita
  // ========================
  function mostrarCitaSeleccionada(cita) {
    const panel = document.getElementById('resultadoCita');
    if (!panel) return;

    const statusClass = getStatusClass(cita.estatus);
    const statusColor = getStatusColor(cita.estatus);

    panel.innerHTML = `
    <div class="patient-detail-card">
      <div class="card-header">
        <h3>Detalles de la Cita</h3>
        <div class="action-buttons">
          <button id="btnEditarCitaDetalle" class="btn secondary-btn">
            <iconify-icon icon="mdi:pencil"></iconify-icon> Editar
          </button>
          <button id="btnEliminarCitaDetalle" class="btn danger-btn">
            <iconify-icon icon="mdi:delete"></iconify-icon> Eliminar
          </button>
        </div>
      </div>
      
      <div class="section">
        <h4>Información Principal</h4>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">ID de Cita:</span>
            <span class="value">${cita.id || 'N/D'}</span>
          </div>
          <div class="info-item">
            <span class="label">Estado:</span>
            <span class="value status" style="display: flex; align-items: center;">
              <span class="circle" style="background:${statusColor}; width:10px; height:10px; border-radius:50%; display:inline-block; margin-right: 5px;"></span>
              <span>${cita.estatus || 'Pendiente'}</span>
            </span>
          </div>
          <div class="info-item">
            <span class="label">Fecha de Registro:</span>
            <span class="value">${cita.fechaRegistro || 'N/D'}</span>
          </div>
        </div>
      </div>
      
      <div class="section">
        <h4>Detalles de la Cita</h4>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">Paciente:</span>
            <span class="value">${cita.nombre || 'No registrado'}</span>
          </div>
          <div class="info-item">
            <span class="label">Fecha y Hora:</span>
            <span class="value">${cita.fechaHora || 'No especificada'}</span>
          </div>
          <div class="info-item">
            <span class="label">Médico Asignado:</span>
            <span class="value">${cita.medico || 'Sin asignar'}</span>
          </div>
          <div class="info-item">
            <span class="label">Consultorio:</span>
            <span class="value">${cita.consultorio || 'Sin asignar'}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <h4>Información Adicional</h4>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">Última Actualización:</span>
            <span class="value">${cita.ultimaActualizacion || 'N/D'}</span>
          </div>
        </div>
      </div>
    </div>
    `;

    // Configurar botones de acción en los detalles
    document.getElementById('btnEditarCitaDetalle')?.addEventListener('click', () => {
      abrirModalEditarCita(cita);
    });

    document.getElementById('btnEliminarCitaDetalle')?.addEventListener('click', () => {
      confirmarEliminarCita(cita);
    });
  }

  // ========================
  // Búsqueda de cita
  // ========================
  function buscarCita() {
    const input = document.getElementById('busquedaCita');
    const panel = document.getElementById('resultadoCita');
    const botonModificar = document.getElementById('btnModificarCita');
    const botonEliminar = document.getElementById('btnEliminarCita');
    
    if (!input || !panel) return;

    const texto = input.value.trim().toLowerCase();
    const todas = Object.values(citasPorFiltro).flat();
      
    let resultado = null;

    if (tipoBusqueda === 'paciente') {
      resultado = todas.find(cita => cita.nombre.toLowerCase().includes(texto));
    } else if (tipoBusqueda === 'medico') {
      resultado = todas.find(cita => cita.medico.toLowerCase().includes(texto));
    }

    if (resultado) {
      mostrarCitaSeleccionada(resultado);
      citaSeleccionada = resultado;
      if (botonModificar) botonModificar.disabled = false;
      if (botonEliminar) botonEliminar.disabled = false;
    } else {
      panel.innerHTML = `<p>No se encontró ninguna coincidencia.</p>`;
      if (botonModificar) botonModificar.disabled = true;
      if (botonEliminar) botonEliminar.disabled = true;
    }
  }

  // ========================
  // Eliminar Cita
  // ========================
  function confirmarEliminarCita(cita) {
    if (!cita || !cita.id) {
      mostrarNotificacion('No se ha seleccionado una cita válida para eliminar.', 'error');
      return;
    }

    if (confirm(`¿Está seguro que desea eliminar la cita de ${cita.nombre}?\nEsta acción no se puede deshacer.`)) {
      eliminarCita(cita.id);
    }
  }

  async function eliminarCita(idCita) {
    try {
      console.log('Eliminando cita:', idCita);
      await window.apiService.citas.delete(idCita);
      
      // Mostrar notificación de éxito
      mostrarNotificacion('La cita ha sido eliminada correctamente', 'success');
      
      // Recargar los datos y actualizar la interfaz
      await cargarCitasDesdeAPI();
      cargarCitas(filtroActual);
      
      // Limpiar el panel de detalles
      const panel = document.getElementById('resultadoCita');
      if (panel) {
        panel.innerHTML = `
          <div class="empty-state">
            <iconify-icon icon="mdi:calendar-search" width="48"></iconify-icon>
            <p>Seleccione una cita para ver los detalles</p>
          </div>`;
      }
      
      // Deshabilitar botones
      const botonModificar = document.getElementById('btnModificarCita');
      const botonEliminar = document.getElementById('btnEliminarCita');
      if (botonModificar) botonModificar.disabled = true;
      if (botonEliminar) botonEliminar.disabled = true;
      
      citaSeleccionada = null;
    } catch (error) {
      console.error('Error al eliminar la cita:', error);
      mostrarNotificacion('Error al eliminar la cita: ' + error.message, 'error');
    }
  }

  function mostrarNotificacion(mensaje, tipo = 'info') {
    // Crear el contenedor de la notificación si no existe
    let notificacionesContainer = document.getElementById('notificacionesContainer');
    if (!notificacionesContainer) {
      notificacionesContainer = document.createElement('div');
      notificacionesContainer.id = 'notificacionesContainer';
      notificacionesContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
      `;
      document.body.appendChild(notificacionesContainer);
    }

    // Crear la notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    notificacion.style.cssText = `
      padding: 15px 20px;
      margin-bottom: 10px;
      border-radius: 4px;
      background-color: ${tipo === 'success' ? '#d4edda' : tipo === 'error' ? '#f8d7da' : '#d1ecf1'};
      color: ${tipo === 'success' ? '#155724' : tipo === 'error' ? '#721c24' : '#0c5460'};
      border: 1px solid ${tipo === 'success' ? '#c3e6cb' : tipo === 'error' ? '#f5c6cb' : '#bee5eb'};
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      min-width: 300px;
    `;

    // Agregar ícono según el tipo
    const icono = tipo === 'success' ? 'mdi:check-circle' : tipo === 'error' ? 'mdi:alert-circle' : 'mdi:information';
    notificacion.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <iconify-icon icon="${icono}"></iconify-icon>
        <span>${mensaje}</span>
      </div>
    `;

    // Agregar la notificación al contenedor
    notificacionesContainer.appendChild(notificacion);

    // Remover la notificación después de 5 segundos
    setTimeout(() => {
      notificacion.style.opacity = '0';
      notificacion.style.transition = 'opacity 0.5s ease';
      setTimeout(() => notificacionesContainer.removeChild(notificacion), 500);
    }, 5000);
  }

  // ========================
  // Editar Cita - Modal
  // ========================
  async function abrirModalEditarCita(cita) {
    try {
      if (!cita || !cita.id) {
        mostrarNotificacion('No se ha seleccionado una cita válida para editar.', 'error');
        return;
      }

      // Obtener datos necesarios para el formulario
      const [doctores, consultorios, estatusCitas] = await Promise.all([
        window.apiService.medicos.getAll(),
        window.apiService.consultorios.getAll(),
        window.apiService.catalogos.getEstatusCitas()
      ]);

      // Crear modal
      const modal = document.createElement('div');
      modal.classList.add('modal');
      modal.innerHTML = `
        <div class="modal-contenido">
          <div class="modal-cabecera">
            <h3>Editar Cita</h3>
            <button class="cerrar-modal">&times;</button>
          </div>
          <div class="modal-cuerpo">
            <form id="formEditarCita" class="form-grid">
              <input type="hidden" id="idCita" value="${cita.id}">
              
              <div class="campo">
                <label for="editPaciente">Paciente:</label>
                <div class="input-readonly">
                  <iconify-icon icon="mdi:account"></iconify-icon>
                  <input type="text" id="editPaciente" value="${cita.nombre}" readonly>
                  <input type="hidden" id="idPaciente" value="${cita.id_Paciente}">
                </div>
              </div>
              
              <div class="campo">
                <label for="editMedico">Médico:</label>
                <div class="select-container">
                  <iconify-icon icon="healthicons:doctor"></iconify-icon>
                  <select id="editMedico" required>
                    <option value="">Seleccione un médico...</option>
                    ${doctores.map(doctor => {
                      const id = doctor.id_Medico || doctor.ID_Medico;
                      const nombre = doctor.nombre || doctor.Nombre || '';
                      const apellido = doctor.apellido_Paterno || doctor.Apellido_Paterno || '';
                      return `<option value="${id}" ${id == cita.id_Medico ? 'selected' : ''}>
                        Dr(a). ${nombre} ${apellido}
                      </option>`;
                    }).join('')}
                  </select>
                </div>
              </div>
              
              <div class="campo">
                <label for="editConsultorio">Consultorio:</label>
                <div class="select-container">
                  <iconify-icon icon="healthicons:hospital"></iconify-icon>
                  <select id="editConsultorio" required>
                    <option value="">Seleccione un consultorio...</option>
                    ${consultorios.map(consultorio => {
                      const id = consultorio.id_Consultorio || consultorio.ID_Consultorio;
                      const nombre = consultorio.nombre_Consultorio || consultorio.Nombre_Consultorio || `Consultorio ${id}`;
                      return `<option value="${id}" ${id == cita.id_Consultorio ? 'selected' : ''}>
                        ${nombre}
                      </option>`;
                    }).join('')}
                  </select>
                </div>
              </div>
              
              <div class="campo">
                <label for="editFecha">Fecha:</label>
                <div class="input-container">
                  <iconify-icon icon="mdi:calendar"></iconify-icon>
                  <input type="date" id="editFecha" value="${cita.fecha_Cita ? cita.fecha_Cita.split('T')[0] : ''}" required>
                </div>
              </div>
              
              <div class="campo">
                <label for="editHora">Hora:</label>
                <div class="input-container">
                  <iconify-icon icon="mdi:clock"></iconify-icon>
                  <input type="time" id="editHora" value="${cita.hora_Cita ? cita.hora_Cita.substring(0, 5) : ''}" required>
                </div>
              </div>
              
              <div class="campo">
                <label for="editEstatus">Estado:</label>
                <div class="select-container">
                  <iconify-icon icon="mdi:flag"></iconify-icon>
                  <select id="editEstatus" required>
                    <option value="">Seleccione un estado...</option>
                    ${estatusCitas.map(estatus => {
                      const id = estatus.ID_Estatus || estatus.id_Estatus;
                      const nombre = estatus.Nombre_Estatus || estatus.nombre_Estatus || '';
                      return `<option value="${id}" ${id == cita.id_Estatus ? 'selected' : ''}>
                        ${nombre}
                      </option>`;
                    }).join('')}
                  </select>
                </div>
              </div>
              
              <div class="botones">
                <button type="button" class="btn secondary-btn cancelar-modal">
                  <iconify-icon icon="mdi:close"></iconify-icon>
                  Cancelar
                </button>
                <button type="submit" class="btn primary-btn">
                  <iconify-icon icon="mdi:content-save"></iconify-icon>
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      `;

      // Añadir modal al documento
      document.body.appendChild(modal);

      // Estilo para el modal
      const style = document.createElement('style');
      style.textContent = `
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .modal-contenido {
          background-color: white;
          border-radius: 8px;
          width: 90%;
          max-width: 600px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        
        .modal-cabecera {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid #ddd;
        }
        
        .modal-cabecera h3 {
          margin: 0;
          font-size: 1.25rem;
        }
        
        .cerrar-modal {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0;
          color: #666;
        }
        
        .modal-cuerpo {
          padding: 1.5rem;
        }
        
        .form-grid {
          display: grid;
          gap: 1rem;
        }
        
        .campo {
          margin-bottom: 1rem;
        }
        
        .campo label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #333;
        }
        
        .input-container,
        .select-container,
        .input-readonly {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border: 1px solid #ddd;
          padding: 0.5rem;
          border-radius: 4px;
          background: white;
        }
        
        .input-readonly {
          background: #f8f9fa;
        }
        
        .input-container input,
        .select-container select,
        .input-readonly input {
          border: none;
          outline: none;
          width: 100%;
          background: transparent;
        }
        
        .input-container:focus-within,
        .select-container:focus-within {
          border-color: #6c2bd9;
          box-shadow: 0 0 0 2px rgba(108, 43, 217, 0.1);
        }
        
        .botones {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }
        
        .btn iconify-icon {
          font-size: 1.25rem;
        }
        
        .primary-btn {
          background-color: #6c2bd9;
          color: white;
          border: none;
        }
        
        .primary-btn:hover {
          background-color: #5a23b6;
        }
        
        .secondary-btn {
          background-color: #e9ecef;
          color: #333;
          border: 1px solid #ddd;
        }
        
        .secondary-btn:hover {
          background-color: #dde2e6;
        }
      `;
      document.head.appendChild(style);

      // Configurar eventos
      const cerrarModal = () => {
        document.body.removeChild(modal);
        document.head.removeChild(style);
      };

      modal.querySelector('.cerrar-modal').addEventListener('click', cerrarModal);
      modal.querySelector('.cancelar-modal').addEventListener('click', cerrarModal);

      // Validar fecha y hora al enviar el formulario
      modal.querySelector('#formEditarCita').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const fecha = document.getElementById('editFecha').value;
        const hora = document.getElementById('editHora').value;
        const fechaHora = new Date(`${fecha}T${hora}`);
        const ahora = new Date();
        
        if (fechaHora < ahora) {
          mostrarNotificacion('No se puede agendar una cita en el pasado', 'error');
          return;
        }

        try {
          // Obtener valores del formulario
          const datosActualizados = {
            ID_Medico: parseInt(document.getElementById('editMedico').value),
            ID_Consultorio: parseInt(document.getElementById('editConsultorio').value),
            Fecha_Cita: fecha,
            Hora_Cita: hora + ':00',
            ID_Estatus: parseInt(document.getElementById('editEstatus').value)
          };
          
          // Enviar datos a la API
          const idCita = parseInt(document.getElementById('idCita').value);
          await window.apiService.citas.update(idCita, datosActualizados);
          
          mostrarNotificacion('La cita ha sido actualizada correctamente', 'success');
          cerrarModal();
          
          // Recargar los datos y actualizar la interfaz
          await cargarCitasDesdeAPI();
          cargarCitas(filtroActual);
          
          // Limpiar selección
          citaSeleccionada = null;
          document.getElementById('resultadoCita').innerHTML = `
            <div class="empty-state">
              <iconify-icon icon="mdi:calendar-search" width="48"></iconify-icon>
              <p>Seleccione una cita para ver los detalles</p>
            </div>`;
          
          // Deshabilitar botones
          const botonModificar = document.getElementById('btnModificarCita');
          const botonEliminar = document.getElementById('btnEliminarCita');
          if (botonModificar) botonModificar.disabled = true;
          if (botonEliminar) botonEliminar.disabled = true;
        } catch (error) {
          console.error('Error al actualizar la cita:', error);
          mostrarNotificacion('Error al actualizar la cita: ' + error.message, 'error');
        }
      });
    } catch (error) {
      console.error('Error al abrir el modal de edición:', error);
      mostrarNotificacion('Error al cargar el formulario de edición', 'error');
    }
  }

  // ========================
  // Inicialización general
  // ========================
  document.addEventListener('DOMContentLoaded', async function () {
    console.log('DOM cargado, inicializando módulo de citas');
    
    try {
      // Cargar citas desde la API
      const citasCargadas = await cargarCitasDesdeAPI();
      console.log('¿Se cargaron las citas?', citasCargadas);
      
      // Cargar citas del módulo
      if (document.getElementById('listaCitas')) {
        cargarCitas('todos');
        
        // Configurar botones de filtro
        document.querySelectorAll('.filtro-fecha').forEach(btn => {
          btn.addEventListener('click', () => {
            document.querySelectorAll('.filtro-fecha').forEach(b => b.classList.remove('activo'));
            btn.classList.add('activo');
            const filtro = btn.getAttribute('data-filtro');
            cargarCitas(filtro);
            document.getElementById('resultadoCita').innerHTML = `
              <div class="empty-state">
                <iconify-icon icon="mdi:calendar-search" width="48"></iconify-icon>
                <p>Seleccione una cita para ver los detalles</p>
              </div>`;
            const botonModificar = document.getElementById('btnModificarCita');
            const botonEliminar = document.getElementById('btnEliminarCita');
            if (botonModificar) botonModificar.disabled = true;
            if (botonEliminar) botonEliminar.disabled = true;
          });
        });

        // Buscar por enter
        const inputBusqueda = document.getElementById('busquedaCita');
        if (inputBusqueda) {
          inputBusqueda.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
              e.preventDefault();
              buscarCita();
            }
          });
        }

        // Botón buscar manual
        const btnBuscar = document.getElementById('btnBuscar');
        if (btnBuscar) {
          btnBuscar.addEventListener('click', buscarCita);
        }

        // Alternar filtro de búsqueda
        const filtrosBusqueda = document.querySelectorAll('.filter-option');
        filtrosBusqueda.forEach(filtro => {
          filtro.addEventListener('click', () => {
            filtrosBusqueda.forEach(f => f.classList.remove('activo'));
            filtro.classList.add('activo');
            tipoBusqueda = filtro.getAttribute('data-filtro');
          });
        });
        
        // Configurar botón modificar
        const btnModificar = document.getElementById('btnModificarCita');
        if (btnModificar) {
          btnModificar.addEventListener('click', () => {
            if (citaSeleccionada) {
              abrirModalEditarCita(citaSeleccionada);
            } else {
              alert('Por favor, seleccione una cita para modificar.');
            }
          });
        }
        
        // Configurar botón eliminar
        const btnEliminar = document.getElementById('btnEliminarCita');
        if (btnEliminar) {
          btnEliminar.addEventListener('click', () => {
            if (citaSeleccionada) {
              confirmarEliminarCita(citaSeleccionada);
            } else {
              alert('Por favor, seleccione una cita para eliminar.');
            }
          });
        }
      }

      // Dashboard: solo mostrar citas de hoy
      const contenedorCitasHome = document.getElementById('citasListaHoy');
      if (contenedorCitasHome) {
        console.log('Mostrando citas de hoy en dashboard:', citasPorFiltro.hoy);
        mostrarListadoCitas('citasListaHoy', citasPorFiltro.hoy);
      }
    } catch (error) {      console.error('Error en inicialización del módulo de citas:', error);
    }
  });

  // Exponer funciones al contexto global para permitir su uso desde otros scripts
  window.cargarCitasDesdeAPI = cargarCitasDesdeAPI;
  window.cargarCitas = cargarCitas;
  
})(); // Cierre correcto del IIFE