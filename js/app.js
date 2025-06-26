// ----- Secciones -----
let currentSection = 0;
const sections = document.querySelectorAll('.section');

function showSection(index) {
  sections.forEach((section, i) => {
    section.classList.toggle('active', i === index);
  });
}

function nextSection() {
  currentSection = (currentSection + 1) % sections.length;
  showSection(currentSection);
}

function prevSection() {
  currentSection = (currentSection - 1 + sections.length) % sections.length;
  showSection(currentSection);
}

function goToSection(index) {
  currentSection = index;
  showSection(currentSection);
}

window.addEventListener('load', () => {
  showSection(currentSection);
});

// ----- Service Worker -----
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker
      .register('ServiceWorker.js')
      .then(res => console.log('Service Worker registrado ✅'))
      .catch(err => console.log('❌ No se registró el Service Worker', err));
  });
}

// ----- Botón de instalación -----
let deferredPrompt;
const installBtn = document.getElementById('btnInstall');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'block';
});

installBtn.addEventListener('click', () => {
  installBtn.style.display = 'none';
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(choiceResult => {
      if (choiceResult.outcome === 'accepted') {
        console.log('👍 Usuario aceptó la instalación');
      } else {
        console.log('👎 Usuario rechazó la instalación');
      }
      deferredPrompt = null;
    });
  }
});
