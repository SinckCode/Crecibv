import React, { useState, useEffect } from 'react';
import './Header.scss';
import logo from '../assets/logoT.png';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useSiteSettings } from '../hooks/useSiteSettings';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { settings } = useSiteSettings();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`header ${isScrolled ? 'banner' : 'initial'}`}>
        {!isScrolled ? (
          <div className="navbar">
            <a href="/" className="logo">
              <img src={logo} alt="Logo de CRECIBV A.C." />
              <h1>{settings.orgInfo.shortName}</h1>
            </a>
            <nav aria-label="Navegacion principal">
              <a href="/">Inicio</a>
              <a href="#about-us">Nosotros</a>
              <a href="#services">Servicios</a>
              <a href="#contact">Contacto</a>
              <a href="#location">Ubicacion</a>
            </nav>
          </div>
        ) : (
          <div className="donation-banner">
            <div className="donation-content">
              <a href="/" className="banner-logo">
                <img src={logo} alt="Logo de CRECIBV A.C." />
              </a>
              <p>{settings.donationBanner.text}</p>
              <button className="cta-button" onClick={() => navigate('/donaciones')}>
                {settings.donationBanner.ctaText}
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
        <a href="/" onClick={() => setMenuOpen(false)}>
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
