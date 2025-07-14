function initCommentsSection() {
  const commentForm = document.getElementById('commentForm');
  if (commentForm) {
    commentForm.addEventListener('submit', handleCommentSubmit);
    
    // Validación en tiempo real
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const commentInput = document.getElementById('comment');
    
    [nameInput, emailInput, commentInput].forEach(input => {
      input.addEventListener('input', () => {
        if (input.value.trim() !== '') {
          input.style.borderColor = '#e0e0e0';
          removeInputError(input.id);
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
  
  formMessage.textContent = '';
  formMessage.className = 'form-message';
  
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

  submitBtn.disabled = true;
  const originalBtnText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
  
  simulateFormSubmission()
    .then(() => {
      showFormMessage('¡Gracias por tu comentario! Tu mensaje ha sido enviado correctamente.', 'success');
      form.reset();
    })
    .catch(error => {
      showFormMessage('Hubo un error al enviar tu mensaje. Por favor intenta nuevamente.', 'error');
      console.error('Error al enviar comentario:', error);
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    });
}

function simulateFormSubmission() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ status: 'success' });
    }, 1500);
  });
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
  formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}
