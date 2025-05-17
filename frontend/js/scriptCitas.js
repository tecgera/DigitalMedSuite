// ========================
// Simulación de citas por filtro
// ========================
const citasPorFiltro = {
    hoy: [
      { nombre: 'Juan Pérez', hora: '09:00 AM', medico: 'Dra. Ramírez' },
      { nombre: 'Ana Torres', hora: '10:30 AM', medico: 'Dr. Salas' }
    ],
    manana: [
      { nombre: 'Luis Mendoza', hora: '08:00 AM', medico: 'Dra. López' }
    ],
    semana: [
      { nombre: 'Carlos Díaz', hora: '01:00 PM', medico: 'Dr. Ortega' },
      { nombre: 'Marta García', hora: '02:15 PM', medico: 'Dra. Luján' }
    ]
  };
  
  let citaSeleccionada = null; // Cita actualmente seleccionada
  
  // ========================
  // Cargar citas del filtro activo
  // ========================
  function cargarCitas(filtro) {
    const lista = document.getElementById('listaCitas');
    if (!lista) return;
  
    lista.innerHTML = '';
  
    const citas = citasPorFiltro[filtro] || [];
  
    citas.forEach((cita, index) => {
      const div = document.createElement('div');
      div.classList.add('cita');
      div.setAttribute('data-index', index);
      div.setAttribute('data-filtro', filtro);
  
      div.innerHTML = `
        <div class="dato"><strong>Nombre:</strong> <span>${cita.nombre}</span></div>
        <div class="dato"><strong>Hora:</strong> <span>${cita.hora}</span></div>
        <div class="dato"><strong>Médico Asignado:</strong> <span>${cita.medico}</span></div>
      `;
  
      div.addEventListener('click', () => seleccionarCita(div, cita));
      lista.appendChild(div);
    });
  }
  
  // ========================
  // Selección visual de cita
  // ========================
  function seleccionarCita(elemento, datos) {
    document.querySelectorAll('.cita').forEach(c => c.classList.remove('seleccionada'));
    elemento.classList.add('seleccionada');
    citaSeleccionada = datos;
  
    mostrarCitaSeleccionada(datos);
    document.getElementById('btnModificarCita').disabled = false;
  }
  
  // ========================
  // Mostrar en panel derecho
  // ========================
  function mostrarCitaSeleccionada(cita) {
    const panel = document.getElementById('resultadoCita');
    if (!panel) return;
  
    panel.innerHTML = `
      <div class="dato"><strong>Nombre:</strong> <span>${cita.nombre}</span></div>
      <div class="dato"><strong>Hora:</strong> <span>${cita.hora}</span></div>
      <div class="dato"><strong>Médico Asignado:</strong> <span>${cita.medico}</span></div>
    `;
  }
  
  // ========================
  // Búsqueda por texto
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
  // Inicialización
  // ========================
  document.addEventListener('DOMContentLoaded', function () {
    const seccionCitas = document.getElementById('citas');
    if (!seccionCitas) return; 
  
    // Activar pestañas de filtro
    document.querySelectorAll('.filtro-fecha').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filtro-fecha').forEach(b => b.classList.remove('activo'));
        btn.classList.add('activo');
  
        const filtro = btn.getAttribute('data-filtro');
        cargarCitas(filtro);
        citaSeleccionada = null;
        document.getElementById('resultadoCita').innerHTML = '';
        document.getElementById('btnModificarCita').disabled = true;
      });
    });
  
    // Botón buscar
    const btnBuscar = document.getElementById('btnBuscar');
    if (btnBuscar) {
      btnBuscar.addEventListener('click', buscarCita);
    }
  
    let tipoBusqueda = 'paciente'; 

    const filtrosBusqueda = document.querySelectorAll('.filtro-busqueda');
    filtrosBusqueda.forEach(filtro => {
    filtro.addEventListener('click', () => {
    filtrosBusqueda.forEach(f => f.classList.remove('activo'));
    filtro.classList.add('activo');
    tipoBusqueda = filtro.getAttribute('data-filtro');
    });
    });
        
        const inputBusqueda = document.getElementById('busquedaCita');
        if (inputBusqueda) {
        inputBusqueda.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
        e.preventDefault(); 
         buscarCita();       
        }
        });
        }

    cargarCitas('hoy');
  });

  // ========================
// Mostrar "Citas de Hoy" en la sección principal (home)
// ========================
document.addEventListener('DOMContentLoaded', function () {
    const contenedorCitasHome = document.getElementById('citasListaHoy');
  
    if (contenedorCitasHome) {
      const citasHoy = citasPorFiltro.hoy;
  
      citasHoy.forEach(cita => {
        const div = document.createElement('div');
        div.classList.add('cita');
        div.innerHTML = `
          <div class="dato"><strong>Nombre:</strong> <span>${cita.nombre}</span></div>
          <div class="dato"><strong>Hora:</strong> <span>${cita.hora}</span></div>
          <div class="dato"><strong>Médico Asignado:</strong> <span>${cita.medico}</span></div>
        `;
        contenedorCitasHome.appendChild(div);
      });
    }
  });