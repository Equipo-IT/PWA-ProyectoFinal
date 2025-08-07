// Datos del equipo (personaliza las descripciones)
const teamMembers = [
  {
    name: "Brandon Roel Martínez Rivas",
    role: "Desarrollador principal de la aplicación PWA EcoReto",
    bio: "Encargado del desarrollo integral de la aplicación web progresiva (PWA) EcoReto.",
    photo: "img/team/brandon.jpg"
  },
  {
    name: "Ricardo Guadalupe Vásquez Hernández",
    role: "Desarrollador del videojuego Guardianes del Clima",
    bio: "Responsable del diseño y desarrollo técnico del videojuego educativo Guardianes del Clima.",
    photo: "img/team/ricardo.jpg"
  },
  {
    name: "Francisco Javier Valerio Lara",
    role: "Desarrollador móvil de EcoAdmin",
    bio: "Especialista en el desarrollo de la aplicación móvil para la administración del sistema EcoAdmin.",
    photo: "img/team/francisco.jpg"
  },
  {
    name: "David Alessandro Martínez Valdés",
    role: "Asistente de desarrollo del videojuego Guardianes del Clima",
    bio: "Colaboró en tareas de apoyo técnico y creativo durante la creación del videojuego Guardianes del Clima.",
    photo: "img/team/david.jpg"
  }
];

// Función para renderizar el equipo
function renderTeam() {
  const teamContainer = document.querySelector('.team-container');
  
  if (!teamContainer) return;
  
  teamContainer.innerHTML = teamMembers.map(member => `
    <div class="team-member">
      <div class="member-photo-container">
        <img src="${member.photo}" alt="${member.name}" class="member-photo">
      </div>
      <div class="member-info">
        <h3 class="member-name">${member.name}</h3>
        <p class="member-role">${member.role}</p>
        <p class="member-bio">${member.bio}</p>
      </div>
    </div>
  `).join('');
}

// Inicialización
document.addEventListener('DOMContentLoaded', renderTeam);

// Hacer accesible para app.js
window.initTeamSection = renderTeam;