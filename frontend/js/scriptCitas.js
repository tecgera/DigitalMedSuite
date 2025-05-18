// ========================
// Datos simulados (ajustables)
// ========================
const citasPorFiltro = {
  hoy: [
    {
      nombre: 'Juan Pérez',
      hora: '09:00 AM',
      fechaHora: '2025-05-17 09:00',
      medico: 'Dra. Ramírez',
      consultorio: 'Consultorio 3',
      estatus: 'Confirmada',
      fechaRegistro: '2025-05-01',
      ultimaActualizacion: '2025-05-15'
    },
    {
      nombre: 'Ana Torres',
      hora: '10:30 AM',
      fechaHora: '2025-05-17 10:30',
      medico: 'Dr. Salas',
      consultorio: 'Consultorio 1',
      estatus: 'Pendiente',
      fechaRegistro: '2025-05-02',
      ultimaActualizacion: '2025-05-14'
    },
    {
      nombre: 'Luis Mendoza',
      hora: '11:45 AM',
      fechaHora: '2025-05-17 11:45',
      medico: 'Dra. Herrera',
      consultorio: 'Consultorio 5',
      estatus: 'Cancelada',
      fechaRegistro: '2025-05-03',
      ultimaActualizacion: '2025-05-16'
    }
  ],
  manana: [
    {
      nombre: 'Claudia Ramírez',
      hora: '08:00 AM',
      fechaHora: '2025-05-18 08:00',
      medico: 'Dr. Ortega',
      consultorio: 'Consultorio 2',
      estatus: 'Confirmada',
      fechaRegistro: '2025-05-14',
      ultimaActualizacion: '2025-05-16'
    },
    {
      nombre: 'Roberto Salinas',
      hora: '09:30 AM',
      fechaHora: '2025-05-18 09:30',
      medico: 'Dra. Luna',
      consultorio: 'Consultorio 4',
      estatus: 'Pendiente',
      fechaRegistro: '2025-05-15',
      ultimaActualizacion: '2025-05-16'
    }
  ],
  semana: [
    {
      nombre: 'Daniela Flores',
      hora: '02:00 PM',
      fechaHora: '2025-05-19 14:00',
      medico: 'Dr. Méndez',
      consultorio: 'Consultorio 6',
      estatus: 'Confirmada',
      fechaRegistro: '2025-05-12',
      ultimaActualizacion: '2025-05-16'
    },
    {
      nombre: 'Miguel Ángel Ruiz',
      hora: '03:15 PM',
      fechaHora: '2025-05-20 15:15',
      medico: 'Dra. Vázquez',
      consultorio: 'Consultorio 1',
      estatus: 'Pendiente',
      fechaRegistro: '2025-05-10',
      ultimaActualizacion: '2025-05-13'
    },
    {
      nombre: 'Verónica Castillo',
      hora: '04:45 PM',
      fechaHora: '2025-05-21 16:45',
      medico: 'Dr. Palacios',
      consultorio: 'Consultorio 2',
      estatus: 'Cancelada',
      fechaRegistro: '2025-05-09',
      ultimaActualizacion: '2025-05-16'
    }
  ]
};

let citaSeleccionada = null;
let tipoBusqueda = 'paciente';

// ========================
// Mostrar listado de citas
// ========================
function mostrarListadoCitas(listaDestinoId, citas) {
  const lista = document.getElementById(listaDestinoId);
  if (!lista) return;
  lista.innerHTML = '';

  if (citas.length === 0) {
    lista.innerHTML = `
      <div class="empty-state">
        <iconify-icon icon="mdi:calendar-blank" width="48"></iconify-icon>
        <p>No hay citas programadas para este período</p>
      </div>`;
    return;
  }

  citas.forEach((cita, index) => {
    const div = document.createElement('div');
    div.classList.add('cita');
    div.setAttribute('data-index', index);

    div.innerHTML = `
      <div class="dato"><strong>Nombre:</strong> <span>${cita.nombre}</span></div>
      <div class="dato"><strong>Hora:</strong> <span>${cita.hora}</span></div>
      <div class="dato"><strong>Médico Asignado:</strong> <span>${cita.medico}</span></div>
    `;

    div.addEventListener('click', () => {
      seleccionarCita(div, cita);
      const botonModificar = document.getElementById('btnModificarCita');
      if (botonModificar) botonModificar.disabled = false;
    });

    lista.appendChild(div);
  });
}

// ========================
// Cargar citas por filtro
// ========================
function cargarCitas(filtro = 'todos', destino = 'listaCitas') {
  let citas = [];

  if (filtro === 'todos') {
    citas = Object.values(citasPorFiltro).flat();
  } else {
    citas = citasPorFiltro[filtro] || [];
  }

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

  panel.innerHTML = `
  <div class="tarjeta" style="border: 2px solid black; border-radius: 12px; padding: 24px; background: white; display: flex; flex-direction: column; gap: 20px;">
    
    <div style="width: 100%; padding-bottom: 8px; margin-bottom: 12px; border-bottom: 2px solid black;">
      <h3 style="font-size: 1.5rem; font-weight: bold; margin: 0;">
        Detalles de la Cita:
      </h3>
    </div>

    <div style="display: flex; flex-wrap: wrap; gap: 40px;">
      ${[
        ['Paciente', cita.nombre],
        ['Médico Asignado', cita.medico],
        ['Fecha y Hora', cita.fechaHora || cita.hora || 'No especificada'],
        ['Consultorio', cita.consultorio || 'N/D'],
        ['Estatus', cita.estatus || 'Pendiente'],
        ['Fecha de Registro', cita.fechaRegistro || 'N/D'],
        ['Última Actualización', cita.ultimaActualizacion || 'N/D']
      ].map(([label, valor]) => `
        <div style="flex: 1 1 240px; min-width: 220px;">
          <label style="font-weight: bold;">${label}:</label>
          <div style="border-bottom: 1px solid black; padding: 2px 0;">${valor}</div>
        </div>
      `).join('')}
    </div>

  </div>
`;

}

// ========================
// Búsqueda de cita
// ========================
function buscarCita() {
  const input = document.getElementById('busquedaCita');
  const panel = document.getElementById('resultadoCita');
  const botonModificar = document.getElementById('btnModificarCita');
  if (!input || !panel || !botonModificar) return;

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
    botonModificar.disabled = false;
  } else {
    panel.innerHTML = `<p>No se encontró ninguna coincidencia.</p>`;
    botonModificar.disabled = true;
  }
}

// ========================
// Inicialización general
// ========================
document.addEventListener('DOMContentLoaded', function () {
  // Cargar citas del módulo
  if (document.getElementById('listaCitas')) {
    cargarCitas('todos');
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
        if (botonModificar) botonModificar.disabled = true;
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
  }

  // Dashboard: solo mostrar citas de hoy
  const contenedorCitasHome = document.getElementById('citasListaHoy');
  if (contenedorCitasHome) {
    mostrarListadoCitas('citasListaHoy', citasPorFiltro.hoy);
  }
});