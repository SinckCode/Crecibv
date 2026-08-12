import React from 'react';
import { DEFAULT_PROFILE_IMAGE } from '../lib/constants';
import './UserCard.scss';

const UserCard = ({ user, onDelete, onEdit }) => {
  const imageURL =
    user.photoURL && user.photoURL.startsWith('http') ? user.photoURL : DEFAULT_PROFILE_IMAGE;

  const handleDeleteClick = () => {
    if (!user.uid) {
      console.error('❌ No se encontró el UID del usuario en Firebase Authentication.');
      return;
    }
    onDelete(user.uid); // 🔥 Ahora pasamos `user.uid` en lugar de `user.id`
  };

  return (
    <div className="user-card-game-style">
      <img src={imageURL} alt="User Avatar" className="avatar" loading="lazy" />
      <h3>{user.name}</h3>
      <p>{user.username || 'Sin username'}</p>
      <div className="actions">
        <button onClick={() => onEdit(user)}>Editar</button>
        <button onClick={handleDeleteClick} style={{ background: 'red' }}>
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default React.memo(UserCard);
