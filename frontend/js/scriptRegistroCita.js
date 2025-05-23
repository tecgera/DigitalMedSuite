// Inicializar el selector de fecha con flatpickr
flatpickr("#fechaHoraCita", {
  enableTime: true,
  dateFormat: "Y-m-d H:i",
  time_24hr: false, // cambia a true si deseas formato 24h
  locale: "es",
  monthSelectorType: "static",
  minDate: "today" // 🚫 bloquea días anteriores a hoy
});

// Función para poder cargar los datos manualmente desde la consola del navegador
window.cargarDatosManualmente = function() {
  console.log("Cargando datos manualmente desde la consola");
  cargarDoctores();
  cargarConsultorios();
  cargarEstatusCitas();
};

// Función para cargar estados de cita
async function cargarEstatusCitas() {
  try {
    console.log("Cargando estados de cita...");
    const estatusCitas = await window.apiService.catalogos.getEstatusCitas();
    console.log("Respuesta de estados de cita:", JSON.stringify(estatusCitas, null, 2));
    
    const selectEstado = document.getElementById('estadoCita');
    if (!selectEstado) {
      console.error("No se encontró el elemento select con id 'estadoCita'");
      return;
    }
    
    // Limpiar opciones existentes excepto la primera
    while (selectEstado.options.length > 1) {
      selectEstado.remove(1);
    }
    
    // Añadir los estados obtenidos de la base de datos
    if (!Array.isArray(estatusCitas)) {
      console.error("La respuesta de estados no es un array:", estatusCitas);
      return;
    }
      estatusCitas.forEach((estatus) => {
      console.log("Estado de cita:", estatus);
      const option = document.createElement('option');
      // Intentar detectar y utilizar los nombres de propiedades correctos
      const id = estatus.ID_Estatus || estatus.id_Estatus || estatus.Id_Estatus || estatus.id;
      const nombre = estatus.Nombre_Estatus || estatus.nombre_Estatus || estatus.nombre || estatus.Nombre;
      
      if (id === undefined || nombre === undefined) {
        console.error("Error: No se pueden detectar las propiedades correctas para el estado de cita", estatus);
        return;
      }
      
      option.value = id;
      option.textContent = nombre;
      selectEstado.appendChild(option);
    });
      } catch (error) {
    console.error('Error al cargar los estados de cita:', error);
    console.error('Stack trace:', error.stack);
    
    // Si hay error, utilizamos los valores predeterminados del HTML
    console.log("Utilizando estados de cita predeterminados");
    
    // Log adicional para diagnóstico
    if (window.apiService && window.apiService.catalogos) {
      console.log("API Service catalogos está disponible");
    } else {
      console.error("API Service catalogos NO está disponible - verificar inicialización");
    }
  }
}

// Función para cargar doctores desde la base de datos
async function cargarDoctores() {
  try {
    console.log("Iniciando carga de doctores...");
    const doctores = await window.apiService.medicos.getAll();
    console.log("Respuesta completa de API doctores:", JSON.stringify(doctores, null, 2));
    
    const selectDoctor = document.getElementById('NombreDoctor');
    if (!selectDoctor) {
      console.error("No se encontró el elemento select con id 'NombreDoctor'");
      return;
    }
    
    // Limpiar opciones existentes excepto la primera
    while (selectDoctor.options.length > 1) {
      selectDoctor.remove(1);
    }
    
    // Añadir los doctores obtenidos de la base de datos
    if (!Array.isArray(doctores)) {
      console.error("La respuesta de doctores no es un array:", doctores);
      return;
    }
    
    if (doctores.length === 0) {
      console.warn("No se encontraron doctores en la base de datos");
      const option = document.createElement('option');
      option.value = "";
      option.textContent = "No hay doctores disponibles";
      selectDoctor.appendChild(option);
      return;
    }
    
    doctores.forEach((doctor, index) => {
      console.log(`Doctor ${index + 1}:`, JSON.stringify(doctor, null, 2));
      
      const option = document.createElement('option');
      
      // Intentar acceder a todas las posibles propiedades para identificar los nombres de campo correctos
      console.log("ID:", doctor.id, doctor.ID_Medico, doctor.id_Medico);
      console.log("Nombre:", doctor.nombre, doctor.Nombre);
      console.log("Apellido:", doctor.apellido_Paterno, doctor.Apellido_Paterno);
      
      // Determinar qué propiedades usar
      const id = doctor.id_Medico || doctor.ID_Medico || doctor.id || index;
      const nombre = doctor.nombre || doctor.Nombre || "Sin nombre";
      const apellidoP = doctor.apellido_Paterno || doctor.Apellido_Paterno || "";
      const apellidoM = doctor.apellido_Materno || doctor.Apellido_Materno || "";
      
      option.value = id;
      const nombreCompleto = `Dr(a). ${nombre} ${apellidoP}${apellidoM ? ' ' + apellidoM : ''}`;
      option.textContent = nombreCompleto;
      
      console.log("Opción creada:", option.value, option.textContent);
      selectDoctor.appendChild(option);
    });

  } catch (error) {
    console.error('Error al cargar los doctores:', error);
    console.error('Stack trace:', error.stack);
  }
}

// Función para cargar consultorios desde la base de datos
async function cargarConsultorios() {
  try {
    console.log("Iniciando carga de consultorios...");
    const consultorios = await window.apiService.consultorios.getAll();
    console.log("Respuesta completa de API consultorios:", JSON.stringify(consultorios, null, 2));
    
    const selectConsultorio = document.getElementById('consultorio');
    if (!selectConsultorio) {
      console.error("No se encontró el elemento select con id 'consultorio'");
      return;
    }
    
    // Limpiar opciones existentes excepto la primera
    while (selectConsultorio.options.length > 1) {
      selectConsultorio.remove(1);
    }
    
    // Añadir los consultorios obtenidos de la base de datos
    if (!Array.isArray(consultorios)) {
      console.error("La respuesta de consultorios no es un array:", consultorios);
      return;
    }
    
    if (consultorios.length === 0) {
      console.warn("No se encontraron consultorios en la base de datos");
      const option = document.createElement('option');
      option.value = "";
      option.textContent = "No hay consultorios disponibles";
      selectConsultorio.appendChild(option);
      return;
    }
    
    consultorios.forEach((consultorio, index) => {
      console.log(`Consultorio ${index + 1}:`, JSON.stringify(consultorio, null, 2));
      
      const option = document.createElement('option');
      
      // Intentar acceder a todas las posibles propiedades para identificar los nombres de campo correctos
      console.log("ID:", consultorio.id, consultorio.ID_Consultorio, consultorio.id_Consultorio);
      console.log("Nombre:", consultorio.nombre_Consultorio, consultorio.Nombre_Consultorio);
      
      // Determinar qué propiedades usar
      const id = consultorio.id_Consultorio || consultorio.ID_Consultorio || consultorio.id || index;
      const nombre = consultorio.nombre_Consultorio || consultorio.Nombre_Consultorio || `Consultorio ${id}`;
      
      option.value = id;
      option.textContent = nombre;
      
      console.log("Opción creada:", option.value, option.textContent);
      selectConsultorio.appendChild(option);
    });
    
  } catch (error) {
    console.error('Error al cargar los consultorios:', error);
    console.error('Stack trace:', error.stack);
  }
}

// Función para configurar el formulario de citas
function configurarFormularioCita() {
  const formCita = document.querySelector('#registroCita form');
  if (!formCita) {
    console.error("No se encontró el formulario de registro de citas");
    return;
  }

  formCita.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    // Obtener los valores del formulario
    const numeroPaciente = document.getElementById('numeroPaciente').value.trim();
    const idDoctor = document.getElementById('NombreDoctor').value;
    const idConsultorio = document.getElementById('consultorio').value;
    const fechaHora = document.getElementById('fechaHoraCita').value;
    const idEstatus = document.getElementById('estadoCita').value;
    
    // Validar los datos
    if (!numeroPaciente || !idDoctor || !idConsultorio || !fechaHora || !idEstatus) {
      alert('Por favor, complete todos los campos del formulario');
      return;
    }
    
    try {
      // Validar que el ID del paciente exista
      const pacienteValido = await validarPaciente(numeroPaciente);
      if (!pacienteValido) {
        alert('El número de paciente no es válido');
        return;
      }
      
      // Procesar la fecha y hora
      const fechaHoraObj = new Date(fechaHora);
      const fechaFormateada = fechaHoraObj.toISOString().split('T')[0];
      
      // Formatear la hora como string en formato "HH:MM:SS"
      const horas = fechaHoraObj.getHours().toString().padStart(2, '0');
      const minutos = fechaHoraObj.getMinutes().toString().padStart(2, '0');
      const horaFormateada = `${horas}:${minutos}:00`;
      
      // Crear el objeto de datos para la API
      const citaData = {
        id_Paciente: parseInt(numeroPaciente),
        id_Medico: parseInt(idDoctor),
        fecha_Cita: fechaFormateada,
        hora_Cita: horaFormateada, 
        id_Consultorio: parseInt(idConsultorio),
        id_Estatus: parseInt(idEstatus)
      };
      
      console.log("Enviando datos de cita:", citaData);
      
      // Enviar los datos a la API
      const respuesta = await window.apiService.citas.create(citaData);
      
      console.log("Respuesta del servidor:", respuesta);
      
      // Registrar en bitácora
      if (window.BitacoraService) {
        // Obtener los nombres para un mensaje más descriptivo
        let nombrePaciente = "";
        let nombreMedico = "";
        
        try {
          // Intentar obtener nombres para el mensaje de bitácora
          const pacienteInfo = await window.apiService.pacientes.getById(citaData.id_Paciente);
          if (pacienteInfo) {
            nombrePaciente = `${pacienteInfo.Nombre} ${pacienteInfo.Apellido_Paterno}`;
          }
          
          const medicoInfo = await window.apiService.medicos.getById(citaData.id_Medico);
          if (medicoInfo) {
            nombreMedico = `${medicoInfo.Nombre} ${medicoInfo.Apellido_Paterno}`;
          }
        } catch (error) {
          console.error("Error al obtener información para bitácora:", error);
        }
        
        // Registrar el evento en la bitácora
        window.BitacoraService.registrarAccion(
          window.BitacoraService.ACCION.CREAR,
          window.BitacoraService.ENTIDAD.CITA,
          `Se registró nueva cita para ${nombrePaciente || `paciente #${citaData.id_Paciente}`} con ${nombreMedico || `médico #${citaData.id_Medico}`} para el día ${citaData.fecha_Cita} a las ${citaData.hora_Cita}`,
          respuesta.ID_Cita || respuesta.id_Cita
        );
      }
      
      // Mostrar mensaje de éxito
      alert('Cita registrada con éxito');
      
      // Limpiar formulario
      formCita.reset();
      
      // Regresar a la página de citas y asegurar que la vista se actualice
      window.showPage('citas');
      
      // Recargar los datos de citas para que la nueva cita aparezca
      if (window.cargarCitasDesdeAPI) {
        // Si la función está disponible directamente, usarla
        await window.cargarCitasDesdeAPI();
        if (window.cargarCitas) window.cargarCitas('todos');
      } else {
        // Esperar un poco y luego intentar obtener la función desde cualquier instancia IIFE
        setTimeout(async () => {
          try {
            // Buscar la función en el contexto global
            const cargarCitasFn = window.cargarCitasDesdeAPI;
            if (cargarCitasFn && typeof cargarCitasFn === 'function') {
              await cargarCitasFn();
              // También intentar recargar la vista
              if (window.cargarCitas && typeof window.cargarCitas === 'function') {
                window.cargarCitas('todos');
              }
            } else {
              // Si no podemos encontrar la función, intentar forzar la actualización de la vista
              console.log("Recargando datos manualmente después de agregar cita");
              const citasElements = document.querySelectorAll('.tab-btn[data-tab="citasTab"]');
              if (citasElements.length > 0) {
                citasElements[0].click();
              }
            }
          } catch (e) {
            console.error("Error al actualizar la vista después de crear la cita:", e);
          }
        }, 100);
      }
      
    } catch (error) {
      console.error('Error al registrar la cita:', error);
      alert('Error al registrar la cita: ' + (error.message || 'Revise los datos ingresados'));
    }
  });
}

// Función para validar que el paciente exista
async function validarPaciente(idPaciente) {
  try {
    if (!idPaciente || isNaN(parseInt(idPaciente))) {
      return false;
    }
    
    // Intentar obtener el paciente por ID
    const paciente = await window.apiService.pacientes.getById(idPaciente);
    return !!paciente; // Devuelve true si el paciente existe, false si no
  } catch (error) {
    console.error('Error al validar paciente:', error);
    return false;
  }
}

// Cargar los datos cuando la página de registro de citas se muestre
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM completamente cargado - inicializando script de registro de citas");
  
  // Configurar envío del formulario
  configurarFormularioCita();
  
  // Verificar si ya existe una función que maneje la visualización de páginas
  const originaShowPage = window.showPage;
  console.log("¿Existe función showPage original?", !!originaShowPage);
  
  // Verificar URL de la API
  console.log("URL base de la API:", window.apiService ? window.apiService.baseUrl : "apiService no disponible");
  
  if (originaShowPage) {
    // Sobrescribir la función showPage para cargar los datos cuando se muestre la página de registro de citas
    window.showPage = function(pageId) {
      console.log("Cambiando a página:", pageId);
      originaShowPage(pageId);
      
      if (pageId === 'registroCita') {
        console.log("Activando carga de datos para registro de citas");
        setTimeout(() => {
          try {
            cargarDoctores();
            cargarConsultorios();
            cargarEstatusCitas();
          } catch (e) {
            console.error("Error al cargar datos iniciales:", e);
          }
        }, 500); // Pequeño retraso para asegurar que la página esté completamente visible
      }
    };
  }
  
  // También cargar los datos al inicio si la página actual es la de registro de citas
  const registroCitaSection = document.getElementById('registroCita');
  console.log("Sección de registro de citas encontrada:", !!registroCitaSection);
  
  if (registroCitaSection) {
    const esVisible = window.getComputedStyle(registroCitaSection).display !== 'none';
    console.log("¿La sección de registro de citas es visible?", esVisible);
    
    if (esVisible) {
      console.log("Cargando datos iniciales de doctores, consultorios y estados");
      // Pequeño retraso para asegurar que todo esté cargado
      setTimeout(() => {
        try {
          cargarDoctores();
          cargarConsultorios();
          cargarEstatusCitas();
        } catch (e) {
          console.error("Error al cargar datos iniciales:", e);
        }
      }, 1000);
    }
  }
  
  // Verificar existencia de los elementos select
  console.log("Elementos del formulario existentes:");
  console.log("- Select doctores:", !!document.getElementById('NombreDoctor'));
  console.log("- Select consultorios:", !!document.getElementById('consultorio'));
  console.log("- Input fecha:", !!document.getElementById('fechaHoraCita'));
  console.log("- Select estado:", !!document.getElementById('estadoCita'));
});