// calculadora.js
document.addEventListener('DOMContentLoaded', () => {
  // Configuración inicial
  initCalculatorTabs();
  setupCalculateButton();
});

// Manejo de pestañas
function initCalculatorTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remover activo de todos
      tabBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      // Activar el seleccionado
      btn.classList.add('active');
      const tabId = btn.getAttribute('data-tab') + '-tab';
      document.getElementById(tabId).classList.add('active');
    });
  });
}

// Lógica de cálculo
function setupCalculateButton() {
  const calculateBtn = document.getElementById('calculate-btn');
  
  calculateBtn.addEventListener('click', () => {
    // Obtener valores
    const transportData = getTransportData();
    const energyData = getEnergyData();
    const foodData = getFoodData();
    
    // Calcular total CO₂ (kg anuales)
    const totalCO2 = (
      transportData.total + 
      energyData.total + 
      foodData.total
    ).toFixed(1);
    
    // Mostrar resultados
    showResults(totalCO2, { transportData, energyData, foodData });
  });
}

function getTransportData() {
  const carKm = parseFloat(document.getElementById('car-km').value) || 0;
  const publicTransportDays = parseFloat(document.getElementById('public-transport').value) || 0;
  
  // Cálculos (valores aproximados)
  const carCO2 = carKm * 0.12 * 12; // 0.12kg CO₂ por km
  const publicTransportCO2 = publicTransportDays * 4 * 0.04 * 52; // 0.04kg CO₂ por km (bus)
  
  return {
    car: carCO2,
    publicTransport: publicTransportCO2,
    total: carCO2 - publicTransportCO2 // El transporte público reduce
  };
}

function getEnergyData() {
  const electricity = parseFloat(document.getElementById('electricity').value) || 0;
  const renewableEnergy = document.getElementById('renewable-energy').checked;
  
  // 0.4kg CO₂ por kWh (promedio global)
  let energyCO2 = electricity * 0.4 * 12;
  
  if (renewableEnergy) {
    energyCO2 *= 0.2; // Reduce 80% si es energía renovable
  }
  
  return {
    electricity: energyCO2,
    total: energyCO2
  };
}

function getFoodData() {
  const mealsMeat = parseFloat(document.getElementById('meals-meat').value) || 0;
  const mealsVeg = parseFloat(document.getElementById('meals-veg').value) || 0;
  
  // Valores aproximados por comida
  const meatCO2 = mealsMeat * 3.6 * 52; // 3.6kg CO₂ por comida con carne
  const vegCO2 = mealsVeg * 0.9 * 52; // 0.9kg CO₂ por comida vegetal
  
  return {
    meat: meatCO2,
    veg: vegCO2,
    total: meatCO2 + vegCO2
  };
}

function showResults(totalCO2, breakdown) {
  // Mostrar contenedores
  document.querySelector('.results-container').classList.remove('hidden');
  document.getElementById('breakdown-card').classList.remove('hidden');
  
  // Actualizar total
  document.getElementById('co2-total').textContent = totalCO2;
  document.getElementById('user-comparison-text').textContent = `${totalCO2} kg`;
  
  // Barra de comparación (8,000 kg es promedio anual por persona)
  const percentage = Math.min((totalCO2 / 8000) * 100, 100);
  document.getElementById('user-comparison-bar').style.width = `${percentage}%`;
  
  // Consejo personalizado
  const savingsTip = document.getElementById('savings-tip');
  if (totalCO2 < 4000) {
    savingsTip.textContent = "¡Excelente! Estás muy por debajo del promedio. Sigue así.";
    savingsTip.style.color = "var(--secondary-color)";
  } else {
    savingsTip.textContent = `Podrías ahorrar ${(totalCO2 - 4000).toFixed(1)} kg CO₂ al año con pequeños cambios.`;
    savingsTip.style.color = "var(--accent-color)";
  }
  
  // Generar gráfico
  renderCO2Chart(breakdown);
  
  // Generar tips
  generateActionTips(breakdown);
}

function renderCO2Chart(breakdown) {
  const ctx = document.getElementById('co2-chart').getContext('2d');
  
  // Destruir gráfico anterior si existe
  if (window.co2Chart) {
    window.co2Chart.destroy();
  }
  
  window.co2Chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Transporte', 'Energía', 'Alimentación'],
      datasets: [{
        data: [
          breakdown.transportData.total,
          breakdown.energyData.total,
          breakdown.foodData.total
        ],
        backgroundColor: [
          '#4CAF50', // Verde
          '#FFC107', // Amarillo
          '#FF5722'  // Naranja
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.raw} kg CO₂`;
            }
          }
        }
      },
      cutout: '65%'
    }
  });
}

function generateActionTips(breakdown) {
  const tipsList = document.getElementById('action-tips-list');
  tipsList.innerHTML = '';
  
  // Tips basados en los resultados
  const tips = [];
  
  if (breakdown.transportData.car > 2000) {
    tips.push("Reduce un 20% tus viajes en auto usando transporte público 2 días más por semana.");
  }
  
  if (breakdown.energyData.electricity > 1500 && !document.getElementById('renewable-energy').checked) {
    tips.push("Considera instalar paneles solares o cambiar a un proveedor de energía renovable.");
  }
  
  if (breakdown.foodData.meat > breakdown.foodData.veg) {
    tips.push("Prueba tener 2 días sin carne cada semana. ¡Cada comida vegetal ayuda!");
  }
  
  if (tips.length === 0) {
    tips.push("¡Buen trabajo! Sigue manteniendo tus hábitos sostenibles.");
  }
  
  // Renderizar tips
  tips.forEach(tip => {
    const li = document.createElement('li');
    li.textContent = tip;
    tipsList.appendChild(li);
  });
}