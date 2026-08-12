import React, { useState, useEffect } from 'react';
import './Header.scss';
import logo from '../assets/logoT.png';
import { FaBars, FaTimes } from 'react-icons/fa'; // Íconos del menú
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`header ${isScrolled ? 'banner' : 'initial'}`}>
        {!isScrolled ? (
          <div className="navbar">
            <div className="logo">
              <img src={logo} alt="Logo de CRECIBV A.C." />
              <h1>CRECIBV, A.C.</h1>
            </div>
            <nav aria-label="Navegacion principal">
              <a href="#">Inicio</a>
              <a href="#about-us">Nosotros</a>
              <a href="#services">Servicios</a>
              <a href="#contact">Contacto</a>
              <a href="#location">Ubicacion</a>
            </nav>
          </div>
        ) : (
          <div className="donation-banner">
            <div className="donation-content">
              <img src={logo} alt="Logo de CRECIBV A.C." />
              <p>¡Dona Hoy! Apoya a mejorar la calidad de vida de muchas personas.</p>
              <button className="cta-button" onClick={() => navigate('/donaciones')}>
                APOYAR
              </button>
            </div>
          </div>
        )}
      </header>

      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? 'Cerrar menu' : 'Abrir menu'}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <nav className={`mobile-menu ${menuOpen ? 'open' : 'closed'}`} aria-label="Navegacion movil">
        <a href="#" onClick={() => setMenuOpen(false)}>
          Inicio
        </a>
        <a href="#about-us" onClick={() => setMenuOpen(false)}>
          Nosotros
        </a>
        <a href="#services" onClick={() => setMenuOpen(false)}>
          Servicios
        </a>
        <a href="#contact" onClick={() => setMenuOpen(false)}>
          Contacto
        </a>
        <a href="#location" onClick={() => setMenuOpen(false)}>
          Ubicacion
        </a>
      </nav>
    </>
  );
};

export default Header;
