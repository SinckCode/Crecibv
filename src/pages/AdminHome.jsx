import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, getCountFromServer } from 'firebase/firestore';
import { auth, db } from '../firebase';
import StatCard from '../components/admin/StatCard';
import { FaEnvelope, FaTh, FaUsers, FaImages } from 'react-icons/fa';
import '../components/admin/AdminComponents.scss';
import './AdminHome.scss';

const AdminHome = () => {
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({ messages: 0, cards: 0, users: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!auth.currentUser) {
          throw new Error('No hay usuario autenticado.');
        }

        // Fetch user data
        const userRef = collection(db, 'users');
        const q = query(userRef, where('uid', '==', auth.currentUser.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setUserData(querySnapshot.docs[0].data());
        }

        // Fetch stats in parallel
        const [messagesSnap, cardsSnap, usersSnap] = await Promise.all([
          getCountFromServer(collection(db, 'messages')),
          getCountFromServer(collection(db, 'cards')),
          getCountFromServer(collection(db, 'users')),
        ]);

        setStats({
          messages: messagesSnap.data().count,
          cards: cardsSnap.data().count,
          users: usersSnap.data().count,
        });
      } catch (err) {
        console.error(err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="admin-home__loading">Cargando...</p>;
  if (error) return <p className="admin-home__error">Error: {error}</p>;

  return (
    <div className="admin-home">
      <div className="admin-home__welcome">
        {userData?.photoURL && (
          <img
            src={userData.photoURL}
            alt="Foto de perfil"
            className="admin-home__avatar"
            loading="lazy"
          />
        )}
        <div>
          <h1 className="admin-home__title">Bienvenido, {userData?.name || 'Usuario'}</h1>
          <p className="admin-home__role">{userData?.email}</p>
        </div>
      </div>

      <div className="admin-home__stats">
        <StatCard
          icon={<FaEnvelope />}
          label="Mensajes"
          value={stats.messages}
          onClick={() => navigate('/admin/messages')}
        />
        <StatCard
          icon={<FaTh />}
          label="Servicios"
          value={stats.cards}
          onClick={() => navigate('/admin/cards')}
        />
        <StatCard
          icon={<FaUsers />}
          label="Usuarios"
          value={stats.users}
          onClick={() => navigate('/admin/users')}
        />
        <StatCard
          icon={<FaImages />}
          label="Imagenes"
          value="-"
          onClick={() => navigate('/admin/images')}
        />
      </div>

      <div className="admin-home__actions">
        <h2>Acciones Rapidas</h2>
        <div className="admin-home__action-grid">
          <button onClick={() => navigate('/admin/edit-hero')}>Editar Pagina Principal</button>
          <button onClick={() => navigate('/admin/messages')}>Ver Mensajes</button>
          <button onClick={() => navigate('/admin/cards')}>Administrar Servicios</button>
          <button onClick={() => navigate('/admin/edit-contact')}>Editar Contacto</button>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
