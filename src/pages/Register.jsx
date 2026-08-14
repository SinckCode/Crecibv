import React, { useState } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { storage } from '../firebase';
import FormSection from '../components/admin/FormSection';
import FormActions from '../components/admin/FormActions';
import '../components/admin/AdminComponents.scss';
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
  const [photoURL, setPhotoURL] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

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
      } catch (err) {
        setError('Error al subir la imagen. Intenta nuevamente.');
        console.error('Error al subir la imagen:', err);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSuccess('');

    const { name, username, email, password, confirmPassword } = formData;

    if (!name || !username || !email || !password) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contrasenas no coinciden.');
      return;
    }

    if (password.length < 6) {
      setError('La contrasena debe tener al menos 6 caracteres.');
      return;
    }

    setSaving(true);
    try {
      const functions = getFunctions();
      const createUser = httpsCallable(functions, 'createUser');
      await createUser({
        email,
        password,
        displayName: name,
        username,
        photoURL: photoURL || '',
      });

      setSuccess(`Usuario "${name}" registrado exitosamente.`);
      setFormData({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      setProfileImage(null);
      setPhotoURL('');

      window.dispatchEvent(new Event('userUpdated'));
    } catch (err) {
      console.error('Error al registrar usuario:', err);
      if (
        err.message?.includes('email-already-exists') ||
        err.message?.includes('already-in-use')
      ) {
        setError('Este correo ya esta en uso.');
      } else if (err.message?.includes('weak-password')) {
        setError('La contrasena es demasiado debil.');
      } else {
        setError('Error al registrar el usuario. Intenta nuevamente.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page">
      <h1 className="admin-page__title">Registrar Nuevo Usuario</h1>
      <p className="admin-page__subtitle">Crea una cuenta para un miembro del equipo</p>

      <div className="admin-page__card">
        {error && <div className="admin-page__error">{error}</div>}
        {success && <div className="admin-page__success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <FormSection label="Nombre completo" htmlFor="reg-name">
            <input
              id="reg-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
            />
          </FormSection>

          <FormSection label="Nombre de usuario" htmlFor="reg-username">
            <input
              id="reg-username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
            />
          </FormSection>

          <FormSection label="Correo electronico" htmlFor="reg-email">
            <input
              id="reg-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </FormSection>

          <FormSection label="Contrasena" htmlFor="reg-password">
            <input
              id="reg-password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </FormSection>

          <FormSection label="Confirmar contrasena" htmlFor="reg-confirm">
            <input
              id="reg-confirm"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </FormSection>

          <FormSection label="Foto de perfil (opcional)" htmlFor="reg-photo">
            <input id="reg-photo" type="file" accept="image/*" onChange={handleFileChange} />
          </FormSection>
          {uploading && <p style={{ color: '#888', fontSize: '0.85rem' }}>Subiendo imagen...</p>}

          <FormActions onSave={handleSubmit} saving={saving || uploading} />
        </form>
      </div>
    </div>
  );
};

export default Register;
