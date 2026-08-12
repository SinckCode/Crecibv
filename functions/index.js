const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const ALLOWED_ORIGINS = [
  "https://crecibv.web.app",
  "https://crecibv.firebaseapp.com",
  "http://localhost:3000",
];

function setCorsHeaders(req, res) {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
  }
  res.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

async function verifyAdmin(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.split("Bearer ")[1];
  const decoded = await admin.auth().verifyIdToken(token);
  if (!decoded.admin) {
    return null;
  }
  return decoded;
}

// Set admin custom claim on a user
exports.setAdminRole = functions.https.onRequest(async (req, res) => {
  setCorsHeaders(req, res);
  if (req.method === "OPTIONS") return res.status(204).send("");
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Metodo no permitido" });
  }

  const caller = await verifyAdmin(req);
  if (!caller) {
    return res.status(403).json({ success: false, message: "No autorizado" });
  }

  const { uid } = req.body;
  if (!uid || typeof uid !== "string") {
    return res.status(400).json({ success: false, message: "UID invalido" });
  }

  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    return res.json({ success: true, message: `Admin claim asignado a ${uid}` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a user from Auth and Firestore (admin only)
exports.deleteUser = functions.https.onRequest(async (req, res) => {
  setCorsHeaders(req, res);
  if (req.method === "OPTIONS") return res.status(204).send("");
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Metodo no permitido" });
  }

  const caller = await verifyAdmin(req);
  if (!caller) {
    return res.status(403).json({ success: false, message: "No autorizado" });
  }

  const { uid } = req.body;
  if (!uid || typeof uid !== "string" || uid.length > 128) {
    return res.status(400).json({ success: false, message: "UID invalido" });
  }

  try {
    await admin.auth().deleteUser(uid);

    // Query by uid field since documents use auto-generated IDs
    const usersRef = admin.firestore().collection("users");
    const snapshot = await usersRef.where("uid", "==", uid).get();
    const batch = admin.firestore().batch();
    snapshot.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    return res.json({ success: true, message: `Usuario ${uid} eliminado.` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Get About Us content (public)
exports.getAboutUs = functions.https.onRequest(async (req, res) => {
  setCorsHeaders(req, res);
  if (req.method === "OPTIONS") return res.status(204).send("");

  try {
    const doc = await admin.firestore().collection("content").doc("aboutUs").get();
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "Documento no encontrado" });
    }
    return res.json({ success: true, data: doc.data() });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Update About Us content (admin only)
exports.updateAboutUs = functions.https.onRequest(async (req, res) => {
  setCorsHeaders(req, res);
  if (req.method === "OPTIONS") return res.status(204).send("");
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Metodo no permitido" });
  }

  const caller = await verifyAdmin(req);
  if (!caller) {
    return res.status(403).json({ success: false, message: "No autorizado" });
  }

  const { paragraph1, paragraph2 } = req.body;
  if (!paragraph1 || !paragraph2 || typeof paragraph1 !== "string" || typeof paragraph2 !== "string") {
    return res.status(400).json({ success: false, message: "Faltan datos o formato invalido" });
  }
  if (paragraph1.length > 2000 || paragraph2.length > 2000) {
    return res.status(400).json({ success: false, message: "Texto demasiado largo (max 2000 caracteres)" });
  }

  try {
    await admin.firestore().collection("content").doc("aboutUs").update({
      "section1.paragraph1": paragraph1,
      "section1.paragraph2": paragraph2,
    });
    return res.json({ success: true, message: "Informacion actualizada correctamente" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});
