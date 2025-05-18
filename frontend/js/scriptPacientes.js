// ========================
// Simulación de pacientes
// ========================
const pacientesRegistrados = [
  {
    nombre: 'Roberto',
    apellidoPaterno: 'Solis',
    apellidoMaterno: 'Martínez',
    fechaNacimiento: '1999-07-12',
    calle: 'Av. Reforma',
    codigoPostal: '22000',
    numCalle: '143',
    correoElectronico: 'rsolis99@mail.com',
    telefono: '6641012020',
    altura: '1.75',
    peso: '72',
    tipo: 'General',
    alergias: 'Ninguna',
    operaciones: 'Cirugía nasal',
    padecimientos: 'Asma',
    genero: 'Masculino',
    fechaRegistro: '2024-05-01',
    estatus: 'Activo',
    curp: 'SORM990712HBCLRT01'
  },
  {
    nombre: 'Camila',
    apellidoPaterno: 'Hernández',
    apellidoMaterno: 'Lozano',
    fechaNacimiento: '2001-02-24',
    calle: 'Calle Once',
    codigoPostal: '22100',
    numCalle: '77',
    correoElectronico: 'camila.hl@gmail.com',
    telefono: '6649988776',
    altura: '1.60',
    peso: '58',
    tipo: 'Pediatría',
    alergias: 'Penicilina',
    operaciones: 'Ninguna',
    padecimientos: 'Rinitis alérgica',
    genero: 'Femenino',
    fechaRegistro: '2024-05-02',
    estatus: 'Activo',
    curp: 'HELC010224MJCLZM05'
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

  pacientesRegistrados.forEach((paciente, index) => {
    const div = document.createElement("div");
    div.classList.add("cita");
    div.setAttribute("data-index", index);

    div.innerHTML = `
      <div class="dato"><strong>Nombre:</strong> <span>${paciente.nombre} ${paciente.apellidoPaterno}</span></div>
      <div class="dato"><strong>CURP:</strong> <span>${paciente.curp}</span></div>
    `;

    div.addEventListener("click", () => seleccionarPaciente(div, paciente));
    lista.appendChild(div);
  });
}

function seleccionarPaciente(elemento, datos) {
  document.querySelectorAll("#listaPacientes .cita").forEach((p) => p.classList.remove("seleccionada"));
  elemento.classList.add("seleccionada");
  pacienteSeleccionado = datos;
  mostrarPacienteSeleccionado(datos);
  const botonModificar = document.getElementById("btnModificarPaciente");
  if (botonModificar) botonModificar.disabled = false;
}

function mostrarPacienteSeleccionado(paciente) {
  const panel = document.getElementById("resultadoPacientes");
  if (!panel) return;

  const seccion = (titulo, campos) => `
  <div style="width: 100%;">
    <hr style="border: none; border-top: 2px solid black; margin-bottom: 10px;">
    <h3 style="font-size: 1.2rem; font-weight: bold; margin-bottom: 16px;">${titulo}:</h3>
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

  const datosPersonales = [
    ['Nombre', paciente.nombre],
    ['Apellido Paterno', paciente.apellidoPaterno],
    ['Apellido Materno', paciente.apellidoMaterno],
    ['Fecha Nacimiento', paciente.fechaNacimiento],
    ['CURP', paciente.curp],
    ['Correo', paciente.correoElectronico],
    ['Teléfono', paciente.telefono],
    ['Calle', paciente.calle],
    ['Número', paciente.numCalle],
    ['Código Postal', paciente.codigoPostal],
    ['Género', paciente.genero]
  ];

  const datosMedicos = [
    ['Altura', `${paciente.altura} m`],
    ['Peso', `${paciente.peso} kg`],
    ['Tipo de Paciente', paciente.tipo],
    ['Alergias', paciente.alergias],
    ['Operaciones', paciente.operaciones],
    ['Padecimientos', paciente.padecimientos]
  ];

  const otros = [
    ['Fecha Registro', paciente.fechaRegistro],
    ['Estatus', paciente.estatus]
  ];

  panel.innerHTML = `
  <div class="tarjeta" style="border: 2px solid black; border-radius: 12px; padding: 24px; background: white; box-shadow: var(--shadow-md); display: flex; flex-direction: column; gap: 40px;">
    ${seccion('Datos Personales', datosPersonales)}
    ${seccion('Datos Médicos', datosMedicos)}
    ${seccion('Información Administrativa', otros)}
  </div>
`;
}

// ========================
// Inicialización
// ========================
document.addEventListener("DOMContentLoaded", function () {
  cargarPacientes();
});
