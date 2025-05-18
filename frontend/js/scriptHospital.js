// ========================
// Simulación de datos de médicos
// ========================
const medicosRegistrados = [
  {
    nombre: 'Luis',
    apellidoPaterno: 'Hernández',
    apellidoMaterno: 'García',
    correo: 'lhernandez@example.com',
    telefono: '6641234567',
    especialidad: 'Cardiología',
    estado: 'Activo',
    fechaCreacion: '2024-05-10'
  },
  {
    nombre: 'María',
    apellidoPaterno: 'López',
    apellidoMaterno: 'Martínez',
    correo: 'mlopez@example.com',
    telefono: '6647654321',
    especialidad: 'Neurología',
    estado: 'Activo',
    fechaCreacion: '2024-04-20'
  }
];

let medicoSeleccionado = null;

// ========================
// Simulación de datos de consultorios
// ========================
const consultorios = [
  {
    nombre: 'Consultorio 101',
    estatus: 'Disponible'
  },
  {
    nombre: 'Consultorio 102',
    estatus: 'Ocupado'
  },
  {
    nombre: 'Consultorio 103',
    estatus: 'En mantenimiento'
  },
  {
    nombre: 'Consultorio 104',
    estatus: 'Dado de baja'
  }
];

let filtroActual = 'todos';

// ========================
// Cargar consultorios con filtro
// ========================
function cargarConsultorios() {
  const lista = document.getElementById('listaConsultorios');
  if (!lista) return;

  lista.innerHTML = '';

  const filtrados = filtroActual === 'todos'
    ? consultorios
    : consultorios.filter(c => c.estatus === filtroActual);

  if (filtrados.length === 0) {
    lista.innerHTML = `
      <div class="empty-state">
        <iconify-icon icon="mdi:office-building" width="48"></iconify-icon>
        <p>No hay consultorios registrados</p>
      </div>`;
    return;
  }

  filtrados.forEach((consultorio, index) => {
    const div = document.createElement('div');
    div.classList.add('cita');
    div.setAttribute('data-index', index);

    const color = obtenerColorPorEstatus(consultorio.estatus);

    div.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div style="margin-left: 16px; display: flex; flex-wrap: wrap; gap: 30px;">
          <div class="dato"><strong>Nombre:</strong> <span>${consultorio.nombre}</span></div>
          <div class="dato" style="display: flex; align-items: center;"><strong>Estatus:</strong>
            <span class="estatus-text-wrapper" style="margin-left: 6px; display: flex; align-items: center; gap: 6px;">
              <span class="circle" style="background:${color}; width:10px; height:10px; border-radius:50%; display:inline-block;"></span>
              <span class="estatus-text">${consultorio.estatus}</span>
            </span>
          </div>
        </div>
        <button class="btn-icon editar-btn" title="Editar estatus">
          <iconify-icon icon="mdi:pencil" width="20"></iconify-icon>
        </button>
      </div>
    `;

    div.querySelector('.editar-btn').addEventListener('click', (e) => editarConsultorioFlotante(e, index));
    lista.appendChild(div);
  });
}

function obtenerColorPorEstatus(estatus) {
  switch (estatus) {
    case 'Disponible': return '#2ecc71';
    case 'Ocupado': return '#e67e22';
    case 'En mantenimiento': return '#f1c40f';
    case 'Dado de baja': return '#e74c3c';
    default: return '#bdc3c7';
  }
}

// ========================
// Cargar médicos
// ========================
function cargarMedicos() {
  const lista = document.getElementById('listaMedicos');
  if (!lista) return;

  lista.innerHTML = '';

  if (medicosRegistrados.length === 0) {
    lista.innerHTML = `
      <div class="empty-state">
        <iconify-icon icon="mdi:doctor" width="48"></iconify-icon>
        <p>No hay médicos registrados</p>
      </div>`;
    return;
  }

  medicosRegistrados.forEach((medico, index) => {
    const div = document.createElement('div');
    div.classList.add('cita');
    div.setAttribute('data-index', index);

    div.innerHTML = `
      <div class="dato"><strong>Nombre:</strong> <span>${medico.nombre} ${medico.apellidoPaterno}</span></div>
      <div class="dato"><strong>Especialidad:</strong> <span>${medico.especialidad}</span></div>
    `;

    div.addEventListener('click', () => seleccionarMedico(div, medico));
    lista.appendChild(div);
  });
}

// ========================
// Seleccionar médico
// ========================
function seleccionarMedico(elemento, medico) {
  document.querySelectorAll('#listaMedicos .cita').forEach(el => el.classList.remove('seleccionada'));
  elemento.classList.add('seleccionada');
  medicoSeleccionado = medico;

  mostrarDetallesMedico(medico);
  document.getElementById('btnModificarMedico').disabled = false;
}

// ========================
// Mostrar detalles del médico reutilizable en filas con línea inferior
// ========================
function generarTarjetasDetalle(objeto) {
  const campos = Object.entries(objeto);
  let html = '<div class="cita" style="border:2px solid black; border-radius:12px; padding:20px; background:white; box-shadow: var(--shadow-md); transition: transform 0.3s ease; display: flex; flex-wrap: wrap; gap: 30px;">';

  for (let i = 0; i < campos.length; i += 3) {
    html += '<div style="display:flex; gap: 30px; flex: 1 1 100%;">';
    for (let j = i; j < i + 3 && j < campos.length; j++) {
      const [clave, valor] = campos[j];
      html += `
        <div style="flex: 1; display: flex; flex-direction: column;">
          <div style="display: flex; justify-content: flex-start; font-weight: 600;"><span>${capitalizar(clave)}:</span></div>
          <div style="display: flex;  padding-top: 4px; border-bottom: 1px solid black;">${valor}</div>
        </div>
      `;
    }
    html += '</div>';
  }

  html += '</div>';
  return html;
}

function capitalizar(texto) {
  return texto
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
}

function mostrarDetallesMedico(medico) {
  const panel = document.getElementById('resultadoMedico');
  if (!panel) return;
  panel.innerHTML = generarTarjetasDetalle(medico);
}

// ========================
// Inicialización
// ========================
document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('listaMedicos')) cargarMedicos();
  if (document.getElementById('listaConsultorios')) cargarConsultorios();

  const filtros = document.querySelectorAll('.filtro-btn');
  filtros.forEach(btn => {
    btn.addEventListener('click', () => {
      filtros.forEach(b => b.classList.remove('activo'));
      btn.classList.add('activo');
      filtroActual = btn.dataset.estatus;
      cargarConsultorios();
    });
  });
});

// ========================
// Editar Consultorio flotante
// ========================
function editarConsultorioFlotante(event, index) {
  const consultorio = consultorios[index];
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
  select.className = 'estatus-selector';
  select.style.minWidth = '180px';

  ['Disponible', 'Ocupado', 'En mantenimiento', 'Dado de baja'].forEach(opcion => {
    const opt = document.createElement('option');
    opt.value = opcion;
    opt.textContent = opcion;
    if (opcion === consultorio.estatus) opt.selected = true;
    select.appendChild(opt);
  });

  const guardar = document.createElement('button');
  guardar.textContent = 'Guardar';
  guardar.className = 'btn primary-btn';
  guardar.style.marginTop = '8px';
  guardar.addEventListener('click', () => {
    consultorio.estatus = select.value;
    contenedor.remove();
    cargarConsultorios();
  });

  contenedor.appendChild(select);
  contenedor.appendChild(guardar);
  document.body.appendChild(contenedor);
}