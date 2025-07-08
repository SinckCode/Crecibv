// Importa los módulos necesarios
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Importa Storage

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};


// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Servicios de Firebase
const auth = getAuth(app); // Autenticación
const db = getFirestore(app); // Firestore
const storage = getStorage(app); // Storage

// Exporta los servicios para usarlos en el proyecto
export { auth, db, storage };
