// Función para obtener datos desde el JSON
async function fetchTravelData() {
    try {
      const response = await fetch('./travel_recommendation_api.json'); // Ruta del archivo JSON
      if (!response.ok) {
        throw new Error('Error al cargar los datos');
      }
      const data = await response.json();
      console.log('Datos cargados:', data); // Verifica los datos en la consola
      return data;
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      return null;
    }
  }
  
  // Función para buscar recomendaciones
  function searchRecommendations(data, keyword) {
    keyword = keyword.toLowerCase(); // Manejar mayúsculas y minúsculas
    let results = [];
  
    // Filtrar lugares por categoría
    if (keyword.includes('playa')) {
      results = data.beaches.slice(0, 2); // Tomar 2 resultados de la categoría de playas
    } else if (keyword.includes('templo')) {
      results = data.temples.slice(0, 2); // Tomar 2 resultados de la categoría de templos
    } else {
      // Filtrar países o ciudades en la categoría de países
      data.countries.forEach(country => {
        if (
          country.name.toLowerCase().includes(keyword) ||
          country.cities.some(city =>
            city.name.toLowerCase().includes(keyword)
          )
        ) {
          results = results.concat(country.cities.slice(0, 2)); // Tomar máximo 2 resultados
        }
      });
    }
  
    return results;
  }
  
  // Función para mostrar los resultados en el DOM
  function displayResults(results) {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = ''; // Limpiar resultados anteriores
  
    if (results.length === 0) {
      resultsContainer.innerHTML = '<p>No se encontraron resultados.</p>';
      return;
    }
  
    results.forEach(result => {
      const resultDiv = document.createElement('div');
      resultDiv.classList.add('result-item');
  
      resultDiv.innerHTML = `
        <img src="${result.imageUrl}" alt="${result.name}" class="result-image" />
        <h3>${result.name}</h3>
        <p>${result.description}</p>
      `;
  
      resultsContainer.appendChild(resultDiv);
    });
  }
  
  // Configuración de eventos en los botones
  document.getElementById('btnSearch').addEventListener('click', async () => {
    const keyword = document.getElementById('conditionInput').value.trim();
    if (!keyword) {
      alert('Por favor, ingrese una palabra clave para buscar.');
      return;
    }
  
    const data = await fetchTravelData();
    if (data) {
      const results = searchRecommendations(data, keyword);
      displayResults(results);
    }
  });
  
  document.getElementById('btnReset').addEventListener('click', () => {
    document.getElementById('conditionInput').value = ''; // Limpiar entrada
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = ''; // Limpiar resultados
  });
  