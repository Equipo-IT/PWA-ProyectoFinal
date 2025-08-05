// Datos del equipo (personaliza las descripciones)
const teamMembers = [
  {
    name: "Brandon Roel Martínez Rivas",
    role: "Líder del Proyecto",
    bio: "Desarrollador full-stack con enfoque en soluciones sostenibles. Coordina el equipo y arquitectura del proyecto.",
    photo: "img/team/brandon.jpg" // Asegúrate de tener esta imagen
  },
  {
    name: "Ricardo Guadalupe Vásquez Hernández",
    role: "Experto en UX/UI",
    bio: "Diseñador de interfaces centradas en la experiencia de usuario y accesibilidad.",
    photo: "img/team/ricardo.jpg"
  },
  {
    name: "Francisco Javier Valerio Lara",
    role: "Desarrollador Backend",
    bio: "Especialista en bases de datos y lógica de servidor para aplicaciones escalables.",
    photo: "img/team/francisco.jpg"
  },
  {
    name: "David Alessandro Martínez Valdés",
    role: "Especialista en Contenidos",
    bio: "Crea contenido educativo sobre sostenibilidad y cambio climático.",
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