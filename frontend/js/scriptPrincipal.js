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

// Inicialización del dashboard
document.addEventListener('DOMContentLoaded', function () {
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

  const calendarEl = document.getElementById('calendar');
  if (calendarEl) {
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      locale: 'es',
      events: [],
      height: '100%'
    });
    calendar.render();
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
});
