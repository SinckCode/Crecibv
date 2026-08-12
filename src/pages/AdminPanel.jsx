import React, { lazy, Suspense, useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import './AdminPanel.scss';

const AdminHome = lazy(() => import('./AdminHome'));
const Register = lazy(() => import('./Register'));
const Messages = lazy(() => import('./Messages'));
const ImageManager = lazy(() => import('./ImageManager'));
const AdminCards = lazy(() => import('./AdminCards'));
const Users = lazy(() => import('./Users'));
const EditAboutUs = lazy(() => import('./EditAboutUs'));

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
                <li>
                  <Link to="/admin/">Inicio</Link>
                </li>
                <li>
                  <Link to="/admin/register">Registrar Usuarios</Link>
                </li>
                <li>
                  <Link to="/admin/users">Administrar Usuarios</Link>
                </li>
                <li>
                  <Link to="/admin/messages">Ver Mensajes</Link>
                </li>
                <li>
                  <Link to="/admin/images">Administrar Imágenes</Link>
                </li>
                <li>
                  <Link to="/admin/cards">Administrar Tarjetas</Link>
                </li>
                <li>
                  <Link to="/admin/edit-about">Editar Acerca de Nosotros</Link>
                </li>{' '}
                {/* 🆕 Nueva opción en el menú */}
              </ul>
            </nav>
          </div>
        )}
      </aside>
      <main className="content">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<AdminHome />} />
            <Route path="register" element={<Register />} />
            <Route path="messages" element={<Messages />} />
            <Route path="images" element={<ImageManager />} />
            <Route path="cards" element={<AdminCards />} />
            <Route path="users" element={<Users />} />
            <Route path="edit-about" element={<EditAboutUs />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

export default AdminPanel;
