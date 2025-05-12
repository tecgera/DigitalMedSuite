// Hacer una solicitud GET a la API del backend
fetch('http://localhost:8080/weatherforecast')  // Asegúrate de que esta URL coincida con la de tu backend
  .then(response => response.json())  // Convertir la respuesta a JSON
  .then(data => {
    console.log(data);  // Mostrar los datos en la consola (solo para depuración)

    // Obtener el contenedor en el HTML donde mostrar los datos
    const weatherContainer = document.getElementById('weather-container');
    
    // Iterar sobre los datos y mostrar cada uno en el contenedor
    data.forEach(item => {
      const weatherElement = document.createElement('div');
      weatherElement.innerHTML = `
        <p>Date: ${item.date}</p>
        <p>Temperature: ${item.temperatureC}°C (${item.temperatureF}°F)</p>
        <p>Summary: ${item.summary}</p>
      `;
      weatherContainer.appendChild(weatherElement);  // Agregar al contenedor
    });
  })
  .catch(error => {
    console.error('Error:', error);  // Capturar y mostrar errores en caso de que ocurran
  });
