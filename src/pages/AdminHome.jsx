import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import defaultProfileImage from '../assets/umagenLogin.png'; // Imagen local predeterminada
import './AdminHome.scss';

const AdminHome = () => {
  const [user, setUser] = useState(null);
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    // Obtener el usuario actual
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
    }

    // Obtener el número de mensajes
    const fetchMessages = async () => {
      const messagesSnapshot = await getDocs(collection(db, 'messages'));
      setMessageCount(messagesSnapshot.size);
    };

    fetchMessages();
  }, []);

  return (
    <div className="admin-home">
      <div className="welcome">
        {user && (
          <>
            <img
              src={user.photoURL || defaultProfileImage}
              alt="Foto de perfil"
              className="profile-pic"
            />
            <h1>¡Bienvenido, {user.displayName || user.email}!</h1>
          </>
        )}
      </div>

      <div className="stats">
        <h2>Resumen del Panel</h2>
        <p><strong>Mensajes Recibidos:</strong> {messageCount}</p>
      </div>
    </div>
  );
};

export default AdminHome;
