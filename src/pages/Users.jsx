// src/pages/Users.jsx
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, where, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../firebase";
import { updateProfile, updateEmail, updatePassword } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions"; // Importamos Firebase Functions
import UserCard from "../components/UserCard";
import { reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { verifyBeforeUpdateEmail } from "firebase/auth";
import "./Users.scss";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const functions = getFunctions();
  const deleteUserFunction = httpsCallable(functions, "deleteUser"); // Llamamos a la Cloud Function

  console.log("Auth instance:", auth);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
    });
    return () => unsubscribe();
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData(user);
    setModalOpen(true);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const storageRef = ref(storage, `profile-images/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setFormData({ ...formData, photoURL: url });
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedUser || !formData) return;

    try {
      const user = auth.currentUser;

      if (!user) {
        console.error("❌ No hay usuario autenticado.");
        return;
      }

      // 📌 Si se está intentando cambiar la contraseña, hay que reautenticar primero
      if (formData.password && formData.oldPassword) {
        const credential = EmailAuthProvider.credential(user.email, formData.oldPassword);

        try {
          await reauthenticateWithCredential(user, credential);
          console.log("✅ Reautenticación exitosa.");
        } catch (error) {
          console.error("❌ Error en la reautenticación:", error);
          alert("Contraseña actual incorrecta.");
          return;
        }

        try {
          await updatePassword(user, formData.password);
          console.log("✅ Contraseña actualizada correctamente.");
        } catch (error) {
          console.error("❌ Error al actualizar contraseña:", error);
          alert("No se pudo actualizar la contraseña.");
          return;
        }
      }

      // 📌 Si el correo cambió, hay que enviar un correo de verificación primero
      if (formData.email !== user.email) {
        try {
            await verifyBeforeUpdateEmail(user, formData.email);
            console.log("📩 Correo de verificación enviado. El usuario debe verificar el nuevo correo.");

            // 🔄 Esperar a que el usuario verifique su correo
            alert("Revisa tu correo y verifica la dirección antes de que se refleje el cambio.");

            // 🔥 Recargar datos del usuario después de la verificación
            await user.reload();
            console.log("✅ Usuario actualizado después de la verificación.");

        } catch (error) {
            console.error("❌ Error al actualizar correo:", error);
            alert("No se pudo actualizar el correo.");
        }
    }


      // 📌 Actualizar el perfil en Firestore
      await updateDoc(doc(db, "users", selectedUser.id), formData);
      await updateProfile(user, { displayName: formData.name, photoURL: formData.photoURL });

      console.log("✅ Usuario actualizado correctamente.");
      window.dispatchEvent(new Event("userUpdated"));
      setModalOpen(false);

    } catch (error) {
      console.error("❌ Error al actualizar usuario:", error);
    }
  };




const handleDelete = async (id) => {
    if (!id) return;

    if (!auth.currentUser) {
        console.error("No hay usuario autenticado. Inicia sesión e intenta de nuevo.");
        return;
    }

    try {
        const token = await auth.currentUser.getIdToken();
        console.log("🔥 Token obtenido:", token);

        // 📌 Llamar a la Cloud Function para eliminar de Firebase Auth
        const response = await fetch("https://us-central1-crecibv.cloudfunctions.net/deleteUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // 🔥 Enviar el token correctamente
            },
            body: JSON.stringify({ uid: id }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
            console.log(`✅ Usuario ${id} eliminado correctamente en Firebase Auth.`);

            // 🔍 Buscar y eliminar el usuario en Firestore usando `uid`
            console.log("📌 Buscando usuario en Firestore...");
            const userQuery = query(collection(db, "users"), where("uid", "==", id));
            const userDocs = await getDocs(userQuery);

            if (!userDocs.empty) {
                userDocs.forEach(async (docSnapshot) => {
                    await deleteDoc(doc(db, "users", docSnapshot.id));
                    console.log(`✅ Usuario ${docSnapshot.id} eliminado correctamente de Firestore.`);
                });

                // 🔄 Actualizar el estado para reflejar el cambio en el frontend
                setUsers((prevUsers) => prevUsers.filter(user => user.uid !== id));
                console.log("🎯 Estado actualizado, usuario eliminado del frontend.");
            } else {
                console.warn("⚠️ No se encontró el usuario en Firestore.");
            }

        } else {
            console.error("❌ Error en Cloud Function:", data.message);
        }
    } catch (error) {
        console.error("❌ Error al eliminar usuario:", error);
    }
};




  return (
    <div className="users-container">
      <h2>Usuarios Activos</h2>
      <div className="users-grid">
        {users.map((user) => (
          <UserCard key={user.id} user={user} onDelete={handleDelete} onEdit={handleEdit} />
        ))}
      </div>

      {modalOpen && (
  <div className="modal">
    <div className="modal-content">
      <h3>Editar Usuario</h3>

      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Nombre"
      />

      <input
        type="text"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        placeholder="Nombre de usuario"
      />

      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Correo Electrónico"
      />

      {/* 🔒 Campo para la contraseña actual (Requerido para actualizarla) */}
      <input
        type="password"
        placeholder="Contraseña actual (requerida si cambia la contraseña)"
        onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
      />

      {/* 🔄 Campo para la nueva contraseña */}
      <input
        type="password"
        placeholder="Nueva Contraseña (opcional)"
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />

      <label>Foto de Perfil</label>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      <img src={formData.photoURL} alt="Vista previa" className="preview-image" />

      <button onClick={handleSaveEdit}>Guardar</button>
      <button onClick={() => setModalOpen(false)}>Cancelar</button>
    </div>
  </div>
)}
    </div>
  );
};

export default Users;
