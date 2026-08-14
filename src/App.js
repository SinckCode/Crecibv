import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthProvider';
import { SiteSettingsProvider } from './context/SiteSettingsProvider';
import HomePage from './pages/HomePage';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import BackToTop from './components/BackToTop';
import Home from './pages/Home';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';

const Login = lazy(() => import('./pages/Login'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const DonacionesPage = lazy(() => import('./pages/DonacionesPage'));

const ProtectedRoute = ({ children }) => {
  const { currentUser, isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!currentUser || !isAdmin) return <Navigate to="/login" />;
  return children;
};

const AppContent = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
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

          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SiteSettingsProvider>
          <AppContent />
        </SiteSettingsProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
