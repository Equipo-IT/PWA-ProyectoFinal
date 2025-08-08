// Importa las funciones necesarias de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getDatabase, 
  ref, 
  push, 
  set, 
  onValue, 
  off, 
  query, 
  orderByChild, 
  limitToLast, 
  equalTo,
  get
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD-8JqtblN_oQgFB5eI-9H112zvHHsf2kk",
  authDomain: "integradora-65813.firebaseapp.com",
  databaseURL: "https://integradora-65813-default-rtdb.firebaseio.com",
  projectId: "integradora-65813",
  storageBucket: "integradora-65813.appspot.com",
  messagingSenderId: "620376972992",
  appId: "1:620376972992:web:b5ad8fb7106c6caddf9725"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Objeto con todas las funciones de Firebase Realtime Database
const firebaseFunctions = {
  db,
  ref: (path) => ref(db, path),
  push,
  set,
  onValue,
  off,
  query,
  orderByChild,
  limitToLast,
  equalTo,
  get
};

// Exporta las funciones individualmente
export { 
  db,
  ref,
  push,
  set,
  onValue,
  off,
  query,
  orderByChild,
  limitToLast,
  equalTo,
  get,
  app
};

// También exporta el objeto completo y lo hace disponible globalmente
export default firebaseFunctions;
window.firebaseDB = db;
window.firebaseDBFunctions = firebaseFunctions;

// Función de verificación para uso global
window.verifyFirebase = () => {
  if (!app || !db) {
    console.error('Firebase no se inicializó correctamente');
    return false;
  }
  return true;
};

console.log('Firebase configurado correctamente');