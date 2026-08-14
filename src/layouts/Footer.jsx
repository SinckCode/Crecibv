import React from 'react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaTwitter,
  FaYoutube,
  FaTiktok,
  FaLinkedinIn,
  FaGlobe,
} from 'react-icons/fa';
import './Footer.scss';

const platformIcons = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  whatsapp: FaWhatsapp,
  twitter: FaTwitter,
  youtube: FaYoutube,
  tiktok: FaTiktok,
  linkedin: FaLinkedinIn,
};

const Footer = () => {
  const { settings } = useSiteSettings();
  const { orgInfo, socialMedia } = settings;

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>{orgInfo.shortName}</h3>
          <p>{orgInfo.description}</p>
          {socialMedia && socialMedia.length > 0 && (
            <div className="footer-social">
              {socialMedia.map((social, i) => {
                const Icon = platformIcons[social.platform] || FaGlobe;
                return (
                  <a
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label || social.platform}
                    className="footer-social__link"
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        <div className="footer-section">
          <h4>Contacto</h4>
          <p>{orgInfo.address.full}</p>
          <p>Tel: {orgInfo.phone}</p>
          <p>{orgInfo.email}</p>
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
        <p>
          &copy; {new Date().getFullYear()} {orgInfo.shortName} Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
