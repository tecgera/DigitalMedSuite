// ========================
// Gestión de pacientes con API real
// ========================
const moduloPacientes = {
    pacientes: [],
    pacienteSeleccionado: null,
    modoEdicion: false,
    filtroActual: 'todos'
};

// ========================
// Cargar pacientes
// ========================
async function cargarPacientes() {
  const lista = document.getElementById('listaPacientes');
  if (!lista) return;

  try {
    // Mostrar indicador de carga
    lista.innerHTML = `
      <div class="loading-indicator">
        <iconify-icon icon="mdi:loading" width="48" class="spin"></iconify-icon>
        <p>Cargando pacientes...</p>
      </div>
    `;    // Obtener pacientes desde la API
    const response = await window.apiService.pacientes.getAll();
    console.log('Respuesta del servidor:', response);
    pacientes = response || [];

    lista.innerHTML = '';
    const filtrados = filtroActual === 'todos'
      ? pacientes
      : pacientes.filter(p => p.EstatusNombre?.toLowerCase() === filtroActual.toLowerCase());

    if (filtrados.length === 0) {
      lista.innerHTML = `
        <div class="empty-state">
          <iconify-icon icon="mdi:account-off" width="48"></iconify-icon>
          <p>No hay pacientes registrados</p>
        </div>`;
      return;
    }    filtrados.forEach((paciente) => {
      const div = document.createElement('div');
      div.classList.add('cita');
      div.setAttribute('data-id', paciente.ID_Paciente);
      const color = obtenerColorPorEstatus(paciente.ID_Estatus);
      
      div.innerHTML = `
        <div class="card-content">
          <div class="patient-header">
            <div class="patient-name">${paciente.Nombre} ${paciente.Apellido_Paterno} ${paciente.Apellido_Materno || ''}</div>
            <div class="patient-status" style="display: flex; align-items: center;">
              <span class="circle" style="background:${color}; width:10px; height:10px; border-radius:50%; display:inline-block; margin-right: 5px;"></span>
              <span>${paciente.EstatusNombre || 'Desconocido'}</span>
            </div>
          </div>
          <div class="patient-details">
            <div class="detail"><strong>ID:</strong> ${paciente.ID_Paciente}</div>
            <div class="detail"><strong>Correo:</strong> ${paciente.Correo_Electronico || 'No registrado'}</div>
            <div class="detail"><strong>Teléfono:</strong> ${paciente.Telefono || 'No registrado'}</div>
          </div>
        </div>
      `;

      div.addEventListener('click', () => seleccionarPaciente(div, paciente));
      lista.appendChild(div);
    });
  } catch (error) {
    console.error('Error al cargar pacientes:', error);
    lista.innerHTML = `
      <div class="error-state">
        <iconify-icon icon="mdi:alert-circle" width="48"></iconify-icon>
        <p>Error al cargar pacientes: ${error.message}</p>
        <button class="btn secondary-btn" onclick="cargarPacientes()">
          <iconify-icon icon="mdi:refresh"></iconify-icon> Reintentar
        </button>
      </div>
    `;
  }
}

// ========================
// Obtener color por estatus
// ========================
function obtenerColorPorEstatus(idEstatus) {
  // Si no hay ID_Estatus, devolver gris
  if (!idEstatus) return '#6c757d';

  switch (idEstatus) {
    case 1: // Activo
      return '#28a745';  // Verde
    case 2: // Inactivo
      return '#dc3545';  // Rojo
    case 3: // Pendiente
      return '#ffc107';  // Amarillo
    default:
      return '#6c757d';  // Gris por defecto
  }
}

// ========================
// Seleccionar paciente
// ========================
function seleccionarPaciente(elemento, datos) {
  document.querySelectorAll('.cita').forEach(c => c.classList.remove('seleccionada'));
  elemento.classList.add('seleccionada');
  pacienteSeleccionado = datos;
  mostrarPacienteSeleccionado(datos);
    // Ya no es necesario habilitar el botón "Modificar" porque fue eliminado
  // El botón "Editar" dentro de los detalles del paciente cumple esta función
}

// ========================
// Mostrar paciente seleccionado
// ========================
function mostrarPacienteSeleccionado(paciente) {
  const panelResultado = document.getElementById('resultadoPacientes');
  if (!panelResultado) return;

  // Formatear fecha de nacimiento si existe
  let fechaNacimiento = 'No registrada';
  if (paciente.Fecha_Nacimiento) {
    const fecha = new Date(paciente.Fecha_Nacimiento);
    fechaNacimiento = fecha.toLocaleDateString();
  }

  // Formatear fecha de registro
  let fechaRegistro = 'Desconocida';
  if (paciente.Fecha_Registro) {
    const fecha = new Date(paciente.Fecha_Registro);
    fechaRegistro = fecha.toLocaleDateString();
  }
  
  const color = obtenerColorPorEstatus(paciente.ID_Estatus);

  panelResultado.innerHTML = `
    <div class="patient-detail-card">
      <div class="card-header">
        <h3>Detalles del Paciente</h3>
        <div class="action-buttons">
          <button id="btnEditarPaciente" class="btn secondary-btn" ${modoEdicion ? 'style="display:none"' : ''}>
            <iconify-icon icon="mdi:pencil"></iconify-icon> Editar
          </button>
          <button id="btnEliminarPaciente" class="btn danger-btn" ${modoEdicion ? 'style="display:none"' : ''}>
            <iconify-icon icon="mdi:delete"></iconify-icon> Eliminar
          </button>
        </div>
      </div>
      
      <div class="section">
        <h4>Información Personal</h4>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">Nombre:</span>
            <span class="value">${paciente.Nombre} ${paciente.Apellido_Paterno} ${paciente.Apellido_Materno || ''}</span>
          </div>
          <div class="info-item">
            <span class="label">CURP:</span>
            <span class="value">${paciente.CURP || 'No registrado'}</span>
          </div>
          <div class="info-item">
            <span class="label">Fecha de Nacimiento:</span>
            <span class="value">${fechaNacimiento}</span>
          </div>
          <div class="info-item">
            <span class="label">Género:</span>
            <span class="value">${paciente.GeneroNombre || 'No registrado'}</span>
          </div>
          <div class="info-item">
            <span class="label">Estatus:</span>
            <span class="value status" style="display: flex; align-items: center;">
              <span class="circle" style="background:${color}; width:10px; height:10px; border-radius:50%; display:inline-block; margin-right: 5px;"></span>
              <span>${paciente.EstatusNombre || 'Desconocido'}</span>
            </span>
          </div>
          <div class="info-item">
            <span class="label">Fecha de Registro:</span>
            <span class="value">${fechaRegistro}</span>
          </div>
        </div>
      </div>
      
      <div class="section">
        <h4>Contacto</h4>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">Correo Electrónico:</span>
            <span class="value">${paciente.Correo_Electronico || 'No registrado'}</span>
          </div>
          <div class="info-item">
            <span class="label">Teléfono:</span>
            <span class="value">${paciente.Telefono || 'No registrado'}</span>
          </div>
          <div class="info-item">
            <span class="label">Dirección:</span>
            <span class="value">${paciente.Calle ? `${paciente.Calle} ${paciente.Num_Calle || ''}, CP: ${paciente.Codigo_Postal || 'No registrado'}` : 'No registrada'}</span>
          </div>
        </div>
      </div>
      
      <div class="section">
        <h4>Información Médica</h4>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">Tipo de Sangre:</span>
            <span class="value">${paciente.TipoSangreNombre || 'No registrado'}</span>
          </div>
          <div class="info-item">
            <span class="label">Altura:</span>
            <span class="value">${paciente.Altura ? `${paciente.Altura} cm` : 'No registrada'}</span>
          </div>
          <div class="info-item">
            <span class="label">Peso:</span>
            <span class="value">${paciente.Peso ? `${paciente.Peso} kg` : 'No registrado'}</span>
          </div>
          <div class="info-item">
            <span class="label">Alergias:</span>
            <span class="value">${paciente.AlergiaNombre || 'Ninguna registrada'}</span>
          </div>
          <div class="info-item">
            <span class="label">Operaciones:</span>
            <span class="value">${paciente.OperacionNombre || 'Ninguna registrada'}</span>
          </div>
          <div class="info-item">
            <span class="label">Padecimientos:</span>
            <span class="value">${paciente.PadecimientoNombre || 'Ninguno registrado'}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // Agregar eventos a los botones
  document.getElementById('btnEditarPaciente')?.addEventListener('click', () => editarPaciente(paciente));
  document.getElementById('btnEliminarPaciente')?.addEventListener('click', () => confirmarEliminarPaciente(paciente));
}

// ========================
// Editar paciente
// ========================
function editarPaciente(paciente) {
  showPage('registroPacientes');
  
  // Utilizamos la función global para editar el paciente
  if (typeof window.editarPaciente === 'function') {
    window.editarPaciente(paciente);
  }
}

// ========================
// Confirmar eliminación
// ========================
function confirmarEliminarPaciente(paciente) {
  if (!confirm(`¿Está seguro que desea eliminar al paciente ${paciente.Nombre} ${paciente.Apellido_Paterno}?`)) {
    return;
  }
  
  eliminarPaciente(paciente.ID_Paciente);
}

// ========================
// Eliminar paciente
// ========================
async function eliminarPaciente(id) {
  if (!id) return;
  
  try {
    // Intentar eliminar en el servidor
    await window.apiService.pacientes.delete(id);
    
    // Actualizar la lista local
    pacientes = pacientes.filter(p => p.ID_Paciente !== id);
    
    // Si el paciente eliminado era el que estaba seleccionado, limpiar la selección
    if (pacienteSeleccionado && pacienteSeleccionado.ID_Paciente === id) {
      pacienteSeleccionado = null;
      const panel = document.getElementById("resultadoPacientes");
      if (panel) {
        panel.innerHTML = `<div class="empty-state">
          <iconify-icon icon="mdi:information-outline" width="48"></iconify-icon>
          <p>Seleccione un paciente para ver los detalles</p>
        </div>`;
      }
    }
    
    // Recargar la lista
    await cargarPacientes();
    
    // Mostrar notificación
    mostrarNotificacion("Paciente eliminado correctamente", "success");
  } catch (error) {
    console.error('Error al eliminar paciente:', error);
    mostrarNotificacion("Error al eliminar paciente: " + error.message, "error");
  }
}

// ========================
// Filtrar pacientes
// ========================
function filtrarPacientes(query) {
  if (!pacientes.length) return;
  
  const filtrados = pacientes.filter(p => {
    const nombreCompleto = `${p.Nombre} ${p.Apellido_Paterno} ${p.Apellido_Materno || ''}`.toLowerCase();
    return nombreCompleto.includes(query.toLowerCase()) || 
           (p.CURP && p.CURP.toLowerCase().includes(query.toLowerCase()));
  });
  
  mostrarPacientesEnLista(filtrados);
}

// ========================
// Mostrar pacientes en lista
// ========================
function mostrarPacientesEnLista(pacientesFiltrados) {
  const lista = document.getElementById('listaPacientes');
  if (!lista) return;
  
  lista.innerHTML = '';
  
  if (pacientesFiltrados.length === 0) {
    lista.innerHTML = `
      <div class="empty-state">
        <iconify-icon icon="mdi:account-search" width="48"></iconify-icon>
        <p>No se encontraron pacientes con ese criterio</p>
      </div>`;
    return;
  }
    pacientesFiltrados.forEach((paciente) => {
    const div = document.createElement('div');
    div.classList.add('cita');
    div.setAttribute('data-id', paciente.ID_Paciente);
    const color = obtenerColorPorEstatus(paciente.ID_Estatus);
    
    div.innerHTML = `
      <div class="card-content">
        <div class="patient-header">
          <div class="patient-name">${paciente.Nombre} ${paciente.Apellido_Paterno} ${paciente.Apellido_Materno || ''}</div>
          <div class="patient-status" style="display: flex; align-items: center;">
            <span class="circle" style="background:${color}; width:10px; height:10px; border-radius:50%; display:inline-block; margin-right: 5px;"></span>
            <span>${paciente.EstatusNombre || 'Desconocido'}</span>
          </div>
        </div>
        <div class="patient-details">
          <div class="detail"><strong>ID:</strong> ${paciente.ID_Paciente}</div>
          <div class="detail"><strong>Correo:</strong> ${paciente.Correo_Electronico || 'No registrado'}</div>
          <div class="detail"><strong>Teléfono:</strong> ${paciente.Telefono || 'No registrado'}</div>
        </div>
      </div>
    `;

    div.addEventListener('click', () => seleccionarPaciente(div, paciente));
    lista.appendChild(div);
  });
}

// ========================
// Mostrar notificación
// ========================
function mostrarNotificacion(mensaje, tipo = 'info') {
  // No llamar recursivamente a la función global si tiene el mismo nombre
  const notificacionGlobal = window.mostrarNotificacion;
  if (typeof notificacionGlobal === 'function' && notificacionGlobal !== mostrarNotificacion) {
    notificacionGlobal(mensaje, tipo);
  } else {
    alert(mensaje);
  }
}

// ========================
// Inicialización
// ========================
document.addEventListener("DOMContentLoaded", () => {
  // Cargar pacientes al iniciar
  cargarPacientes();
  
  // Configurar búsqueda si existe el campo
  const campoBusqueda = document.getElementById("buscarPaciente");
  if (campoBusqueda) {
    campoBusqueda.addEventListener("input", (e) => {
      filtrarPacientes(e.target.value);
    });
  }
  
  // Configurar filtros
  const filtros = document.querySelectorAll('.filtro-paciente-btn');
  if (filtros && filtros.length > 0) {
    filtros.forEach(btn => {
      btn.addEventListener('click', () => {
        filtros.forEach(b => b.classList.remove('activo'));
        btn.classList.add('activo');
        filtroActual = btn.dataset.estatus;
        cargarPacientes();
      });
    });
  }
  
  // Configurar botón para registrar nuevo paciente
  const btnRegistrarPaciente = document.getElementById('btnRegistrarPaciente');
  if (btnRegistrarPaciente) {
    btnRegistrarPaciente.addEventListener('click', () => {      // Aseguramos que no estemos en modo edición
      modoEdicion = false;
      pacienteSeleccionado = null;
      
      // Navegamos a la página de registro
      showPage('registroPacientes');
      
      // Limpiamos el formulario si existe
      const formulario = document.querySelector('#formPaciente');
      if (formulario) {
        formulario.reset();
      }
    });
  }
    // Ya no es necesario configurar el botón "Modificar" porque fue eliminado
  // El botón "Editar" dentro de los detalles del paciente cumple esta función
});