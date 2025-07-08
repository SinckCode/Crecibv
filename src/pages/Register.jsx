// src/pages/Register.jsx
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from '../firebase';
import defaultProfileImage from '../assets/umagenLogin.png';
import './Register.scss';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [photoURL, setPhotoURL] = useState(defaultProfileImage);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setProfileImage(file);

    if (file) {
      setUploading(true);
      const fileExtension = file.name.split('.').pop();
      const fileName = `profile-${Date.now()}.${fileExtension}`;
      const storageRef = ref(storage, `profile-images/${fileName}`);
      try {
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        setPhotoURL(url);
        setUploading(false);
      } catch (err) {
        setError('Error al subir la imagen. Intenta nuevamente.');
        setUploading(false);
        console.error('Error al subir la imagen:', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { name, username, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      let finalPhotoURL = photoURL; // Usa la imagen subida si existe

      if (!profileImage) {
        // 🔥 Si el usuario no subió imagen, usar la imagen por defecto
        finalPhotoURL = "https://firebasestorage.googleapis.com/v0/b/crecibv.firebasestorage.app/o/profile-images%2F1735878729739-png-transparent-male-avatar-user-profile-profile-heroes-necktie-recruiter-thumbnail-(1).png?alt=media&token=351456e8-b08d-49f5-9e33-8f906409b931";
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🔥 Ahora se asegura que `photoURL` nunca sea vacío
      await updateProfile(user, {
        displayName: name,
        photoURL: finalPhotoURL,
      });

      await addDoc(collection(db, 'users'), {
        name,
        username,
        email,
        photoURL: finalPhotoURL,
        uid: user.uid,
      });

      setSuccess('Usuario registrado exitosamente.');
      setFormData({ name: '', username: '', email: '', password: '', confirmPassword: '' });
      setProfileImage(null);
      setPhotoURL(defaultProfileImage);

      // 🔥 Disparar evento para actualizar la lista de usuarios en tiempo real
      window.dispatchEvent(new Event("userUpdated"));
    } catch (err) {
      console.error("Error en Firebase:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("Este correo ya está en uso.");
      } else if (err.code === "auth/weak-password") {
        setError("La contraseña es demasiado débil.");
      } else {
        setError("Error al registrar el usuario. Intenta nuevamente.");
      }
    }
  };

  return (
    <div className="register">
      <h1>Registrar Nuevo Usuario</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>
        <label>
          Nombre de Usuario:
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </label>
        <label>
          Correo Electrónico:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>
        <label>
          Contraseña:
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </label>
        <label>
          Confirmar Contraseña:
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
        </label>
        <label>
          Foto de Perfil (opcional):
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>
        {uploading && <p>Subiendo imagen...</p>}
        <button type="submit" disabled={uploading}>{uploading ? 'Esperando imagen...' : 'Registrar'}</button>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </form>
    </div>
  );
};

export default Register;
