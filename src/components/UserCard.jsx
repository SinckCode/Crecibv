import React from 'react';
import './UserCard.scss';

const defaultProfileImage = "https://firebasestorage.googleapis.com/v0/b/crecibv.firebasestorage.app/o/profile-images%2F1735878729739-png-transparent-male-avatar-user-profile-profile-heroes-necktie-recruiter-thumbnail-(1).png?alt=media&token=351456e8-b08d-49f5-9e33-8f906409b931";

const UserCard = ({ user, onDelete, onEdit }) => {
  const imageURL = user.photoURL && user.photoURL.startsWith("http")
    ? user.photoURL
    : defaultProfileImage;

  const handleDeleteClick = () => {
    if (!user.uid) {
      console.error("❌ No se encontró el UID del usuario en Firebase Authentication.");
      return;
    }
    onDelete(user.uid); // 🔥 Ahora pasamos `user.uid` en lugar de `user.id`
  };

  return (
    <div className="user-card-game-style">
      <img src={imageURL} alt="User Avatar" className="avatar" />
      <h3>{user.name}</h3>
      <p>{user.username || "Sin username"}</p>
      <div className="actions">
        <button onClick={() => onEdit(user)}>Editar</button>
        <button onClick={handleDeleteClick} style={{ background: "red" }}>Eliminar</button>
      </div>
    </div>
  );
};

export default UserCard;
