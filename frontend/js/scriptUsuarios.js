// ========================
// Simulación de usuarios
// ========================
const usuariosSimulados = [
  {
    nombreUsuario: "admin01",
    nombre: "Ana",
    apellido: "González",
    correo: "ana.admin@clinica.com",
    telefono: "664-111-2222",
    rol: "Administrador",
    fechaCreacion: "2024-12-01"
  },
  {
    nombreUsuario: "medico99",
    nombre: "Luis",
    apellido: "Serrano",
    correo: "luis.serrano@clinica.com",
    telefono: "664-555-7878",
    rol: "Médico",
    fechaCreacion: "2024-12-15"
  },
  {
    nombreUsuario: "recepcion1",
    nombre: "Claudia",
    apellido: "Ramírez",
    correo: "claudia.ramirez@clinica.com",
    telefono: "664-888-0000",
    rol: "Recepcionista",
    fechaCreacion: "2025-01-05"
  }
];

let usuarioSeleccionado = null;

// ========================
// Cargar usuarios
// ========================
function cargarUsuarios() {
  const lista = document.getElementById("listaUsuario");
  const resultado = document.getElementById("resultadoUsuario");
  if (!lista || !resultado) return;

  lista.innerHTML = "";
  resultado.innerHTML = `<div class="empty-state">
    <iconify-icon icon="material-symbols:clinical-notes-outline-rounded" width="48"></iconify-icon>
    <p>Seleccione un Usuario para ver los detalles</p>
  </div>`;

  usuariosSimulados.forEach((usuario, index) => {
    const div = document.createElement("div");
    div.classList.add("cita");
    div.setAttribute("data-index", index);

    div.innerHTML = `
      <div class="dato"><strong>Usuario:</strong> <span>${usuario.nombreUsuario}</span></div>
      <div class="dato"><strong>Rol:</strong> <span>${usuario.rol}</span></div>
    `;

    div.addEventListener("click", () => seleccionarUsuario(div, usuario));
    lista.appendChild(div);
  });
}

// ========================
// Selección visual
// ========================
function seleccionarUsuario(elemento, datos) {
  document.querySelectorAll("#listaUsuario .cita").forEach((u) => u.classList.remove("seleccionada"));
  elemento.classList.add("seleccionada");
  usuarioSeleccionado = datos;
  mostrarUsuarioSeleccionado(datos);
  const botonModificar = document.getElementById("btnModificarUsuario");
  if (botonModificar) botonModificar.disabled = false;
}

// ========================
// Mostrar datos del usuario
// ========================
function mostrarUsuarioSeleccionado(usuario) {
  const panel = document.getElementById("resultadoUsuario");
  if (!panel) return;

  panel.innerHTML = `
    <div class="dato"><strong>Usuario:</strong> <span>${usuario.nombreUsuario}</span></div>
    <div class="dato"><strong>Nombre:</strong> <span>${usuario.nombre} ${usuario.apellido}</span></div>
    <div class="dato"><strong>Rol:</strong> <span>${usuario.rol}</span></div>
    <div class="dato"><strong>Correo:</strong> <span>${usuario.correo}</span></div>
    <div class="dato"><strong>Teléfono:</strong> <span>${usuario.telefono}</span></div>
    <div class="dato"><strong>Fecha de creación:</strong> <span>${usuario.fechaCreacion}</span></div>
  `;
}

// ========================
// Inicializar
// ========================
document.addEventListener("DOMContentLoaded", function () {
  const seccionUsuarios = document.getElementById("usuarios");
  if (!seccionUsuarios) return;

  cargarUsuarios();
});
