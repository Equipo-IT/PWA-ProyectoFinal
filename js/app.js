// Variables globales
let currentSection = 0;
const sections = document.querySelectorAll('.section');
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

// Inicialización de la app
document.addEventListener('DOMContentLoaded', () => {
  showSection(currentSection);
  initTipsSection();
  registerServiceWorker();
  setupInstallPrompt();
});

// Navegación entre secciones
function showSection(index) {
  sections.forEach((section, i) => {
    section.classList.toggle('active', i === index);
  });
  currentSection = index;
  updateActiveNavIcon();
}

function nextSection() {
  const nextIndex = (currentSection + 1) % sections.length;
  showSection(nextIndex);
}

function prevSection() {
  const prevIndex = (currentSection - 1 + sections.length) % sections.length;
  showSection(prevIndex);
}

function goToSection(index) {
  showSection(index);
}

function updateActiveNavIcon() {
  const navIcons = document.querySelectorAll('.nav-icon');
  navIcons.forEach((icon, i) => {
    if (i === currentSection) {
      icon.classList.add('active');
      icon.style.color = '#8BC34A'; // Color verde claro para el ícono activo
    } else {
      icon.classList.remove('active');
      icon.style.color = 'white'; // Color blanco para los íconos inactivos
    }
  });
}

// Inicializar sección de consejos
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

// Service Worker
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('ServiceWorker.js')
      .then(registration => {
        console.log('ServiceWorker registrado con éxito:', registration.scope);
      })
      .catch(error => {
        console.log('Error al registrar ServiceWorker:', error);
      });
  }
}

// Instalación PWA
function setupInstallPrompt() {
  let deferredPrompt;
  const installBtn = document.getElementById('btnInstall');
  
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'flex';
  });
  
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('Usuario aceptó la instalación');
      installBtn.style.display = 'none';
    } else {
      console.log('Usuario rechazó la instalación');
    }
    
    deferredPrompt = null;
  });
  
  window.addEventListener('appinstalled', () => {
    console.log('PWA instalada');
    installBtn.style.display = 'none';
    deferredPrompt = null;
  });
}

// Eventos de teclado para navegación
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') nextSection();
  if (e.key === 'ArrowLeft') prevSection();
});