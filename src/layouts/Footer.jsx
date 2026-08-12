import React from 'react';
import './Footer.scss';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>CRECIBV, A.C.</h3>
          <p>Centro de Rehabilitacion y Educacion para Ciegos y Debiles Visuales</p>
        </div>

        <div className="footer-section">
          <h4>Contacto</h4>
          <p>Calle Alferez 611, Col. Real Providencia</p>
          <p>Leon, Guanajuato, Mexico</p>
          <p>Tel: +52 477 201 7851</p>
          <p>contacto@crecibv.com</p>
        </div>

        <div className="footer-section">
          <h4>Enlaces</h4>
          <nav aria-label="Navegacion del pie de pagina">
            <a href="#about-us">Nosotros</a>
            <a href="#services">Servicios</a>
            <a href="#contact">Contacto</a>
            <a href="/donaciones">Donaciones</a>
          </nav>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} CRECIBV, A.C. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
