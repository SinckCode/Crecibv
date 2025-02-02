import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from '../firebase'; // Importa el storage de Firebase
import defaultProfileImage from '../assets/umagenLogin.png'; // Imagen local predeterminada
import './Register.scss';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [profileImage, setProfileImage] = useState(null); // Imagen seleccionada por el usuario
  const [uploading, setUploading] = useState(false); // Estado de subida de la imagen
  const [photoURL, setPhotoURL] = useState(defaultProfileImage); // URL de la imagen subida
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
      const sanitizedFileName = file.name.replace(/\s+/g, '-'); // Reemplaza espacios por guiones
      const storageRef = ref(storage, `profile-images/${Date.now()}-${sanitizedFileName}`);
      try {
        await uploadBytes(storageRef, file); // Sube la imagen al storage
        const url = await getDownloadURL(storageRef); // Obtén la URL de descarga
        setPhotoURL(url); // Actualiza la URL
        setUploading(false); // Desactiva estado de subida
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
      // Crear usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Actualizar perfil del usuario con nombre y foto
      await updateProfile(user, {
        displayName: name,
        photoURL, // Usa la URL de la imagen subida o la predeterminada
      });

      // Guardar información adicional en Firestore
      await addDoc(collection(db, 'users'), {
        name,
        username,
        email,
        photoURL, // Guarda la foto en Firestore también
        uid: user.uid,
      });

      setSuccess('Usuario registrado exitosamente.');
      setFormData({ name: '', username: '', email: '', password: '', confirmPassword: '' });
      setProfileImage(null);
      setPhotoURL(defaultProfileImage);
    } catch (err) {
      setError('Error al registrar el usuario. Intenta nuevamente.');
      console.error(err);
    }
  };

  return (
    <div className="register">
      <h1>Registrar Nuevo Usuario</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Nombre de Usuario:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Correo Electrónico:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Contraseña:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Confirmar Contraseña:
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Foto de Perfil (opcional):
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
        {uploading && <p>Subiendo imagen...</p>}
        <button type="submit" disabled={uploading}>
          {uploading ? 'Esperando imagen...' : 'Registrar'}
        </button>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </form>
    </div>
  );
};

export default Register;
