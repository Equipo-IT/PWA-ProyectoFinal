// Variables globales
let currentSection = 0;
const sections = document.querySelectorAll('.section');

// Inicialización de la app
document.addEventListener('DOMContentLoaded', () => {
  showSection(currentSection);
  initTipsSection();
  initCommentsSection();
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
      icon.style.color = '#8BC34A';
    } else {
      icon.classList.remove('active');
      icon.style.color = 'white';
    }
  });
}

// Eventos de teclado para navegación
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') nextSection();
  if (e.key === 'ArrowLeft') prevSection();
});
