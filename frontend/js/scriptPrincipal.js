// ========================
// Funciones del Dashboard (scriptPrincipal.js)
// ========================

// Alternar menú lateral
function toggleMenu() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('collapsed');

  if (window.innerWidth <= 992) {
    sidebar.classList.toggle('show');
  }
}

// Mostrar secciones del sistema
function showPage(pageId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.remove('active'));

  document.getElementById(pageId).classList.add('active');

  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => link.classList.remove('active'));

  const activeLink = Array.from(navLinks).find(link => 
    link.getAttribute('onclick').includes(`showPage('${pageId}')`));

  if (activeLink) {
    activeLink.classList.add('active');
  }

  updatePageTitle(pageId);

  if (window.innerWidth <= 992) {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.remove('show');
  }
}

// Actualizar el título de la página
function updatePageTitle(pageId) {
  const titleElement = document.getElementById('currentPageTitle');
  const titles = {
    home: 'Dashboard',
    citas: 'Gestión de Citas',
    pacientes: 'Gestión de Pacientes',
    usuarios: 'Gestión de Usuarios',
    bitacora: 'Gestión de Bitácora',
    hospital: 'Gestión de Hospital',
    registro: 'Registro de Usuario',
    medicos: 'Gestión de Médicos',
    consultorios: 'Gestión de Consultorios',
    registroDoctores:'Registro de Medicos',
    registroConsultorio:'Registro de Consultorios',
    registroPacientes:'Registro de Pacientes',
    registroCita:'Registro de Citas'
  };
  titleElement.textContent = titles[pageId] || 'DigitalMedSuite';
}

// Cambiar tema claro/oscuro
function toggleTheme() {
  const htmlElement = document.documentElement;
  const themeIcon = document.getElementById('themeIcon');

  const isDarkTheme = htmlElement.getAttribute('data-theme') === 'dark';
  if (isDarkTheme) {
    htmlElement.removeAttribute('data-theme');
    themeIcon.setAttribute('icon', 'mdi:moon-waning-crescent');
    localStorage.setItem('theme', 'light');
  } else {
    htmlElement.setAttribute('data-theme', 'dark');
    themeIcon.setAttribute('icon', 'mdi:weather-sunny');
    localStorage.setItem('theme', 'dark');
  }
}

// Verificar autenticación
function checkAuth() {
  console.log('Verificando autenticación...');
  if (!window.authUtils.isAuthenticated()) {
    console.warn('No autenticado. Redirigiendo a la página de inicio de sesión...');
    window.location.replace('index.html');
    return false;
  }
  
  // Verificar que tenemos datos del usuario
  const userData = getUserData();
  if (!userData || !userData.username) {
    console.warn('Datos de usuario inválidos. Redirigiendo a la página de inicio de sesión...');
    window.authUtils.logout();
    window.location.replace('index.html');
    return false;
  }
  
  console.log('Usuario autenticado:', userData.username);
  return true;
}

// Obtener datos del usuario autenticado
function getUserData() {
  return window.authUtils.getUserData();
}

// Cerrar sesión
function logout() {
  window.authUtils.logout();
  window.location.href = 'index.html';
}

// Actualizar UI con datos del usuario
function updateUserInterface() {
  const userData = getUserData();
  if (userData) {
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
      userNameElement.textContent = userData.username;
    }

    // Verificar que el rol existe
    const userRole = userData.rol ? userData.rol.toLowerCase() : 'user';
    console.log('Rol del usuario:', userRole);
    
    const adminOnlyElements = document.querySelectorAll('.admin-only');
    const medicOnlyElements = document.querySelectorAll('.medic-only');

    adminOnlyElements.forEach(el => el.style.display = userRole === 'admin' ? '' : 'none');
    medicOnlyElements.forEach(el => el.style.display = userRole === 'medico' ? '' : 'none');
  } else {
    console.warn('No se encontraron datos de usuario para actualizar la interfaz');
  }
}

// Cargar citas del día desde scriptCitas.js
function cargarCitasHoy() {
  const citasListaHoy = document.getElementById('citasListaHoy');
  if (!citasListaHoy || typeof citasPorFiltro === 'undefined') return;

  citasListaHoy.innerHTML = '';

  const citas = citasPorFiltro.hoy || [];

  if (citas.length === 0) {
    citasListaHoy.innerHTML = `
      <div class="empty-state">
        <iconify-icon icon="mdi:calendar-blank" width="48"></iconify-icon>
        <p>No hay citas programadas para hoy</p>
      </div>`;
    return;
  }

  citas.forEach(cita => {
    const citaElement = document.createElement('div');
    citaElement.className = 'cita';
    citaElement.innerHTML = `
      <div class="dato"><strong>Nombre:</strong> <span>${cita.nombre}</span></div>
      <div class="dato"><strong>Hora:</strong> <span>${cita.hora}</span></div>
      <div class="dato"><strong>Médico Asignado:</strong> <span>${cita.medico}</span></div>
    `;
    citasListaHoy.appendChild(citaElement);
  });
}

// Pestañas de hospital
function setupHospitalTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(tab => tab.classList.remove('active'));

      btn.classList.add('active');
      const selectedTab = document.getElementById(btn.dataset.tab);
      if (selectedTab) selectedTab.classList.add('active');
    });
  });
}

// Mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
  // Crear el elemento de notificación
  const notificacion = document.createElement('div');
  notificacion.className = `notificacion ${tipo}`;
  
  // Iconos según el tipo de notificación
  let icono = '';
  switch (tipo) {
    case 'success':
      icono = '<iconify-icon icon="mdi:check-circle" width="20"></iconify-icon>';
      break;
    case 'error':
      icono = '<iconify-icon icon="mdi:alert-circle" width="20"></iconify-icon>';
      break;
    case 'warning':
      icono = '<iconify-icon icon="mdi:alert" width="20"></iconify-icon>';
      break;
    default:
      icono = '<iconify-icon icon="mdi:information" width="20"></iconify-icon>';
  }
  
  // Contenido de la notificación
  notificacion.innerHTML = `
    <div class="notificacion-icono">${icono}</div>
    <div class="notificacion-mensaje">${mensaje}</div>
    <button class="notificacion-cerrar">
      <iconify-icon icon="mdi:close" width="16"></iconify-icon>
    </button>
  `;
  
  // Contenedor de notificaciones (crearlo si no existe)
  let contenedor = document.getElementById('notificaciones-container');
  if (!contenedor) {
    contenedor = document.createElement('div');
    contenedor.id = 'notificaciones-container';
    document.body.appendChild(contenedor);
    
    // Agregar estilos al contenedor
    contenedor.style.position = 'fixed';
    contenedor.style.top = '20px';
    contenedor.style.right = '20px';
    contenedor.style.zIndex = '9999';
    contenedor.style.display = 'flex';
    contenedor.style.flexDirection = 'column';
    contenedor.style.gap = '10px';
    contenedor.style.maxWidth = '320px';
  }
  
  // Agregar la notificación al contenedor
  contenedor.appendChild(notificacion);
  
  // Estilos para la notificación
  notificacion.style.backgroundColor = 'white';
  notificacion.style.borderRadius = '8px';
  notificacion.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  notificacion.style.padding = '12px 16px';
  notificacion.style.display = 'flex';
  notificacion.style.alignItems = 'center';
  notificacion.style.gap = '10px';
  notificacion.style.animation = 'fadeIn 0.3s';
  
  // Estilos específicos por tipo
  switch (tipo) {
    case 'success':
      notificacion.style.borderLeft = '4px solid #28a745';
      break;
    case 'error':
      notificacion.style.borderLeft = '4px solid #dc3545';
      break;
    case 'warning':
      notificacion.style.borderLeft = '4px solid #ffc107';
      break;
    default:
      notificacion.style.borderLeft = '4px solid #17a2b8';
  }
  
  // Botón de cerrar
  const btnCerrar = notificacion.querySelector('.notificacion-cerrar');
  btnCerrar.style.background = 'none';
  btnCerrar.style.border = 'none';
  btnCerrar.style.cursor = 'pointer';
  btnCerrar.style.padding = '0';
  btnCerrar.style.marginLeft = 'auto';
  
  // Evento para cerrar la notificación
  btnCerrar.addEventListener('click', () => {
    notificacion.style.opacity = '0';
    setTimeout(() => {
      notificacion.remove();
    }, 300);
  });
  
  // Auto cerrar después de 5 segundos
  setTimeout(() => {
    notificacion.style.opacity = '0';
    notificacion.style.transition = 'opacity 0.3s';
    setTimeout(() => {
      notificacion.remove();
    }, 300);
  }, 5000);
}

// Actualizar estadísticas del dashboard
async function actualizarEstadisticasCitas() {
  try {
    // Obtener todas las citas
    const citas = await window.apiService.citas.getAll();
    if (!Array.isArray(citas)) return;

    // Contar citas expiradas (estatus 5)
    const citasExpiradas = citas.filter(cita => cita.ID_Estatus === 5).length;

    // Actualizar el número en el dashboard
    const numCitasExpiradasElem = document.querySelector('.stat-card:nth-child(4) .stat-details h3');
    if (numCitasExpiradasElem) {
      numCitasExpiradasElem.textContent = citasExpiradas;
    }

    // Actualizar el texto de las citas expiradas
    const expiradasProgressElem = document.querySelector('.stat-card:nth-child(4) .stat-progress span');
    if (expiradasProgressElem) {
      expiradasProgressElem.textContent = 'Citas expiradas';
    }
  } catch (error) {
    console.error('Error al actualizar estadísticas:', error);
  }
}

// Actualizar contador de pacientes
async function actualizarContadorPacientes() {
  try {
    // Obtener todos los pacientes
    const pacientes = await window.apiService.pacientes.getAll();
    if (!Array.isArray(pacientes)) return;

    // Actualizar el número en el dashboard
    const numPacientesElement = document.querySelector('.stat-card:first-child .stat-details h3');
    if (numPacientesElement) {
      numPacientesElement.textContent = pacientes.length;
    }

    // Actualizar el texto de total de pacientes
    const pacientesProgressElem = document.querySelector('.stat-card:first-child .stat-progress span');
    if (pacientesProgressElem) {
      pacientesProgressElem.textContent = 'Total registrados';
    }
  } catch (error) {
    console.error('Error al actualizar contador de pacientes:', error);
  }
}

// Actualizar contador de citas
async function actualizarContadorCitasHoy() {
  try {
    // Obtener todas las citas
    const citas = await window.apiService.citas.getAll();
    if (!Array.isArray(citas)) return;

    // Contar todas las citas pendientes (status ID 1)
    const citasPendientes = citas.filter(cita => cita.ID_Estatus === 1).length;

    // Obtener el elemento del contador de citas
    const numCitasElement = document.querySelector('.stat-card:nth-child(2) .stat-details h3');
    if (numCitasElement) {
      numCitasElement.textContent = citasPendientes;
    }

    // Mostrar el total de citas
    const totalCitas = citas.length;    const progresoElement = document.querySelector('.stat-card:nth-child(2) .stat-progress span');
    if (progresoElement) {
      progresoElement.textContent = `${totalCitas} citas totales`;
    }
  } catch (error) {
    console.error('Error al actualizar contador de citas de hoy:', error);
  }
}

// Cargar citas al calendario
async function cargarCitasCalendario() {
  try {
    // Obtener todas las citas desde la API
    const citas = await window.apiService.citas.getAll();
    if (!Array.isArray(citas)) return [];

    // Mapear las citas al formato que espera FullCalendar
    const citasPromesas = citas.map(async cita => {
      // Formatear la fecha y hora
      const fecha = cita.Fecha_Cita.split('T')[0];
      const hora = cita.Hora_Cita || '00:00:00';
      const start = `${fecha}T${hora}`;

      // Obtener nombre del paciente
      let nombrePaciente = 'Paciente no encontrado';
      try {
        const paciente = await window.apiService.pacientes.getById(cita.ID_Paciente);
        if (paciente) {
          nombrePaciente = `${paciente.Nombre} ${paciente.Apellido_Paterno}`;
        }
      } catch (error) {
        console.error('Error al obtener paciente:', error);
      }

      // Obtener nombre del médico
      let nombreMedico = 'Médico no encontrado';
      try {
        const medico = await window.apiService.medicos.getById(cita.ID_Medico);
        if (medico) {
          nombreMedico = `Dr. ${medico.Nombre} ${medico.Apellido_Paterno}`;
        }
      } catch (error) {
        console.error('Error al obtener médico:', error);
      }

      // Obtener nombre del consultorio
      let nombreConsultorio = 'Consultorio no encontrado';
      try {
        const consultorio = await window.apiService.consultorios.getById(cita.ID_Consultorio);
        if (consultorio) {
          nombreConsultorio = consultorio.Nombre_Consultorio;
        }
      } catch (error) {
        console.error('Error al obtener consultorio:', error);
      }

      // Determinar el color y texto de estado según el estatus
      let backgroundColor;
      let textColor = '#ffffff';
      let statusText;
      switch (cita.ID_Estatus) {
        case 1: // Programada
          backgroundColor = '#4285f4'; // Azul
          statusText = 'Programada';
          break;
        case 2: // Confirmada
          backgroundColor = '#0f9d58'; // Verde
          statusText = 'Confirmada';
          break;
        case 3: // Cancelada
          backgroundColor = '#db4437'; // Rojo
          statusText = 'Cancelada';
          break;
        case 4: // Completada
          backgroundColor = '#673ab7'; // Morado
          statusText = 'Completada';
          break;
        case 5: // No Asistió
          backgroundColor = '#ff9800'; // Naranja
          statusText = 'No Asistió';
          break;
        default:
          backgroundColor = '#757575'; // Gris por defecto
          statusText = 'Estado desconocido';
      }

      return {
        title: `${nombrePaciente} (${statusText})`,
        start: start,
        backgroundColor: backgroundColor,
        borderColor: backgroundColor,
        textColor: textColor,
        allDay: false,
        extendedProps: {
          idCita: cita.ID_Cita,
          paciente: nombrePaciente,
          medico: nombreMedico,
          consultorio: nombreConsultorio,
          estatus: statusText
        }
      };
    });

    return await Promise.all(citasPromesas);
  } catch (error) {
    console.error('Error al cargar citas para el calendario:', error);
    return [];
  }
}

// Inicialización del dashboard
document.addEventListener('DOMContentLoaded', async function () {
  console.log('DOM cargado - Verificando autenticación...');
  console.log('Token actual:', localStorage.getItem('authToken'));
  console.log('User data actual:', localStorage.getItem('userData'));
  
  if (!checkAuth()) {
    console.warn('No autenticado. Redireccionando a index.html');
    window.location.replace('index.html');
    return;
  }
  console.log('Autenticación verificada. Actualizando interfaz...');
  updateUserInterface();
  
  // Actualizar estadísticas iniciales
  actualizarEstadisticasCitas();
  actualizarContadorPacientes();
  actualizarContadorCitasHoy();

  const calendarEl = document.getElementById('calendar');
  if (calendarEl) {
    // Cargar las citas primero
    const events = await cargarCitasCalendario();

    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      locale: 'es',
      events: events,
      height: '100%',
      eventTimeFormat: {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      },
      eventClick: function(info) {
        const cita = info.event.extendedProps;
        // Mostrar información detallada de la cita
        const contenido = `
          Cita ID: ${cita.idCita}
          Paciente: ${cita.paciente}
          Médico: ${cita.medico}
          Consultorio: ${cita.consultorio}
          Estado: ${cita.estatus}
        `.replace(/^\s+/gm, ''); // Eliminar espacios al inicio de cada línea

        mostrarNotificacion(contenido, 'info');
      },
      dateClick: function(info) {
        // Al hacer clic en una fecha, mostrar el enlace para registrar una nueva cita
        const fecha = info.dateStr;
        mostrarNotificacion(
          `¿Desea agendar una cita para el ${fecha}? Haga clic en "Nueva Cita"`,
          'info'
        );
      }
    });
    calendar.render();

    // Función para actualizar el calendario
    async function actualizarCalendario() {
      const nuevosEventos = await cargarCitasCalendario();
      calendar.removeAllEvents();
      calendar.addEventSource(nuevosEventos);
    }

    // Actualizar el calendario cada 5 minutos
    setInterval(actualizarCalendario, 5 * 60 * 1000);

    // Exponer la función de actualización para uso global
    window.actualizarCalendario = actualizarCalendario;
  }

  // Exponemos las funciones necesarias al objeto window para que estén disponibles a otros scripts
  window.toggleMenu = toggleMenu;
  window.showPage = showPage;
  window.toggleTheme = toggleTheme;
  window.logout = logout;
  window.mostrarNotificacion = mostrarNotificacion;

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.getElementById('themeIcon').setAttribute('icon', 'mdi:weather-sunny');
  } else {
    document.getElementById('themeIcon').setAttribute('icon', 'mdi:moon-waning-crescent');
  }

  const themeToggleBtn = document.getElementById('themeToggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }

  window.addEventListener('resize', function () {
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth > 992) {
      sidebar.classList.remove('show');
    }
  });

  setupHospitalTabs();
  cargarCitasHoy();
  actualizarEstadisticasCitas();
  actualizarContadorPacientes();
  actualizarContadorCitasHoy();
});
