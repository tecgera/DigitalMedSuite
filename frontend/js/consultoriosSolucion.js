// ====================================
// Solución para visualización de consultorios
// ====================================

// Esta función se ejecutará cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM cargado - inicializando script de consultorios');
  // Configurar los botones de filtro
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Ocultar todos los tabs
      document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
      // Desactivar todos los botones
      tabBtns.forEach(b => b.classList.remove('active'));
      // Activar el botón seleccionado
      btn.classList.add('active');
      // Mostrar el tab seleccionado
      document.getElementById(btn.dataset.tab).classList.add('active');
      
      // Si es el tab de consultorios, cargar consultorios
      if (btn.dataset.tab === 'consultoriosTab') {
        cargarConsultoriosDirecto();
      }
    });
  });
  
  // Configurar filtros de consultorios
  const filtros = document.querySelectorAll('.filtro-btn');
  if (filtros) {
    console.log('Configurando botones de filtro de consultorios');
    filtros.forEach(btn => {
      btn.addEventListener('click', () => {
        filtros.forEach(b => b.classList.remove('activo'));
        btn.classList.add('activo');
        const filtro = btn.dataset.estatus;
        console.log('Filtro seleccionado:', filtro);
        cargarConsultoriosDirecto(filtro);
      });
    });
  }
  
  // Si estamos en la página de hospital, verificar si el tab de consultorios está activo
  setTimeout(() => {
    const hospitalPage = document.getElementById('hospital');
    if (hospitalPage && hospitalPage.classList.contains('active')) {
      const consultoriosTab = document.getElementById('consultoriosTab');
      if (consultoriosTab && consultoriosTab.classList.contains('active')) {
        console.log('La página de hospital y tab de consultorios están activos');
        cargarConsultoriosDirecto();
      }
    }
  }, 500);
});

// Función para cargar consultorios directamente
async function cargarConsultoriosDirecto(filtro = 'todos') {
  console.log('Cargando consultorios directamente con filtro:', filtro);
  const lista = document.getElementById('listaConsultorios');
  if (!lista) {
    console.error('No se encontró el elemento #listaConsultorios');
    return;
  }
  
  try {
    // Mostrar indicador de carga
    lista.innerHTML = `
      <div class="loading-indicator" style="text-align: center; padding: 20px; color: #555;">
        <iconify-icon icon="mdi:loading" width="48" style="animation: spin 1s linear infinite;"></iconify-icon>
        <p>Cargando consultorios...</p>
      </div>    `;
    
    // Llamar a la API para obtener consultorios
    let response;
    try {
      response = await window.apiService.consultorios.getAll();
      console.log('Respuesta de API de consultorios:', response);
    } catch (error) {
      console.error('Error al obtener consultorios:', error);
      lista.innerHTML = `
        <div style="text-align: center; padding: 30px; color: #721c24; background: #f8d7da; border-radius: 5px; margin: 20px 0;">
          <iconify-icon icon="mdi:alert-circle" width="48"></iconify-icon>
          <p>Error al obtener consultorios: ${error.message || 'Error desconocido'}</p>
          <button onclick="cargarConsultoriosDirecto('${filtro}')" style="padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;">
            <iconify-icon icon="mdi:refresh"></iconify-icon> Reintentar
          </button>
        </div>
      `;
      return;
    }
    
    // Si no hay respuesta, mostrar mensaje vacío
    if (!response || !Array.isArray(response) || response.length === 0) {
      lista.innerHTML = `
        <div style="text-align: center; padding: 30px; color: #555; background: #f8f9fa; border-radius: 5px; margin: 20px 0;">
          <iconify-icon icon="mdi:office-building-outline" width="48"></iconify-icon>
          <p>No hay consultorios registrados</p>
        </div>
      `;
      return;
    }
    
    // Filtrar consultorios
    const consultorios = response;
    const filtrados = filtro === 'todos' 
      ? consultorios 
      : consultorios.filter(c => c.EstatusNombre?.toLowerCase() === filtro.toLowerCase());
    
    console.log(`Consultorios filtrados (${filtro}):`, filtrados);
    
    // Si no hay consultorios después del filtro, mostrar mensaje
    if (filtrados.length === 0) {
      lista.innerHTML = `
        <div style="text-align: center; padding: 30px; color: #555; background: #f8f9fa; border-radius: 5px; margin: 20px 0;">
          <iconify-icon icon="mdi:office-building-outline" width="48"></iconify-icon>
          <p>No hay consultorios con estatus "${filtro}"</p>
        </div>
      `;
      return;
    }
    
    // Generar el HTML para los consultorios
    lista.innerHTML = '';
    
    filtrados.forEach((consultorio) => {
      const div = document.createElement('div');
      div.className = 'cita';
      div.setAttribute('data-id', consultorio.ID_Consultorio);
      const color = obtenerColorPorEstatus(consultorio.ID_Estatus);
      
      div.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div style="display: flex; flex-wrap: wrap; gap: 30px;">
            <div class="dato"><strong>Nombre:</strong> <span>${consultorio.Nombre_Consultorio || 'Sin nombre'}</span></div>
            <div class="dato" style="display: flex; align-items: center;"><strong>Estatus:</strong>
              <span style="margin-left: 6px; display: flex; align-items: center; gap: 6px;">
                <span style="background:${color}; width:10px; height:10px; border-radius:50%; display:inline-block;"></span>
                <span>${consultorio.EstatusNombre || 'Desconocido'}</span>
              </span>
            </div>
          </div>
          <button class="btn-icon editar-btn" title="Editar estatus" style="background: none; border: none; cursor: pointer; padding: 5px; border-radius: 50%;">
            <iconify-icon icon="mdi:pencil" width="20"></iconify-icon>
          </button>
        </div>
      `;
      
      div.querySelector('.editar-btn').addEventListener('click', (e) => {
        abrirEditorEstatus(e, consultorio);
      });
      
      lista.appendChild(div);
    });
  } catch (error) {
    console.error('Error general al cargar consultorios:', error);
    lista.innerHTML = `
      <div style="text-align: center; padding: 30px; color: #721c24; background: #f8d7da; border-radius: 5px; margin: 20px 0;">
        <iconify-icon icon="mdi:alert-circle" width="48"></iconify-icon>
        <p>Error al cargar consultorios: ${error.message || 'Error desconocido'}</p>
        <button onclick="cargarConsultoriosDirecto('${filtro}')" style="padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;">
          <iconify-icon icon="mdi:refresh"></iconify-icon> Reintentar
        </button>
      </div>
    `;
  }
}

// Función para obtener el color según el estatus
function obtenerColorPorEstatus(idEstatus) {
  if (!idEstatus) return '#6c757d';

  switch (parseInt(idEstatus)) {
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

// Función para abrir el editor de estatus
function abrirEditorEstatus(event, consultorio) {
  const card = event.target.closest('.cita');
  if (!card) return;

  // Eliminar cualquier selector flotante existente
  const existente = document.querySelector('.floating-selector');
  if (existente) existente.remove();

  const rect = card.getBoundingClientRect();

  // Crear el contenedor flotante
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

  // Crear el selector de estatus
  const select = document.createElement('select');
  select.className = 'estatus-selector';
  select.style.minWidth = '180px';
  select.style.padding = '8px';
  select.style.borderRadius = '4px';
  select.style.border = '1px solid #ddd';
  
  // Opciones de estatus
  const opcionesEstatus = [
    { id: 1, nombre: 'Disponible' },
    { id: 2, nombre: 'Ocupado' },
    { id: 3, nombre: 'En mantenimiento' },
  ];

  opcionesEstatus.forEach(opcion => {
    const opt = document.createElement('option');
    opt.value = opcion.id;
    opt.textContent = opcion.nombre;
    if (parseInt(opcion.id) === parseInt(consultorio.ID_Estatus)) opt.selected = true;
    select.appendChild(opt);
  });

  // Botón de guardar
  const guardar = document.createElement('button');
  guardar.textContent = 'Guardar';
  guardar.style.marginTop = '8px';
  guardar.style.padding = '8px 16px';
  guardar.style.background = '#4A6FFF';
  guardar.style.color = 'white';
  guardar.style.border = 'none';
  guardar.style.borderRadius = '4px';
  guardar.style.cursor = 'pointer';
  guardar.style.width = '100%';
  
  guardar.addEventListener('click', async () => {
    try {
      guardar.disabled = true;
      guardar.innerHTML = '<iconify-icon icon="mdi:loading" style="animation: spin 1s linear infinite;"></iconify-icon> Guardando...';
      
      // Actualizar en la API
      await window.apiService.consultorios.update(consultorio.ID_Consultorio, {
        Nombre_Consultorio: consultorio.Nombre_Consultorio,
        ID_Estatus: parseInt(select.value)
      });

      // Recargar la lista
      const filtroActual = document.querySelector('.filtro-btn.activo')?.dataset.estatus || 'todos';
      await cargarConsultoriosDirecto(filtroActual);
      contenedor.remove();
      
      // Mostrar notificación
      alert('Estatus actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar consultorio:', error);
      alert(`Error al actualizar el estatus: ${error.message || 'Error desconocido'}`);
      guardar.disabled = false;
      guardar.textContent = 'Guardar';
    }
  });

  // Agregar elementos al contenedor
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

// Inicializar - Exponer la función globalmente
window.cargarConsultoriosDirecto = cargarConsultoriosDirecto;

// Ejecutar cargarConsultoriosDirecto cuando se carga la página de hospital
document.addEventListener('click', function(e) {
  if (e.target.matches('.nav-link') && e.target.getAttribute('onclick')?.includes("showPage('hospital')")) {
    setTimeout(() => {
      const consultoriosTab = document.getElementById('consultoriosTab');
      if (consultoriosTab && consultoriosTab.classList.contains('active')) {
        cargarConsultoriosDirecto();
      }
    }, 100);
  }
});
