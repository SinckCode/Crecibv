import React, { lazy, Suspense, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthProvider';
import './AdminPanel.scss';

const AdminHome = lazy(() => import('./AdminHome'));
const Register = lazy(() => import('./Register'));
const Messages = lazy(() => import('./Messages'));
const ImageManager = lazy(() => import('./ImageManager'));
const AdminCards = lazy(() => import('./AdminCards'));
const Users = lazy(() => import('./Users'));
const EditAboutUs = lazy(() => import('./EditAboutUs'));
const EditHero = lazy(() => import('./admin/EditHero'));
const EditDonations = lazy(() => import('./admin/EditDonations'));
const EditContact = lazy(() => import('./admin/EditContact'));
const EditSettings = lazy(() => import('./admin/EditSettings'));
const EditSocialMedia = lazy(() => import('./admin/EditSocialMedia'));

const AdminPanel = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className={`admin-panel ${collapsed ? 'collapsed' : ''}`}>
      <AdminSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        onLogout={handleLogout}
      />
      <main className="admin-panel__content">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<AdminHome />} />
            <Route path="register" element={<Register />} />
            <Route path="messages" element={<Messages />} />
            <Route path="images" element={<ImageManager />} />
            <Route path="cards" element={<AdminCards />} />
            <Route path="users" element={<Users />} />
            <Route path="edit-about" element={<EditAboutUs />} />
            <Route path="edit-hero" element={<EditHero />} />
            <Route path="edit-donations" element={<EditDonations />} />
            <Route path="edit-contact" element={<EditContact />} />
            <Route path="settings" element={<EditSettings />} />
            <Route path="social-media" element={<EditSocialMedia />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

export default AdminPanel;
