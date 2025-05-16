 document.addEventListener('DOMContentLoaded', function () {
    const listaBitacora = document.getElementById('listaBitacora');
    if (!listaBitacora) return;

    const eventos = [
      {
        tipo: 'update',
        mensaje: 'Actualización de expediente',
        usuario: 'Juan Pérez',
        tiempo: 'Hace 35 minutos',
        icono: 'mdi:file-document-edit'
      },
      {
        tipo: 'appointment',
        mensaje: 'Cita completada',
        usuario: 'María González',
        tiempo: 'Hace 2 horas',
        icono: 'mdi:calendar-check'
      },
      {
        tipo: 'new',
        mensaje: 'Nuevo paciente registrado',
        usuario: 'Carlos Ramírez',
        tiempo: 'Hoy, 9:15 AM',
        icono: 'mdi:account-plus'
      },
      {
        tipo: 'appointment',
        mensaje: 'Cita completada',
        usuario: 'María González',
        tiempo: 'Hace 2 horas',
        icono: 'mdi:calendar-check'
      },{
        tipo: 'appointment',
        mensaje: 'Cita completada',
        usuario: 'María González',
        tiempo: 'Hace 2 horas',
        icono: 'mdi:calendar-check'
      }
    ];

    // Eliminar empty-state si hay eventos
    const emptyState = listaBitacora.querySelector('.empty-state');
    if (eventos.length > 0 && emptyState) {
      emptyState.remove();
    }

    eventos.forEach(evento => {
      const li = document.createElement('li');
      li.classList.add('activity-item');

      li.innerHTML = `
        <div class="activity-icon ${evento.tipo}">
          <iconify-icon icon="${evento.icono}" width="16"></iconify-icon>
        </div>
        <div class="activity-details">
          <p>${evento.mensaje}: <strong>${evento.usuario}</strong></p>
          <span class="activity-time">${evento.tiempo}</span>
        </div>
      `;

      listaBitacora.appendChild(li);
    });
  });