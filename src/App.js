import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import AdminCards from './pages/AdminCards';  // 📌 Nueva página
import HomePage from './pages/HomePage';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import BackToTop from './components/BackToTop';
import Home from './pages/Home';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // true si hay usuario, false si no
    });
    return () => unsubscribe(); // Limpia el listener
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<><Header /><main><Home /><HomePage /></main><BackToTop /><Footer /></>} />
        <Route path="/login" element={<Login />} />

        {/* 🔥 Rutas protegidas de admin */}
        <Route path="/admin/*" element={isAuthenticated ? <AdminPanel /> : <Navigate to="/login" />} >
          <Route path="cards" element={<AdminCards />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
