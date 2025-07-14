const tips = [
  {
    title: "Reduce tu consumo de energía",
    description: "Apaga luces y dispositivos cuando no los uses. Cambia a bombillas LED.",
    icon: "fa-bolt"
  },
  {
    title: "Transporte sostenible",
    description: "Usa bicicleta, transporte público o comparte coche para reducir emisiones.",
    icon: "fa-bicycle"
  },
  {
    title: "Reduce, reusa, recicla",
    description: "Minimiza residuos y separa correctamente para reciclaje.",
    icon: "fa-recycle"
  }
];

function initTipsSection() {
  const tipsContainer = document.querySelector('.tips-container');
  if (!tipsContainer) return;
  
  tipsContainer.innerHTML = tips.map(tip => `
    <div class="tip-card">
      <div class="tip-icon">
        <i class="fas ${tip.icon}"></i>
      </div>
      <h3>${tip.title}</h3>
      <p>${tip.description}</p>
    </div>
  `).join('');
}
