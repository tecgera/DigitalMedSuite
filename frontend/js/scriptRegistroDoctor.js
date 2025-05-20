function handleDynamicSelect(containerId, className, nameAttr, icon, options) {
  const container = document.getElementById(containerId);

  container.addEventListener('change', function (e) {
    if (!e.target.classList.contains(className)) return;

    const selectedValue = e.target.value;
    const wrapper = e.target.closest('.alergia-select-wrapper');
    const isLast = e.target === container.querySelectorAll(`.${className}`)[container.querySelectorAll(`.${className}`).length - 1];
    const selectContainer = wrapper.querySelector('.select-container');

    if (selectedValue === 'otro' && !wrapper.querySelector(`.otro${nameAttr}Input`)) {
      const input = document.createElement('input');
      input.type = 'text';
      input.name = `otra${nameAttr}[]`;
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

    if (selectedValue !== 'ninguna' && isLast) {
      const newWrapper = document.createElement('div');
      newWrapper.className = 'alergia-select-wrapper';
      newWrapper.innerHTML = `
        <div class="input-icon select-container">
          <iconify-icon icon="${icon}"></iconify-icon>
          <select name="${nameAttr.toLowerCase()}[]" class="${className}">
            ${options}
          </select>
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

handleDynamicSelect(
  'especialidadContainer',
  'especialidadSelect',
  'Especialidad',
  'mdi:stethoscope',
  `
    <option value="ninguna">Ninguna</option>
    <option value="medicina_general">Medicina General</option>
    <option value="cardiologia">Cardiología</option>
    <option value="pediatria">Pediatría</option>
    <option value="dermatologia">Dermatología</option>
    <option value="otro">Otro</option>
  `
);
