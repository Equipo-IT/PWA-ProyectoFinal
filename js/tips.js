// tips.js - Versión Final con 10 Consejos Profesionales
const tips = [
  {
    title: "Eficiencia Energética en el Hogar",
    description: "Instala termostatos inteligentes para reducir hasta un 15% el consumo de calefacción y aire acondicionado. Cada grado menos en invierno (o más en verano) representa un 7% de ahorro energético.",
    icon: "fa-thermometer-half"
  },
  {
    title: "Movilidad Urbana Sostenible",
    description: "Usar transporte público reduce 2.2 toneladas de CO₂ anuales por persona comparado con automóvil privado. Para distancias cortas, caminar o usar bicicleta elimina completamente las emisiones.",
    icon: "fa-subway"
  },
  {
    title: "Alimentación Consciente",
    description: "Reducir el consumo de carne a 2-3 veces por semana puede disminuir tu huella alimentaria en un 35%. La producción de 1kg de carne de res genera 60kg de CO₂ equivalente.",
    icon: "fa-carrot"
  },
  {
    title: "Gestión Inteligente de Residuos",
    description: "Compostar los residuos orgánicos reduce hasta un 50% la basura doméstica y evita emisiones de metano en vertederos. 1 tonelada de compost evita la liberación de 0.5 toneladas de CO₂.",
    icon: "fa-trash-alt"
  },
  {
    title: "Consumo Responsable de Agua",
    description: "Instalar aireadores en grifos puede reducir el consumo de agua hasta un 50%. Una ducha de 5 minutos ahorra 95 litros comparado con una de 10 minutos.",
    icon: "fa-tint"
  },
  {
    title: "Energías Renovables Domésticas",
    description: "Un sistema solar de 5kW puede generar 7,000 kWh anuales, cubriendo el 100% del consumo eléctrico promedio y evitando 4 toneladas de CO₂ al año.",
    icon: "fa-solar-panel"
  },
  {
    title: "Tecnología Eficiente",
    description: "Los dispositivos con certificación Energy Star consumen un 30-50% menos energía. Apagar completamente los equipos electrónicos puede ahorrar hasta 10% en tu factura eléctrica.",
    icon: "fa-plug"
  },
  {
    title: "Jardinería Sostenible",
    description: "Plantar árboles nativos puede secuestrar hasta 48 libras de CO₂ por año cada uno. Un jardín con plantas autóctonas requiere un 50% menos agua que un césped tradicional.",
    icon: "fa-tree"
  },
  {
    title: "Moda Circular",
    description: "Comprar una prenda usada reduce su impacto ambiental en un 82%. Lavar ropa en agua fría y tender al sol ahorra 4kg de CO₂ por carga.",
    icon: "fa-tshirt"
  },
  {
    title: "Turismo Responsable",
    description: "Un vuelo transatlántico genera 1.6 toneladas de CO₂ por pasajero. Elegir destinos cercanos o compensar emisiones puede reducir tu impacto hasta en un 80%.",
    icon: "fa-plane"
  }
];

let currentTipIndex = 0;
let tipInterval;
let touchStartX = 0;
let touchEndX = 0;

function initTipsSection() {
  const tipsContainer = document.querySelector('.tips-container');
  if (!tipsContainer) return;
  
  tipsContainer.innerHTML = `
    ${tips.map((tip, index) => `
      <div class="tip-card ${index === 0 ? 'active' : ''}" data-index="${index}">
        <div class="tip-header">
          <div class="tip-icon-container">
            <i class="fas ${tip.icon}"></i>
          </div>
          <h3>${tip.title}</h3>
        </div>
        <p>${tip.description}</p>
        <div class="tip-footer">
          <div class="tip-progress">Consejo ${index + 1} de ${tips.length}</div>
          <div class="tip-nav">
            <button class="tip-nav-btn prev-btn" aria-label="Consejo anterior">
              <i class="fas fa-chevron-left"></i>
            </button>
            <button class="tip-nav-btn next-btn" aria-label="Siguiente consejo">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('')}
  `;

  setupTipNavigation();
  setupTouchControls();
  startTipRotation();
  
  tipsContainer.addEventListener('mouseenter', pauseTipRotation);
  tipsContainer.addEventListener('mouseleave', startTipRotation);
}

function showTip(index) {
  if (index < 0) index = tips.length - 1;
  if (index >= tips.length) index = 0;
  
  document.querySelector('.tip-card.active').classList.remove('active');
  currentTipIndex = index;
  
  setTimeout(() => {
    document.querySelector(`.tip-card[data-index="${index}"]`).classList.add('active');
  }, 300);
}

function setupTipNavigation() {
  document.querySelectorAll('.next-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      showTip(currentTipIndex + 1);
      resetTipRotation();
    });
  });
  
  document.querySelectorAll('.prev-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      showTip(currentTipIndex - 1);
      resetTipRotation();
    });
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') showTip(currentTipIndex + 1);
    if (e.key === 'ArrowLeft') showTip(currentTipIndex - 1);
  });
}

function setupTouchControls() {
  const tipsContainer = document.querySelector('.tips-container');
  
  tipsContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    pauseTipRotation();
  }, {passive: true});
  
  tipsContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    startTipRotation();
  }, {passive: true});
}

function handleSwipe() {
  const diff = touchStartX - touchEndX;
  if (diff > 50) showTip(currentTipIndex + 1);
  if (diff < -50) showTip(currentTipIndex - 1);
}

function startTipRotation() {
  tipInterval = setInterval(() => {
    showTip((currentTipIndex + 1) % tips.length);
  }, 8000);
}

function pauseTipRotation() {
  clearInterval(tipInterval);
}

function resetTipRotation() {
  pauseTipRotation();
  startTipRotation();
}

window.initTipsSection = initTipsSection;