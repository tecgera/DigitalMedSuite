// ========================
// Simulación de usuarios (basado en el modelo de BD)
// ========================
const usuariosSimulados = [
  {
    idUsuario: 1,
    nombreUsuario: "admin01",
    contrasenaHash: "**********",
    idRol: 1,
    rol: "Administrador",
    nombre: "Ana",
    apellido: "González",
    correo: "ana.admin@clinica.com",
    telefono: "6641112222",
    idEstatus: 1,
    estatus: "Activo",
    fechaCreacion: "2024-12-01"
  },
  {
    idUsuario: 2,
    nombreUsuario: "medico99",
    contrasenaHash: "**********",
    idRol: 2,
    rol: "Médico",
    nombre: "Luis",
    apellido: "Serrano",
    correo: "luis.serrano@clinica.com",
    telefono: "6645557878",
    idEstatus: 1,
    estatus: "Activo",
    fechaCreacion: "2024-12-15"
  },
  {
    idUsuario: 3,
    nombreUsuario: "recepcion1",
    contrasenaHash: "**********",
    idRol: 3,
    rol: "Recepcionista",
    nombre: "Claudia",
    apellido: "Ramírez",
    correo: "claudia.ramirez@clinica.com",
    telefono: "6648880000",
    idEstatus: 2,
    estatus: "Suspendido",
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

  const campos = [
    ['Usuario', usuario.nombreUsuario],
    ['Nombre Completo', `${usuario.nombre} ${usuario.apellido}`],
    ['Correo', usuario.correo],
    ['Teléfono', usuario.telefono],
    ['Rol', usuario.rol],
    ['Estatus', usuario.estatus],
    ['Fecha de Creación', usuario.fechaCreacion]
  ];

panel.innerHTML = `
  <div class="tarjeta" style="border: 2px solid black; border-radius: 12px; padding: 24px; background: white; display: flex; flex-direction: column; gap: 20px;">
    
    <div style="width: 100%;">
      <h3 style="
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 6px;
      ">
        Información del Usuario:
      </h3>
      <div style="border-bottom: 2px solid black; width: 100%;"></div>
    </div>

    <div style="display: flex; flex-wrap: wrap; gap: 40px;">
      ${campos.map(([label, valor]) => `
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
// Inicializar
// ========================
document.addEventListener("DOMContentLoaded", function () {
  cargarUsuarios();
});
