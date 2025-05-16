// ========================
// Simulación de pacientes
// ========================
const pacientesSimulados = [
  {
    nombre: "Juan Pérez",
    expediente: "EXP-001",
    direccion: "Av. Revolución 123",
    telefono: "664-123-4567",
    tipoSangre: "O+",
    altura: "1.75",
    peso: "70"
  },
  {
    nombre: "Ana Gómez",
    expediente: "EXP-002",
    direccion: "Calle Segunda 456",
    telefono: "664-987-6543",
    tipoSangre: "A-",
    altura: "1.60",
    peso: "60"
  },
  {
    nombre: "Luis Martínez",
    expediente: "EXP-003",
    direccion: "Blvd. Agua Caliente 789",
    telefono: "664-555-1212",
    tipoSangre: "B+",
    altura: "1.82",
    peso: "85"
  }
];

let pacienteSeleccionado = null;

// ========================
// Cargar pacientes
// ========================
function cargarPacientes() {
  const lista = document.getElementById("listaPacientes");
  const resultado = document.getElementById("resultadoPacientes");
  if (!lista || !resultado) return;

  lista.innerHTML = "";
  resultado.innerHTML = `<div class="empty-state">
    <iconify-icon icon="material-symbols:clinical-notes-outline-rounded" width="48"></iconify-icon>
    <p>Seleccione un paciente para ver los detalles</p>
  </div>`;

  pacientesSimulados.forEach((paciente, index) => {
    const div = document.createElement("div");
    div.classList.add("cita");
    div.setAttribute("data-index", index);

    div.innerHTML = `
      <div class="dato"><strong>Nombre:</strong> <span>${paciente.nombre}</span></div>
      <div class="dato"><strong>Expediente:</strong> <span>${paciente.expediente}</span></div>
    `;

    div.addEventListener("click", () => seleccionarPaciente(div, paciente));
    lista.appendChild(div);
  });
}

// ========================
// Selección visual
// ========================
function seleccionarPaciente(elemento, datos) {
  document.querySelectorAll("#listaPacientes .cita").forEach((p) => p.classList.remove("seleccionada"));
  elemento.classList.add("seleccionada");
  pacienteSeleccionado = datos;
  mostrarPacienteSeleccionado(datos);
  const botonModificar = document.getElementById("btnModificarPaciente");
  if (botonModificar) botonModificar.disabled = false;
}

// ========================
// Mostrar datos del paciente
// ========================
function mostrarPacienteSeleccionado(paciente) {
  const panel = document.getElementById("resultadoPacientes");
  if (!panel) return;

  panel.innerHTML = `
    <div class="dato"><strong>Nombre:</strong> <span>${paciente.nombre}</span></div>
    <div class="dato"><strong>Expediente:</strong> <span>${paciente.expediente}</span></div>
    <div class="dato"><strong>Dirección:</strong> <span>${paciente.direccion}</span></div>
    <div class="dato"><strong>Teléfono:</strong> <span>${paciente.telefono}</span></div>
    <div class="dato"><strong>Tipo de Sangre:</strong> <span>${paciente.tipoSangre}</span></div>
    <div class="dato"><strong>Altura:</strong> <span>${paciente.altura} mts</span></div>
    <div class="dato"><strong>Peso:</strong> <span>${paciente.peso} kg</span></div>
  `;
}

// ========================
// Inicializar
// ========================
document.addEventListener("DOMContentLoaded", function () {
  const seccionPacientes = document.getElementById("pacientes");
  if (!seccionPacientes) return;

  cargarPacientes();
});
