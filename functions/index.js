const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

admin.initializeApp();

exports.deleteUser = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*"); // 🔥 Permitir cualquier origen (ajusta esto en producción)
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS"); // Métodos permitidos
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(204).send(""); // Manejo de preflight request
  }

  const { uid } = req.body; // Obtener UID del usuario a eliminar

  if (!uid) {
    return res.status(400).json({ success: false, message: "Falta el UID del usuario" });
  }

  try {
    await admin.auth().deleteUser(uid); // Eliminar usuario en Firebase Authentication
    await admin.firestore().collection("users").doc(uid).delete(); // Eliminar de Firestore
    return res.json({ success: true, message: `Usuario ${uid} eliminado.` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});



exports.getAboutUs = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
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
});


exports.updateAboutUs = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
      if (req.method !== "POST") {
        return res.status(405).json({ success: false, message: "Método no permitido" });
      }

      const { paragraph1, paragraph2 } = req.body;

      if (!paragraph1 || !paragraph2) {
        return res.status(400).json({ success: false, message: "Faltan datos" });
      }

      try {
        await admin.firestore().collection("content").doc("aboutUs").update({
          "section1.paragraph1": paragraph1,
          "section1.paragraph2": paragraph2,
        });

        return res.json({ success: true, message: "Información actualizada correctamente" });
      } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
      }
    });
  });

