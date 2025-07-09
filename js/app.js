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

// Sección de comentarios mejorada
function initCommentsSection() {
  const commentForm = document.getElementById('commentForm');
  if (commentForm) {
    commentForm.addEventListener('submit', handleCommentSubmit);
    
    // Agregar validación en tiempo real
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const commentInput = document.getElementById('comment');
    
    [nameInput, emailInput, commentInput].forEach(input => {
      input.addEventListener('input', () => {
        if (input.value.trim() !== '') {
          input.style.borderColor = '#e0e0e0';
        }
      });
    });
  }
}

function handleCommentSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const formMessage = document.getElementById('formMessage');
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const comment = document.getElementById('comment').value.trim();
  const submitBtn = form.querySelector('button[type="submit"]');
  
  // Resetear mensajes anteriores
  formMessage.textContent = '';
  formMessage.className = 'form-message';
  
  // Validación mejorada con feedback visual
  let isValid = true;
  
  if (!name) {
    showInputError('name', 'Por favor ingresa tu nombre');
    isValid = false;
  }
  
  if (!email) {
    showInputError('email', 'Por favor ingresa tu correo');
    isValid = false;
  } else if (!validateEmail(email)) {
    showInputError('email', 'Correo electrónico no válido');
    isValid = false;
  }
  
  if (!comment) {
    showInputError('comment', 'Por favor escribe tu comentario');
    isValid = false;
  }
  
  if (!isValid) {
    showFormMessage('Por favor completa todos los campos correctamente', 'error');
    return;
  }

  // Deshabilitar botón durante el envío
  submitBtn.disabled = true;
  const originalBtnText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
  
  // Simular envío (reemplaza esto con tu lógica real)
  simulateFormSubmission()
    .then(() => {
      // Éxito
      showFormMessage('¡Gracias por tu comentario! Tu mensaje ha sido enviado correctamente.', 'success');
      form.reset();
    })
    .catch(error => {
      // Error
      showFormMessage('Hubo un error al enviar tu mensaje. Por favor intenta nuevamente.', 'error');
      console.error('Error al enviar comentario:', error);
    })
    .finally(() => {
      // Restaurar botón
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    });
}

// Función para simular envío al servidor (remplázala con tu implementación real)
function simulateFormSubmission() {
  return new Promise((resolve) => {
    // Simular retardo de red (1.5 segundos)
    setTimeout(() => {
      resolve({ status: 'success' });
    }, 1500);
  });
}

// Función para mostrar errores en campos específicos
function showInputError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const formGroup = input.closest('.form-group');
  
  // Crear o actualizar elemento de error
  let errorElement = formGroup.querySelector('.input-error');
  if (!errorElement) {
    errorElement = document.createElement('small');
    errorElement.className = 'input-error';
    formGroup.appendChild(errorElement);
  }
  
  input.style.borderColor = '#c62828';
  errorElement.textContent = message;
  errorElement.style.display = 'block';
}

// Función para mostrar mensajes en el formulario
function showFormMessage(message, type) {
  const formMessage = document.getElementById('formMessage');
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
  
  // Hacer scroll suave al mensaje
  formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Función para validar email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
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