// Variables globales para el registro/edición de pacientes
let modoEdicionPaciente = false;
let pacienteEditando = null;

document.addEventListener('DOMContentLoaded', function() {
  // Initialize flatpickr
  const fechaNacimientoInput = document.getElementById('fechaNacimiento');
  if (fechaNacimientoInput) {
    flatpickr("#fechaNacimiento", {
      dateFormat: "Y-m-d",
      locale: "es",
      maxDate: "today",
      monthSelectorType: "static"
    });
  }
  
  // Configurar el formulario de registro/edición
  setupFormularioPaciente();
});

function setupFormularioPaciente() {
  // Obtener referencia al formulario
  const formulario = document.querySelector('#formPaciente');
  if (!formulario) return;
    // Configurar evento de submit
  formulario.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validar CURP
    const curpInput = formulario.querySelector('#curp');
    if (curpInput && curpInput.value && curpInput.value.length > 15) {
      curpInput.value = curpInput.value.substring(0, 15);
      alert('La CURP se ha truncado a 15 caracteres máximo');
    }
    
    await guardarPaciente();
  });
  
  // Configurar botón de cancelar
  const btnCancelar = formulario.querySelector('.btn-cancel');
  if (btnCancelar) {
    btnCancelar.addEventListener('click', (e) => {
      e.preventDefault();
      // Si estamos en modo edición, volvemos a la vista detalle
      if (modoEdicionPaciente && pacienteEditando) {
        showPage('pacientes');
      } else {
        // Si estamos registrando un nuevo paciente, limpiamos el formulario
        formulario.reset();
        showPage('pacientes');
      }
    });
  }
}

async function guardarPaciente() {
  try {
    // Cambiar el botón a estado de carga
    const submitBtn = document.querySelector('#formPaciente .btn-submit');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<iconify-icon icon="mdi:loading" class="spin"></iconify-icon> Guardando...';
    }
      // Recopilar datos del formulario
    const formData = new FormData(document.querySelector('#formPaciente'));
    const pacienteData = {
      Nombre: formData.get('nombre'),
      Apellido_Paterno: formData.get('apellido_paterno'),
      Apellido_Materno: formData.get('apellido_materno'),
      CURP: formData.get('curp') ? (formData.get('curp').length > 15 ? formData.get('curp').substring(0, 15) : formData.get('curp')) : null,
      Fecha_Nacimiento: formData.get('fecha_nacimiento'),
      Calle: formData.get('calle'),
      Num_Calle: formData.get('num_calle') ? parseInt(formData.get('num_calle')) : null,
      Codigo_Postal: formData.get('codigo_postal') ? parseInt(formData.get('codigo_postal')) : null,
      Correo_Electronico: formData.get('correo'),
      Telefono: formData.get('telefono'),
      Altura: formData.get('altura') ? parseFloat(formData.get('altura')) : null,
      Peso: formData.get('peso') ? parseFloat(formData.get('peso')) : null,
      ID_Tipo: formData.get('tipo_sangre') ? parseInt(formData.get('tipo_sangre')) : null,
      ID_Genero: formData.get('genero') ? parseInt(formData.get('genero')) : null,
      ID_Estatus: 1, // Activo por defecto
    };
    
    // Procesar alergias, operaciones y padecimientos
    // Aquí debemos procesar los valores dinámicos (podría requerir lógica adicional según el backend)
    const alergias = formData.getAll('alergia[]');
    const operaciones = formData.getAll('operacion[]');
    const padecimientos = formData.getAll('padecimiento[]');
    
    // Simplificación: solo tomamos el primer valor no-ninguna
    pacienteData.ID_Alergias = obtenerIdCatalogo(alergias.find(a => a !== 'ninguna') || 'ninguna', 'alergias');
    pacienteData.ID_Operaciones = obtenerIdCatalogo(operaciones.find(o => o !== 'ninguna') || 'ninguna', 'operaciones');
    pacienteData.ID_Padecimientos = obtenerIdCatalogo(padecimientos.find(p => p !== 'ninguna') || 'ninguna', 'padecimientos');
    
    let response;
    
    if (modoEdicionPaciente && pacienteEditando) {
      // Estamos editando un paciente existente
      response = await window.apiService.pacientes.update(pacienteEditando.ID_Paciente, pacienteData);
      mostrarNotificacion('Paciente actualizado correctamente', 'success');
    } else {
      // Estamos creando un nuevo paciente
      response = await window.apiService.pacientes.create(pacienteData);
      mostrarNotificacion('Paciente registrado correctamente', 'success');
    }
    
    // Resetear el formulario
    document.querySelector('#formPaciente').reset();
    
    // Volver a la lista de pacientes
    showPage('pacientes');
    
    // Actualizar la lista si es necesario
    if (typeof cargarPacientes === 'function') {
      await cargarPacientes();
    }
    
  } catch (error) {
    console.error('Error al guardar paciente:', error);
    mostrarNotificacion('Error al guardar el paciente: ' + error.message, 'error');
  } finally {
    // Restaurar el botón
    const submitBtn = document.querySelector('#formPaciente .btn-submit');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = modoEdicionPaciente ? 'Actualizar Paciente' : 'Registrar Paciente';
    }
  }
}

// Configurar el formulario para editar un paciente existente
function editarPaciente(paciente) {
  modoEdicionPaciente = true;
  pacienteEditando = paciente;
  
  // Navegar a la página de registro/edición
  showPage('registroPacientes');
  
  // Cambiar el texto del botón
  const submitBtn = document.querySelector('#formPaciente .btn-submit');
  if (submitBtn) {
    submitBtn.innerHTML = 'Actualizar Paciente';
  }
  
  // Rellenar el formulario con los datos del paciente
  const formulario = document.querySelector('#formPaciente');
  if (!formulario) return;
  
  // Información básica
  setFormValue(formulario, 'nombre', paciente.Nombre);
  setFormValue(formulario, 'apellido_paterno', paciente.Apellido_Paterno);
  setFormValue(formulario, 'apellido_materno', paciente.Apellido_Materno);
  setFormValue(formulario, 'curp', paciente.CURP);
  
  // Fecha de nacimiento
  if (paciente.Fecha_Nacimiento) {
    const fechaNacimiento = new Date(paciente.Fecha_Nacimiento);
    const formattedDate = fechaNacimiento.toISOString().split('T')[0];
    setFormValue(formulario, 'fecha_nacimiento', formattedDate);
    
    // Actualizar Flatpickr si está inicializado
    if (window.flatpickr) {
      const datePicker = document.getElementById('fechaNacimiento')._flatpickr;
      if (datePicker) {
        datePicker.setDate(formattedDate);
      }
    }
  }
  
  // Dirección
  setFormValue(formulario, 'calle', paciente.Calle);
  setFormValue(formulario, 'num_calle', paciente.Num_Calle);
  setFormValue(formulario, 'codigo_postal', paciente.Codigo_Postal);
  
  // Contacto
  setFormValue(formulario, 'correo', paciente.Correo_Electronico);
  setFormValue(formulario, 'telefono', paciente.Telefono);
  
  // Datos médicos
  setFormValue(formulario, 'altura', paciente.Altura);
  setFormValue(formulario, 'peso', paciente.Peso);
  setFormValue(formulario, 'tipo_sangre', paciente.ID_Tipo);
  setFormValue(formulario, 'genero', paciente.ID_Genero);
  
  // Alergias, operaciones y padecimientos (simplificado para la demo)
  // Esta parte podría requerir una lógica más compleja según la implementación
  configurarSeleccion('alergiaSelect', paciente.ID_Alergias, obtenerNombreCatalogo(paciente.ID_Alergias, 'alergias'));
  configurarSeleccion('operacionSelect', paciente.ID_Operaciones, obtenerNombreCatalogo(paciente.ID_Operaciones, 'operaciones'));
  configurarSeleccion('padecimientoSelect', paciente.ID_Padecimientos, obtenerNombreCatalogo(paciente.ID_Padecimientos, 'padecimientos'));
}

// Establece un valor en un campo del formulario
function setFormValue(form, fieldName, value) {
  const field = form.elements[fieldName];
  if (field && value !== null && value !== undefined) {
    field.value = value;
  }
}

// Configura un selector dinámico con un valor específico
function configurarSeleccion(className, id, nombreSeleccion) {
  if (!id || !nombreSeleccion) return;
  
  const selector = document.querySelector(`.${className}`);
  if (!selector) return;
  
  // Intentar seleccionar por el nombre de la selección
  for (let option of selector.options) {
    if (option.value.toLowerCase() === nombreSeleccion.toLowerCase()) {
      option.selected = true;
      return;
    }
  }
  
  // Si no se encuentra, seleccionar "otro"
  for (let option of selector.options) {
    if (option.value === 'otro') {
      option.selected = true;
      
      // Crear input para el valor personalizado
      const wrapper = selector.closest('.alergia-select-wrapper');
      if (wrapper) {
        const container = wrapper.querySelector('.select-container');
        if (container) container.style.flex = "0 0 250px";
        
        const nombreCapitalizado = className.replace('Select', '');
        const input = document.createElement('input');
        input.type = 'text';
        input.name = `otra${nombreCapitalizado}[]`;
        input.value = nombreSeleccion;
        input.placeholder = `Especifique otra ${nombreCapitalizado.toLowerCase()}`;
        input.className = `otroAlergiaInput otro${nombreCapitalizado}Input`;
        wrapper.appendChild(input);
      }
      return;
    }
  }
}

// Funciones auxiliares para mapear IDs a valores del catálogo y viceversa
function obtenerIdCatalogo(valor, tipoCatalogo) {
  if (!valor || valor === 'ninguna') return null;
  
  // Esta es una implementación simplificada.
  // En una aplicación real, probablemente querrías:
  // 1. Cargar estos catálogos desde la API al iniciar
  // 2. Almacenarlos en variables globales
  // 3. Usarlos para hacer mapeos exactos
  
  // Alergias
  if (tipoCatalogo === 'alergias') {
    switch (valor.toLowerCase()) {
      case 'penicilina': return 1;
      case 'polen': return 2;
      case 'mariscos': return 3;
      case 'otro': return 99;
      default: return 99; // Valor para "otro"
    }
  }
  
  // Operaciones
  if (tipoCatalogo === 'operaciones') {
    switch (valor.toLowerCase()) {
      case 'cesarea': return 1;
      case 'apendicectomia': return 2;
      case 'bypass': return 3;
      case 'otro': return 99;
      default: return 99; // Valor para "otro"
    }
  }
  
  // Padecimientos
  if (tipoCatalogo === 'padecimientos') {
    switch (valor.toLowerCase()) {
      case 'diabetes': return 1;
      case 'hipertension': return 2;
      case 'asma': return 3;
      case 'otro': return 99;
      default: return 99; // Valor para "otro"
    }
  }
  
  return null;
}

function obtenerNombreCatalogo(id, tipoCatalogo) {
  if (!id) return 'ninguna';
  
  // Alergias
  if (tipoCatalogo === 'alergias') {
    switch (id) {
      case 1: return 'penicilina';
      case 2: return 'polen';
      case 3: return 'mariscos';
      case 99: return 'otro';
      default: return 'otro';
    }
  }
  
  // Operaciones
  if (tipoCatalogo === 'operaciones') {
    switch (id) {
      case 1: return 'cesarea';
      case 2: return 'apendicectomia';
      case 3: return 'bypass';
      case 99: return 'otro';
      default: return 'otro';
    }
  }
  
  // Padecimientos
  if (tipoCatalogo === 'padecimientos') {
    switch (id) {
      case 1: return 'diabetes';
      case 2: return 'hipertension';
      case 3: return 'asma';
      case 99: return 'otro';
      default: return 'otro';
    }
  }
  
  return 'ninguna';
}

function mostrarNotificacion(mensaje, tipo = "info") {
  // No llamar recursivamente a la función global si tiene el mismo nombre
  const notificacionGlobal = window.mostrarNotificacion;
  if (typeof notificacionGlobal === 'function' && notificacionGlobal !== mostrarNotificacion) {
    notificacionGlobal(mensaje, tipo);
  } else {
    alert(mensaje);
  }
}

function handleDynamicSelect(containerId, className, nameAttr, icon, options) {
  const container = document.getElementById(containerId);
  
  if (!container) {
    console.warn(`Container with ID "${containerId}" not found. Skipping event listener setup.`);
    return;
  }

  container.addEventListener('change', function (e) {
    if (!e.target.classList.contains(className)) return;

    const selectedValue = e.target.value;
    const wrapper = e.target.closest('.alergia-select-wrapper');
    const isLast = e.target === container.querySelectorAll(`.${className}`)[container.querySelectorAll(`.${className}`).length - 1];
    const selectContainer = wrapper.querySelector('.select-container');    if (selectedValue === 'otro' && !wrapper.querySelector(`.otro${nameAttr}Input`)) {
      const inputGroup = document.createElement('div'); 
      inputGroup.className = 'input-group';
      
      const input = document.createElement('input');
      input.type = 'text';
      input.name = `otra${nameAttr}[]`;
      input.placeholder = `Especifique otra ${nameAttr.toLowerCase()}`;
      input.className = `otroAlergiaInput otro${nameAttr}Input`;
      
      inputGroup.appendChild(input);
      wrapper.appendChild(inputGroup);
      if (selectContainer) selectContainer.style.flex = "0 0 250px";
    }

    if (selectedValue !== 'otro') {
      const input = wrapper.querySelector(`.otro${nameAttr}Input`);
      if (input) input.remove();
      if (selectContainer) selectContainer.style.flex = "1";
    }    if (selectedValue !== 'ninguna' && isLast) {
      const newWrapper = document.createElement('div');
      newWrapper.className = 'row alergia-select-wrapper';
      newWrapper.innerHTML = `
        <div class="input-group">
          <div class="input-icon select-container">
            <iconify-icon icon="${icon}"></iconify-icon>
            <select name="${nameAttr.toLowerCase()}[]" class="${className}">
              ${options}
            </select>
          </div>
        </div>
      `;
      container.appendChild(newWrapper);
    }

    const allSelects = container.querySelectorAll(`.${className}`);
    if (selectedValue === 'ninguna' && allSelects.length > 1 && e.target !== allSelects[0]) {
      wrapper.remove();
    }
  });
}

// Configurar selectores dinámicos
handleDynamicSelect(
  'alergiasContainer',
  'alergiaSelect',
  'Alergia',
  'mdi:alert-decagram-outline',
  `
    <option value="ninguna">Ninguna</option>
    <option value="penicilina">Penicilina</option>
    <option value="polen">Polen</option>
    <option value="mariscos">Mariscos</option>
    <option value="otro">Otro</option>
  `
);

handleDynamicSelect(
  'operacionesContainer',
  'operacionSelect',
  'Operacion',
  'mdi:stethoscope',
  `
    <option value="ninguna">Ninguna</option>
    <option value="cesarea">Cesárea</option>
    <option value="apendicectomia">Apendicectomía</option>
    <option value="bypass">Bypass gástrico</option>
    <option value="otro">Otro</option>
  `
);

handleDynamicSelect(
  'padecimientosContainer',
  'padecimientoSelect',
  'Padecimiento',
  'mdi:heart-pulse',
  `
    <option value="ninguna">Ninguna</option>
    <option value="diabetes">Diabetes</option>
    <option value="hipertension">Hipertensión</option>
    <option value="asma">Asma</option>
    <option value="otro">Otro</option>
  `
);

// Exportar la función de editar para que pueda ser usada desde scriptPacientes.js
window.editarPaciente = editarPaciente;
