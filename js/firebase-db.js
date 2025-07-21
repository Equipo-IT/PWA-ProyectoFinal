// Importa las funciones necesarias de Firebase Realtime Database
import { getDatabase, ref, push, set, onValue, off, query, orderByChild, limitToLast, equalTo } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { app } from "./firebase-config.js";

// Obtiene la instancia de Realtime Database
const db = getDatabase(app);

/**
 * Guarda un nuevo comentario en Realtime Database
 * @param {string} nombre - Nombre del usuario
 * @param {string} correo - Correo electrónico
 * @param {string} mensaje - Texto del comentario
 * @returns {Promise<Object>} - Objeto con resultado de la operación
 */
export async function agregarComentario(nombre, correo, mensaje) {
  try {
    const comentariosRef = ref(db, 'comentarios');
    const nuevoComentarioRef = push(comentariosRef);
    
    await set(nuevoComentarioRef, {
      Nombre: nombre,
      Correo: correo,
      Comentario: mensaje,
      Fecha: new Date().toLocaleDateString('es-MX'),
      Estatus: 'Pendiente'
    });
    
    console.log("Comentario guardado con ID:", nuevoComentarioRef.key);
    return { 
      exito: true, 
      id: nuevoComentarioRef.key,
      fecha: new Date().toLocaleDateString('es-MX')
    };
  } catch (error) {
    console.error("Error al guardar comentario:", error);
    return { 
      exito: false, 
      error: error.message 
    };
  }
}

/**
 * Obtiene todos los comentarios en tiempo real
 * @param {function} callback - Función que recibe los comentarios
 * @returns {function} - Función para desuscribirse
 */
export function obtenerComentariosEnTiempoReal(callback) {
  const comentariosRef = query(
    ref(db, 'comentarios'),
    orderByChild('Fecha')
  );

  const onDataChange = onValue(comentariosRef, (snapshot) => {
    const comentarios = [];
    snapshot.forEach((childSnapshot) => {
      comentarios.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    
    // Ordenar por fecha descendente
    comentarios.sort((a, b) => {
      const dateA = new Date(a.Fecha.split('/').reverse().join('/'));
      const dateB = new Date(b.Fecha.split('/').reverse().join('/'));
      return dateB - dateA;
    });
    
    callback(comentarios);
  }, (error) => {
    console.error("Error al obtener comentarios:", error);
    callback([], error);
  });

  // Función para desuscribirse
  return () => off(comentariosRef, 'value', onDataChange);
}

/**
 * Obtiene comentarios aprobados para mostrar públicamente
 * @param {number} limite - Número máximo de comentarios a obtener
 * @returns {Promise<Array>} - Lista de comentarios aprobados
 */
export async function obtenerComentariosAprobados(limite = 50) {
  try {
    const comentariosRef = query(
      ref(db, 'comentarios'),
      orderByChild('Estatus'),
      equalTo('Aprobado'),
      limitToLast(limite)
    );

    return new Promise((resolve) => {
      onValue(comentariosRef, (snapshot) => {
        const comentarios = [];
        snapshot.forEach((childSnapshot) => {
          comentarios.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
        
        // Ordenar por fecha descendente
        comentarios.sort((a, b) => {
          const dateA = new Date(a.Fecha.split('/').reverse().join('/'));
          const dateB = new Date(b.Fecha.split('/').reverse().join('/'));
          return dateB - dateA;
        });
        
        resolve(comentarios);
      }, {
        onlyOnce: true
      });
    });
  } catch (error) {
    console.error("Error al obtener comentarios aprobados:", error);
    return [];
  }
}

/**
 * Función auxiliar para obtener un comentario específico
 * @param {string} id - ID del comentario
 * @returns {Promise<Object|null>} - El comentario o null si no existe
 */
export async function obtenerComentarioPorId(id) {
  try {
    const comentarioRef = ref(db, `comentarios/${id}`);
    const snapshot = await get(comentarioRef);
    return snapshot.exists() ? { id, ...snapshot.val() } : null;
  } catch (error) {
    console.error("Error al obtener comentario:", error);
    return null;
  }
}