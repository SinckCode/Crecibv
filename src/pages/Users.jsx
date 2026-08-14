import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../firebase';
import { updateProfile, updatePassword } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import UserCard from '../components/UserCard';
import { reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import FormSection from '../components/admin/FormSection';
import '../components/admin/AdminComponents.scss';
import './Users.scss';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const functions = getFunctions();
  const deleteUserFunction = httpsCallable(functions, 'deleteUser');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersData = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setUsers(usersData);
    });
    return () => unsubscribe();
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({ ...user, oldPassword: '', password: '' });
    setModalOpen(true);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const fileExtension = file.name.split('.').pop();
      const fileName = `profile-${Date.now()}.${fileExtension}`;
      const storageRef = ref(storage, `profile-images/${fileName}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setFormData({ ...formData, photoURL: url });
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedUser || !formData) return;
    setSaving(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        alert('No hay usuario autenticado.');
        return;
      }

      // Only allow password/email changes if editing your own profile
      const isEditingSelf = selectedUser.uid === user.uid;

      if (isEditingSelf && formData.password && formData.oldPassword) {
        const credential = EmailAuthProvider.credential(user.email, formData.oldPassword);
        try {
          await reauthenticateWithCredential(user, credential);
        } catch {
          alert('Contrasena actual incorrecta.');
          setSaving(false);
          return;
        }
        try {
          await updatePassword(user, formData.password);
        } catch {
          alert('No se pudo actualizar la contrasena.');
          setSaving(false);
          return;
        }
      }

      // Update Firestore document (name, username, photoURL)
      const { oldPassword, password, id, ...firestoreData } = formData;
      await updateDoc(doc(db, 'users', selectedUser.id), {
        name: firestoreData.name,
        username: firestoreData.username,
        photoURL: firestoreData.photoURL || '',
        email: firestoreData.email,
      });

      // Update Firebase Auth profile only if editing self
      if (isEditingSelf) {
        const profileUpdate = { displayName: formData.name };
        if (formData.photoURL && formData.photoURL.startsWith('http')) {
          profileUpdate.photoURL = formData.photoURL;
        }
        await updateProfile(user, profileUpdate);
      }

      window.dispatchEvent(new Event('userUpdated'));
      setModalOpen(false);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      alert('Error al guardar los cambios.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (uid) => {
    if (!uid || !auth.currentUser) return;

    if (uid === auth.currentUser.uid) {
      alert('No puedes eliminar tu propia cuenta.');
      return;
    }

    if (!window.confirm('Estas seguro de eliminar este usuario?')) return;

    try {
      await deleteUserFunction({ uid });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      alert('Error al eliminar usuario. Verifica que las Cloud Functions esten desplegadas.');
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
        <div className="modal" onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="modal-content">
            <h3>Editar Usuario</h3>

            <FormSection label="Nombre" htmlFor="edit-name">
              <input
                id="edit-name"
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </FormSection>

            <FormSection label="Nombre de usuario" htmlFor="edit-username">
              <input
                id="edit-username"
                type="text"
                value={formData.username || ''}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </FormSection>

            <FormSection label="Correo electronico" htmlFor="edit-email">
              <input
                id="edit-email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </FormSection>

            <FormSection
              label="Contrasena actual"
              hint="Requerida solo si cambias la contrasena"
              htmlFor="edit-oldpw"
            >
              <input
                id="edit-oldpw"
                type="password"
                onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
              />
            </FormSection>

            <FormSection label="Nueva contrasena (opcional)" htmlFor="edit-newpw">
              <input
                id="edit-newpw"
                type="password"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </FormSection>

            <FormSection label="Foto de perfil" htmlFor="edit-photo">
              <input id="edit-photo" type="file" accept="image/*" onChange={handleFileChange} />
            </FormSection>

            {formData.photoURL && (
              <img
                src={formData.photoURL}
                alt="Vista previa"
                className="preview-image"
                loading="lazy"
              />
            )}

            <div className="modal-actions">
              <button className="btn-save" onClick={handleSaveEdit} disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
              <button className="btn-cancel" onClick={() => setModalOpen(false)} disabled={saving}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
