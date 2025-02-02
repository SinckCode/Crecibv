import React, { useState, useEffect } from 'react';
import './Header.scss';
import logo from '../assets/logoT.png'; // Asegúrate de colocar el logo en esta ruta o ajusta según corresponda

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'banner' : 'initial'}`}>
      {!isScrolled ? (
        <div className="navbar">
          <div className="logo">
            <img src={logo} alt="Crecibv Logo" />
            <h1>CRECIBV, A.C.</h1>
          </div>
          <nav>
            <a href="#home">Inicio</a>
            <a href="#about">Nosotros</a>
            <a href="#services">Servicios</a>
            <a href="#contact">Contacto</a>
            <a href="#contact">Ubicación</a>
          </nav>
        </div>
      ) : (
        <div className="donation-banner">
          <div className="donation-content">
            <img src={logo} alt="Crecibv Logo" />
            <p>
              ¡Dona Hoy! Apoya a mejorar la calidad de vida de muchas personas.
            </p>
            <button className="cta-button">APOYAR</button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
