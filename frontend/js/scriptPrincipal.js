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
  const token = sessionStorage.getItem('authToken');
  if (!token) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

// Obtener datos del usuario autenticado
function getUserData() {
  const userData = sessionStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
}

// Cerrar sesión
function logout() {
  sessionStorage.removeItem('authToken');
  sessionStorage.removeItem('userData');
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

    const userRole = userData.rol.toLowerCase();
    const adminOnlyElements = document.querySelectorAll('.admin-only');
    const medicOnlyElements = document.querySelectorAll('.medic-only');

    adminOnlyElements.forEach(el => el.style.display = userRole === 'admin' ? '' : 'none');
    medicOnlyElements.forEach(el => el.style.display = userRole === 'medico' ? '' : 'none');
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

// Inicialización del dashboard
document.addEventListener('DOMContentLoaded', function () {
  if (!checkAuth()) return;
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

  window.toggleMenu = toggleMenu;
  window.showPage = showPage;
  window.toggleTheme = toggleTheme;
  window.logout = logout;

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
