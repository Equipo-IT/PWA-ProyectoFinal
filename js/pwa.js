// ====================================
// REGISTRO DEL SERVICE WORKER
// ====================================
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('ServiceWorker.js')
      .then(registration => {
        console.log('ServiceWorker registrado con éxito:', registration.scope);
      })
      .catch(error => {
        console.error('Error al registrar ServiceWorker:', error);
      });
  }
}

// ====================================
// CONFIGURACIÓN DEL BOTÓN DE INSTALACIÓN
// ====================================
function setupInstallPrompt() {
  let deferredPrompt;
  const installBtn = document.getElementById('btnInstall');

  if (!installBtn) return;

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
    } else {
      console.log('Usuario rechazó la instalación');
    }

    installBtn.style.display = 'none';
    deferredPrompt = null;
  });

  window.addEventListener('appinstalled', () => {
    console.log('PWA instalada correctamente');
    installBtn.style.display = 'none';
    deferredPrompt = null;
  });
}

// ====================================
// EJECUCIÓN AUTOMÁTICA AL CARGAR
// ====================================
document.addEventListener('DOMContentLoaded', () => {
  registerServiceWorker();
  setupInstallPrompt();
});
