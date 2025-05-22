// ========================
// Gestión de usuarios con API real
// ========================
let usuarios = [];
let usuarioSeleccionado = null;
let modoEdicion = false;
let esAdmin = false;

// Verificar si el usuario es administrador
function verificarRolAdmin() {
  const userData = window.authUtils.getUserData();
  esAdmin = userData && userData.rol === "Administrador";
}

// Cargar usuarios desde la API
async function cargarUsuarios() {
  try {
    verificarRolAdmin();
    
    // Mostrar indicador de carga
    document.getElementById("listaUsuario").innerHTML = `
      <div class="loading-indicator">
        <iconify-icon icon="mdi:loading" width="48" class="spin"></iconify-icon>
        <p>Cargando usuarios...</p>
      </div>
    `;
    
    const usuariosData = await window.apiService.usuarios.getAll();
    
    if (usuariosData && Array.isArray(usuariosData)) {
      // Log para depuración      console.log('Datos crudos del servidor:', usuariosData);
      console.log('Estructura JSON completa:', JSON.stringify(usuariosData));
      
      if (usuariosData.length === 0) {
        document.getElementById("listaUsuario").innerHTML = `
          <div class="empty-state">
            <iconify-icon icon="material-symbols:person-off" width="48"></iconify-icon>
            <p>No hay usuarios registrados en el sistema</p>
          </div>
        `;
        return;
      }      // Normalizar nombres de propiedades (desde el formato del backend a la estructura que usa nuestro frontend)
      usuarios = usuariosData.map(usuario => {
        console.log("Propiedades de usuario:", Object.keys(usuario));
        
        const usuarioNormalizado = {
          id_Usuario: usuario.id_Usuario || usuario.ID_Usuario || usuario.idUsuario,
          nombre_Usuario: usuario.nombre_Usuario || usuario.Nombre_Usuario || usuario.nombreUsuario || "Sin usuario",
          id_Rol: usuario.id_Rol || usuario.ID_Rol || usuario.idRol || 0,
          nombre: usuario.nombre || usuario.Nombre || "",
          apellido_Paterno: usuario.apellido_Paterno || usuario.Apellido_Paterno || "",
          apellido_Materno: usuario.apellido_Materno || usuario.Apellido_Materno || "",
          correo: usuario.correo || usuario.Correo || "",
          telefono: usuario.telefono || usuario.Telefono || "",
          id_Estatus: usuario.id_Estatus || usuario.ID_Estatus || usuario.idEstatus || 1,
          nombreRol: usuario.nombreRol || usuario.NombreRol || "Sin rol",
          nombreEstatus: usuario.nombreEstatus || usuario.NombreEstatus || "Sin estatus"
        };
        console.log('Usuario normalizado:', usuarioNormalizado);
        return usuarioNormalizado;
      });
      
      console.log('Usuarios normalizados:', usuarios);
      mostrarUsuariosEnTabla(usuarios);
    } else {
      console.error('Error: los datos de usuarios no son válidos', usuariosData);
      mostrarMensajeError('Los datos recibidos no tienen el formato esperado. Por favor, intente nuevamente.');
    }
  } catch (error) {
    console.error('Error al cargar usuarios:', error);
    document.getElementById("listaUsuario").innerHTML = `
      <div class="error-state">
        <iconify-icon icon="mdi:alert-circle" width="48"></iconify-icon>
        <p>Error al cargar usuarios: ${error.message}</p>
        <button class="btn secondary-btn" onclick="cargarUsuarios()">
          <iconify-icon icon="mdi:refresh"></iconify-icon> Reintentar
        </button>
      </div>
    `;
  }
}

// ========================
// Mostrar usuarios en la tabla
// ========================
function mostrarUsuariosEnTabla(usuarios) {
  const lista = document.getElementById("listaUsuario");
  const resultado = document.getElementById("resultadoUsuario");
  if (!lista || !resultado) return;

  // Restablecer estados
  document.getElementById("btnModificarUsuario").disabled = true;
  document.getElementById("btnGuardarCambiosUsuario").style.display = "none";
  
  lista.innerHTML = "";
  resultado.innerHTML = `<div class="empty-state">
    <iconify-icon icon="material-symbols:clinical-notes-outline-rounded" width="48"></iconify-icon>
    <p>Seleccione un Usuario para ver los detalles</p>
  </div>`;

  if (!usuarios || usuarios.length === 0) {
    lista.innerHTML = `<div class="empty-state">
      <iconify-icon icon="material-symbols:clinical-notes-rounded" width="48"></iconify-icon>
      <p>No hay usuarios registrados</p>
    </div>`;
    return;
  }

  usuarios.forEach((usuario) => {
    // Verificar que el usuario tenga un ID
    if (!usuario.id_Usuario && usuario.idUsuario) {
      usuario.id_Usuario = usuario.idUsuario; // Normalizar
    }
    
  // Si no hay ID, intentamos asignar un valor predeterminado
    if (!usuario.id_Usuario) {
      console.warn('Usuario sin ID encontrado, intentando recuperar ID:', usuario);
      // Si estamos en modo depuración, usamos un ID ficticio para mostrar la tarjeta
      usuario.id_Usuario = Math.floor(Math.random() * 100) + 1000;  // ID temporal para depuración
    }
    
    const div = document.createElement("div");
    div.classList.add("cita");
    div.setAttribute("data-id", usuario.id_Usuario);

    // Combinar nombre completo si existe
    const nombreCompleto = [
      usuario.nombre || '',
      usuario.apellido_Paterno || '',
      usuario.apellido_Materno || ''
    ].filter(Boolean).join(' ') || 'Sin nombre registrado';
    
    // Determinar estado para mostrar icono de estado
    let estatusColor = "gray";
    let estatusIcon = "mdi:account-question";
    
    if (usuario.nombreEstatus) {
      if (usuario.nombreEstatus.toLowerCase().includes('activ')) {
        estatusColor = "#28a745";
        estatusIcon = "mdi:account-check";
      } else if (usuario.nombreEstatus.toLowerCase().includes('inactiv') || 
                 usuario.nombreEstatus.toLowerCase().includes('suspend')) {
        estatusColor = "#dc3545";
        estatusIcon = "mdi:account-off";
      }
    }
    
    div.innerHTML = `
      <div class="cita-header">
        <iconify-icon icon="${estatusIcon}" style="color:${estatusColor}; font-size:18px;"></iconify-icon>
        <span class="cita-id">#${usuario.id_Usuario}</span>
      </div>
      <div class="dato"><strong>Usuario:</strong> <span>${usuario.nombre_Usuario || 'Sin nombre de usuario'}</span></div>
      <div class="dato"><strong>Nombre:</strong> <span>${nombreCompleto}</span></div>
      <div class="dato"><strong>Rol:</strong> <span>${usuario.nombreRol || "Sin rol"}</span></div>
      ${esAdmin ? 
        `<div class="acciones">
          <button class="btn-eliminar" data-id="${usuario.id_Usuario}" title="Eliminar usuario">
            <iconify-icon icon="mdi:delete" width="20"></iconify-icon>
          </button>
        </div>` : ''}
    `;

    div.addEventListener("click", (e) => {
      // Si el click fue en el botón eliminar, no seleccionar el usuario
      if (e.target.closest('.btn-eliminar')) return;
      seleccionarUsuario(div, usuario);
    });
    
    // Manejador para el botón eliminar
    const btnEliminar = div.querySelector('.btn-eliminar');
    if (btnEliminar) {
      btnEliminar.addEventListener('click', (e) => {
        e.stopPropagation();
        confirmarEliminarUsuario(usuario);
      });
    }
    
    lista.appendChild(div);
  });
}

// ========================
// Mostrar mensajes de error
// ========================
function mostrarMensajeError(mensaje) {
  const lista = document.getElementById("listaUsuario");
  if (!lista) return;
  
  lista.innerHTML = `
    <div class="error-state">
      <iconify-icon icon="mdi:alert-circle" width="48"></iconify-icon>
      <p>${mensaje}</p>
      <button class="btn secondary-btn" onclick="cargarUsuarios()">
        <iconify-icon icon="mdi:refresh"></iconify-icon> Reintentar
      </button>
    </div>
  `;
}

// ========================
// Selección visual
// ========================
function seleccionarUsuario(elemento, datos) {
  console.log('Datos recibidos en seleccionarUsuario:', datos);
  document.querySelectorAll("#listaUsuario .cita").forEach((u) => u.classList.remove("seleccionada"));
  elemento.classList.add("seleccionada");
  
  // Simplemente usamos los datos como vienen (ya están en el formato que esperamos)
  usuarioSeleccionado = {
    ...datos
  };
  
  console.log('Usuario seleccionado después de normalización:', usuarioSeleccionado);
  mostrarUsuarioSeleccionado(usuarioSeleccionado);
  
  const botonModificar = document.getElementById("btnModificarUsuario");
  if (botonModificar) botonModificar.disabled = false;
  
  // Salir del modo edición si estaba activo
  if (modoEdicion) {
    toggleModoEdicion(false);
  }
}

// ========================
// Mostrar datos del usuario
// ========================
function mostrarUsuarioSeleccionado(usuario) {
  const panel = document.getElementById("resultadoUsuario");
  if (!panel) return;

  // Obtener nombre completo formateado
  const nombreCompleto = [
    usuario.nombre || '',
    usuario.apellido_Paterno || '',
    usuario.apellido_Materno || ''
  ].filter(Boolean).join(' ') || 'Sin nombre registrado';
  
  // Determinar estado para mostrar icono de estado
  let estatusColor = "#6c757d";
  let estatusIcon = "mdi:account-question";
  let estatusText = usuario.nombreEstatus || "Desconocido";
  
  if (usuario.nombreEstatus) {
    if (usuario.nombreEstatus.toLowerCase().includes('activ')) {
      estatusColor = "#28a745";
      estatusIcon = "mdi:account-check";
    } else if (usuario.nombreEstatus.toLowerCase().includes('inactiv') || 
               usuario.nombreEstatus.toLowerCase().includes('suspend')) {
      estatusColor = "#dc3545";
      estatusIcon = "mdi:account-off";
    }
  }

  panel.innerHTML = `
  <div class="tarjeta" style="border: 1px solid #dee2e6; border-radius: 12px; padding: 24px; background: white; display: flex; flex-direction: column; gap: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    
    <div class="tarjeta-header" style="width: 100%; display: flex; align-items: center; justify-content: space-between;">
      <h3 style="font-size: 1.5rem; font-weight: 600; margin: 0;">
        Información del Usuario
      </h3>
      <div class="estatus-badge" style="display: flex; align-items: center; padding: 6px 12px; background: ${estatusColor}20; border-radius: 30px; color: ${estatusColor}; border: 1px solid ${estatusColor};">
        <iconify-icon icon="${estatusIcon}" style="margin-right: 6px;"></iconify-icon>
        <span>${estatusText}</span>
      </div>
    </div>
    <div style="border-bottom: 1px solid #dee2e6; width: 100%;"></div>
    
    <div id="datosUsuario" style="display: flex; flex-wrap: wrap; gap: 20px;">
      <div style="flex: 1 1 240px; min-width: 220px;">
        <label style="font-weight: bold;">Usuario:</label>
        <div id="campo-nombre-usuario" style="border-bottom: 1px solid black; padding: 8px 0;">
          ${modoEdicion ? 
            `<input type="text" value="${usuario.nombre_Usuario || ''}" class="input-edicion" id="edit-nombre-usuario">` : 
            usuario.nombre_Usuario || 'No registrado'}
        </div>
      </div>
      
      <div style="flex: 1 1 240px; min-width: 220px;">
        <label style="font-weight: bold;">Nombre:</label>
        <div id="campo-nombre" style="border-bottom: 1px solid black; padding: 8px 0;">
          ${modoEdicion ? 
            `<input type="text" value="${usuario.nombre || ''}" class="input-edicion" id="edit-nombre">` : 
            usuario.nombre || 'No registrado'}
        </div>
      </div>
      
      <div style="flex: 1 1 240px; min-width: 220px;">
        <label style="font-weight: bold;">Apellido Paterno:</label>
        <div id="campo-apellido-paterno" style="border-bottom: 1px solid black; padding: 8px 0;">
          ${modoEdicion ? 
            `<input type="text" value="${usuario.apellido_Paterno || ''}" class="input-edicion" id="edit-apellido-paterno">` : 
            usuario.apellido_Paterno || 'No registrado'}
        </div>
      </div>
      
      <div style="flex: 1 1 240px; min-width: 220px;">
        <label style="font-weight: bold;">Apellido Materno:</label>
        <div id="campo-apellido-materno" style="border-bottom: 1px solid black; padding: 8px 0;">
          ${modoEdicion ? 
            `<input type="text" value="${usuario.apellido_Materno || ''}" class="input-edicion" id="edit-apellido-materno">` : 
            usuario.apellido_Materno || 'No registrado'}
        </div>
      </div>
      
      <div style="flex: 1 1 240px; min-width: 220px;">
        <label style="font-weight: bold;">Correo:</label>
        <div id="campo-correo" style="border-bottom: 1px solid black; padding: 8px 0;">
          ${modoEdicion ? 
            `<input type="email" value="${usuario.correo || ''}" class="input-edicion" id="edit-correo">` : 
            usuario.correo || 'No registrado'}
        </div>
      </div>
      
      <div style="flex: 1 1 240px; min-width: 220px;">
        <label style="font-weight: bold;">Teléfono:</label>
        <div id="campo-telefono" style="border-bottom: 1px solid black; padding: 8px 0;">
          ${modoEdicion ? 
            `<input type="tel" value="${usuario.telefono || ''}" class="input-edicion" id="edit-telefono">` : 
            usuario.telefono || 'No registrado'}
        </div>
      </div>
      
      <div style="flex: 1 1 240px; min-width: 220px;">
        <label style="font-weight: bold;">Rol:</label>
        <div id="campo-rol" style="border-bottom: 1px solid black; padding: 8px 0;">
          ${modoEdicion && esAdmin ? 
            `<select class="input-edicion" id="edit-rol">
              <option value="1" ${usuario.id_Rol === 1 ? 'selected' : ''}>Administrador</option>
              <option value="2" ${usuario.id_Rol === 2 ? 'selected' : ''}>Doctor</option>
              <option value="3" ${usuario.id_Rol === 3 ? 'selected' : ''}>Recepcionista</option>
              <option value="4" ${usuario.id_Rol === 4 ? 'selected' : ''}>Enfermera</option>
            </select>` : 
            usuario.nombreRol || 'Sin rol'}
        </div>
      </div>
      
      <div style="flex: 1 1 240px; min-width: 220px;">
        <label style="font-weight: bold;">Estatus:</label>
        <div id="campo-estatus" style="border-bottom: 1px solid black; padding: 8px 0;">
          ${usuario.nombreEstatus || 'Desconocido'}
        </div>
      </div>
    </div>
    
    ${modoEdicion ? `
    <div class="acciones-edicion" style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
      <button id="btn-cancelar-edicion" class="btn secondary-btn" style="background-color: #f1f3f5; color: #495057;">
        <iconify-icon icon="mdi:close"></iconify-icon>
        Cancelar
      </button>
      <button id="btn-guardar-cambios" class="btn primary-btn" style="background-color: #2c7be5; color: white;">
        <iconify-icon icon="mdi:content-save"></iconify-icon>
        Guardar Cambios
      </button>
    </div>
    ` : ''}
  </div>
`;

  // Configurar eventos para los botones de cancelar y guardar
  if (modoEdicion) {
    document.getElementById('btn-cancelar-edicion').addEventListener('click', () => {
      toggleModoEdicion(false);
      mostrarUsuarioSeleccionado(usuarioSeleccionado);
    });
    
    document.getElementById('btn-guardar-cambios').addEventListener('click', guardarCambiosUsuario);
  }
}


// ========================
// Inicializar
// ========================
document.addEventListener("DOMContentLoaded", function () {
  cargarUsuarios();
  
  // Configurar el evento del botón modificar
  const btnModificar = document.getElementById('btnModificarUsuario');
  if (btnModificar) {
    btnModificar.addEventListener('click', () => {
      if (usuarioSeleccionado) {
        toggleModoEdicion(true);
        mostrarUsuarioSeleccionado(usuarioSeleccionado);
      }
    });
  }
  
  // Configurar búsqueda de usuarios
  const inputBusqueda = document.getElementById('busquedaUsuarios');
  if (inputBusqueda) {
    inputBusqueda.addEventListener('input', filtrarUsuarios);
  }
});

// ========================
// Modo Edición
// ========================
function toggleModoEdicion(activar) {
  modoEdicion = activar;
  
  // Manejar botón modificar
  const btnModificar = document.getElementById('btnModificarUsuario');
  if (btnModificar) {
    btnModificar.disabled = activar;
  }
  
  // Actualizar campos editables
  if (activar && usuarioSeleccionado) {
    mostrarUsuarioSeleccionado(usuarioSeleccionado);
  }
}

// ========================
// Guardar cambios
// ========================
async function guardarCambiosUsuario() {
  console.log('Estado de usuarioSeleccionado:', usuarioSeleccionado);
  
  if (!usuarioSeleccionado) {
    console.error('No hay usuario seleccionado');
    mostrarNotificacion('Error: No hay usuario seleccionado', 'error');
    return;
  }
  
  if (!usuarioSeleccionado.id_Usuario) {
    console.error('ID_Usuario no encontrado en:', usuarioSeleccionado);
    mostrarNotificacion('Error: No se pudo identificar el usuario a actualizar', 'error');
    return;
  }
  try {
    const datosActualizados = {
      ID_Usuario: usuarioSeleccionado.id_Usuario,
      Nombre_Usuario: document.getElementById('edit-nombre-usuario').value,
      Nombre: document.getElementById('edit-nombre').value,
      Apellido_Paterno: document.getElementById('edit-apellido-paterno').value,
      Apellido_Materno: document.getElementById('edit-apellido-materno').value,
      Correo: document.getElementById('edit-correo').value,
      Telefono: document.getElementById('edit-telefono').value,
      ID_Estatus: usuarioSeleccionado.id_Estatus // Mantener el estatus actual
    };
    
    // Solo administradores pueden cambiar roles
    if (esAdmin) {
      const selectRol = document.getElementById('edit-rol');
      if (selectRol) {
        datosActualizados.ID_Rol = parseInt(selectRol.value);
      }
    }
    
    console.log('Datos preparados para enviar:', datosActualizados);
    
    // Mostrar notificación de carga
    mostrarNotificacion('Actualizando usuario...', 'info');
    
    // Actualiza el usuario en el servidor
    const updateResponse = await window.apiService.usuarios.update(usuarioSeleccionado.id_Usuario, datosActualizados);
    
    // Como la API devuelve 204 (NoContent), necesitamos obtener los datos actualizados
    const usuarioActualizado = await window.apiService.usuarios.getById(usuarioSeleccionado.id_Usuario);
    
    if (usuarioActualizado) {
      console.log('Respuesta del servidor:', usuarioActualizado);
      // Normalizar propiedades de la respuesta
      const usuarioNormalizado = {
        id_Usuario: usuarioActualizado.ID_Usuario,
        nombre_Usuario: usuarioActualizado.Nombre_Usuario,
        id_Rol: usuarioActualizado.ID_Rol,
        nombre: usuarioActualizado.Nombre,
        apellido_Paterno: usuarioActualizado.Apellido_Paterno,
        apellido_Materno: usuarioActualizado.Apellido_Materno,
        correo: usuarioActualizado.Correo,
        telefono: usuarioActualizado.Telefono,
        id_Estatus: usuarioActualizado.ID_Estatus,
        nombreRol: usuarioActualizado.nombreRol,
        nombreEstatus: usuarioActualizado.nombreEstatus
      };
      
      // Actualizar el usuario seleccionado con los nuevos datos
      Object.assign(usuarioSeleccionado, usuarioNormalizado);
      
      // Salir del modo edición y mostrar los datos actualizados
      toggleModoEdicion(false);
      mostrarUsuarioSeleccionado(usuarioSeleccionado);
      
      // Actualizar la lista de usuarios
      await cargarUsuarios();
      
      // Mostrar notificación de éxito
      mostrarNotificacion('Usuario actualizado correctamente', 'success');
    }
  } catch (error) {
    console.error('Error detallado al actualizar usuario:', {
      error: error,
      mensaje: error.message,
      usuario: usuarioSeleccionado
    });
    mostrarNotificacion('Error al actualizar usuario. Intente nuevamente.', 'error');
  }
}

// ========================
// Eliminar usuario
// ========================
function confirmarEliminarUsuario(usuario) {
  if (!esAdmin) {
    mostrarNotificacion('Solo los administradores pueden eliminar usuarios', 'warning');
    return;
  }
  
  if (!usuario || !usuario.id_Usuario) {
    mostrarNotificacion('Error: No se pudo identificar el usuario a eliminar', 'error');
    return;
  }
  
  const confirmar = confirm(`¿Está seguro que desea eliminar al usuario ${usuario.nombre_Usuario}? Esta acción no se puede deshacer.`);
  
  if (confirmar) {
    eliminarUsuario(usuario.id_Usuario);
  }
}

async function eliminarUsuario(idUsuario) {
  if (!idUsuario) {
    mostrarNotificacion('Error: ID de usuario no válido', 'error');
    return;
  }

  try {
    // Mostrar indicador de carga
    mostrarNotificacion('Eliminando usuario...', 'info');
    
    console.log('Intentando eliminar usuario con ID:', idUsuario);
    
    // Llamar a la API para eliminar el usuario
    const deleteResponse = await window.apiService.usuarios.delete(idUsuario);
    
    // Verificar si la eliminación fue exitosa
    if (!deleteResponse || !deleteResponse.success) {
      console.error('La respuesta de eliminación no indica éxito:', deleteResponse);
      mostrarNotificacion('Error al eliminar el usuario. Por favor, intente nuevamente.', 'error');
      return;
    }
    
    // Actualizar la lista de usuarios
    await cargarUsuarios();
    
    // Si el usuario que se eliminó es el seleccionado, limpiar la selección
    if (usuarioSeleccionado && usuarioSeleccionado.id_Usuario === idUsuario) {
      usuarioSeleccionado = null;
      document.getElementById("resultadoUsuario").innerHTML = `
        <div class="empty-state">
          <iconify-icon icon="material-symbols:clinical-notes-outline-rounded" width="48"></iconify-icon>
          <p>Seleccione un Usuario para ver los detalles</p>
        </div>
      `;
      
      // Deshabilitar el botón de modificar
      const btnModificar = document.getElementById("btnModificarUsuario");
      if (btnModificar) btnModificar.disabled = true;
    }
    
    // Mostrar notificación de éxito
    mostrarNotificacion('Usuario eliminado correctamente', 'success');
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    
    // Mostrar mensaje de error específico si está disponible
    let mensajeError = 'Error al eliminar usuario. Intente nuevamente.';
    if (error.response && error.response.data && error.response.data.message) {
      mensajeError = error.response.data.message;
    }
    
    mostrarNotificacion(mensajeError, 'error');
  }
}

// ========================
// Filtrar usuarios
// ========================
function filtrarUsuarios() {
  const textoBusqueda = document.getElementById('busquedaUsuarios').value.toLowerCase();
  
  if (!textoBusqueda) {
    mostrarUsuariosEnTabla(usuarios);
    return;
  }
  
  const usuariosFiltrados = usuarios.filter(usuario => {
    const nombreCompleto = [
      usuario.nombre || '',
      usuario.apellido_Paterno || '',
      usuario.apellido_Materno || ''
    ].join(' ').toLowerCase();
    
    return usuario.nombre_Usuario?.toLowerCase().includes(textoBusqueda) ||
           nombreCompleto.includes(textoBusqueda) ||
           usuario.correo?.toLowerCase().includes(textoBusqueda) ||
           usuario.nombreRol?.toLowerCase().includes(textoBusqueda);
  });
  
  mostrarUsuariosEnTabla(usuariosFiltrados);
}

// ========================
// Notificaciones
// ========================
function mostrarNotificacion(mensaje, tipo = 'info') {
  // Crear elemento de notificación
  const notificacion = document.createElement('div');
  notificacion.className = `notificacion ${tipo}`;
  notificacion.innerHTML = `
    <iconify-icon icon="${tipo === 'success' ? 'mdi:check-circle' : tipo === 'error' ? 'mdi:alert-circle' : 'mdi:information'}" width="20"></iconify-icon>
    <span>${mensaje}</span>
  `;
  
  // Estilos para la notificación
  Object.assign(notificacion.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '12px 20px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    zIndex: '9999',
    transition: 'all 0.3s ease',
    background: tipo === 'success' ? '#d4edda' : tipo === 'error' ? '#f8d7da' : '#cce5ff',
    color: tipo === 'success' ? '#155724' : tipo === 'error' ? '#721c24' : '#004085',
    border: `1px solid ${tipo === 'success' ? '#c3e6cb' : tipo === 'error' ? '#f5c6cb' : '#b8daff'}`
  });
  
  // Añadir al DOM
  document.body.appendChild(notificacion);
  
  // Eliminar después de 3 segundos
  setTimeout(() => {
    notificacion.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(notificacion);
    }, 300);
  }, 3000);
}
