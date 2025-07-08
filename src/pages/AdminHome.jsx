import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import "./AdminHome.scss"; // Importa los estilos mejorados

const AdminHome = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (auth.currentUser) {
          const userRef = collection(db, "users");
          const q = query(userRef, where("uid", "==", auth.currentUser.uid));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const user = querySnapshot.docs[0].data();
            setUserData(user);
          } else {
            throw new Error("Usuario no encontrado en Firestore. Verifica el UID en la base de datos.");
          }
        } else {
          throw new Error("No hay usuario autenticado.");
        }
      } catch (err) {
        console.error(err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <h2 className="loading-text">Cargando usuario...</h2>;
  if (error) return <h2 className="error-text">Error: {error}</h2>;

  return (
    <div className="admin-container">
      <div className="admin-card">
        <img src={userData?.photoURL} alt="Foto de perfil" className="profile-image" />
        <h1 className="admin-welcome">¡Bienvenido, {userData?.name}!</h1>
        <p className="admin-email">Correo: {userData?.email}</p>
        <button className="admin-logout">Cerrar Sesión</button>
      </div>
    </div>
  );
};

export default AdminHome;
