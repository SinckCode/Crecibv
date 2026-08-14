const { onCall, onRequest, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

admin.initializeApp();

const ALLOWED_ORIGINS = [
  "https://crecibv.web.app",
  "https://crecibv.firebaseapp.com",
  "http://localhost:3000",
];

function callerIsAdmin(request) {
  return (
    request.auth &&
    (request.auth.token.admin === true || request.auth.token.role === "admin")
  );
}

// Set admin custom claim on a user (admin only)
exports.setAdminRole = onCall(async (request) => {
  if (!callerIsAdmin(request)) {
    throw new HttpsError("permission-denied", "No autorizado");
  }

  const { uid } = request.data;
  if (!uid || typeof uid !== "string") {
    throw new HttpsError("invalid-argument", "UID invalido");
  }

  await admin.auth().setCustomUserClaims(uid, { admin: true });
  return { success: true, message: `Admin claim asignado a ${uid}` };
});

// Create a new admin user (admin only) — uses Admin SDK so caller stays signed in
exports.createUser = onCall(async (request) => {
  if (!callerIsAdmin(request)) {
    throw new HttpsError("permission-denied", "No autorizado");
  }

  const { email, password, displayName, username, photoURL } = request.data;

  if (!email || !password || !displayName) {
    throw new HttpsError("invalid-argument", "Faltan datos requeridos");
  }
  if (password.length < 6) {
    throw new HttpsError(
      "invalid-argument",
      "La contrasena debe tener al menos 6 caracteres",
    );
  }

  try {
    const createData = { email, password, displayName };
    if (photoURL && photoURL.startsWith("http")) {
      createData.photoURL = photoURL;
    }

    const userRecord = await admin.auth().createUser(createData);
    await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });

    await admin.firestore().collection("users").add({
      name: displayName,
      username: username || "",
      email,
      photoURL: photoURL && photoURL.startsWith("http") ? photoURL : "",
      uid: userRecord.uid,
    });

    return { success: true, uid: userRecord.uid };
  } catch (error) {
    if (error.code === "auth/email-already-exists") {
      throw new HttpsError("already-exists", "Este correo ya esta en uso");
    }
    if (error.code === "auth/invalid-email") {
      throw new HttpsError("invalid-argument", "El correo no es valido");
    }
    if (error.code === "auth/weak-password") {
      throw new HttpsError("invalid-argument", "La contrasena es demasiado debil");
    }
    throw new HttpsError("internal", error.message || "Error al crear usuario");
  }
});

// Delete a user from Auth and Firestore (admin only)
exports.deleteUser = onCall(async (request) => {
  if (!callerIsAdmin(request)) {
    throw new HttpsError("permission-denied", "No autorizado");
  }

  const { uid } = request.data;
  if (!uid || typeof uid !== "string" || uid.length > 128) {
    throw new HttpsError("invalid-argument", "UID invalido");
  }

  // Get user's photoURL from Firestore before deleting
  const usersRef = admin.firestore().collection("users");
  const snapshot = await usersRef.where("uid", "==", uid).get();

  // Delete profile image from Storage if it exists
  const bucket = admin.storage().bucket();
  for (const userDoc of snapshot.docs) {
    const photoURL = userDoc.data().photoURL;
    if (photoURL && photoURL.includes("firebasestorage.googleapis.com")) {
      try {
        // Extract file path from download URL
        const urlPath = decodeURIComponent(
          photoURL.split("/o/")[1].split("?")[0],
        );
        await bucket.file(urlPath).delete();
      } catch (err) {
        // Image may already be deleted, continue
      }
    }
  }

  // Delete from Firebase Auth
  try {
    await admin.auth().deleteUser(uid);
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      // User already deleted from Auth, continue to clean Firestore
    } else {
      throw new HttpsError("internal", error.message || "Error al eliminar usuario");
    }
  }

  // Delete from Firestore
  const batch = admin.firestore().batch();
  snapshot.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();

  return { success: true, message: `Usuario ${uid} eliminado.` };
});

// Get About Us content (public, remains onRequest)
exports.getAboutUs = onRequest({ cors: ALLOWED_ORIGINS }, async (req, res) => {
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
exports.updateAboutUs = onCall(async (request) => {
  if (!callerIsAdmin(request)) {
    throw new HttpsError("permission-denied", "No autorizado");
  }

  const { paragraph1, paragraph2 } = request.data;
  if (!paragraph1 || !paragraph2 || typeof paragraph1 !== "string" || typeof paragraph2 !== "string") {
    throw new HttpsError("invalid-argument", "Faltan datos o formato invalido");
  }
  if (paragraph1.length > 2000 || paragraph2.length > 2000) {
    throw new HttpsError("invalid-argument", "Texto demasiado largo (max 2000 caracteres)");
  }

  await admin.firestore().collection("content").doc("aboutUs").update({
    "section1.paragraph1": paragraph1,
    "section1.paragraph2": paragraph2,
  });

  return { success: true, message: "Informacion actualizada correctamente" };
});
