// Función para alternar el menú lateral
function toggleMenu() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('collapsed');
  
  if (window.innerWidth <= 992) {
    sidebar.classList.toggle('show');
  }
}

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

function updatePageTitle(pageId) {
  const titleElement = document.getElementById('currentPageTitle');
  
  switch(pageId) {
    case 'home':
      titleElement.textContent = 'Dashboard';
      break;
    case 'citas':
      titleElement.textContent = 'Gestión de Citas';
      break;
    case 'pacientes':
      titleElement.textContent = 'Gestión de Pacientes';
      break;
    case 'usuarios':
      titleElement.textContent = 'Gestión de Usuarios';
      break;
    default:
      titleElement.textContent = 'DigitalMedSuite';
  }
}

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
    // Redirigir al login si no hay token
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

// Obtener datos del usuario desde sessionStorage
function getUserData() {
  const userData = sessionStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
}

// Cerrar sesión
function logout() {
  // Limpiar sessionStorage
  sessionStorage.removeItem('authToken');
  sessionStorage.removeItem('userData');
  // Redirigir al login
  window.location.href = 'index.html';
}

// Actualizar la interfaz con los datos del usuario
function updateUserInterface() {
  const userData = getUserData();
  if (userData) {
    // Actualizar el nombre de usuario en la barra superior
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
      userNameElement.textContent = userData.username;
    }
    
    // Mostrar/ocultar elementos según el rol del usuario
    const userRole = userData.rol.toLowerCase();
    const adminOnlyElements = document.querySelectorAll('.admin-only');
    const medicOnlyElements = document.querySelectorAll('.medic-only');
    
    adminOnlyElements.forEach(element => {
      element.style.display = userRole === 'admin' ? '' : 'none';
    });
    
    medicOnlyElements.forEach(element => {
      element.style.display = userRole === 'medico' ? '' : 'none';
    });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Verificar autenticación primero
  if (!checkAuth()) return;
  
  // Actualizar la interfaz con los datos del usuario
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
      events: [
        {
          title: 'Consulta: María García',
          start: '2025-05-10T10:00:00',
          end: '2025-05-10T11:00:00'
        },
        {
          title: 'Consulta: Juan Pérez',
          start: '2025-05-15T14:30:00',
          end: '2025-05-15T15:30:00'
        },
        {
          title: 'Revisión: Carlos López',
          start: '2025-05-04T09:00:00',
          end: '2025-05-04T10:00:00'
        }
      ],
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
  
  // Configurar el botón de cerrar sesión
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
  
  window.addEventListener('resize', function() {
    const sidebar = document.getElementById('sidebar');
    
    if (window.innerWidth > 992) {
      sidebar.classList.remove('show');
    }
  });
  
  // Cargar citas
  cargarCitasHoy();
});

function cargarCitasHoy() {
  const citasListaHoy = document.getElementById('citasListaHoy');
  
  if (!citasListaHoy) return;
  
  const emptyState = citasListaHoy.querySelector('.empty-state');
  if (emptyState) {
    citasListaHoy.removeChild(emptyState);
  }
  
  const citas = [
    {
      paciente: 'María García',
      fecha: '4 Mayo, 2025',
      hora: '09:00 AM',
      medico: 'Dr. Ramírez',
      tipo: 'Consulta General',
      estado: 'Confirmada'
    },
    {
      paciente: 'Juan Pérez',
      fecha: '4 Mayo, 2025',
      hora: '10:30 AM',
      medico: 'Dra. Sánchez',
      tipo: 'Revisión',
      estado: 'En espera'
    },
    {
      paciente: 'Carlos López',
      fecha: '4 Mayo, 2025',
      hora: '12:00 PM',
      medico: 'Dr. Gutiérrez',
      tipo: 'Evaluación',
      estado: 'Confirmada'
    }
  ];
  
  citas.forEach(cita => {
    const citaElement = document.createElement('div');
    citaElement.className = 'cita';
    
    citaElement.innerHTML = `
      <div class="dato">
        <strong>Paciente:</strong>
        <span>${cita.paciente}</span>
      </div>
      <div class="dato">
        <strong>Fecha:</strong>
        <span>${cita.fecha}</span>
      </div>
      <div class="dato">
        <strong>Hora:</strong>
        <span>${cita.hora}</span>
      </div>
      <div class="dato">
        <strong>Médico:</strong>
        <span>${cita.medico}</span>
      </div>
      <div class="dato">
        <strong>Tipo:</strong>
        <span>${cita.tipo}</span>
      </div>
      <div class="dato">
        <strong>Estado:</strong>
        <span>${cita.estado}</span>
      </div>
    `;
    
    citasListaHoy.appendChild(citaElement);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  cargarCitasHoy();
});