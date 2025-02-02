// Importa los módulos necesarios
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Importa Storage

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDRX_8Y6Uf-BAS3U9hShUeYhvw0LbQMlrc",
    authDomain: "crecibv.firebaseapp.com",
    projectId: "crecibv",
    storageBucket: "crecibv.firebasestorage.app",
    messagingSenderId: "214146216728",
    appId: "1:214146216728:web:c29644cc6205493ecaa46d",
    measurementId: "G-QYCQW5379V"
  };

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Servicios de Firebase
const auth = getAuth(app); // Autenticación
const db = getFirestore(app); // Firestore
const storage = getStorage(app); // Storage

// Exporta los servicios para usarlos en el proyecto
export { auth, db, storage };
