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
    const selectContainer = wrapper.querySelector('.select-container');

    if (selectedValue === 'otro' && !wrapper.querySelector(`.otro${nameAttr}Input`)) {
      const input = document.createElement('input');
      input.type = 'text';
      input.name = `otra${nameAttr}`;
      input.placeholder = `Especifique otra ${nameAttr.toLowerCase()}`;
      input.className = `otroAlergiaInput otro${nameAttr}Input`;
      wrapper.appendChild(input);
      if (selectContainer) selectContainer.style.flex = "0 0 250px";
    }

    if (selectedValue !== 'otro') {
      const input = wrapper.querySelector(`.otro${nameAttr}Input`);
      if (input) input.remove();
      if (selectContainer) selectContainer.style.flex = "1";
    }
  });
}

// Esperar a que el DOM esté cargado antes de intentar configurar los selectores dinámicos
document.addEventListener('DOMContentLoaded', function() {
  const formDoctor = document.getElementById('formDoctor');
  if (!formDoctor) {
    console.error('No se encontró el formulario de registro de doctor');
    return;
  }

  // Configurar el selector de especialidad dinámico
  handleDynamicSelect(
    'especialidadContainer',
    'especialidadSelect',
    'Especialidad',
    'mdi:stethoscope',
    `      <option value="ninguna">Ninguna</option>
      <option value="medicina_general">Medicina General</option>
      <option value="cardiologia">Cardiología</option>
      <option value="pediatria">Pediatría</option>
      <option value="dermatologia">Dermatología</option>
      <option value="otro">Otro</option>
    `
  );

  formDoctor.addEventListener('submit', async function(e) {
    e.preventDefault();

    try {
      // Obtener los valores del formulario
      const formData = {
        Nombre: formDoctor.elements.nombre.value.trim(),
        Apellido_Paterno: formDoctor.elements.apellidoP.value.trim(),
        Apellido_Materno: formDoctor.elements.apellidoM.value.trim(),
        Telefono: formDoctor.elements.telefono.value.trim(),
        Correo: formDoctor.elements.correo.value.trim(),
        ID_Especialidad: obtenerIdEspecialidad(formDoctor.elements.especialidad.value),
        ID_Estatus: 1 // 1 = Activo por defecto
      };

      // Validar campos requeridos
      if (!formData.Nombre) {
        mostrarNotificacion('Por favor ingrese el nombre del médico', 'error');
        return;
      }
      if (!formData.Apellido_Paterno) {
        mostrarNotificacion('Por favor ingrese el apellido paterno', 'error');
        return;
      }
      if (!formData.Correo) {
        mostrarNotificacion('Por favor ingrese el correo electrónico', 'error');
        return;
      }
      if (!validarCorreo(formData.Correo)) {
        mostrarNotificacion('Por favor ingrese un correo electrónico válido', 'error');
        return;
      }
      if (formData.Correo.length > 35) {
        mostrarNotificacion('El correo electrónico no puede exceder los 35 caracteres', 'error');
        return;
      }
      if (!formData.Telefono) {
        mostrarNotificacion('Por favor ingrese el teléfono', 'error');
        return;
      }
      if (!validarTelefono(formData.Telefono)) {
        mostrarNotificacion('El teléfono debe contener exactamente 10 dígitos numéricos', 'error');
        return;
      }
      if (!validarSoloLetras(formData.Nombre) || !validarSoloLetras(formData.Apellido_Paterno) || 
          (formData.Apellido_Materno && !validarSoloLetras(formData.Apellido_Materno))) {
        mostrarNotificacion('Los nombres y apellidos solo pueden contener letras', 'error');
        return;
      }

      // Deshabilitar el botón de submit y mostrar indicador de carga
      const submitBtn = formDoctor.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<iconify-icon icon="mdi:loading" class="spin"></iconify-icon> Registrando...';

      // Llamar a la API para registrar el médico
      const response = await window.apiService.medicos.create(formData);      if (response) {
        mostrarNotificacion('Médico registrado correctamente', 'success');
        formDoctor.reset();
        
        // Redireccionar a la página del hospital y activar la pestaña de médicos
        document.querySelectorAll('.nav-link').forEach(link => {
          if (link.getAttribute('data-page') === 'hospital') {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        // Mostrar la página del hospital y actualizar la lista de médicos
        showPage('hospital');
        if (typeof window.cargarMedicosAPI === 'function') {
          await window.cargarMedicosAPI();
        }
      }
    } catch (error) {
      console.error('Error al registrar médico:', error);
      mostrarNotificacion(error.message || 'Error al registrar médico', 'error');
    } finally {
      // Restaurar el botón a su estado original
      const submitBtn = formDoctor.querySelector('button[type="submit"]');
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Registrar Doctor';
    }
  });
});

function obtenerIdEspecialidad(especialidad) {
  // Mapeo de especialidades a IDs
  const especialidades = {
    'ninguna': 1,
    'medicina_general': 2,
    'cardiologia': 3,
    'pediatria': 4,
    'dermatologia': 5,
    'otro': 6
  };
  return especialidades[especialidad] || 1;
}

// Validaciones adicionales

function validarSoloLetras(texto) {
  const letrasRegex = /^[A-Za-záéíóúÁÉÍÓÚüÜñÑ\s]+$/;
  return letrasRegex.test(texto);
}

function validarTelefono(telefono) {
  const telefonoRegex = /^[0-9]{10}$/;
  return telefonoRegex.test(telefono);
}

function validarCorreo(correo) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(correo);
}

function mostrarNotificacion(mensaje, tipo = 'info') {
  // No llamar recursivamente a la función global si tiene el mismo nombre
  const notificacionGlobal = window.mostrarNotificacion;
  if (typeof notificacionGlobal === 'function' && notificacionGlobal !== mostrarNotificacion) {
    notificacionGlobal(mensaje, tipo);
  } else {
    // Fallback si la función global no está disponible
    alert(mensaje);
  }
}
