// Variables globales
let currentSection = 0;
const sections = document.querySelectorAll('.section');
let deferredPrompt;

// Inicialización de la app
document.addEventListener('DOMContentLoaded', () => {
  // Verificar que Firebase esté cargado
  if (!window.firebaseDB) {
    console.error('Firebase no está inicializado');
    return;
  }

  // Configuración inicial
  showSection(currentSection);
  updateActiveNavIcon();
  
  // PWA
  registerServiceWorker();
  setupInstallPrompt();
  
  // Configura eventos
  setupEventListeners();

  // Inicializa módulos
  if (typeof initTipsSection === 'function') initTipsSection();
  if (typeof initCommentsSection === 'function') initCommentsSection();
  if (typeof initComunidad === 'function') initComunidad();
  
});

// Configura eventos globales
function setupEventListeners() {
  // Eventos de teclado
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextSection();
    if (e.key === 'ArrowLeft') prevSection();
  });
  
  // Eventos de navegación
  document.querySelectorAll('.nav-icon').forEach((icon, index) => {
    icon.addEventListener('click', () => {
      if (index === 4 || index === 5) { // Sección de comunidad o comentarios
        setTimeout(() => {
          if (typeof cargarComentarios === 'function') cargarComentarios();
        }, 300);
      }
    });
  });
}

// Navegación entre secciones
function showSection(index) {
  sections.forEach((section, i) => {
    section.classList.toggle('active', i === index);
    section.style.display = i === index ? 'block' : 'none';
  });
  currentSection = index;
  updateActiveNavIcon();
  
  // Scroll suave
  if (sections[index]) {
    sections[index].scrollTo({ top: 0, behavior: 'smooth' });
  }
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
  if (index >= 0 && index < sections.length) {
    showSection(index);
  }
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

// PWA: Service Worker
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('ServiceWorker.js')
      .then(registration => {
        console.log('ServiceWorker registrado:', registration.scope);
      })
      .catch(error => {
        console.log('Error al registrar ServiceWorker:', error);
      });
  }
}

// PWA: Instalación
function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installBtn = document.getElementById('btnInstall');
    if (installBtn) {
      installBtn.style.display = 'block';
      installBtn.addEventListener('click', async () => {
        installBtn.style.display = 'none';
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          console.log('Usuario aceptó instalar la PWA');
        }
        deferredPrompt = null;
      });
    }
  });
}

// Funciones globales
window.nextSection = nextSection;
window.prevSection = prevSection;
window.goToSection = goToSection;