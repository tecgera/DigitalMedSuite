// ========================
// Gestión de médicos con API real
// ========================
let medicosList = [];
let medicoSeleccionadoActual = null;
let modoEdicionMedico = false;
let esAdminMedico = false;

// Exportando las funciones al ámbito global para que puedan ser usadas por scriptHospital.js
window.cargarMedicosAPI = cargarMedicos;
window.seleccionarMedicoAPI = seleccionarMedico;
window.mostrarMedicoSeleccionadoAPI = mostrarMedicoSeleccionado;

// Verificar si el usuario es administrador
function verificarRolAdmin() {
  const userData = window.authUtils.getUserData();
  esAdmin = userData && userData.rol === "Administrador";
}

// Cargar médicos desde la API
async function cargarMedicos() {
  try {
    verificarRolAdmin();
    
    // Mostrar indicador de carga
    document.getElementById("listaMedicos").innerHTML = `
      <div class="loading-indicator">
        <iconify-icon icon="mdi:loading" width="48" class="spin"></iconify-icon>
        <p>Cargando médicos...</p>
      </div>
    `;
    
    const medicosData = await window.apiService.medicos.getAll();
    
    if (medicosData && Array.isArray(medicosData)) {
      console.log('Datos crudos de médicos:', medicosData);
      console.log('Estructura JSON completa:', JSON.stringify(medicosData));
      
      if (medicosData.length === 0) {
        document.getElementById("listaMedicos").innerHTML = `
          <div class="empty-state">
            <iconify-icon icon="mdi:doctor" width="48"></iconify-icon>
            <p>No hay médicos registrados en el sistema</p>
          </div>
        `;
        return;
      }
      
      // Normalizar nombres de propiedades
      medicos = medicosData.map(medico => {
        console.log("Propiedades de médico:", Object.keys(medico));
        
        const medicoNormalizado = {
          id_Medico: medico.id_Medico || medico.ID_Medico || medico.idMedico,
          nombre: medico.nombre || medico.Nombre || "",
          apellido_Paterno: medico.apellido_Paterno || medico.Apellido_Paterno || "",
          apellido_Materno: medico.apellido_Materno || medico.Apellido_Materno || "",
          correo: medico.correo || medico.Correo || "",
          telefono: medico.telefono || medico.Telefono || "",
          id_Especialidad: medico.id_Especialidad || medico.ID_Especialidad || medico.idEspecialidad || 0,
          id_Estatus: medico.id_Estatus || medico.ID_Estatus || medico.idEstatus || 1,
          nombreEspecialidad: medico.nombreEspecialidad || medico.NombreEspecialidad || "Sin especialidad",
          nombreEstatus: medico.nombreEstatus || medico.NombreEstatus || "Sin estatus",
          estado: medico.estado || medico.Estado || "",
          fecha_Creacion: medico.fecha_Creacion || medico.Fecha_Creacion || new Date().toISOString()
        };
        console.log('Médico normalizado:', medicoNormalizado);
        return medicoNormalizado;
      });
      
      console.log('Médicos normalizados:', medicos);
      mostrarMedicosEnTabla(medicos);
    } else {
      console.error('Error: los datos de médicos no son válidos', medicosData);
      mostrarMensajeError('Los datos recibidos no tienen el formato esperado. Por favor, intente nuevamente.');
    }
  } catch (error) {
    console.error('Error al cargar médicos:', error);
    document.getElementById("listaMedicos").innerHTML = `
      <div class="error-state">
        <iconify-icon icon="mdi:alert-circle" width="48"></iconify-icon>
        <p>Error al cargar médicos: ${error.message}</p>
        <button class="btn secondary-btn" onclick="cargarMedicos()">
          <iconify-icon icon="mdi:refresh"></iconify-icon> Reintentar
        </button>
      </div>
    `;
  }
}

// ========================
// Mostrar médicos en la tabla
// ========================
function mostrarMedicosEnTabla(medicos) {
  const lista = document.getElementById("listaMedicos");
  const resultado = document.getElementById("resultadoMedico");
  if (!lista || !resultado) return;

  // Restablecer estados
  if (document.getElementById("btnModificarMedico")) {
    document.getElementById("btnModificarMedico").style.display = modoEdicionMedico ? "none" : "inline-flex";
    document.getElementById("btnModificarMedico").disabled = true;
  }
  if (document.getElementById("btnGuardarCambiosMedico")) {
    document.getElementById("btnGuardarCambiosMedico").style.display = modoEdicionMedico ? "inline-flex" : "none";
  }
  
  lista.innerHTML = "";
  resultado.innerHTML = `<div class="empty-state">
    <iconify-icon icon="mdi:information-outline" width="48"></iconify-icon>
    <p>Seleccione un médico para ver los detalles</p>
  </div>`;

  if (!medicos || medicos.length === 0) {
    lista.innerHTML = `<div class="empty-state">
      <iconify-icon icon="mdi:doctor" width="48"></iconify-icon>
      <p>No hay médicos registrados</p>
    </div>`;
    return;
  }

  medicos.forEach((medico) => {
    // Verificar que el médico tenga un ID
    if (!medico.id_Medico && medico.idMedico) {
      medico.id_Medico = medico.idMedico; // Normalizar
    }
    
    // Si no hay ID, intentamos asignar un valor predeterminado
    if (!medico.id_Medico) {
      console.warn('Médico sin ID encontrado, intentando recuperar ID:', medico);
      // Si estamos en modo depuración, usamos un ID ficticio para mostrar la tarjeta
      medico.id_Medico = Math.floor(Math.random() * 100) + 1000;  // ID temporal para depuración
    }
    
    const div = document.createElement("div");
    div.classList.add("cita");
    div.setAttribute("data-id", medico.id_Medico);

    // Combinar nombre completo si existe
    const nombreCompleto = [
      medico.nombre || '',
      medico.apellido_Paterno || '',
      medico.apellido_Materno || ''
    ].filter(Boolean).join(' ') || 'Sin nombre registrado';
    
    // Determinar estado para mostrar icono de estado
    let estatusColor = "gray";
    let estatusIcon = "mdi:account-question";
    
    if (medico.nombreEstatus) {
      if (medico.nombreEstatus.toLowerCase().includes('activ')) {
        estatusColor = "#28a745";
        estatusIcon = "healthicons:doctor";
      } else if (medico.nombreEstatus.toLowerCase().includes('inactiv') || 
                 medico.nombreEstatus.toLowerCase().includes('suspend')) {
        estatusColor = "#dc3545";
        estatusIcon = "healthicons:doctor-remove";
      }
    }
    
    div.innerHTML = `
      <div class="cita-header">
        <iconify-icon icon="${estatusIcon}" style="color:${estatusColor}; font-size:18px;"></iconify-icon>
        <span class="cita-id">#${medico.id_Medico}</span>
      </div>
      <div class="dato"><strong>Nombre:</strong> <span>${nombreCompleto}</span></div>
      <div class="dato"><strong>Especialidad:</strong> <span>${medico.nombreEspecialidad || "Sin especialidad"}</span></div>
      ${esAdmin ? 
        `<div class="acciones">
          <button class="btn-eliminar" data-id="${medico.id_Medico}" title="Eliminar médico">
            <iconify-icon icon="mdi:delete" width="20"></iconify-icon>
          </button>
        </div>` : ''}
    `;

    div.addEventListener("click", (e) => {
      // Si el click fue en el botón eliminar, no seleccionar el médico
      if (e.target.closest('.btn-eliminar')) return;
      seleccionarMedico(div, medico);
    });
    
    // Manejador para el botón eliminar
    const btnEliminar = div.querySelector('.btn-eliminar');
    if (btnEliminar) {
      btnEliminar.addEventListener('click', (e) => {
        e.stopPropagation();
        confirmarEliminarMedico(medico);
      });
    }
    
    lista.appendChild(div);
  });
}

// ========================
// Mostrar mensajes de error
// ========================
function mostrarMensajeError(mensaje) {
  const lista = document.getElementById("listaMedicos");
  if (!lista) return;
  
  lista.innerHTML = `
    <div class="error-state">
      <iconify-icon icon="mdi:alert-circle" width="48"></iconify-icon>
      <p>${mensaje}</p>
      <button class="btn secondary-btn" onclick="cargarMedicos()">
        <iconify-icon icon="mdi:refresh"></iconify-icon> Reintentar
      </button>
    </div>
  `;
}

// ========================
// Selección visual
// ========================
function seleccionarMedico(elemento, datos) {
  console.log('Datos recibidos en seleccionarMedico:', datos);
  document.querySelectorAll("#listaMedicos .cita").forEach((m) => m.classList.remove("seleccionada"));
  elemento.classList.add("seleccionada");
  
  // Simplemente usamos los datos como vienen (ya están en el formato que esperamos)
  medicoSeleccionado = {
    ...datos
  };
  
  console.log('Médico seleccionado después de normalización:', medicoSeleccionado);
  mostrarMedicoSeleccionado(medicoSeleccionado);
  
  const botonModificar = document.getElementById("btnModificarMedico");
  if (botonModificar) botonModificar.disabled = false;
    // Salir del modo edición si estaba activo
  if (modoEdicionMedico) {
    toggleModoEdicion(false);
  }
}

// ========================
// Mostrar datos del médico
// ========================
async function eliminarMedico(id) {
  if (!id) return;
  
  try {
    // Intentar eliminar en el servidor
    await window.apiService.medicos.delete(id);
    
    // Actualizar la lista local
    medicosList = medicosList.filter(m => m.id_Medico !== id);
    
    // Si el médico eliminado era el que estaba seleccionado, limpiar la selección
    if (medicoSeleccionadoActual && medicoSeleccionadoActual.id_Medico === id) {
      medicoSeleccionadoActual = null;
      const panel = document.getElementById("resultadoMedico");
      if (panel) {
        panel.innerHTML = `<div class="empty-state">
          <iconify-icon icon="mdi:information-outline" width="48"></iconify-icon>
          <p>Seleccione un médico para ver los detalles</p>
        </div>`;
      }
    }
    
    // Actualizar la visualización
    mostrarMedicosEnTabla(medicosList);
    
    // Mostrar notificación
    mostrarNotificacion("Médico eliminado correctamente", "success");
    
  } catch (error) {
    console.error('Error al eliminar médico:', error);
    mostrarNotificacion("Error al eliminar médico: " + error.message, "error");
  }
}

async function guardarCambiosMedico() {
  if (!medicoSeleccionadoActual || !medicoSeleccionadoActual.id_Medico) {
    console.error('No hay médico seleccionado o el ID no es válido');
    return;
  }
  
  try {
    // Mostrar indicador de carga
    document.getElementById("btnGuardarCambiosMedico").innerHTML = `
      <iconify-icon icon="mdi:loading" class="spin"></iconify-icon>
      Guardando...
    `;
    document.getElementById("btnGuardarCambiosMedico").disabled = true;
    
    // Obtener datos del formulario
    const datosActualizados = {
      nombre: document.getElementById("edit-nombre").value,
      apellido_Paterno: document.getElementById("edit-apellido-paterno").value,
      apellido_Materno: document.getElementById("edit-apellido-materno").value,
      correo: document.getElementById("edit-correo").value,
      telefono: document.getElementById("edit-telefono").value,
      id_Especialidad: document.getElementById("edit-id-especialidad").value,
      estado: document.getElementById("edit-estado").value,
      id_Estatus: parseInt(document.getElementById("edit-id-estatus").value)
    };
    
    console.log('Datos a actualizar:', datosActualizados);
    
    // Llamar a la API para actualizar
    await window.apiService.medicos.update(medicoSeleccionadoActual.id_Medico, datosActualizados);
    
    // Actualizar la lista de médicos
    await cargarMedicos();
    
    // Salir del modo edición
    modoEdicionMedico = false;
    
    // Actualizar la vista
    mostrarMedicoSeleccionado(medicoSeleccionadoActual);
    
    // Mostrar notificación
    mostrarNotificacion("Médico actualizado correctamente", "success");
    
  } catch (error) {
    console.error('Error al actualizar médico:', error);
    mostrarNotificacion("Error al actualizar médico: " + error.message, "error");
  } finally {
    // Restaurar el botón
    document.getElementById("btnGuardarCambiosMedico").innerHTML = `
      <iconify-icon icon="mdi:content-save"></iconify-icon>
      Guardar Cambios
    `;
    document.getElementById("btnGuardarCambiosMedico").disabled = false;
  }
}

function mostrarMedicoSeleccionado(medico) {
  const panel = document.getElementById("resultadoMedico");
  if (!panel) return;

  // Guardar el médico seleccionado actualmente
  medicoSeleccionadoActual = medico;

  // Obtener nombre completo formateado
  const nombreCompleto = [
    medico.nombre || '',
    medico.apellido_Paterno || '',
    medico.apellido_Materno || ''
  ].filter(Boolean).join(' ') || 'Sin nombre registrado';
  
  // Determinar estado para mostrar icono de estado
  let estatusColor = "#6c757d";
  let estatusIcon = "mdi:account-question";
  let estatusText = medico.nombreEstatus || "Desconocido";
  
  if (medico.nombreEstatus) {
    if (medico.nombreEstatus.toLowerCase().includes('activ')) {
      estatusColor = "#28a745";
      estatusIcon = "healthicons:doctor";
    } else if (medico.nombreEstatus.toLowerCase().includes('inactiv') || 
               medico.nombreEstatus.toLowerCase().includes('suspend')) {
      estatusColor = "#dc3545";
      estatusIcon = "healthicons:doctor-remove";
    }
  }
  const editable = modoEdicionMedico;
  
  panel.innerHTML = `
  <div class="tarjeta" style="border: 1px solid #dee2e6; border-radius: 12px; padding: 24px; background: white; display: flex; flex-direction: column; gap: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    
    <div class="tarjeta-header" style="width: 100%; display: flex; align-items: center; justify-content: space-between;">
      <h3 style="font-size: 1.5rem; font-weight: 600; margin: 0;">
        ${editable ? 'Editando Médico' : 'Información del Médico'}
      </h3>
      <div class="estatus-badge" style="display: flex; align-items: center; padding: 6px 12px; background: ${estatusColor}20; border-radius: 30px; color: ${estatusColor}; border: 1px solid ${estatusColor};">
        <iconify-icon icon="${estatusIcon}" style="margin-right: 6px;"></iconify-icon>
        <span>${estatusText}</span>
      </div>
    </div>
    <div style="border-bottom: 1px solid #dee2e6; width: 100%;"></div>
    
    <div id="datosMedico" style="display: flex; flex-wrap: wrap; gap: 20px;">
      <div style="flex: 1 1 240px; min-width: 220px;">        <label style="font-weight: bold;">Nombre:</label>
        <div id="campo-nombre" style="border-bottom: 1px solid black; padding: 8px 0;">
          ${modoEdicionMedico ? 
            `<input type="text" value="${medico.nombre || ''}" class="input-edicion" id="edit-nombre">` : 
            medico.nombre || 'No registrado'}
        </div>
      </div>
      
      <div style="flex: 1 1 240px; min-width: 220px;">
        <label style="font-weight: bold;">Apellido Paterno:</label>
        <div id="campo-apellido-paterno" style="border-bottom: 1px solid black; padding: 8px 0;">
          ${modoEdicionMedico ? 
            `<input type="text" value="${medico.apellido_Paterno || ''}" class="input-edicion" id="edit-apellido-paterno">` : 
            medico.apellido_Paterno || 'No registrado'}
        </div>
      </div>
      
      <div style="flex: 1 1 240px; min-width: 220px;">        <label style="font-weight: bold;">Apellido Materno:</label>
        <div id="campo-apellido-materno" style="border-bottom: 1px solid black; padding: 8px 0;">
          ${modoEdicionMedico ?
            `<input type="text" value="${medico.apellido_Materno || ''}" class="input-edicion" id="edit-apellido-materno">` : 
            medico.apellido_Materno || 'No registrado'}
        </div>
      </div>
      
      <div style="flex: 1 1 240px; min-width: 220px;">
        <label style="font-weight: bold;">Correo:</label>
        <div id="campo-correo" style="border-bottom: 1px solid black; padding: 8px 0;">
          ${modoEdicionMedico ?
            `<input type="email" value="${medico.correo || ''}" class="input-edicion" id="edit-correo">` : 
            medico.correo || 'No registrado'}
        </div>      </div>
      
      <div style="flex: 1 1 240px; min-width: 220px;">
        <label style="font-weight: bold;">Teléfono:</label>
        <div id="campo-telefono" style="border-bottom: 1px solid black; padding: 8px 0;">
          ${modoEdicionMedico ?
            `<input type="tel" value="${medico.telefono || ''}" class="input-edicion" id="edit-telefono" pattern="[0-9]{10}" title="Ingrese un número de teléfono válido de 10 dígitos" required>` : 
            medico.telefono || 'No registrado'}
        </div>
      </div>
      
      <div style="flex: 1 1 240px; min-width: 220px;">
        <label style="font-weight: bold;">Especialidad:</label>
        <div id="campo-especialidad" style="border-bottom: 1px solid black; padding: 8px 0;">
          ${modoEdicionMedico ?
            `<input type="text" value="${medico.nombreEspecialidad || ''}" class="input-edicion" id="edit-especialidad" readonly>
             <input type="hidden" value="${medico.id_Especialidad || ''}" id="edit-id-especialidad">` : 
            medico.nombreEspecialidad || 'No registrado'}
        </div>
      </div>
      
      <div style="flex: 1 1 240px; min-width: 220px;">
        <label style="font-weight: bold;">Estado:</label>
        <div id="campo-estado" style="border-bottom: 1px solid black; padding: 8px 0;">
          ${modoEdicionMedico ?
            `<input type="text" value="${medico.estado || ''}" class="input-edicion" id="edit-estado">` : 
            medico.estado || 'No registrado'}
        </div>
      </div>
      
      <div style="flex: 1 1 240px; min-width: 220px;">
        <label style="font-weight: bold;">Estatus:</label>
        <div id="campo-estatus" style="border-bottom: 1px solid black; padding: 8px 0;">
          ${modoEdicionMedico ?
            `<select class="input-edicion" id="edit-id-estatus">
              <option value="1" ${medico.id_Estatus === 1 ? 'selected' : ''}>Activo</option>
              <option value="2" ${medico.id_Estatus === 2 ? 'selected' : ''}>Inactivo</option>
             </select>` : 
            medico.nombreEstatus || 'No registrado'}
        </div>
      </div>    </div>
    
    <div style="border-bottom: 1px solid #dee2e6; width: 100%;"></div>    <div class="actions-container" style="display: flex; justify-content: flex-end; gap: 10px;">
      ${modoEdicionMedico ? 
        `<button class="btn secondary-btn" onclick="toggleModoEdicion(false)">
          <iconify-icon icon="mdi:close"></iconify-icon>
          Cancelar
        </button>
        <button id="btnGuardarCambiosMedico" class="btn success-btn" onclick="guardarCambiosMedico()">
          <iconify-icon icon="mdi:content-save"></iconify-icon>
          Guardar Cambios
        </button>` :
        `<button id="btnModificarMedico" class="btn secondary-btn" onclick="toggleModoEdicion(true)">
          <iconify-icon icon="mdi:pencil"></iconify-icon>
          Modificar
        </button>`
      }
      ${!modoEdicionMedico && esAdminMedico ? 
        `<button id="btnEliminarMedico" class="btn danger-btn" onclick="eliminarMedico(medicoSeleccionadoActual.id_Medico)">
          <iconify-icon icon="mdi:delete"></iconify-icon>
          Eliminar
        </button>` : ''}
    </div>
  </div>
  `;
}

// ========================
// Modo de edición
// ========================
function toggleModoEdicion(activar) {
  modoEdicionMedico = activar;
  
  // Actualizar la vista con los campos de edición
  if (medicoSeleccionadoActual) {
    mostrarMedicoSeleccionado(medicoSeleccionadoActual);
  }

  // Mostrar u ocultar el botón de guardar cambios según corresponda
  const btnModificar = document.getElementById("btnModificarMedico");
  if (btnModificar) {
    btnModificar.style.display = activar ? "none" : "inline-flex";
  }

  const btnGuardarCambios = document.getElementById("btnGuardarCambiosMedico");
  if (btnGuardarCambios) {
    btnGuardarCambios.style.display = activar ? "inline-flex" : "none";
  }
}

// ========================
// Guardar cambios del médico
// ========================
async function guardarCambiosMedico() {
  if (!medicoSeleccionado || !medicoSeleccionado.id_Medico) {
    console.error('No hay médico seleccionado o el ID no es válido');
    return;
  }
  
  try {
    // Mostrar indicador de carga
    document.getElementById("btnGuardarCambiosMedico").innerHTML = `
      <iconify-icon icon="mdi:loading" class="spin"></iconify-icon>
      Guardando...
    `;
    document.getElementById("btnGuardarCambiosMedico").disabled = true;
    
    // Obtener datos del formulario
    const datosActualizados = {
      nombre: document.getElementById("edit-nombre").value,
      apellido_Paterno: document.getElementById("edit-apellido-paterno").value,
      apellido_Materno: document.getElementById("edit-apellido-materno").value,
      correo: document.getElementById("edit-correo").value,
      telefono: document.getElementById("edit-telefono").value,
      id_Especialidad: parseInt(document.getElementById("edit-id-especialidad").value) || medicoSeleccionado.id_Especialidad,
      estado: document.getElementById("edit-estado").value,
      id_Estatus: parseInt(document.getElementById("edit-id-estatus").value)
    };
    
    console.log('Datos a actualizar:', datosActualizados);
    
    // Llamar a la API para actualizar
    const resultado = await window.apiService.medicos.update(medicoSeleccionado.id_Medico, datosActualizados);
    console.log('Resultado de la actualización:', resultado);
    
    // Actualizar la lista de médicos
    await cargarMedicos();
    
    // Actualizar el médico seleccionado con los datos más recientes
    const medicoActualizado = medicos.find(m => m.id_Medico === medicoSeleccionado.id_Medico);
    if (medicoActualizado) {
      medicoSeleccionado = medicoActualizado;
    }
    
    // Salir del modo edición
    toggleModoEdicion(false);
    
    // Mostrar notificación
    mostrarNotificacion("Médico actualizado correctamente", "success");
    
  } catch (error) {
    console.error('Error al actualizar médico:', error);
    mostrarNotificacion("Error al actualizar médico: " + error.message, "error");
  } finally {
    // Restaurar el botón
    document.getElementById("btnGuardarCambiosMedico").innerHTML = `
      <iconify-icon icon="mdi:content-save"></iconify-icon>
      Guardar Cambios
    `;
    document.getElementById("btnGuardarCambiosMedico").disabled = false;
  }
}

// ========================
// Eliminar médico
// ========================
function confirmarEliminarMedico(medico) {
  if (!medico || !medico.id_Medico) {
    console.error('No se puede eliminar: médico no válido o sin ID');
    return;
  }
  
  // Obtener nombre completo
  const nombreCompleto = [
    medico.nombre || '',
    medico.apellido_Paterno || '',
    medico.apellido_Materno || ''
  ].filter(Boolean).join(' ') || 'ID #' + medico.id_Medico;
  
  if (confirm(`¿Está seguro que desea eliminar al médico "${nombreCompleto}"? Esta acción no se puede deshacer.`)) {
    eliminarMedico(medico.id_Medico);
  }
}

async function eliminarMedico(id) {
  if (!id) return;
  
  try {
    // Intentar eliminar en el servidor
    const resultado = await window.apiService.medicos.delete(id);
    console.log('Resultado eliminación:', resultado);
    
    // Actualizar la lista local
    medicos = medicos.filter(m => m.id_Medico !== id);
    
    // Si el médico eliminado era el que estaba seleccionado, limpiar la selección
    if (medicoSeleccionado && medicoSeleccionado.id_Medico === id) {
      medicoSeleccionado = null;
      const panel = document.getElementById("resultadoMedico");
      if (panel) {
        panel.innerHTML = `<div class="empty-state">
          <iconify-icon icon="mdi:information-outline" width="48"></iconify-icon>
          <p>Seleccione un médico para ver los detalles</p>
        </div>`;
      }
    }
    
    // Actualizar la visualización
    mostrarMedicosEnTabla(medicos);
    
    // Mostrar notificación
    mostrarNotificacion("Médico eliminado correctamente", "success");
    
  } catch (error) {
    console.error('Error al eliminar médico:', error);
    mostrarNotificacion("Error al eliminar médico: " + error.message, "error");
  }
}

// ========================
// Buscar/Filtrar médicos
// ========================
function filtrarMedicos(query) {
  if (!query || query.trim() === '') {
    mostrarMedicosEnTabla(medicos);
    return;
  }
  
  query = query.toLowerCase().trim();
  
  const medicosFiltrados = medicos.filter(medico => {
    // Combinar nombre completo
    const nombreCompleto = [
      medico.nombre || '',
      medico.apellido_Paterno || '',
      medico.apellido_Materno || ''
    ].filter(Boolean).join(' ').toLowerCase();
    
    // Buscar en varios campos
    return nombreCompleto.includes(query) || 
           (medico.nombreEspecialidad && medico.nombreEspecialidad.toLowerCase().includes(query)) ||
           (medico.correo && medico.correo.toLowerCase().includes(query)) ||
           (medico.telefono && medico.telefono.includes(query));
  });
  
  mostrarMedicosEnTabla(medicosFiltrados);
}

// ========================
// Notificaciones
// ========================
function mostrarNotificacion(mensaje, tipo = "info") {
  // Verificar si ya existe el contenedor de notificaciones
  let notificacionContainer = document.getElementById('notificacion-container');
  
  if (!notificacionContainer) {
    // Si no existe, crear el contenedor
    notificacionContainer = document.createElement('div');
    notificacionContainer.id = 'notificacion-container';
    notificacionContainer.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999;';
    document.body.appendChild(notificacionContainer);
  }
  
  // Crear la notificación
  const notificacion = document.createElement('div');
  
  // Establecer clase según el tipo
  let iconoNotificacion = 'mdi:information';
  let colorFondo = '#17a2b8';
  
  if (tipo === 'success') {
    iconoNotificacion = 'mdi:check-circle';
    colorFondo = '#28a745';
  } else if (tipo === 'error') {
    iconoNotificacion = 'mdi:alert-circle';
    colorFondo = '#dc3545';
  } else if (tipo === 'warning') {
    iconoNotificacion = 'mdi:alert';
    colorFondo = '#ffc107';
  }
  
  notificacion.style.cssText = `
    display: flex;
    align-items: center;
    min-width: 300px;
    margin-bottom: 10px;
    padding: 15px;
    background-color: ${colorFondo};
    color: white;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    transform: translateX(120%);
    transition: transform 0.3s ease-out;
  `;
  
  notificacion.innerHTML = `
    <iconify-icon icon="${iconoNotificacion}" style="font-size: 24px; margin-right: 10px;"></iconify-icon>
    <span style="flex-grow: 1;">${mensaje}</span>
    <button style="background: transparent; border: none; color: white; cursor: pointer; padding: 0 5px;">
      <iconify-icon icon="mdi:close" style="font-size: 18px;"></iconify-icon>
    </button>
  `;
  
  // Agregar al contenedor
  notificacionContainer.appendChild(notificacion);
  
  // Animar entrada
  setTimeout(() => {
    notificacion.style.transform = 'translateX(0)';
  }, 10);
  
  // Agregar evento de cierre
  const btnCerrar = notificacion.querySelector('button');
  btnCerrar.addEventListener('click', () => {
    notificacion.style.transform = 'translateX(120%)';
    setTimeout(() => {
      notificacionContainer.removeChild(notificacion);
    }, 300);
  });
  
  // Autocerrarse después de 5 segundos
  setTimeout(() => {
    if (notificacion.parentElement) {
      notificacion.style.transform = 'translateX(120%)';
      setTimeout(() => {
        if (notificacion.parentElement) {
          notificacionContainer.removeChild(notificacion);
        }
      }, 300);
    }
  }, 5000);
}

// ========================
// Inicialización
// ========================
document.addEventListener("DOMContentLoaded", () => {
  // Cargar médicos al iniciar
  cargarMedicos();
  
  // Configurar búsqueda si existe el campo
  const campoBusqueda = document.getElementById("buscarMedico");
  if (campoBusqueda) {
    campoBusqueda.addEventListener("input", (e) => {
      filtrarMedicos(e.target.value);
    });
  }
});