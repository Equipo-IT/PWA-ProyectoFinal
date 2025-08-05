// Datos COMPLETOS de desafíos
const weeklyChallenges = [
  {
    day: "Lunes",
    title: "Lunes Verde",
    challenge: "Rechaza bolsas de plástico. Usa tu bolsa reutilizable.",
    icon: "fa-shopping-bag",
    tip: "¿Sabías que una bolsa de tela puede reemplazar 600 de plástico al año?",
    completed: false
  },
  {
    day: "Martes",
    title: "Martes en Movimiento",
    challenge: "Transporte sostenible: bici, caminata o transporte público.",
    icon: "fa-bicycle",
    tip: "Caminar 30 minutos diarios reduce 0.5kg de CO2 y mejora tu salud.",
    completed: false
  },
  {
    day: "Miércoles",
    title: "Miércoles Inteligente",
    challenge: "Apaga luces y dispositivos que no uses durante el día.",
    icon: "fa-lightbulb",
    tip: "Un dispositivo en standby puede gastar hasta 10% de energía.",
    completed: false
  },
  {
    day: "Jueves",
    title: "Jueves Ahorrador",
    challenge: "Toma duchas de máximo 5 minutos.",
    icon: "fa-shower",
    tip: "Ahorras ≈100 litros de agua por ducha corta.",
    completed: false
  },
  {
    day: "Viernes",
    title: "Viernes sin Carne",
    challenge: "Come solo comida vegetariana hoy.",
    icon: "fa-leaf",
    tip: "Producir 1kg de carne emite tanto CO2 como conducir 100km.",
    completed: false
  },
  {
    day: "Sábado",
    title: "Sábado de Reciclaje",
    challenge: "Separa y recicla toda tu basura hoy.",
    icon: "fa-recycle",
    tip: "El vidrio reciclado reduce 30% la contaminación vs. nuevo.",
    completed: false
  },
  {
    day: "Domingo",
    title: "Domingo de Conciencia",
    challenge: "Comparte un consejo ecológico en redes.",
    icon: "fa-share-alt",
    tip: "Usa #EcoReto para inspirar a otros.",
    completed: false
  }
];

// Elemento del DOM
const challengesGrid = document.getElementById('challenges-grid');

// Renderizar desafíos
function renderWeeklyChallenges() {
  let todayIndex = new Date().getDay(); // 0 = domingo
  todayIndex = todayIndex === 0 ? 6 : todayIndex - 1; // Ajustar para que lunes sea 0

  challengesGrid.innerHTML = weeklyChallenges.map((challenge, index) => `
    <div class="challenge-day ${index === todayIndex ? 'today' : ''} ${challenge.completed ? 'completed' : ''}">
      <div class="day-header">
        <h3>${challenge.day}</h3>
        ${index === todayIndex ? '<span class="today-badge">HOY</span>' : ''}
      </div>
      <div class="challenge-content">
        <i class="fas ${challenge.icon}"></i>
        <h4>${challenge.title}</h4>
        <p>${challenge.challenge}</p>
        <div class="tip-box">
          <i class="fas fa-lightbulb"></i>
          <span>${challenge.tip}</span>
        </div>
        <button class="complete-btn" data-day="${index}">
          ${challenge.completed ? '<i class="fas fa-undo"></i> Desmarcar' : 'Marcar completado'}
        </button>
      </div>
    </div>
  `).join('');

  // Hacer scroll al día actual
  const todayElement = document.querySelector('.today');
  if (todayElement) {
    setTimeout(() => {
      todayElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }, 300);
  }
}

// Evento para marcar/desmarcar desafíos
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('complete-btn') || e.target.closest('.complete-btn')) {
    const button = e.target.closest('.complete-btn');
    const dayIndex = parseInt(button.dataset.day);

    // Alternar estado
    weeklyChallenges[dayIndex].completed = !weeklyChallenges[dayIndex].completed;

    // Guardar cambios
    localStorage.setItem('weeklyChallenges', JSON.stringify(weeklyChallenges));

    // Volver a renderizar
    renderWeeklyChallenges();
  }
});

// Cargar progreso desde localStorage
function loadProgress() {
  const saved = localStorage.getItem('weeklyChallenges');
  if (saved) {
    const savedChallenges = JSON.parse(saved);
    savedChallenges.forEach((challenge, index) => {
      weeklyChallenges[index].completed = challenge.completed;
    });
  }
}

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  loadProgress();
  renderWeeklyChallenges();
});
