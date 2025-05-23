// ========================
// Hospital Script
// ========================

let consultorios = [];
let filtroActual = 'todos';

// ========================
// Cargar consultorios
// ========================
async function cargarConsultorios() {
  const lista = document.getElementById('listaConsultorios');
  if (!lista) return;

  try {
    // Mostrar indicador de carga
    lista.innerHTML = `
      <div class="loading-indicator">
        <iconify-icon icon="mdi:loading" width="48" class="spin"></iconify-icon>
        <p>Cargando consultorios...</p>
      </div>
    `;    // Obtener consultorios desde la API
    console.log('Llamando a API de consultorios...');
    const response = await window.apiService.consultorios.getAll();
    console.log('Respuesta de API de consultorios:', response);
    consultorios = response || [];

    lista.innerHTML = '';
    const filtrados = filtroActual === 'todos'
      ? consultorios
      : consultorios.filter(c => c.EstatusNombre?.toLowerCase() === filtroActual.toLowerCase());
    
    console.log('Consultorios filtrados:', filtrados);    if (filtrados.length === 0) {
      let mensaje = 'No hay consultorios registrados';
      if (filtroActual !== 'todos') {
        mensaje = `No hay consultorios con estatus "${filtroActual}"`;
      }
      
      lista.innerHTML = `
        <div class="empty-state">
          <iconify-icon icon="mdi:office-building" width="48"></iconify-icon>
          <p>${mensaje}</p>
        </div>`;
      return;
    }
    
    console.log(`Mostrando ${filtrados.length} consultorios en la lista`);

    filtrados.forEach((consultorio, index) => {
      const div = document.createElement('div');
      div.classList.add('cita');      div.setAttribute('data-id', consultorio.ID_Consultorio);
      const color = obtenerColorPorEstatus(consultorio.ID_Estatus);
      div.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div style="display: flex; flex-wrap: wrap; gap: 30px;">
            <div class="dato"><strong>Nombre:</strong> <span>${consultorio.Nombre_Consultorio || 'Sin nombre'}</span></div>
            <div class="dato" style="display: flex; align-items: center;"><strong>Estatus:</strong>
              <span class="estatus-text-wrapper" style="margin-left: 6px; display: flex; align-items: center; gap: 6px;">
                <span class="circle" style="background:${color}; width:10px; height:10px; border-radius:50%; display:inline-block;"></span>
                <span class="estatus-text">${consultorio.EstatusNombre || 'Desconocido'}</span>
              </span>
            </div>
          </div>
          <button class="btn-icon editar-btn" title="Editar estatus">
            <iconify-icon icon="mdi:pencil" width="20"></iconify-icon>
          </button>
        </div>
      `;

      div.querySelector('.editar-btn').addEventListener('click', (e) => editarConsultorioFlotante(e, consultorio));
      lista.appendChild(div);
    });
  } catch (error) {
    console.error('Error al cargar consultorios:', error);
    lista.innerHTML = `
      <div class="error-state">
        <iconify-icon icon="mdi:alert-circle" width="48"></iconify-icon>
        <p>Error al cargar consultorios: ${error.message}</p>
        <button class="btn secondary-btn" onclick="cargarConsultorios()">
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
    case 1: // Disponible
      return '#28a745';  // Verde
    case 2: // Ocupado
      return '#ffc107';  // Amarillo
    case 3: // En mantenimiento
      return '#17a2b8';  // Azul
    default:
      return '#6c757d';  // Gris por defecto
  }
}

// ========================
// Editar Consultorio flotante
// ========================
function editarConsultorioFlotante(event, consultorio) {
  const card = event.target.closest('.cita');
  if (!card) return;

  const existente = document.querySelector('.floating-selector');
  if (existente) existente.remove();

  const rect = card.getBoundingClientRect();

  const contenedor = document.createElement('div');
  contenedor.className = 'floating-selector';
  contenedor.style.position = 'fixed';
  contenedor.style.top = `${rect.bottom + 5}px`;
  contenedor.style.left = `${rect.right - 250}px`;
  contenedor.style.zIndex = 9999;
  contenedor.style.background = '#fff';
  contenedor.style.border = '1px solid #ccc';
  contenedor.style.padding = '10px';
  contenedor.style.borderRadius = '10px';
  contenedor.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';

  const select = document.createElement('select');
  select.className = 'estatus-selector form-control';
  select.style.minWidth = '180px';
  // Opciones de estatus con sus IDs correspondientes
  const opcionesEstatus = [
    { id: 1, nombre: 'Disponible' },
    { id: 2, nombre: 'Ocupado' },
    { id: 3, nombre: 'En mantenimiento' },
  ];

  opcionesEstatus.forEach(opcion => {
    const opt = document.createElement('option');
    opt.value = opcion.id;
    opt.textContent = opcion.nombre;
    if (opcion.id === consultorio.ID_Estatus) opt.selected = true;
    select.appendChild(opt);
  });

  const guardar = document.createElement('button');
  guardar.textContent = 'Guardar';
  guardar.className = 'btn primary-btn';
  guardar.style.marginTop = '8px';
  guardar.addEventListener('click', async () => {
    try {
      guardar.disabled = true;
      guardar.innerHTML = '<iconify-icon icon="mdi:loading" class="spin"></iconify-icon> Guardando...';
      // Actualizar en la API
      await window.apiService.consultorios.update(consultorio.ID_Consultorio, {
        Nombre_Consultorio: consultorio.Nombre_Consultorio,
        ID_Estatus: parseInt(select.value)
      });

      // Recargar la lista
      await cargarConsultorios();
      contenedor.remove();
      mostrarNotificacion('Estatus actualizado correctamente', 'success');
    } catch (error) {
      console.error('Error al actualizar consultorio:', error);
      mostrarNotificacion(error.message || 'Error al actualizar el estatus', 'error');
      guardar.disabled = false;
      guardar.textContent = 'Guardar';
    }
  });

  contenedor.appendChild(select);
  contenedor.appendChild(guardar);
  document.body.appendChild(contenedor);

  // Cerrar al hacer clic fuera
  document.addEventListener('click', function cerrarSelector(e) {
    if (!contenedor.contains(e.target) && !event.target.contains(e.target)) {
      contenedor.remove();
      document.removeEventListener('click', cerrarSelector);
    }
  });
}

// ========================
// Registrar nuevo consultorio
// ========================
document.addEventListener('DOMContentLoaded', function() {
  const formConsultorio = document.getElementById('formConsultorio');
  if (formConsultorio) {
    formConsultorio.addEventListener('submit', async function(e) {
      e.preventDefault();      const nombreConsultorio = document.getElementById('nombreConsultorio').value.trim();
      if (!nombreConsultorio) {
        mostrarNotificacion('Por favor ingrese el nombre del consultorio', 'error');
        return;
      }
      
      if (nombreConsultorio.length > 20) {
        mostrarNotificacion('El nombre del consultorio no puede exceder los 20 caracteres', 'error');
        return;
      }

      const submitBtn = formConsultorio.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<iconify-icon icon="mdi:loading" class="spin"></iconify-icon> Guardando...';

      try {
        // Crear consultorio en la API
        const response = await window.apiService.consultorios.create({
          Nombre_Consultorio: nombreConsultorio,
          ID_Estatus: 1  // 1 = Disponible por defecto
        });        if (response) {
          mostrarNotificacion('Consultorio registrado correctamente', 'success');
          formConsultorio.reset();
          
          // Redireccionar y activar la pestaña correspondiente
          showPage('hospital');
          document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('data-page') === 'hospital') {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
          
          // Activar la pestaña de consultorios y cargar los datos actualizados
          const consultoriosTabBtn = document.querySelector('[data-tab="consultoriosTab"]');
          if (consultoriosTabBtn) {
            // Activar pestaña de consultorios
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            consultoriosTabBtn.classList.add('active');
            
            // Mostrar contenido de consultorios
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
            document.getElementById('consultoriosTab').classList.add('active');
            
            // Recargar la lista de consultorios
            if (typeof window.cargarConsultoriosDirecto === 'function') {
              setTimeout(() => window.cargarConsultoriosDirecto(), 100);
            }
          }
        }
      } catch (error) {
        console.error('Error al registrar consultorio:', error);
        mostrarNotificacion(error.message || 'Error al registrar el consultorio', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Guardar';
      }
    });
  }

  // Configurar filtros
  const filtros = document.querySelectorAll('.filtro-btn');
  filtros.forEach(btn => {
    btn.addEventListener('click', () => {
      filtros.forEach(b => b.classList.remove('activo'));
      btn.classList.add('activo');
      filtroActual = btn.dataset.estatus;
      cargarConsultorios();
    });
  });

  // Cargar consultorios inicialmente
  if (document.getElementById('listaConsultorios')) {
    cargarConsultorios();
  }
});

function mostrarNotificacion(mensaje, tipo = 'info') {
  // No llamar recursivamente a la función global si tiene el mismo nombre
  const notificacionGlobal = window.mostrarNotificacion;
  if (typeof notificacionGlobal === 'function' && notificacionGlobal !== mostrarNotificacion) {
    notificacionGlobal(mensaje, tipo);
  } else {
    alert(mensaje);
  }
}