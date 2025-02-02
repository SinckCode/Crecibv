import React, { useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import AdminHome from './AdminHome';
import Register from './Register';
import Messages from './Messages';
import ImageManager from './ImageManager'; // Ahora correctamente desde "pages"
import AdminCards from './AdminCards';
import './AdminPanel.scss';

const AdminPanel = ({ onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`admin-panel ${collapsed ? 'collapsed' : ''}`}>
      <aside className="sidebar">
        <button onClick={() => setCollapsed(!collapsed)} className="toggle-menu">
          {collapsed ? '➡' : '⬅'}
        </button>
        {!collapsed && (
          <div className="menu-content">
            <button onClick={onLogout} className="logout">
              Cerrar Sesión
            </button>
            <nav>
              <ul>
                <li><Link to="/admin/">Inicio</Link></li>
                <li><Link to="/admin/register">Registrar Datos</Link></li>
                <li><Link to="/admin/messages">Ver Mensajes</Link></li>
                <li><Link to="/admin/images">Administrar Imágenes</Link></li> {/* Nueva opción */}
                <li><Link to="/admin/cards">Administrar Tarjetas</Link></li>
              </ul>
            </nav>
          </div>
        )}
      </aside>
      <main className="content">
        <Routes>
          <Route path="/" element={<AdminHome />} />
          <Route path="register" element={<Register />} />
          <Route path="messages" element={<Messages />} />
          <Route path="images" element={<ImageManager />} /> {/* Nueva ruta */}
            <Route path="cards" element={<AdminCards />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminPanel;
