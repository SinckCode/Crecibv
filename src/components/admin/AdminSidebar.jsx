import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaHome,
  FaEdit,
  FaInfoCircle,
  FaTh,
  FaHeart,
  FaMapMarkerAlt,
  FaImages,
  FaEnvelope,
  FaUsers,
  FaUserPlus,
  FaCog,
  FaShareAlt,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import './AdminSidebar.scss';

const navGroups = [
  {
    title: 'Panel',
    items: [{ to: '/admin/', icon: <FaHome />, label: 'Inicio', end: true }],
  },
  {
    title: 'Contenido del Sitio',
    items: [
      { to: '/admin/edit-hero', icon: <FaEdit />, label: 'Pagina Principal' },
      { to: '/admin/edit-about', icon: <FaInfoCircle />, label: 'Sobre Nosotros' },
      { to: '/admin/cards', icon: <FaTh />, label: 'Servicios' },
      { to: '/admin/edit-donations', icon: <FaHeart />, label: 'Donaciones' },
      { to: '/admin/edit-contact', icon: <FaMapMarkerAlt />, label: 'Contacto y Ubicacion' },
    ],
  },
  {
    title: 'Medios',
    items: [{ to: '/admin/images', icon: <FaImages />, label: 'Galeria de Imagenes' }],
  },
  {
    title: 'Comunicacion',
    items: [{ to: '/admin/messages', icon: <FaEnvelope />, label: 'Mensajes' }],
  },
  {
    title: 'Usuarios',
    items: [
      { to: '/admin/users', icon: <FaUsers />, label: 'Administrar Usuarios' },
      { to: '/admin/register', icon: <FaUserPlus />, label: 'Registrar Usuario' },
    ],
  },
  {
    title: 'Configuracion',
    items: [
      { to: '/admin/settings', icon: <FaCog />, label: 'Informacion General' },
      { to: '/admin/social-media', icon: <FaShareAlt />, label: 'Redes Sociales' },
    ],
  },
];

const AdminSidebar = ({ collapsed, onToggle, onLogout }) => {
  return (
    <aside className={`admin-sidebar ${collapsed ? 'admin-sidebar--collapsed' : ''}`}>
      <div className="admin-sidebar__header">
        <button
          className="admin-sidebar__toggle"
          onClick={onToggle}
          aria-label={collapsed ? 'Expandir menu' : 'Colapsar menu'}
        >
          {collapsed ? <FaBars /> : <FaTimes />}
        </button>
        {!collapsed && <span className="admin-sidebar__brand">CRECIBV</span>}
      </div>

      {!collapsed && (
        <nav className="admin-sidebar__nav">
          {navGroups.map((group) => (
            <div key={group.title} className="admin-sidebar__group">
              <span className="admin-sidebar__group-title">{group.title}</span>
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`
                  }
                >
                  <span className="admin-sidebar__link-icon">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      )}

      {!collapsed && (
        <button className="admin-sidebar__logout" onClick={onLogout}>
          <FaSignOutAlt />
          <span>Cerrar Sesion</span>
        </button>
      )}
    </aside>
  );
};

export default AdminSidebar;
