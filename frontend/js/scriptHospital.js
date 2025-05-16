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
      <div class="dato">
        <strong>Nombre:</strong>
        <span>${consultorio.nombre}</span>
      </div>
      <div class="dato">
        <strong>Estatus:</strong>
        <span><span class="circle" style="background:${color}; margin-right:6px;"></span>${consultorio.estatus}</span>
      </div>
    `;

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
// Mostrar detalles del médico
// ========================
function mostrarDetallesMedico(medico) {
  const panel = document.getElementById('resultadoMedico');
  if (!panel) return;

  panel.innerHTML = `
    <div class="dato"><strong>Nombre:</strong> <span>${medico.nombre} ${medico.apellidoPaterno} ${medico.apellidoMaterno}</span></div>
    <div class="dato"><strong>Correo:</strong> <span>${medico.correo}</span></div>
    <div class="dato"><strong>Teléfono:</strong> <span>${medico.telefono}</span></div>
    <div class="dato"><strong>Especialidad:</strong> <span>${medico.especialidad}</span></div>
    <div class="dato"><strong>Estado:</strong> <span>${medico.estado}</span></div>
    <div class="dato"><strong>Fecha de Registro:</strong> <span>${medico.fechaCreacion}</span></div>
  `;
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
