import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthProvider';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import AdminCards from './pages/AdminCards';
import Users from './pages/Users';
import HomePage from './pages/HomePage';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import BackToTop from './components/BackToTop';
import Home from './pages/Home';
import DonacionesPage from './pages/DonacionesPage';
import ErrorBoundary from './components/ErrorBoundary';

const ProtectedRoute = ({ children }) => {
  const { currentUser, isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!currentUser || !isAdmin) return <Navigate to="/login" />;
  return children;
};

const AppContent = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header />
              <main>
                <Home />
                <HomePage />
              </main>
              <BackToTop />
              <Footer />
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/donaciones" element={<DonacionesPage />} />

        {/* 🔥 Rutas protegidas de admin */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        >
          <Route path="cards" element={<AdminCards />} />
          <Route path="users" element={<Users />} /> {/* ✅ Nueva ruta protegida */}
        </Route>
      </Routes>
    </Router>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
