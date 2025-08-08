// Obtener instancias de Firebase
const db = window.firebaseDB;
const { ref, push, set, onValue, query, orderByChild, limitToLast } = window.firebaseDBFunctions || {};

// Función principal para inicializar la sección de comentarios
export function initCommentsSection() {
  if (!db) {
    console.error('Firebase Database no está disponible');
    return;
  }

  const commentForm = document.getElementById('commentForm');
  if (commentForm) {
    commentForm.addEventListener('submit', handleCommentSubmit);
    loadComments();
    
    // Validación en tiempo real
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const commentInput = document.getElementById('comment');
    
    nameInput.addEventListener('input', (e) => {
      if (isValidName(e.target.value.trim())) {
        e.target.style.borderColor = '#e0e0e0';
        removeInputError('name');
      }
    });
    
    [emailInput, commentInput].forEach(input => {
      input.addEventListener('input', () => {
        if (input.value.trim() !== '') {
          input.style.borderColor = '#e0e0e0';
          removeInputError(input.id);
        }
      });
    });
  }
}

// Cargar comentarios
function loadComments() {
  if (!db || !ref || !onValue) {
    console.error('Funciones de Firebase no disponibles');
    return;
  }

  const commentsRef = query(
    ref(db, 'Comentarios'), // Cambiado a mayúscula
    orderByChild('Fecha'),
    limitToLast(50)
  );

  const commentsContainer = document.getElementById('communityFeed');
  
  if (!commentsContainer) return;
  
  commentsContainer.innerHTML = '<div class="loader"><i class="fas fa-spinner fa-spin"></i> Cargando comentarios...</div>';

  onValue(commentsRef, (snapshot) => {
    const data = snapshot.val();
    commentsContainer.innerHTML = '';
    
    if (data) {
      const commentsArray = [];
      
      Object.entries(data).forEach(([key, comment]) => {
        if (comment.Estatus === 'Aprobado') {
          commentsArray.push({
            id: key,
            ...comment
          });
        }
      });

      // Ordenar por fecha descendente (simplificado para formato ISO)
      commentsArray.sort((a, b) => new Date(b.Fecha) - new Date(a.Fecha));

      commentsArray.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment-card';
        commentElement.innerHTML = `
          <div class="comment-header">
            <h4>${comment.Nombre || 'Anónimo'}</h4>
            <small>${formatDate(comment.Fecha) || formatDate(new Date())}</small>
          </div>
          <p class="comment-message">${comment.ComentarioTexto || ''}</p> <!-- Campo corregido -->
        `;
        commentsContainer.appendChild(commentElement);
      });
    } else {
      commentsContainer.innerHTML = '<p class="no-comments">No hay comentarios aún. ¡Sé el primero!</p>';
    }
  }, (error) => {
    console.error("Error al cargar comentarios:", error);
    if (commentsContainer) {
      commentsContainer.innerHTML = '<p class="error-comments">Error al cargar comentarios</p>';
    }
  });
}

// Manejar envío de comentarios
async function handleCommentSubmit(e) {
  e.preventDefault();
  
  if (!db || !ref || !push || !set) {
    console.error('Funciones de Firebase no disponibles');
    return;
  }

  const form = e.target;
  const formMessage = document.getElementById('formMessage');
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const comment = document.getElementById('comment').value.trim();
  const submitBtn = form.querySelector('button[type="submit"]');
  
  // Resetear mensajes
  formMessage.textContent = '';
  formMessage.className = 'form-message';
  formMessage.style.opacity = '1';
  
  // Validación
  let isValid = true;
  
  if (!name) {
    showInputError('name', 'Por favor ingresa tu nombre');
    isValid = false;
  } else if (!isValidName(name)) {
    showInputError('name', 'Nombre completo no válido');
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

  // Deshabilitar botón
  submitBtn.disabled = true;
  const originalBtnText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
  
  try {
    const comentariosRef = ref(db, 'Comentarios'); // Cambiado a mayúscula
    const nuevoComentarioRef = push(comentariosRef);
    
    await set(nuevoComentarioRef, {
      Nombre: name,
      Correo: email,
      ComentarioTexto: comment, // Campo corregido
      Fecha: new Date().toISOString(), // Formato ISO
      Estatus: 'Pendiente',
      Id: nuevoComentarioRef.key // Campo añadido
    });
    
    showFormMessage('¡Gracias por tu comentario! Tu mensaje ha sido enviado correctamente.', 'success');
    form.reset();
  } catch (error) {
    console.error("Error al guardar comentario:", error);
    showFormMessage('Hubo un error al enviar tu mensaje. Por favor intenta nuevamente.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  }
}

// Funciones auxiliares (sin cambios)
function isValidName(name) {
  return /^[a-zA-ZÀ-ÿ\s']+$/.test(name);
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

function formatDate(dateString) {
  try {
    if (!dateString) return 'Fecha desconocida';
    
    // Si ya es una fecha formateada (contiene /)
    if (dateString.includes('/')) {
      return dateString;
    }
    
    // Para fechas ISO
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Fecha desconocida';
    }
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  } catch {
    return 'Fecha desconocida';
  }
}

function showInputError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const formGroup = input.closest('.form-group');
  
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

function removeInputError(fieldId) {
  const input = document.getElementById(fieldId);
  const formGroup = input.closest('.form-group');
  const errorElement = formGroup.querySelector('.input-error');
  if (errorElement) {
    errorElement.style.display = 'none';
  }
}

function showFormMessage(message, type) {
  const formMessage = document.getElementById('formMessage');
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
  formMessage.style.display = 'block';
  formMessage.style.opacity = '1';
  formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  setTimeout(() => {
    let opacity = 1;
    const fadeEffect = setInterval(() => {
      if (opacity <= 0) {
        clearInterval(fadeEffect);
        formMessage.style.display = 'none';
      }
      formMessage.style.opacity = opacity;
      opacity -= 0.05;
    }, 100);  
  }, 8000);
}

// Hacer funciones disponibles globalmente
window.initCommentsSection = initCommentsSection;
window.cargarComentarios = loadComments;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  initCommentsSection();
});