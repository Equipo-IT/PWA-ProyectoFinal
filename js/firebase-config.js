// Importa las funciones necesarias
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

// Exportar las funciones necesarias
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